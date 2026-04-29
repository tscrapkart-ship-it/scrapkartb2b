# Phase 2 — Auth Surfaces (Refined Premium)

**Date:** 2026-04-29
**Branch:** `feat/ui-overhaul` (continues; no push)
**Foundation:** Inherits the Refined Premium tokens, motion primitives, and 19 primitive rewrites that landed in Phase 1. No design re-validation needed.

---

## Goal

Convert the four auth surfaces from the previous dark-emerald-#10B981 design to Refined Premium light + warm + deep forest, matching the Phase 1 marketing surfaces. Backend (Supabase auth, Google OAuth, role upsert, email-sent flow, redirects) stays untouched.

---

## Files in scope

| Path | Action |
|---|---|
| `src/app/(auth)/layout.tsx` | Rewrite — split-screen, paper-2 narrative left, paper form right |
| `src/app/(auth)/login/page.tsx` | Rewrite — form layout in Refined Premium |
| `src/app/(auth)/signup/page.tsx` | Rewrite — form + email-sent success state |
| `src/app/(auth)/role-select/page.tsx` | Rewrite — 3 role cards |
| `src/components/auth/google-auth-button.tsx` | Rewrite — light theme |

Out of scope: `src/app/auth/callback/route.ts` (backend), `src/app/onboarding/*` (Phase 3, not auth).

---

## Design intent

### Split-screen layout
- **Mobile (< 1024px):** single column on `--paper`, marketing nav not present (auth is its own surface), small wordmark at top, form below
- **Desktop:** 50/50 split, left panel `--paper-2` with editorial brand narrative (mono caption + display headline + lead), right panel `--paper` with form card centered

### Form card
- Container: `bg-[var(--paper)]` with no chrome (no border, no shadow, no backdrop), max-width 420px, centered. The auth flow is intentionally *quiet* — no card outline competing with the form. Compare Stripe / Linear sign-in pages.
- Header: small forest-tint icon chip → display heading (Inter Tight 600, 28–32px) → muted subhead in `--ink-3`
- Inputs: use the `Input` primitive (Phase 1) — no per-field icons (those read consumer; B2B forms are cleaner without)
- Submit: `Button variant="primary" size="md"` full-width
- Alternative auth: thin `or` divider, then `GoogleAuthButton` (rewritten light theme)
- Inline link: "Don't have an account? Sign up" — text link in `--ink-3`, "Sign up" in `--forest`
- Error state: `--danger` 10% bg, `--danger` 30% border, `--danger` text, rounded `--radius-md`, Framer Motion fade-in

### Role-select page
- Heading + subhead (no surrounding card; just lives directly in the right column)
- 3 role cards stacked: paper bg, hairline border, hover lifts to `--shadow-2`, selected = forest border + forest-tint bg + forest check icon
- Continue button: `Button variant="primary"` full-width, disabled until selection

### Google button
- Light theme: `bg-[var(--paper)]` with hairline border, hover bg `--paper-2`, Google logo unchanged, body text `--ink-2`
- Same height (44px) as primary CTA for visual rhythm

### Motion
- Each page uses Framer Motion entrance: `initial opacity 0, y 20 → animate opacity 1, y 0` over `--motion-base` (450ms) with the project's signature ease `[0.32, 0.72, 0, 1]` — mirrors existing pattern but with the unified curve.
- Role-select stagger keeps existing pattern (container + child variants, 100ms stagger).
- Email-sent success: Framer Motion scale spring on the icon, gentle vertical bounce on the mail icon, text fades in with stagger. Keep this — it's a real moment.

---

## Acceptance

- All four auth surfaces render in Refined Premium with foundation tokens (no `#10B981`, `#0A0A0A`-on-pure-black, `#262626`, `#141414`, `#1A1A1A` literals; no `rounded-2xl` / `text-white` / `text-white/40` classes)
- Form submission still works for: email signup, email login, Google OAuth, role upsert
- "Check your email" success state still appears after signup
- Role-select still routes `recycler` → `/onboarding/recycler` and `waste_producer` / `both` → `/onboarding/producer`
- `npm run typecheck` zero errors
- `npm run lint` zero new errors in auth files
- `npm run build` green
- All four routes (`/login`, `/signup`, `/role-select`, plus auth layout chrome) serve HTTP 200
- No `git push` issued

---

## Plan — 4 tasks

### Phase 2 Task 1 — Auth layout + Google button

Rewrite `src/app/(auth)/layout.tsx` and `src/components/auth/google-auth-button.tsx` together — they're shared chrome.

### Phase 2 Task 2 — Login page

Rewrite `src/app/(auth)/login/page.tsx`.

### Phase 2 Task 3 — Signup page

Rewrite `src/app/(auth)/signup/page.tsx`, including the email-sent success state.

### Phase 2 Task 4 — Role-select page

Rewrite `src/app/(auth)/role-select/page.tsx`.

Each task: typecheck → commit. Final task: build verification + brief audit.

— *End of Phase 2 spec.*
