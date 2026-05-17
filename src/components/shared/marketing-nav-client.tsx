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
                  <span className="ticker-pulse-dot mr-1.5" />
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
