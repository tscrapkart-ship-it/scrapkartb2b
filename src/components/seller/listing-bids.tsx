"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Gavel,
  IndianRupee,
  CalendarDays,
  MessageSquare,
  User,
  Check,
  X,
  Loader2,
  Reply,
} from "lucide-react";
import { toast } from "sonner";

interface Bid {
  id: string;
  offered_price: number;
  estimated_pickup_date: string | null;
  message: string | null;
  seller_response_message: string | null;
  status: string;
  created_at: string;
  recycler_id: string;
  users: { name: string; email: string } | null;
}

const statusConfig: Record<string, string> = {
  pending: "bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20",
  accepted: "bg-[var(--forest-tint)] text-[var(--forest)] border border-[var(--forest)]/20",
  rejected: "bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20",
  withdrawn: "bg-[var(--paper-2)] text-[var(--ink-3)] border border-[var(--line)]",
};

type ActionDialog = { bid: Bid; action: "accept" | "reject" } | null;

export function BidsList({
  listingId,
  listingStatus,
  highlightBidId,
}: {
  listingId: string;
  listingStatus: string;
  highlightBidId?: string;
}) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [dialog, setDialog] = useState<ActionDialog>(null);
  const [responseMessage, setResponseMessage] = useState("");

  const fetchBids = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("listing_bids")
      .select("*, users!listing_bids_recycler_id_fkey(name, email)")
      .eq("listing_id", listingId)
      .order("created_at", { ascending: false });
    setBids((data as Bid[]) ?? []);
    setLoading(false);
  }, [listingId]);

  useEffect(() => {
    fetchBids();
  }, [fetchBids]);

  function openAccept(bid: Bid) {
    setResponseMessage("");
    setDialog({ bid, action: "accept" });
  }

  function openReject(bid: Bid) {
    setResponseMessage("");
    setDialog({ bid, action: "reject" });
  }

  async function confirmAction() {
    if (!dialog) return;
    const { bid, action } = dialog;
    setActionLoading(true);
    const supabase = createClient();
    const trimmedMsg = responseMessage.trim() || null;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const now = new Date().toISOString();

      if (action === "accept") {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const [acceptRes] = await Promise.all([
          // Accept this bid (with response message)
          supabase
            .from("listing_bids")
            .update({
              status: "accepted",
              responded_at: now,
              seller_response_message: trimmedMsg,
            })
            .eq("id", bid.id),
          // Reject all other pending bids (no response message — they'll see a generic "another bid was selected")
          supabase
            .from("listing_bids")
            .update({ status: "rejected", responded_at: now })
            .eq("listing_id", listingId)
            .eq("status", "pending")
            .neq("id", bid.id),
          // Mark listing as matched
          supabase
            .from("scraps")
            .update({ status: "matched", matched_recycler_id: bid.recycler_id })
            .eq("id", listingId),
          // Create the transaction
          supabase.from("transactions").insert({
            listing_id: listingId,
            bid_id: bid.id,
            producer_id: user.id,
            recycler_id: bid.recycler_id,
            final_price: bid.offered_price,
            pickup_date: bid.estimated_pickup_date,
            pickup_otp: otp,
            status: "scheduled",
          }),
        ]);
        if (acceptRes.error) throw acceptRes.error;
        toast.success("Bid accepted. A deal has been created.");
      } else {
        const { error } = await supabase
          .from("listing_bids")
          .update({
            status: "rejected",
            responded_at: now,
            seller_response_message: trimmedMsg,
          })
          .eq("id", bid.id);
        if (error) throw error;
        toast.success("Bid declined.");
      }

      setDialog(null);
      setResponseMessage("");
      await fetchBids();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed.");
    }
    setActionLoading(false);
  }

  const pendingCount = bids.filter((b) => b.status === "pending").length;

  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Gavel className="h-4 w-4 text-[var(--forest)]" />
            <h3 className="font-semibold text-[var(--ink)]">Bids Received</h3>
          </div>
          {pendingCount > 0 && (
            <span className="rounded-full bg-[var(--forest-tint)] px-2.5 py-0.5 text-xs font-semibold text-[var(--forest)]">
              {pendingCount} pending
            </span>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 text-[var(--ink-3)]">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Loading bids...
          </div>
        ) : bids.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--paper-2)] mb-3">
              <Gavel className="h-6 w-6 text-[var(--ink-4)]" />
            </div>
            <p className="text-base text-[var(--ink-3)]">No bids yet</p>
            <p className="text-sm text-[var(--ink-4)] mt-1">
              Recyclers will see your listing and submit bids.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bids.map((bid) => {
              const isHighlighted = highlightBidId === bid.id;
              return (
                <div
                  key={bid.id}
                  className={`rounded-[var(--radius-lg)] border bg-[var(--paper)] p-4 space-y-3 transition-colors ${
                    isHighlighted
                      ? "border-[var(--forest)]/40 ring-2 ring-[var(--forest)]/15 bg-[var(--forest-tint)]/30"
                      : "border-[var(--line)]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--forest-tint)] text-xs font-bold text-[var(--forest)]">
                        {bid.users?.name?.charAt(0) ?? "R"}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <User className="h-3 w-3 text-[var(--ink-3)]" />
                          <span className="text-base font-medium text-[var(--ink)]">
                            {bid.users?.name ?? "Recycler"}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--ink-3)] truncate max-w-[180px] sm:max-w-none">{bid.users?.email}</p>
                      </div>
                    </div>
                    <Badge className={statusConfig[bid.status] ?? "bg-[var(--paper-2)] text-[var(--ink-3)]"}>
                      {bid.status}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                    <div className="flex items-center gap-1.5">
                      <IndianRupee className="h-3.5 w-3.5 text-[var(--ink)]" />
                      <span className="text-[20px] sm:text-[22px] font-semibold tabular-nums text-[var(--ink)]">
                        ₹{bid.offered_price.toLocaleString("en-IN")}
                      </span>
                    </div>
                    {bid.estimated_pickup_date && (
                      <div className="flex items-center gap-1.5 text-[var(--ink-3)]">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>
                          {new Date(bid.estimated_pickup_date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {bid.message && (
                    <div className="flex items-start gap-2 rounded-[var(--radius-sm)] bg-[var(--paper-2)] px-3 py-2">
                      <MessageSquare className="h-3.5 w-3.5 text-[var(--ink-3)] shrink-0 mt-0.5" />
                      <p className="text-sm text-[var(--ink-2)] leading-relaxed">{bid.message}</p>
                    </div>
                  )}

                  {bid.seller_response_message && bid.status !== "pending" && (
                    <div className="flex items-start gap-2 rounded-[var(--radius-sm)] border border-[var(--forest)]/15 bg-[var(--forest-tint)] px-3 py-2">
                      <Reply className="h-3.5 w-3.5 text-[var(--forest)] shrink-0 mt-0.5" />
                      <div>
                        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--forest)]/85 mb-0.5">
                          Your response
                        </p>
                        <p className="text-sm text-[var(--ink-2)] leading-relaxed">
                          {bid.seller_response_message}
                        </p>
                      </div>
                    </div>
                  )}

                  {bid.status === "pending" && listingStatus === "live" && (
                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        onClick={() => openAccept(bid)}
                        disabled={actionLoading}
                        className="flex-1 bg-[var(--forest-tint)] text-[var(--forest)] border border-[var(--forest)]/25 hover:bg-[var(--forest)]/15 hover:border-[var(--forest)]/40 hover:translate-y-0 shadow-none"
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openReject(bid)}
                        disabled={actionLoading}
                        className="flex-1 border-[var(--danger)]/30 text-[var(--danger)] hover:bg-[var(--danger)]/10"
                      >
                        <X className="h-3.5 w-3.5 mr-1" />
                        Decline
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>

      <Dialog open={dialog !== null} onOpenChange={(open) => !open && !actionLoading && setDialog(null)}>
        <DialogContent className="border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[var(--ink)]">
              {dialog?.action === "accept" ? "Accept this bid?" : "Decline this bid?"}
            </DialogTitle>
            <p className="text-sm text-[var(--ink-3)] mt-1">
              {dialog?.action === "accept" ? (
                <>
                  Accepting locks in <strong>₹{dialog.bid.offered_price.toLocaleString("en-IN")}</strong> from{" "}
                  <strong>{dialog.bid.users?.name ?? "this recycler"}</strong> and creates a deal. All other pending bids
                  on this listing will be auto-declined.
                </>
              ) : (
                <>
                  This will reject{" "}
                  <strong>{dialog?.bid.users?.name ?? "this recycler"}&apos;s</strong>{" "}
                  bid of <strong>₹{dialog?.bid.offered_price.toLocaleString("en-IN")}</strong>. They&apos;ll be notified
                  but can&apos;t bid again on this listing.
                </>
              )}
            </p>
          </DialogHeader>

          <div className="space-y-2 pt-2">
            <Label className="text-[var(--ink-2)] flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" />
              Add a short message <span className="text-[var(--ink-3)]">(optional)</span>
            </Label>
            <textarea
              value={responseMessage}
              onChange={(e) => setResponseMessage(e.target.value)}
              rows={3}
              maxLength={280}
              placeholder={
                dialog?.action === "accept"
                  ? "e.g., Please reach the warehouse before 3 PM for pickup."
                  : "e.g., Thanks for the offer — we went with a higher bid."
              }
              className="flex w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--paper-2)] px-3 py-2 text-sm text-[var(--ink)] placeholder:text-[var(--ink-4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--forest)]/50"
            />
            <p className="text-xs text-[var(--ink-4)] text-right">{responseMessage.length}/280</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialog(null)}
              disabled={actionLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmAction}
              disabled={actionLoading}
              className={`flex-1 ${
                dialog?.action === "accept"
                  ? "bg-[var(--forest)] hover:bg-[var(--forest-2)] text-white"
                  : "bg-[var(--danger)] hover:bg-[var(--danger)]/90 text-white"
              }`}
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : dialog?.action === "accept" ? (
                <>
                  <Check className="h-4 w-4 mr-1.5" />
                  Confirm Accept
                </>
              ) : (
                <>
                  <X className="h-4 w-4 mr-1.5" />
                  Confirm Decline
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
