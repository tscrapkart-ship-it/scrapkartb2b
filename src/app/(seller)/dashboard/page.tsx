import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Package,
  Gavel,
  ArrowLeftRight,
  Building2,
  Plus,
  ArrowRight,
  TrendingUp,
  ChevronRight,
  Sparkles,
  AlertCircle,
} from "lucide-react";

async function getDashboardData() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const [company, listingsRes, pendingBidsRes, transactionsRes] =
    await Promise.all([
      supabase.from("companies").select("*").eq("owner_id", user.id).single(),
      supabase
        .from("scraps")
        .select("id, title, category, status, created_at", { count: "exact" })
        .eq("seller_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("listing_bids")
        .select("id, listing_id, offered_price, status, scraps!inner(seller_id)", { count: "exact" })
        .eq("scraps.seller_id", user.id)
        .eq("status", "pending"),
      supabase
        .from("transactions")
        .select("id, final_price, status", { count: "exact" })
        .eq("producer_id", user.id),
    ]);

  const listings = listingsRes.data ?? [];
  const totalListings = listingsRes.count ?? 0;
  const liveListings = listings.filter((l) => l.status === "live").length;
  const pendingBids = pendingBidsRes.count ?? 0;
  const totalEarned = (transactionsRes.data ?? [])
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + (t.final_price ?? 0), 0);

  return {
    company: company.data,
    totalListings,
    liveListings,
    pendingBids,
    totalEarned,
    recentListings: listings,
  };
}

const listingStatusConfig: Record<string, { text: string; dot: string }> = {
  live: { text: "text-[var(--forest)]", dot: "bg-[var(--forest)]" },
  matched: { text: "text-[var(--info)]", dot: "bg-[var(--info)]" },
  picked: { text: "text-[var(--info)]", dot: "bg-[var(--info)]" },
  completed: { text: "text-[var(--ink-4)]", dot: "bg-[var(--ink-4)]" },
  cancelled: { text: "text-[var(--danger)]", dot: "bg-[var(--danger)]" },
};

export default async function SellerDashboard() {
  const data = await getDashboardData();
  if (!data) return null;

  const { company, totalListings, liveListings, pendingBids, totalEarned, recentListings } = data;

  const stats = [
    {
      label: "Total Listings",
      value: totalListings,
      icon: Package,
      iconColor: "text-[var(--forest)]",
      iconBg: "bg-[var(--forest-tint)]",
      border: "border-[var(--forest)]/20",
    },
    {
      label: "Live Listings",
      value: liveListings,
      icon: Sparkles,
      iconColor: "text-[var(--forest)]",
      iconBg: "bg-[var(--forest-tint)]",
      border: "border-[var(--forest)]/20",
    },
    {
      label: "Pending Bids",
      value: pendingBids,
      icon: Gavel,
      iconColor: pendingBids > 0 ? "text-[var(--warning)]" : "text-[var(--ink-4)]",
      iconBg: pendingBids > 0 ? "bg-[var(--warning)]/10" : "bg-[var(--paper-2)]",
      border: pendingBids > 0 ? "border-[var(--warning)]/30" : "border-[var(--line)]",
      highlight: pendingBids > 0,
    },
    {
      label: "Total Earned",
      value: `₹${totalEarned.toLocaleString("en-IN")}`,
      icon: TrendingUp,
      iconColor: "text-[var(--forest)]",
      iconBg: "bg-[var(--forest-tint)]",
      border: "border-[var(--forest)]/20",
      isPrice: true,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-[28px] font-semibold tracking-[-0.025em] text-[var(--ink)]">
            Producer Dashboard
          </h1>
          <p className="mt-1 text-sm text-[var(--ink-3)] sm:text-base">
            Manage your scrap listings and track bids
          </p>
        </div>
        <Link href="/scraps/new" className="shrink-0">
          <Button className="h-10 px-4 sm:px-5">
            <Plus className="mr-2 h-4 w-4" />
            New Listing
          </Button>
        </Link>
      </div>

      {/* Company card */}
      {company ? (
        <div className="animate-slide-up delay-1 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-4 sm:p-5 transition-all hover:border-[var(--line)] shadow-[var(--shadow-1)]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--forest-tint)] border border-[var(--forest)]/20 sm:h-12 sm:w-12">
                {company.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={company.logo_url} alt="" className="h-full w-full rounded-[var(--radius-md)] object-cover" />
                ) : (
                  <Building2 className="h-5 w-5 text-[var(--forest)] sm:h-6 sm:w-6" />
                )}
              </div>
              <div className="min-w-0">
                <h3 className="text-[15.5px] font-semibold tracking-[-0.015em] text-[var(--ink)] sm:text-lg truncate">{company.name}</h3>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  {company.city && (
                    <p className="text-sm text-[var(--ink-3)] sm:text-base truncate">
                      {company.city}{company.state ? `, ${company.state}` : ""}
                    </p>
                  )}
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${
                      company.verification_status === "verified"
                        ? "bg-[var(--forest-tint)] text-[var(--forest)]"
                        : company.verification_status === "rejected"
                        ? "bg-[var(--danger)]/10 text-[var(--danger)]"
                        : "bg-[var(--warning)]/10 text-[var(--warning)]"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      company.verification_status === "verified"
                        ? "bg-[var(--forest)]"
                        : company.verification_status === "rejected"
                        ? "bg-[var(--danger)]"
                        : "bg-[var(--warning)]"
                    }`} />
                    {company.verification_status === "verified"
                      ? "Verified"
                      : company.verification_status === "rejected"
                      ? "Rejected"
                      : "Pending Review"}
                  </span>
                </div>
              </div>
            </div>
            <Link href="/company/edit" className="shrink-0">
              <Button variant="outline" size="sm">
                Edit Profile
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="animate-slide-up delay-1 rounded-[var(--radius-lg)] border border-[var(--forest)]/30 bg-[var(--forest-tint)] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--forest-tint)] border border-[var(--forest)]/20 sm:h-12 sm:w-12">
                <Building2 className="h-5 w-5 text-[var(--forest)] sm:h-6 sm:w-6" />
              </div>
              <div className="min-w-0">
                <h3 className="text-[15.5px] font-semibold tracking-[-0.015em] text-[var(--ink)] sm:text-lg">Set up your company profile</h3>
                <p className="text-sm text-[var(--ink-3)] mt-0.5 sm:text-base">Required before posting listings.</p>
              </div>
            </div>
            <Link href="/company/setup" className="shrink-0">
              <Button>
                Setup
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`animate-scale-in delay-${i + 2} rounded-[var(--radius-lg)] border bg-[var(--paper)] p-3 sm:p-5 transition-all shadow-[var(--shadow-1)] ${
                stat.highlight ? "border-[var(--warning)]/30 bg-[var(--warning)]/5" : stat.border
              }`}
            >
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)] font-medium">{stat.label}</p>
                <div className={`flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-[var(--radius-sm)] ${stat.iconBg}`}>
                  <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${stat.iconColor}`} />
                </div>
              </div>
              <p className={`text-xl sm:text-3xl font-semibold tabular-nums truncate ${stat.highlight ? "text-[var(--warning)]" : "text-[var(--ink)]"}`}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Pending bids alert */}
      {pendingBids > 0 && (
        <Link href="/seller-bookings" className="block animate-slide-up">
          <div className="group flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-[var(--warning)]/30 bg-[var(--warning)]/5 p-3 sm:p-4 transition-all hover:border-[var(--warning)]/50 cursor-pointer">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--warning)]/10">
                <AlertCircle className="h-5 w-5 text-[var(--warning)]" />
              </div>
              <div className="min-w-0">
                <p className="text-[15.5px] font-semibold tracking-[-0.015em] text-[var(--ink)] sm:text-base">
                  {pendingBids} pending bid{pendingBids !== 1 ? "s" : ""} awaiting your response
                </p>
                <p className="text-sm text-[var(--ink-3)] sm:text-base">Review and accept or decline</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-[var(--warning)] transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      )}

      {/* Recent listings */}
      {recentListings.length > 0 && (
        <div className="animate-slide-up delay-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)] font-medium">Recent Listings</h2>
            <Link href="/scraps" className="text-sm text-[var(--forest)] hover:text-[var(--forest-2)] transition-colors flex items-center gap-1">
              View all
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] divide-y divide-[var(--line-2)] overflow-hidden shadow-[var(--shadow-1)]">
            {recentListings.map((listing) => {
              const status = listingStatusConfig[listing.status] ?? { text: "text-[var(--ink-4)]", dot: "bg-[var(--ink-4)]" };
              return (
                <Link
                  key={listing.id}
                  href={`/marketplace/${listing.id}`}
                  className="group flex items-center justify-between gap-2 px-3 py-3 sm:px-5 sm:py-3.5 transition-colors hover:bg-[var(--paper-2)]"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    <span className="shrink-0 inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] px-2 py-1 text-xs font-medium bg-[var(--forest-tint)] text-[var(--forest)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--forest)]" />
                      {listing.category}
                    </span>
                    <p className="text-sm sm:text-base font-medium text-[var(--ink-2)] truncate group-hover:text-[var(--ink)] transition-colors">
                      {listing.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <span className={`hidden sm:flex items-center gap-1.5 text-xs font-medium ${status.text}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                      {listing.status}
                    </span>
                    <span className={`flex sm:hidden h-2 w-2 rounded-full ${status.dot}`} />
                    <ChevronRight className="h-4 w-4 text-[var(--ink-4)] group-hover:text-[var(--forest)] transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state */}
      {totalListings === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--line)] bg-[var(--paper)]/50 py-16 animate-fade-in">
          <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--paper-2)] border border-[var(--line)] mb-4">
            <ArrowLeftRight className="h-7 w-7 text-[var(--ink-4)]" />
          </div>
          <p className="text-[var(--ink)] font-semibold text-xl">No listings yet</p>
          <p className="text-base text-[var(--ink-3)] mt-1 mb-6 max-w-xs text-center">
            Post your first scrap listing to start receiving bids from verified recyclers.
          </p>
          <Link href="/scraps/new">
            <Button className="h-10 px-6">
              <Plus className="mr-2 h-4 w-4" />
              Post a Listing
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
