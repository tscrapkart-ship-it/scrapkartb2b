# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## How This Project Is Being Built

The user is **vibe coding** this entire project — building it end-to-end through AI-assisted development. There is no separate dev team. Claude Code is the primary coding collaborator throughout the full lifecycle.

**What this means in practice:**
- Proactively explain decisions, not just write code. The user learns as we build.
- When multiple valid approaches exist, state the tradeoff and recommend one — don't ask the user to decide on technical details they shouldn't need to worry about.
- During **Supabase integration** (auth, database schema, RLS, storage, realtime), take the lead: write the SQL, generate the migration files, set up the client utilities, and walk the user through what to do in the Supabase dashboard step-by-step.
- Keep momentum. Prefer completing a feature end-to-end rather than stopping to ask about every small detail.
- If something is a V1 placeholder (see below), say so clearly rather than over-engineering it.

**Working preferences (durable — confirmed across multiple sessions):**
- **Backend stays untouched unless explicitly authorized.** If a frontend task requires a schema, RLS, or trigger change, surface it as a separate question first — don't quietly apply migrations.
- **Test locally before pushing.** Default flow is: build → user views localhost → user explicitly says "push" → then commit + push. Never run `git push` proactively at the end of a task.
- **Commit messages omit Claude co-author trailers.** Use the user's name only. Do NOT append `Co-Authored-By: Claude ...` lines.
- **When the user signals confusion or overwhelm ("a bit confused", "revert", "wait")**, drop multi-step lists and serve one step at a time. Wait for "done" before the next step.
- **B2B aesthetic must look professional, not like B2C-sibling.** The founder rejected an earlier attempt at B2C-style playfulness. Refined Premium (paper / forest / Fraunces italic) is the locked direction.

---

## Project Status

**All phases complete including admin dashboard and seed data. App is live on Vercel.** Full product context, domain model, user journeys, and feature scope are documented in `SCRAPKART.md`.

### What's been built
| Phase | Scope | Status |
|---|---|---|
| 1 | Project init, Tailwind design tokens, initial fonts, root layout (fonts later replaced — see Phase 12) | ✅ Done |
| 2 | Supabase client/server setup, TypeScript domain types, middleware auth guard | ✅ Done |
| 3 | Auth flows — login, signup, role selection (`(auth)/`) | ✅ Done |
| 4 | Seller dashboard — company profile CRUD, scrap listing CRUD, image upload | ✅ Done |
| 5 | Buyer marketplace — browse listings, category filter, company profiles, booking creation | ✅ Done |
| 6 | Post-booking chat — Supabase Realtime messaging per booking thread | ✅ Done |
| 7 | Landing page — hero, stats, how-it-works, categories, features, testimonials, CTA, footer | ✅ Done |
| Supabase | Schema + RLS + storage buckets applied to live project via MCP | ✅ Done |
| UI/UX (v1) | Full frontend overhaul — dark theme, emerald palette, Plus Jakarta Sans. **Superseded by Phase 12** | ⚠️ Replaced |
| 8 | PWA (`@ducanh2912/next-pwa`, `manifest.json`, icons) + Vercel deploy | ✅ Done |
| 9 | Admin dashboard — `/admin/*` route, all 5 pages, admin role + RLS | ✅ Done |
| 10 | Seed/test data — 5 test accounts live in Supabase with companies, listings, bookings, messages | ✅ Done |
| 11 | Google OAuth — Sign in/up with Google on login + signup pages, DB trigger, smart callback routing | ✅ Done |
| 12 | **Refined Premium UI overhaul** — full repaint from dark theme → light paper/forest/mint palette across all 35+ screens. Fraunces serif accents, Inter Tight body, hand-crafted shadows | ✅ Done |
| 13 | **Landing image pass** — hybrid bg-image approach across hero / how-it-works / categories / why / cta sections (`herobg`, `hiwbg`, `categoriesbg`, `whybg`, `ctabg`) | ✅ Done |
| 14 | **Marketing nav redesign** — floating glass pill on scroll, edge-to-edge transparent at top, scroll progress bar, animated mint underlines, IntersectionObserver-driven active section highlighting, hover lift on logo | ✅ Done |
| 15 | **Logo + brand refresh** — user re-cropped white/black logos to 6.5:1 banner aspect. All 4 navs (marketing/admin/buyer/seller), OG card generator, and PWA icon generator updated to match | ✅ Done |
| 16 | **Two-repo split** — landing page (`scrapkart.app`) extracted to its own repo as plain HTML/CSS/JS. This Next.js app is now B2B-only and deploys to `b2b.scrapkart.app` | ✅ Done |

### GitHub & Deployment
- **GitHub (B2B app, this repo):** `https://github.com/tscrapkart-ship-it/scrapkartb2b.git` (branch: `master`)
- **GitHub (umbrella landing, sister repo):** `https://github.com/tscrapkart-ship-it/scrapkartlandingpage.git` — lives in `../main page/`, plain HTML/CSS/JS, owns `scrapkart.app`
- **Deployed:** Vercel (connected to GitHub repo — auto-deploys on push to `master`)
- **Production domain:** `https://b2b.scrapkart.app` (B2B subdomain). The umbrella `https://scrapkart.app` is a separate Vercel project serving the landing site.
- **Supabase Auth allow-list** includes `https://scrapkart.app`, `https://*.scrapkart.app/auth/callback` (covers `b2b.` and future subdomains), the Vercel preview pattern `https://*-tscrapkart-ship-it.vercel.app/auth/callback`, and `http://localhost:3000/auth/callback` for local dev.
- **Build command:** `next build --webpack` (required for `next-pwa` service worker generation — Turbopack is incompatible with PWA webpack plugins)

### What's next
1. **Admin: suspend/activate users** — the users table has no `suspended` column yet; admin users page shows all users but the suspend action is not yet wired up
2. **Google OAuth — publish consent screen** — currently in test mode (only added test users can sign in via Google). Before public launch, go to Google Cloud Console → OAuth consent screen → Publish App
3. **Compress `whybg.jpg`** — currently ~14.5 MB on disk. Should down-sample to ~500 KB without visible quality loss
4. **Final landing polish pass** — user mentioned "one final change to the landing page" but never specified what; ask before next session

### Installed Animation Libraries (current)
- `framer-motion` — auth page transitions (login, signup, role-select) and various reveal components in `src/components/shared/reveal.tsx`, `motion.tsx`, `parallax-image.tsx`
- `lenis` (`^1.3`) — page-wide smooth scroll, wired in `src/components/shared/lenis-provider.tsx` and mounted in `layout.tsx`. Respects `prefers-reduced-motion`. Lenis **does** dispatch native scroll events, so `window.scrollY` listeners still work (this matters for the marketing nav's pill-on-scroll behavior).
- `nextjs-toploader` — thin 2px forest-color progress bar at top during route transitions. Configured with `color="#0F4D2A" height={2} showSpinner={false}` in `layout.tsx`. Note: this is a **different** bar from the marketing nav's scroll progress bar — toploader fires on navigation, the nav bar tracks scroll position.
- `sonner` — wired into root layout via `<Toaster />`
- **`gsap` removed** — was used in earlier dark-theme version; the Refined Premium overhaul replaced GSAP animations with CSS + Framer Motion. Do not reintroduce unless required.

### Refined Premium UI Overhaul — Active Aesthetic (2026-05)
**The earlier dark-theme overhaul (2026-04-03) has been fully replaced.** Don't re-introduce the dark `#0A0A0A` / `#10B981` emerald palette. The current direction is "Refined Premium" — light paper surfaces, deep forest brand, Fraunces serif italic accents, hand-crafted shadows. Reference spec: `docs/superpowers/specs/2026-04-29-refined-premium-foundation-design.md`.

**Global changes:**
- `src/app/globals.css` — full token re-write (see Design Tokens table below). Surfaces are paper `#FAFAF7`, ink is near-black, brand is deep forest `#0F4D2A`, mint accent `#34D399` reserved for hover/active hairlines
- `src/app/layout.tsx` — three Google fonts: **Inter Tight** (body/display), **Fraunces** (serif italic, used for accent words like "_real weight_" or "_Repeat._"), **JetBrains Mono** (eyebrow captions, badges). NextTopLoader + LenisProvider mounted at root
- `Toaster` from sonner wired in root layout

**Landing page (`src/app/page.tsx` + `src/components/landing/*`):**
- **Hero** — full-bleed `/herobg.jpg` (aerial forest road) with low-opacity paper gradient overlay (left-heavy: 0.82 → 0.16), plus a paper fade strip at bottom. "Trade scrap. Build a _greener_ industry." with Fraunces italic accent. Live marketplace panel sits on the right.
- **How It Works** — split layout: 2×2 step grid on the left, sticky `/hiwbg.jpg` image card (`aspect-[4/5]`) on the right. Section ID `how-it-works` is what the marketing nav's IntersectionObserver watches.
- **Categories Grid** — banner image strip on top (`/categoriesbg.jpg`), then cards. Icons live as faded right-side watermarks (`opacity-[0.10]`, `size-[150px]`), not top-left.
- **Why Section** — full-bleed `/whybg.jpg` with dark forest gradient overlay (`rgba(8,43,25,0.72) → rgba(15,77,42,0.78)`). White heading with `#34D399` mint italic accent. Three paper cards inside hold the actual copy (the image bg was too busy for direct text).
- **CTA Band** — intentionally plain: white bg, centered, asymmetric padding (`pt-40 pb-16 md:pt-52 md:pb-20`) to vertically position the content. "Ready to _trade?_". The image bg version was tried and rejected.

**Marketing nav (`src/components/shared/marketing-nav.tsx`):**
- Sticky, edge-to-edge transparent at the very top
- On scroll past 8px, animates into a **floating frosted pill**: `mt-3 px-5 rounded-full bg-[rgba(250,250,247,0.78)] backdrop-blur-xl shadow-[0_10px_30px_rgba(15,77,42,0.08)] border border-white/50`, 300ms transition
- **Scroll progress bar** — `fixed top-0` 2px `bg-[var(--forest)]` bar with `transform: scaleX(progress)` based on `window.scrollY / (scrollHeight - innerHeight)`
- **Animated mint underlines** on hover — `<span>` with `bg-[#34D399]` and `group-hover:scale-x-100`
- **Active section highlighting** — IntersectionObserver on sections whose `id` matches `NAV_LINKS[i].sectionId`. When in view, link turns forest green and underline stays at `scale-x-100`. Currently wired for `#how-it-works`; extend by adding more sectionIds.
- **Logo hover lift** — `hover:-translate-y-px`
- B2B badge sits next to the logo

**Auth pages** (`src/app/(auth)/`): light paper surfaces, forest CTA, Framer Motion page transitions.

**All buyer + seller + admin pages**: paper bg, forest accents, mint highlight on active nav items via `bg-[var(--forest-tint)]`.

### Supabase MCP
**Status: Connected and working** (via terminal/CLI — as of 2026-03-26).

The Supabase MCP server is authenticated and operational when using Claude Code via terminal. Claude can run migrations, execute SQL, apply RLS policies, and manage the Supabase project directly — no manual dashboard work needed.

- MCP type: `http` at `https://mcp.supabase.com/mcp`
- Auth: OAuth token stored in `~/.claude/.credentials.json` under `mcpOAuth.supabase`
- **Note for VS Code extension users**: The MCP may show as "not connected" in the extension because it loads via the CLI plugins system (`~/.claude/plugins/`), which the extension doesn't read. Re-authenticate via `/mcp` inside the extension if needed.

### Supabase Project
- **Project:** `scrapkartremastered` (ID: `nlbkvnrmcjjuvubvifbt`, region: `ap-northeast-1`)
- **URL:** `https://nlbkvnrmcjjuvubvifbt.supabase.co`
- **Env vars:** Set in `.env.local` (real values, not placeholders — app is live, not in mock mode)
- **Schema:** All 5 tables live with RLS enabled: `users`, `companies`, `scraps`, `bookings`, `messages`
- **Storage:** `company-logos` and `scrap-images` buckets created (public)
- **Realtime:** Enabled on `messages` table
- **Auth:** Email + password. Signup sends confirmation email. Confirmation links and OAuth redirects point to `https://scrapkart.app` (the canonical Site URL in Supabase Auth → URL Configuration). The Redirect URLs allow-list also includes `https://*.scrapkart.app/auth/callback` (covers `b2b.` and any future subdomains), the vercel preview pattern `https://*-tscrapkart-ship-it.vercel.app/auth/callback`, and `http://localhost:3000/auth/callback` for local dev.
- **Auth bug fixed (2026-03-26):** Signup now shows "check your email" screen instead of prematurely redirecting to `/role-select` before email is confirmed.
- **Google OAuth (2026-03-29):** Enabled in Supabase. Google Cloud project: `scrapkart-491711`. OAuth client credentials stored in Supabase Auth → Providers → Google. `public.users.role` is nullable to support new OAuth users who haven't picked a role yet. DB trigger `handle_new_user()` auto-inserts into `public.users` on every new auth signup (email or OAuth).
- **Auth callback (`src/app/auth/callback/route.ts`):** After OAuth, checks user's role and routes to `/admin`, `/dashboard`, `/marketplace`, or `/role-select` as appropriate.

### Mock Data Mode
The app is currently connected to real Supabase — mock mode is inactive. Mock mode still exists as a fallback: `isMockMode()` in `src/lib/mock-data.ts` detects a placeholder Supabase URL and switches all data fetching to local fixtures. If `.env.local` is ever reset to placeholder values, mock mode re-activates automatically.

---

## Commands

```bash
npm run dev       # Start development server (localhost:3000) — Turbopack, PWA disabled
npm run build     # Production build (runs next build --webpack — required for next-pwa)
npm run lint      # ESLint
npm run typecheck # tsc --noEmit
```

For shadcn/ui components:
```bash
npx shadcn@latest add <component>
```

No test framework has been chosen yet.

---

## Architecture

### Stack
- **Next.js App Router** — SSR/SSG for public marketplace pages, server components for performance
- **TypeScript** — strict typing across all domain models
- **Tailwind CSS + shadcn/ui** — design system (headless, fully customizable)
- **Supabase** — PostgreSQL, Auth, Realtime (chat/booking sync), Storage (images/logos)
- **next-pwa** — service worker, manifest, installability
- **Vercel** — deployment target

### Actual Directory Layout
```
src/
  app/
    (auth)/             # login, signup, role-select + layout (route group, no URL segment)
    (buyer)/            # marketplace, companies, bookings, chat, profile + layout
    (seller)/           # dashboard, company, scraps, seller-bookings, chat + layout
    admin/              # admin pages (real path /admin/*, NOT a route group — see Gotchas)
    auth/callback/      # Supabase OAuth callback route
    blogs/              # /blogs and /blogs/[slug] — public marketing surface
    contact/            # /contact
    onboarding/         # producer + recycler onboarding flows
    pending-approval/   # holding page for unapproved sellers
    transactions/       # /transactions for both buyer + seller (RLS filters by role)
    page.tsx            # Landing page (Refined Premium hero + sections)
    not-found.tsx
    layout.tsx          # Root layout — fonts, NextTopLoader, LenisProvider, Toaster
    globals.css
  components/
    ui/                 # shadcn/ui primitives
    shared/             # marketing-nav, marketing-footer, lenis-provider, reveal, motion,
                        # parallax-image, live-marketplace-panel, chat-interface, booking-card,
                        # company-card, scrap-card, image-upload, image-gallery, message-bubble
    landing/            # hero-stat-counter, how-it-works, categories-grid, why-section, cta-band
    auth/               # auth-specific components
    buyer/              # buyer-nav, marketplace-filters, scrap-grid, book-scrap-dialog
    seller/             # seller-nav
    admin/              # admin-nav and admin tables/cards
  lib/
    supabase/           # client.ts, server.ts, middleware.ts, storage.ts
    queries/            # live-listings.ts (server-side data fetchers for the landing page)
    hooks/              # use-realtime-messages.ts
    mock-data.ts        # Mock fixtures + isMockMode() helper
    utils.ts
  types/
    index.ts            # All TypeScript domain model types
  middleware.ts         # Route auth guard (role-based)
  fonts/                # Legacy Lexend Giga font files (unused, safe to delete)
scripts/
  generate-og-card.cjs       # Renders public/og-card.png from logo + brand gradient
  generate-pwa-icons.cjs     # Renders public/icons/{192,512,apple-touch-icon}.png
public/
  herobg.jpg, hiwbg.jpg, categoriesbg.jpg, whybg.jpg, ctabg.jpg   # Landing bg images
  logos/                                                          # All logo variants
  icons/                                                          # PWA icons
  og-card.png
  manifest.json
  sw.js, workbox-*.js, swe-worker-*.js   # Generated by next-pwa, gitignored
docs/
  superpowers/specs/2026-04-29-refined-premium-foundation-design.md   # Source-of-truth aesthetic spec
  superpowers/plans/2026-04-29-ui-overhaul.md
  superpowers/plans/2026-04-29-refined-premium-foundation.md
```

### Domain Models
Five core entities (see `SCRAPKART.md` §5 for full field list):
- **User** — role: `recycler` | `waste_producer` | `admin`
- **Company** — owned by waste producer (ownerId)
- **Scrap** — status: `available` | `booked` | `collected`; categories: Metal, E-waste, Plastic, Paper, Glass, Mixed Scrap
- **Booking** — links recycler + waste producer + scrap
- **Message** — scoped to booking conversation thread

### Design Tokens — Refined Premium (current)
Full set lives in `src/app/globals.css` `:root`. Always reference via CSS var (`var(--forest)`), never hard-code the hex inline unless you need a one-off opacity tweak.

| Token | Var | Hex | Usage |
|---|---|---|---|
| Paper (page bg) | `--paper` | `#FAFAF7` | Default body bg |
| Paper 2 | `--paper-2` | `#F4F2EC` | Secondary surface, button hover |
| Paper 3 | `--paper-3` | `#EFEDE5` | Tertiary surface |
| Ink (primary text) | `--ink` | `#0A0A0A` | Headings, primary body |
| Ink 2 | `--ink-2` | `#3A3A38` | Secondary body |
| Ink 3 | `--ink-3` | `#6E6C66` | Muted text, captions |
| Ink 4 | `--ink-4` | `#A4A29A` | Disabled, lowest contrast |
| Line | `--line` | `#E5E2D8` | Default borders |
| Line 2 | `--line-2` | `#EFEDE5` | Subtle dividers |
| **Forest (brand)** | `--forest` | `#0F4D2A` | Primary CTAs, active states, scroll progress bar |
| Forest 2 | `--forest-2` | `#0B3D1F` | Darker hover |
| Forest tint | `--forest-tint` | `#E8F0EA` | Active nav bg, soft callouts |
| Bark | `--bark` | `#1A2419` | Rare — deepest forest |
| **Mint (accent)** | inline `#34D399` | — | Hairlines, hover underlines, italic accent on dark sections. **Not a CSS var** — kept inline since it's intentionally rare |
| Warning | `--warning` | `#B96A11` | Amber-style warning |
| Danger | `--danger` | `#B0322A` | Errors, destructive |
| Info | `--info` | `#0F3D6E` | Info badges |
| Success | `--success` | `#0F4D2A` | Same as forest |

Spacing scale (`--space-1` to `--space-32`), radius scale (`--radius-xs` 4px through `--radius-xl` 16px), three whisper-level shadows (`--shadow-1/2/3`), and forest/ink rings (`--ring-forest`, `--ring-ink`) also defined.

Target aesthetic: monopo-saigon / Stripe Press / Mast Coffee — premium B2B, hand-feeling typography, paper not glass, deep forest brand. **Not** the recykal/rubicon dark theme (that was the prior version).

### Auth Pattern
- Supabase Auth with role stored in `users` table (`recycler` | `waste_producer` | `admin`)
- Three separate authenticated route groups: `(buyer)/`, `(seller)/`, and `src/app/admin/`
- Middleware (`src/lib/supabase/middleware.ts`) guards all routes by role and auth state
- **Admin route** is `src/app/admin/` (NOT a route group) — using `(admin)/` caused path conflicts with buyer routes like `/bookings` and `/companies`
- **Landing page `/`** is always visible — authenticated users with a role are redirected to their dashboard, but users without a role see the landing page (not forced to `/role-select`)

### Supabase Conventions
- Use server-side Supabase client in Server Components and API routes
- Use browser client in Client Components (with `'use client'`)
- Row Level Security (RLS) is the primary access control layer — enforce at the database level, not just in app logic
- Realtime subscriptions (chat, booking status) in client components only

### RLS Policy Intent
These are the access rules to enforce when writing RLS policies:
- **Waste Producer (seller):** can insert/update/delete only their own company and scrap listings (`ownerId = auth.uid()` / `sellerId = auth.uid()`)
- **Recycler (buyer):** read-only access to all `available` scrap listings and company profiles; cannot modify seller data
- **Bookings:** readable and writable only by the buyer or seller involved in that booking (`buyerId = auth.uid() OR sellerId = auth.uid()`)
- **Messages:** readable and writable only by participants of the linked booking — enforce via join to bookings table, not just sender/receiver fields
- **Users table:** users can read/update only their own row
- **Admin:** full read/write on all 5 tables via `public.is_admin()` SECURITY DEFINER function — avoids infinite recursion that would occur if the policy queried `users` directly

### V1 Scope Boundaries
Know what is real vs placeholder in V1, and don't over-engineer the placeholder parts:

| Feature | V1 Status |
|---|---|
| Auth | Real — Supabase Auth with role assignment |
| Company profile CRUD | Real |
| Scrap listing CRUD | Real |
| Marketplace browsing & filtering | Real (category filter; geospatial distance filter is UI-only in V1) |
| Booking creation | Real |
| Post-booking chat | Real — Supabase Realtime |
| Search | UI present, deep logic is limited in V1 |
| Payments | UI placeholder only — no gateway in V1 |
| Notifications | Not in V1 |
| Pickup scheduling | Not in V1 |
| Ratings & reputation | Not in V1 |
| Admin dashboard | ✅ Live — `/admin/*`, 5 pages, role-gated |

### Fonts
Three Google fonts loaded via `next/font/google` in `src/app/layout.tsx`:
- **Inter Tight** (`--font-inter-tight`) — body and display. The workhorse for headings, paragraphs, UI text. Weights 300–800.
- **Fraunces** (`--font-fraunces`) — serif italic, variable axes. Reserved for **accent words only** (e.g., "Trade. Recycle. _Repeat._", "Build a _greener_ industry."). Apply via the `.italic-accent` utility class. Do NOT use for body text.
- **JetBrains Mono** (`--font-jetbrains-mono`) — eyebrow captions, badges, code-like labels. Apply via `.mono-caption` utility class. Weights 400, 500.

Plus Jakarta Sans and Lexend Giga were used in earlier versions. Files for both still exist in `src/fonts/` and `Fonts/Lexend_Giga/` but are unused — safe to delete in a future cleanup, but currently harmless.

### Brand Assets
- Logo variants are in `Logos/` (top-level) and mirrored in `public/logos/` — white, black, full-color.
- **Logo aspect ratio is ~6.5:1** (user re-cropped from the original ~1.4:1 in May 2026 to remove blank whitespace around the glyph+wordmark). When adding new logo-rendering code:
  - For `next/image` in nav components: use `width={260} height={40}` (or proportional) with `className="h-10 w-auto"` so width auto-scales from the height constraint. Don't hard-code dimensions assuming the old square-ish aspect.
  - For the OG card (`scripts/generate-og-card.cjs`): the script reads natural aspect via `sharp.metadata()` and derives height — re-cropping the logo doesn't require script changes.
  - For PWA icons (`scripts/generate-pwa-icons.cjs`): the script crops the **leftmost square portion** of the wide logo (the glyph alone) and centers it on a forest-gradient bg. The wordmark would be unreadable at 192/512 px so it's intentionally cropped out.
- Background images in `public/` (all user-provided JPGs): `herobg.jpg`, `hiwbg.jpg`, `categoriesbg.jpg`, `whybg.jpg` (heavy, ~14.5 MB), `ctabg.jpg` (loaded on disk but no longer referenced — CTA Band reverted to plain white).
- `public/og-card.png` is generated; re-run `node scripts/generate-og-card.cjs` if brand colors or logo change.

### Known Quirks & Gotchas
- **shadcn v4 uses Base UI** — no `asChild` prop; use `render` prop instead
- **Next.js 16 middleware warning**: `middleware.ts` is technically deprecated in favour of `proxy.ts` but still works
- **Supabase foreign key joins** use explicit key syntax: `users!bookings_seller_id_fkey(name)`
- **Seller routes** use `/seller-bookings` prefix to avoid conflict with buyer `/bookings`
- **All server pages** dynamically import Supabase server client: `await import("@/lib/supabase/server")` — this avoids build-time errors when env vars are missing
- **PWA + Turbopack incompatible**: `@ducanh2912/next-pwa` injects webpack plugins. Next.js 16 defaults to Turbopack. Build script uses `--webpack` to force webpack mode. Do NOT remove this flag or the service worker won't generate.
- **Generated PWA files** (`public/sw.js`, `public/workbox-*.js`, `public/swe-worker-*.js`) are gitignored — they're regenerated on every Vercel build automatically.
- **Turbopack webpack config error (Next.js 16)**: `next.config.ts` must include `turbopack: {}` in `nextConfig` — without it, the dev server crashes immediately with a hard error about webpack/Turbopack conflict.
- **Admin route is NOT a route group**: Admin pages live at `src/app/admin/` (a real path segment), NOT `src/app/(admin)/`. Using `(admin)/` causes Next.js path conflicts with buyer routes `/bookings` and `/companies` since route groups don't add URL segments.
- **Admin RLS — no recursive queries on `users` table**: Use `public.is_admin()` SECURITY DEFINER function. Never write a policy on `users` that SELECTs from `users` — it causes infinite recursion.
- **Manually inserted auth.users rows**: When inserting test users directly into `auth.users` via SQL, all string columns must be set to `''` (empty string) not NULL — e.g. `email_change`, `confirmation_token`, `recovery_token`, etc. Also set `instance_id = '00000000-0000-0000-0000-000000000000'`. Missing these causes "Database error querying schema" on login.
- **Google OAuth — `invalid_client` error**: The Google Cloud Console popup shows the client secret in a font where uppercase `I` looks like lowercase `l`. Always use the downloaded JSON file (`client_secret` field) for the exact value, never copy from the UI popup.
- **Google OAuth flow**: `signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/auth/callback' } })` → Google → Supabase → `/auth/callback` → role-based redirect. New users land on `/role-select`. Returning users go straight to their dashboard.
- **`public.users.role` is nullable**: Required for Google OAuth — new users don't have a role until they complete `/role-select`. The check constraint still enforces valid values when role IS set.
- **DB trigger `handle_new_user()`**: Fires on every `auth.users` INSERT. Auto-inserts into `public.users` with name from Google metadata and `role = NULL`. Uses `ON CONFLICT (id) DO NOTHING` so it's safe for all signup methods.
- **Google OAuth consent screen is in TEST MODE**: Only whitelisted test users can sign in via Google. Must publish the app in Google Cloud Console before public launch.
- **Marketplace filter performance**: Category/sort filters use URL params + server re-render (SSR). `useTransition` in `marketplace-filters.tsx` + `loading.tsx` skeleton eliminate the frozen UI feeling. Do NOT switch to client-side filtering — SSR is intentional for SEO.
- **Local prod-build SW survives `npm run dev`**: Running `npm run build` locally generates `public/sw.js` + `workbox-*.js` + `swe-worker-*.js`. The dev server then serves these, browsers register the SW, and your edits appear cached. Symptom: hard reload + cache clear doesn't show new code. Fix: delete the generated SW files from `public/` (they're gitignored), then in DevTools → Application → unregister any active worker + Clear site data. Verify in incognito.
- **Lenis smooth scroll is mounted globally**: `LenisProvider` in root layout. It DOES dispatch native scroll events, so `window.scrollY` listeners (e.g. the marketing nav's pill-on-scroll behavior) still work — but the values update on rAF cadence, not raw wheel events. If you add scroll-driven UI that feels "delayed", that's Lenis interpolation, not a bug. The provider respects `prefers-reduced-motion` and bails out for those users.
- **Two progress bars at top of page**: NextTopLoader (route-transition bar from `nextjs-toploader`) and the marketing nav's scroll progress bar are both 2px and both forest-colored. They never fire at the same time (one is navigation, the other is scroll), but visually they look identical. Don't "fix" one thinking it's a duplicate.
- **Logo aspect ratio (6.5:1)**: After the May 2026 re-crop, ANY new `<Image>` of `ScrapKart Black Logo.png` / `ScrapKart White Logo.png` must use proportional width/height. A common bug: setting both `width={40} height={40}` produces a squished banner. Use the marketing-nav pattern: `width={260} height={40} className="h-10 w-auto"`.
- **`mono-caption` class overrides `text-white`**: When using `.mono-caption` on a dark background (e.g. inside the Why section's dark forest overlay), the class's default `color` wins over `text-white`. Use inline `style={{ color: "#ffffff" }}` to guarantee override. Same gotcha potentially applies to `.italic-accent` if you need a non-default color.
- **CTA Band vertical centering**: Tried `min-h` + `flex items-center` — looked too tall on desktop. Final pattern is asymmetric padding (`pt-40 pb-16 md:pt-52 md:pb-20`) which positions content lower in the visual frame. If you change this section, don't switch to flex-centering without re-checking the user's reaction.
- **Image cache for replaced bg images**: Next.js Image optimizer caches under `.next/dev/cache/images`. If a user replaces e.g. `herobg.jpg` with new content but the same filename, the dev server may serve the cached optimized version. Clearing `.next/dev/cache/images` fixes it.

### Test Accounts (live in production Supabase)
All created directly in `auth.users` + `public.users` via SQL. Seeded with companies, listings, bookings, and messages.

| Email | Password | Role | Details |
|---|---|---|---|
| `admin@scrapkart.test` | `Admin@ScrapKart#2024` | admin | Full admin dashboard access |
| `seller1@scrapkart.test` | `Test@1234` | waste_producer | Iron & Steel Co. — Metal + Mixed Scrap listings |
| `seller2@scrapkart.test` | `Test@1234` | waste_producer | EcoRecycle Ltd. — E-waste, Plastic, Paper listings |
| `buyer1@scrapkart.test` | `Test@1234` | recycler | Has 2 bookings (1 confirmed with chat, 1 pending) |
| `buyer2@scrapkart.test` | `Test@1234` | recycler | Fresh account, no bookings |
