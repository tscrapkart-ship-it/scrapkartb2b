"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Mail, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleAuthButton } from "@/components/auth/google-auth-button";

const EASE = [0.32, 0.72, 0, 1] as const;

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace("/role-select");
    });
  }, [router]);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    setEmailSent(true);
  }

  if (emailSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: EASE }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 220, damping: 18 }}
          className="mx-auto flex size-16 items-center justify-center rounded-full bg-[var(--forest-tint)] mb-7"
        >
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2.4, ease: "easeInOut" }}
          >
            <Mail className="size-7 text-[var(--forest)]" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.45, ease: EASE }}
        >
          <h1 className="text-[28px] font-semibold tracking-[-0.025em] leading-tight text-[var(--ink)]">
            Check your email.
          </h1>
          <p className="mt-3 text-[15px] text-[var(--ink-2)] leading-relaxed">
            We sent a confirmation link to{" "}
            <span className="font-medium text-[var(--forest)]">{email}</span>. Click it to verify your account and choose your role.
          </p>
          <p className="mt-2 text-[13px] text-[var(--ink-3)]">
            Didn&apos;t receive it? Check your spam folder.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4, ease: EASE }}
          className="mt-7"
        >
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setEmailSent(false)}
          >
            Back to sign up
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="signup-form"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE }}
      >
        <div className="mb-9">
          <div className="inline-flex size-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--forest-tint)] mb-5">
            <UserPlus className="size-[18px] text-[var(--forest)]" />
          </div>
          <h1 className="text-[28px] font-semibold tracking-[-0.025em] leading-tight text-[var(--ink)]">
            Create your account.
          </h1>
          <p className="mt-2 text-[14.5px] text-[var(--ink-3)] leading-relaxed">
            Join ScrapKart and start trading scrap by the truckload.
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoComplete="name"
            />
          </div>

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
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
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
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        <div className="mt-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--line)]" />
            <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)]">or</span>
            <div className="h-px flex-1 bg-[var(--line)]" />
          </div>
          <GoogleAuthButton label="Sign up with Google" />
        </div>

        <p className="mt-7 text-center text-[14px] text-[var(--ink-3)]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[var(--forest)] hover:text-[var(--forest-2)] transition-colors"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
