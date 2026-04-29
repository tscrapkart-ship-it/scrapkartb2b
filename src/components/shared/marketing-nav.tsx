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
