# Marketing Nav — Live Index Strip Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a dark live-stats ticker strip above the existing marketing nav (desktop + mobile), with 30s server polling of `scraps`/`listing_bids`/`transactions`. The current pill-on-scroll, scroll-progress bar, and mint-underline behaviors stay intact.

**Architecture:** Refactor `marketing-nav.tsx` into a thin server-component wrapper (fetches initial stats via a new `getLiveStats()` query) that renders a renamed `MarketingNavClient` (the existing client component, extended to accept `initialStats`). A new `LiveTickerStrip` client component owns the 30s poll and pulse animation. A new `/api/live-stats` Route Handler serves the JSON. Existing `<MarketingNav />` import sites (5 files) keep working unchanged.

**Tech Stack:** Next.js 16 App Router (server + client components), Supabase server client (dynamic import pattern), Tailwind v4, TypeScript strict. No test framework exists — verification is `npm run typecheck`, `npm run lint`, and manual visual QA at `localhost:3000`.

**Spec:** `docs/superpowers/specs/2026-05-17-marketing-nav-live-ticker-design.md`

---

## File map

| File | Action | Responsibility |
|---|---|---|
| `src/types/index.ts` | modify | Add `LiveStats` type |
| `src/lib/queries/live-stats.ts` | create | Server-side fetch of 4 aggregate stats |
| `src/app/api/live-stats/route.ts` | create | GET handler returning `LiveStats` JSON |
| `src/app/globals.css` | modify | Add `@keyframes pulse-mint` + `.pulse-dot` utility |
| `src/components/shared/live-ticker-strip.tsx` | create | Client component: 30s poll, pulse, responsive desktop/mobile token sets |
| `src/components/shared/marketing-nav-client.tsx` | create (renamed from current marketing-nav.tsx) | The existing client logic; now accepts `initialStats` prop |
| `src/components/shared/marketing-nav.tsx` | rewrite as server component | Calls `getLiveStats()`, renders `<MarketingNavClient initialStats={...} />` |

Consuming pages (`app/page.tsx`, `app/contact/page.tsx`, `app/blogs/page.tsx`, `app/blogs/[slug]/page.tsx`, `app/not-found.tsx`) don't need to change — the existing `<MarketingNav />` import continues to work because the new server-component wrapper preserves the public API.

---

### Task 1: Add `LiveStats` type

**Files:**
- Modify: `src/types/index.ts` (append to end)

- [ ] **Step 1: Append the type to `types/index.ts`**

```ts
export type TrendingCategory = {
  category: ScrapCategory;
  count: number;
};

export type LiveStats = {
  listingsLive: number;
  listingsToday: number;
  lastActivityAt: string | null;
  trendingCategories: TrendingCategory[];
};
```

- [ ] **Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: PASS (no new errors).

- [ ] **Step 3: Commit**

```bash
git add src/types/index.ts
git commit -m "feat(nav): add LiveStats type for live-ticker"
```

---

### Task 2: Implement `getLiveStats()` server query

**Files:**
- Create: `src/lib/queries/live-stats.ts`

- [ ] **Step 1: Create the query module**

```ts
// src/lib/queries/live-stats.ts
import type { LiveStats, ScrapCategory, TrendingCategory } from "@/types";
import { isMockMode } from "@/lib/mock-data";

const MOCK_STATS: LiveStats = {
  listingsLive: 47,
  listingsToday: 3,
  lastActivityAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  trendingCategories: [
    { category: "Metal", count: 8 },
    { category: "E-waste", count: 5 },
  ],
};

function todayStartIST(): string {
  // IST = UTC+5:30. Midnight IST = 18:30 previous UTC day.
  const now = new Date();
  const istNow = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const istMidnight = new Date(
    Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate())
  );
  const utcEquivalent = new Date(istMidnight.getTime() - 5.5 * 60 * 60 * 1000);
  return utcEquivalent.toISOString();
}

export async function getLiveStats(): Promise<LiveStats> {
  if (isMockMode()) return MOCK_STATS;

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const todayStart = todayStartIST();
  const yesterdayUTC = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // 1. Live listings count
  const { count: liveCount } = await supabase
    .from("scraps")
    .select("id", { count: "exact", head: true })
    .eq("status", "live");

  // 2. Today's new listings (live only)
  const { count: todayCount } = await supabase
    .from("scraps")
    .select("id", { count: "exact", head: true })
    .eq("status", "live")
    .gte("created_at", todayStart);

  // 3. Last activity — newest of (listing_bids, transactions)
  const [bidsResult, txnsResult] = await Promise.all([
    supabase
      .from("listing_bids")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("transactions")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);
  const lastBidAt = bidsResult.data?.created_at ?? null;
  const lastTxnAt = txnsResult.data?.created_at ?? null;
  let lastActivityAt: string | null = null;
  if (lastBidAt && lastTxnAt) {
    lastActivityAt = lastBidAt > lastTxnAt ? lastBidAt : lastTxnAt;
  } else {
    lastActivityAt = lastBidAt ?? lastTxnAt;
  }

  // 4. Trending categories — top 2 by count of NEW listings in last 24h
  const { data: recentScraps } = await supabase
    .from("scraps")
    .select("category")
    .eq("status", "live")
    .gte("created_at", yesterdayUTC);

  const categoryCounts = new Map<ScrapCategory, number>();
  for (const row of (recentScraps ?? []) as Array<{ category: ScrapCategory }>) {
    categoryCounts.set(row.category, (categoryCounts.get(row.category) ?? 0) + 1);
  }
  const trendingCategories: TrendingCategory[] = Array.from(categoryCounts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 2);

  return {
    listingsLive: liveCount ?? 0,
    listingsToday: todayCount ?? 0,
    lastActivityAt,
    trendingCategories,
  };
}
```

- [ ] **Step 2: Verify typecheck**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/lib/queries/live-stats.ts
git commit -m "feat(nav): add getLiveStats query"
```

---

### Task 3: Create `/api/live-stats` Route Handler

**Files:**
- Create: `src/app/api/live-stats/route.ts`

- [ ] **Step 1: Create the route**

```ts
// src/app/api/live-stats/route.ts
import { NextResponse } from "next/server";
import { getLiveStats } from "@/lib/queries/live-stats";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const stats = await getLiveStats();
  return NextResponse.json(stats, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
```

- [ ] **Step 2: Verify typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: PASS.

- [ ] **Step 3: Smoke test in dev**

```bash
npm run dev
# In another terminal:
curl -s http://localhost:3000/api/live-stats
```
Expected: JSON with `listingsLive`, `listingsToday`, `lastActivityAt`, `trendingCategories` fields.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/live-stats/route.ts
git commit -m "feat(nav): add /api/live-stats route handler"
```

---

### Task 4: Add pulse keyframes to globals.css

**Files:**
- Modify: `src/app/globals.css` (append a new utility block near the bottom of `:root` rules but before any media queries — anywhere that doesn't collide with `@theme` works)

- [ ] **Step 1: Append the keyframes + utility**

Add at the bottom of `src/app/globals.css`:

```css
/* === Live-ticker pulse dot === */
@keyframes pulse-mint {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
}

.pulse-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  background: #34D399; /* mint */
  border-radius: 50%;
  animation: pulse-mint 2s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .pulse-dot {
    animation: none;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/globals.css
git commit -m "feat(nav): pulse-dot keyframes for live-ticker"
```

---

### Task 5: Build `LiveTickerStrip` component

**Files:**
- Create: `src/components/shared/live-ticker-strip.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/shared/live-ticker-strip.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import type { LiveStats } from "@/types";

type Props = {
  initialStats: LiveStats;
  /** When true, the strip translates out of view (used when the nav is in scrolled-pill state). */
  hidden?: boolean;
};

function formatRelativeTime(iso: string | null): string | null {
  if (!iso) return null;
  const diffMs = Date.now() - new Date(iso).getTime();
  if (diffMs < 0) return "just now";
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const REFRESH_MS = 30_000;

export function LiveTickerStrip({ initialStats, hidden = false }: Props) {
  const [stats, setStats] = useState<LiveStats>(initialStats);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 30s polling; pauses while the tab is hidden.
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/live-stats", { cache: "no-store" });
        if (!res.ok) return;
        const data: LiveStats = await res.json();
        setStats(data);
      } catch {
        // Silent — keep last-known values.
      }
    }

    function start() {
      if (intervalRef.current) return;
      intervalRef.current = setInterval(fetchStats, REFRESH_MS);
    }
    function stop() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    function onVisibility() {
      if (document.visibilityState === "visible") {
        fetchStats(); // refresh immediately on resume
        start();
      } else {
        stop();
      }
    }

    if (document.visibilityState === "visible") start();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const relativeTime = formatRelativeTime(stats.lastActivityAt);
  const hasMarket = stats.listingsLive > 0 || stats.lastActivityAt !== null;

  return (
    <div
      aria-hidden={hidden || undefined}
      className={`bg-[var(--ink)] text-white/80 transition-transform duration-300 ease-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="container-page">
        {/* Desktop layout */}
        <div className="hidden md:flex h-[26px] items-center justify-between font-mono text-[10px] uppercase tracking-[0.13em]">
          <div className="flex items-center gap-6">
            <span className="flex items-center">
              <span className="pulse-dot mr-2" />
              LIVE
            </span>
            <span>
              {stats.listingsLive} LISTINGS
              {stats.listingsToday > 0 && (
                <>
                  {" · "}
                  <span className="text-[#34D399]">+{stats.listingsToday} TODAY</span>
                </>
              )}
            </span>
            {stats.trendingCategories.length > 0 && (
              <span>
                {stats.trendingCategories.map((c, i) => (
                  <span key={c.category}>
                    {i > 0 && " · "}
                    {c.category.toUpperCase()} <span className="text-[#34D399]">▲</span>
                  </span>
                ))}
              </span>
            )}
            <span>
              {hasMarket && relativeTime
                ? `LAST BID ${relativeTime.toUpperCase()}`
                : "NEW MARKET"}
            </span>
          </div>
          <span className="text-white/55">B2B.SCRAPKART.APP</span>
        </div>

        {/* Mobile layout — 3 short tokens */}
        <div className="flex md:hidden h-[24px] items-center gap-4 font-mono text-[9.5px] uppercase tracking-[0.12em]">
          <span className="flex items-center">
            <span className="pulse-dot mr-1.5" />
            LIVE
          </span>
          <span>
            <span className="text-[#34D399]">{stats.listingsLive}</span> LISTINGS
          </span>
          <span>
            {hasMarket && relativeTime
              ? relativeTime.toUpperCase()
              : "NEW MARKET"}
          </span>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify typecheck and lint**

Run: `npm run typecheck && npm run lint`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/components/shared/live-ticker-strip.tsx
git commit -m "feat(nav): LiveTickerStrip client component with 30s polling"
```

---

### Task 6: Rename current `marketing-nav.tsx` → `marketing-nav-client.tsx`

This task moves the existing client component to a new filename. The next task replaces the old filename with a server-component wrapper. Done as two separate tasks so the `mv` is reviewable on its own.

**Files:**
- Rename: `src/components/shared/marketing-nav.tsx` → `src/components/shared/marketing-nav-client.tsx`
- Modify: the renamed file — export name becomes `MarketingNavClient`, add `initialStats` prop and pass it through to a mounted `<LiveTickerStrip>`. Add the in-pill `● N LIVE` mini-chip and the `+N TODAY` activity chip.

- [ ] **Step 1: Move the file**

```bash
git mv src/components/shared/marketing-nav.tsx src/components/shared/marketing-nav-client.tsx
```

- [ ] **Step 2: Rewrite `marketing-nav-client.tsx`**

Full file contents (replaces existing):

```tsx
// src/components/shared/marketing-nav-client.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight, LayoutDashboard, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { LiveStats } from "@/types";
import { LiveTickerStrip } from "./live-ticker-strip";

type AuthUser = { name: string; role: string | null; dashboardUrl: string };

const NAV_LINKS = [
  { label: "Marketplace", href: "/marketplace", sectionId: null as string | null, hasActivity: true },
  { label: "How it works", href: "/#how-it-works", sectionId: "how-it-works", hasActivity: false },
  { label: "Companies", href: "/companies", sectionId: null as string | null, hasActivity: false },
  { label: "Blog", href: "/blogs", sectionId: null as string | null, hasActivity: false },
];

export function MarketingNavClient({ initialStats }: { initialStats: LiveStats }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      setScrolled(scrollTop > 8);
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.sectionId).filter(
      (id): id is string => Boolean(id)
    );
    const observers: IntersectionObserver[] = [];
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveSection(id);
            else if (activeSection === id) setActiveSection(null);
          });
        },
        { rootMargin: "-40% 0px -50% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });
    return () => observers.forEach((o) => o.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return (
    <>
      {/* Scroll progress bar */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-[var(--forest)] origin-left transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
        aria-hidden
      />

      <header className="sticky top-0 z-50">
        {/* Live ticker — hides when nav becomes the floating pill */}
        <LiveTickerStrip initialStats={initialStats} hidden={scrolled} />

        <div className="container-page">
          <div
            className={`flex h-16 items-center justify-between transition-all duration-300 ease-out ${
              scrolled
                ? "mt-3 px-5 rounded-full bg-[rgba(250,250,247,0.78)] backdrop-blur-xl shadow-[0_10px_30px_rgba(15,77,42,0.08)] border border-white/50"
                : "mt-0 px-0 rounded-none bg-transparent border border-transparent"
            }`}
          >
            <Link
              href="/"
              className="flex items-center gap-2.5 transition-transform duration-200 hover:-translate-y-px"
            >
              <Image
                src="/logos/ScrapKart Black Logo.png"
                alt="ScrapKart"
                width={260}
                height={40}
                className="h-10 w-auto"
                priority
              />
              <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--ink-3)] border border-[var(--line)] rounded-[var(--radius-xs)] px-1.5 py-0.5">
                B2B
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = link.sectionId && activeSection === link.sectionId;
                const showChip =
                  link.hasActivity && !scrolled && initialStats.listingsToday > 0;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative text-[14px] font-medium px-3 py-2 rounded-[var(--radius-sm)] transition-colors duration-200 group inline-flex items-center gap-1.5 ${
                      isActive
                        ? "text-[var(--forest)]"
                        : "text-[var(--ink-2)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {link.label}
                    {showChip && (
                      <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--forest)] bg-[var(--forest-tint)] rounded-[3px] px-1 py-[1px]">
                        +{initialStats.listingsToday}
                      </span>
                    )}
                    <span
                      className={`pointer-events-none absolute left-3 right-3 bottom-1 h-[1.5px] bg-[#34D399] origin-left transition-transform duration-300 ease-out ${
                        isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                      }`}
                      aria-hidden
                    />
                  </Link>
                );
              })}
            </nav>

            <div className="hidden md:flex items-center gap-2">
              {/* In-pill live mini-chip (only when scrolled) */}
              {scrolled && (
                <span className="flex items-center font-mono text-[9.5px] uppercase tracking-[0.13em] text-[var(--ink-3)] mr-1">
                  <span className="pulse-dot mr-1.5" />
                  {initialStats.listingsLive} LIVE
                </span>
              )}
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
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setProfileOpen(false)}
                      />
                      <div className="absolute right-0 top-11 z-50 w-60 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] shadow-[var(--shadow-2)] p-1.5">
                        <div className="px-3 py-2.5 mb-1">
                          <p className="text-[14px] font-semibold text-[var(--ink)]">
                            {authUser.name}
                          </p>
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
                          <LayoutDashboard className="size-4 text-[var(--ink-3)]" />{" "}
                          Dashboard
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
                    className="inline-flex items-center gap-1.5 bg-[var(--forest)] hover:bg-[var(--forest-2)] text-white px-4 py-2 rounded-[var(--radius-md)] text-[14px] font-medium shadow-[var(--shadow-1)] transition-[background-color,transform] duration-200 hover:-translate-y-px"
                  >
                    Post a listing
                    <ArrowRight className="size-3.5" />
                  </Link>
                </>
              )}
            </div>

            <button
              className="p-2 md:hidden text-[var(--ink)]"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden mt-2 mx-3 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] shadow-[var(--shadow-2)] px-5 py-5 space-y-1">
            {NAV_LINKS.map((link) => {
              const showChip =
                link.hasActivity && initialStats.listingsToday > 0;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between text-[15px] font-medium text-[var(--ink)] py-2"
                >
                  <span>{link.label}</span>
                  {showChip && (
                    <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-[var(--forest)] bg-[var(--forest-tint)] rounded-[3px] px-1.5 py-[2px]">
                      +{initialStats.listingsToday} TODAY
                    </span>
                  )}
                </Link>
              );
            })}
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
                  <Link
                    href="/login"
                    className="text-center px-4 py-3 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] text-[14px] font-medium"
                  >
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
    </>
  );
}
```

- [ ] **Step 3: Verify typecheck**

Run: `npm run typecheck`
Expected: PASS. (Lint will still warn that nothing imports `MarketingNavClient` until Task 7 wires up the server wrapper. That's fine — we'll commit after Task 7.)

- [ ] **Step 4: Hold off committing until Task 7**

Task 7's server-component wrapper depends on this rename and replaces the file at the old path. Commit both together so the build never goes through a broken state.

---

### Task 7: Rewrite `marketing-nav.tsx` as a server-component wrapper

**Files:**
- Create: `src/components/shared/marketing-nav.tsx` (new file at the old path, server component)

- [ ] **Step 1: Create the wrapper**

```tsx
// src/components/shared/marketing-nav.tsx
import { getLiveStats } from "@/lib/queries/live-stats";
import { MarketingNavClient } from "./marketing-nav-client";

// Server component — fetches initial live-stats and hands them to the client nav.
export async function MarketingNav() {
  const initialStats = await getLiveStats();
  return <MarketingNavClient initialStats={initialStats} />;
}
```

- [ ] **Step 2: Verify build**

Run: `npm run typecheck && npm run lint && npm run build`
Expected: All pass. Note: `MarketingNav` is now async; Next.js handles async server components natively, and the 5 existing consumers (`page.tsx`, `contact/page.tsx`, `blogs/page.tsx`, `blogs/[slug]/page.tsx`, `not-found.tsx`) are themselves server components, so `<MarketingNav />` continues to work unchanged.

- [ ] **Step 3: Commit Tasks 6 + 7 together**

```bash
git add src/components/shared/marketing-nav.tsx src/components/shared/marketing-nav-client.tsx
git commit -m "feat(nav): wire LiveTickerStrip into marketing nav + in-pill live chip"
```

---

### Task 8: Manual visual QA — desktop

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Open `http://localhost:3000` in a desktop-width browser window**

Verify the following:
- Dark ticker strip is visible above the nav row.
- Left-side tokens: `● LIVE` (with pulsing mint dot), `N LISTINGS · +M TODAY` (delta in mint if `M > 0`), trending categories with `▲`, `LAST BID Xm AGO`.
- Right side: `B2B.SCRAPKART.APP` in mono.
- Pulse dot animates smoothly (2s cycle).

- [ ] **Step 3: Scroll past 8px**

Verify:
- Dark ticker strip slides up out of view (300ms ease-out).
- Logo + nav row converts to the floating frosted pill (existing behavior preserved).
- Inside the pill, left of the CTA: a small `● N LIVE` chip in mono is now visible.
- Scroll back up — ticker slides back in.

- [ ] **Step 4: Hover and active-section checks**

- Hover any nav link — mint underline slides in.
- Scroll to the "How it works" section — that link turns forest green and the underline stays.

- [ ] **Step 5: Open Network tab, wait 30s**

- A new request to `/api/live-stats` should fire at the 30s mark.
- Switch the tab to another window for 60s; on returning, verify a fetch fires immediately (visibility resume), then 30s cadence resumes.

- [ ] **Step 6: Report findings in chat before continuing**

If anything is off, describe what's wrong and which screen state it's in. Otherwise: "Desktop QA passed."

---

### Task 9: Manual visual QA — mobile

- [ ] **Step 1: Open DevTools → device toolbar → iPhone 14 Pro (or any ≤768px width)**

- [ ] **Step 2: Verify mobile top state**

- Dark ticker strip is visible with 3 short tokens: `● LIVE · N LISTINGS · Xm AGO` (or `NEW MARKET` if no activity).
- Logo + hamburger on the row below. No nav links visible.
- Tokens fit on a single row without wrapping.

- [ ] **Step 3: Tap the hamburger**

- Menu expands.
- Each nav link gets a row in the menu.
- Marketplace shows `+N TODAY` chip on the right when `listingsToday > 0`.

- [ ] **Step 4: Scroll the page slightly with the menu closed**

- Ticker hides, nav floats as pill.
- Pill is appropriately sized for mobile (existing behavior).

- [ ] **Step 5: Report findings**

If anything is off, describe what's wrong. Otherwise: "Mobile QA passed."

---

### Task 10: Reduced-motion verification

- [ ] **Step 1: Enable reduced motion**

- macOS: System Settings → Accessibility → Display → Reduce motion.
- Windows: Settings → Accessibility → Visual effects → Animation effects off.
- Chrome DevTools: Rendering panel → Emulate CSS media feature `prefers-reduced-motion: reduce`.

- [ ] **Step 2: Reload `http://localhost:3000`**

Verify:
- Pulse dot stays solid mint — no animation.
- Ticker hide/show transition on scroll still works (it's a 300ms layout transition; per-element preference, this is acceptable to keep — but if the user wants it gone, that's a follow-up).

- [ ] **Step 3: Report**

Either "Reduced-motion check passed" or describe what still moves that shouldn't.

---

### Task 11: Final hold for "push"

Per the user's standing preference (no auto-push):

- [ ] **Step 1: Surface commit log**

```bash
git log --oneline -10
```
Confirm the 5 new commits from Tasks 1, 2, 3, 4, and 6+7 are present.

- [ ] **Step 2: Do NOT push**

Wait for the user to say "push" before running `git push`. Local commits are done; the branch is ready.

---

## Self-review

- **Spec coverage:**
  - Dark ticker strip, desktop layout → Task 5 (component) + Task 7 (mount).
  - Mobile token compression → Task 5 (responsive Tailwind classes).
  - Scrolled state hides ticker + adds in-pill mini-chip → Task 6 (`hidden` prop + in-pill chip rendered when `scrolled`).
  - Activity chip beside Marketplace link → Task 6 (`showChip` block).
  - 30s polling with visibility-pause → Task 5 (`useEffect`).
  - SSR initial stats → Task 7 (server-component wrapper calls `getLiveStats`).
  - Reduced-motion → Task 4 (CSS) + Task 10 (verify).
  - Edge cases (`NEW MARKET`, missing trending) → Task 5 (conditional rendering).
  - API fetch failure → Task 5 (try/catch, keep last-known).

- **Placeholder scan:** No "TBD", "implement later", or vague "handle edge cases" steps. All code blocks are complete.

- **Type consistency:** `LiveStats` shape (`listingsLive`, `listingsToday`, `lastActivityAt`, `trendingCategories`) is identical in `types/index.ts` (Task 1), `getLiveStats` return (Task 2), `/api/live-stats` JSON (Task 3), and the component props (Task 5, 6, 7). `TrendingCategory.category` is typed as `ScrapCategory` (the existing union type) so capitalization in the ticker matches the values in the DB.

- **Order safety:** Tasks 1–4 can each commit on their own. Tasks 6 + 7 commit together to avoid a build break between the rename and the wrapper.

- **Backend untouched:** No schema changes, no RLS changes, no migrations. All reads use existing public RLS policies on `scraps`, `listing_bids`, `transactions`.
