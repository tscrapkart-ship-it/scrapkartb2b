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
