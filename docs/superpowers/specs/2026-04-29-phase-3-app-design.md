# Phase 3 — Authenticated App (Refined Premium)

**Date:** 2026-04-29
**Branch:** `feat/ui-overhaul` (continues; no push)
**Scope:** ~60 files across `src/app/(buyer)/`, `src/app/(seller)/`, `src/app/admin/`, `src/app/onboarding/`, plus shared in-app components.

---

## Goal

Translate the in-app dark-theme surfaces (currently rendered with literal hex `#10B981`, `#0A0A0A`, `#141414`, etc.) to Refined Premium light + warm + deep forest. Backend untouched. All Supabase queries, RLS, auth middleware, realtime chat — preserved.

This is intentionally a **systematic translation**, not a redesign. The page structures, component hierarchies, JSX shapes, and information architecture stay the same. Only the visual language changes.

---

## Translation dictionary

Every value below is a global find/replace pattern. Apply in this order so longer strings match first.

### Background colors

| Old | New |
|---|---|
| `bg-[#0A0A0A]/95` | `bg-[var(--paper)]/85` |
| `bg-[#0A0A0A]/80` | `bg-[var(--paper)]/85` |
| `bg-[#0A0A0A]` | `bg-[var(--paper)]` |
| `bg-[#141414]` | `bg-[var(--paper)]` (most cards) — judgment: when nested inside another card, use `bg-[var(--paper-2)]` |
| `bg-[#1A1A1A]` | `bg-[var(--paper-2)]` |
| `bg-[#262626]` | `bg-[var(--paper-3)]` |
| `bg-[#10B981]/10` | `bg-[var(--forest-tint)]` |
| `bg-[#10B981]/15` | `bg-[var(--forest-tint)]` |
| `bg-[#10B981]/20` | `bg-[var(--forest)]/15` |
| `bg-[#10B981]/[0.06]` | `bg-[var(--forest-tint)]` |
| `bg-[#10B981]` | `bg-[var(--forest)]` |
| `bg-[#059669]` | `bg-[var(--forest-2)]` |
| `bg-black` (hover/active) | `bg-[var(--ink)]` |

### Text colors

| Old | New |
|---|---|
| `text-[#10B981]` | `text-[var(--forest)]` |
| `text-[#34D399]` | `text-[var(--forest)]` (or `forest-2` for hover) |
| `text-[#F5F5F5]` | `text-[var(--ink)]` |
| `text-[#E5E5E5]` | `text-[var(--ink)]` |
| `text-[#D4D4D4]` | `text-[var(--ink-2)]` |
| `text-[#A3A3A3]` | `text-[var(--ink-3)]` |
| `text-[#737373]` | `text-[var(--ink-3)]` |
| `text-[#525252]` | `text-[var(--ink-4)]` |
| `text-white` (inside form/card body) | `text-[var(--ink)]` |
| `text-white/80` | `text-[var(--ink-2)]` |
| `text-white/60` | `text-[var(--ink-2)]` |
| `text-white/40` | `text-[var(--ink-3)]` |
| `text-white/30` | `text-[var(--ink-3)]` |
| `text-white/25` | `text-[var(--ink-4)]` |
| `text-black` on `bg-[var(--forest)]` | `text-white` (forest is dark; white reads better) |
| `placeholder:text-white/25` | `placeholder:text-[var(--ink-4)]` |

### Border colors

| Old | New |
|---|---|
| `border-[#262626]` | `border-[var(--line)]` |
| `border-[#1A1A1A]` | `border-[var(--line-2)]` |
| `border-[#333333]` | `border-[var(--line)]` |
| `border-[#10B981]/20` | `border-[var(--forest)]/20` |
| `border-[#10B981]/30` | `border-[var(--forest)]/30` |
| `border-[#10B981]/50` | `border-[var(--forest)]` |
| `border-white/10`, `border-white/20` | `border-[var(--line)]` |
| `divide-[#262626]` | `divide-[var(--line-2)]` |

### Status colors (text + bg)

| Old | New |
|---|---|
| `text-red-400`, `text-red-500` | `text-[var(--danger)]` |
| `bg-red-400/10`, `bg-red-500/10` | `bg-[var(--danger)]/10` |
| `border-red-400/20`, `border-red-500/30` | `border-[var(--danger)]/30` |
| `text-yellow-400`, `text-amber-400` | `text-[var(--warning)]` |
| `bg-yellow-400/10`, `bg-amber-500/10` | `bg-[var(--warning)]/10` |
| `border-yellow-400/20`, `border-amber-500/30` | `border-[var(--warning)]/30` |
| `text-blue-400` (info) | `text-[var(--info)]` |
| `bg-blue-500/10` | `bg-[var(--info)]/10` |

### Category color blocks (scrap-card)

The dark-theme scrap-card uses per-category color (Metal blue, E-waste purple, Plastic yellow, Paper green, Glass cyan, Mixed gray). In Refined Premium, **collapse all categories to one accent system** — `forest-tint` background + `forest` text — for two reasons: (1) keeps the system disciplined (one accent), (2) categories are still distinguishable via their lucide icon and text label. This is a deliberate downgrade in chromatic differentiation in service of restraint.

```ts
// Before:
const categoryConfig = {
  Metal: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400" },
  // ...
};
// After:
const categoryConfig = {
  Metal:        { bg: "bg-[var(--forest-tint)]", text: "text-[var(--forest)]", dot: "bg-[var(--forest)]" },
  "E-waste":    { bg: "bg-[var(--forest-tint)]", text: "text-[var(--forest)]", dot: "bg-[var(--forest)]" },
  // ...all six identical
};
```
Or simpler: replace the lookup with a single object spread on every card.

### Radius

Old uses `rounded-xl` (`12px`) and `rounded-2xl` (`16px`) somewhat interchangeably. New mapping:

| Old | New |
|---|---|
| `rounded-2xl` (cards, modals) | `rounded-[var(--radius-lg)]` (12px) |
| `rounded-xl` (cards) | `rounded-[var(--radius-lg)]` |
| `rounded-xl` (buttons/inputs) | `rounded-[var(--radius-md)]` (8px) |
| `rounded-lg` (chips, small) | `rounded-[var(--radius-sm)]` (6px) |
| `rounded-md` | `rounded-[var(--radius-sm)]` |

Apply judgment: a stat card stays at `lg`, a button stays at `md`, a chip drops to `sm` or `xs`.

### Shadows

| Old | New |
|---|---|
| `shadow-2xl` | `shadow-[var(--shadow-3)]` (modals only) |
| `shadow-xl` | `shadow-[var(--shadow-2)]` |
| `shadow-lg` | `shadow-[var(--shadow-1)]` (most cards) |
| `shadow-md`, `shadow` | `shadow-[var(--shadow-1)]` |
| `shadow-[0_0_30px_-5px_rgba(16,185,129,0.08)]` (forest glow) | Drop entirely. Refined Premium does NOT do colored glows. |
| `backdrop-blur-md` | Keep only on the sticky nav bar. Drop elsewhere. |

### Typography

| Old | New |
|---|---|
| `font-bold text-2xl tracking-tight` (page titles) | `text-[28px] font-semibold tracking-[-0.025em]` |
| `font-bold text-3xl tracking-tight` | `text-[clamp(28px,3.6vw,40px)] font-semibold tracking-[-0.025em]` |
| `font-semibold text-base text-[#F5F5F5]` (card titles) | `text-[15.5px] font-semibold tracking-[-0.015em] text-[var(--ink)]` |
| `font-bold text-xl text-[#10B981]` (price emphasis) | `text-[20px] font-semibold tabular-nums text-[var(--ink)]` (forest reserved for accent ink) |
| `text-xs uppercase tracking-wider` (mono labels) | `font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)] font-medium` |

### Gradient overlays

```
bg-gradient-to-t from-[#141414] via-transparent to-transparent
```
Becomes:
```
bg-gradient-to-t from-[var(--paper)] via-transparent to-transparent
```
But also reduce opacity (`opacity-60` → `opacity-30`) — gradient overlays on photos are subtler in light theme.

### Animation classes

`animate-fade-in` (defined in old globals) — keep, it still works. Or replace usage with `<Reveal>` from Phase 1 for consistency.

---

## What stays unchanged

- Page file *names* and *paths*
- All data fetching logic (`createClient`, queries, RLS-respecting)
- All event handlers, form logic, mutations
- All imports of `@/types` types and Supabase client
- All loading states (`loading.tsx`) — translate them visually but keep the file structure
- Realtime subscription wiring in chat pages
- Image upload / storage bucket logic

---

## Phase 3 task groups

| # | Group | Files |
|---|---|---|
| 1 | In-app chrome | `(buyer)/layout.tsx`, `(seller)/layout.tsx`, `admin/layout.tsx`, `onboarding/layout.tsx`, `buyer-nav.tsx`, `seller-nav.tsx` |
| 2 | Shared cards & list components | `scrap-card.tsx`, `company-card.tsx`, `booking-card.tsx`, `image-upload.tsx`, `image-gallery.tsx`, `motion.tsx` |
| 3 | Chat components | `chat-interface.tsx`, `chat-input.tsx`, `message-bubble.tsx` |
| 4 | Buyer-specific components | `marketplace-filters.tsx`, `scrap-grid.tsx`, `book-scrap-dialog.tsx`, `submit-bid-dialog.tsx` |
| 5 | Seller-specific component | `listing-bids.tsx` |
| 6 | Buyer pages | marketplace (+ [id]), companies (+ [id]), bookings (+ [id], chat), profile, all 3 loading.tsx (~10 files) |
| 7 | Seller pages | dashboard, scraps (+ new, [id]/edit), company (+ setup, edit), seller-bookings (+ [id], chat), all 3 loading.tsx (~13 files) |
| 8 | Admin pages | admin/, users, listings, transactions, contact, blog (+ new, [id]/edit), recyclers, companies, bids, bookings, plus 4 action button components, plus 2 loading.tsx (~17 files) |
| 9 | Onboarding pages | producer, recycler (2 pages) |
| 10 | Final verification | typecheck, lint, build, runtime smoke on representative routes |

After this phase, the backwards-compat shim in `globals.css` (the `--green`, `--green-deep`, `--cat-*`, `--shadow-hard*`, `--press-in`, etc.) can be removed in a follow-up cleanup task — those tokens were only used by the brutalist work and can be dropped once the in-app surfaces stop referencing them. Detect with grep before removing.

---

## Acceptance

- All in-app routes render in light + warm + deep forest with no dark-theme literals (`#10B981`, `#0A0A0A`, `#141414`, `#262626`, `#A3A3A3`, etc.)
- All Supabase data fetching unchanged (verify by smoke-testing routes that exercise queries)
- `npm run typecheck` zero errors
- `npm run build` green
- `npm run lint` no new errors in any Phase 3 file (pre-existing PWA noise unaffected)
- Realtime chat still works (manual test only — agent can't verify)
- No `git push`

— *End of Phase 3 spec.*
