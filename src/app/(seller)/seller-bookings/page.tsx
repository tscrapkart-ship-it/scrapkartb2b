import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Gavel, IndianRupee, CalendarDays, User, ChevronRight, Plus, MessageSquare } from "lucide-react";

const statusConfig: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  pending: { bg: "bg-[var(--warning)]/10", text: "text-[var(--warning)]", dot: "bg-[var(--warning)]", border: "border-[var(--warning)]/30" },
  accepted: { bg: "bg-[var(--forest-tint)]", text: "text-[var(--forest)]", dot: "bg-[var(--forest)]", border: "border-[var(--forest)]/30" },
  rejected: { bg: "bg-[var(--danger)]/10", text: "text-[var(--danger)]", dot: "bg-[var(--danger)]", border: "border-[var(--danger)]/30" },
  withdrawn: { bg: "bg-[var(--paper-2)]", text: "text-[var(--ink-4)]", dot: "bg-[var(--ink-4)]", border: "border-[var(--line)]" },
};

async function getIncomingBids() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("listing_bids")
    .select("*, scraps!inner(id, title, category, quantity, unit, seller_id), users!listing_bids_recycler_id_fkey(name, email)")
    .eq("scraps.seller_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function SellerBidsPage() {
  const bids = await getIncomingBids();
  const pendingCount = bids.filter((b) => b.status === "pending").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[28px] font-semibold tracking-[-0.025em] text-[var(--ink)]">Incoming Bids</h1>
          <p className="mt-1 text-sm text-[var(--ink-3)] sm:text-base">
            Review and respond to bids from recyclers
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--forest-tint)] border border-[var(--forest)]/20 px-3 py-1.5 text-sm font-semibold text-[var(--forest)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--forest)] animate-pulse" />
            {pendingCount} pending
          </span>
        )}
      </div>

      {bids.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--line)] bg-[var(--paper)]/50 py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--paper-2)] border border-[var(--line)] mb-4">
            <Gavel className="h-7 w-7 text-[var(--ink-4)]" />
          </div>
          <p className="text-xl font-semibold text-[var(--ink)]">No bids yet</p>
          <p className="mt-1 text-base text-[var(--ink-3)] max-w-xs text-center">
            Bids will appear here when recyclers submit offers on your listings.
          </p>
          <Link
            href="/scraps/new"
            className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--forest)] px-5 py-2.5 text-base font-semibold text-white transition-all hover:bg-[var(--forest-2)] shadow-[var(--shadow-1)]"
          >
            <Plus className="h-4 w-4" />
            Post a Listing
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bids.map((bid, i) => {
            const scrap = bid.scraps as {
              id: string;
              title: string;
              category: string;
              quantity: number;
              unit: string;
            } | null;
            const recycler = bid.users as { name: string; email: string } | null;
            const sc = statusConfig[bid.status] ?? statusConfig.withdrawn;

            return (
              <Link key={bid.id} href={`/marketplace/${scrap?.id ?? ""}`}>
                <div className={`animate-slide-up delay-${Math.min(i + 1, 6)} group rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-3 sm:p-5 transition-all hover:border-[var(--forest)]/30 hover:bg-[var(--paper-2)] cursor-pointer shadow-[var(--shadow-1)]`}>
                  <div className="flex items-start justify-between gap-2 sm:gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--forest-tint)] px-2.5 py-0.5 text-xs font-medium text-[var(--forest)]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--forest)]" />
                          {scrap?.category}
                        </span>
                      </div>
                      <p className="text-[15.5px] font-semibold tracking-[-0.015em] text-[var(--ink)] truncate group-hover:text-[var(--forest)] transition-colors sm:text-base">
                        {scrap?.title}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[var(--ink-4)] mt-1 min-w-0">
                        <User className="h-3 w-3 shrink-0" />
                        <span className="text-[var(--ink-3)] truncate">{recycler?.name ?? "Recycler"}</span>
                        {recycler?.email && (
                          <span className="text-[var(--ink-4)] truncate hidden sm:inline">— {recycler.email}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge className={`${sc.bg} ${sc.text} border ${sc.border}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${sc.dot} mr-1`} />
                        {bid.status}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-[var(--ink-4)] group-hover:text-[var(--forest)] transition-colors" />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 pt-3 border-t border-[var(--line-2)]">
                    <div className="flex items-center gap-1.5 text-[var(--ink)]">
                      <IndianRupee className="h-3.5 w-3.5" />
                      <span className="text-[20px] font-semibold tabular-nums text-[var(--ink)]">
                        ₹{bid.offered_price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-xs sm:text-sm text-[var(--ink-4)] font-normal">offered</span>
                    </div>
                    {bid.estimated_pickup_date && (
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[var(--ink-4)]">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(bid.estimated_pickup_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                    )}
                    <span className="text-xs sm:text-sm text-[var(--ink-4)] ml-auto">
                      {new Date(bid.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {bid.message && (
                    <div className="flex items-start gap-2 mt-3 pt-3 border-t border-[var(--line-2)]">
                      <MessageSquare className="h-3.5 w-3.5 text-[var(--ink-4)] shrink-0 mt-0.5" />
                      <p className="text-sm text-[var(--ink-3)] italic truncate">
                        &ldquo;{bid.message}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
