# ScrapKart Main Page — Design Spec

**Date:** 2026-04-29
**Folder:** `Scrapkart/SCRAPKART MAIN PAGE/`
**Live at (eventual):** `https://scrapkart.app`
**Sister surfaces:** `https://b2b.scrapkart.app` (Refined Premium B2B app — built), `https://b2c.scrapkart.app` (B2C site — separate, live)

---

## Goal

A single-page brand-led entry point at `scrapkart.app` that explains what ScrapKart is and routes visitors to the appropriate sub-domain (B2B or B2C). No backend, no auth, no app logic — pure marketing surface that loads fast and reads as the umbrella over both worlds.

The page must feel **confident and expressive** ("crazy yet easy to use") while staying brand-coherent with the Refined Premium B2B aesthetic: cream paper, deep forest, ink-on-paper. Brutalist energy comes from typography and structural choices, not from a new color system.

---

## Tech stack

- **Plain HTML + CSS + vanilla JavaScript.** Zero build step.
- **Tailwind CSS via Play CDN** (`https://cdn.tailwindcss.com`) for utility classes.
- **Custom CSS file** (`styles.css`) for design tokens, type scale, and the brutalist moments that Tailwind utilities don't handle well.
- **Vanilla JS** (`script.js`) for: scroll-triggered reveal animations via Intersection Observer, stat counter animation, and smooth-scroll for in-page anchors. ~100 lines total.
- **Google Fonts** loaded via `<link>`: Inter Tight (variable, sans), Fraunces (variable, opsz axis, serif italic), JetBrains Mono (mono captions).
- **No frameworks.** No React, no Next.js, no Astro, no build pipeline.

### File layout

```
SCRAPKART MAIN PAGE/
├── index.html
├── styles.css
├── script.js
├── assets/
│   ├── logos/                  ← copied from /Logos in parent project
│   │   ├── scrapkart-black.png
│   │   └── scrapkart-icon.svg
│   └── images/
│       ├── hero-aside.jpg      ← industrial / scrap photography
│       ├── about-1.jpg
│       └── india-outline.svg   ← decorative SVG outline of India for closing band
└── README.md
```

### Deployment

Deploys as a static folder. Dragging the folder into a Vercel project (or `vercel deploy`) is enough — no build command needed. Eventually pointed at `scrapkart.app` apex.

---

## Design tokens

Reuse the Refined Premium palette from the B2B app for brand coherence. One small addition for the B2C-flavoured warmth.

```css
:root {
  /* Surfaces */
  --paper:        #FAFAF7;
  --paper-2:      #F4F2EA;
  --paper-3:      #ECE9DD;
  --cream-2:      #FFF7E0;   /* warmer accent — only used on the B2C card and its hover trail */

  /* Ink */
  --ink:          #0A0A0A;
  --ink-2:        #2D2A22;
  --ink-3:        #57544A;
  --ink-4:        #8B887E;

  /* Forest */
  --forest:       #0F4D2A;
  --forest-2:     #0B3A1F;
  --forest-tint:  #E8F0EA;

  /* Lines / shadows */
  --line:         #E5E2D8;
  --line-2:       #EFECE2;
  --shadow-1:     0 1px 2px rgba(15, 77, 42, 0.04), 0 1px 1px rgba(15, 77, 42, 0.03);
  --shadow-2:     0 4px 12px rgba(15, 77, 42, 0.06), 0 2px 4px rgba(15, 77, 42, 0.04);
  --shadow-3:     0 12px 32px rgba(15, 77, 42, 0.08), 0 4px 8px rgba(15, 77, 42, 0.05);

  /* Motion */
  --ease-signature: cubic-bezier(0.32, 0.72, 0, 1);
  --motion-fast:    200ms;
  --motion-base:    450ms;
  --motion-slow:    700ms;

  /* Radius */
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
}
```

### Typography

- **Display + UI:** Inter Tight (variable, axes: weight 100-900). Tight tracking on display sizes.
- **Serif italic accents:** Fraunces (variable, axes: opsz 9-144, weight 100-900). Used sparingly for italicised words inside display headings and a single manifesto paragraph.
- **Mono captions, stat numbers:** JetBrains Mono (regular + medium).

### Type scale (fluid)

| Use | Class / size | Notes |
|---|---|---|
| Hero display | `clamp(56px, 9vw, 140px)` | Inter Tight 600, tracking `-0.03em`, line-height `0.92` |
| Section H2 | `clamp(40px, 5.5vw, 76px)` | Same family/weight |
| Section H3 / card display | `clamp(24px, 2.8vw, 40px)` | |
| Body | `17px / 1.55` | Inter Tight 400 |
| Manifesto paragraph | `21px / 1.45` | Fraunces 400, opsz 36 |
| Mono caption | `12px` | JetBrains Mono 500, uppercase, tracking `0.1em` |
| Stat counter | `clamp(64px, 8vw, 120px)` | Inter Tight 600, `tabular-nums`, line-height `0.95` |

Italic accent words inside display headings switch to Fraunces (italic, weight 500, opsz 144) and are slightly larger optical size — the "*Repeat.*", "*two worlds.*", "*For India.*" type moments.

---

## Sections (top → bottom)

### 1. Sticky nav

Fixed top bar, height 72px, background `var(--paper)/0.85` with `backdrop-blur(12px)`, hairline bottom border `var(--line)` that fades in only after the user scrolls past 40px.

- Left: ScrapKart wordmark (image), 28px tall, links to `#top` (smooth scroll).
- Right (desktop): inline links — *About* (anchor to #about), *Two worlds* (anchor to #two-worlds), and a small "Sign in" link in `var(--forest)` that points at `https://b2b.scrapkart.app/login` (the only auth surface today; B2C has its own flow). On mobile (< 640px), only the wordmark is visible.

### 2. Hero — typographic explosion

Full-viewport-height (or `min-height: 92vh`), centered vertically.

```
EST. 2026 / INDIA                         [mono eyebrow, ink-3]

Trade. Recycle.
Repeat.                                   [the "Repeat." in Fraunces italic, oversized]

India's industrial scrap exchange — and
your neighborhood scrap collector.
One platform, two worlds.                 [subhead, ink-2]

[ I have scrap ]   [ I process scrap ]    [two paper-2 chip pills, hairline border, mono caption inside]
```

Layout: max-width 1280px, left-aligned by default; the hero text occupies a 60% column on desktop and a small inset image (an industrial scrap photo, ~360×440px) sits to the right with subtle scroll-driven parallax (`translateY` 0 → -3% as the user scrolls).

The two pill chips are framing-only — they are NOT linked to B2B / B2C. They set up the dual-audience narrative; the actual CTAs come in section 5.

Below the hero, a thin scroll-cue (mono caption "SCROLL ↓") that fades out as the user scrolls.

### 3. About — "What ScrapKart is"

`id="about"`. 2-column editorial grid (60/40 on desktop, single column on mobile), max-width 1200px, padding `clamp(80px, 12vh, 160px)` top and bottom.

- **Left column (60%):** Single Fraunces serif paragraph, ~110 words, that reads like a manifesto. Tone: confident, plain-spoken, slightly literary. Body copy:

  > Scrap is value. Most of India still treats it as waste — landfilled, burned, or quietly bought at undervalued prices in opaque markets. ScrapKart is the missing infrastructure: a digital exchange where industrial waste producers list their lots, verified buyers bid in the open, and settlement clears in 72 hours. We are scale-agnostic — five kilos of dismantled electronics or fifty tonnes of mill scale, the same disciplined process.

- **Right column (40%):** A vertical stack of three small cards. Each card has a hairline border, a mono caption header in `var(--ink-3)`, and a one-sentence body in `var(--ink)`:
  1. **VERIFIED BUYERS** — Every recycler is CPCB and EPR-checked before they get the keys.
  2. **72-HOUR SETTLEMENT** — Bid accepted today, money in the bank by the third working day. No exceptions.
  3. **SCALE-AGNOSTIC** — From a household drop-off of newsprint to a 30-tonne foundry pickup, the same disciplined process.

### 4. Stat band — by the numbers

Full-bleed dark band, background `var(--forest)`, text `var(--paper)`. Padding `clamp(80px, 12vh, 140px)` top/bottom.

```
                    BY THE NUMBERS                         [mono caption, paper @ 60%]

  ₹2.4 Cr+              80+                12              [counters, ~110px tall, paper, tabular-nums]
  in scrap traded       verified recyclers   cities active  [mono labels, paper @ 60%]
```

Numbers are placeholder. Real values come from the founder later — the spec just sets the slot. Counter animates from 0 to value over 1.4s on scroll-in (`requestAnimationFrame` + `easeOutCubic`).

### 5. ⭐ Two Worlds — the CTAs

`id="two-worlds"`. Background `var(--paper)`, padding `clamp(100px, 14vh, 180px)` top/bottom.

Section heading: `One platform, *two worlds.*` (the "*two worlds.*" in Fraunces italic, oversized).

Sub-line: `Choose your path.` (mono caption, ink-3, centered)

Below: two large cards side-by-side on desktop (50/50 grid with 24px gap), stacked on mobile.

#### Left card — B2B

- Background: `var(--forest)`, text `var(--paper)`
- Border-radius: `var(--radius-lg)` — slightly sharper feel
- Padding: 48px
- Mono caption: `FOR YARDS, FOUNDRIES & RECYCLERS` (paper @ 60%)
- Display heading: `Trade in truckloads.` (Inter Tight 600, ~52px)
- Body, ~50 words: "Verified industrial scrap exchange. List lots, get bids from CPCB-certified recyclers, settle in 72 hours. Built for yards moving real weight."
- Button: `Enter B2B →` (paper background, forest text, hover invert) → `https://b2b.scrapkart.app`
- Hover: card rises -2px, `var(--shadow-3)` deepens

#### Right card — B2C

- Background: `var(--cream-2)` (the warm accent), text `var(--ink)`
- Border-radius: `var(--radius-lg)` BUT corners 50% larger than B2B card (e.g. `border-radius: 18px` directly) — softer feel
- Padding: 48px
- Mono caption: `FOR HOMES, SHOPS & EVERYDAY SCRAP` (ink-3)
- Display heading: `Drop off. Get paid.` (Inter Tight 600, ~52px)
- Body, ~50 words: "Doorstep pickup or drop-off at a verified collection centre. Newsprint, plastics, e-waste — get a fair price, paid into UPI within 24 hours."
- Button: `Enter B2C →` (forest background, paper text, hover bg-2) → `https://b2c.scrapkart.app`
- Hover: card rises -2px, `var(--shadow-3)` deepens

The **visual divergence** between cards (sharper / darker / architectural vs softer / warmer / approachable) hints at the experience inside each path without copy explaining it.

### 6. Closing band — "Built in India"

Full-viewport (`min-height: 80vh`), background `var(--paper)`. Centered editorial moment, max-width 960px, padding 80px horizontal.

Faint India-outline SVG positioned absolutely behind the text, color `var(--forest-tint)`, opacity 0.5, sized to ~70% viewport width — decorative wash, not a focal point.

Foreground:
```
2026 — PRESENT                    [mono caption, ink-3]

Built in India.
For India.                        [display heading, "For India." in Fraunces italic]

Making the value chain visible —
one truckload at a time.          [serif Fraunces body, ~24px]
```

Optional small "Founded in Mumbai" line below in mono (judgment call — leave out if it makes the band feel cluttered).

### 7. Footer

Background `var(--paper-2)`, top border `1px var(--line)`, padding 64px top / 32px bottom.

Three columns on desktop (single column on mobile, stacked):

- **Brand** — logo (small, 28px), tagline "India's industrial + retail scrap exchange.", copy "© 2026 ScrapKart Pvt Ltd"
- **Links** — *About* (anchor) · *Privacy* (placeholder #) · *Terms* (placeholder #) · *Contact* (mailto: hello@scrapkart.app)
- **Social** — *LinkedIn* · *Twitter / X* · *Instagram* (icons + labels, all in `var(--ink-3)` with hover `var(--forest)`)

Bottom strip with thin hairline above: `Made in India · 2026` (mono, centered, ink-4).

---

## Motion + interaction

### Scroll-triggered reveals

Every major block (hero items, about cards, stat counters, two-worlds cards, closing band) animates from `opacity: 0; transform: translateY(12px);` to `opacity: 1; transform: translateY(0);` when its top edge enters the viewport at the 80% threshold. Easing: `var(--ease-signature)`. Duration: `var(--motion-base)` (450ms).

**No-JS fallback:** the hidden initial state must NOT be the CSS default. Instead, `script.js` runs immediately on `DOMContentLoaded` and adds a class `js-ready` to `<html>`. The hidden state is gated on that class:

```css
.reveal { opacity: 1; transform: none; transition: opacity var(--motion-base) var(--ease-signature), transform var(--motion-base) var(--ease-signature); }
html.js-ready .reveal { opacity: 0; transform: translateY(12px); }
html.js-ready .reveal.is-visible { opacity: 1; transform: translateY(0); }
```

So if JS is disabled, all `.reveal` blocks render visible immediately. With JS enabled, they start hidden and the IntersectionObserver triggers the reveal. Single observer, all reveal targets queried at startup.

### Stat counter

When the stat band enters the viewport, three numeric counters animate from 0 to their target values over 1400ms with `easeOutCubic`. Implementation: `requestAnimationFrame` loop, locale-aware formatting via `Intl.NumberFormat('en-IN')` for the comma separators (Indian numbering: 2,40,00,000).

### Smooth scroll

Nav anchor links smooth-scroll to their targets via `element.scrollIntoView({ behavior: 'smooth', block: 'start' })`. The browser default is fine for this — no Lenis or external library needed for a single static page.

### Hover lifts

Two-worlds CTA cards: on `:hover`, transform `translateY(-2px)` and shadow grows from `var(--shadow-2)` to `var(--shadow-3)`. Transition `transform 200ms var(--ease-signature), box-shadow 200ms var(--ease-signature)`.

### Hero parallax inset

The small image to the right of the hero text translates `Y` by `-3%` of its height as the page scrolls past it. Tied to `scrollY` via a single `requestAnimationFrame`-throttled handler (NOT a heavy parallax library).

---

## Responsive behaviour

Breakpoints aligned with Tailwind defaults:

- **< 640px** (mobile): Single column everywhere. Hero collapses (no inset image, text only). About becomes single-column. Two-Worlds cards stack (B2B above B2C). Nav shows only the wordmark.
- **640–1023px** (tablet): Some grid; hero stays single-column; about stays single-column; two-worlds cards stay stacked.
- **≥ 1024px** (desktop): Full editorial layout as specified above.

Hero display heading uses `clamp()` for fluid sizing — no media-query overrides needed.

---

## What stays out of scope

Explicitly NOT included in this iteration:

- Backend, forms, contact form, newsletter signup, email capture
- Authentication, sign-in flow (the nav "Sign in" is a plain link to the B2B login)
- A blog, multiple pages, routing
- CMS integration
- Analytics (can be added later as a single `<script>` tag)
- Internationalization (English-only for now)
- Dark mode
- Image lazy-loading library — native `loading="lazy"` is enough
- Custom SVG icon library — use plain `<svg>` inline for the few icons needed (arrow, social marks)

If the user later wants any of these, they're additive — none break the static-folder model.

---

## Acceptance criteria

- All seven sections render correctly at 360px, 768px, and 1440px widths.
- Hero CTAs link to `https://b2b.scrapkart.app` and `https://b2c.scrapkart.app` respectively.
- Stat counters animate exactly once on first scroll-in (not on subsequent scrolls into view).
- No console errors in Chrome DevTools on initial page load.
- Lighthouse Performance ≥ 95, Accessibility ≥ 95 (single static page should hit both easily).
- Page weight < 600KB total (excluding fonts), achieved by compressing images to ≤ 200KB each.
- Works without JavaScript: static content (text, images, links) all render and function. Reveal animations and stat counter degrade gracefully (content shows as visible immediately).
- Folder is self-contained: no relative imports outside `SCRAPKART MAIN PAGE/`. The folder can be moved to its own repo later without code changes.

---

## Out of scope for the spec, decided in implementation

- Final stat numbers (placeholder values: ₹2.4Cr+, 80+, 12 — replace with real ones later).
- Final body copy (manifesto, card descriptions, taglines) — first draft per spec, founder edits later.
- Specific Unsplash photos for the hero inset and any other imagery — pick best fit during build.
- Exact hairline weight on borders (1px standard, but possible 0.5px on retina hairline if it reads better).

— *End of design spec.*
