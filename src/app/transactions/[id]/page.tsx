"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Package,
  User,
  CalendarDays,
  IndianRupee,
  ShieldCheck,
  MessageCircle,
  Loader2,
  ChevronRight,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

const statusConfig: Record<string, { dot: string; text: string; bg: string; label: string }> = {
  scheduled: {
    dot: "bg-[var(--info)]",
    text: "text-[var(--info)]",
    bg: "bg-[var(--info)]/10 border border-[var(--info)]/20",
    label: "Scheduled",
  },
  in_progress: {
    dot: "bg-[var(--info)]",
    text: "text-[var(--info)]",
    bg: "bg-[var(--info)]/10 border border-[var(--info)]/20",
    label: "In Progress",
  },
  completed: {
    dot: "bg-[var(--forest)]",
    text: "text-[var(--forest)]",
    bg: "bg-[var(--forest-tint)] border border-[var(--forest)]/20",
    label: "Completed",
  },
  cancelled: {
    dot: "bg-[var(--danger)]",
    text: "text-[var(--danger)]",
    bg: "bg-[var(--danger)]/10 border border-[var(--danger)]/30",
    label: "Cancelled",
  },
};

const defaultStatus = {
  dot: "bg-[var(--ink-4)]",
  text: "text-[var(--ink-4)]",
  bg: "bg-[var(--paper-2)] border border-[var(--line)]",
  label: "Unknown",
};

// Timeline steps
const timelineSteps = [
  { key: "scheduled", label: "Scheduled", icon: Clock },
  { key: "in_progress", label: "In Progress", icon: Truck },
  { key: "completed", label: "Completed", icon: CheckCircle2 },
];

function getStepState(stepKey: string, currentStatus: string) {
  const order = ["scheduled", "in_progress", "completed"];
  const currentIdx = order.indexOf(currentStatus);
  const stepIdx = order.indexOf(stepKey);

  if (currentStatus === "cancelled") return "cancelled";
  if (stepIdx < currentIdx) return "done";
  if (stepIdx === currentIdx) return "active";
  return "upcoming";
}

interface TransactionDetail {
  id: string;
  listing_id: string;
  producer_id: string;
  recycler_id: string;
  final_price: number;
  final_quantity_kg: number | null;
  pickup_date: string | null;
  pickup_otp: string | null;
  otp_verified_at: string | null;
  status: string;
  created_at: string;
  scraps: { title: string; category: string; quantity: number; unit: string } | null;
  producer: { name: string; email: string } | null;
  recycler: { name: string; email: string } | null;
}

export default function TransactionDetailPage() {
  const params = useParams();
  const [tx, setTx] = useState<TransactionDetail | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [otpInput, setOtpInput] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);

      const { data } = await supabase
        .from("transactions")
        .select(`
          *,
          scraps(title, category, quantity, unit),
          producer:users!transactions_producer_id_fkey(name, email),
          recycler:users!transactions_recycler_id_fkey(name, email)
        `)
        .eq("id", params.id as string)
        .single();

      setTx(data as TransactionDetail);
      setLoading(false);
    }
    load();
  }, [params.id]);

  async function handleVerifyOtp() {
    if (!tx || !otpInput.trim()) return;
    setOtpLoading(true);

    if (otpInput.trim() !== tx.pickup_otp) {
      toast.error("Invalid OTP. Please check with the producer.");
      setOtpLoading(false);
      return;
    }

    const supabase = createClient();
    await supabase
      .from("transactions")
      .update({
        otp_verified_at: new Date().toISOString(),
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", tx.id);

    await supabase
      .from("scraps")
      .update({ status: "completed" })
      .eq("id", tx.listing_id);

    toast.success("OTP verified! Deal marked as completed.");
    setTx({ ...tx, otp_verified_at: new Date().toISOString(), status: "completed" });
    setOtpLoading(false);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 min-h-screen bg-[var(--paper)]">
        <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--paper)] border border-[var(--line)]">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--forest)]" />
        </div>
        <span className="mt-3 text-base text-[var(--ink-4)]">Loading deal...</span>
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="flex flex-col items-center justify-center py-32 min-h-screen bg-[var(--paper)]">
        <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--paper)] border border-[var(--line)]">
          <XCircle className="h-6 w-6 text-[var(--ink-4)]" />
        </div>
        <p className="mt-4 text-base text-[var(--ink-3)]">Deal not found</p>
        <Link href="/transactions" className="mt-3 text-sm text-[var(--forest)] hover:underline">
          Back to deals
        </Link>
      </div>
    );
  }

  const isProducer = userId === tx.producer_id;
  const isRecycler = userId === tx.recycler_id;
  const counterpart = isProducer ? tx.recycler : tx.producer;
  const counterpartLabel = isProducer ? "Recycler" : "Producer";
  const status = statusConfig[tx.status] ?? defaultStatus;

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-base text-[var(--ink-4)] animate-fade-in">
          <Link href="/transactions" className="flex items-center gap-1 hover:text-[var(--forest)] transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            Deals
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[var(--ink-3)]">Deal Details</span>
        </nav>

        {/* Page header */}
        <div className="flex items-center justify-between animate-slide-up delay-1">
          <div>
            <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)] font-medium">
              Transaction
            </p>
            <h1 className="mt-1 text-[28px] font-semibold tracking-[-0.025em] text-[var(--ink)]">Deal Details</h1>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${status.bg} ${status.text}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
            {status.label}
          </span>
        </div>

        {/* Status Timeline */}
        {tx.status !== "cancelled" && (
          <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-5 animate-slide-up delay-2">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)] font-medium mb-4">
              Progress
            </p>
            <div className="flex items-center justify-between">
              {timelineSteps.map((step, i) => {
                const state = getStepState(step.key, tx.status);
                const Icon = step.icon;
                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center gap-1.5">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                          state === "done"
                            ? "bg-[var(--forest)] text-white"
                            : state === "active"
                            ? "bg-[var(--forest)]/15 text-[var(--forest)] border border-[var(--forest)]/40 ring-4 ring-[var(--forest-tint)]"
                            : "bg-[var(--paper-2)] text-[var(--ink-4)] border border-[var(--line)]"
                        }`}
                      >
                        {state === "done" ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Icon className="h-4 w-4" />
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium ${
                          state === "done" || state === "active"
                            ? "text-[var(--ink-3)]"
                            : "text-[var(--ink-4)]"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {i < timelineSteps.length - 1 && (
                      <div className="flex-1 mx-2 mb-5">
                        <div
                          className={`h-0.5 rounded-full ${
                            getStepState(timelineSteps[i + 1].key, tx.status) === "done" ||
                            getStepState(timelineSteps[i + 1].key, tx.status) === "active"
                              ? "bg-[var(--forest)]"
                              : "bg-[var(--paper-3)]"
                          }`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Main info cards */}
        <div className="grid gap-4 animate-slide-up delay-3">
          {/* Scrap Item card */}
          <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-5">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--forest-tint)] border border-[var(--forest)]/20">
                <Package className="h-4.5 w-4.5 text-[var(--forest)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)] font-medium">Scrap Item</p>
                <p className="mt-1.5 text-[15.5px] font-semibold tracking-[-0.015em] text-[var(--ink)]">{tx.scraps?.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-full bg-[var(--paper-2)] border border-[var(--line)] px-2 py-0.5 text-xs text-[var(--ink-3)]">
                    {tx.scraps?.category}
                  </span>
                  <span className="text-xs text-[var(--ink-4)]">
                    {tx.scraps?.quantity} {tx.scraps?.unit}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Price + Counterpart row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Agreed Price */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-5">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--forest-tint)] border border-[var(--forest)]/20">
                  <IndianRupee className="h-4.5 w-4.5 text-[var(--forest)]" />
                </div>
                <div>
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)] font-medium">Agreed Price</p>
                  <p className="mt-1.5 text-[clamp(28px,3.6vw,40px)] font-semibold tracking-[-0.025em] tabular-nums text-[var(--ink)]">
                    {"\u20B9"}{tx.final_price.toLocaleString("en-IN")}
                  </p>
                </div>
              </div>
            </div>

            {/* Counterpart */}
            <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-5">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--forest-tint)] border border-[var(--forest)]/20">
                  <User className="h-4.5 w-4.5 text-[var(--forest)]" />
                </div>
                <div className="min-w-0">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)] font-medium">{counterpartLabel}</p>
                  <p className="mt-1.5 font-medium text-[var(--ink)] truncate">{counterpart?.name}</p>
                  <p className="text-xs text-[var(--ink-4)] truncate">{counterpart?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Pickup Date */}
          {tx.pickup_date && (
            <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-5">
              <div className="flex items-start gap-3.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--paper-2)] border border-[var(--line)]">
                  <CalendarDays className="h-4.5 w-4.5 text-[var(--ink-3)]" />
                </div>
                <div>
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)] font-medium">Pickup Date</p>
                  <p className="mt-1.5 font-medium text-[var(--ink)]">
                    {new Date(tx.pickup_date).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* OTP Section */}
        {tx.status !== "completed" && tx.status !== "cancelled" && (
          <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-5 space-y-4 animate-slide-up delay-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--forest-tint)]">
                <ShieldCheck className="h-4 w-4 text-[var(--forest)]" />
              </div>
              <div>
                <h3 className="text-[15.5px] font-semibold tracking-[-0.015em] text-[var(--ink)]">Pickup Verification</h3>
                <p className="text-sm text-[var(--ink-4)]">OTP-based confirmation</p>
              </div>
            </div>

            {isProducer && tx.pickup_otp && (
              <div className="space-y-3">
                <p className="text-base text-[var(--ink-3)]">
                  Share this OTP with the recycler at pickup. They will use it to confirm collection.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 rounded-[var(--radius-md)] border border-[var(--forest)]/20 bg-[var(--forest-tint)] px-5 py-4 text-center">
                    <p className="text-2xl font-mono font-bold tracking-[0.3em] text-[var(--forest)]">
                      {showOtp ? tx.pickup_otp : "\u2022 \u2022 \u2022 \u2022 \u2022 \u2022"}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowOtp(!showOtp)}
                    className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper-2)] text-[var(--ink-3)] hover:bg-[var(--paper-3)] hover:text-[var(--ink)] transition-all"
                  >
                    {showOtp ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {isRecycler && (
              <div className="space-y-3">
                <p className="text-base text-[var(--ink-3)]">
                  Ask the producer for the 6-digit OTP. Enter it below to confirm pickup and complete the deal.
                </p>
                <div className="flex gap-3">
                  <input
                    value={otpInput}
                    onChange={(e) => setOtpInput(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="h-11 flex-1 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] px-4 text-center font-mono text-lg tracking-widest text-[var(--ink)] placeholder:text-[var(--ink-4)] outline-none transition-colors focus:border-[var(--forest)] focus:ring-1 focus:ring-[var(--forest)]/20"
                  />
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={otpInput.length !== 6 || otpLoading}
                    className="h-11"
                  >
                    {otpLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify"}
                  </Button>
                </div>
              </div>
            )}

            {tx.otp_verified_at && (
              <div className="flex items-center gap-2 rounded-[var(--radius-sm)] bg-[var(--forest-tint)] border border-[var(--forest)]/20 px-3 py-2.5 text-base text-[var(--forest)]">
                <ShieldCheck className="h-4 w-4" />
                Pickup confirmed on{" "}
                {new Date(tx.otp_verified_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </div>
            )}
          </div>
        )}

        {/* Completed OTP confirmation (shown when deal is completed) */}
        {tx.status === "completed" && tx.otp_verified_at && (
          <div className="rounded-[var(--radius-lg)] border border-[var(--forest)]/20 bg-[var(--forest-tint)] p-4 animate-slide-up delay-4">
            <div className="flex items-center gap-2.5 text-base text-[var(--forest)]">
              <ShieldCheck className="h-4.5 w-4.5" />
              <span className="font-medium">
                Pickup verified on{" "}
                {new Date(tx.otp_verified_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        )}

        {/* Chat button */}
        <div className="animate-slide-up delay-5">
          <Link href={`/transactions/${tx.id}/chat`}>
            <Button className="w-full h-12">
              <MessageCircle className="h-4 w-4" />
              Open Chat
            </Button>
          </Link>
        </div>

        {/* Transaction metadata */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-[var(--ink-4)] pt-2 animate-fade-in delay-6">
          <span className="break-all">Transaction ID: {tx.id.slice(0, 8)}...</span>
          <span>
            Created{" "}
            {new Date(tx.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
