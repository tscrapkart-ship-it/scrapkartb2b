"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Gavel, CheckCircle, IndianRupee, CalendarDays, MessageSquare, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SubmitBidDialogProps {
  listingId: string;
  listingTitle: string;
  existingBid?: {
    id: string;
    offered_price: number;
    status: string;
    estimated_pickup_date: string | null;
    message: string | null;
  } | null;
  listingStatus: string;
}

export function SubmitBidDialog({
  listingId,
  listingTitle,
  existingBid,
  listingStatus,
}: SubmitBidDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [offeredPrice, setOfferedPrice] = useState(
    existingBid?.offered_price?.toString() ?? ""
  );
  const [pickupDate, setPickupDate] = useState(
    existingBid?.estimated_pickup_date ?? ""
  );
  const [message, setMessage] = useState(existingBid?.message ?? "");

  const isWithdrawn = existingBid?.status === "withdrawn";
  const hasPendingBid = existingBid?.status === "pending";
  const isAccepted = existingBid?.status === "accepted";
  const isRejected = existingBid?.status === "rejected";
  const isLive = listingStatus === "live";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!offeredPrice || parseFloat(offeredPrice) <= 0) return;
    setLoading(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in to submit a bid.");
      setLoading(false);
      return;
    }

    // Upsert — works for both new bids and revisions on withdrawn bids
    const { error } = await supabase.from("listing_bids").upsert(
      {
        listing_id: listingId,
        recycler_id: user.id,
        offered_price: parseFloat(offeredPrice),
        estimated_pickup_date: pickupDate || null,
        message: message || null,
        status: "pending",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "listing_id,recycler_id" }
    );

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    setSuccess(true);
    toast.success("Bid submitted! The producer will review it shortly.");
  }

  async function handleWithdraw() {
    if (!existingBid) return;
    setWithdrawing(true);

    const supabase = createClient();
    const { error } = await supabase
      .from("listing_bids")
      .update({ status: "withdrawn", updated_at: new Date().toISOString() })
      .eq("id", existingBid.id);

    setWithdrawing(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Bid withdrawn.");
    setOpen(false);
    router.refresh();
  }

  // If listing is no longer live
  if (!isLive) {
    return (
      <Button
        disabled
        className="w-full bg-[var(--paper-2)] text-[var(--ink-4)] border border-[var(--line)]"
        size="lg"
      >
        {listingStatus === "matched" ? "Bid Accepted by Another Recycler" : "Listing Closed"}
      </Button>
    );
  }

  // If user's bid was accepted
  if (isAccepted) {
    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--forest)]/30 bg-[var(--forest-tint)] p-4 text-center">
        <CheckCircle className="h-6 w-6 text-[var(--forest)] mx-auto mb-2" />
        <p className="font-semibold text-[var(--forest)]">Your bid was accepted!</p>
        <p className="text-sm text-[var(--ink-3)] mt-1">Check your Deals section for next steps.</p>
      </div>
    );
  }

  // If user's bid was rejected
  if (isRejected) {
    return (
      <div className="rounded-[var(--radius-md)] border border-[var(--danger)]/30 bg-[var(--danger)]/10 p-4 text-center">
        <p className="font-medium text-[var(--danger)]">Your bid was not accepted.</p>
        <p className="text-sm text-[var(--ink-3)] mt-1">The producer chose a different recycler.</p>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            className="w-full bg-[var(--forest)] text-white hover:bg-[var(--forest-2)] shadow-[var(--shadow-1)] font-semibold"
            size="lg"
          />
        }
      >
        <Gavel className="mr-2 h-4 w-4" />
        {hasPendingBid ? "Revise Your Bid" : isWithdrawn ? "Re-submit Bid" : "Submit Bid"}
      </DialogTrigger>

      <DialogContent className="border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[var(--ink)]">
            {hasPendingBid ? "Revise Bid" : "Submit a Bid"}
          </DialogTitle>
          <p className="text-base text-[var(--ink-3)] mt-1">
            For: <span className="text-[var(--forest)]">{listingTitle}</span>
          </p>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--forest-tint)] mx-auto">
              <CheckCircle className="h-7 w-7 text-[var(--forest)]" />
            </div>
            <h3 className="font-semibold text-[var(--ink)]">Bid Submitted!</h3>
            <p className="text-base text-[var(--ink-3)]">
              The producer will review your offer. You&apos;ll be notified on acceptance.
            </p>
            <Button
              onClick={() => { setOpen(false); setSuccess(false); router.refresh(); }}
              className="bg-[var(--forest)] text-white hover:bg-[var(--forest-2)] shadow-[var(--shadow-1)]"
            >
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 pt-2">
            {hasPendingBid && (
              <div className="rounded-[var(--radius-sm)] border border-[var(--warning)]/30 bg-[var(--warning)]/10 px-3 py-2 text-sm text-[var(--warning)]">
                You already have a pending bid of ₹{existingBid?.offered_price?.toLocaleString("en-IN")}. You can revise it below.
              </div>
            )}

            <div className="space-y-2">
              <Label className="text-[var(--ink-2)] flex items-center gap-1.5">
                <IndianRupee className="h-3.5 w-3.5" />
                Your Offer Price (₹) *
              </Label>
              <Input
                type="number"
                min="1"
                step="1"
                value={offeredPrice}
                onChange={(e) => setOfferedPrice(e.target.value)}
                placeholder="e.g., 25000"
                required
                className="border-[var(--line)] bg-[var(--paper-2)] text-[var(--ink)] tabular-nums placeholder:text-[var(--ink-4)] focus-visible:ring-[var(--forest)]/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[var(--ink-2)] flex items-center gap-1.5">
                <CalendarDays className="h-3.5 w-3.5" />
                Estimated Pickup Date <span className="text-[var(--ink-3)]">(optional)</span>
              </Label>
              <Input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="border-[var(--line)] bg-[var(--paper-2)] text-[var(--ink)] focus-visible:ring-[var(--forest)]/50"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[var(--ink-2)] flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" />
                Message <span className="text-[var(--ink-3)]">(optional)</span>
              </Label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                placeholder="Tell the producer why they should choose you..."
                className="flex w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--paper-2)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--forest)]/50"
              />
            </div>

            <div className="flex gap-3 pt-1">
              {hasPendingBid && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleWithdraw}
                  disabled={loading || withdrawing}
                  className="border-[var(--danger)]/30 text-[var(--danger)] hover:bg-[var(--danger)]/10 hover:border-[var(--danger)]/30"
                >
                  {withdrawing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Withdraw"
                  )}
                </Button>
              )}
              <Button
                type="submit"
                disabled={loading || withdrawing || !offeredPrice}
                className="flex-1 bg-[var(--forest)] text-white font-semibold hover:bg-[var(--forest-2)] shadow-[var(--shadow-1)] disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : hasPendingBid ? "Update Bid" : "Submit Bid"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
