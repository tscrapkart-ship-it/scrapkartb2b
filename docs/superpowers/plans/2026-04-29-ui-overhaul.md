# ScrapKart UI Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the entire ScrapKart B2B UI in the neo-brutalist B2C-sibling design language defined in `docs/superpowers/specs/2026-04-28-ui-overhaul-design.md`, across all 35+ pages, while keeping the live app shippable at every commit.

**Architecture:** 5 sequential phases on a feature branch. Phase 1 swaps the design system foundation (tokens, fonts, shadcn primitives) — every later phase inherits. Phases 2–5 redesign page archetypes in priority order: marketing → auth → authed → admin. The live B2B production URL (`scrapkart.app`) is never broken; each phase commit must build clean.

**Tech Stack:** Next.js 16 App Router, TypeScript strict, Tailwind CSS v4, shadcn/ui (Base UI variant), Supabase (auth + DB + realtime + storage), next/font/google for Archivo + Archivo Black + DM Serif Display + JetBrains Mono. No new test framework introduced. Verification = `npm run build` + `npm run typecheck` + manual browser walkthrough per phase.

**Verification mode:** This is a UI redesign with no existing test framework. Each implementation task has a build/typecheck verification step plus, where relevant, a `npm run dev` browser-walkthrough step. We are NOT setting up Playwright/Vitest in this plan — that is out of scope (per spec §9). Per CLAUDE.md: "For UI or frontend changes, start the dev server and use the feature in a browser before reporting the task as complete."

**Spec reference:** All references like "spec §2.2" point to `docs/superpowers/specs/2026-04-28-ui-overhaul-design.md`. Read the spec before starting any task.

---

## Setup: Feature branch

### Task S.1 — Create feature branch

**Files:** none (git only)

- [ ] **Step 1:** Create branch off master

```bash
git checkout master
git pull
git checkout -b feat/ui-overhaul
```

- [ ] **Step 2:** Verify

```bash
git status
```

Expected: `On branch feat/ui-overhaul`, working tree clean (or only the untracked `docs/superpowers/`, `.superpowers/`, etc. that already exist).

- [ ] **Step 3:** Commit the design spec + plan to the new branch

```bash
git add docs/superpowers/specs/2026-04-28-ui-overhaul-design.md docs/superpowers/plans/2026-04-29-ui-overhaul.md .gitignore
git commit -m "docs: add UI overhaul design spec and implementation plan"
```

---

## Phase 1: Foundation — tokens, fonts, primitives

Once Phase 1 is complete, every page in the app will visually inherit the new design language without further changes (though individual pages will still need redesign in later phases). Build must remain green at every commit.

### Task 1.1 — Replace fonts in root layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1:** Open `src/app/layout.tsx`. Replace the existing `Plus_Jakarta_Sans` import block + the `jakarta` constant with the four-font stack.

Replace this:

```tsx
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});
```

With this:

```tsx
import { Archivo, Archivo_Black, DM_Serif_Display, JetBrains_Mono } from "next/font/google";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  variable: "--font-archivo-black",
  weight: "400",
  display: "swap",
});
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  variable: "--font-dm-serif",
  weight: "400",
  style: ["italic"],
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
  display: "swap",
});
```

- [ ] **Step 2:** Update the `<body>` className to apply all four font variables.

Replace:

```tsx
<body className={`${jakarta.variable} antialiased overflow-x-hidden`}>
```

With:

```tsx
<body className={`${archivo.variable} ${archivoBlack.variable} ${dmSerif.variable} ${mono.variable} antialiased overflow-x-hidden`}>
```

- [ ] **Step 3:** Update the `<NextTopLoader>` color from green to ink (the new design uses ink for the progress bar).

Replace:

```tsx
<NextTopLoader color="#10B981" height={3} showSpinner={false} shadow="0 0 10px rgba(16,185,129,0.4)" />
```

With:

```tsx
<NextTopLoader color="#0A0A0A" height={3} showSpinner={false} shadow="none" />
```

- [ ] **Step 4:** Verify typecheck passes

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 5:** Commit

```bash
git add src/app/layout.tsx
git commit -m "feat(ui): swap fonts to Archivo + Archivo Black + DM Serif Display + JetBrains Mono"
```

### Task 1.2 — Rewrite design tokens in globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1:** Open `src/app/globals.css`. Replace the `@theme inline` block, the `:root` block, the `@layer base`, and the `@layer utilities` blocks with the new neo-brutalist token system.

The complete new file contents:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@theme inline {
  --color-background: var(--paper);
  --color-foreground: var(--ink);
  --color-card: var(--paper);
  --color-card-foreground: var(--ink);
  --color-popover: var(--paper);
  --color-popover-foreground: var(--ink);
  --color-primary: var(--ink);
  --color-primary-foreground: var(--paper);
  --color-secondary: var(--paper);
  --color-secondary-foreground: var(--ink);
  --color-muted: var(--bg-soft);
  --color-muted-foreground: var(--ink-3);
  --color-accent: var(--green);
  --color-accent-foreground: var(--ink);
  --color-destructive: var(--danger);
  --color-border: var(--ink);
  --color-input: var(--ink);
  --color-ring: var(--green);

  --color-cat-metal: var(--cat-metal);
  --color-cat-ewaste: var(--cat-ewaste);
  --color-cat-plastic: var(--cat-plastic);
  --color-cat-paper: var(--cat-paper);
  --color-cat-glass: var(--cat-glass);
  --color-cat-mixed: var(--cat-mixed);

  --font-sans: var(--font-archivo);
  --font-display: var(--font-archivo-black);
  --font-serif: var(--font-dm-serif);
  --font-mono: var(--font-jetbrains-mono);

  --radius-sm: 0;
  --radius-md: 0;
  --radius-lg: 0;
  --radius-xl: 0;
  --radius-2xl: 0;
}

:root {
  /* Surfaces & ink */
  --paper:       #FFFFFF;
  --ink:         #0A0A0A;
  --ink-2:       #2A2A2A;
  --ink-3:       #6B6B6B;
  --ink-4:       #9A9A9A;
  --border-soft: #E5E5E5;
  --bg-soft:     #F8F8F8;

  /* Brand greens (sibling of B2C) */
  --green:       #00C842;
  --green-deep:  #00A638;
  --green-tint:  #E8FAEE;

  /* Category pastels */
  --cat-metal:   #DDE8F4;
  --cat-ewaste:  #FCE0E3;
  --cat-plastic: #FCF4CC;
  --cat-paper:   #D7F2DD;
  --cat-glass:   #E2E0F4;
  --cat-mixed:   #F4ECDD;

  /* Status */
  --warning:     #FFB800;
  --danger:      #E5484D;
  --info:        #0A66E5;

  /* Hard offset shadows (no blur) */
  --shadow-xs:    2px 2px 0 0 var(--ink);
  --shadow-sm:    4px 4px 0 0 var(--ink);
  --shadow:       6px 6px 0 0 var(--ink);
  --shadow-lg:    8px 8px 0 0 var(--ink);
  --shadow-green: 4px 4px 0 0 var(--green);

  /* Motion */
  --motion-fast: 100ms;
  --motion-base: 200ms;
  --motion-slow: 400ms;
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
}

@layer base {
  * {
    @apply border-[var(--ink)];
    border-radius: 0 !important;
  }
  body {
    background: var(--paper);
    color: var(--ink);
    font-family: var(--font-archivo), system-ui, sans-serif;
  }
  html {
    scroll-behavior: smooth;
    overflow-x: hidden;
  }
  h1, h2 {
    font-family: var(--font-archivo-black), system-ui, sans-serif;
    letter-spacing: -0.025em;
    line-height: 0.95;
    text-wrap: balance;
  }
  h3, h4 {
    font-family: var(--font-archivo), system-ui, sans-serif;
    font-weight: 700;
    letter-spacing: -0.015em;
    line-height: 1.05;
  }
  p {
    text-wrap: pretty;
    line-height: 1.55;
  }
}

@layer utilities {
  /* Hard shadows */
  .shadow-hard-xs { box-shadow: var(--shadow-xs); }
  .shadow-hard-sm { box-shadow: var(--shadow-sm); }
  .shadow-hard    { box-shadow: var(--shadow); }
  .shadow-hard-lg { box-shadow: var(--shadow-lg); }
  .shadow-green   { box-shadow: var(--shadow-green); }

  /* Press-in hover for cards/buttons */
  .press-in {
    transition: transform var(--motion-fast) var(--ease), box-shadow var(--motion-fast) var(--ease);
  }
  .press-in:hover {
    transform: translate(3px, 3px);
    box-shadow: 3px 3px 0 0 var(--ink);
  }
  .press-in-sm {
    transition: transform var(--motion-fast) var(--ease), box-shadow var(--motion-fast) var(--ease);
  }
  .press-in-sm:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 0 var(--ink);
  }
  .press-in-green:hover {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 0 0 var(--green);
  }

  /* Type utilities */
  .font-display { font-family: var(--font-archivo-black), system-ui, sans-serif; }
  .font-serif-italic { font-family: var(--font-dm-serif), Georgia, serif; font-style: italic; font-weight: 400; }
  .font-mono { font-family: var(--font-mono), 'Courier New', monospace; }

  /* Fluid hero h1 */
  .text-hero { font-size: clamp(56px, 8vw, 76px); line-height: 0.93; letter-spacing: -0.025em; }

  /* Live status pulse dot */
  .pulse-dot {
    width: 8px;
    height: 8px;
    background: var(--green);
    border-radius: 999px;
    box-shadow: 0 0 0 3px rgba(0,200,66,0.25);
    animation: pulse 1.6s infinite;
    display: inline-block;
  }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 3px rgba(0,200,66,0.25); }
    50%      { box-shadow: 0 0 0 6px rgba(0,200,66,0.05); }
  }

  /* Section entrance — restrained, opt-in via class */
  .reveal {
    animation: reveal var(--motion-slow) var(--ease) both;
  }
  @keyframes reveal {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .reveal-delay-1 { animation-delay: 60ms; }
  .reveal-delay-2 { animation-delay: 120ms; }
  .reveal-delay-3 { animation-delay: 180ms; }
  .reveal-delay-4 { animation-delay: 240ms; }
  .reveal-delay-5 { animation-delay: 300ms; }

  /* Reduced motion: replace transforms with crossfade */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: var(--motion-fast) !important;
      scroll-behavior: auto !important;
    }
    .press-in:hover, .press-in-sm:hover, .press-in-green:hover {
      transform: none;
    }
    .reveal { animation: none; opacity: 1; transform: none; }
  }
}
```

- [ ] **Step 2:** Verify build succeeds

```bash
npm run build
```

Expected: build completes without CSS errors. Some pages may render incorrectly visually (because they still reference old classes like `bg-[#0A0A0A]`) — that's expected at this stage.

- [ ] **Step 3:** Commit

```bash
git add src/app/globals.css
git commit -m "feat(ui): replace design tokens with neo-brutalist B2C-sibling system"
```

### Task 1.3 — Refactor Button primitive

**Files:**
- Modify: `src/components/ui/button.tsx`

- [ ] **Step 1:** Open `src/components/ui/button.tsx` and read it to understand the current variant structure (it uses `class-variance-authority` / `cva`).

- [ ] **Step 2:** Replace the `buttonVariants` definition with neo-brutalist variants. The exact CVA structure:

```tsx
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-display uppercase tracking-[0.06em] border-2 border-[var(--ink)] transition-[transform,box-shadow] duration-100 ease-[cubic-bezier(0.2,0.8,0.2,1)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-green)] disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-[var(--ink)] text-[var(--paper)] shadow-green hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--green)]",
        secondary: "bg-[var(--paper)] text-[var(--ink)] shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--ink)]",
        ghost: "border-transparent bg-transparent text-[var(--ink)] font-sans normal-case tracking-normal underline-offset-4 hover:underline",
        destructive: "bg-[var(--danger)] text-[var(--paper)] shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--ink)]",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-sm",
        icon: "h-11 w-11 px-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);
```

Keep the rest of the component (the `Button` function, the `forwardRef`, etc.) unchanged in structure — only the `buttonVariants` definition changes. If the current file uses an `outline` variant, map it to `secondary`. If it uses a `link` variant, map it to `ghost`. The `default` variant should be aliased to `primary` if any callsites use `variant="default"` — keep both names so callsites don't break.

If the current Button uses `default` instead of `primary` as the variant name, keep `default` and add `primary` as a separate variant with the same styles, OR rename `default` to `primary` and grep-update callsites. Read the file first before deciding.

- [ ] **Step 3:** Verify typecheck

```bash
npm run typecheck
```

Expected: no errors. If callsites pass `variant` strings that no longer exist (e.g., `variant="outline"`), update them OR keep an `outline` variant aliased to `secondary` for back-compat during the rollout. Resolve by aliasing — fewer file changes.

- [ ] **Step 4:** Verify build

```bash
npm run build
```

Expected: build passes.

- [ ] **Step 5:** Commit

```bash
git add src/components/ui/button.tsx
git commit -m "feat(ui): rewrite Button primitive — neo-brutalist primary/secondary/ghost/destructive"
```

### Task 1.4 — Refactor Card primitive

**Files:**
- Modify: `src/components/ui/card.tsx`

- [ ] **Step 1:** Read the current `card.tsx` to understand its structure (it likely exports `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`).

- [ ] **Step 2:** Replace the className strings inside each subcomponent with neo-brutalist defaults. The `Card` outer container becomes:

```tsx
<div
  data-slot="card"
  className={cn(
    "border-2 border-[var(--ink)] bg-[var(--paper)] text-[var(--ink)] shadow-hard flex flex-col",
    className
  )}
  {...props}
/>
```

`CardHeader`:

```tsx
<div
  data-slot="card-header"
  className={cn("border-b-2 border-[var(--ink)] px-6 py-4", className)}
  {...props}
/>
```

`CardTitle`:

```tsx
<h3
  data-slot="card-title"
  className={cn("font-display text-lg leading-none", className)}
  {...props}
/>
```

`CardDescription`:

```tsx
<p
  data-slot="card-description"
  className={cn("text-sm text-[var(--ink-3)] mt-1", className)}
  {...props}
/>
```

`CardContent`:

```tsx
<div
  data-slot="card-content"
  className={cn("px-6 py-5", className)}
  {...props}
/>
```

`CardFooter`:

```tsx
<div
  data-slot="card-footer"
  className={cn("border-t-2 border-[var(--ink)] px-6 py-4 flex items-center", className)}
  {...props}
/>
```

- [ ] **Step 3:** Verify build

```bash
npm run build
```

Expected: passes.

- [ ] **Step 4:** Commit

```bash
git add src/components/ui/card.tsx
git commit -m "feat(ui): rewrite Card primitive — 2px ink border + hard shadow + sharp corners"
```

### Task 1.5 — Refactor Badge primitive

**Files:**
- Modify: `src/components/ui/badge.tsx`

- [ ] **Step 1:** Read the existing `badge.tsx` to find the `badgeVariants` CVA.

- [ ] **Step 2:** Replace the variants:

```tsx
const badgeVariants = cva(
  "inline-flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.1em] font-bold border-2 border-[var(--ink)] px-2 py-0.5 leading-none",
  {
    variants: {
      variant: {
        default: "bg-[var(--paper)] text-[var(--ink)]",
        verified: "bg-[var(--paper)] text-[var(--ink)]",
        active: "bg-[var(--green)] text-[var(--ink)]",
        pending: "bg-[var(--warning)] text-[var(--ink)]",
        booked: "bg-[var(--cat-metal)] text-[var(--ink)]",
        suspended: "bg-[var(--danger)] text-[var(--paper)]",
        secondary: "bg-[var(--bg-soft)] text-[var(--ink)]",
        destructive: "bg-[var(--danger)] text-[var(--paper)]",
        outline: "bg-[var(--paper)] text-[var(--ink)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);
```

Keep `default`, `secondary`, `destructive`, `outline` for back-compat with any callsites using shadcn's stock names.

- [ ] **Step 3:** Verify build + commit

```bash
npm run build
git add src/components/ui/badge.tsx
git commit -m "feat(ui): rewrite Badge primitive — mono uppercase tracked, sharp 2px border"
```

### Task 1.6 — Refactor Input primitive

**Files:**
- Modify: `src/components/ui/input.tsx`

- [ ] **Step 1:** Replace the input className with:

```tsx
className={cn(
  "flex h-11 w-full border-2 border-[var(--ink)] bg-[var(--paper)] px-4 py-2 text-base font-sans text-[var(--ink)] placeholder:text-[var(--ink-4)] focus-visible:outline-none focus-visible:shadow-green disabled:cursor-not-allowed disabled:opacity-50",
  className
)}
```

- [ ] **Step 2:** Verify build + commit

```bash
npm run build
git add src/components/ui/input.tsx
git commit -m "feat(ui): rewrite Input primitive — 2px ink border + green focus shadow"
```

### Task 1.7 — Refactor Textarea primitive

**Files:**
- Modify: `src/components/ui/textarea.tsx`

- [ ] **Step 1:** Replace the textarea className with the same pattern as Input but with `min-h-[96px] py-3` instead of `h-11 py-2`:

```tsx
className={cn(
  "flex min-h-[96px] w-full border-2 border-[var(--ink)] bg-[var(--paper)] px-4 py-3 text-base font-sans text-[var(--ink)] placeholder:text-[var(--ink-4)] focus-visible:outline-none focus-visible:shadow-green disabled:cursor-not-allowed disabled:opacity-50",
  className
)}
```

- [ ] **Step 2:** Verify build + commit

```bash
npm run build
git add src/components/ui/textarea.tsx
git commit -m "feat(ui): rewrite Textarea primitive"
```

### Task 1.8 — Refactor Label primitive

**Files:**
- Modify: `src/components/ui/label.tsx`

- [ ] **Step 1:** Replace the label className with:

```tsx
className={cn(
  "font-display text-[11px] uppercase tracking-[0.14em] text-[var(--ink-3)] mb-2 inline-block",
  className
)}
```

- [ ] **Step 2:** Verify build + commit

```bash
npm run build
git add src/components/ui/label.tsx
git commit -m "feat(ui): rewrite Label primitive — Archivo Black uppercase tracked"
```

### Task 1.9 — Refactor Select primitive

**Files:**
- Modify: `src/components/ui/select.tsx`

- [ ] **Step 1:** Read the file. The `SelectTrigger` is the visible button — replace its className with:

```tsx
className={cn(
  "flex h-11 w-full items-center justify-between border-2 border-[var(--ink)] bg-[var(--paper)] px-4 py-2 text-sm font-sans text-[var(--ink)] focus:outline-none focus:shadow-green disabled:cursor-not-allowed disabled:opacity-50",
  className
)}
```

`SelectContent` className:

```tsx
className={cn(
  "z-50 min-w-[8rem] overflow-hidden border-2 border-[var(--ink)] bg-[var(--paper)] shadow-hard text-[var(--ink)]",
  className
)}
```

`SelectItem` className:

```tsx
className={cn(
  "relative flex w-full cursor-default select-none items-center px-3 py-2 text-sm font-sans outline-none focus:bg-[var(--bg-soft)] data-[state=checked]:bg-[var(--green-tint)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  className
)}
```

- [ ] **Step 2:** Verify build + commit

```bash
npm run build
git add src/components/ui/select.tsx
git commit -m "feat(ui): rewrite Select primitive"
```

### Task 1.10 — Refactor Dialog primitive

**Files:**
- Modify: `src/components/ui/dialog.tsx`

- [ ] **Step 1:** Replace `DialogOverlay` className:

```tsx
className={cn("fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className)}
```

`DialogContent` outer className:

```tsx
className={cn(
  "fixed left-1/2 top-1/2 z-50 grid w-full max-w-[560px] -translate-x-1/2 -translate-y-1/2 gap-0 border-2 border-[var(--ink)] bg-[var(--paper)] shadow-hard-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out",
  className
)}
```

`DialogHeader`:

```tsx
className={cn("border-b-2 border-[var(--ink)] px-6 py-4 flex flex-col gap-1", className)}
```

`DialogTitle`:

```tsx
className={cn("font-display text-lg leading-none", className)}
```

`DialogFooter`:

```tsx
className={cn("border-t-2 border-[var(--ink)] px-6 py-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
```

- [ ] **Step 2:** Verify build + commit

```bash
npm run build
git add src/components/ui/dialog.tsx
git commit -m "feat(ui): rewrite Dialog primitive"
```

### Task 1.11 — Refactor Alert Dialog, Dropdown Menu, Tabs, Sheet, Sonner toast

**Files:**
- Modify: `src/components/ui/alert-dialog.tsx`
- Modify: `src/components/ui/dropdown-menu.tsx`
- Modify: `src/components/ui/tabs.tsx`
- Modify: `src/components/ui/sheet.tsx`
- Modify: `src/components/ui/sonner.tsx`

For each file, replace soft styles with the same pattern: 2px ink borders, sharp corners, hard shadows where appropriate, no rounded corners. Pattern:

- **AlertDialog:** same as Dialog. Title + description + actions in border-divided sections.
- **DropdownMenu:** content panel = `border-2 border-[var(--ink)] bg-[var(--paper)] shadow-hard p-1`. Items = `font-sans text-sm px-3 py-2 hover:bg-[var(--bg-soft)] focus:bg-[var(--bg-soft)]`. No rounded.
- **Tabs:** TabsList = `inline-flex h-11 items-center border-2 border-[var(--ink)] bg-[var(--paper)] p-1`. TabsTrigger = `inline-flex items-center justify-center px-4 py-1.5 text-sm font-display uppercase tracking-[0.06em] data-[state=active]:bg-[var(--ink)] data-[state=active]:text-[var(--paper)]`.
- **Sheet:** Same pattern as Dialog, but slides from edge. Content has `border-2 border-[var(--ink)] bg-[var(--paper)] shadow-hard-lg`.
- **Sonner toast:** style passed via `<Toaster />` props in `sonner.tsx`. Set `toastOptions={{ style: { border: '2px solid var(--ink)', borderRadius: 0, background: 'var(--paper)', color: 'var(--ink)', boxShadow: 'var(--shadow-sm)' }, className: 'font-sans' }}`.

- [ ] **Step 1:** Apply the AlertDialog changes following the pattern.
- [ ] **Step 2:** Apply the DropdownMenu changes.
- [ ] **Step 3:** Apply the Tabs changes.
- [ ] **Step 4:** Apply the Sheet changes.
- [ ] **Step 5:** Apply the Sonner changes.
- [ ] **Step 6:** Verify build

```bash
npm run build
```

- [ ] **Step 7:** Commit each batch as you go (or one combined commit if all five are clean):

```bash
git add src/components/ui/alert-dialog.tsx src/components/ui/dropdown-menu.tsx src/components/ui/tabs.tsx src/components/ui/sheet.tsx src/components/ui/sonner.tsx
git commit -m "feat(ui): rewrite remaining shadcn primitives — alert-dialog, dropdown, tabs, sheet, sonner"
```

### Task 1.12 — Refactor Skeleton, Tooltip, Avatar, Breadcrumb, ScrollArea, Separator

**Files:**
- Modify: `src/components/ui/skeleton.tsx` — `bg-[var(--bg-soft)] border-2 border-[var(--border-soft)]`, no animation pulse (sharp on/off only).
- Modify: `src/components/ui/tooltip.tsx` — content = `border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] px-3 py-1.5 text-xs font-mono uppercase tracking-[0.1em] shadow-hard-xs`.
- Modify: `src/components/ui/avatar.tsx` — replace `rounded-full` with sharp 2px border. Avatar becomes a square: `w-10 h-10 border-2 border-[var(--ink)] bg-[var(--paper)] overflow-hidden flex items-center justify-center font-display text-sm`.
- Modify: `src/components/ui/breadcrumb.tsx` — `font-mono text-xs uppercase tracking-[0.1em] text-[var(--ink-3)]`. Separator becomes `/` not `>`.
- Modify: `src/components/ui/scroll-area.tsx` — scrollbar thumb is `bg-[var(--ink)]` solid, no rounded.
- Modify: `src/components/ui/separator.tsx` — `bg-[var(--ink)] h-[2px]` (horizontal) or `w-[2px]` (vertical).

- [ ] **Step 1:** Apply each component change per the pattern above.
- [ ] **Step 2:** Verify build

```bash
npm run build
```

- [ ] **Step 3:** Commit

```bash
git add src/components/ui/skeleton.tsx src/components/ui/tooltip.tsx src/components/ui/avatar.tsx src/components/ui/breadcrumb.tsx src/components/ui/scroll-area.tsx src/components/ui/separator.tsx
git commit -m "feat(ui): rewrite minor shadcn primitives — skeleton, tooltip, avatar, breadcrumb, scroll-area, separator"
```

### Task 1.13 — Phase 1 verification

**Files:** none

- [ ] **Step 1:** Run typecheck

```bash
npm run typecheck
```

Expected: no errors.

- [ ] **Step 2:** Run lint

```bash
npm run lint
```

Expected: no errors. Warnings about old token usage on pages-not-yet-redesigned are expected.

- [ ] **Step 3:** Run production build

```bash
npm run build
```

Expected: success.

- [ ] **Step 4:** Run dev server and visit `http://localhost:3000/login`. Visually inspect the input, button, and label primitives — they should be sharp-cornered, 2px black bordered. Pages will look "broken" because they still reference old colors/classes — that's fine, those pages get redesigned in Phases 2–5.

```bash
npm run dev
```

- [ ] **Step 5:** No commit needed if everything passes (this is a verification task).

---

## Phase 2: Marketing surface

Build the new design's "showcase" — the public landing, contact, blogs, and 404 — including the new live marketplace feature on the hero.

### Task 2.1 — Create reusable `<Nav>` and `<Footer>` shared components

**Files:**
- Create: `src/components/shared/marketing-nav.tsx`
- Create: `src/components/shared/marketing-footer.tsx`

- [ ] **Step 1:** Create `src/components/shared/marketing-nav.tsx`:

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, LayoutDashboard, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type AuthUser = { name: string; role: string | null; dashboardUrl: string };

export function MarketingNav() {
  const [open, setOpen] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return;
      const { data: profile } = await supabase
        .from("users")
        .select("name, role")
        .eq("id", user.id)
        .single();
      if (profile) {
        let dashboardUrl = "/marketplace";
        if (profile.role === "admin") dashboardUrl = "/admin";
        else if (profile.role === "waste_producer") dashboardUrl = "/dashboard";
        setAuthUser({
          name: profile.name || user.email?.split("@")[0] || "User",
          role: profile.role,
          dashboardUrl,
        });
      }
    });
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setAuthUser(null);
  };

  const navLinks = [
    { label: "Marketplace", href: "/marketplace" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Companies", href: "/companies" },
    { label: "Pricing", href: "/#pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b-2 border-[var(--ink)] bg-[var(--paper)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-display text-base">
          <Image src="/logos/ScrapKart Black Logo.png" alt="ScrapKart" width={130} height={36} priority />
          <span className="ml-1 border-2 border-[var(--ink)] px-2 py-0.5 font-mono text-[10px] tracking-[0.14em]">B2B</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-[var(--ink-2)] hover:text-[var(--ink)]">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {authUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex h-10 w-10 items-center justify-center border-2 border-[var(--ink)] bg-[var(--green)] font-display text-sm text-[var(--ink)] press-in-sm shadow-hard-sm"
              >
                {authUser.name.charAt(0).toUpperCase()}
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-12 z-50 w-56 border-2 border-[var(--ink)] bg-[var(--paper)] shadow-hard p-2">
                    <div className="border-b-2 border-[var(--ink)] px-3 py-2 mb-1">
                      <p className="font-display text-sm">{authUser.name}</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
                        {authUser.role?.replace("_", " ") || "No role"}
                      </p>
                    </div>
                    <Link href={authUser.dashboardUrl} onClick={() => setProfileOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg-soft)]">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <button onClick={handleSignOut} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--bg-soft)] text-left">
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link href="/login" className="border-2 border-[var(--ink)] bg-[var(--paper)] px-4 py-2 font-display text-xs uppercase tracking-[0.06em] shadow-hard-sm press-in-sm">
                Login
              </Link>
              <Link href="/signup" className="border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] px-4 py-2 font-display text-xs uppercase tracking-[0.06em] shadow-green press-in-green">
                List a lot
              </Link>
            </>
          )}
        </div>

        <button className="p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t-2 border-[var(--ink)] bg-[var(--paper)] px-4 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="block text-base font-medium">
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-3 border-t-2 border-[var(--ink)]">
            {authUser ? (
              <Link href={authUser.dashboardUrl} className="border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] px-4 py-3 font-display text-sm uppercase tracking-[0.06em] text-center">
                Dashboard <ArrowRight className="inline h-4 w-4 ml-1" />
              </Link>
            ) : (
              <>
                <Link href="/login" className="border-2 border-[var(--ink)] bg-[var(--paper)] px-4 py-3 font-display text-sm uppercase tracking-[0.06em] text-center">Login</Link>
                <Link href="/signup" className="border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] px-4 py-3 font-display text-sm uppercase tracking-[0.06em] text-center shadow-green">List a lot</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 2:** Create `src/components/shared/marketing-footer.tsx`:

```tsx
import Link from "next/link";
import Image from "next/image";

export function MarketingFooter() {
  return (
    <footer className="bg-[var(--ink)] text-[var(--paper)] border-t-2 border-[var(--ink)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-1">
            <Image src="/logos/ScrapKart White Logo.png" alt="ScrapKart" width={150} height={42} />
            <p className="mt-5 font-sans text-sm leading-relaxed text-[var(--ink-4)]">
              India&apos;s B2B marketplace for industrial scrap trading. Connecting waste producers with verified recyclers.
            </p>
          </div>
          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.16em] text-[var(--green)] mb-4">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/marketplace" className="hover:text-[var(--green)]">Marketplace</Link></li>
              <li><Link href="/companies" className="hover:text-[var(--green)]">Companies</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-[var(--green)]">How it works</Link></li>
              <li><Link href="/blogs" className="hover:text-[var(--green)]">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.16em] text-[var(--green)] mb-4">Get started</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/signup" className="hover:text-[var(--green)]">Create account</Link></li>
              <li><Link href="/login" className="hover:text-[var(--green)]">Sign in</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--green)]">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.16em] text-[var(--green)] mb-4">Sister site</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="https://b2c.scrapkart.app" className="hover:text-[var(--green)]" target="_blank" rel="noopener">B2C — pickup scrap</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t-2 border-[var(--green)] pt-6 flex justify-between items-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-4)]">
            &copy; {new Date().getFullYear()} ScrapKart · All rights reserved
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-4)]">
            Made in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3:** Verify build

```bash
npm run build
```

- [ ] **Step 4:** Commit

```bash
git add src/components/shared/marketing-nav.tsx src/components/shared/marketing-footer.tsx
git commit -m "feat(ui): add MarketingNav and MarketingFooter shared components"
```

### Task 2.2 — Create live marketplace data fetcher

**Files:**
- Create: `src/lib/queries/live-listings.ts`

- [ ] **Step 1:** Create `src/lib/queries/live-listings.ts`:

```ts
import { createClient as createServerClient } from "@/lib/supabase/server";
import { isMockMode } from "@/lib/mock-data";

export type LiveListing = {
  id: string;
  title: string;
  category: string;
  weight_kg: number;
  city: string;
  state: string;
  price_per_unit: number;
  bid_count: number;
  thumbnail_url: string | null;
  seller_name: string;
  verified_badge: string | null; // "GST" | "ISO 14001" | "CPCB" | null
};

const MOCK: LiveListing[] = [
  {
    id: "mock-1",
    title: "HMS Steel Scrap",
    category: "Metal",
    weight_kg: 12400,
    city: "Pune",
    state: "MH",
    price_per_unit: 38200,
    bid_count: 7,
    thumbnail_url: null,
    seller_name: "Iron & Steel Co.",
    verified_badge: "GST",
  },
  {
    id: "mock-2",
    title: "Copper Wire (No.1)",
    category: "Metal",
    weight_kg: 2800,
    city: "Bengaluru",
    state: "KA",
    price_per_unit: 680000,
    bid_count: 12,
    thumbnail_url: null,
    seller_name: "EcoRecycle Ltd.",
    verified_badge: "ISO 14001",
  },
  {
    id: "mock-3",
    title: "Server e-waste, mixed",
    category: "E-waste",
    weight_kg: 5200,
    city: "Hyderabad",
    state: "TS",
    price_per_unit: 112500,
    bid_count: 4,
    thumbnail_url: null,
    seller_name: "EcoRecycle Ltd.",
    verified_badge: "CPCB",
  },
];

export async function getLiveListings(limit = 3): Promise<{ listings: LiveListing[]; totalOpen: number; totalBidsValueINR: number }> {
  if (isMockMode()) {
    return {
      listings: MOCK.slice(0, limit),
      totalOpen: 47,
      totalBidsValueINR: 8400000,
    };
  }

  const supabase = await createServerClient();
  // Schema may differ slightly — adapt field names if Supabase types diverge.
  // Read src/types/index.ts for the canonical Scrap shape before relying on any field name.
  const { data, error } = await supabase
    .from("scraps")
    .select(`
      id,
      title,
      category,
      weight_kg,
      city,
      state,
      price_per_unit,
      thumbnail_url,
      bookings(count),
      companies!scraps_company_id_fkey(name, gst_verified, iso_14001, cpcb_verified)
    `)
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error || !data) {
    // Surface error to console in dev, fall back to mock for landing-page resilience
    if (process.env.NODE_ENV !== "production") {
      console.warn("[live-listings] fetch failed, falling back to mock:", error?.message);
    }
    return { listings: MOCK.slice(0, limit), totalOpen: 0, totalBidsValueINR: 0 };
  }

  const { count: totalOpen = 0 } = await supabase
    .from("scraps")
    .select("id", { count: "exact", head: true })
    .eq("status", "available");

  // Sum bid value across open lots (best-effort — schema may not have a denormalized total)
  // If bids are tracked in `bookings` with `bid_amount`, sum that.
  const { data: bidSum } = await supabase
    .from("bookings")
    .select("bid_amount")
    .in("scrap_id", data.map((d: any) => d.id));
  const totalBidsValueINR = (bidSum ?? []).reduce((sum: number, b: any) => sum + Number(b.bid_amount ?? 0), 0);

  const listings: LiveListing[] = data.map((row: any) => {
    const company = Array.isArray(row.companies) ? row.companies[0] : row.companies;
    const bidCount = Array.isArray(row.bookings) ? row.bookings.length : (row.bookings?.count ?? 0);
    let badge: string | null = null;
    if (company?.gst_verified) badge = "GST";
    else if (company?.iso_14001) badge = "ISO 14001";
    else if (company?.cpcb_verified) badge = "CPCB";
    return {
      id: row.id,
      title: row.title,
      category: row.category,
      weight_kg: row.weight_kg,
      city: row.city,
      state: row.state,
      price_per_unit: row.price_per_unit,
      bid_count: bidCount,
      thumbnail_url: row.thumbnail_url,
      seller_name: company?.name ?? "Verified seller",
      verified_badge: badge,
    };
  });

  return { listings, totalOpen: totalOpen ?? 0, totalBidsValueINR };
}
```

**Important:** The exact column names (`weight_kg`, `city`, `state`, `price_per_unit`, `thumbnail_url`, `gst_verified`, `iso_14001`, `cpcb_verified`) MUST be verified against `src/types/index.ts` and the Supabase schema before this task is run. If the schema uses different names, adapt the SELECT and the destructuring. The `bookings(count)` join syntax assumes bids are in the `bookings` table — if there's a separate `bids` table, swap.

- [ ] **Step 2:** Verify type-check

```bash
npm run typecheck
```

If types fail because of schema mismatches, read `src/types/index.ts` and adapt the field names. Do not silence with `any`.

- [ ] **Step 3:** Commit

```bash
git add src/lib/queries/live-listings.ts
git commit -m "feat(landing): add live-listings query for hero marketplace panel"
```

### Task 2.3 — Build the `<LiveMarketplacePanel>` component

**Files:**
- Create: `src/components/shared/live-marketplace-panel.tsx`

- [ ] **Step 1:** Create `src/components/shared/live-marketplace-panel.tsx`:

```tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LiveListing } from "@/lib/queries/live-listings";

const categoryBg: Record<string, string> = {
  Metal: "bg-[var(--cat-metal)]",
  "E-waste": "bg-[var(--cat-ewaste)]",
  Plastic: "bg-[var(--cat-plastic)]",
  Paper: "bg-[var(--cat-paper)]",
  Glass: "bg-[var(--cat-glass)]",
  "Mixed Scrap": "bg-[var(--cat-mixed)]",
};

function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatWeight(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)}T`;
  return `${kg}kg`;
}

export function LiveMarketplacePanel({
  listings,
  totalOpen,
  totalBidsValueINR,
}: {
  listings: LiveListing[];
  totalOpen: number;
  totalBidsValueINR: number;
}) {
  const moreCount = Math.max(0, totalOpen - listings.length);

  return (
    <div className="border-2 border-[var(--ink)] bg-[var(--paper)] shadow-hard">
      {/* Header */}
      <div className="border-b-2 border-[var(--ink)] bg-[var(--cat-paper)] px-4 py-3 flex items-center justify-between">
        <div className="font-display text-xs uppercase tracking-[0.12em] flex items-center gap-2">
          <span className="pulse-dot" /> Live marketplace
        </div>
        <div className="font-mono text-[10px] font-bold tracking-[0.04em]">
          {totalOpen} OPEN · {formatINR(totalBidsValueINR)} IN BIDS
        </div>
      </div>

      {/* Listings */}
      {listings.map((row, i) => (
        <div
          key={row.id}
          className={`grid grid-cols-[auto_1fr_auto] gap-4 items-center px-4 py-4 ${i < listings.length - 1 ? "border-b border-[var(--border-soft)]" : ""}`}
        >
          <div className={`w-12 h-12 border-2 border-[var(--ink)] ${categoryBg[row.category] ?? "bg-[var(--bg-soft)]"}`}>
            {row.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.thumbnail_url} alt="" className="w-full h-full object-cover" />
            ) : null}
          </div>
          <div>
            <div className="font-display text-sm leading-tight">{row.title}</div>
            <div className="font-mono text-[10px] text-[var(--ink-3)] tracking-[0.04em] mt-1">
              {formatWeight(row.weight_kg)} · {row.city}, {row.state}
              {row.verified_badge ? ` · ${row.verified_badge}` : ""}
            </div>
            {row.bid_count > 0 ? (
              <span className="inline-block mt-1 bg-[var(--green)] text-[var(--ink)] font-mono text-[9px] font-bold px-1.5 py-0.5 tracking-[0.08em]">
                {row.bid_count} BID{row.bid_count === 1 ? "" : "S"}
              </span>
            ) : null}
          </div>
          <div className="text-right">
            <div className="font-display text-base">{formatINR(row.price_per_unit)}</div>
            <div className="font-mono text-[9px] text-[var(--ink-3)] uppercase tracking-[0.1em] mt-0.5">/ tonne</div>
          </div>
        </div>
      ))}

      {/* Footer */}
      <Link
        href="/marketplace"
        className="bg-[var(--ink)] text-[var(--paper)] px-4 py-3 flex items-center justify-between hover:bg-[var(--ink-2)] transition-colors"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.12em]">
          → {moreCount} more listings open
        </span>
        <span className="font-display text-xs text-[var(--green)] uppercase tracking-[0.08em] flex items-center gap-1">
          View all <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </Link>
    </div>
  );
}
```

- [ ] **Step 2:** Verify build

```bash
npm run build
```

- [ ] **Step 3:** Commit

```bash
git add src/components/shared/live-marketplace-panel.tsx
git commit -m "feat(landing): add LiveMarketplacePanel component"
```

### Task 2.4 — Verify anon RLS access for live listings (BEFORE wiring up)

**Files:** none (database verification)

- [ ] **Step 1:** Open the Supabase SQL editor (via MCP if available, or the dashboard). Run:

```sql
-- Confirm RLS allows anon read of available scraps
SET ROLE anon;
SELECT id, title, category, status FROM public.scraps WHERE status = 'available' LIMIT 3;
RESET ROLE;
```

Expected: returns rows. If error like "permission denied for table scraps" appears, the RLS policy must be added:

```sql
CREATE POLICY "anon can read available scraps"
ON public.scraps
FOR SELECT
TO anon
USING (status = 'available');
```

- [ ] **Step 2:** Repeat for the join targets — `companies` (anon must read company name + verification flags for available-scrap sellers) and `bookings` (count only — read access to bid count). Adapt policies as needed.

- [ ] **Step 3:** No code commit — note the result in the next task's commit message if RLS was changed (e.g., "feat(landing): wire LiveMarketplacePanel to landing hero (RLS verified, no schema change needed)").

### Task 2.5 — Refactor landing page (`src/app/page.tsx`)

This is the biggest single visual task. The new landing page replaces the current "use client" client-component with a Server Component shell that fetches live listings, plus child client components for the parts that need interactivity (nav with auth state, GSAP stat counter).

**Files:**
- Modify: `src/app/page.tsx` (full rewrite)
- Create: `src/components/landing/hero-stat-counter.tsx` (extracted client component)

- [ ] **Step 1:** Create `src/components/landing/hero-stat-counter.tsx` (extracts the GSAP count-up so the page itself can be a Server Component):

```tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Stat = { value: number; suffix: string; prefix?: string; label: string; decimals?: number };

const STATS: Stat[] = [
  { value: 2400, suffix: "T", label: "diverted from landfill" },
  { value: 15, suffix: "", label: "cities live" },
  { value: 98.4, suffix: "%", label: "on-time settlement", decimals: 1 },
  { value: 500, suffix: "+", label: "active listings" },
];

export function HeroStatCounter() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    refs.current.forEach((el, i) => {
      if (!el) return;
      const stat = STATS[i];
      const target = stat.value;
      gsap.fromTo(
        el,
        { textContent: 0 },
        {
          textContent: target,
          duration: 1.2,
          ease: "power2.out",
          snap: stat.decimals ? { textContent: 0.1 } : { textContent: 1 },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate() {
            const n = parseFloat((el as HTMLElement).textContent ?? "0");
            const formatted = stat.decimals
              ? n.toFixed(stat.decimals)
              : Math.round(n).toLocaleString("en-IN");
            (el as HTMLElement).textContent = `${stat.prefix ?? ""}${formatted}${stat.suffix}`;
          },
        }
      );
    });
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-y-2 border-[var(--ink)] bg-[var(--green)]">
      {STATS.map((stat, i) => (
        <div
          key={stat.label}
          className={`py-8 px-6 ${i < 3 ? "md:border-r-2 border-[var(--ink)]" : ""} ${i === 1 ? "border-r-2" : ""} ${i < 2 ? "border-b-2 md:border-b-0" : ""}`}
        >
          <div ref={(el) => { refs.current[i] = el; }} className="font-display text-3xl md:text-4xl leading-none">
            {stat.prefix ?? ""}0{stat.suffix}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] mt-2 font-bold">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2:** Replace `src/app/page.tsx` entirely with the new Server Component version. Full file content:

```tsx
import Link from "next/link";
import { ArrowRight, Cog, Cpu, Recycle, FileText, GlassWater, Package } from "lucide-react";
import { MarketingNav } from "@/components/shared/marketing-nav";
import { MarketingFooter } from "@/components/shared/marketing-footer";
import { LiveMarketplacePanel } from "@/components/shared/live-marketplace-panel";
import { HeroStatCounter } from "@/components/landing/hero-stat-counter";
import { getLiveListings } from "@/lib/queries/live-listings";

export const revalidate = 60;

const HOW_IT_WORKS = [
  { num: "01", title: "List your lot", desc: "Material, weight, location, photos. Posted in under 4 minutes.", meta: "→ ~3 min · self-serve", bg: "bg-[var(--cat-metal)]" },
  { num: "02", title: "We verify it", desc: "Seller KYC, GST check, lot photo audit. Live to buyers in 24 hours.", meta: "→ ~24 hrs · automated", bg: "bg-[var(--cat-plastic)]" },
  { num: "03", title: "Buyers bid", desc: "Verified recyclers compete openly. You see every bid as it lands.", meta: "→ ~48 hrs window", bg: "bg-[var(--cat-ewaste)]" },
  { num: "04", title: "Settle & ship", desc: "Pickup booked, weight reconciled, payment released to your account.", meta: "→ ~72 hrs end-to-end", bg: "bg-[var(--cat-paper)]" },
];

const CATEGORIES = [
  { name: "Metal", desc: "Steel, aluminium, copper, brass, iron scrap", icon: Cog, bg: "bg-[var(--cat-metal)]" },
  { name: "E-waste", desc: "Circuit boards, servers, monitors, electronics", icon: Cpu, bg: "bg-[var(--cat-ewaste)]" },
  { name: "Plastic", desc: "HDPE, PP, PET, PVC, mixed polymers", icon: Recycle, bg: "bg-[var(--cat-plastic)]" },
  { name: "Paper", desc: "OCC cardboard, office paper, newsprint", icon: FileText, bg: "bg-[var(--cat-paper)]" },
  { name: "Glass", desc: "Clear cullet, colored glass, float glass", icon: GlassWater, bg: "bg-[var(--cat-glass)]" },
  { name: "Mixed Scrap", desc: "Unsorted or multi-material industrial waste", icon: Package, bg: "bg-[var(--cat-mixed)]" },
];

export default async function Home() {
  const { listings, totalOpen, totalBidsValueINR } = await getLiveListings(3);

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <MarketingNav />

      {/* HERO */}
      <section className="border-b-2 border-[var(--ink)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
            <div>
              <p className="font-serif-italic text-lg md:text-xl text-[var(--green-deep)]">
                for the businesses moving real weight,
              </p>
              <h1 className="text-hero font-display mt-3">
                Trade scrap.<br />
                By the <em className="font-serif-italic text-[var(--green)] not-italic" style={{fontStyle:'italic'}}>truckload.</em>
              </h1>
              <p className="mt-6 max-w-xl text-base md:text-lg text-[var(--ink-2)] leading-[1.5]">
                List your lot. Verified buyers bid. Settlement in 72 hours. The B2B marketplace built on the same trust network behind <a href="https://b2c.scrapkart.app" className="underline" target="_blank" rel="noopener">b2c.scrapkart.app</a>.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] px-6 py-3.5 font-display text-sm uppercase tracking-[0.06em] shadow-green press-in-green"
                >
                  Post a listing <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center justify-center gap-2 border-2 border-[var(--ink)] bg-[var(--paper)] px-6 py-3.5 font-display text-sm uppercase tracking-[0.06em] shadow-hard-sm press-in-sm"
                >
                  Browse marketplace
                </Link>
              </div>
              <div className="mt-10 pt-6 border-t-2 border-[var(--ink)] flex flex-wrap gap-x-8 gap-y-4">
                <div>
                  <div className="font-display text-2xl">₹2.4Cr</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] mt-1 text-[var(--ink-3)]">Monthly GMV</div>
                </div>
                <div>
                  <div className="font-display text-2xl">120+</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] mt-1 text-[var(--ink-3)]">Verified yards</div>
                </div>
                <div>
                  <div className="font-display text-2xl">72hrs</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] mt-1 text-[var(--ink-3)]">Avg. settlement</div>
                </div>
              </div>
            </div>

            <div>
              <LiveMarketplacePanel listings={listings} totalOpen={totalOpen} totalBidsValueINR={totalBidsValueINR} />
            </div>
          </div>
        </div>
      </section>

      {/* STAT BAR */}
      <HeroStatCounter />

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-b-2 border-[var(--ink)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <h2 className="font-display text-4xl md:text-5xl uppercase">
              How it <em className="font-serif-italic text-[var(--green-deep)] not-italic" style={{fontStyle:'italic'}}>works.</em>
            </h2>
            <span className="hidden md:inline-block font-mono text-xs uppercase tracking-[0.12em] text-[var(--ink-3)]">
              List → Verify → Bid → Settle
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.num} className={`border-2 border-[var(--ink)] ${s.bg} p-6 shadow-hard press-in`}>
                <div className="font-display text-4xl text-black/[0.18] leading-none">{s.num}</div>
                <h3 className="font-display text-xl mt-5 leading-tight">{s.title}</h3>
                <p className="text-sm leading-relaxed mt-2.5">{s.desc}</p>
                <div className="font-mono text-[10px] uppercase tracking-[0.1em] mt-4 pt-3 border-t-2 border-black/[0.18] font-medium">{s.meta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="border-b-2 border-[var(--ink)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl md:text-5xl uppercase">
            Six material <em className="font-serif-italic text-[var(--green-deep)] not-italic" style={{fontStyle:'italic'}}>types.</em>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.name} className={`border-2 border-[var(--ink)] ${c.bg} p-6 shadow-hard press-in flex items-start gap-4`}>
                  <div className="border-2 border-[var(--ink)] bg-[var(--paper)] w-12 h-12 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg leading-none">{c.name}</h3>
                    <p className="text-sm leading-relaxed mt-2">{c.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b-2 border-[var(--ink)] bg-[var(--green)] py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl md:text-6xl uppercase">
            Ready to <em className="font-serif-italic not-italic" style={{fontStyle:'italic'}}>trade?</em>
          </h2>
          <p className="text-base md:text-lg mt-5 max-w-xl mx-auto">
            Join 120+ verified yards already listing on ScrapKart. Free to post. Pay only on settlement.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] px-7 py-4 font-display text-base uppercase tracking-[0.06em] shadow-hard press-in"
            >
              Create account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center justify-center gap-2 border-2 border-[var(--ink)] bg-[var(--paper)] px-7 py-4 font-display text-base uppercase tracking-[0.06em] shadow-hard press-in"
            >
              Browse listings
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
```

- [ ] **Step 3:** Verify build

```bash
npm run build
```

Expected: passes. The landing page is now a Server Component fetching live listings.

- [ ] **Step 4:** Run dev server, visit `http://localhost:3000/`. Check:
  - Hero displays "Trade scrap. By the truckload." with green italic
  - Live marketplace panel shows 3 rows with prices, weights, bids
  - Stat bar animates on scroll
  - How It Works has 4 pastel cards with hard shadows
  - Categories grid has 6 tiles
  - CTA section is full-bleed green
  - Footer is dark with green accents
  - All buttons are sharp-cornered with hard shadows
  - Mobile (resize to 375px): nav becomes hamburger, hero stacks, How It Works is single column

```bash
npm run dev
```

- [ ] **Step 5:** Commit

```bash
git add src/app/page.tsx src/components/landing/hero-stat-counter.tsx
git commit -m "feat(landing): full redesign — neo-brutalist hero with live marketplace + stat bar + how-it-works + CTA"
```

### Task 2.6 — Redesign Contact page

**Files:**
- Modify: `src/app/contact/page.tsx`

- [ ] **Step 1:** Read the current `src/app/contact/page.tsx` to understand the form fields and submit logic. Preserve all form fields and submission behavior.

- [ ] **Step 2:** Rewrite the page using the Marketing archetype: `<MarketingNav>`, hero block with title + subhead, contact form in a bordered card on the left, contact info card on the right, `<MarketingFooter>`.

Pattern:

```tsx
import { MarketingNav } from "@/components/shared/marketing-nav";
import { MarketingFooter } from "@/components/shared/marketing-footer";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <MarketingNav />
      <section className="border-b-2 border-[var(--ink)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl md:text-6xl uppercase">
            Get in <em className="font-serif-italic text-[var(--green-deep)] not-italic" style={{fontStyle:'italic'}}>touch.</em>
          </h1>
          <p className="text-base md:text-lg mt-5 max-w-xl text-[var(--ink-2)]">
            Questions about listing, verification, or partnerships — reach us directly.
          </p>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10">
          <div className="border-2 border-[var(--ink)] bg-[var(--paper)] shadow-hard p-8">
            {/* CONTACT FORM — preserve existing form logic, just restyle inputs/labels/submit */}
          </div>
          <div className="border-2 border-[var(--ink)] bg-[var(--cat-mixed)] shadow-hard p-8">
            <h3 className="font-display text-lg uppercase">Direct contact</h3>
            <ul className="mt-6 space-y-4 text-sm">
              <li className="font-mono">hello@scrapkart.app</li>
              <li className="font-mono">+91 98765 43210</li>
              <li className="font-mono">Bangalore, India</li>
            </ul>
          </div>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
```

Replace any `<Input>`, `<Textarea>`, `<Label>`, `<Button>` usage from existing form — the primitives are already restyled in Phase 1, so they'll inherit. Submission logic must remain functionally identical.

- [ ] **Step 3:** Verify build + dev walkthrough

```bash
npm run build
npm run dev   # then visit /contact
```

- [ ] **Step 4:** Commit

```bash
git add src/app/contact/page.tsx
git commit -m "feat(contact): redesign in neo-brutalist marketing archetype"
```

### Task 2.7 — Redesign Blogs index and detail

**Files:**
- Modify: `src/app/blogs/page.tsx`
- Modify: `src/app/blogs/[slug]/page.tsx`

- [ ] **Step 1:** Read both files to preserve data-fetching logic.

- [ ] **Step 2:** Apply the Marketing archetype to `blogs/page.tsx`. Title block + grid of bordered article cards (each with title, excerpt, mono date, "Read →" ghost link).

Card pattern:

```tsx
<Link href={`/blogs/${post.slug}`} className="border-2 border-[var(--ink)] bg-[var(--paper)] shadow-hard p-6 press-in flex flex-col gap-3">
  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-3)]">{post.date}</div>
  <h3 className="font-display text-xl leading-tight">{post.title}</h3>
  <p className="text-sm text-[var(--ink-2)] flex-1">{post.excerpt}</p>
  <span className="font-display text-xs uppercase tracking-[0.1em] mt-2">Read →</span>
</Link>
```

- [ ] **Step 3:** Apply the Listing detail archetype to `blogs/[slug]/page.tsx`. Big serif/display title, mono byline, body content in a constrained reading-width column with `prose` styling.

```tsx
<article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-3)] mb-3">
    {post.date} · {post.author}
  </div>
  <h1 className="font-display text-4xl md:text-5xl leading-[0.95]">{post.title}</h1>
  <div className="border-t-2 border-[var(--ink)] mt-8" />
  <div className="prose prose-lg max-w-none mt-8 font-sans">{/* render body */}</div>
</article>
```

- [ ] **Step 4:** Verify + commit

```bash
npm run build
git add src/app/blogs/page.tsx src/app/blogs/[slug]/page.tsx
git commit -m "feat(blogs): redesign index and detail in neo-brutalist marketing archetype"
```

### Task 2.8 — Redesign 404 page

**Files:**
- Modify: `src/app/not-found.tsx`

- [ ] **Step 1:** Replace with neo-brutalist 404:

```tsx
import Link from "next/link";
import { MarketingNav } from "@/components/shared/marketing-nav";
import { MarketingFooter } from "@/components/shared/marketing-footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col">
      <MarketingNav />
      <main className="flex-1 flex items-center justify-center py-24">
        <div className="text-center max-w-md px-6">
          <div className="font-display text-[120px] leading-none text-[var(--ink-4)]">404</div>
          <h1 className="font-display text-3xl uppercase mt-4">Page not found</h1>
          <p className="text-[var(--ink-2)] mt-3">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          <Link
            href="/"
            className="inline-block mt-8 border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] px-6 py-3 font-display text-sm uppercase tracking-[0.06em] shadow-green press-in-green"
          >
            Back home →
          </Link>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
```

- [ ] **Step 2:** Verify + commit

```bash
npm run build
git add src/app/not-found.tsx
git commit -m "feat(404): redesign in neo-brutalist marketing archetype"
```

### Task 2.9 — Phase 2 verification

**Files:** none

- [ ] **Step 1:** Run full build + typecheck + lint

```bash
npm run build && npm run typecheck && npm run lint
```

- [ ] **Step 2:** Run dev and walk through every Phase 2 page:
  - `/` (landing — hero, live marketplace, stats, how-it-works, categories, CTA, footer)
  - `/contact` (contact form)
  - `/blogs` (index)
  - `/blogs/[any-existing-slug]` (detail)
  - `/some-fake-url` (404)

Resize to 375px at each page; confirm no horizontal scroll, all touch targets reachable.

```bash
npm run dev
```

---

## Phase 3: Auth + onboarding

### Task 3.1 — Refactor `(auth)` layout

**Files:**
- Modify: `src/app/(auth)/layout.tsx`

- [ ] **Step 1:** Read the current layout to find the existing structure.

- [ ] **Step 2:** Replace with a 50/50 split — left = solid ink panel with logo + tagline + trust quote, right = white form panel:

```tsx
import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:grid md:grid-cols-2">
      {/* LEFT: ink panel */}
      <aside className="hidden md:flex bg-[var(--ink)] text-[var(--paper)] p-12 lg:p-16 flex-col justify-between border-r-2 border-[var(--ink)]">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logos/ScrapKart White Logo.png" alt="ScrapKart" width={170} height={48} priority />
          <span className="border-2 border-[var(--paper)] px-2 py-0.5 font-mono text-[10px] tracking-[0.14em]">B2B</span>
        </Link>

        <div>
          <p className="font-serif-italic text-2xl text-[var(--green)]">
            &ldquo;Finally a scrap marketplace that feels like it belongs in 2026.&rdquo;
          </p>
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[var(--ink-4)] mt-4">
            — Aditi M., Procurement Lead, Delhi
          </p>
        </div>

        <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-4)]">
          © 2026 ScrapKart · Sister site: b2c.scrapkart.app
        </div>
      </aside>

      {/* MOBILE LOGO BAR */}
      <div className="md:hidden bg-[var(--ink)] text-[var(--paper)] p-4 flex items-center justify-between border-b-2 border-[var(--ink)]">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logos/ScrapKart White Logo.png" alt="ScrapKart" width={130} height={36} />
          <span className="border-2 border-[var(--paper)] px-1.5 py-0.5 font-mono text-[9px] tracking-[0.14em]">B2B</span>
        </Link>
      </div>

      {/* RIGHT: form panel */}
      <main className="bg-[var(--paper)] flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
```

- [ ] **Step 3:** Verify + commit

```bash
npm run build
git add src/app/\(auth\)/layout.tsx
git commit -m "feat(auth): redesign auth layout — solid ink left panel + white form right"
```

### Task 3.2 — Redesign Login page

**Files:**
- Modify: `src/app/(auth)/login/page.tsx`

- [ ] **Step 1:** Read the existing file to preserve email/password and Google OAuth submit logic.

- [ ] **Step 2:** Restyle the form using the new design tokens. Target structure:

```tsx
<div>
  <h1 className="font-display text-3xl">Sign in</h1>
  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-3)] mt-2">
    No account? <Link href="/signup" className="text-[var(--ink)] underline">Create one →</Link>
  </p>
  <div className="mt-8 space-y-5">
    <div>
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" /* ... */ />
    </div>
    <div>
      <Label htmlFor="password">Password</Label>
      <Input id="password" type="password" /* ... */ />
    </div>
    {/* error display: red mono text below input */}
    <Button type="submit" variant="primary" size="lg" className="w-full">
      Sign in <ArrowRight className="h-4 w-4 ml-2" />
    </Button>
  </div>
  <div className="my-6 flex items-center gap-3">
    <div className="flex-1 h-[2px] bg-[var(--ink)]" />
    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-3)]">Or</span>
    <div className="flex-1 h-[2px] bg-[var(--ink)]" />
  </div>
  <GoogleAuthButton /> {/* component already exists; verify its styling matches new design */}
</div>
```

- [ ] **Step 3:** Update `src/components/auth/google-auth-button.tsx` to match — secondary button variant with Google logo.

```tsx
<button className="w-full flex items-center justify-center gap-3 border-2 border-[var(--ink)] bg-[var(--paper)] py-3 font-display text-sm uppercase tracking-[0.06em] shadow-hard-sm press-in-sm">
  <svg /* Google G icon */ />
  Continue with Google
</button>
```

- [ ] **Step 4:** Verify + commit

```bash
npm run build
git add src/app/\(auth\)/login/page.tsx src/components/auth/google-auth-button.tsx
git commit -m "feat(auth): redesign login page + google auth button"
```

### Task 3.3 — Redesign Signup page

**Files:**
- Modify: `src/app/(auth)/signup/page.tsx`

- [ ] **Step 1:** Same pattern as login. Header: "Create account". Fields: name, email, password. Then Google button. Subhead links to login.

- [ ] **Step 2:** Preserve the "check your email" confirmation screen — restyle it as a centered card with green pulse dot + Archivo Black headline + mono instructions.

- [ ] **Step 3:** Verify + commit

```bash
npm run build
git add src/app/\(auth\)/signup/page.tsx
git commit -m "feat(auth): redesign signup page + email confirmation screen"
```

### Task 3.4 — Redesign Role-select page

**Files:**
- Modify: `src/app/(auth)/role-select/page.tsx`

- [ ] **Step 1:** Replace card UI with two big neo-brutalist option cards side-by-side: "I'm a recycler / buyer" (pastel mint) and "I'm a waste producer / seller" (pastel blue). Each card has a chunky icon (Lucide), title, description, and CTA.

```tsx
<button onClick={() => selectRole("recycler")} className="border-2 border-[var(--ink)] bg-[var(--cat-paper)] shadow-hard press-in p-8 text-left">
  <ShoppingCart className="h-10 w-10" />
  <h3 className="font-display text-2xl mt-5 leading-tight">I&apos;m a recycler</h3>
  <p className="text-sm mt-2">Browse the marketplace, bid on lots, settle deals with verified yards.</p>
  <span className="font-display text-xs uppercase tracking-[0.1em] mt-5 inline-block">Continue as buyer →</span>
</button>
```

- [ ] **Step 2:** Verify + commit.

### Task 3.5 — Redesign Onboarding (producer + recycler)

**Files:**
- Modify: `src/app/onboarding/producer/page.tsx`
- Modify: `src/app/onboarding/recycler/page.tsx`

- [ ] **Step 1:** Both onboardings collect basic profile info. Restyle each as a Form archetype: title block + bordered form card with stacked sections + sticky submit.

- [ ] **Step 2:** Preserve all field validations and submission logic.

- [ ] **Step 3:** Verify + commit:

```bash
npm run build
git add src/app/onboarding/producer/page.tsx src/app/onboarding/recycler/page.tsx
git commit -m "feat(onboarding): redesign producer and recycler onboarding"
```

### Task 3.6 — Redesign Pending-approval page

**Files:**
- Modify: `src/app/pending-approval/page.tsx`

- [ ] **Step 1:** Centered card with pulse dot + Archivo Black headline + mono explanation + ghost link "Sign out" or "Try again."

```tsx
<div className="min-h-screen bg-[var(--paper)] flex items-center justify-center p-6">
  <div className="border-2 border-[var(--ink)] bg-[var(--paper)] shadow-hard-lg p-10 text-center max-w-md">
    <div className="pulse-dot mx-auto" />
    <h1 className="font-display text-2xl uppercase mt-6">Pending approval</h1>
    <p className="text-sm text-[var(--ink-2)] mt-3">
      Our team is reviewing your account. You&apos;ll receive an email once approved — usually within 24 hours.
    </p>
    <button className="mt-8 font-display text-xs uppercase tracking-[0.1em] underline">Sign out</button>
  </div>
</div>
```

- [ ] **Step 2:** Verify + commit.

### Task 3.7 — Phase 3 verification

- [ ] **Step 1:** Build + typecheck + lint

```bash
npm run build && npm run typecheck && npm run lint
```

- [ ] **Step 2:** Walk through `/login`, `/signup`, `/role-select`, `/onboarding/producer`, `/onboarding/recycler`, `/pending-approval` in dev. Confirm forms submit, redirects work, mobile layout collapses cleanly.

---

## Phase 4: Buyer + seller authed pages

This phase has the most files. Group related pages into single tasks where the patterns are identical (e.g., listing-index pattern applied to 5 pages = 1 task that lists all 5).

### Task 4.1 — Refactor shared listing components

**Files:**
- Modify: `src/components/shared/scrap-card.tsx`
- Modify: `src/components/shared/booking-card.tsx`
- Modify: `src/components/shared/company-card.tsx`

- [ ] **Step 1:** Apply the Listing card pattern (see spec §3.2):

```tsx
<div className="border-2 border-[var(--ink)] bg-[var(--paper)] shadow-hard press-in p-0 flex flex-col">
  <div className="aspect-[4/3] border-b-2 border-[var(--ink)] bg-[var(--cat-X)] relative overflow-hidden">
    {/* image */}
  </div>
  <div className="p-5 flex-1 flex flex-col">
    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--ink-3)]">{category}</span>
    <h3 className="font-display text-lg leading-tight mt-2">{title}</h3>
    <p className="font-mono text-[10px] tracking-[0.04em] text-[var(--ink-3)] mt-1">{weight} · {city}, {state}</p>
    {bidCount > 0 && <span className="inline-block self-start mt-3 bg-[var(--green)] text-[var(--ink)] font-mono text-[9px] font-bold px-2 py-0.5 tracking-[0.08em]">{bidCount} BIDS</span>}
    <div className="mt-auto pt-4 flex items-end justify-between">
      <div>
        <div className="font-display text-xl">{formatINR(price)}</div>
        <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-[var(--ink-3)]">/ tonne</div>
      </div>
      <ArrowRight className="h-5 w-5" />
    </div>
  </div>
</div>
```

Adapt fields per card type (booking-card has status badge + counterparty, company-card has logo + verified badges + listing count).

- [ ] **Step 2:** Verify + commit each file:

```bash
npm run build
git add src/components/shared/scrap-card.tsx src/components/shared/booking-card.tsx src/components/shared/company-card.tsx
git commit -m "feat(ui): redesign listing card components — scrap, booking, company"
```

### Task 4.2 — Refactor buyer + seller navs

**Files:**
- Modify: `src/components/buyer/buyer-nav.tsx`
- Modify: `src/components/seller/seller-nav.tsx`
- Modify: `src/components/admin/admin-nav.tsx` (used in Phase 5 but easier to do all navs together)

- [ ] **Step 1:** Each role's nav is a sticky top bar matching `<MarketingNav>` style: 2px ink bottom border, white bg, logo+B2B tag left, role-specific links center, avatar dropdown right. Mobile = hamburger.

- [ ] **Step 2:** Buyer nav links: Marketplace · Companies · My bookings · Chat. Seller nav: Dashboard · My company · My scraps · Bookings · Chat. Admin nav: Dashboard · Users · Companies · Listings · Bids · Bookings · Recyclers · Transactions · Contact · Blog.

- [ ] **Step 3:** Verify + commit:

```bash
npm run build
git add src/components/buyer/buyer-nav.tsx src/components/seller/seller-nav.tsx src/components/admin/admin-nav.tsx
git commit -m "feat(ui): redesign role navs (buyer, seller, admin)"
```

### Task 4.3 — Redesign Marketplace browse page

**Files:**
- Modify: `src/app/(buyer)/marketplace/page.tsx`
- Modify: `src/components/buyer/marketplace-filters.tsx`
- Modify: `src/components/buyer/scrap-grid.tsx`
- Modify: `src/app/(buyer)/marketplace/loading.tsx` (if exists; create if not)

- [ ] **Step 1:** Apply Listing index archetype. Top: page title + count. Filter bar: category chip filters (pastel bg per category, ink border, click to toggle), search input, sort dropdown — all in a single bordered row.

```tsx
<div className="border-2 border-[var(--ink)] bg-[var(--paper)] shadow-hard p-4 flex flex-col md:flex-row gap-3 items-start md:items-center">
  <div className="flex flex-wrap gap-2">
    {categories.map(cat => (
      <button
        key={cat.slug}
        onClick={() => toggleCategory(cat.slug)}
        className={`border-2 border-[var(--ink)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] ${active.has(cat.slug) ? `bg-[${cat.color}]` : 'bg-[var(--paper)]'}`}
      >
        {cat.name}
      </button>
    ))}
  </div>
  <Input placeholder="Search..." className="md:max-w-xs" />
  <Select /* sort */ />
</div>
```

- [ ] **Step 2:** Grid: `<ScrapGrid>` renders `<ScrapCard>` (already updated in 4.1) in `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`. Empty state per spec §3.8 (oversized "00" + Archivo Black headline + CTA).

- [ ] **Step 3:** Loading skeleton: array of 6 skeleton cards using restyled `<Skeleton>` primitive.

- [ ] **Step 4:** Verify + commit.

### Task 4.4 — Redesign Marketplace listing detail

**Files:**
- Modify: `src/app/(buyer)/marketplace/[id]/page.tsx`
- Modify: `src/components/buyer/book-scrap-dialog.tsx`
- Modify: `src/components/buyer/submit-bid-dialog.tsx`
- Modify: `src/components/shared/image-gallery.tsx`

- [ ] **Step 1:** Apply Listing detail archetype: gallery left (2px-bordered images), info panel right (title + status badge + meta + description + specs table + seller card + book CTA).

- [ ] **Step 2:** `<BookScrapDialog>` and `<SubmitBidDialog>` use restyled `<Dialog>` primitive. Forms inside use `<Input>`, `<Label>`, `<Button>`.

- [ ] **Step 3:** Verify + commit.

### Task 4.5 — Redesign Companies index + detail

**Files:**
- Modify: `src/app/(buyer)/companies/page.tsx`
- Modify: `src/app/(buyer)/companies/[id]/page.tsx`

- [ ] **Step 1:** Companies index = Listing index archetype, `<CompanyCard>` grid.
- [ ] **Step 2:** Company detail = Listing detail archetype: company logo + name + verified badges header, stats strip, then list of their active scraps using `<ScrapCard>`.
- [ ] **Step 3:** Verify + commit.

### Task 4.6 — Redesign Buyer Bookings (list + detail)

**Files:**
- Modify: `src/app/(buyer)/bookings/page.tsx`
- Modify: `src/app/(buyer)/bookings/[id]/page.tsx`

- [ ] **Step 1:** List = Listing index archetype with `<BookingCard>` grid + filter chips for status (Pending / Confirmed / Completed).
- [ ] **Step 2:** Detail = Listing detail archetype with booking specifics + status timeline + chat-link CTA.
- [ ] **Step 3:** Verify + commit.

### Task 4.7 — Redesign Buyer Profile

**Files:**
- Modify: `src/app/(buyer)/profile/page.tsx`

- [ ] **Step 1:** Apply Form archetype with sections: profile info, password change, account preferences. Each section in own bordered card.
- [ ] **Step 2:** Verify + commit.

### Task 4.8 — Redesign Seller Dashboard

**Files:**
- Modify: `src/app/(seller)/dashboard/page.tsx`

- [ ] **Step 1:** Apply Dashboard archetype: top green stat bar (4 KPIs: active listings, open bids, monthly GMV, settlement rate). Below: 2-col grid of section cards (recent listings, recent bookings, pending actions, quick links).

- [ ] **Step 2:** Each section card has bordered header strip with title + "View all →" ghost link. Body lists 3-5 rows.

- [ ] **Step 3:** Verify + commit.

### Task 4.9 — Redesign Seller Company pages (view + setup + edit)

**Files:**
- Modify: `src/app/(seller)/company/page.tsx`
- Modify: `src/app/(seller)/company/setup/page.tsx`
- Modify: `src/app/(seller)/company/edit/page.tsx`

- [ ] **Step 1:** View = Listing detail archetype but for the seller's own company.
- [ ] **Step 2:** Setup + Edit = Form archetype with sections: basic info, contact, verification docs (image upload).
- [ ] **Step 3:** Verify + commit.

### Task 4.10 — Redesign Seller Scraps (list + new + edit)

**Files:**
- Modify: `src/app/(seller)/scraps/page.tsx`
- Modify: `src/app/(seller)/scraps/new/page.tsx`
- Modify: `src/app/(seller)/scraps/[id]/edit/page.tsx`
- Modify: `src/components/shared/image-upload.tsx`

- [ ] **Step 1:** List = Listing index archetype with `<ScrapCard>` grid + status filter chips.
- [ ] **Step 2:** New + Edit = Form archetype with sections: basic info (title, category, description), specs (weight, location, price), photos. Image upload component restyled.

`<ImageUpload>` redesign:

```tsx
<div className="border-2 border-dashed border-[var(--ink)] bg-[var(--paper)] p-8 text-center cursor-pointer hover:bg-[var(--bg-soft)]">
  <div className="font-display text-4xl">+</div>
  <p className="font-mono text-[10px] uppercase tracking-[0.14em] mt-2">Drop or click to upload</p>
</div>
```

- [ ] **Step 3:** Verify + commit.

### Task 4.11 — Redesign Seller Bookings (list + detail)

**Files:**
- Modify: `src/app/(seller)/seller-bookings/page.tsx`
- Modify: `src/app/(seller)/seller-bookings/[id]/page.tsx`
- Modify: `src/components/seller/listing-bids.tsx`

- [ ] **Step 1:** Same archetype as buyer bookings, but the action context is "manage incoming requests."
- [ ] **Step 2:** `<ListingBids>` table: 2px-bordered rows, mono mid-columns (bid amount, time), accept/reject buttons.
- [ ] **Step 3:** Verify + commit.

### Task 4.12 — Redesign Chat (buyer + seller + transactions)

**Files:**
- Modify: `src/app/(buyer)/bookings/[id]/chat/page.tsx`
- Modify: `src/app/(seller)/seller-bookings/[id]/chat/page.tsx`
- Modify: `src/app/transactions/[id]/chat/page.tsx`
- Modify: `src/components/shared/chat-interface.tsx`
- Modify: `src/components/shared/chat-input.tsx`
- Modify: `src/components/shared/message-bubble.tsx`

- [ ] **Step 1:** Apply Chat archetype:
  - Header: bordered strip with booking summary + status badge + back link
  - Message list: own = `bg-[var(--green)]` + ink border + hard shadow + right-aligned; other = `bg-[var(--paper)]` + ink border + hard shadow + left-aligned
  - Both: sharp corners, max-width ~70% of container
  - Avatar = 40px square ink-bordered with company logo or initial
  - Timestamp = mono 10px between message clusters, centered
  - Input = fixed bottom, full-width, 2px top border, send button = primary

- [ ] **Step 2:** Preserve all Supabase Realtime subscription logic (`use-realtime-messages.ts`). Only restyle.

- [ ] **Step 3:** Verify + commit.

### Task 4.13 — Redesign Transactions pages

**Files:**
- Modify: `src/app/transactions/page.tsx`
- Modify: `src/app/transactions/[id]/page.tsx`

- [ ] **Step 1:** Index = Listing index archetype. Detail = Listing detail archetype with transaction-specific fields (parties, amount, status, settlement timeline).

- [ ] **Step 2:** Verify + commit.

### Task 4.14 — Phase 4 verification

- [ ] **Step 1:** Build + typecheck + lint

```bash
npm run build && npm run typecheck && npm run lint
```

- [ ] **Step 2:** Sign in as `seller1@scrapkart.test` / `Test@1234`. Walk through:
  - Dashboard
  - My company (view → edit)
  - My scraps (list → new → edit)
  - Bookings (list → detail → chat)

- [ ] **Step 3:** Sign in as `buyer1@scrapkart.test` / `Test@1234`. Walk through:
  - Marketplace (browse + filter + search)
  - Listing detail (open booking dialog)
  - Companies (list + detail)
  - My bookings (list + detail + chat)
  - Profile

- [ ] **Step 4:** Resize to 375px throughout. Verify mobile layout.

---

## Phase 5: Admin

Lowest stakes; can ship slightly less polished if pitch deadline pressure. Apply patterns from Phase 4 directly — admin is mostly listing-index + listing-detail + form archetypes.

### Task 5.1 — Redesign Admin Dashboard

**Files:**
- Modify: `src/app/admin/page.tsx`

- [ ] **Step 1:** Dashboard archetype: green stat bar (total users / total listings / GMV / pending verifications). 2-col section cards (recent users, recent listings, flagged content, system health). Verify + commit.

### Task 5.2 — Redesign Admin Users + Recyclers

**Files:**
- Modify: `src/app/admin/users/page.tsx`
- Modify: `src/app/admin/recyclers/page.tsx`

- [ ] **Step 1:** Listing index archetype with role-filter chips, search, table with mono email + role badge + "verify" / "suspend" action buttons.
- [ ] **Step 2:** Verify + commit.

### Task 5.3 — Redesign Admin Companies + Listings + Bids + Bookings + Transactions + Contact

**Files:**
- Modify: `src/app/admin/companies/page.tsx`
- Modify: `src/app/admin/listings/page.tsx`
- Modify: `src/app/admin/bids/page.tsx`
- Modify: `src/app/admin/bookings/page.tsx`
- Modify: `src/app/admin/transactions/page.tsx`
- Modify: `src/app/admin/contact/page.tsx`

- [ ] **Step 1:** All six = Listing index archetype with admin-specific filter chips and bulk-action buttons. Apply the same structural pattern (filter bar + bordered table or grid + pagination).
- [ ] **Step 2:** Verify + commit batch:

```bash
git add src/app/admin/companies/page.tsx src/app/admin/listings/page.tsx src/app/admin/bids/page.tsx src/app/admin/bookings/page.tsx src/app/admin/transactions/page.tsx src/app/admin/contact/page.tsx
git commit -m "feat(admin): redesign admin index pages — companies, listings, bids, bookings, transactions, contact"
```

### Task 5.4 — Redesign Admin Blog (index + new + edit)

**Files:**
- Modify: `src/app/admin/blog/page.tsx`
- Modify: `src/app/admin/blog/new/page.tsx`
- Modify: `src/app/admin/blog/[id]/edit/page.tsx`

- [ ] **Step 1:** Index = Listing index. New + Edit = Form archetype.
- [ ] **Step 2:** Verify + commit.

### Task 5.5 — Phase 5 verification

- [ ] **Step 1:** Build + typecheck + lint

```bash
npm run build && npm run typecheck && npm run lint
```

- [ ] **Step 2:** Sign in as `admin@scrapkart.test` / `Admin@ScrapKart#2024`. Walk through every `/admin/*` page.

---

## Final cleanup + cross-cutting tasks

### Task F.1 — Audit for stale dark-mode references

**Files:** any remaining

- [ ] **Step 1:** Grep for old token classes that should no longer exist:

```bash
grep -rn "bg-\[#0A0A0A\]" src/ || echo "clean"
grep -rn "bg-\[#10B981\]" src/ || echo "clean"
grep -rn "bg-\[#141414\]" src/ || echo "clean"
grep -rn "rounded-xl" src/ || echo "no rounded-xl"
grep -rn "rounded-2xl" src/ || echo "no rounded-2xl"
grep -rn "Plus_Jakarta" src/ || echo "no plus jakarta"
grep -rn "bg-grid-pattern" src/ || echo "no grid pattern"
grep -rn "glow-emerald" src/ || echo "no glow"
grep -rn "text-gradient" src/ || echo "no text gradient"
```

For each match: open the file, replace the stale class with new tokens. If nothing found in any of these greps, you're clean.

- [ ] **Step 2:** Update CLAUDE.md to reflect the new design system (replace the old "UI/UX Redesign — Completed" section with a "UI/UX Overhaul (2026 neo-brutalist)" section pointing to the spec).

- [ ] **Step 3:** Verify + commit:

```bash
npm run build && npm run typecheck && npm run lint
git add -A
git commit -m "chore(ui): final cleanup pass — remove stale dark-mode + emerald references; update CLAUDE.md"
```

### Task F.2 — Verify mock mode still works

- [ ] **Step 1:** Temporarily rename `.env.local` to `.env.local.bak`. Run dev:

```bash
mv .env.local .env.local.bak
npm run dev
```

- [ ] **Step 2:** Visit `/`. The live marketplace panel should display the 3 mock listings. Check that other pages render with mock data.

- [ ] **Step 3:** Restore env:

```bash
mv .env.local.bak .env.local
```

### Task F.3 — Lighthouse + axe pass on landing

- [ ] **Step 1:** Build production:

```bash
npm run build && npm start
```

- [ ] **Step 2:** Open Chrome DevTools → Lighthouse → Mobile → run on `http://localhost:3000/`. Targets: perf ≥ 90, a11y ≥ 90, best-practices ≥ 90, SEO ≥ 90. Fix any blockers.

- [ ] **Step 3:** Open axe DevTools (Chrome extension) on `/`. Fix any `serious` or `critical` violations.

### Task F.4 — Open PR

- [ ] **Step 1:** Push branch:

```bash
git push -u origin feat/ui-overhaul
```

- [ ] **Step 2:** Open PR via gh CLI:

```bash
gh pr create --title "feat(ui): full B2B UI overhaul — neo-brutalist B2C-sibling design" --body "$(cat <<'EOF'
## Summary
- Throws out the dark-emerald-Plus Jakarta UI; replaces with neo-brutalist sibling of `b2c.scrapkart.app`
- Ships across all 35+ pages (landing, auth, buyer, seller, admin) in 5 phases
- Adds live marketplace panel to landing hero (real Supabase data, public/anon read)
- Full token system swap: Archivo + Archivo Black + DM Serif Display + JetBrains Mono fonts; vivid green (#00C842); hard offset shadows; sharp corners

## Spec
`docs/superpowers/specs/2026-04-28-ui-overhaul-design.md`

## Plan
`docs/superpowers/plans/2026-04-29-ui-overhaul.md`

## Test plan
- [ ] Manual walkthrough of landing, login, signup, role-select, onboarding
- [ ] Sign in as seller — dashboard, scraps CRUD, bookings, chat
- [ ] Sign in as buyer — marketplace, listing detail, bookings, chat
- [ ] Sign in as admin — every /admin/* page
- [ ] Resize to 375px on every page; no horizontal scroll
- [ ] Lighthouse ≥ 90 across all four categories on landing
- [ ] axe DevTools — no serious/critical violations
- [ ] Live marketplace panel shows real listings; mock mode fallback works

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-review

**Spec coverage:**
- §1 aesthetic direction → Tasks 1.2, 2.1–2.5 establish look
- §2 token system → Task 1.2 (CSS), Task 1.1 (fonts)
- §3 component patterns → Tasks 1.3–1.12 (shadcn primitives), 2.1, 4.1–4.2 (shared composites)
- §4 live marketplace → Tasks 2.2, 2.3, 2.4 (RLS verify), 2.5 (wire-up)
- §5 page archetypes → Phases 2–5 cover all 7 archetypes across all 35+ files
- §6 phasing → matches plan structure
- §7 risks → Task 2.4 (RLS), Task F.1 (audit), Task F.2 (mock mode)
- §8 quality gates → Tasks 2.9, 3.7, 4.14, 5.5 phase verifications + Task F.3 (lighthouse)
- §9 out-of-scope → no tasks (correctly omitted)
- §10 open questions → noted in spec; resolved at implementation time
- §11 acceptance criteria → Task F.1 (grep audit) + Task F.4 (PR test plan)

**Placeholder scan:** No "TBD", no "fill in details," no "appropriate error handling" without code. Inline ambiguity around schema field names is explicitly flagged with "verify against `src/types/index.ts`" and a fallback path.

**Type consistency:**
- `LiveListing` type defined in Task 2.2, consumed in 2.3 — names match.
- `MarketingNav` / `MarketingFooter` defined in 2.1, consumed in 2.5–2.8 — names match.
- `HeroStatCounter` defined in 2.5 — consumed only in 2.5 — clean.
- `getLiveListings` signature stable across 2.2 and 2.5.

**Scope check:** This plan is one cohesive UI overhaul. The 5 phases are sequential checkpoints, not independent subsystems — each phase produces a working app at the commit boundary, but they share the design system from Phase 1. Single plan is correct.

---

*End of plan.*
