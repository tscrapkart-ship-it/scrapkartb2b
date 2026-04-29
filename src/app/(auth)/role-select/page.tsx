"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Factory, Recycle, Layers2, Check, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import type { UserRole } from "@/types";

const EASE = [0.32, 0.72, 0, 1] as const;

const roles: {
  value: UserRole;
  title: string;
  description: string;
  icon: typeof Factory;
}[] = [
  {
    value: "waste_producer",
    title: "Waste producer",
    description: "I generate industrial scrap and want to list lots and receive bids from verified recyclers.",
    icon: Factory,
  },
  {
    value: "recycler",
    title: "Recycler / aggregator",
    description: "I process and recycle scrap. I want to browse listings and place competitive bids.",
    icon: Recycle,
  },
  {
    value: "both",
    title: "Both",
    description: "I generate scrap and also process it. I need access to both producer and recycler tools.",
    icon: Layers2,
  },
];

export default function RoleSelectPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (!selected) return;
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("Not authenticated. Please sign in again.");
      setLoading(false);
      return;
    }

    const { error: upsertError } = await supabase.from("users").upsert({
      id: user.id,
      email: user.email!,
      name: user.user_metadata?.name || "User",
      role: selected,
      onboarding_completed: false,
      is_approved: false,
    });

    if (upsertError) {
      setError(upsertError.message);
      setLoading(false);
      return;
    }

    if (selected === "recycler") {
      router.push("/onboarding/recycler");
    } else {
      router.push("/onboarding/producer");
    }
    router.refresh();
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: EASE },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-7"
    >
      <motion.div variants={itemVariants}>
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-3)] font-medium">One last step</p>
        <h1 className="mt-3 text-[28px] font-semibold tracking-[-0.025em] leading-tight text-[var(--ink)]">
          Choose your role.
        </h1>
        <p className="mt-2 text-[14.5px] text-[var(--ink-3)] leading-relaxed">
          This determines your dashboard and onboarding. You can contact support to change it later.
        </p>
      </motion.div>

      <div className="space-y-3">
        {roles.map((role) => {
          const isSelected = selected === role.value;
          const Icon = role.icon;

          return (
            <motion.div key={role.value} variants={itemVariants}>
              <button
                type="button"
                onClick={() => setSelected(role.value)}
                aria-pressed={isSelected}
                className={`w-full text-left rounded-[var(--radius-lg)] border p-5 transition-[border-color,background-color,box-shadow] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] ${
                  isSelected
                    ? "border-[var(--forest)] bg-[var(--forest-tint)] shadow-[var(--shadow-1)]"
                    : "border-[var(--line)] bg-[var(--paper)] hover:bg-[var(--paper-2)] hover:shadow-[var(--shadow-1)]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] transition-colors duration-200 ${
                      isSelected ? "bg-[var(--forest)] text-white" : "bg-[var(--paper-2)] text-[var(--ink-3)]"
                    }`}
                  >
                    <Icon className="size-[18px]" />
                  </div>

                  <div className="flex-1 space-y-1 min-w-0">
                    <h3 className="text-[15.5px] font-semibold tracking-[-0.015em] text-[var(--ink)]">{role.title}</h3>
                    <p className="text-[13.5px] text-[var(--ink-2)] leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  <div
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full transition-all duration-200 mt-0.5 ${
                      isSelected
                        ? "bg-[var(--forest)] scale-100"
                        : "border border-[var(--line)] scale-95 opacity-70"
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 320, damping: 22 }}
                      >
                        <Check className="size-3 text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                  </div>
                </div>
              </button>
            </motion.div>
          );
        })}
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

      <motion.div variants={itemVariants}>
        <Button
          onClick={handleConfirm}
          className="w-full"
          disabled={!selected || loading}
        >
          {loading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Setting up...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
}
