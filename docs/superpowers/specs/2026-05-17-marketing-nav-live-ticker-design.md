# Marketing Nav — Live Index Strip Redesign

**Date:** 2026-05-17
**Status:** Approved design; ready for implementation plan.
**Scope:** `src/components/shared/marketing-nav.tsx` only. Buyer/seller/admin navs are out of scope.

---

## Problem

The current marketing nav (Phase 14, the floating-pill on scroll) reads as competent SaaS but doesn't carry the brand. It looks generic — interchangeable with any B2B platform. The screenshot the user shared shows a clean horizontal layout: logo + chip + 4 links + 2 CTAs. Functional, but nothing about it says "live B2B scrap exchange."

## Direction

**Live Index Strip** — a Bloomberg/NYSE-style dark ticker strip pinned above the existing nav, carrying real-time marketplace stats. Communicates "this is a live exchange" in the first 100ms of page load. The existing pill-on-scroll behavior is preserved.

## Visual

### Desktop — top of page

Two stacked rows:

1. **Dark ticker strip** (full-width, edge-to-edge, ink `#0A0A0A` bg):
   - Left: 4 tokens separated by middots, all `JetBrains Mono` uppercase 10–11px tracked `0.13em`, color `rgba(255,255,255,0.78)`:
     - `● LIVE` — pulsing mint dot + label
     - `12 LISTINGS · +3 TODAY` — count and today delta (delta in mint `#34D399`)
     - `METAL ▲ · E-WASTE ▲` — up to 2 trending categories with mint up-arrow
     - `LAST BID 4M AGO` — relative time of latest bid or transaction (whichever is newer)
   - Right: `B2B.SCRAPKART.APP` in mono, muted

2. **Logo + nav row** (paper bg, edge-to-edge, transparent):
   - Same logo + B2B chip + 4 nav links + Sign in + Post a listing as today.
   - One addition: nav link with current activity gets a small mono chip beside it, e.g. `Marketplace +3` (mint text on `--forest-tint` bg). Optional — only renders when delta > 0.

### Desktop — scrolled (8px+)

- Dark ticker strip **hides** entirely (slides up out of view, 300ms ease-out).
- Logo + nav row converts to the existing floating frosted pill — unchanged from current behavior.
- One addition inside the pill, left of the CTA: `● 12 LIVE` mini-chip in mono. Keeps the "live" signal without re-stacking the strip.

### Mobile — top of page

- Dark ticker strip compressed to 3 short tokens: `● LIVE · 12 LISTINGS · 4M AGO`. Trending categories and the right-aligned domain string are dropped.
- Logo row: logo + hamburger. No nav links visible (existing pattern).

### Mobile — menu open

- Ticker strip remains visible at the top.
- Hamburger icon morphs to X (existing pattern).
- Menu items render in a column. Items with activity get the inline mono chip on the right (`+3 TODAY`).
- Active item gets `--forest-tint` bg + forest text (existing pattern).

## Data

Four stats, all read from existing Supabase tables. No schema changes, no RLS changes.

| Field | Source | Query |
|---|---|---|
| `listingsLive` | `scraps` | `count(*) where status='live'` |
| `listingsToday` | `scraps` | `count(*) where created_at >= today_start_IST and status='live'` |
| `lastActivityAt` | `listing_bids` + `transactions` | `greatest(max(listing_bids.created_at), max(transactions.created_at))` — ISO timestamp; UI formats as relative time ("4m ago"). Bids are far more frequent than transactions, so this keeps the ticker fresh. |
| `trendingCategories` | `scraps` | `category, count(*) where created_at >= now() - interval '24 hours' and status='live' group by category order by count desc limit 2` |

`today_start_IST` is midnight in `Asia/Kolkata` converted to UTC for the SQL filter.

### Refresh strategy

- **Initial render:** server-side fetch in `src/lib/queries/live-stats.ts`. Values arrive fresh on first paint — no flash of zeros.
- **Client refresh:** `useEffect` with `setInterval` re-fetching `/api/live-stats` (a new Route Handler) every **30 seconds**. Cleared on unmount and on `document.visibilitychange` to hidden.
- **Why not Realtime subscriptions:** aggregates over the whole table aren't a natural fit for per-row Supabase Realtime. A 30s poll is the right granularity for a marketing nav and is far simpler.

### Reduced-motion

- Pulse animation on the live dot disabled via `@media (prefers-reduced-motion: reduce)` — dot stays solid mint.
- 30s polling continues regardless of motion preferences (data freshness is not motion).

## Components

```
src/
  components/shared/
    marketing-nav.tsx              ← extended (existing file)
    live-ticker-strip.tsx          ← new: the dark top strip (desktop + mobile variants)
  lib/queries/
    live-stats.ts                  ← new: server-side fetch fn
  app/api/
    live-stats/route.ts            ← new: GET handler, returns JSON
  types/
    index.ts                       ← add `LiveStats` type
```

### `LiveStats` type

```ts
type LiveStats = {
  listingsLive: number;
  listingsToday: number;
  lastActivityAt: string | null;  // ISO timestamp; null if marketplace is brand new
  trendingCategories: Array<{ category: string; count: number }>;
};
```

### `LiveTickerStrip` component

- Accepts `initialStats: LiveStats` (from SSR).
- Owns the `setInterval` poll → updates internal state.
- Renders both desktop and mobile token sets in the same DOM; uses Tailwind responsive utilities (`hidden md:flex`, `flex md:hidden`) to swap between them. No JS-based media query — avoids hydration mismatch and FOUC entirely.
- Pulse animation = pure CSS keyframes, no JS.

### `MarketingNav` changes

- Render `<LiveTickerStrip initialStats={stats} />` directly above the existing `<header>`.
- On scrolled state (`scrolled === true`), the ticker strip gets `aria-hidden` + a CSS class that animates `translateY(-100%)` over 300ms.
- Add the `● 12 LIVE` mini-chip inside the floating pill, left of the CTA group. Renders only when `scrolled === true`.
- Add the optional `+N TODAY` chip beside the Marketplace nav link when `listingsToday > 0`.

## Edge cases

- **Empty marketplace** — `listingsLive === 0` → render `● LIVE · 0 LISTINGS · NEW MARKET` (last token replaces "last activity" when `lastActivityAt === null`).
- **No activity yet** — drop the "last bid" token; show "NEW MARKET" instead.
- **No trending categories** — drop that token entirely; ticker collapses to remaining tokens.
- **API fetch fails** — silent failure; keep last-known values. Don't show error UI in the nav.
- **30s poll on hidden tab** — pause via `visibilitychange` listener to save bandwidth.

## Animation budget

- Pulse dot: 2s `opacity 1 → 0.4 → 1` CSS infinite, reduced-motion safe.
- Ticker hide-on-scroll: 300ms `cubic-bezier(0.4, 0, 0.2, 1)` `translateY`.
- Activity chip enter/update: no animation in V1. Text updates in place when the 30s poll lands.

## Out of scope

- Realtime subscriptions (use polling).
- Buyer/seller/admin navs.
- Internationalization of the time-ago string (English only for V1).
- Animated "ticker tape" horizontal scroll across the strip. Stats are static text per refresh.

## Acceptance

- Top state shows the dark ticker strip with all four stats on desktop, three on mobile.
- Scrolled state hides the strip, shows the floating pill with the `● N LIVE` mini-chip.
- Mobile menu open state keeps the strip and shows activity chips inline.
- Stats refresh every 30s with no visible flicker (just text content changes).
- Reduced-motion users see no pulse animation.
- `npm run build` passes with no new TS errors or lint warnings.
