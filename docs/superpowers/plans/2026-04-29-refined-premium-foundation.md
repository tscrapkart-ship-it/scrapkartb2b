# Refined Premium Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the rejected neo-brutalist UI with the Refined Premium foundation (warm-paper, deep-forest, Inter Tight + Fraunces, Lenis + Framer Motion only) across foundation tokens, all 19 shadcn/ui primitives, marketing chrome, the landing page, blog index/detail, contact, and 404.

**Architecture:** Token-first rewrite of `src/app/globals.css` with a backwards-compat shim that keeps the in-app surfaces (buyer/seller/admin) functional while Phase 1 ships. Primitives rewritten in place against the new tokens. Landing page rebuilt section-by-section with Framer Motion driving all reveals/staggers/parallax; Lenis stays as the smooth-scroll layer; GSAP is uninstalled. Backend untouched.

**Tech Stack:** Next.js 16 (App Router, --webpack), React 19, TypeScript strict, Tailwind 4 (CSS-variable based), `@base-ui/react` for primitive logic (kept), `class-variance-authority`, `framer-motion` 12, `lenis` 1.3, `lucide-react` icons, fonts via `next/font/google` (Inter Tight, Fraunces, JetBrains Mono).

**Spec:** `docs/superpowers/specs/2026-04-29-refined-premium-foundation-design.md`

**Branch:** `feat/ui-overhaul` (continues here; brutalist commits are overwritten file-by-file as each task lands; **no `git push` until user explicitly approves**).

**No-test-framework note:** This project has no test runner. Each task's verification cycle is: `npm run typecheck` → `npm run lint` → visual verification in the browser at the page URL listed in the task → commit.

---

## Task index

- **Task 1** — Foundation: token rewrite, font swap, dependency cleanup
- **Task 2** — Lenis tuning + create shared motion primitives
- **Task 3** — Primitive: Button
- **Task 4** — Primitive: Card
- **Task 5** — Primitive: Badge
- **Task 6** — Primitives: Input, Textarea, Label
- **Task 7** — Primitives: Select, Dropdown Menu, Tabs
- **Task 8** — Primitives: Dialog, Alert Dialog, Sheet
- **Task 9** — Primitives: Tooltip, Avatar, Breadcrumb, Separator, Skeleton, Scroll-Area, Sonner
- **Task 10** — Marketing nav + footer rewrite
- **Task 11** — Hero stat counter (Framer Motion rewrite, GSAP removed)
- **Task 12** — Live marketplace panel redesign
- **Task 13** — Landing page hero section
- **Task 14** — Landing page: how-it-works section
- **Task 15** — Landing page: categories grid
- **Task 16** — Landing page: why-ScrapKart narrative + CTA band
- **Task 17** — Landing page: full assembly + final wiring
- **Task 18** — Blog index + detail redesign
- **Task 19** — Contact page redesign
- **Task 20** — 404 page redesign
- **Task 21** — Final verification: reduced motion + build + Lighthouse + commit lock

---

## File map

**Created:**
- `src/components/shared/reveal.tsx` — `<Reveal>`, `<RevealStagger>` Framer Motion primitives
- `src/components/shared/parallax-image.tsx` — gentle scroll parallax wrapper
- `src/components/landing/spec-strip.tsx` — the 4-stat strip with count-up
- `src/components/landing/how-it-works.tsx`
- `src/components/landing/categories-grid.tsx`
- `src/components/landing/why-section.tsx`
- `src/components/landing/cta-band.tsx`

**Rewritten in place:**
- `src/app/globals.css` (full rewrite)
- `src/app/layout.tsx` (font swap)
- `src/app/page.tsx` (landing)
- `src/app/blogs/page.tsx`
- `src/app/blogs/[slug]/page.tsx`
- `src/app/contact/page.tsx`
- `src/app/not-found.tsx`
- `src/components/shared/marketing-nav.tsx`
- `src/components/shared/marketing-footer.tsx`
- `src/components/shared/lenis-provider.tsx` (small tuning)
- `src/components/shared/live-marketplace-panel.tsx`
- `src/components/landing/hero-stat-counter.tsx`
- All 19 `src/components/ui/*.tsx` primitives

**Deleted from deps:**
- `gsap`
- `@gsap/react`

---

## Task 1 — Foundation: tokens, fonts, dep cleanup

**Files:**
- Modify: `src/app/globals.css` (full rewrite)
- Modify: `src/app/layout.tsx` (swap fonts to Inter Tight + Fraunces + JetBrains Mono)
- Modify: `package.json` (remove `gsap`, `@gsap/react`)

- [ ] **Step 1.1: Rewrite `src/app/globals.css`** with the full Refined Premium token system.

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: var(--paper);
  --color-foreground: var(--ink);
  --color-card: var(--paper);
  --color-card-foreground: var(--ink);
  --color-popover: var(--paper);
  --color-popover-foreground: var(--ink);
  --color-primary: var(--forest);
  --color-primary-foreground: #FFFFFF;
  --color-secondary: var(--paper-2);
  --color-secondary-foreground: var(--ink);
  --color-muted: var(--paper-2);
  --color-muted-foreground: var(--ink-3);
  --color-accent: var(--forest);
  --color-accent-foreground: #FFFFFF;
  --color-destructive: var(--danger);
  --color-border: var(--line);
  --color-input: var(--line);
  --color-ring: var(--forest);

  /* Brand surface aliases (used by shadcn theme map) */
  --color-paper:        var(--paper);
  --color-paper-2:      var(--paper-2);
  --color-paper-3:      var(--paper-3);
  --color-ink:          var(--ink);
  --color-ink-2:        var(--ink-2);
  --color-ink-3:        var(--ink-3);
  --color-ink-4:        var(--ink-4);
  --color-line:         var(--line);
  --color-line-2:       var(--line-2);
  --color-forest:       var(--forest);
  --color-forest-2:     var(--forest-2);
  --color-forest-tint:  var(--forest-tint);
  --color-warning:      var(--warning);
  --color-danger:       var(--danger);
  --color-info:         var(--info);
  --color-success:      var(--success);

  --font-sans:    var(--font-inter-tight);
  --font-display: var(--font-inter-tight);
  --font-serif:   var(--font-fraunces);
  --font-mono:    var(--font-jetbrains-mono);

  --radius-xs:  4px;
  --radius-sm:  6px;
  --radius-md:  8px;
  --radius-lg:  12px;
  --radius-xl:  16px;
}

:root {
  /* === Surfaces === */
  --paper:           #FAFAF7;
  --paper-2:         #F4F2EC;
  --paper-3:         #EFEDE5;

  /* === Ink === */
  --ink:             #0A0A0A;
  --ink-2:           #3A3A38;
  --ink-3:           #6E6C66;
  --ink-4:           #A4A29A;

  /* === Lines === */
  --line:            #E5E2D8;
  --line-2:          #EFEDE5;

  /* === Brand — deep forest === */
  --forest:          #0F4D2A;
  --forest-2:        #0B3D1F;
  --forest-tint:     #E8F0EA;
  --bark:            #1A2419;

  /* === Status === */
  --warning:         #B96A11;
  --danger:          #B0322A;
  --info:            #0F3D6E;
  --success:         #0F4D2A;

  /* === Shadows (whisper-level) === */
  --shadow-1: 0 1px 2px rgba(15, 77, 42, 0.04),
              0 4px 12px rgba(0, 0, 0, 0.025);
  --shadow-2: 0 1px 2px rgba(15, 77, 42, 0.05),
              0 8px 24px rgba(0, 0, 0, 0.04);
  --shadow-3: 0 2px 4px rgba(15, 77, 42, 0.06),
              0 16px 40px rgba(0, 0, 0, 0.06);
  --ring-forest: 0 0 0 3px rgba(15, 77, 42, 0.18);
  --ring-ink:    0 0 0 3px rgba(10, 10, 10, 0.12);

  /* === Spacing === */
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

  /* === Container === */
  --container-max:    1200px;
  --container-narrow: 720px;
  --container-pad-x:  clamp(20px, 4vw, 56px);
  --section-y:        clamp(64px, 9vw, 128px);
  --section-y-tight:  clamp(40px, 6vw, 80px);

  /* === Type scale === */
  --tracking-tight:    -0.025em;
  --tracking-display:  -0.038em;
  --tracking-mono:      0.04em;
  --tracking-uppercase: 0.10em;

  /* === Motion === */
  --ease:           cubic-bezier(0.32, 0.72, 0, 1);
  --ease-in-out:    cubic-bezier(0.65, 0.05, 0.36, 1);
  --motion-fast:    200ms;
  --motion-base:    450ms;
  --motion-slow:    700ms;

  /* === Backwards-compat shim ===
     Phase 3 (in-app pages) still references old token names. Keep these mapped
     to the new system so authenticated routes render until they get rewritten.
     Removed when Phase 3 ships. */
  --green:        var(--forest);
  --green-deep:   var(--forest-2);
  --green-tint:   var(--forest-tint);
  --border-soft:  var(--line);
  --bg-soft:      var(--paper-2);
  --cat-metal:    #DDE8F4;
  --cat-ewaste:   #FCE0E3;
  --cat-plastic:  #FCF4CC;
  --cat-paper:    #D7F2DD;
  --cat-glass:    #E2E0F4;
  --cat-mixed:    #F4ECDD;
  --shadow-xs:    var(--shadow-1);
  --shadow-sm:    var(--shadow-1);
  --shadow:       var(--shadow-2);
  --shadow-lg:    var(--shadow-3);
  --shadow-green: 0 0 0 3px rgba(15, 77, 42, 0.18);
  --radius:       var(--radius-md);
}

@layer base {
  * { border-color: var(--line); }
  html {
    overflow-x: hidden;
  }
  body {
    background: var(--paper);
    color: var(--ink);
    font-family: var(--font-inter-tight), ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
    font-feature-settings: "ss01", "cv11";
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  h1, h2, h3, h4 {
    font-family: var(--font-inter-tight), ui-sans-serif, system-ui, sans-serif;
    font-weight: 600;
    color: var(--ink);
    text-wrap: balance;
  }
  h1 { letter-spacing: var(--tracking-display); line-height: 0.96; }
  h2 { letter-spacing: var(--tracking-tight);   line-height: 1.05; }
  h3 { letter-spacing: var(--tracking-tight);   line-height: 1.1;  }
  h4 { letter-spacing: -0.015em;                line-height: 1.2;  }
  p  { text-wrap: pretty; line-height: 1.55; }
  ::selection { background: var(--forest-tint); color: var(--forest); }
}

@layer utilities {
  /* Container */
  .container-page { max-width: var(--container-max); margin-inline: auto; padding-inline: var(--container-pad-x); }
  .container-narrow { max-width: var(--container-narrow); margin-inline: auto; padding-inline: var(--container-pad-x); }

  /* Typography */
  .font-display      { font-family: var(--font-inter-tight), ui-sans-serif, system-ui, sans-serif; }
  .font-serif-italic { font-family: var(--font-fraunces), Georgia, serif; font-style: italic; font-weight: 400; font-variation-settings: "opsz" 144; }
  .font-mono         { font-family: var(--font-jetbrains-mono), "JetBrains Mono", ui-monospace, "Courier New", monospace; }

  /* Italic accent helper for headlines */
  .italic-accent {
    font-family: var(--font-fraunces), Georgia, serif;
    font-style: italic;
    font-weight: 400;
    font-variation-settings: "opsz" 144;
    color: var(--forest);
    letter-spacing: -0.02em;
  }

  /* Mono caption */
  .mono-caption {
    font-family: var(--font-jetbrains-mono), ui-monospace, monospace;
    font-size: 11px;
    letter-spacing: var(--tracking-uppercase);
    text-transform: uppercase;
    color: var(--ink-3);
    font-weight: 500;
  }

  /* Eyebrow chip */
  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    background: var(--forest-tint);
    color: var(--forest);
    border-radius: 999px;
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0;
  }
  .eyebrow .dot {
    width: 5px; height: 5px;
    background: var(--forest);
    border-radius: 50%;
  }

  /* Live pulse dot — used by live marketplace panel */
  .pulse-dot {
    width: 7px; height: 7px;
    background: var(--forest);
    border-radius: 999px;
    box-shadow: 0 0 0 3px rgba(15, 77, 42, 0.22);
    animation: pulse 1.6s infinite;
    display: inline-block;
  }
  @keyframes pulse {
    0%, 100% { box-shadow: 0 0 0 3px rgba(15, 77, 42, 0.22); }
    50%      { box-shadow: 0 0 0 7px rgba(15, 77, 42, 0.04); }
  }

  /* Whisper shadows (utility wrappers) */
  .shadow-1 { box-shadow: var(--shadow-1); }
  .shadow-2 { box-shadow: var(--shadow-2); }
  .shadow-3 { box-shadow: var(--shadow-3); }

  /* Backwards-compat shadow utils (remove with shim in Phase 3) */
  .shadow-hard, .shadow-hard-sm, .shadow-hard-xs, .shadow-hard-lg, .shadow-green {
    box-shadow: var(--shadow-1);
  }

  /* Press-in (back-compat for in-app pages) */
  .press-in, .press-in-sm, .press-in-green {
    transition: transform var(--motion-fast) var(--ease), box-shadow var(--motion-fast) var(--ease);
  }
  .press-in:hover, .press-in-sm:hover, .press-in-green:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-2);
  }

  /* Bg grid pattern (legacy in-app, kept available) */
  .bg-grid-pattern {
    background-image:
      linear-gradient(to right, var(--line-2) 1px, transparent 1px),
      linear-gradient(to bottom, var(--line-2) 1px, transparent 1px);
    background-size: 32px 32px;
  }

  /* Reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 120ms !important;
      scroll-behavior: auto !important;
    }
    .press-in:hover, .press-in-sm:hover, .press-in-green:hover {
      transform: none;
    }
  }
}
```

- [ ] **Step 1.2: Rewrite `src/app/layout.tsx`** to load Inter Tight + Fraunces + JetBrains Mono only.

```tsx
import type { Metadata } from "next";
import { Inter_Tight, Fraunces, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import { LenisProvider } from "@/components/shared/lenis-provider";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500"],
  style: ["italic"],
  axes: ["opsz"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ScrapKart — B2B Industrial Scrap Marketplace",
  description:
    "List your lot. Verified buyers bid. Settle in 72 hours. India's B2B exchange for industrial scrap.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ScrapKart",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#FAFAF7" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${interTight.variable} ${fraunces.variable} ${jetBrainsMono.variable} antialiased overflow-x-hidden`}>
        <NextTopLoader color="#0F4D2A" height={2} showSpinner={false} shadow="none" />
        <LenisProvider />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

- [ ] **Step 1.3: Uninstall GSAP packages.**

Run: `npm uninstall gsap @gsap/react`
Expected: removes both packages and updates `package-lock.json`.

- [ ] **Step 1.4: Run typecheck — expect a few failures (existing GSAP imports in `hero-stat-counter.tsx`, etc.).**

Run: `npm run typecheck`
Expected: errors like "Cannot find module 'gsap'" in `src/components/landing/hero-stat-counter.tsx`. These are addressed in Task 11. Other errors (token names, font names) will surface as primitives are touched. **Do not fix these now** — they'll resolve as the plan progresses.

- [ ] **Step 1.5: Visual smoke check — start dev server and load `/`.**

Run: `npm run dev`
Expected: server starts on `http://localhost:3000`. Open the landing page. It will look broken (mismatched fonts, hard borders that no longer match the new soft system, inline classes that reference shadow-hard etc., GSAP throwing in `HeroStatCounter`). This is expected mid-build. Confirm only that **the page renders** (does not throw an unrecoverable error) and the warm paper background `#FAFAF7` is visible. Stop the dev server.

- [ ] **Step 1.6: Commit.**

```bash
git add src/app/globals.css src/app/layout.tsx package.json package-lock.json
git commit -m "feat(foundation): refined-premium tokens + Inter Tight/Fraunces/Mono fonts; remove GSAP"
```

---

## Task 2 — Lenis tuning + shared motion primitives

**Files:**
- Modify: `src/components/shared/lenis-provider.tsx` (small easing tweak)
- Create: `src/components/shared/reveal.tsx` (Framer Motion `<Reveal>` + `<RevealStagger>`)
- Create: `src/components/shared/parallax-image.tsx` (gentle scroll parallax wrapper)

- [ ] **Step 2.1: Tune Lenis** in `src/components/shared/lenis-provider.tsx`.

```tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export function LenisProvider() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      syncTouch: false,
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
```

- [ ] **Step 2.2: Create `src/components/shared/reveal.tsx`** — the canonical Framer Motion reveal helpers used across landing/blog/contact/404.

```tsx
"use client";

import { motion, type HTMLMotionProps, type Variants } from "framer-motion";
import { type ReactNode } from "react";

const EASE = [0.32, 0.72, 0, 1] as const;

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

const staggerContainer: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

const heroEntrance: Variants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const heroChild: Variants = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};

type RevealProps = HTMLMotionProps<"div"> & { children: ReactNode };

export function Reveal({ children, ...props }: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-15% 0px" }}
      variants={revealVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function RevealStagger({ children, ...props }: RevealProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-15% 0px" }}
      variants={staggerContainer}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, ...props }: RevealProps) {
  return (
    <motion.div variants={staggerChild} {...props}>
      {children}
    </motion.div>
  );
}

export function HeroEntrance({ children, ...props }: RevealProps) {
  return (
    <motion.div initial="hidden" animate="show" variants={heroEntrance} {...props}>
      {children}
    </motion.div>
  );
}

export function HeroEntranceItem({ children, ...props }: RevealProps) {
  return (
    <motion.div variants={heroChild} {...props}>
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 2.3: Create `src/components/shared/parallax-image.tsx`** — gentle scroll-driven scale + y for hero/section photography.

```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionStyle } from "framer-motion";
import Image, { type ImageProps } from "next/image";

type ParallaxImageProps = Omit<ImageProps, "style"> & {
  /** Visual rest scale; image scales from `intensity * 1.05` → `1.0` as the section traverses the viewport. Default 1. */
  intensity?: number;
  className?: string;
  containerClassName?: string;
  style?: MotionStyle;
};

/**
 * Scales 1.05 → 1.0 and translates 0 → -2% as the section scrolls through the viewport.
 * Reduced motion is handled at the CSS level (transitions become instant), so the visual
 * jump is minimal for users with the preference set.
 */
export function ParallaxImage({
  intensity = 1,
  className,
  containerClassName,
  style,
  alt,
  ...imageProps
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.05 * intensity, 1.0]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-2%"]);

  return (
    <div ref={ref} className={containerClassName} style={{ overflow: "hidden", position: "relative" }}>
      <motion.div style={{ scale, y, ...(style ?? {}) }} className="will-change-transform">
        <Image alt={alt} className={className} {...imageProps} />
      </motion.div>
    </div>
  );
}
```

- [ ] **Step 2.4: Typecheck the new files.**

Run: `npm run typecheck`
Expected: no new errors in the new files. Pre-existing errors from the broken brutalist primitives remain — ignore them, they'll be fixed as primitives land.

- [ ] **Step 2.5: Commit.**

```bash
git add src/components/shared/lenis-provider.tsx src/components/shared/reveal.tsx src/components/shared/parallax-image.tsx
git commit -m "feat(motion): tune Lenis ease-out-cubic + add Reveal/ParallaxImage primitives"
```

---

## Task 3 — Primitive: Button

**Files:**
- Modify: `src/components/ui/button.tsx`

- [ ] **Step 3.1: Rewrite `src/components/ui/button.tsx`.**

```tsx
"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium tracking-[-0.005em] transition-[transform,box-shadow,background-color,color,border-color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:shadow-[var(--ring-forest)] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--forest)] text-white border border-[var(--forest)] hover:bg-[var(--forest-2)] hover:border-[var(--forest-2)] hover:-translate-y-px shadow-[var(--shadow-1)]",
        secondary:
          "bg-[var(--paper)] text-[var(--ink)] border border-[var(--line)] hover:bg-[var(--paper-2)] hover:-translate-y-px",
        ghost:
          "bg-transparent text-[var(--ink)] border border-transparent hover:bg-[var(--paper-2)]",
        link:
          "bg-transparent text-[var(--ink)] border-0 h-auto p-0 underline-offset-4 hover:underline hover:text-[var(--forest)]",
        destructive:
          "bg-[var(--danger)] text-white border border-[var(--danger)] hover:opacity-90 hover:-translate-y-px shadow-[var(--shadow-1)]",
        // back-compat aliases (existing callsites in (buyer)/(seller)/admin still pass these)
        default:
          "bg-[var(--forest)] text-white border border-[var(--forest)] hover:bg-[var(--forest-2)] hover:border-[var(--forest-2)] hover:-translate-y-px shadow-[var(--shadow-1)]",
        outline:
          "bg-[var(--paper)] text-[var(--ink)] border border-[var(--line)] hover:bg-[var(--paper-2)] hover:-translate-y-px",
      },
      size: {
        sm:    "h-9 px-3 text-[13px] rounded-[var(--radius-sm)]",
        md:    "h-11 px-5 text-[14.5px] rounded-[var(--radius-md)]",
        lg:    "h-12 px-6 text-[15px] rounded-[var(--radius-md)]",
        icon:  "h-11 w-11 px-0 rounded-[var(--radius-md)]",
        // back-compat
        default:    "h-11 px-5 text-[14.5px] rounded-[var(--radius-md)]",
        "icon-sm":  "h-9 w-9 px-0 rounded-[var(--radius-sm)]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

- [ ] **Step 3.2: Typecheck.**

Run: `npm run typecheck`
Expected: no errors introduced by `button.tsx`. Pre-existing errors elsewhere remain.

- [ ] **Step 3.3: Visual check.**

Run: `npm run dev`
Open `http://localhost:3000`. The hero "Post a listing" / "Browse marketplace" buttons should now render with forest fill / hairline border, slight upward translate on hover. Stop dev server.

- [ ] **Step 3.4: Commit.**

```bash
git add src/components/ui/button.tsx
git commit -m "feat(ui): rewrite Button primitive in Refined Premium"
```

---

## Task 4 — Primitive: Card

**Files:**
- Modify: `src/components/ui/card.tsx`

- [ ] **Step 4.1: Rewrite `src/components/ui/card.tsx`.**

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "bg-[var(--paper)] text-[var(--ink)] border border-[var(--line)] rounded-[var(--radius-lg)] shadow-[var(--shadow-1)] transition-[box-shadow,transform] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col",
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn("border-b border-[var(--line-2)] px-6 py-5", className)}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn("text-[17px] font-semibold tracking-[-0.015em] leading-tight text-[var(--ink)]", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-[13.5px] text-[var(--ink-3)] mt-1.5 leading-relaxed", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="card-content" className={cn("px-6 py-5", className)} {...props} />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn("border-t border-[var(--line-2)] px-6 py-4 flex items-center", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
```

- [ ] **Step 4.2: Typecheck and commit.**

```bash
npm run typecheck
git add src/components/ui/card.tsx
git commit -m "feat(ui): rewrite Card primitive in Refined Premium"
```

---

## Task 5 — Primitive: Badge

**Files:**
- Modify: `src/components/ui/badge.tsx`

- [ ] **Step 5.1: Rewrite `src/components/ui/badge.tsx`.**

```tsx
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.1em] font-medium rounded-[var(--radius-xs)] px-2 py-1 leading-none border",
  {
    variants: {
      variant: {
        default:     "bg-[var(--paper-2)] text-[var(--ink-2)] border-[var(--line)]",
        forest:      "bg-[var(--forest-tint)] text-[var(--forest)] border-[var(--forest-tint)]",
        ink:         "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]",
        warning:     "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/30",
        danger:      "bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/30",
        success:     "bg-[var(--forest-tint)] text-[var(--forest)] border-[var(--forest-tint)]",
        outline:     "bg-transparent text-[var(--ink-2)] border-[var(--line)]",
        // back-compat aliases (existing callsites)
        verified:    "bg-[var(--forest-tint)] text-[var(--forest)] border-[var(--forest-tint)]",
        active:      "bg-[var(--forest-tint)] text-[var(--forest)] border-[var(--forest-tint)]",
        pending:     "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/30",
        booked:      "bg-[var(--paper-2)] text-[var(--ink-2)] border-[var(--line)]",
        suspended:   "bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/30",
        secondary:   "bg-[var(--paper-2)] text-[var(--ink-2)] border-[var(--line)]",
        destructive: "bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/30",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      { className: cn(badgeVariants({ variant }), className) },
      props
    ),
    render,
    state: { slot: "badge", variant },
  })
}

export { Badge, badgeVariants }
```

- [ ] **Step 5.2: Typecheck and commit.**

```bash
npm run typecheck
git add src/components/ui/badge.tsx
git commit -m "feat(ui): rewrite Badge primitive in Refined Premium"
```

---

## Task 6 — Primitives: Input, Textarea, Label

**Files:**
- Modify: `src/components/ui/input.tsx`
- Modify: `src/components/ui/textarea.tsx`
- Modify: `src/components/ui/label.tsx`

- [ ] **Step 6.1: Rewrite `src/components/ui/input.tsx`.**

```tsx
import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-[14.5px] text-[var(--ink)] placeholder:text-[var(--ink-4)] transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:border-[var(--forest)] focus-visible:shadow-[var(--ring-forest)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
```

- [ ] **Step 6.2: Rewrite `src/components/ui/textarea.tsx`.**

```tsx
import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[112px] w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-[14.5px] text-[var(--ink)] placeholder:text-[var(--ink-4)] transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:border-[var(--forest)] focus-visible:shadow-[var(--ring-forest)] disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
```

- [ ] **Step 6.3: Rewrite `src/components/ui/label.tsx`.**

```tsx
"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "inline-block text-[13px] font-medium text-[var(--ink-2)] mb-2",
        className
      )}
      {...props}
    />
  )
}

export { Label }
```

- [ ] **Step 6.4: Typecheck and commit.**

```bash
npm run typecheck
git add src/components/ui/input.tsx src/components/ui/textarea.tsx src/components/ui/label.tsx
git commit -m "feat(ui): rewrite Input/Textarea/Label primitives in Refined Premium"
```

---

## Task 7 — Primitives: Select, Dropdown Menu, Tabs

**Files:**
- Modify: `src/components/ui/select.tsx`
- Modify: `src/components/ui/dropdown-menu.tsx`
- Modify: `src/components/ui/tabs.tsx`

- [ ] **Step 7.1: Rewrite `src/components/ui/select.tsx`.**

```tsx
"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"

import { cn } from "@/lib/utils"
import { ChevronDownIcon, CheckIcon, ChevronUpIcon } from "lucide-react"

const Select = SelectPrimitive.Root

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  )
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return (
    <SelectPrimitive.Value
      data-slot="select-value"
      className={cn("flex flex-1 text-left", className)}
      {...props}
    />
  )
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectPrimitive.Trigger.Props & { size?: "sm" | "default" }) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        "flex h-11 w-full items-center justify-between rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-[14.5px] text-[var(--ink)] transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] focus:outline-none focus:border-[var(--forest)] focus:shadow-[var(--ring-forest)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon
        render={<ChevronDownIcon className="pointer-events-none size-4 text-[var(--ink-3)]" />}
      />
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 6,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
  ...props
}: SelectPrimitive.Popup.Props &
  Pick<SelectPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger">) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          data-align-trigger={alignItemWithTrigger}
          className={cn(
            "z-50 min-w-[8rem] overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] shadow-[var(--shadow-2)] text-[var(--ink)]",
            className
          )}
          {...props}
        >
          <SelectScrollUpButton />
          <SelectPrimitive.List>{children}</SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({ className, ...props }: SelectPrimitive.GroupLabel.Props) {
  return (
    <SelectPrimitive.GroupLabel
      data-slot="select-label"
      className={cn("px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--ink-3)]", className)}
      {...props}
    />
  )
}

function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-[var(--radius-sm)] mx-1 px-3 py-2 text-[14px] outline-none focus:bg-[var(--paper-2)] data-[state=checked]:bg-[var(--forest-tint)] data-[state=checked]:text-[var(--forest)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 transition-colors",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 gap-2 whitespace-nowrap">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator
        render={<span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center" />}
      >
        <CheckIcon className="pointer-events-none size-3.5" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({ className, ...props }: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-[var(--line-2)]", className)}
      {...props}
    />
  )
}

function SelectScrollUpButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollUpArrow>) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={cn("top-0 z-10 flex w-full cursor-default items-center justify-center bg-[var(--paper)] py-1 [&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpArrow>
  )
}

function SelectScrollDownButton({ className, ...props }: React.ComponentProps<typeof SelectPrimitive.ScrollDownArrow>) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={cn("bottom-0 z-10 flex w-full cursor-default items-center justify-center bg-[var(--paper)] py-1 [&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownArrow>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
```

- [ ] **Step 7.2: Rewrite `src/components/ui/dropdown-menu.tsx`.**

```tsx
"use client"

import * as React from "react"
import { Menu as MenuPrimitive } from "@base-ui/react/menu"

import { cn } from "@/lib/utils"
import { ChevronRightIcon, CheckIcon } from "lucide-react"

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

const popupClass =
  "z-50 min-w-[8rem] overflow-hidden rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] shadow-[var(--shadow-2)] p-1 text-[var(--ink)] data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"

function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 6,
  className,
  ...props
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        className="isolate z-50 outline-none"
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
      >
        <MenuPrimitive.Popup data-slot="dropdown-menu-content" className={cn(popupClass, className)} {...props} />
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

function DropdownMenuLabel({
  className,
  inset,
  ...props
}: MenuPrimitive.GroupLabel.Props & { inset?: boolean }) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn("px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--ink-3)] data-inset:pl-7", className)}
      {...props}
    />
  )
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: MenuPrimitive.Item.Props & { inset?: boolean; variant?: "default" | "destructive" }) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-[var(--radius-sm)] mx-0.5 px-3 py-2 text-[14px] outline-none transition-colors focus:bg-[var(--paper-2)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-inset:pl-7 data-[variant=destructive]:text-[var(--danger)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: MenuPrimitive.SubmenuTrigger.Props & { inset?: boolean }) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        "flex cursor-default select-none items-center rounded-[var(--radius-sm)] mx-0.5 px-3 py-2 text-[14px] outline-none focus:bg-[var(--paper-2)] data-inset:pl-7 data-popup-open:bg-[var(--paper-2)] data-open:bg-[var(--paper-2)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ml-auto" />
    </MenuPrimitive.SubmenuTrigger>
  )
}

function DropdownMenuSubContent({
  align = "start",
  alignOffset = -3,
  side = "right",
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn(popupClass, "w-auto min-w-[120px]", className)}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  )
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  inset,
  ...props
}: MenuPrimitive.CheckboxItem.Props & { inset?: boolean }) {
  return (
    <MenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-[var(--radius-sm)] mx-0.5 py-2 pr-8 pl-3 text-[14px] outline-none focus:bg-[var(--paper-2)] data-inset:pl-7 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex items-center justify-center" data-slot="dropdown-menu-checkbox-item-indicator">
        <MenuPrimitive.CheckboxItemIndicator>
          <CheckIcon className="size-3.5" />
        </MenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </MenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return <MenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />
}

function DropdownMenuRadioItem({
  className,
  children,
  inset,
  ...props
}: MenuPrimitive.RadioItem.Props & { inset?: boolean }) {
  return (
    <MenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      data-inset={inset}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-[var(--radius-sm)] mx-0.5 py-2 pr-8 pl-3 text-[14px] outline-none focus:bg-[var(--paper-2)] data-inset:pl-7 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-2 flex items-center justify-center" data-slot="dropdown-menu-radio-item-indicator">
        <MenuPrimitive.RadioItemIndicator>
          <CheckIcon className="size-3.5" />
        </MenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </MenuPrimitive.RadioItem>
  )
}

function DropdownMenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-[var(--line-2)]", className)}
      {...props}
    />
  )
}

function DropdownMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("font-mono text-[11px] tracking-[0.04em] text-[var(--ink-3)] ml-auto", className)}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}
```

- [ ] **Step 7.3: Rewrite `src/components/ui/tabs.tsx`** with a Framer Motion `layoutId` underline indicator.

```tsx
"use client"

import * as React from "react"
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn("group/tabs flex flex-col gap-3", className)}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "group/tabs-list inline-flex items-center gap-6 border-b border-[var(--line)]",
  {
    variants: {
      variant: {
        default: "",
        line: "",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex items-center justify-center pb-3 pt-1 text-[14px] font-medium text-[var(--ink-3)] transition-colors hover:text-[var(--ink)] data-[state=active]:text-[var(--ink)] data-active:text-[var(--ink)] disabled:pointer-events-none disabled:opacity-50 after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-[-1px] after:h-[2px] after:bg-transparent data-[state=active]:after:bg-[var(--forest)] data-active:after:bg-[var(--forest)] after:transition-colors after:duration-200",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel data-slot="tabs-content" className={cn("mt-3 outline-none", className)} {...props} />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
```

- [ ] **Step 7.4: Typecheck and commit.**

```bash
npm run typecheck
git add src/components/ui/select.tsx src/components/ui/dropdown-menu.tsx src/components/ui/tabs.tsx
git commit -m "feat(ui): rewrite Select/Dropdown/Tabs primitives in Refined Premium"
```

---

## Task 8 — Primitives: Dialog, Alert Dialog, Sheet

**Files:**
- Modify: `src/components/ui/dialog.tsx`
- Modify: `src/components/ui/alert-dialog.tsx`
- Modify: `src/components/ui/sheet.tsx`

- [ ] **Step 8.1: Rewrite `src/components/ui/dialog.tsx`.**

```tsx
"use client"

import * as React from "react"
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-[rgba(10,10,10,0.4)] backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogPrimitive.Popup.Props & { showCloseButton?: boolean }) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid w-full max-w-[560px] -translate-x-1/2 -translate-y-1/2 gap-0 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] shadow-[var(--shadow-3)] duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={<Button variant="ghost" className="absolute top-3 right-3" size="icon-sm" />}
          >
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-header"
      className={cn("border-b border-[var(--line-2)] px-6 py-5 flex flex-col gap-1", className)}
      {...props}
    />
  )
}

function DialogFooter({
  className,
  showCloseButton = false,
  children,
  ...props
}: React.ComponentProps<"div"> & { showCloseButton?: boolean }) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "border-t border-[var(--line-2)] px-6 py-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close render={<Button variant="secondary" />}>Close</DialogPrimitive.Close>
      )}
    </div>
  )
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("text-[18px] font-semibold tracking-[-0.015em] leading-tight text-[var(--ink)]", className)}
      {...props}
    />
  )
}

function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-[13.5px] text-[var(--ink-3)] mt-1 leading-relaxed", className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
```

- [ ] **Step 8.2: Rewrite `src/components/ui/alert-dialog.tsx`.**

```tsx
"use client"

import * as React from "react"
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

function AlertDialog({ ...props }: AlertDialogPrimitive.Root.Props) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />
}

function AlertDialogTrigger({ ...props }: AlertDialogPrimitive.Trigger.Props) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
}

function AlertDialogPortal({ ...props }: AlertDialogPrimitive.Portal.Props) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />
}

function AlertDialogOverlay({ className, ...props }: AlertDialogPrimitive.Backdrop.Props) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-[rgba(10,10,10,0.4)] backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

function AlertDialogContent({
  className,
  size = "default",
  ...props
}: AlertDialogPrimitive.Popup.Props & { size?: "default" | "sm" }) {
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Popup
        data-slot="alert-dialog-content"
        data-size={size}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid w-full max-w-[480px] -translate-x-1/2 -translate-y-1/2 gap-0 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] shadow-[var(--shadow-3)] duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0",
          className
        )}
        {...props}
      />
    </AlertDialogPortal>
  )
}

function AlertDialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn("border-b border-[var(--line-2)] px-6 py-5 flex flex-col gap-1", className)}
      {...props}
    />
  )
}

function AlertDialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn("border-t border-[var(--line-2)] px-6 py-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
}

function AlertDialogMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn("mb-3 inline-flex size-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--paper-2)] *:[svg:not([class*='size-'])]:size-5", className)}
      {...props}
    />
  )
}

function AlertDialogTitle({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={cn("text-[18px] font-semibold tracking-[-0.015em] leading-tight text-[var(--ink)]", className)}
      {...props}
    />
  )
}

function AlertDialogDescription({ className, ...props }: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={cn("text-[13.5px] text-[var(--ink-3)] mt-1 leading-relaxed", className)}
      {...props}
    />
  )
}

function AlertDialogAction({ className, ...props }: React.ComponentProps<typeof Button>) {
  return <Button data-slot="alert-dialog-action" className={cn(className)} {...props} />
}

function AlertDialogCancel({
  className,
  variant = "secondary",
  size = "default",
  ...props
}: AlertDialogPrimitive.Close.Props & Pick<React.ComponentProps<typeof Button>, "variant" | "size">) {
  return (
    <AlertDialogPrimitive.Close
      data-slot="alert-dialog-cancel"
      className={cn(className)}
      render={<Button variant={variant} size={size} />}
      {...props}
    />
  )
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
}
```

- [ ] **Step 8.3: Rewrite `src/components/ui/sheet.tsx`.**

```tsx
"use client"

import * as React from "react"
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { XIcon } from "lucide-react"

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-[rgba(10,10,10,0.4)] backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  ...props
}: SheetPrimitive.Popup.Props & { side?: "top" | "right" | "bottom" | "left"; showCloseButton?: boolean }) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={cn(
          "fixed z-50 flex flex-col gap-0 border border-[var(--line)] bg-[var(--paper)] shadow-[var(--shadow-3)] transition duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] data-ending-style:opacity-0 data-starting-style:opacity-0",
          "data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:rounded-t-[var(--radius-lg)] data-[side=bottom]:data-ending-style:translate-y-[1.5rem] data-[side=bottom]:data-starting-style:translate-y-[1.5rem]",
          "data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:data-ending-style:translate-x-[-1.5rem] data-[side=left]:data-starting-style:translate-x-[-1.5rem]",
          "data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-[1.5rem] data-[side=right]:data-starting-style:translate-x-[1.5rem]",
          "data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:rounded-b-[var(--radius-lg)] data-[side=top]:data-ending-style:translate-y-[-1.5rem] data-[side=top]:data-starting-style:translate-y-[-1.5rem]",
          "data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close
            data-slot="sheet-close"
            render={<Button variant="ghost" className="absolute top-3 right-3" size="icon-sm" />}
          >
            <XIcon className="size-4" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-header"
      className={cn("border-b border-[var(--line-2)] px-6 py-5 flex flex-col gap-1", className)}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("border-t border-[var(--line-2)] px-6 py-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end mt-auto", className)}
      {...props}
    />
  )
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-[18px] font-semibold tracking-[-0.015em] leading-tight text-[var(--ink)]", className)}
      {...props}
    />
  )
}

function SheetDescription({ className, ...props }: SheetPrimitive.Description.Props) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-[13.5px] text-[var(--ink-3)] mt-1 leading-relaxed", className)}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
```

- [ ] **Step 8.4: Typecheck and commit.**

```bash
npm run typecheck
git add src/components/ui/dialog.tsx src/components/ui/alert-dialog.tsx src/components/ui/sheet.tsx
git commit -m "feat(ui): rewrite Dialog/AlertDialog/Sheet primitives in Refined Premium"
```

---

## Task 9 — Primitives: Tooltip, Avatar, Breadcrumb, Separator, Skeleton, ScrollArea, Sonner

**Files:**
- Modify: `src/components/ui/tooltip.tsx`
- Modify: `src/components/ui/avatar.tsx`
- Modify: `src/components/ui/breadcrumb.tsx`
- Modify: `src/components/ui/separator.tsx`
- Modify: `src/components/ui/skeleton.tsx`
- Modify: `src/components/ui/scroll-area.tsx`
- Modify: `src/components/ui/sonner.tsx`

- [ ] **Step 9.1: Rewrite `src/components/ui/tooltip.tsx`.**

```tsx
"use client"

import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

function TooltipProvider({ delay = 0, ...props }: TooltipPrimitive.Provider.Props) {
  return <TooltipPrimitive.Provider data-slot="tooltip-provider" delay={delay} {...props} />
}

function Tooltip({ ...props }: TooltipPrimitive.Root.Props) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({ ...props }: TooltipPrimitive.Trigger.Props) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 6,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: TooltipPrimitive.Popup.Props &
  Pick<TooltipPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner align={align} alignOffset={alignOffset} side={side} sideOffset={sideOffset} className="isolate z-50">
        <TooltipPrimitive.Popup
          data-slot="tooltip-content"
          className={cn(
            "z-50 rounded-[var(--radius-sm)] border border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] px-2.5 py-1.5 text-[12px] font-medium shadow-[var(--shadow-2)] data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className
          )}
          {...props}
        >
          {children}
          <TooltipPrimitive.Arrow className="z-50 size-2 translate-y-[calc(-50%-1px)] rotate-45 bg-[var(--ink)] fill-[var(--ink)] data-[side=bottom]:top-1 data-[side=top]:-bottom-2" />
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
```

- [ ] **Step 9.2: Rewrite `src/components/ui/avatar.tsx`.**

```tsx
"use client"

import * as React from "react"
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"

import { cn } from "@/lib/utils"

function Avatar({
  className,
  size = "default",
  ...props
}: AvatarPrimitive.Root.Props & { size?: "default" | "sm" | "lg" }) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "relative flex w-10 h-10 shrink-0 overflow-hidden rounded-[var(--radius-md)] bg-[var(--paper-2)] items-center justify-center text-[14px] font-semibold text-[var(--forest)]",
        "data-[size=sm]:w-8 data-[size=sm]:h-8 data-[size=sm]:text-[12px]",
        "data-[size=lg]:w-12 data-[size=lg]:h-12 data-[size=lg]:text-[16px]",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square h-full w-full object-cover", className)}
      {...props}
    />
  )
}

function AvatarFallback({ className, ...props }: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn("flex h-full w-full items-center justify-center bg-[var(--paper-2)] text-[var(--forest)] font-semibold text-[14px]", className)}
      {...props}
    />
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-[var(--forest)] text-white border-2 border-[var(--paper)] select-none",
        "group-data-[size=sm]/avatar:size-2.5",
        "group-data-[size=default]/avatar:size-3",
        "group-data-[size=lg]/avatar:size-3.5",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn("group/avatar-group flex -space-x-2", className)}
      {...props}
    />
  )
}

function AvatarGroupCount({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--paper-2)] border border-[var(--line)] font-semibold text-[13px] text-[var(--ink-2)] group-has-data-[size=lg]/avatar-group:size-12 group-has-data-[size=sm]/avatar-group:size-8",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarBadge,
}
```

- [ ] **Step 9.3: Rewrite `src/components/ui/breadcrumb.tsx`.**

```tsx
import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@/lib/utils"
import { MoreHorizontalIcon } from "lucide-react"

function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" className={cn(className)} {...props} />
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn("flex flex-wrap items-center gap-2 text-[13px] text-[var(--ink-3)]", className)}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li data-slot="breadcrumb-item" className={cn("inline-flex items-center gap-2", className)} {...props} />
}

function BreadcrumbLink({ className, render, ...props }: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      { className: cn("hover:text-[var(--ink)] transition-colors", className) },
      props
    ),
    render,
    state: { slot: "breadcrumb-link" },
  })
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-[var(--ink)] font-medium", className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">) {
  return (
    <li role="presentation" aria-hidden="true" className={cn("text-[var(--ink-4)]", className)} {...props}>
      {children ?? "/"}
    </li>
  )
}

function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex h-9 w-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
```

- [ ] **Step 9.4: Rewrite `src/components/ui/separator.tsx`.**

```tsx
"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-[var(--line)]",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
```

- [ ] **Step 9.5: Rewrite `src/components/ui/skeleton.tsx`.**

```tsx
import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-[var(--radius-md)] bg-[var(--paper-2)] animate-pulse",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
```

- [ ] **Step 9.6: Rewrite `src/components/ui/scroll-area.tsx`.**

```tsx
"use client"

import * as React from "react"
import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area"

import { cn } from "@/lib/utils"

function ScrollArea({
  className,
  children,
  ...props
}: ScrollAreaPrimitive.Root.Props) {
  return (
    <ScrollAreaPrimitive.Root data-slot="scroll-area" className={cn("relative overflow-hidden", className)} {...props}>
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="size-full transition-[box-shadow] outline-none focus-visible:shadow-[var(--ring-forest)]"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}: ScrollAreaPrimitive.Scrollbar.Props) {
  return (
    <ScrollAreaPrimitive.Scrollbar
      data-slot="scroll-area-scrollbar"
      data-orientation={orientation}
      orientation={orientation}
      className={cn("flex touch-none select-none transition-colors h-full w-2 p-px", className)}
      {...props}
    >
      <ScrollAreaPrimitive.Thumb
        data-slot="scroll-area-thumb"
        className="relative flex-1 rounded-full bg-[var(--ink-4)] hover:bg-[var(--ink-3)] transition-colors"
      />
    </ScrollAreaPrimitive.Scrollbar>
  )
}

export { ScrollArea, ScrollBar }
```

- [ ] **Step 9.7: Rewrite `src/components/ui/sonner.tsx`.**

```tsx
"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-[var(--forest)]" />,
        info: <InfoIcon className="size-4 text-[var(--info)]" />,
        warning: <TriangleAlertIcon className="size-4 text-[var(--warning)]" />,
        error: <OctagonXIcon className="size-4 text-[var(--danger)]" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        style: {
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-md)",
          background: "var(--paper)",
          color: "var(--ink)",
          boxShadow: "var(--shadow-2)",
          fontFamily: "var(--font-inter-tight), system-ui, sans-serif",
        },
        className: "font-sans",
      }}
      {...props}
    />
  )
}

export { Toaster }
```

- [ ] **Step 9.8: Typecheck and commit.**

```bash
npm run typecheck
git add src/components/ui/tooltip.tsx src/components/ui/avatar.tsx src/components/ui/breadcrumb.tsx src/components/ui/separator.tsx src/components/ui/skeleton.tsx src/components/ui/scroll-area.tsx src/components/ui/sonner.tsx
git commit -m "feat(ui): rewrite remaining 7 primitives in Refined Premium"
```

---

## Task 10 — Marketing nav + footer rewrite

**Files:**
- Modify: `src/components/shared/marketing-nav.tsx`
- Modify: `src/components/shared/marketing-footer.tsx`

- [ ] **Step 10.1: Rewrite `src/components/shared/marketing-nav.tsx`** — sticky, blurred paper-bg-rgba on scroll, condensed wordmark + brand glyph, 4 links + sign-in + primary CTA.

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
  const [scrolled, setScrolled] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    { label: "Blog", href: "/blogs" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,border-color,box-shadow] duration-300 ${
        scrolled
          ? "bg-[rgba(250,250,247,0.85)] backdrop-blur-md border-b border-[var(--line)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/logos/ScrapKart Black Logo.png"
            alt="ScrapKart"
            width={132}
            height={36}
            priority
          />
          <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--ink-3)] border border-[var(--line)] rounded-[var(--radius-xs)] px-1.5 py-0.5">
            B2B
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[14px] font-medium text-[var(--ink-2)] hover:text-[var(--ink)] px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--paper-2)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {authUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-[var(--paper-2)] hover:bg-[var(--paper-3)] text-[var(--forest)] font-semibold text-[13px] transition-colors"
                aria-label="Profile menu"
              >
                {authUser.name.charAt(0).toUpperCase()}
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-11 z-50 w-60 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] shadow-[var(--shadow-2)] p-1.5">
                    <div className="px-3 py-2.5 mb-1">
                      <p className="text-[14px] font-semibold text-[var(--ink)]">{authUser.name}</p>
                      <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--ink-3)] mt-0.5">
                        {authUser.role?.replace("_", " ") || "No role"}
                      </p>
                    </div>
                    <div className="h-px bg-[var(--line-2)] my-1 -mx-1.5" />
                    <Link
                      href={authUser.dashboardUrl}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-[14px] rounded-[var(--radius-sm)] hover:bg-[var(--paper-2)]"
                    >
                      <LayoutDashboard className="size-4 text-[var(--ink-3)]" /> Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 px-3 py-2 text-[14px] rounded-[var(--radius-sm)] hover:bg-[var(--paper-2)] text-left"
                    >
                      <LogOut className="size-4 text-[var(--ink-3)]" /> Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-[14px] font-medium text-[var(--ink-2)] hover:text-[var(--ink)] px-3 py-2 rounded-[var(--radius-sm)] hover:bg-[var(--paper-2)] transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center gap-1.5 bg-[var(--forest)] hover:bg-[var(--forest-2)] text-white px-4 py-2 rounded-[var(--radius-md)] text-[14px] font-medium shadow-[var(--shadow-1)] transition-colors"
              >
                Post a listing
                <ArrowRight className="size-3.5" />
              </Link>
            </>
          )}
        </div>

        <button className="p-2 md:hidden text-[var(--ink)]" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--line)] bg-[var(--paper)] px-5 py-5 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block text-[15px] font-medium text-[var(--ink)] py-2"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-4 mt-2 border-t border-[var(--line-2)]">
            {authUser ? (
              <Link
                href={authUser.dashboardUrl}
                className="inline-flex items-center justify-center gap-1.5 bg-[var(--forest)] text-white px-4 py-3 rounded-[var(--radius-md)] text-[14px] font-medium shadow-[var(--shadow-1)]"
              >
                Dashboard <ArrowRight className="size-3.5" />
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-center px-4 py-3 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] text-[14px] font-medium">
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-1.5 bg-[var(--forest)] text-white px-4 py-3 rounded-[var(--radius-md)] text-[14px] font-medium shadow-[var(--shadow-1)]"
                >
                  Post a listing <ArrowRight className="size-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
```

- [ ] **Step 10.2: Rewrite `src/components/shared/marketing-footer.tsx`** — paper-2 background, 4-column nav, copyright + brand glyph.

```tsx
import Link from "next/link";
import Image from "next/image";

export function MarketingFooter() {
  return (
    <footer className="bg-[var(--paper-2)] border-t border-[var(--line)] mt-[var(--section-y)]">
      <div className="container-page py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <Image src="/logos/ScrapKart Black Logo.png" alt="ScrapKart" width={140} height={40} />
            <p className="mt-5 text-[14px] leading-relaxed text-[var(--ink-2)] max-w-sm">
              India&apos;s B2B exchange for industrial scrap. Verified yards. Open bids. Settlement in 72 hours.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-3)] mb-4">Platform</h4>
            <ul className="space-y-2.5 text-[14px]">
              <li><Link href="/marketplace" className="text-[var(--ink-2)] hover:text-[var(--forest)] transition-colors">Marketplace</Link></li>
              <li><Link href="/companies" className="text-[var(--ink-2)] hover:text-[var(--forest)] transition-colors">Companies</Link></li>
              <li><Link href="/#how-it-works" className="text-[var(--ink-2)] hover:text-[var(--forest)] transition-colors">How it works</Link></li>
              <li><Link href="/blogs" className="text-[var(--ink-2)] hover:text-[var(--forest)] transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-3)] mb-4">Get started</h4>
            <ul className="space-y-2.5 text-[14px]">
              <li><Link href="/signup" className="text-[var(--ink-2)] hover:text-[var(--forest)] transition-colors">Post a listing</Link></li>
              <li><Link href="/login" className="text-[var(--ink-2)] hover:text-[var(--forest)] transition-colors">Sign in</Link></li>
              <li><Link href="/contact" className="text-[var(--ink-2)] hover:text-[var(--forest)] transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-3)] mb-4">More</h4>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <a
                  href="https://b2c.scrapkart.app"
                  className="text-[var(--ink-2)] hover:text-[var(--forest)] transition-colors"
                  target="_blank"
                  rel="noopener"
                >
                  ScrapKart B2C
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-[var(--line)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
            &copy; {new Date().getFullYear()} ScrapKart · All rights reserved
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
            Made in India
          </p>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 10.3: Typecheck and visual smoke check.**

```bash
npm run typecheck
npm run dev
```

Open `http://localhost:3000`. The nav should look light-and-airy at the top, then gain a subtle hairline + paper-rgba blur as you scroll past 8px. The footer should have a paper-2 background with clean 5-column structure. Stop dev server.

- [ ] **Step 10.4: Commit.**

```bash
git add src/components/shared/marketing-nav.tsx src/components/shared/marketing-footer.tsx
git commit -m "feat(marketing): rewrite MarketingNav + MarketingFooter in Refined Premium"
```

---

## Task 11 — Hero stat counter (Framer Motion rewrite, GSAP removed)

**Files:**
- Modify: `src/components/landing/hero-stat-counter.tsx`

- [ ] **Step 11.1: Rewrite `src/components/landing/hero-stat-counter.tsx`** — Framer Motion `useInView` + `animate(0 → target)` count-up. No GSAP.

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

type Stat = { value: number; suffix?: string; prefix?: string; label: string; decimals?: number; serif?: boolean };

const STATS: Stat[] = [
  { value: 2400, suffix: "T", label: "diverted from landfill", serif: false },
  { value: 15,   suffix: "",  label: "cities live" },
  { value: 98.4, suffix: "%", label: "on-time settlement", decimals: 1 },
  { value: 500,  suffix: "+", label: "active listings", serif: true },
];

function formatStat(n: number, decimals?: number): string {
  if (decimals) return n.toFixed(decimals);
  return Math.round(n).toLocaleString("en-IN");
}

function StatNumber({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, stat.value, {
      duration: 1.0,
      ease: [0.32, 0.72, 0, 1],
      onUpdate(latest) {
        setDisplay(formatStat(latest, stat.decimals));
      },
    });
    return () => controls.stop();
  }, [inView, stat.value, stat.decimals]);

  return (
    <span ref={ref} className="text-[clamp(34px,4vw,46px)] font-semibold leading-none tracking-[-0.025em] text-[var(--ink)] tabular-nums">
      {stat.prefix ?? ""}
      {display}
      {stat.suffix && (
        <span className="font-serif-italic text-[var(--forest)] ml-0.5 align-baseline">
          {stat.suffix}
        </span>
      )}
    </span>
  );
}

export function HeroStatCounter() {
  return (
    <div className="border-t border-b border-[var(--line)] bg-[var(--paper)]">
      <div className="container-page grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--line-2)]">
        {STATS.map((stat) => (
          <div key={stat.label} className="px-6 py-8 md:py-10 flex flex-col items-start gap-3 first:pl-0 last:pr-0">
            <StatNumber stat={stat} />
            <span className="mono-caption">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 11.2: Typecheck — confirm no remaining GSAP imports anywhere in `src/`.**

```bash
npm run typecheck
```

Run a grep to confirm GSAP is fully out:

Use the Grep tool in your editor or in another terminal:
```
pattern: "from ['\\\"](gsap|@gsap/react)"
path: src
```
Expected: zero matches. If any match exists, address it before committing.

- [ ] **Step 11.3: Commit.**

```bash
git add src/components/landing/hero-stat-counter.tsx
git commit -m "feat(landing): rewrite HeroStatCounter on Framer Motion (GSAP removed)"
```

---

## Task 12 — Live marketplace panel redesign

**Files:**
- Modify: `src/components/shared/live-marketplace-panel.tsx`

- [ ] **Step 12.1: Rewrite `src/components/shared/live-marketplace-panel.tsx`** — hairline rows, mono prices, single forest pulse dot.

```tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LiveListing } from "@/lib/queries/live-listings";

const categoryAbbr: Record<string, string> = {
  Metal: "FE",
  "E-waste": "EW",
  Plastic: "PL",
  Paper: "PA",
  Glass: "GL",
  "Mixed Scrap": "MX",
};

function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatQuantity(quantity: number, unit: string): string {
  const u = (unit ?? "").toLowerCase().trim();
  if (["tonnes","tonne","ton","tons","t"].includes(u)) return `${quantity} MT`;
  if (["kg","kgs","kilogram","kilograms"].includes(u)) {
    if (quantity >= 1000) return `${(quantity / 1000).toFixed(1)} MT`;
    return `${quantity} kg`;
  }
  return `${quantity} ${unit}`.trim();
}

function priceUnitLabel(unit: string): string {
  const u = (unit ?? "").toLowerCase().trim();
  if (["tonnes","tonne","ton","tons","t"].includes(u)) return "/MT";
  if (["kg","kgs","kilogram","kilograms"].includes(u)) return "/kg";
  return `/${unit || "unit"}`;
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

  if (listings.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] shadow-[var(--shadow-1)] p-8 text-center">
        <h3 className="text-[18px] font-semibold tracking-[-0.015em]">Be the first lot listed.</h3>
        <p className="text-[14px] text-[var(--ink-3)] mt-2 leading-relaxed">
          The marketplace is just opening. Post your first listing and we&apos;ll get verified buyers on it.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-1.5 mt-5 bg-[var(--forest)] hover:bg-[var(--forest-2)] text-white px-4 py-2.5 rounded-[var(--radius-md)] text-[14px] font-medium shadow-[var(--shadow-1)] transition-colors"
        >
          Create account <ArrowRight className="size-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] shadow-[var(--shadow-2)] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[var(--line-2)] flex items-center justify-between bg-[var(--paper)]">
        <div className="flex items-center gap-2">
          <span className="pulse-dot" />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-2)] font-medium">
            Live marketplace
          </span>
        </div>
        <div className="font-mono text-[10.5px] tracking-[0.04em] text-[var(--ink-3)]">
          {totalOpen} OPEN · {formatINR(totalBidsValueINR)} BIDS
        </div>
      </div>

      {/* Listings */}
      <div>
        {listings.map((row, i) => (
          <div
            key={row.id}
            className={`grid grid-cols-[auto_1fr_auto] gap-4 items-center px-5 py-4 ${
              i < listings.length - 1 ? "border-b border-[var(--line-2)]" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--paper-2)] flex items-center justify-center font-mono text-[11px] font-semibold text-[var(--forest)] tracking-[0.04em]">
              {categoryAbbr[row.category] ?? "??"}
            </div>
            <div className="min-w-0">
              <div className="text-[14.5px] font-semibold leading-tight text-[var(--ink)] truncate">
                {row.title}
              </div>
              <div className="font-mono text-[11px] text-[var(--ink-3)] tracking-[0.02em] mt-1 truncate">
                {formatQuantity(row.quantity, row.unit)} · {row.city}
                {row.state ? `, ${row.state}` : ""}
                {row.bid_count > 0 ? ` · ${row.bid_count} bid${row.bid_count === 1 ? "" : "s"}` : ""}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[15px] font-semibold tabular-nums text-[var(--ink)]">{formatINR(row.price)}</div>
              <div className="font-mono text-[10px] text-[var(--ink-3)] tracking-[0.04em] mt-0.5">
                {priceUnitLabel(row.unit)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <Link
        href="/marketplace"
        className="px-5 py-3.5 flex items-center justify-between bg-[var(--paper-2)] hover:bg-[var(--paper-3)] border-t border-[var(--line-2)] transition-colors"
      >
        <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
          {moreCount} more listings open
        </span>
        <span className="text-[13px] font-medium text-[var(--forest)] inline-flex items-center gap-1.5">
          View all <ArrowRight className="size-3.5" />
        </span>
      </Link>
    </div>
  );
}
```

- [ ] **Step 12.2: Typecheck and commit.**

```bash
npm run typecheck
git add src/components/shared/live-marketplace-panel.tsx
git commit -m "feat(landing): redesign LiveMarketplacePanel — hairline rows, mono prices, forest pulse"
```

---

## Task 13 — Landing page hero section

**Files:**
- Modify: `src/app/page.tsx` (first cut — hero only; remaining sections come in Tasks 14–17)

- [ ] **Step 13.1: Replace `src/app/page.tsx`** with the hero-only version. (Sections that don't exist yet are stubbed out and filled in by subsequent tasks.)

```tsx
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { MarketingNav } from "@/components/shared/marketing-nav";
import { MarketingFooter } from "@/components/shared/marketing-footer";
import { LiveMarketplacePanel } from "@/components/shared/live-marketplace-panel";
import { HeroStatCounter } from "@/components/landing/hero-stat-counter";
import { HeroEntrance, HeroEntranceItem } from "@/components/shared/reveal";
import { getLiveListings } from "@/lib/queries/live-listings";

export const revalidate = 60;

export default async function Home() {
  const { listings, totalOpen, totalBidsValueINR } = await getLiveListings(3);

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <MarketingNav />

      {/* HERO */}
      <section className="pt-12 pb-16 md:pt-20 md:pb-24">
        <div className="container-page grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-start">
          <HeroEntrance>
            <HeroEntranceItem>
              <div className="eyebrow">
                <span className="dot" /> India&apos;s industrial scrap exchange
              </div>
            </HeroEntranceItem>

            <HeroEntranceItem>
              <h1 className="mt-7 text-[clamp(48px,7.4vw,84px)] leading-[0.96] tracking-[var(--tracking-display)] font-semibold">
                Trade scrap.<br />
                By the <span className="italic-accent">truckload.</span>
              </h1>
            </HeroEntranceItem>

            <HeroEntranceItem>
              <p className="mt-7 max-w-[560px] text-[19px] leading-[1.5] text-[var(--ink-2)]">
                List your lot, verified buyers bid in the open, settlement clears in 72 hours. Built for yards moving real weight — not casual sellers.
              </p>
            </HeroEntranceItem>

            <HeroEntranceItem>
              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-1.5 bg-[var(--forest)] hover:bg-[var(--forest-2)] text-white px-5 py-3 rounded-[var(--radius-md)] text-[14.5px] font-medium shadow-[var(--shadow-1)] transition-[background-color,transform] duration-200 hover:-translate-y-px"
                >
                  Post a listing <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] text-[14.5px] font-medium hover:bg-[var(--paper-2)] transition-colors"
                >
                  Browse marketplace
                </Link>
              </div>
            </HeroEntranceItem>
          </HeroEntrance>

          <HeroEntrance>
            <HeroEntranceItem>
              <LiveMarketplacePanel
                listings={listings}
                totalOpen={totalOpen}
                totalBidsValueINR={totalBidsValueINR}
              />
            </HeroEntranceItem>
          </HeroEntrance>
        </div>
      </section>

      {/* STAT STRIP */}
      <HeroStatCounter />

      {/* (How it works, Categories, Why, CTA — added in Tasks 14–17) */}

      <MarketingFooter />
    </div>
  );
}
```

- [ ] **Step 13.2: Typecheck and visual check.**

```bash
npm run typecheck
npm run dev
```

Open `http://localhost:3000`. Expected:
- Hero left column: green eyebrow chip → bold black headline with "*truckload.*" in green Fraunces italic → gray lead → forest CTA + outlined CTA
- Hero right column: redesigned LiveMarketplacePanel with hairline rows
- Below hero: 4-stat strip with count-up on scroll into view
- The hero text and CTAs animate in on mount with ~80ms stagger
- No console errors

Stop dev server.

- [ ] **Step 13.3: Commit.**

```bash
git add src/app/page.tsx
git commit -m "feat(landing): hero section in Refined Premium with HeroEntrance choreography"
```

---

## Task 14 — Landing: How-it-works section

**Files:**
- Create: `src/components/landing/how-it-works.tsx`
- Modify: `src/app/page.tsx` (slot the section in)

- [ ] **Step 14.1: Create `src/components/landing/how-it-works.tsx`.**

```tsx
"use client";

import { Reveal, RevealStagger, RevealItem } from "@/components/shared/reveal";

const STEPS = [
  {
    num: "01",
    title: "List your lot",
    desc: "Material, weight, location, photos. Posted in under four minutes — self-serve, no sales call.",
    meta: "~3 min · self-serve",
  },
  {
    num: "02",
    title: "We verify it",
    desc: "Yard KYC, GST, lot photo audit. Live to verified buyers within 24 hours of submission.",
    meta: "~24 hrs · automated",
  },
  {
    num: "03",
    title: "Buyers bid openly",
    desc: "Verified recyclers compete in the open. Every bid is timestamped and visible to you in real time.",
    meta: "~48 hrs window",
  },
  {
    num: "04",
    title: "Settle and ship",
    desc: "Pickup booked, weighbridge slip uploaded, payment released to your account on weight-reconciled volume.",
    meta: "~72 hrs end-to-end",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-[var(--section-y)]">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <p className="mono-caption">02 · Process</p>
              <h2 className="mt-3 text-[clamp(28px,3.6vw,40px)] font-semibold tracking-[var(--tracking-tight)] leading-[1.05]">
                List, verify, bid, <span className="italic-accent">settle.</span>
              </h2>
              <p className="mt-4 text-[15.5px] text-[var(--ink-2)] leading-[1.55] max-w-[520px]">
                Four steps end-to-end. No phone calls. No commission until weighbridge reconciliation clears.
              </p>
            </div>
          </div>
        </Reveal>

        <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--line)] border border-[var(--line)] rounded-[var(--radius-lg)] overflow-hidden">
          {STEPS.map((s) => (
            <RevealItem
              key={s.num}
              className="bg-[var(--paper)] p-7 flex flex-col gap-4"
            >
              <div className="font-mono text-[12px] tracking-[0.04em] text-[var(--forest)] font-medium">
                {s.num}
              </div>
              <h3 className="text-[19px] font-semibold tracking-[-0.015em] leading-tight">
                {s.title}
              </h3>
              <p className="text-[14.5px] text-[var(--ink-2)] leading-[1.55] flex-1">
                {s.desc}
              </p>
              <p className="mono-caption pt-3 border-t border-[var(--line-2)]">
                {s.meta}
              </p>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
```

- [ ] **Step 14.2: Add it to `src/app/page.tsx`.**

Edit the section comment block in `page.tsx` to slot in the import and render.

Replace:
```tsx
import { HeroStatCounter } from "@/components/landing/hero-stat-counter";
```
With:
```tsx
import { HeroStatCounter } from "@/components/landing/hero-stat-counter";
import { HowItWorks } from "@/components/landing/how-it-works";
```

Replace:
```tsx
      {/* (How it works, Categories, Why, CTA — added in Tasks 14–17) */}
```
With:
```tsx
      <HowItWorks />

      {/* (Categories, Why, CTA — added in Tasks 15–16) */}
```

- [ ] **Step 14.3: Typecheck, visual check, commit.**

```bash
npm run typecheck
npm run dev
```

Open `http://localhost:3000` and scroll past the stat strip. Expected: section title fades up, then the 4 steps stagger in left-to-right at ~60ms intervals. Hairline borders between steps via `gap-px bg-[var(--line)]` trick.

Stop dev server, then:

```bash
git add src/components/landing/how-it-works.tsx src/app/page.tsx
git commit -m "feat(landing): How it works section with reveal-stagger choreography"
```

---

## Task 15 — Landing: Categories grid

**Files:**
- Create: `src/components/landing/categories-grid.tsx`
- Modify: `src/app/page.tsx` (slot in)

- [ ] **Step 15.1: Create `src/components/landing/categories-grid.tsx`.**

```tsx
"use client";

import { Cog, Cpu, Recycle, FileText, GlassWater, Package, type LucideIcon } from "lucide-react";
import { Reveal, RevealStagger, RevealItem } from "@/components/shared/reveal";

type Category = { name: string; desc: string; icon: LucideIcon };

const CATEGORIES: Category[] = [
  { name: "Metal",       desc: "Steel, aluminium, copper, brass, iron scrap.",   icon: Cog },
  { name: "E-waste",     desc: "Circuit boards, servers, monitors, electronics.", icon: Cpu },
  { name: "Plastic",     desc: "HDPE, PP, PET, PVC, mixed polymers.",            icon: Recycle },
  { name: "Paper",       desc: "OCC cardboard, office paper, newsprint.",         icon: FileText },
  { name: "Glass",       desc: "Clear cullet, colored glass, float glass.",       icon: GlassWater },
  { name: "Mixed Scrap", desc: "Unsorted or multi-material industrial waste.",    icon: Package },
];

export function CategoriesGrid() {
  return (
    <section className="py-[var(--section-y)] bg-[var(--paper-2)]">
      <div className="container-page">
        <Reveal>
          <div className="mb-12 max-w-[640px]">
            <p className="mono-caption">03 · Categories</p>
            <h2 className="mt-3 text-[clamp(28px,3.6vw,40px)] font-semibold tracking-[var(--tracking-tight)] leading-[1.05]">
              Six material <span className="italic-accent">types.</span>
            </h2>
            <p className="mt-4 text-[15.5px] text-[var(--ink-2)] leading-[1.55]">
              Industrial scrap, sorted on the way in. Pricing is set by buyers, not by us — bid history is visible on every category.
            </p>
          </div>
        </Reveal>

        <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <RevealItem
                key={c.name}
                className="bg-[var(--paper)] border border-[var(--line)] rounded-[var(--radius-lg)] p-6 transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[var(--shadow-2)]"
              >
                <div className="size-10 rounded-[var(--radius-md)] bg-[var(--forest-tint)] flex items-center justify-center text-[var(--forest)] mb-5">
                  <Icon className="size-[18px]" />
                </div>
                <h3 className="text-[17px] font-semibold tracking-[-0.015em]">{c.name}</h3>
                <p className="mt-2 text-[14px] text-[var(--ink-2)] leading-[1.55]">{c.desc}</p>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
```

- [ ] **Step 15.2: Slot into `src/app/page.tsx`.**

Replace:
```tsx
import { HowItWorks } from "@/components/landing/how-it-works";
```
With:
```tsx
import { HowItWorks } from "@/components/landing/how-it-works";
import { CategoriesGrid } from "@/components/landing/categories-grid";
```

Replace:
```tsx
      <HowItWorks />

      {/* (Categories, Why, CTA — added in Tasks 15–16) */}
```
With:
```tsx
      <HowItWorks />

      <CategoriesGrid />

      {/* (Why, CTA — added in Task 16) */}
```

- [ ] **Step 15.3: Typecheck, visual check, commit.**

```bash
npm run typecheck
npm run dev
```

Open and scroll past how-it-works. Expected: paper-2 section with 6 category cards in 3-col grid, each card has a forest-tint icon square. Cards lift on hover.

```bash
git add src/components/landing/categories-grid.tsx src/app/page.tsx
git commit -m "feat(landing): Categories grid section in Refined Premium"
```

---

## Task 16 — Landing: Why-ScrapKart narrative + CTA band

**Files:**
- Create: `src/components/landing/why-section.tsx`
- Create: `src/components/landing/cta-band.tsx`
- Modify: `src/app/page.tsx` (slot in)

- [ ] **Step 16.1: Create `src/components/landing/why-section.tsx`.**

```tsx
"use client";

import { Reveal } from "@/components/shared/reveal";

const POINTS = [
  {
    label: "Open price discovery",
    body: "Bids are timestamped and visible to the seller in real time. No back-channel offers. No black box. The market sets the price.",
  },
  {
    label: "Verified at the yard",
    body: "Every yard is GST and KYC checked before listings go live. Buyers see verification status, ISO/CPCB certifications, and dispute history before bidding.",
  },
  {
    label: "Settled in 72 hours",
    body: "Weighbridge reconciliation closes the loop. Funds release within 72 hours of pickup confirmation — not 30, not 45, not 60.",
  },
];

export function WhySection() {
  return (
    <section className="py-[var(--section-y)]">
      <div className="container-page">
        <Reveal>
          <div className="mb-14 max-w-[680px]">
            <p className="mono-caption">04 · Why ScrapKart</p>
            <h2 className="mt-3 text-[clamp(28px,3.6vw,40px)] font-semibold tracking-[var(--tracking-tight)] leading-[1.05]">
              Built for yards moving <span className="italic-accent">real weight.</span>
            </h2>
            <p className="mt-4 text-[15.5px] text-[var(--ink-2)] leading-[1.55]">
              Not a directory. Not a lead-gen funnel. A live exchange with the operational guarantees that make repeat trade possible.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
          {POINTS.map((p, i) => (
            <Reveal key={p.label} transition={{ delay: i * 0.08 }}>
              <div className="border-t border-[var(--ink)] pt-5">
                <p className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-[var(--forest)] font-medium">
                  0{i + 1}
                </p>
                <h3 className="mt-3 text-[20px] font-semibold tracking-[-0.015em] leading-tight">
                  {p.label}
                </h3>
                <p className="mt-3 text-[14.5px] text-[var(--ink-2)] leading-[1.6]">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 16.2: Create `src/components/landing/cta-band.tsx`.**

```tsx
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";

export function CtaBand() {
  return (
    <section className="py-[var(--section-y)] bg-[var(--forest-tint)]">
      <div className="container-page">
        <Reveal>
          <div className="max-w-[760px] mx-auto text-center">
            <h2 className="text-[clamp(36px,5.2vw,56px)] font-semibold tracking-[var(--tracking-display)] leading-[0.98]">
              Ready to <span className="italic-accent">trade?</span>
            </h2>
            <p className="mt-5 text-[16px] md:text-[17px] text-[var(--ink-2)] leading-[1.55] max-w-[520px] mx-auto">
              Join 120+ verified yards already listing on ScrapKart. Free to post. We earn only on settlement.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-1.5 bg-[var(--forest)] hover:bg-[var(--forest-2)] text-white px-6 py-3.5 rounded-[var(--radius-md)] text-[15px] font-medium shadow-[var(--shadow-1)] transition-[background-color,transform] duration-200 hover:-translate-y-px"
              >
                Create account <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-[var(--radius-md)] border border-[var(--ink)]/15 bg-transparent text-[var(--ink)] text-[15px] font-medium hover:bg-[var(--paper)] transition-colors"
              >
                Browse listings
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 16.3: Slot into `src/app/page.tsx`.**

Replace:
```tsx
import { CategoriesGrid } from "@/components/landing/categories-grid";
```
With:
```tsx
import { CategoriesGrid } from "@/components/landing/categories-grid";
import { WhySection } from "@/components/landing/why-section";
import { CtaBand } from "@/components/landing/cta-band";
```

Replace:
```tsx
      <CategoriesGrid />

      {/* (Why, CTA — added in Task 16) */}
```
With:
```tsx
      <CategoriesGrid />

      <WhySection />

      <CtaBand />
```

- [ ] **Step 16.4: Typecheck, visual check, commit.**

```bash
npm run typecheck
npm run dev
```

Verify scroll: hero → stats → how it works → categories → why → CTA → footer. The CTA band is the only forest-tint surface. Stop dev server.

```bash
git add src/components/landing/why-section.tsx src/components/landing/cta-band.tsx src/app/page.tsx
git commit -m "feat(landing): Why section + CTA band complete the landing page"
```

---

## Task 17 — Landing: full assembly + polish pass

**Files:**
- Modify: `src/app/page.tsx` (final cleanup; remove placeholder comments)

- [ ] **Step 17.1: Open `src/app/page.tsx`** and remove the now-stale placeholder comment block (`{/* (Why, CTA — added in Task 16) */}` should already be gone; confirm no `/* — added in Task X */` markers remain).

- [ ] **Step 17.2: Verify final order** of the JSX returned matches:

```
<MarketingNav />
<section> HERO </section>
<HeroStatCounter />
<HowItWorks />
<CategoriesGrid />
<WhySection />
<CtaBand />
<MarketingFooter />
```

- [ ] **Step 17.3: Run a full audit pass** in the browser at `http://localhost:3000`:

  - Hero entrance: 4-element stagger fires once, doesn't re-fire on tab return
  - Stat counter: animates on scroll into view, jumps to final on reduced motion
  - Section reveals: each section fades-up once when it enters viewport — not before
  - No element fade-in stays at opacity 0 (the GSAP-class hydration bug from the past)
  - Lenis scroll feels smooth on wheel + trackpad
  - At 1024px+ the hero is two columns; at <1024px it stacks
  - At 360px no horizontal scroll bar appears

  If any of those fails, fix in place and re-verify before committing.

- [ ] **Step 17.4: Reduced-motion verification** — open DevTools, Rendering panel, set "Emulate CSS media feature prefers-reduced-motion" → reduce. Reload landing.

  - Lenis must NOT be active (native scroll resumes)
  - Stat counter jumps to final values with no count animation
  - Section reveals appear instantly with at most a quick crossfade
  - Capture a screenshot of the landing page in this state, save to `docs/superpowers/specs/screenshots/landing-reduced-motion.png` (create the folder if missing)

- [ ] **Step 17.5: Commit.**

```bash
git add src/app/page.tsx docs/superpowers/specs/screenshots/landing-reduced-motion.png
git commit -m "feat(landing): final assembly + reduced-motion verification"
```

---

## Task 18 — Blog index + detail redesign

**Files:**
- Modify: `src/app/blogs/page.tsx`
- Modify: `src/app/blogs/[slug]/page.tsx`

- [ ] **Step 18.1: Rewrite `src/app/blogs/page.tsx`.**

```tsx
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { MarketingNav } from "@/components/shared/marketing-nav";
import { MarketingFooter } from "@/components/shared/marketing-footer";

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  is_featured: boolean;
  published_at: string | null;
};

async function getBlogs(): Promise<Blog[]> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt, cover_image, is_featured, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  return (data ?? []) as Blog[];
}

function fmtDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col">
      <MarketingNav />

      {/* Editorial header */}
      <section className="pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="container-page max-w-4xl">
          <p className="mono-caption">Field notes</p>
          <h1 className="mt-3 text-[clamp(40px,6vw,68px)] font-semibold tracking-[var(--tracking-display)] leading-[0.98]">
            ScrapKart <span className="italic-accent">journal.</span>
          </h1>
          <p className="mt-5 text-[17px] md:text-[18px] text-[var(--ink-2)] max-w-[600px] leading-[1.55]">
            Writing on industrial scrap markets, recycling logistics, and the operating mechanics of the circular economy in India.
          </p>
        </div>
      </section>

      <section className="pb-[var(--section-y)] flex-1">
        <div className="container-page">
          {blogs.length === 0 ? (
            <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper-2)] py-20 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-[var(--paper)] mb-4">
                <BookOpen className="size-5 text-[var(--ink-3)]" />
              </div>
              <p className="text-[16px] font-semibold">No posts yet.</p>
              <p className="text-[14px] text-[var(--ink-3)] mt-1">Check back soon.</p>
            </div>
          ) : (
            <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.slug}`}
                  className="group flex flex-col"
                >
                  {blog.cover_image && (
                    <div className="aspect-[16/10] rounded-[var(--radius-lg)] bg-[var(--paper-2)] overflow-hidden mb-5 border border-[var(--line)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={blog.cover_image}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.03]"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-3">
                    {blog.is_featured && (
                      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--forest)] bg-[var(--forest-tint)] rounded-[var(--radius-xs)] px-2 py-1 font-medium">
                        Featured
                      </span>
                    )}
                    <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
                      {fmtDate(blog.published_at)}
                    </span>
                  </div>
                  <h3 className="text-[20px] font-semibold tracking-[-0.015em] leading-tight group-hover:text-[var(--forest)] transition-colors">
                    {blog.title}
                  </h3>
                  {blog.excerpt && (
                    <p className="mt-3 text-[14.5px] text-[var(--ink-2)] leading-[1.55] line-clamp-3">
                      {blog.excerpt}
                    </p>
                  )}
                  <span className="mt-4 text-[13px] font-medium text-[var(--ink-3)] group-hover:text-[var(--forest)] transition-colors">
                    Read article →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
```

- [ ] **Step 18.2: Read the existing `src/app/blogs/[slug]/page.tsx`** to confirm its data fetching and route signature, then rewrite it.

```bash
# In another terminal/agent step, read the file first to confirm signature:
# cat src/app/blogs/[slug]/page.tsx
```

Rewrite `src/app/blogs/[slug]/page.tsx`:

```tsx
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MarketingNav } from "@/components/shared/marketing-nav";
import { MarketingFooter } from "@/components/shared/marketing-footer";

type Blog = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image: string | null;
  content: string | null;
  author_name: string | null;
  is_featured: boolean;
  published_at: string | null;
};

async function getBlog(slug: string): Promise<Blog | null> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase
    .from("blogs")
    .select("id, title, slug, excerpt, cover_image, content, author_name, is_featured, published_at")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return (data as Blog | null) ?? null;
}

function fmtDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

export default async function BlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();

  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col">
      <MarketingNav />

      <article className="pt-12 md:pt-16 pb-[var(--section-y)] flex-1">
        <div className="container-narrow">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--ink-3)] hover:text-[var(--forest)] transition-colors mb-8"
          >
            <ArrowLeft className="size-3.5" /> All articles
          </Link>

          <div className="flex items-center gap-3 mb-5">
            {blog.is_featured && (
              <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--forest)] bg-[var(--forest-tint)] rounded-[var(--radius-xs)] px-2 py-1 font-medium">
                Featured
              </span>
            )}
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
              {fmtDate(blog.published_at)}
            </span>
            {blog.author_name && (
              <>
                <span className="font-mono text-[11px] text-[var(--ink-4)]">·</span>
                <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
                  {blog.author_name}
                </span>
              </>
            )}
          </div>

          <h1 className="text-[clamp(36px,5vw,52px)] font-semibold tracking-[var(--tracking-display)] leading-[1.02]">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="mt-6 text-[18px] md:text-[19px] text-[var(--ink-2)] leading-[1.55] max-w-[640px]">
              {blog.excerpt}
            </p>
          )}

          {blog.cover_image && (
            <div className="mt-10 rounded-[var(--radius-lg)] overflow-hidden border border-[var(--line)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={blog.cover_image} alt={blog.title} className="w-full" />
            </div>
          )}

          {blog.content && (
            <div
              className="prose-blog mt-12 text-[16.5px] text-[var(--ink-2)] leading-[1.7]"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          )}
        </div>
      </article>

      <MarketingFooter />
    </div>
  );
}
```

- [ ] **Step 18.3: Add a small `prose-blog` style block to `src/app/globals.css`** so blog HTML content renders correctly.

Append the following inside the `@layer utilities { ... }` block in `globals.css`, just before the `@media (prefers-reduced-motion: reduce)` block:

```css
  /* Blog prose */
  .prose-blog h2 { font-size: clamp(24px, 3vw, 30px); font-weight: 600; letter-spacing: -0.022em; line-height: 1.15; margin-top: 2.5rem; margin-bottom: 1rem; color: var(--ink); }
  .prose-blog h3 { font-size: 21px; font-weight: 600; letter-spacing: -0.018em; margin-top: 2rem; margin-bottom: 0.75rem; color: var(--ink); }
  .prose-blog p { margin-bottom: 1.25rem; }
  .prose-blog a { color: var(--forest); text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1px; }
  .prose-blog a:hover { text-decoration-thickness: 2px; }
  .prose-blog strong { color: var(--ink); font-weight: 600; }
  .prose-blog em { font-family: var(--font-fraunces), Georgia, serif; font-style: italic; font-weight: 400; color: var(--forest); }
  .prose-blog ul, .prose-blog ol { padding-left: 1.5rem; margin-bottom: 1.25rem; }
  .prose-blog ul li { list-style: disc; margin-bottom: 0.4rem; }
  .prose-blog ol li { list-style: decimal; margin-bottom: 0.4rem; }
  .prose-blog blockquote { border-left: 2px solid var(--forest); padding-left: 1.25rem; margin: 1.5rem 0; font-style: italic; color: var(--ink); }
  .prose-blog code { font-family: var(--font-jetbrains-mono), monospace; font-size: 0.9em; background: var(--paper-2); padding: 0.15rem 0.35rem; border-radius: var(--radius-xs); }
  .prose-blog pre { background: var(--paper-2); border: 1px solid var(--line); border-radius: var(--radius-md); padding: 1rem; overflow-x: auto; margin: 1.25rem 0; }
  .prose-blog img { border-radius: var(--radius-lg); margin: 1.5rem 0; border: 1px solid var(--line); }
  .prose-blog hr { border: none; border-top: 1px solid var(--line); margin: 2rem 0; }
```

- [ ] **Step 18.4: Typecheck, visual check, commit.**

```bash
npm run typecheck
npm run dev
```

Open `/blogs` and `/blogs/<some-slug>`. Stop dev server.

```bash
git add src/app/blogs/page.tsx "src/app/blogs/[slug]/page.tsx" src/app/globals.css
git commit -m "feat(blogs): redesign blog index + detail in Refined Premium editorial layout"
```

---

## Task 19 — Contact page redesign

**Files:**
- Modify: `src/app/contact/page.tsx`

- [ ] **Step 19.1: Rewrite `src/app/contact/page.tsx`** — 2-column split (form + side info), no `cat-mixed` pastel.

```tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle, ArrowLeft, Send, Check } from "lucide-react";
import Link from "next/link";
import { MarketingNav } from "@/components/shared/marketing-nav";
import { MarketingFooter } from "@/components/shared/marketing-footer";
import { Reveal } from "@/components/shared/reveal";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  function update(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("contact_submissions").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      subject: form.subject || null,
      message: form.message,
      status: "new",
    });
    setLoading(false);
    if (!error) setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--paper)] flex flex-col">
        <MarketingNav />
        <main className="flex-1 flex items-center justify-center py-24">
          <Reveal>
            <div className="max-w-md w-full text-center px-6">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--forest-tint)] mb-6">
                <CheckCircle className="size-7 text-[var(--forest)]" />
              </div>
              <h2 className="text-[28px] font-semibold tracking-[-0.025em]">Message sent.</h2>
              <p className="text-[15px] text-[var(--ink-2)] mt-3 leading-relaxed">
                Thanks for reaching out. Our team will get back to you within 24 hours.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 mt-7 bg-[var(--forest)] hover:bg-[var(--forest-2)] text-white px-5 py-3 rounded-[var(--radius-md)] text-[14.5px] font-medium shadow-[var(--shadow-1)] transition-colors"
              >
                <ArrowLeft className="size-4" /> Back home
              </Link>
            </div>
          </Reveal>
        </main>
        <MarketingFooter />
      </div>
    );
  }

  const inputCls =
    "h-11 w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] px-4 text-[14.5px] text-[var(--ink)] placeholder:text-[var(--ink-4)] focus:outline-none focus:border-[var(--forest)] focus:shadow-[var(--ring-forest)] transition-[border-color,box-shadow] duration-200";
  const labelCls = "text-[12.5px] font-medium text-[var(--ink-2)] mb-1.5 inline-block";

  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col">
      <MarketingNav />

      <section className="pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="container-page max-w-4xl">
          <p className="mono-caption">Talk to us</p>
          <h1 className="mt-3 text-[clamp(40px,6vw,68px)] font-semibold tracking-[var(--tracking-display)] leading-[0.98]">
            Get in <span className="italic-accent">touch.</span>
          </h1>
          <p className="mt-5 text-[17px] md:text-[18px] text-[var(--ink-2)] max-w-[600px] leading-[1.55]">
            Questions about listing, verification, or partnerships — reach us directly.
          </p>
        </div>
      </section>

      <section className="pb-[var(--section-y)] flex-1">
        <div className="container-page grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10">
          <Reveal>
            <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] shadow-[var(--shadow-1)] p-8">
              <div className="mb-7">
                <h2 className="text-[20px] font-semibold tracking-[-0.018em]">Send a message</h2>
                <p className="text-[14px] text-[var(--ink-3)] mt-1">Fill in your details — we&apos;ll respond promptly.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Name <span className="text-[var(--forest)]">*</span></label>
                    <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your full name" required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Email <span className="text-[var(--forest)]">*</span></label>
                    <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@company.com" required className={inputCls} />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98765 43210" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Subject</label>
                    <input value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="How can we help?" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Message <span className="text-[var(--forest)]">*</span></label>
                  <textarea
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Tell us more about your requirement..."
                    rows={5}
                    required
                    className="w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-[14.5px] text-[var(--ink)] placeholder:text-[var(--ink-4)] focus:outline-none focus:border-[var(--forest)] focus:shadow-[var(--ring-forest)] transition-[border-color,box-shadow] duration-200 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-1.5 h-11 px-6 bg-[var(--forest)] hover:bg-[var(--forest-2)] text-white rounded-[var(--radius-md)] text-[14.5px] font-medium shadow-[var(--shadow-1)] transition-colors disabled:opacity-60"
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  {loading ? "Sending..." : "Send message"}
                </button>
              </form>
            </div>
          </Reveal>

          <Reveal>
            <div className="space-y-4">
              <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper-2)] p-7">
                <h3 className="text-[16px] font-semibold tracking-[-0.015em]">Direct contact</h3>
                <ul className="mt-5 space-y-4">
                  <li>
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)]">Email</p>
                    <p className="font-mono text-[14px] text-[var(--ink)] mt-1">support@scrapkart.in</p>
                  </li>
                  <li>
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)]">Phone</p>
                    <p className="font-mono text-[14px] text-[var(--ink)] mt-1">+91 98765 43210</p>
                  </li>
                  <li>
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)]">Location</p>
                    <p className="text-[14px] text-[var(--ink)] mt-1">Mumbai, Maharashtra, India</p>
                  </li>
                </ul>
              </div>
              <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-7">
                <h3 className="text-[16px] font-semibold tracking-[-0.015em]">Why ScrapKart</h3>
                <ul className="mt-4 space-y-3">
                  {[
                    "Verified recycler network across India",
                    "Open bidding — market-set pricing",
                    "CPCB / EPR-compliant partners",
                    "Pickup tracking with OTP verification",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[14px] text-[var(--ink-2)] leading-relaxed">
                      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[var(--forest-tint)]">
                        <Check className="size-2.5 text-[var(--forest)]" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
```

- [ ] **Step 19.2: Typecheck, visual, commit.**

```bash
npm run typecheck
npm run dev
```

Open `/contact`. Submit a test message — confirm success state appears. Stop dev server.

```bash
git add src/app/contact/page.tsx
git commit -m "feat(contact): redesign in Refined Premium with 2-col split"
```

---

## Task 20 — 404 page redesign

**Files:**
- Modify: `src/app/not-found.tsx`

- [ ] **Step 20.1: Rewrite `src/app/not-found.tsx`.**

```tsx
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MarketingNav } from "@/components/shared/marketing-nav";
import { MarketingFooter } from "@/components/shared/marketing-footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col">
      <MarketingNav />
      <main className="flex-1 flex items-center justify-center py-24">
        <div className="text-center max-w-md container-page">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-3)]">Error 404</p>
          <h1 className="mt-3 text-[clamp(48px,7vw,84px)] font-semibold tracking-[var(--tracking-display)] leading-[0.98]">
            Page <span className="italic-accent">not found.</span>
          </h1>
          <p className="text-[16px] text-[var(--ink-2)] mt-5 leading-relaxed max-w-[420px] mx-auto">
            The page you were looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 bg-[var(--forest)] hover:bg-[var(--forest-2)] text-white px-5 py-3 rounded-[var(--radius-md)] text-[14.5px] font-medium shadow-[var(--shadow-1)] transition-colors"
            >
              <ArrowLeft className="size-4" /> Back home
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-3 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] text-[14.5px] font-medium hover:bg-[var(--paper-2)] transition-colors"
            >
              Contact support
            </Link>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
```

- [ ] **Step 20.2: Visual check + commit.**

```bash
npm run typecheck
npm run dev
```

Visit any nonexistent URL like `/this-does-not-exist` — confirm 404 renders. Stop dev server.

```bash
git add src/app/not-found.tsx
git commit -m "feat(404): redesign in Refined Premium"
```

---

## Task 21 — Final verification: build + Lighthouse + commit lock

**Files:** none modified — verification only.

- [ ] **Step 21.1: Final typecheck, lint, build.**

```bash
npm run typecheck
npm run lint
npm run build
```

Expected: all three pass with zero errors. The `build` step uses `--webpack` (already in package.json) and must produce the PWA service worker (`public/sw.js`, `public/workbox-*.js`).

If `lint` flags any unused imports introduced during the rewrite, fix them in place and re-run.

- [ ] **Step 21.2: Lighthouse audit on landing.**

Start production server in one terminal:
```bash
npm run start
```

Open `http://localhost:3000` in Chrome incognito. Run Lighthouse → Mobile, throttled 4G, mid-tier device. Expected scores:
- Performance ≥ 90
- Accessibility ≥ 95
- Best Practices ≥ 95
- SEO ≥ 95

Save the Lighthouse report to `docs/superpowers/specs/screenshots/landing-lighthouse.html` (Lighthouse "Save as HTML" option).

Stop the production server.

- [ ] **Step 21.3: Final reduced-motion verification on every public page.**

Open DevTools → Rendering → "Emulate prefers-reduced-motion: reduce". Visit:
- `/` (landing)
- `/blogs`
- `/blogs/<any-slug>` (if any blog exists)
- `/contact`
- `/this-does-not-exist` (404)

For each: no Lenis smoothness (native scroll), no entrance animations, no count-up. If any page still animates, fix the offending file before continuing.

- [ ] **Step 21.4: Confirm no GSAP and no brutalist tokens remain.**

In a terminal:
```bash
grep -rn "from .gsap" src/ || echo "no gsap imports"
grep -rn "shadow-hard\|press-in\|font-archivo-black\|font-archivo[^-]\|font-dm-serif" src/components/ui src/components/shared src/components/landing src/app/page.tsx src/app/blogs src/app/contact src/app/not-found.tsx || echo "no brutalist remnants"
```

`gsap` should produce "no gsap imports". The brutalist grep should produce "no brutalist remnants" (any matches inside `src/app/(buyer)/`, `src/app/(seller)/`, or `src/app/admin/` are expected and intentional — those are handled by the backwards-compat shim until Phase 3).

- [ ] **Step 21.5: Confirm `git push` was never run.**

```bash
git reflog | head -30
```

Expected: zero `push` entries since the start of this work. If a push slipped through, surface it to the user immediately — do not paper over it.

- [ ] **Step 21.6: Final commit (artifacts + plan completion marker).**

```bash
git add docs/superpowers/specs/screenshots/
git commit -m "chore(verify): Phase 1 artifacts — Lighthouse + reduced-motion screenshots"
```

- [ ] **Step 21.7: Hand off.**

Tell the user: Phase 1 (foundation + public marketing) is complete locally on `feat/ui-overhaul`. No `git push` issued — that's the user's call. Suggest they preview the deploy locally with `npm run dev`, then either push the branch and ship, or call out specific revisions before push. Phase 2 (auth) and Phase 3 (authenticated app — buyer/seller/admin) remain open as separate spec/plan cycles.

---

## Self-review

**Spec coverage** — every requirement in `2026-04-29-refined-premium-foundation-design.md`:

- §1 Aesthetic direction → Tasks 1, 13–17 (tokens + landing surface choices implement the locked direction)
- §2.1 Color tokens → Task 1 step 1.1
- §2.2 Typography → Task 1 steps 1.1 + 1.2
- §2.3 Spacing & layout → Task 1 step 1.1 (`--space-*`, `--container-*`, `--section-y`)
- §2.4 Radius → Task 1 step 1.1
- §2.5 Shadows → Task 1 step 1.1
- §2.6 Motion variables → Task 1 step 1.1
- §3.1 Final stack (Lenis + Framer Motion, GSAP removed) → Task 1 step 1.3 + Task 11
- §3.2 Lenis tuning → Task 2 step 2.1
- §3.3 Five sanctioned motion patterns:
  - #1 Hero entrance stagger → Task 2 step 2.2 (`HeroEntrance`) + Task 13
  - #2 Scroll-anchored reveal → Task 2 step 2.2 (`Reveal`/`RevealStagger`) + Tasks 14–16
  - #3 Stat count-up → Task 11
  - #4 Image scroll parallax → Task 2 step 2.3 (`ParallaxImage`); used opportunistically by blog detail (Task 18) — note: hero photography is intentionally not added in Phase 1; the ParallaxImage primitive is shipped and ready for future use
  - #5 Hover micro-feedback → embedded in primitives (Tasks 3–9) and in section cards (Tasks 14–16)
- §3.4 Reduced-motion contract → Task 1 step 1.1 (CSS rule) + Task 17 step 17.4 + Task 21 step 21.3
- §4 Primitive rewrite list (19 components) → Tasks 3–9
- §5.1 Files in scope → all addressed across Tasks 1–20
- §5.2 Files explicitly out of scope → never touched
- §5.3 Hero strategy decision → Task 13
- §5.4 Landing section order → Tasks 13–17 (sections 7 "social proof" deliberately not built — the spec said "skip entirely rather than fake it" if no real testimonials exist; this remains an explicit non-goal of Phase 1)
- §5.5 Branch strategy → addressed in plan header + Task 21 step 21.5
- §6 Implementation sequencing → mirrored 1:1 in Task ordering 1–21
- §7 Risks → mitigations baked into specific steps (e.g., backwards-compat shim in Task 1 step 1.1; reduced-motion DevTools test in Task 17 step 17.4 + Task 21 step 21.3)
- §8 Acceptance criteria → fully covered by Task 21 (build, lint, typecheck, Lighthouse, reduced-motion screenshot, no-push verification)

**Placeholder scan** — searched plan for "TBD", "TODO", "implement later", "fill in details", "similar to Task N", "add appropriate", "handle edge cases" — none found.

**Type/name consistency** — `Reveal`, `RevealStagger`, `RevealItem`, `HeroEntrance`, `HeroEntranceItem`, `ParallaxImage`, `LiveMarketplacePanel`, `HeroStatCounter`, `HowItWorks`, `CategoriesGrid`, `WhySection`, `CtaBand`, `MarketingNav`, `MarketingFooter` — all spelled consistently across Tasks 2 (definition), 13–17 (use), and the plan header. Color tokens (`--paper`, `--paper-2`, `--ink`, `--ink-2`, `--ink-3`, `--ink-4`, `--line`, `--line-2`, `--forest`, `--forest-2`, `--forest-tint`) used consistently throughout. Motion easing `cubic-bezier(0.32, 0.72, 0, 1)` used identically in CSS and Framer Motion variant transitions.

— *End of plan.*


