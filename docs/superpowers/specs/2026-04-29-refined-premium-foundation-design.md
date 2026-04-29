# ScrapKart UI Overhaul — Refined Premium Foundation (Design Spec)

**Date:** 2026-04-29
**Author:** Developer (vibe-coded with Claude)
**Status:** Awaiting user review
**Supersedes:** `docs/superpowers/specs/2026-04-28-ui-overhaul-design.md` (D-Evolved Neo-Brutalist direction — rejected by founder on 2026-04-29)
**Branch:** `feat/ui-overhaul` (continues here; ~33 brutalist commits will be reverted/replaced as the spec is implemented — master is untouched)

---

## 0 — Why this spec exists

The previous spec committed the platform to a "Neo-Brutalist B2B Sibling" of the B2C site. Thirty-three commits later — token swap, primitive rewrites, landing redesign, blog redesign, contact redesign, 404 redesign — the founder reviewed the result on 2026-04-29 and rejected the direction. Per the founder's reasoning (preserved in memory `project_b2b_visual_direction.md`):

> *"B2B should look professional and should NOT look like a sibling of the B2C site at b2c.scrapkart.app. B2C's neo-brutalist sticker/zine aesthetic was deliberately designed for Gen-Z individual sellers — that aesthetic does not carry over to the B2B platform's audience (industrial yards, recyclers, waste-producing businesses, investors at pitch events)."*

The B2B platform serves enterprise procurement leads, scrap-yard operators, and corporate sustainability teams. Visual personality must signal **trust, restraint, and operational seriousness** — not zine/poster energy.

The replacement direction has been brainstormed and visually validated:

**Direction: C · Refined Premium — Stripe / Linear restraint, deep forest accent — with Recykal-inspired motion and Framer-tier scroll smoothness, applied across landing, auth, and the entire authenticated app.**

This spec is **Phase 1** of a multi-phase rollout. It covers the **shared foundation** (tokens, motion stack, primitive system) plus the **public marketing surfaces** (landing, blog index/detail, contact, 404). Auth pages and the authenticated app (buyer/seller/admin) get their own follow-on specs after Phase 1 lands.

Backend is untouched. Supabase schema, auth flow, RLS, storage, realtime — none of it changes.

---

## 1 — Aesthetic direction (locked)

### Three adjectives
*Restrained, operational, alive.*

### Reference triangulation
- **Structure & restraint:** Stripe (warm light), Linear (precise typography), Vercel (geometric clarity)
- **Motion & narrative:** Recykal (smooth scroll, gentle parallax, photographic moments anchored to scroll)
- **Scroll feel:** Framer.dev (buttery wheel response, page that feels alive without being kinetic)

### Anti-goals
- AI-startup teal / mint / cyan
- Glassmorphism, frosted panels, animated mesh gradients
- Pure-white-on-pure-black contrast extremes
- `rounded-2xl` on everything, indistinguishable card shadows
- Inter at default tracking for everything (per THE-STANDARD §3 default-ban)
- Centered hero stack with eyebrow tag → centered headline → centered subhead → centered CTAs → blob behind
- Identical three-column feature row with circular icons
- Logo cloud as social proof
- Scroll-jacking, parallax that doesn't anchor to content
- Fade-in-on-scroll for every element on the page
- Bouncy entrance overshoots on serious B2B copy
- Marketing-speak: "leverage", "synergy", "best-in-class", "seamless"
- "Get Started" / "Learn More" CTAs

### Audience read
The B2B user is one of three personas:
1. **Yard owner** — mid-30s to 60s, on a phone, in Tier-2/3 city, bilingual (Hindi/English), decision-maker on lots they list. Cares about: speed of payment, fairness of price discovery, no hidden fees.
2. **Recycler procurement lead** — 28–45, in a corporate environment (cement plant, smelter, paper mill), on desktop, evaluating supply consistency. Cares about: lot quality, GST compliance, pickup reliability.
3. **Investor / showcase audience** — present at pitch events, evaluates the platform in 90 seconds. Cares about: GMV, traction, operational maturity, defensibility.

The design must read as serious to all three on first glance, then reward closer inspection with craft details (italic accent, monospace data, gentle motion).

---

## 2 — Token system

All values defined as CSS custom properties in `src/app/globals.css`. Every later component choice references these. **No raw hex codes outside `globals.css`.** Magic numbers fail code review.

Tokens are structured to support a **dark variant later** without restructure. Light is the only theme shipped in Phase 1; dark is deferred to a future phase but the architecture (`:root` for light, `.dark` for overrides on the html element) is ready for it.

### 2.1 Color

```css
:root {
  /* Surfaces — warm paper, not pure white */
  --paper:           #FAFAF7;  /* primary surface, ~80% of every screen */
  --paper-2:         #F4F2EC;  /* secondary surface — footer, occasional section break, hover bg */
  --paper-3:         #EFEDE5;  /* tertiary — only when paper-2 is already in use */

  /* Ink — warm near-black, not pure black */
  --ink:             #0A0A0A;  /* primary text, primary buttons */
  --ink-2:           #3A3A38;  /* secondary text, sub-headings */
  --ink-3:           #6E6C66;  /* meta, captions, helper text */
  --ink-4:           #A4A29A;  /* placeholders, disabled */

  /* Lines — warm gray hairlines */
  --line:            #E5E2D8;  /* default 1px borders, dividers */
  --line-2:          #EFEDE5;  /* lighter dividers (table rows, subtle separators) */

  /* Brand — deep forest, used as a privilege */
  --forest:          #0F4D2A;  /* primary brand — CTAs, accent type, brand glyph */
  --forest-2:        #0B3D1F;  /* hover / pressed forest */
  --forest-tint:     #E8F0EA;  /* eyebrow chip backgrounds, soft fills */
  --bark:            #1A2419;  /* very dark forest, only for occasional photo overlays */

  /* Status — restrained, not Crayola */
  --warning:         #B96A11;  /* amber-brown, pending bookings */
  --danger:          #B0322A;  /* deep red, errors / destructive */
  --info:            #0F3D6E;  /* deep navy, info banners (rare) */
  --success:         #0F4D2A;  /* same as forest — success borrows brand */
}
```

**Contrast (WCAG AA: 4.5:1 body, 3:1 large):**
- `--ink` on `--paper` → 18.6:1 ✓
- `--ink-2` on `--paper` → 11.7:1 ✓
- `--ink-3` on `--paper` → 5.4:1 ✓ (body)
- `--forest` on `--paper` → 8.4:1 ✓
- `--forest` on `--forest-tint` → 7.2:1 ✓
- White on `--forest` → 7.8:1 ✓

The forest tint band (`--forest-tint`) is the **only** secondary fill in the system. There is no third accent. There is no gradient. There is no second brand color.

### 2.2 Typography

Three families. Loaded via `next/font/google` (self-hosted, zero CLS).

| Role | Family | Weights / styles | Use |
|---|---|---|---|
| Display + Body + UI | **Inter Tight** (variable) | 300, 400, 500, 600, 700, 800 | Everything that isn't an italic accent or a number-table |
| Editorial italic accent | **Fraunces** (variable) | italic 400, opsz 9–144 | One italic phrase per headline, italic phrase in stat numerals (e.g., `+`, `cr`, `hrs`), nothing else |
| Mono | **JetBrains Mono** | 400, 500 | Prices, weights, IDs, timestamps, technical badges, code samples |

Archivo, Archivo Black, DM Serif Display, and Lexend Giga are **removed** entirely from the project. `--font-jakarta` is also removed (unused). `next/font/google` declarations in `src/app/layout.tsx` reduce to three families.

**Type scale** (modular ratio ~1.20, fluid via `clamp()` for display sizes):

```css
:root {
  /* Body / UI scale */
  --text-xs:       11px;   /* mono labels, eyebrow caps */
  --text-sm:       12.5px; /* meta, captions */
  --text-base:     14.5px; /* default body / UI */
  --text-md:       16px;   /* lead paragraphs */
  --text-lg:       19px;   /* large lead, card titles */

  /* Display scale (fluid) */
  --text-h3:       clamp(22px, 2.4vw, 28px);
  --text-h2:       clamp(28px, 3.6vw, 40px);
  --text-h1:       clamp(36px, 5.2vw, 56px);
  --text-display:  clamp(48px, 7.4vw, 84px);  /* hero only */

  /* Letter spacing */
  --tracking-tight:    -0.025em;  /* h2, h3 */
  --tracking-display:  -0.038em;  /* h1, hero display */
  --tracking-mono:      0.04em;   /* mono labels */
  --tracking-uppercase: 0.10em;   /* eyebrow caps */
}
```

Headings use `font-weight: 600` (Inter Tight Semibold), **not 700 or 800** — restraint. Display uses 600 too. Bold (700+) is reserved for inline emphasis inside body text.

Italic accents: **Fraunces 400 italic, opsz 144**, color `--forest`. Used max once per headline. Examples:
- "Trade scrap. By the *truckload.*"
- "Verified yards. *Open* bids. 72-hour settle."

Numbers in stat cards: digits in Inter Tight 600, suffix unit in Fraunces italic (`cr`, `hrs`, `%`, `+`).

### 2.3 Spacing & layout

```css
:root {
  /* Spacing scale — 4px base */
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
  --space-32: 128px;

  /* Container */
  --container-max:    1200px;
  --container-narrow: 720px;  /* long-form prose */
  --container-pad-x:  clamp(20px, 4vw, 56px);

  /* Section vertical rhythm */
  --section-y:        clamp(64px, 9vw, 128px);
  --section-y-tight:  clamp(40px, 6vw, 80px);
}
```

Page max-width is 1200px (slightly wider than the brutalist `max-w-7xl` 1280px — but with `--container-pad-x` the optical width matches modern Stripe/Linear). Long-form prose (blog body, terms) uses 720px.

### 2.4 Radius

```css
:root {
  --radius-xs:  4px;   /* badges, mono pills */
  --radius-sm:  6px;   /* small inputs, dropdowns */
  --radius-md:  8px;   /* buttons */
  --radius-lg:  12px;  /* cards, panels */
  --radius-xl:  16px;  /* large feature cards (sparingly) */
  --radius-pill: 999px; /* eyebrow chip, status pills */
}
```

Mixed posture: small elements get small radii, large surfaces get larger radii — *not* `rounded-2xl` everywhere. The neo-brutalist `border-radius: 0 !important;` global rule is removed.

### 2.5 Shadows

```css
:root {
  /* Whisper elevation — barely perceptible */
  --shadow-1: 0 1px 2px rgba(15, 77, 42, 0.04),
              0 4px 12px rgba(0, 0, 0, 0.025);
  --shadow-2: 0 1px 2px rgba(15, 77, 42, 0.05),
              0 8px 24px rgba(0, 0, 0, 0.04);
  --shadow-3: 0 2px 4px rgba(15, 77, 42, 0.06),
              0 16px 40px rgba(0, 0, 0, 0.06);

  /* Focus ring */
  --ring-forest: 0 0 0 3px rgba(15, 77, 42, 0.18);
  --ring-ink:    0 0 0 3px rgba(10, 10, 10, 0.12);
}
```

The forest tint in the shadow is intentional — pure-gray shadows look dead. A trace of forest under the surface ties the system together. Hard offset shadows (`4px 4px 0 0 var(--ink)`) are gone.

### 2.6 Motion

```css
:root {
  /* Single signature curve — used everywhere */
  --ease:           cubic-bezier(0.32, 0.72, 0, 1);  /* ease-out-quart, Apple-ish */
  --ease-in-out:    cubic-bezier(0.65, 0.05, 0.36, 1);  /* used only for state toggles where in-out reads better */

  /* Three durations — period */
  --motion-fast:    200ms;  /* hovers, focus, button feedback, tooltip */
  --motion-base:    450ms;  /* panel slides, modals, dropdowns, in-page transitions */
  --motion-slow:    700ms;  /* hero reveals, scroll-triggered choreography */
}
```

`prefers-reduced-motion: reduce` collapses all of the above to ≤120ms and replaces transforms with opacity-only crossfades. Lenis bails out entirely when reduced motion is on (already implemented in `LenisProvider`).

---

## 3 — Motion stack architecture

### 3.1 Final stack

| Layer | Library | Role |
|---|---|---|
| Smooth scroll | **Lenis** | Wheel/touch → smoothed scroll position; the "buttery scroll" feel |
| Component animation | **Framer Motion** | All component-level animation: `whileInView`, `AnimatePresence`, hover springs, layout transitions |
| (removed) | ~~GSAP~~ | Uninstalled. Dependencies dropped. Existing GSAP-based components rewritten in Framer Motion. |

GSAP and Framer Motion are competitors — keeping both was historical accident, not design. Framer Motion is more idiomatic for React/Next.js, integrates naturally with `whileInView` for scroll-triggered moments, and is already wired into the auth flow. Removing GSAP cuts ~50 KB compressed from the bundle.

### 3.2 Lenis configuration

The current `LenisProvider` (already wired in `src/app/layout.tsx`) is essentially correct. Two refinements:

```ts
const lenis = new Lenis({
  duration: 1.2,                     // slightly longer for that Framer/Recykal feel
  easing: (t) => 1 - Math.pow(1 - t, 3),  // ease-out-cubic — friendlier than the current power-of-2
  smoothWheel: true,
  wheelMultiplier: 1.0,
  touchMultiplier: 1.5,
  syncTouch: false,                  // never smooth on touch — feels wrong on mobile
});
```

Lenis exposes scroll position to Framer Motion via `useScroll()` automatically. No bridge code needed.

### 3.3 Animation grammar — what to use, when

The system has **five sanctioned motion patterns**. Anything beyond these requires explicit justification.

| # | Pattern | When | Implementation |
|---|---|---|---|
| 1 | **Hero entrance stagger** | Once, on landing-page mount | Framer Motion `<motion.div initial animate>` with stagger children — eyebrow → headline → lead → CTAs revealed in sequence with 80ms offset. Duration `--motion-slow`. |
| 2 | **Scroll-anchored reveal** | Section content enters viewport | Framer Motion `whileInView` with `viewport={{ once: true, margin: "-15% 0px" }}`. Translate-y 16px → 0, opacity 0 → 1. Duration `--motion-base`. Stagger children at 60ms when there's a list. |
| 3 | **Stat count-up** | Numbers in stat strips, when scrolled into view | Framer Motion `useInView` + animated counter component. ~1.0s duration, ease-out-quart. Replaces the current GSAP-based `HeroStatCounter`. |
| 4 | **Image scroll parallax** | Hero photography (if used) and select feature images | Framer Motion `useScroll` + `useTransform` to map scroll progress (0 → 1) to image `scale: 1.05 → 1.0` and `y: 0 → -2%`. **Subtle** — the user should feel it without naming it. Reduced-motion disables it. |
| 5 | **Hover micro-feedback** | Buttons, cards, links | Framer Motion `whileHover={{ y: -1 }}` + box-shadow elevation tier-up via CSS. Spring config: `{ stiffness: 400, damping: 28 }`. Duration target: `--motion-fast`. |

**Banned patterns:**
- Fade-in on every element (slop signature — pattern 2 is the *only* sanctioned scroll reveal, applied per-section, not per-element)
- Bouncy entrance overshoots on body content (use ease-out-quart, never spring with overshoot for serious copy)
- Continuous animations (looping gradient hue rotation, ambient floating cards, "AI" pulse without informational meaning)
- Parallax that doesn't anchor to a content moment
- Scroll-jacking (Recykal's "impact" section pins the viewport — we don't replicate that; it's tasteful there but high-risk for us)
- `transform: scale(1.05)` on hover for marketing cards (slop — we use translate-y and shadow elevation only)

### 3.4 Reduced-motion contract

`@media (prefers-reduced-motion: reduce)`:
- Lenis is destroyed; native scroll resumes (already implemented)
- All `motion.*` components fall back to opacity-only transitions ≤120ms
- Stat count-up jumps to final value instantly
- Image parallax disabled
- Hover translations disabled (color/shadow hover stays — those aren't motion)

This must be tested in DevTools (`Rendering → Emulate prefers-reduced-motion: reduce`) before any PR is declared shippable.

---

## 4 — Component primitive system

All shadcn/ui primitives in `src/components/ui/` were rewritten for the brutalist direction (sharp corners, hard offset shadows, Archivo Black labels). Every primitive needs a Refined Premium rewrite. The list and intent:

| Primitive | Refined Premium intent |
|---|---|
| `button.tsx` | Variants: `primary` (forest fill, white text), `secondary` (paper fill, line border, ink text), `ghost` (transparent, ink text on hover-paper-2), `link` (ink, underlined on hover with forest), `destructive` (danger fill). Sizes sm/md/lg. Radius `--radius-md`. Whisper-shadow on primary. |
| `card.tsx` | Paper background, 1px `--line` border, `--radius-lg`, `--shadow-1` whisper elevation. No hover scale. Optional hover lifts to `--shadow-2` with translate-y -1px. |
| `badge.tsx` | Mono uppercase, tracked. Variants: `forest` (forest-tint fill, forest text), `ink` (paper-2 fill, ink-2 text), `warning`, `danger`, `success`. Radius `--radius-xs`. |
| `input.tsx` | Paper-2 background, 1px `--line` border, `--radius-md`, focus ring `--ring-forest`. Inter Tight 400 14.5px. |
| `textarea.tsx` | Same as input, multiline. |
| `label.tsx` | Inter Tight 500 13px, ink-2. (No more uppercase Archivo Black.) |
| `select.tsx`, `dropdown-menu.tsx` | Paper background, `--shadow-2`, `--radius-md`. Item hover: `--paper-2` bg. |
| `dialog.tsx`, `alert-dialog.tsx`, `sheet.tsx` | Paper bg, `--shadow-3`, `--radius-lg`. Backdrop `rgba(10,10,10,0.4)`. Slide/fade entrance via Framer Motion at `--motion-base`. |
| `tabs.tsx` | Underline indicator in `--forest`, animated with Framer Motion `layoutId`. No pill background. |
| `tooltip.tsx` | Ink background, paper text, `--radius-sm`. 200ms appearance via `--motion-fast`. |
| `breadcrumb.tsx` | Ink-3 text, ink hover, `/` separator in ink-4. |
| `avatar.tsx` | `--paper-2` fallback bg, Inter Tight 600 initials. Radius `--radius-md` (square-ish, not circle by default — circle reads consumer/social, square reads B2B). |
| `separator.tsx`, `skeleton.tsx`, `scroll-area.tsx` | Use `--line`, `--paper-2` shimmer for skeleton. |
| `sonner.tsx` (toast) | Paper bg, `--shadow-2`, ink text, forest accent for success. |

The `class-variance-authority` (cva) factory is kept; only the variants change.

---

## 5 — Phase 1 scope: marketing surfaces

This spec ships **everything in `src/app/` that is publicly viewable without auth**, plus the foundation that everything else builds on. Concretely:

### 5.1 Files in scope

| Path | Action |
|---|---|
| `src/app/globals.css` | Full rewrite — new tokens, no `border-radius: 0 !important`, motion variables |
| `src/app/layout.tsx` | Swap fonts to Inter Tight + Fraunces + JetBrains Mono only; tweak Lenis duration/easing |
| `src/app/page.tsx` | Full landing redesign — hero, live marketplace strip, how-it-works, categories, social proof / sustainability moment, CTA, footer |
| `src/app/blogs/page.tsx`, `src/app/blogs/[slug]/page.tsx` | Redesign in Refined Premium — editorial article layout |
| `src/app/contact/page.tsx` | Form on paper-2 column, narrative on paper, 2-column split |
| `src/app/not-found.tsx` | Quiet, type-driven, with deep-forest accent moment |
| `src/components/shared/marketing-nav.tsx`, `marketing-footer.tsx` | Refined Premium rewrite |
| `src/components/shared/lenis-provider.tsx` | Easing tweak per §3.2 |
| `src/components/shared/live-marketplace-panel.tsx` | Redesign — hairline rows, mono prices, forest accent only on the live-pulse dot |
| `src/components/landing/hero-stat-counter.tsx` | Rewrite — drop GSAP, rebuild on Framer Motion `useInView` + animated counter |
| `src/components/landing/*` (new) | New components for landing sections (see §5.4) |
| `src/components/ui/*.tsx` | All 19 primitives rewritten per §4 |
| `package.json` | Remove `gsap` and `@gsap/react` deps |

### 5.2 Files explicitly **out of scope** (deferred)

| Path | Why deferred |
|---|---|
| `src/app/(auth)/*` (login, signup, role-select) | Phase 2 spec — auth deserves its own design pass (split-screen narrative, brand entry point) |
| `src/app/(buyer)/*` (marketplace, companies, bookings, chat, profile) | Phase 3 spec — authenticated app surfaces |
| `src/app/(seller)/*` (dashboard, company, scraps, seller-bookings, chat) | Phase 3 spec |
| `src/app/admin/*` | Phase 3 spec |
| `src/middleware.ts`, `src/lib/supabase/*`, `src/lib/queries/*` | Backend untouched |
| Supabase schema / RLS / storage | Untouched |

The reason for the staged rollout: marketing pages are public, low-risk, and the highest-leverage surface (this is what investors and prospective users see first). Locking the foundation here lets Phase 2/3 inherit tokens, primitives, and motion patterns with no further design questions.

### 5.3 Hero strategy (decision)

**Type-driven hero with a live data inset, not a full-bleed photographic hero.**

Reasoning:
- Recykal's hero photography works for *Recykal* because it's a corporate-narrative play: "we're on a mission." ScrapKart's hero job is operational: "here's a marketplace, here's the price, post a lot."
- Type-driven heroes (Stripe, Linear, Vercel) earn their restraint through typography craft and negative space. That matches Refined Premium directly.
- The existing `LiveMarketplacePanel` is a real differentiator — actual live listings, real prices, live bids — and the founder's prior signal valued it. We keep it as a hero-right inset (~40% of hero width), redesigned in Refined Premium.

Hero layout:
- Left column: eyebrow chip → headline (with one Fraunces italic word) → lead paragraph → primary + secondary CTAs → spec strip (4 stats with mono labels)
- Right column: `LiveMarketplacePanel` redesigned — hairline rows, mono prices, a single forest dot for the live-pulse indicator
- Below hero: a thin spec strip lifts to the very edge of the viewport (no border, just rhythm) — the founder valued the prominent stats

A single photographic moment lives **lower on the page**: the "How it works" section header, or a sustainability/impact section just before the CTA. Image is treated with subtle scroll parallax (motion pattern #4) and a desaturated wash to keep it editorial, not stock-photo.

### 5.4 Landing page sections (final order)

1. **Marketing nav** — sticky, blurred paper-bg-rgba on scroll, condensed logo, 4 nav links + sign-in + primary CTA
2. **Hero** — type-driven with live marketplace panel inset (§5.3)
3. **Spec strip** — 4 stats with count-up reveal (motion pattern #3)
4. **How it works** — 4 steps in a horizontal storyline (numbered, hairline-separated, no card outlines), single photographic moment behind the section title (motion pattern #4 — gentle scale-down on scroll)
5. **Categories** — 6 material types in a 3×2 grid, each card hairline-bordered with a small monoline icon, mono caption row underneath
6. **Why ScrapKart** — 3 differentiators presented as a long-form narrative (not a feature row): "Open price discovery", "Verified at the yard", "Settle in 72 hours". Editorial layout, paragraph-led, italic accents on key phrases.
7. **Social proof** — *if and only if* we have real testimonials/logos. If not, **skip entirely** rather than fake it (per THE-STANDARD anti-slop). Placeholder: a single paragraph quote from a real yard owner with name, yard, city — hand-set type, no avatar carousel.
8. **CTA band** — full-width forest-tint band (the only forest-tint surface on the page), large headline, single primary CTA. No 3-column "ready to start? / book demo / contact sales" garbage.
9. **Marketing footer** — paper-2 background, 4 column nav, copyright + GST/CIN line in mono, deep-forest brand glyph

### 5.5 What about the existing 33 brutalist commits?

The branch `feat/ui-overhaul` carries all the brutalist work. We don't revert them via git history — we **overwrite** them as the new spec is implemented. Each file edited in Phase 1 supersedes the brutalist version. When Phase 1 is complete, the branch represents the new direction; the brutalist work stays in git history for archaeology.

This is preferred over `git reset --hard master` because:
- The implementation plan can reuse component scaffolding (the file structure of `MarketingNav`, `LiveMarketplacePanel`, `HeroStatCounter` is sound — only their visual language needs to change)
- The branch already has the `feat/ui-overhaul` name set up on the remote tracking (per the user's "no auto-push" preference, we don't push until they say so anyway)

---

## 6 — Implementation sequencing (within Phase 1)

The implementation plan (next document) will sequence Phase 1 in this order. Each step is independently testable and reversible:

1. **Foundation tokens** — rewrite `globals.css`, swap fonts in `layout.tsx`, install nothing, uninstall GSAP. No visual page changes yet (existing components reference old token names — they'll break visually but that's expected mid-build).
2. **Primitive rewrite** — all 19 `src/components/ui/*` primitives. Each component visually verified in isolation.
3. **Marketing nav + footer** — shared chrome rewritten first because every public page uses them.
4. **Landing page** — hero, spec strip, how-it-works, categories, narrative section, CTA band — section by section.
5. **Live marketplace panel** — redesigned in place.
6. **Hero stat counter** — Framer Motion rewrite, GSAP removed.
7. **Blog index, blog detail, contact, 404** — apply the new system.
8. **Lenis tweak** — duration/easing nudge.
9. **Reduced-motion verification** — DevTools test on every page; capture screenshot for spec acceptance.
10. **Build + Lighthouse** — `npm run build && npm run lint && npm run typecheck`. Lighthouse mobile ≥ 90 on landing.

The user's standing constraints apply throughout:
- **No `git push` until the user says so.** Local commits only. (Memory: `feedback_no_auto_push.md`)
- **Backend untouched.** No changes to Supabase, RLS, schema, queries. (Memory: `feedback_backend_untouched.md`)
- **Test feature in browser before declaring complete.** Type-checks and lint do not verify visual correctness.

---

## 7 — Risks & mitigations

| Risk | Likelihood | Mitigation |
|---|---|---|
| Lenis + Framer Motion `useScroll` interaction quirks (Lenis updates a virtualized scroll, useScroll reads native) | Medium | Wire `useScroll({ container: ref })` against the body; Lenis exposes the smoothed scroll position by default. Test on a single hero parallax first before committing to the pattern across the page. |
| Inter Tight + Fraunces combined load weight | Low | Both are subsetted by `next/font/google` to Latin only. Display swap fallback prevents CLS. Total font weight target: < 80 KB combined. |
| Forest accent overuse | Medium | Audit per page: forest should appear ≤ 4 times on landing (eyebrow chip, headline italic, primary CTA, brand glyph). If it appears 5+ times, we're slipping toward "AI startup teal" on a different hue. |
| Prefers-reduced-motion not actually tested | High (this is always the risk) | Acceptance criterion §8.5 — explicit DevTools test + screenshot before PR. |
| Brutalist commits' token names still referenced in `src/app/(buyer)/*` and `src/app/(seller)/*` (Phase 3 surfaces) | High | These pages will visually break the moment Phase 1 tokens land. Mitigation: keep a backwards-compat shim in `globals.css` mapping old names to new ones for the duration of Phase 1, so the in-app surfaces still render (degraded but functional). Shim is removed when Phase 3 completes. |
| Founder/user changes mind on direction mid-build | Medium | Foundation reveal was visually validated before this spec. Direction is locked. Future changes are scoped to *parameter tuning* (color hex, type weight, easing curve) — not posture changes. |

---

## 8 — Acceptance criteria (Phase 1)

Phase 1 is **done** only when all of the following pass:

### 8.1 Visual & design
- [ ] Refined Premium aesthetic identifiable in 3 seconds on the landing page
- [ ] No anti-slop pattern from THE-STANDARD §4 present anywhere
- [ ] Type system uses defined scale; no arbitrary `text-[19.5px]`
- [ ] Color system uses defined tokens; no raw hex codes outside `globals.css`
- [ ] Spacing follows the `--space-*` scale; no `margin: 17px` outliers
- [ ] One Fraunces italic accent maximum per headline; total Fraunces use on landing ≤ 5 instances
- [ ] No `border-radius: 0 !important` global rule remains
- [ ] No GSAP imports remain in any source file

### 8.2 Engineering
- [ ] `npm run typecheck` passes with zero errors
- [ ] `npm run lint` passes with zero errors or warnings
- [ ] `npm run build` succeeds with `--webpack` (PWA service worker generates)
- [ ] No console errors or warnings in production build on the landing page
- [ ] `gsap` and `@gsap/react` removed from `package.json`; `package-lock.json` regenerated
- [ ] No unused imports anywhere (lint enforces)

### 8.3 Performance
- [ ] Lighthouse mobile (throttled 4G, mid-tier device) on landing: Performance ≥ 90, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95
- [ ] LCP < 2.0s on landing (mobile)
- [ ] CLS < 0.05 on landing (Inter Tight + Fraunces font-display swap with fallback metrics)
- [ ] Initial JS bundle on landing < 200 KB compressed

### 8.4 Accessibility
- [ ] Keyboard pass: every interactive element reachable via Tab, focus ring visible, no traps
- [ ] All form inputs have associated `<label>` (contact page, search if added)
- [ ] No axe violations of severity `serious` or `critical` on any public page
- [ ] Color contrast checked against §2.1 declarations — no surprises

### 8.5 Motion / Reduced motion
- [ ] DevTools `prefers-reduced-motion: reduce` test on landing — no visible motion, screenshot attached to spec or implementation PR
- [ ] Lenis is destroyed (not just paused) when reduced motion is on — verified via DOM inspection
- [ ] Stat counter jumps to final value instantly under reduced motion

### 8.6 Responsive
- [ ] Landing tested at 360, 768, 1024, 1440, 1920 widths — no horizontal scroll, no broken layouts
- [ ] Hero `LiveMarketplacePanel` collapses to a single column on < 1024px
- [ ] Touch targets ≥ 44px on all CTAs

### 8.7 Constraints honored
- [ ] No `git push` issued during Phase 1 (verified via reflog at handoff)
- [ ] No file outside `src/app/`, `src/components/`, `src/app/globals.css`, `src/app/layout.tsx`, `package.json`, `package-lock.json` modified — backend untouched
- [ ] All tests done in a real browser, not just type-check

---

## 9 — Glossary of decisions made (for future reference)

| Decision | Choice | Rationale |
|---|---|---|
| Theme | Light + warm only in Phase 1 | Recykal reference is light; deep forest reads as a deliberate accent on paper; tokens architected for dark variant in a future phase |
| Primary surface | `#FAFAF7` (warm ivory), not `#FFFFFF` | Pure white reads sterile; warm ivory reads paper-stock and intentional |
| Primary ink | `#0A0A0A` (warm near-black), not `#000000` | Pure black against pure white is the slop combo; warm near-black breathes |
| Brand color | `#0F4D2A` deep forest | "Forest" connotes recycling/sustainability without being kitsch about it; deep enough to read serious, saturated enough to lead the eye |
| Display + body | Inter Tight (one family, multiple weights) | Matches Linear/Framer/Vercel restraint discipline; variable font keeps weight cheap |
| Editorial accent | Fraunces (variable serif italic) | One italic accent moment per headline = signature craft; opsz axis lets us use it from caption to display sizes |
| Mono | JetBrains Mono | Already in project; legible at small sizes; appropriate for technical data |
| Animation library | Framer Motion only | Idiomatic for React; competes with GSAP and wins on integration cost; Lenis bridges to it via `useScroll` natively |
| Smooth scroll | Lenis (kept) | The single most-quoted reference (Recykal, Framer) is buttery scroll; Lenis is the standard implementation |
| Hero strategy | Type-driven + live data inset | Operational job (post a lot, see prices) trumps narrative job (mission, story); aligns with Stripe/Linear restraint |
| Phase scope | Foundation + public marketing only | Auth and authenticated app are higher-risk and benefit from foundation lock-in first |
| Branch strategy | Continue on `feat/ui-overhaul`, overwrite brutalist work | Reuses scaffolding; brutalist work stays in git history for reference |
| Push policy | No `git push` until user explicitly approves | Standing user preference (memory: `feedback_no_auto_push.md`) |

---

## 10 — Next step

After user approval of this spec, Claude invokes the **superpowers:writing-plans** skill to produce the detailed step-by-step implementation plan for Phase 1. The plan will sequence the 10 implementation steps from §6, define test/verification gates between each, and identify the file-by-file edits required.

Phases 2 (auth) and 3 (authenticated app) are tracked as follow-on specs to be authored after Phase 1 ships locally and is reviewed visually by the user.

— *End of spec.*
