"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Gavel,
  IndianRupee,
  CalendarDays,
  MessageSquare,
  User,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface Bid {
  id: string;
  offered_price: number;
  estimated_pickup_date: string | null;
  message: string | null;
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

export function BidsList({
  listingId,
  listingStatus,
}: {
  listingId: string;
  listingStatus: string;
}) {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

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

  async function handleAccept(bid: Bid) {
    setActionLoading(bid.id);
    const supabase = createClient();

    // Optimistic update — show accepted state immediately
    setBids((prev) =>
      prev.map((b) =>
        b.id === bid.id
          ? { ...b, status: "accepted" }
          : b.status === "pending"
            ? { ...b, status: "rejected" }
            : b
      )
    );

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Run all mutations in parallel where possible
      const now = new Date().toISOString();
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const [acceptRes, , ,] = await Promise.all([
        // Accept this bid
        supabase
          .from("listing_bids")
          .update({ status: "accepted", responded_at: now })
          .eq("id", bid.id),
        // Reject all other pending bids for this listing
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

      toast.success("Bid accepted! A deal has been created.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to accept bid.");
      // Rollback — refetch real state
      await fetchBids();
    }

    setActionLoading(null);
  }

  async function handleReject(bidId: string) {
    setActionLoading(bidId);
    const supabase = createClient();

    // Optimistic update
    setBids((prev) =>
      prev.map((b) => (b.id === bidId ? { ...b, status: "rejected" } : b))
    );

    const { error } = await supabase
      .from("listing_bids")
      .update({ status: "rejected", responded_at: new Date().toISOString() })
      .eq("id", bidId);

    if (error) {
      toast.error(error.message);
      // Rollback
      await fetchBids();
    } else {
      toast.success("Bid rejected.");
    }
    setActionLoading(null);
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
            {bids.map((bid) => (
              <div
                key={bid.id}
                className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-4 space-y-3"
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

                {/* Actions — only for pending bids when listing is still live */}
                {bid.status === "pending" && listingStatus === "live" && (
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      onClick={() => handleAccept(bid)}
                      disabled={actionLoading === bid.id}
                      className="flex-1 bg-[var(--forest-tint)] text-[var(--forest)] border border-[var(--forest)]/25 hover:bg-[var(--forest)]/15 hover:border-[var(--forest)]/40 hover:translate-y-0 shadow-none"
                    >
                      {actionLoading === bid.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <>
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Accept
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(bid.id)}
                      disabled={actionLoading === bid.id}
                      className="flex-1 border-[var(--danger)]/30 text-[var(--danger)] hover:bg-[var(--danger)]/10"
                    >
                      {actionLoading === bid.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <>
                          <X className="h-3.5 w-3.5 mr-1" />
                          Decline
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
