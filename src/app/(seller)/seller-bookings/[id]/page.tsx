import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BidsList } from "@/components/seller/listing-bids";
import {
  ChevronLeft,
  Package,
  MapPin,
  Scale,
  Tag,
  IndianRupee,
  CalendarDays,
  MessageSquare,
  User,
  ArrowUpRight,
} from "lucide-react";

const listingStatusConfig: Record<string, { label: string; class: string }> = {
  live: { label: "Accepting Bids", class: "bg-[var(--forest-tint)] text-[var(--forest)] border border-[var(--forest)]/20" },
  matched: { label: "Bid Accepted", class: "bg-[var(--info)]/10 text-[var(--info)] border border-[var(--info)]/20" },
  picked: { label: "Pickup Scheduled", class: "bg-[var(--info)]/10 text-[var(--info)] border border-[var(--info)]/20" },
  completed: { label: "Completed", class: "bg-[var(--paper-2)] text-[var(--ink-4)] border border-[var(--line)]" },
  cancelled: { label: "Cancelled", class: "bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20" },
};

const bidStatusConfig: Record<string, string> = {
  pending: "bg-[var(--warning)]/10 text-[var(--warning)] border border-[var(--warning)]/20",
  accepted: "bg-[var(--forest-tint)] text-[var(--forest)] border border-[var(--forest)]/20",
  rejected: "bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/20",
  withdrawn: "bg-[var(--paper-2)] text-[var(--ink-3)] border border-[var(--line)]",
};

export default async function SellerBidDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch the bid + parent listing + recycler info. RLS ensures only the listing's
  // seller (or admin) can read this row.
  const { data: bid } = await supabase
    .from("listing_bids")
    .select(`
      *,
      scraps!inner(id, title, category, sub_type, quantity, unit, price, price_expectation, city, state, status, seller_id),
      users!listing_bids_recycler_id_fkey(name, email)
    `)
    .eq("id", id)
    .single();

  if (!bid) notFound();

  const scrap = bid.scraps as {
    id: string;
    title: string;
    category: string;
    sub_type: string | null;
    quantity: number;
    unit: string;
    price: number | null;
    price_expectation: number | null;
    city: string | null;
    state: string | null;
    status: string;
    seller_id: string;
  } | null;

  // Defensive guard: only the listing's seller should reach this page.
  // The "Producers can view bids on their listings" RLS policy already enforces this
  // at the DB level (returns no row otherwise), but check explicitly for clarity.
  if (!scrap || scrap.seller_id !== user.id) notFound();

  const recycler = bid.users as { name: string; email: string } | null;
  const listingStatusInfo = listingStatusConfig[scrap.status] ?? {
    label: scrap.status,
    class: "bg-[var(--paper-2)] text-[var(--ink-4)] border border-[var(--line)]",
  };
  const bidStatusClass = bidStatusConfig[bid.status] ?? bidStatusConfig.withdrawn;

  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
      {/* Back link */}
      <Link
        href="/seller-bookings"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--ink-3)] hover:text-[var(--forest)] transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        All incoming bids
      </Link>

      {/* Header — bid + listing context */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-5 sm:p-6 space-y-5 shadow-[var(--shadow-1)]">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] bg-[var(--forest-tint)] px-2.5 py-0.5 text-sm font-medium text-[var(--forest)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--forest)]" />
                {scrap.category}
                {scrap.sub_type ? ` — ${scrap.sub_type}` : ""}
              </span>
            </div>
            <h1 className="text-[clamp(24px,3vw,32px)] font-semibold tracking-[-0.025em] text-[var(--ink)] leading-tight">
              {scrap.title}
            </h1>
            <Link
              href={`/scraps/${scrap.id}/edit`}
              className="mt-2 inline-flex items-center gap-1 text-sm text-[var(--ink-3)] hover:text-[var(--forest)] transition-colors"
            >
              View / edit listing <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <Badge className={`shrink-0 ${listingStatusInfo.class}`}>
            {listingStatusInfo.label}
          </Badge>
        </div>

        {/* Quick listing facts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 rounded-[var(--radius-md)] bg-[var(--paper-2)] border border-[var(--line-2)] p-3 sm:p-4">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-[var(--ink-4)]">
              <Scale className="h-3 w-3" />
              <span className="font-mono text-[9.5px] uppercase tracking-[0.1em]">Quantity</span>
            </div>
            <p className="text-sm font-semibold text-[var(--ink)]">{scrap.quantity} {scrap.unit}</p>
          </div>
          {scrap.city && (
            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-[var(--ink-4)]">
                <MapPin className="h-3 w-3" />
                <span className="font-mono text-[9.5px] uppercase tracking-[0.1em]">Location</span>
              </div>
              <p className="text-sm font-medium text-[var(--ink-2)] truncate">
                {scrap.city}{scrap.state ? `, ${scrap.state}` : ""}
              </p>
            </div>
          )}
          {(scrap.price_expectation || scrap.price) && (
            <div className="space-y-0.5">
              <div className="flex items-center gap-1 text-[var(--ink-4)]">
                <Tag className="h-3 w-3" />
                <span className="font-mono text-[9.5px] uppercase tracking-[0.1em]">Asking</span>
              </div>
              <p className="text-sm font-semibold tabular-nums text-[var(--ink)]">
                ₹{(scrap.price_expectation ?? scrap.price ?? 0).toLocaleString("en-IN")}
              </p>
            </div>
          )}
          <div className="space-y-0.5">
            <div className="flex items-center gap-1 text-[var(--ink-4)]">
              <Package className="h-3 w-3" />
              <span className="font-mono text-[9.5px] uppercase tracking-[0.1em]">Status</span>
            </div>
            <p className="text-sm font-medium text-[var(--ink-2)] capitalize">{scrap.status}</p>
          </div>
        </div>
      </div>

      {/* Highlighted bid card */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-5 sm:p-6 space-y-4 shadow-[var(--shadow-1)]">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
              The bid you opened
            </span>
          </div>
          <Badge className={bidStatusClass}>{bid.status}</Badge>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--forest-tint)] text-base font-bold text-[var(--forest)]">
            {recycler?.name?.charAt(0) ?? "R"}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-[var(--ink-3)]" />
              <span className="font-semibold text-[var(--ink)] truncate">
                {recycler?.name ?? "Recycler"}
              </span>
            </div>
            <p className="text-sm text-[var(--ink-3)] truncate">{recycler?.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2 pt-1">
          <div className="flex items-baseline gap-1.5">
            <IndianRupee className="h-4 w-4 text-[var(--ink)] self-center" />
            <span className="text-3xl font-semibold tabular-nums text-[var(--ink)]">
              {bid.offered_price.toLocaleString("en-IN")}
            </span>
            <span className="text-sm text-[var(--ink-4)]">offered</span>
          </div>
          {bid.estimated_pickup_date && (
            <div className="flex items-center gap-1.5 text-sm text-[var(--ink-3)]">
              <CalendarDays className="h-3.5 w-3.5" />
              Pickup{" "}
              {new Date(bid.estimated_pickup_date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </div>
          )}
          <span className="text-sm text-[var(--ink-4)] ml-auto">
            Submitted{" "}
            {new Date(bid.created_at).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>

        {bid.message && (
          <div className="flex items-start gap-2 rounded-[var(--radius-md)] bg-[var(--paper-2)] border border-[var(--line-2)] px-4 py-3">
            <MessageSquare className="h-4 w-4 text-[var(--ink-3)] shrink-0 mt-0.5" />
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--ink-3)] mb-1">
                Recycler&apos;s note
              </p>
              <p className="text-sm text-[var(--ink-2)] leading-relaxed">{bid.message}</p>
            </div>
          </div>
        )}
      </div>

      {/* All bids on this listing — accept / decline live here */}
      <BidsList listingId={scrap.id} listingStatus={scrap.status} highlightBidId={bid.id} />
    </div>
  );
}
