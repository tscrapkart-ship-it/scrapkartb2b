import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Gavel, IndianRupee, CalendarDays, ArrowRight, ChevronRight } from "lucide-react";

const statusConfig: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  pending: { bg: "bg-[var(--warning)]/10", text: "text-[var(--warning)]", dot: "bg-[var(--warning)]", border: "border-[var(--warning)]/20" },
  accepted: { bg: "bg-[var(--forest-tint)]", text: "text-[var(--forest)]", dot: "bg-[var(--forest)]", border: "border-[var(--forest)]/20" },
  rejected: { bg: "bg-[var(--danger)]/10", text: "text-[var(--danger)]", dot: "bg-[var(--danger)]", border: "border-[var(--danger)]/20" },
  withdrawn: { bg: "bg-[var(--paper-2)]", text: "text-[var(--ink-4)]", dot: "bg-[var(--ink-4)]", border: "border-[var(--line)]" },
};

async function getMyBids() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("listing_bids")
    .select("*, scraps(id, title, category, quantity, unit, city, state, seller_id, companies(name))")
    .eq("recycler_id", user.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function MyBidsPage() {
  const bids = await getMyBids();
  const pendingCount = bids.filter((b) => b.status === "pending").length;
  const acceptedCount = bids.filter((b) => b.status === "accepted").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-[28px] font-semibold tracking-[-0.025em] text-[var(--ink)]">My Bids</h1>
          <p className="mt-1 text-sm sm:text-base text-[var(--ink-3)]">
            Track all bids you&apos;ve submitted across listings
          </p>
        </div>
        {pendingCount > 0 && (
          <span className="shrink-0 inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--warning)]/10 border border-[var(--warning)]/20 px-3 py-1.5 text-xs font-semibold text-[var(--warning)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--warning)] animate-pulse" />
            {pendingCount} pending
          </span>
        )}
      </div>

      {/* Summary stats */}
      {bids.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Total Bids", value: bids.length, color: "text-[var(--ink)]", border: "border-[var(--line)]" },
            { label: "Pending", value: pendingCount, color: "text-[var(--warning)]", border: pendingCount > 0 ? "border-[var(--warning)]/20" : "border-[var(--line)]" },
            { label: "Accepted", value: acceptedCount, color: "text-[var(--forest)]", border: acceptedCount > 0 ? "border-[var(--forest)]/20" : "border-[var(--line)]" },
          ].map((stat, i) => (
            <div key={stat.label} className={`animate-scale-in delay-${i + 1} rounded-[var(--radius-lg)] border bg-[var(--paper)] p-4 text-center ${stat.border}`}>
              <p className={`text-3xl font-semibold tabular-nums ${stat.color}`}>{stat.value}</p>
              <p className="text-sm text-[var(--ink-4)] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {bids.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--line)] bg-[var(--paper)]/50 py-16">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--paper-2)] border border-[var(--line)]">
            <Gavel className="h-7 w-7 text-[var(--ink-4)]" />
          </div>
          <p className="text-xl font-semibold text-[var(--ink-2)]">No bids yet</p>
          <p className="mt-1 text-base text-[var(--ink-4)] max-w-xs text-center">
            Browse the marketplace and submit bids on listings you&apos;re interested in.
          </p>
          <Link
            href="/marketplace"
            className="mt-6 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-[var(--forest)] px-5 py-2.5 text-base font-semibold text-white transition-all hover:bg-[var(--forest-2)] shadow-[var(--shadow-1)]"
          >
            Browse Marketplace
            <ArrowRight className="h-4 w-4" />
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
              city: string | null;
              state: string | null;
              companies: { name: string } | null;
            } | null;
            const sc = statusConfig[bid.status] ?? statusConfig.withdrawn;

            return (
              <Link key={bid.id} href={`/marketplace/${scrap?.id ?? ""}`}>
                <div className={`animate-slide-up delay-${Math.min(i + 1, 6)} group rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-4 sm:p-5 transition-all hover:border-[var(--forest)]/30 hover:bg-[var(--paper-2)] cursor-pointer`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--forest-tint)] px-2.5 py-0.5 text-sm font-medium text-[var(--forest)] shrink-0">
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--forest)]" />
                          {scrap?.category}
                        </span>
                        {scrap?.companies?.name && (
                          <span className="text-sm text-[var(--ink-4)] truncate max-w-[180px]">
                            by {scrap.companies.name}
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-[var(--ink)] truncate group-hover:text-[var(--forest)] transition-colors">
                        {scrap?.title ?? "Unknown listing"}
                      </p>
                      {scrap?.city && (
                        <p className="text-sm text-[var(--ink-4)] mt-0.5">
                          {scrap.city}{scrap.state ? `, ${scrap.state}` : ""}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <Badge className={`${sc.bg} ${sc.text} border ${sc.border}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${sc.dot} mr-1`} />
                        {bid.status}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-[var(--ink-4)] group-hover:text-[var(--forest)] transition-colors" />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-3 pt-3 border-t border-[var(--line-2)]">
                    <div className="flex items-center gap-1.5 text-[var(--ink)]">
                      <IndianRupee className="h-3.5 w-3.5" />
                      <span className="font-semibold tabular-nums">
                        ₹{bid.offered_price.toLocaleString("en-IN")}
                      </span>
                      <span className="text-sm text-[var(--ink-4)] font-normal">your offer</span>
                    </div>
                    {bid.estimated_pickup_date && (
                      <div className="flex items-center gap-1.5 text-sm text-[var(--ink-4)]">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {new Date(bid.estimated_pickup_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </div>
                    )}
                    <span className="text-sm text-[var(--ink-4)] ml-auto">
                      {new Date(bid.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
