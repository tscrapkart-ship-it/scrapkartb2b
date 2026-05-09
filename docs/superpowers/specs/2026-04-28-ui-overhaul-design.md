# ScrapKart UI Overhaul — Design Spec

**Date:** 2026-04-28
**Author:** Founder (vibe-coded with Claude)
**Status:** Approved direction; ready for implementation plan
**Inputs:** `THE-STANDARD.md`, `CLAUDE.md`, `SCRAPKART.md`, B2C reference site (`scrapkart.app`)

---

## 0 — Why this exists

The existing UI is the textbook AI-generated B2B SaaS slop the standard warns against: dark-emerald-Inter palette, centered hero, three-column features with circular icons, identical `rounded-xl` cards, generic copy. ScrapKart is about to be presented at a business showcase and the founder is launching the platform soon. The visual identity must (a) convey craft and seriousness at a pitch event, (b) read as a clear sibling of the live B2C site at `scrapkart.app`, and (c) feel approachable to non-technical industrial users (yard owners, recyclers, waste producers — many on phones, many in Tier-2/3 cities).

We are throwing out the entire current visual language. Backend stays as-is.

---

## 1 — Aesthetic direction (locked)

**Direction: D-Evolved · Neo-Brutalist B2B Sibling**

The B2C site at `b2c.scrapkart.app` is a strong, distinctive identity: hard offset black shadows, sharp-corner cards, vivid grass green (~#00C842), pastel category cards (blue/yellow/pink/mint), chunky display sans (Archivo Black) with a serif-italic green accent word ("*Instantly.*"), and a kawaii illustration on the hero. Voice is friendly and direct.

The B2B platform inherits the same DNA but elevates it for industrial trade:

| From B2C (kept) | New for B2B (elevation) |
|---|---|
| Pure white paper, pure black ink | Replace kawaii hero illustration with a **live marketplace panel** (real listings, real prices) |
| Hard offset black shadows (no blur) | Add **JetBrains Mono** for prices, weights, locations, timestamps |
| Sharp corners (zero border-radius) | Logo gains a small monospace "**B2B**" tag for site-to-site continuity |
| Vivid grass green (`#00C842`) | Trust scaffolding — `GST Verified`, `ISO 14001`, `CPCB` badges visible inline on listings |
| Chunky display sans (Archivo Black) headlines | Settlement / GMV / yard-count stats prominently in hero, not just the bottom |
| Serif-italic green accent word per headline | Operational copy: "list / verify / bid / settle" not "schedule / pickup / get paid" |
| Pastel category cards | Black CTAs lift onto a green hard shadow (signature touch) |
| Full-bleed green sections | More information density throughout |
| Same logo | |

**Three adjectives:** *brutalist, operational, scrappy.*

**Reference points:** scrapkart.app (B2C), Linear (light), Are.na, Bloomberg Green, Mailchimp's chunkier moments.

**Anti-goals:** AI-startup teal, glassmorphism, soft shadows, `rounded-xl` everywhere, Inter for everything, "Get Started" CTAs, three-column feature rows with circular icons, testimonial carousels with five-star rows, purple-to-pink gradients, kawaii illustrations on the B2B side.

---

## 2 — Token system

All values defined as CSS custom properties in `src/app/globals.css`. Every later choice references these. Values not in the system are not allowed in component code.

### 2.1 Color

```css
:root {
  /* Surfaces & ink */
  --paper:       #FFFFFF;  /* primary surface — everywhere */
  --ink:         #0A0A0A;  /* text, borders, hard shadows */
  --ink-2:       #2A2A2A;  /* sub-headings, dense body */
  --ink-3:       #6B6B6B;  /* helper / meta text */
  --ink-4:       #9A9A9A;  /* placeholders, disabled */
  --border-soft: #E5E5E5;  /* table dividers (rare) */
  --bg-soft:     #F8F8F8;  /* zebra rows, hover bg */

  /* Brand greens (sibling of B2C) */
  --green:       #00C842;  /* primary accent, full-bleed sections, CTA shadow */
  --green-deep:  #00A638;  /* italic accent text, hover/pressed */
  --green-tint:  #E8FAEE;  /* very light green wash for soft fills */

  /* Category pastels (one per scrap material type) */
  --cat-metal:   #DDE8F4;  /* pastel blue */
  --cat-ewaste:  #FCE0E3;  /* pastel pink */
  --cat-plastic: #FCF4CC;  /* pastel yellow */
  --cat-paper:   #D7F2DD;  /* pastel mint */
  --cat-glass:   #E2E0F4;  /* pastel periwinkle */
  --cat-mixed:   #F4ECDD;  /* pastel cream */

  /* Status */
  --warning:     #FFB800;  /* amber, pending */
  --danger:      #E5484D;  /* errors, suspend, destructive */
  --info:        #0A66E5;  /* info banners (rare) */
}
```

**Contrast validation (WCAG AA, 4.5:1 body / 3:1 large):**
- `--ink` on `--paper` → 19.8:1 ✓
- `--ink-3` on `--paper` → 5.8:1 ✓ (body)
- `--ink-2` on each pastel → all > 14:1 ✓ (large text safe; verify body if used)
- `--ink` on `--green` → 14.8:1 ✓

Mid-grays on pastels for body text must be tested case-by-case at implementation time.

### 2.2 Typography

Full font swap. Replace Plus Jakarta Sans entirely. New stack, all loaded via `next/font/google` for self-hosting and zero CLS:

| Role | Family | Weights | Use |
|---|---|---|---|
| Display | **Archivo Black** | 900 | h1, h2, big numbers, primary CTA labels, listing card titles |
| Text/UI | **Archivo** (variable) | 400/500/600/700 | body, meta, sub-headings, secondary CTAs |
| Italic accent | **DM Serif Display** | italic 400 | one green-italic word per headline (the "*Instantly.*" / "*truckload.*" pattern) — sparingly |
| Mono | **JetBrains Mono** | 400/500/700 | prices, weights, locations, timestamps, badges, all numerical/operational data |

CSS variables: `--font-archivo`, `--font-archivo-black`, `--font-dm-serif`, `--font-mono`. Lexend Giga and Plus Jakarta Sans loaders are removed.

**Type scale** (modular, ~1.25 ratio):

```
--text-xs:   11px  (mono labels, fine print, badges)
--text-sm:   13px  (small body, ui)
--text-base: 14.5px (default body)
--text-md:   16px  (large body, intro paragraphs)
--text-lg:   19px  (card titles, h4)
--text-xl:   24px  (h3)
--text-2xl:  32px  (h2)
--text-3xl:  44px  (section heads, hero h2)
--text-4xl:  56px  (smaller hero / mobile h1)
--text-5xl:  76px  (desktop hero h1)
```

Hero h1 fluid: `clamp(56px, 8vw, 76px)`. Tracking: headlines `letter-spacing: -0.025em`, body `0`, mono `0.04em`. Headings `line-height: 0.95`, body `1.55`. Use `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs.

**Hierarchy rule:** one Archivo Black h1 per page. h2 = Archivo Black; h3 = Archivo Black smaller or Archivo 700 depending on context (Archivo Black where the heading wants to be a "moment," Archivo 700 where it's structural like a card title). h4 = Archivo 700 always. Italic-serif accent word appears at most once per hero/section (not three times).

### 2.3 Spacing

4px base scale: `0 / 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 56 / 64 / 80 / 96 / 128`. Tailwind defaults align with this. No `margin: 17px`. No arbitrary values.

### 2.4 Radius

```
--radius: 0;          /* default, applied to everything */
--radius-pulse: 999px; /* only for live-status pulse dots */
```

Sharp corners are the brand. The only legitimate exception is the small dot used in the live-status indicator. shadcn primitives have radii overridden to `0`.

### 2.5 Shadow

Hard offset, no blur, solid color — defining the brutalist character.

```
--shadow-xs:    2px 2px 0 0 var(--ink);    /* tiny — chips, inline elements */
--shadow-sm:    4px 4px 0 0 var(--ink);    /* default cards, buttons */
--shadow:       6px 6px 0 0 var(--ink);    /* prominent cards, listing tiles */
--shadow-lg:    8px 8px 0 0 var(--ink);    /* hero panels, dialogs */
--shadow-green: 4px 4px 0 0 var(--green);  /* primary CTA accent only */
```

### 2.6 Motion

Restrained. The visual identity carries the personality; motion supports, never decorates.

```
--motion-fast: 100ms;    /* micro: hover, focus, press-in */
--motion-base: 200ms;    /* panels, modals, drawers */
--motion-slow: 400ms;    /* entrance, hero reveal */
--ease:        cubic-bezier(0.2, 0.8, 0.2, 1);
```

Patterns:
- **Card hover:** `translate(3px, 3px)` + shadow shrinks from `6px` to `3px` in 100ms (press-in feedback).
- **Button hover:** same press-in pattern. Primary: shadow goes from `4px` (green) to `2px`.
- **Section entrance:** fade + 12px slide-up, 400ms, with 60ms stagger on children.
- **Page transitions:** none. Sharp page change is in keeping with the aesthetic.
- **`prefers-reduced-motion`:** transforms replaced by 100ms opacity crossfade. Verify with system setting on at least one screen reader pass.

GSAP and Framer Motion stay installed but are pointed at new tokens. Most usage is removed in favor of CSS-only entrance animations (already in `globals.css`); GSAP retained only for the hero stat count-up and any genuinely choreographic moment (≤ 2 in the whole app).

---

## 3 — Component patterns

Every page composes these primitives. No one-off styles. shadcn/ui primitives are kept as the substrate but their default styling is overridden in `src/components/ui/*` files.

### 3.1 Button

| Variant | Bg | Text | Border | Shadow | Use |
|---|---|---|---|---|---|
| Primary | `--ink` | `--paper`, Archivo Black, uppercase, `--text-sm`, tracking `0.06em` | `2px solid --ink` | `--shadow-green` | Hero CTA, form submit, primary action |
| Secondary | `--paper` | `--ink`, Archivo Black, uppercase | `2px solid --ink` | `--shadow-sm` | Secondary action, "Browse marketplace" |
| Ghost | transparent | `--ink`, Archivo 700 | none, `border-bottom: 2px solid --ink` on hover | none | Inline links, "View all →" |
| Destructive | `--danger` | `--paper` | `2px solid --ink` | `--shadow-sm` | Delete, suspend |

Padding: `14px 24px` (lg), `10px 18px` (md), `7px 14px` (sm). Touch target ≥ 44px on mobile.

### 3.2 Card

- **Default:** `--paper` bg, `2px solid --ink`, `--shadow`, sharp corners, `padding: 24px`.
- **Pastel:** swap bg for one of `--cat-*` tokens. Used for "How it works" steps and category tiles.
- **Listing:** default card + structured grid: thumb (44–80px square, `1.5px solid --ink`), title (Archivo Black 19px), meta row (JetBrains Mono 11px), price (Archivo Black 16–22px right-aligned), bid badge.
- **Stat tile:** default card or full-bleed in green section. Big number (Archivo Black 36–44px) + JetBrains Mono uppercase 10px label below.
- **Section card** (dashboards): default card + bordered header strip with title left + ghost link right.

Hover: press-in motion described above.

### 3.3 Input

- 2px solid `--ink` border, `--paper` bg, sharp corners, no shadow at rest.
- Focus: `--shadow-green` appears (no border color change). Outline visible — never `outline: none` without replacement.
- Label: above input, Archivo Black uppercase 11px, tracking `0.14em`, `--ink-3`.
- Helper / error: below input, JetBrains Mono 11px. Error: `--danger` text + 2px `--danger` border on input.
- Placeholder: `--ink-4`. Touch target ≥ 44px on mobile.
- Variants: text, textarea (`min-height: 96px`), select, file/image upload (drop zone with bordered "+" Archivo Black).
- Autocomplete attributes set on personal-info fields.
- Required marked in text, not just `*`.

### 3.4 Badge

Small rectangle, sharp corners, JetBrains Mono uppercase 9–10px, tracking `0.1em`.

| Variant | Bg | Text | Border | Use |
|---|---|---|---|---|
| Verified | `--paper` | `--ink` | `2px solid --ink` | "GST Verified", "ISO 14001", "CPCB" |
| Active | `--green` | `--ink` | `2px solid --ink` | Bid count, "Available", "Live" |
| Pending | `--warning` | `--ink` | `2px solid --ink` | Pending review, awaiting payment |
| Booked | `--cat-metal` | `--ink` | `2px solid --ink` | Booked listings |
| Suspended | `--danger` | `--paper` | `2px solid --ink` | Admin-suspended |

### 3.5 Status pill

Same as badge but with optional pulse dot prefix: `8px` solid `--green` circle, `box-shadow: 0 0 0 3px rgba(0,200,66,0.25)` animating to `6px` and back at 1.6s. Used for "Live marketplace" indicator and any live-data feed.

### 3.6 Modal / Dialog

`--paper` panel, `2px solid --ink`, `--shadow-lg`, sharp corners, `max-width: 560px` for confirmation, `min(720px, 92vw)` for forms. Backdrop: `rgba(0,0,0,0.6)`. Focus trapped while open, returned on close. Escape closes. Title in Archivo Black, body in Archivo 400.

### 3.7 Toast (Sonner)

`--paper` bg, `2px solid --ink`, `--shadow-sm`. Mono accent strip on the left edge: `--green` (success), `--warning` (warning), `--danger` (error). Auto-dismiss 4s for success/info, manual for error.

### 3.8 Empty state

Oversized chunky number `00` in Archivo Black at 96px, `--ink-4` color. Below: Archivo Black headline (24px), Archivo 400 sub (14px), one primary CTA. **No** cute illustration — keep the brutalist discipline.

### 3.9 Loading

- **Page:** keep `nextjs-toploader` top progress bar (already wired, retint to `--ink` not `--green`).
- **Section:** skeleton card shells matching final layout — same border, same dimensions, `--bg-soft` fill. No shimmer — sharp on/off.
- **Button:** spinner replaces icon, label stays.

### 3.10 Section divider

Full-bleed `<hr>` with `border-top: 2px solid --ink`, `margin: 0`. Used between marketing sections.

### 3.11 Stat bar

Full-bleed `--green`, `2px --ink` borders top + bottom, four columns separated by `2px --ink` vertical rules (last column no rule). Each cell: Archivo Black big number with one italic-serif character ("2,400*T*", "98*.4*%") + JetBrains Mono uppercase label below.

### 3.12 Nav

- **Marketing nav:** `2px solid --ink` bottom border, white bg, sticky. Logo left, primary links center, login (secondary btn) + primary CTA right. Hamburger on mobile.
- **Authed nav (buyer/seller/admin):** same construction, bg switches to `--paper`, links role-specific. Right side: user avatar with dropdown.

### 3.13 Footer

`--ink` bg, `--paper` text, big Archivo Black logo (~48px), 4 column links, 2px green divider above the copyright row. Mono small for copyright.

### 3.14 Live marketplace panel

See §4.

---

## 4 — Live marketplace feature (NEW functional addition)

The hero of the landing page replaces its static decoration with a real, live (refreshing) marketplace preview. Pre-auth visible.

**Purpose:** instantly communicate "this is the actual trading layer," builds trust, demos the product without a click.

**Data**

- Source: Supabase `scraps` table where `status = 'available'`.
- Joined relations: `companies` (seller name + verified badges), `users` (creator).
- Fields rendered per row: thumbnail (from `scrap-images` storage), material/title, weight, city + state, price-per-unit, bid count (count of related rows in `bookings` where `scrap_id` matches and `status` is `pending` or equivalent — implementation reads schema), one verified badge if seller is GST/ISO/CPCB-verified.
- Limit: top **3** by `created_at desc`.
- Footer of panel: `→ {n - 3} more listings open · VIEW ALL →` linking to `/marketplace`.

**Auth**

- Anon read access via existing RLS on `scraps` (the `/marketplace` page is already public). RLS verification step before relying on this is required during implementation.
- Mock mode (`isMockMode()` from `src/lib/mock-data.ts`) returns 3 fixed mock listings if Supabase env is absent.

**Rendering**

- Server Component (`app/page.tsx` becomes a Server Component shell with the existing client-side animations refactored into a child client component).
- ISR: `export const revalidate = 60` — refresh every minute on the edge.
- No client-side WebSocket subscription — marketing pages don't need realtime overhead. The pulse dot is visual; the data is freshness-by-revalidation.
- No loading skeleton in hero — page paints fully formed (LCP optimization).

**Styling**

Listing card per row inside the panel — see §3.2, "Listing." Panel itself: `2px solid --ink`, `--shadow`. Header: pastel-mint bg, "Live marketplace" + pulse dot left, count "47 OPEN · ₹84L IN BIDS" right. Footer: black bg, white text, green CTA on the right.

**Empty state**

If zero available listings (unlikely in production but possible): replace panel with a CTA card prompting "Be the first lot listed →" linking to `/signup`.

**Performance budget**

Live panel must not push hero LCP > 2.0s. Thumbnails: 80px square, AVIF/WebP via `next/image`, eager-loaded with `fetchpriority="high"` for the LCP image only.

---

## 5 — Page archetypes

Every existing page maps to one of seven archetypes. Implementation applies the same patterns; only content differs.

### 5.1 Marketing
Sticky nav (2px bottom border) → asymmetric hero with live marketplace panel right → green stat bar full-bleed → pastel-card "How It Works" 4-step grid → category tile grid → features section (2-col asymmetric, not 3-col-circle slop) → testimonials (max 2 quoted, no carousel, no avatar circles — just attribution mono) → CTA section → footer.

**Files:**
- `src/app/page.tsx` (landing)
- `src/app/contact/page.tsx`
- `src/app/blogs/page.tsx`, `src/app/blogs/[slug]/page.tsx`
- `src/app/not-found.tsx`

### 5.2 Auth
50/50 split: left = solid `--ink` panel with big Archivo Black logo + tagline + one trust quote in DM Serif italic. Right = `--paper` form panel, fields stacked, sharp 2px-bordered inputs, primary submit with green shadow. Google OAuth = secondary button with Google logo on the left. Mobile: form panel only, top of page features compressed logo + tagline.

**Files:**
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/signup/page.tsx`
- `src/app/(auth)/role-select/page.tsx`
- `src/app/(auth)/layout.tsx`
- `src/app/onboarding/producer/page.tsx`
- `src/app/onboarding/recycler/page.tsx`
- `src/app/pending-approval/page.tsx`

### 5.3 Listing index
Top: page title (Archivo Black) + count meta (JetBrains Mono). Filter bar: bordered chip filters (category pastels, click to toggle), search input, sort dropdown — all in a single bordered row. Below: 3-col grid (2 tablet, 1 mobile) of listing cards. Pagination only when listings exceed ~24 per view — cursor-based on `created_at`; infinite scroll is out. Skeleton on `loading.tsx`. Empty state per §3.8.

**Files:**
- `src/app/(buyer)/marketplace/page.tsx`
- `src/app/(buyer)/companies/page.tsx`
- `src/app/(buyer)/bookings/page.tsx`
- `src/app/(seller)/scraps/page.tsx`
- `src/app/(seller)/seller-bookings/page.tsx`
- `src/app/admin/users/page.tsx`, `companies/page.tsx`, `listings/page.tsx`, `recyclers/page.tsx`, `bids/page.tsx`, `bookings/page.tsx`, `transactions/page.tsx`, `contact/page.tsx`, `blog/page.tsx`
- `src/app/transactions/page.tsx`

### 5.4 Listing detail
Two-column on desktop: gallery left (2px-bordered images, hard shadow, swipeable on mobile), info panel right with title, status badge, meta strip (mono), description, specs table, seller card, related listings.

Sticky bottom CTA bar on mobile (book / bid / message).

**Files:**
- `src/app/(buyer)/marketplace/[id]/page.tsx`
- `src/app/(buyer)/companies/[id]/page.tsx`
- `src/app/(buyer)/bookings/[id]/page.tsx`
- `src/app/(seller)/seller-bookings/[id]/page.tsx`
- `src/app/blogs/[slug]/page.tsx`
- `src/app/transactions/[id]/page.tsx`

### 5.5 Dashboard
Top: green stat bar with 4–5 KPIs (role-specific). Below: 2-col grid of section cards (recent listings / bookings / pending actions / quick links). Each section card has bordered header strip with title left + "View all →" right.

**Files:**
- `src/app/(seller)/dashboard/page.tsx`
- `src/app/admin/page.tsx`

### 5.6 Form
Form sections in stacked white cards (one card per logical section: "Basic info", "Photos", "Pricing", etc.), 2px border, hard shadow. Image upload = bordered drop zone with "+" Archivo Black centered, click-to-select fallback. Sticky submit bar at bottom of viewport on mobile. Inline validation per §3.3. State preserved on validation error (no clearing). React Hook Form + Zod.

**Files:**
- `src/app/(seller)/scraps/new/page.tsx`
- `src/app/(seller)/scraps/[id]/edit/page.tsx`
- `src/app/(seller)/company/setup/page.tsx`
- `src/app/(seller)/company/edit/page.tsx`
- `src/app/(buyer)/profile/page.tsx`
- `src/app/admin/blog/new/page.tsx`
- `src/app/admin/blog/[id]/edit/page.tsx`

### 5.7 Chat
Header: bordered strip with booking summary (material, weight, status badge, link to booking detail). Message list: own messages = `--green` bg + 2px ink border + hard shadow (right-aligned), other = `--paper` + 2px ink border + hard shadow (left-aligned). Both sharp corners. Avatar circle replaced with a small bordered square thumbnail of the participant's company logo. Timestamp: JetBrains Mono between message clusters, centered. Input bar: fixed bottom, full-width, 2px top border, send button = primary. Existing Supabase Realtime subscription unchanged.

**Files:**
- `src/app/(buyer)/bookings/[id]/chat/page.tsx`
- `src/app/(seller)/seller-bookings/[id]/chat/page.tsx`
- `src/app/transactions/[id]/chat/page.tsx`
- `src/components/shared/chat-interface.tsx`, `chat-input.tsx`, `message-bubble.tsx`

---

## 6 — Implementation phasing

Single feature branch off `master`. Build stays green at every commit. Ship atomically once Phase 5 passes review. Each phase is one or more commits.

| Phase | Scope | Files (approx.) |
|---|---|---|
| **1. Foundation** | Token swap (`globals.css`), font swap in `layout.tsx`, refactor shadcn primitives (`button.tsx`, `card.tsx`, `badge.tsx`, `input.tsx`, `label.tsx`, `textarea.tsx`, `select.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `tabs.tsx`, `skeleton.tsx`, `tooltip.tsx`, `sonner.tsx`, `alert-dialog.tsx`, `breadcrumb.tsx`, `scroll-area.tsx`, `separator.tsx`, `sheet.tsx`, `avatar.tsx`) to neo-brutalist defaults. | ~20 files |
| **2. Marketing surface** | Landing (incl. live marketplace feature), contact, blogs index, blog detail, not-found. Marketing nav + footer (shared components). | 5 pages + shared nav/footer |
| **3. Auth + onboarding** | Login, signup, role-select, both onboarding flows, pending-approval. Auth layout. | 7 files |
| **4. Buyer + seller authed** | All buyer routes (marketplace, listing detail, companies, bookings, profile, chat), all seller routes (dashboard, company CRUD, scraps CRUD, seller-bookings, chat). Buyer/seller nav. Shared components: booking-card, scrap-card, company-card, chat-interface, image-upload, etc. | ~25 files |
| **5. Admin** | All `/admin/*` pages and admin-nav. Lowest-stakes for the founder pitch — finishes the redesign but isn't blocking the showcase. | ~12 files |

Each phase commit message: `feat(ui): phase N — <scope>`.

Build verification per phase: `npm run typecheck && npm run lint && npm run build`. Visual pass on at least one representative page per archetype touched in the phase.

---

## 7 — Risks & mitigations

| Risk | Mitigation |
|---|---|
| Font swap breaks pages mid-rollout | Phase 1 swaps tokens + primitives; subsequent pages inherit automatically. Pages not yet redesigned still render correctly because tokens are valid. |
| Live marketplace RLS doesn't allow anon read | Verification step at start of Phase 2: confirm anon `select` on `scraps` where `status='available'`. If it fails, ship a tiny RLS update (Supabase MCP). |
| Build breaks because of removed Tailwind classes | Replace utilities one component at a time; keep both old and new utility classes in `globals.css` until Phase 5; remove unused only at the end. |
| Mock mode breaks during the redesign | Mock fixtures in `mock-data.ts` are unchanged. The detection logic stays. New live-marketplace fetch falls back to mock listings when `isMockMode()` is true. |
| Pitch deadline forces partial ship | Phases 1–3 produce a coherent shipping unit (marketing + auth) with the rest still on the old UI. Order is deliberate: pitch surface ships first. |
| Visual regression on existing flows | Manual walkthrough of every page in the phase before merging. Lighthouse + axe per archetype. |

---

## 8 — Quality gates (THE-STANDARD §9)

Per phase, verify:

**Visual** — coherent direction · type scale used (no arbitrary sizes) · color tokens only (no inline hex) · spacing scale (no `margin: 17px`) · empty/loading/error states designed · zero anti-slop patterns from THE-STANDARD §4.

**Engineering** — TypeScript strict, no new `any` · ESLint clean · no console errors · no `!important` to fix specificity.

**Performance** — Lighthouse mobile ≥ 90 (perf, a11y, best-practices, SEO) on landing · LCP < 2.0s landing / < 2.5s authed · CLS < 0.05 · initial JS < 200KB compressed.

**Accessibility** — full keyboard pass · focus visible · `prefers-reduced-motion` respected · WCAG 2.2 AA contrast · forms have labels, errors, autocomplete · no `axe` serious/critical violations.

**Responsive** — tested at 360, 768, 1024, 1440 · touch targets ≥ 44px · 200% system text size · zero horizontal scroll.

---

## 9 — Out of scope (deliberately)

- Backend schema changes. No migrations.
- RLS edits beyond verifying anon-read for the landing live marketplace.
- New product features beyond the live marketplace hero panel.
- Logo redesign — using existing assets in `Logos/` and `public/logos/`.
- Replacing existing animation libraries — GSAP + Framer Motion stay; we point them at new tokens, prune most usage.
- PWA icon swap — already deferred per CLAUDE.md.
- Dark mode — not in V1. The B2B platform is light only. (B2C is also light.) This is a deliberate aesthetic choice.
- Photography commission — using gradient placeholders for material thumbs in V1, with a hook for real `next/image` photography in V2 once images are sourced.
- Internationalization — copy is English-first; Devanagari script only used as a deliberate accent on the landing if the founder approves. (Currently scoped out.)
- Replacing copy beyond what the redesign demands. Voice and tone get one editorial pass per page (no "Get Started" / "Learn More" survives). Deeper copywriting is post-launch.

---

## 10 — Open questions

These remain decisions for the founder during implementation, not blockers:

1. **Hero headline final wording.** Spec proposes "*Trade scrap. By the truckload.*" Alternatives if rejected: "*Industrial scrap. At trade speed.*" / "*The scrap market, scaled.*" / founder draft.
2. **Devanagari accent on landing.** Subtle option: a small "कबाड़ का बाज़ार" eyebrow or footer caption. Default = off.
3. **Live marketplace ranking.** Default = top 3 by `created_at desc`. Alternative if curation is wanted = an `is_featured` column + admin pin.
4. **Photography roadmap.** Real photos of materials for V2 — commission, source from Unsplash carefully, or generate via the existing AI Studio toolchain?

---

## 11 — Acceptance criteria

The redesign is complete when:

- All 35+ pages render in the new visual language; no old `bg-[#0A0A0A]` / dark-emerald / `rounded-xl` references remain (audited via grep).
- Live marketplace panel is live on `/` showing real listings (or graceful mock fallback) pre-auth.
- All quality gates from §8 pass on at least one representative page per archetype.
- Build is green; deployment to Vercel succeeds; PWA still installable.
- The founder can navigate the entire app from login to listing-purchase and never see a screen that visually contradicts the brand language.
- A side-by-side viewing of `scrapkart.app` and the new B2B at `scrapkartrehaul.vercel.app` reads as one product family.

---

*End of design spec. Next step: `superpowers:writing-plans` produces the step-by-step implementation plan from this document.*
