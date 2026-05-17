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
              <span className="ticker-pulse-dot mr-2" />
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
            <span className="ticker-pulse-dot mr-1.5" />
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
