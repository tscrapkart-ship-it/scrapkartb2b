"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

const EASE = [0.32, 0.72, 0, 1] as const;

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Route to the role-appropriate dashboard. Mirrors auth/callback/route.ts
    // so email login lands the same place Google login does.
    const { data: { user } } = await supabase.auth.getUser();
    let dest = "/role-select";
    if (user) {
      const { data: profile } = await supabase
        .from("users")
        .select("role, onboarding_completed")
        .eq("id", user.id)
        .single();
      const role = profile?.role;
      const onboarded = profile?.onboarding_completed ?? false;
      if (!role) dest = "/role-select";
      else if (!onboarded) dest = role === "recycler" ? "/onboarding/recycler" : "/onboarding/producer";
      else if (role === "admin") dest = "/admin";
      else if (role === "recycler") dest = "/marketplace";
      else dest = "/dashboard"; // waste_producer | both
    }
    router.push(dest);
    router.refresh();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <div className="mb-9">
        <div className="inline-flex size-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--forest-tint)] mb-5">
          <LogIn className="size-[18px] text-[var(--forest)]" />
        </div>
        <h1 className="text-[28px] font-semibold tracking-[-0.025em] leading-tight text-[var(--ink)]">
          Welcome back.
        </h1>
        <p className="mt-2 text-[14.5px] text-[var(--ink-3)] leading-relaxed">
          Sign in to your ScrapKart account.
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="text-[13px] text-[var(--danger)] bg-[var(--danger)]/10 border border-[var(--danger)]/30 rounded-[var(--radius-md)] px-3 py-2"
            role="alert"
          >
            {error}
          </motion.p>
        )}

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </form>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-[var(--line)]" />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)]">or</span>
          <div className="h-px flex-1 bg-[var(--line)]" />
        </div>
        <GoogleAuthButton label="Sign in with Google" />
      </div>

      <p className="mt-7 text-center text-[14px] text-[var(--ink-3)]">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-[var(--forest)] hover:text-[var(--forest-2)] transition-colors"
        >
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
