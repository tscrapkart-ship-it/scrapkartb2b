import Link from "next/link";
import {
  Users,
  Package,
  Gavel,
  ArrowLeftRight,
  Building2,
  Clock,
  TrendingUp,
  ChevronRight,
} from "lucide-react";

async function getStats() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: pendingApproval },
    { count: totalListings },
    { count: liveListings },
    { count: totalBids },
    { count: pendingBids },
    { count: totalTransactions },
    { count: completedTransactions },
    { count: totalCompanies },
    { count: pendingRecyclers },
  ] = await Promise.all([
    supabase.from("users").select("*", { count: "exact", head: true }).neq("role", "admin"),
    supabase.from("users").select("*", { count: "exact", head: true }).eq("is_approved", false).neq("role", "admin").not("role", "is", null),
    supabase.from("scraps").select("*", { count: "exact", head: true }),
    supabase.from("scraps").select("*", { count: "exact", head: true }).eq("status", "live"),
    supabase.from("listing_bids").select("*", { count: "exact", head: true }),
    supabase.from("listing_bids").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("transactions").select("*", { count: "exact", head: true }),
    supabase.from("transactions").select("*", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("companies").select("*", { count: "exact", head: true }),
    supabase.from("recycler_profiles").select("*", { count: "exact", head: true }).eq("verification_status", "pending"),
  ]);

  return {
    totalUsers: totalUsers ?? 0,
    pendingApproval: pendingApproval ?? 0,
    totalListings: totalListings ?? 0,
    liveListings: liveListings ?? 0,
    totalBids: totalBids ?? 0,
    pendingBids: pendingBids ?? 0,
    totalTransactions: totalTransactions ?? 0,
    completedTransactions: completedTransactions ?? 0,
    totalCompanies: totalCompanies ?? 0,
    pendingRecyclers: pendingRecyclers ?? 0,
  };
}

async function getRecentActivity() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const [{ data: recentUsers }, { data: recentListings }, { data: recentBids }] =
    await Promise.all([
      supabase
        .from("users")
        .select("id, name, email, role, is_approved, created_at")
        .neq("role", "admin")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("scraps")
        .select("id, title, category, status, created_at, companies(name)")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase
        .from("listing_bids")
        .select("id, offered_price, status, created_at, scraps(title), users!listing_bids_recycler_id_fkey(name)")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  return {
    recentUsers: recentUsers ?? [],
    recentListings: recentListings ?? [],
    recentBids: recentBids ?? [],
  };
}

const roleLabel: Record<string, string> = {
  recycler: "Recycler",
  waste_producer: "Producer",
  both: "Both",
};

const bidStatusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  pending: { bg: "bg-[var(--warning)]/10", text: "text-[var(--warning)]", dot: "bg-[var(--warning)]" },
  accepted: { bg: "bg-[var(--forest-tint)]", text: "text-[var(--forest)]", dot: "bg-[var(--forest)]" },
  rejected: { bg: "bg-[var(--danger)]/10", text: "text-[var(--danger)]", dot: "bg-[var(--danger)]" },
  withdrawn: { bg: "bg-[var(--paper-2)]", text: "text-[var(--ink-4)]", dot: "bg-[var(--ink-4)]" },
};

export default async function AdminOverviewPage() {
  const [stats, activity] = await Promise.all([getStats(), getRecentActivity()]);

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      sub: stats.pendingApproval > 0 ? `${stats.pendingApproval} pending approval` : "All approved",
      icon: Users,
      iconColor: stats.pendingApproval > 0 ? "text-[var(--warning)]" : "text-[var(--info)]",
      iconBg: stats.pendingApproval > 0 ? "bg-[var(--warning)]/10" : "bg-[var(--info)]/10",
      border: stats.pendingApproval > 0 ? "border-[var(--warning)]/30" : "border-[var(--line)]",
      href: stats.pendingApproval > 0 ? "/admin/users?filter=pending" : "/admin/users",
    },
    {
      label: "Scrap Listings",
      value: stats.totalListings,
      sub: `${stats.liveListings} live and accepting bids`,
      icon: Package,
      iconColor: "text-[var(--forest)]",
      iconBg: "bg-[var(--forest-tint)]",
      border: "border-[var(--line)]",
      href: "/admin/listings",
    },
    {
      label: "Total Bids",
      value: stats.totalBids,
      sub: `${stats.pendingBids} pending response`,
      icon: Gavel,
      iconColor: stats.pendingBids > 0 ? "text-[var(--warning)]" : "text-[var(--info)]",
      iconBg: stats.pendingBids > 0 ? "bg-[var(--warning)]/10" : "bg-[var(--info)]/10",
      border: stats.pendingBids > 0 ? "border-[var(--warning)]/30" : "border-[var(--line)]",
      href: "/admin/bids",
    },
    {
      label: "Deals",
      value: stats.totalTransactions,
      sub: `${stats.completedTransactions} completed`,
      icon: ArrowLeftRight,
      iconColor: "text-[var(--forest)]",
      iconBg: "bg-[var(--forest-tint)]",
      border: "border-[var(--line)]",
      href: "/admin/transactions",
    },
    {
      label: "Producer Profiles",
      value: stats.totalCompanies,
      sub: "Registered producer companies",
      icon: Building2,
      iconColor: "text-[var(--info)]",
      iconBg: "bg-[var(--info)]/10",
      border: "border-[var(--line)]",
      href: "/admin/companies",
    },
    {
      label: "Recycler Verifications",
      value: stats.pendingRecyclers,
      sub: "Awaiting compliance review",
      icon: Clock,
      iconColor: stats.pendingRecyclers > 0 ? "text-[var(--warning)]" : "text-[var(--ink-4)]",
      iconBg: stats.pendingRecyclers > 0 ? "bg-[var(--warning)]/10" : "bg-[var(--paper-2)]",
      border: stats.pendingRecyclers > 0 ? "border-[var(--warning)]/30" : "border-[var(--line)]",
      href: "/admin/recyclers",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.025em] text-[var(--ink)]">Overview</h1>
        <p className="mt-1 text-base text-[var(--ink-3)]">Platform-wide activity at a glance</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href} className="group">
              <div className={`animate-scale-in delay-${i + 1} rounded-[var(--radius-lg)] border bg-[var(--paper)] p-5 transition-all hover:border-[var(--line)] hover:bg-[var(--paper-2)] ${card.border}`}>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)] font-medium">{card.label}</p>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] ${card.iconBg} transition-transform group-hover:scale-110`}>
                    <Icon className={`h-4.5 w-4.5 ${card.iconColor}`} />
                  </div>
                </div>
                <p className="text-4xl font-semibold tabular-nums text-[var(--ink)]">{card.value}</p>
                <p className="mt-1 text-sm text-[var(--ink-3)]">{card.sub}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Recent users */}
        <div className="animate-slide-up delay-3 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--info)]/10">
                <TrendingUp className="h-3.5 w-3.5 text-[var(--info)]" />
              </div>
              <h2 className="text-[15.5px] font-semibold tracking-[-0.015em] text-[var(--ink)]">Recent Signups</h2>
            </div>
            <Link href="/admin/users" className="text-[var(--ink-4)] hover:text-[var(--forest)] transition-colors">
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {activity.recentUsers.length === 0 && (
              <p className="text-sm text-[var(--ink-4)] text-center py-4">No users yet</p>
            )}
            {activity.recentUsers.map((u: any) => (
              <div key={u.id} className="flex items-center justify-between py-1">
                <div className="min-w-0 flex-1">
                  <p className="text-base text-[var(--ink)] truncate">{u.name}</p>
                  <p className="text-sm text-[var(--ink-4)] truncate">{u.email}</p>
                </div>
                <div className="flex items-center gap-1.5 ml-2 shrink-0">
                  {!u.is_approved && u.role && (
                    <span className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] bg-[var(--warning)]/10 px-1.5 py-0.5 text-xs font-medium text-[var(--warning)]">
                      <span className="h-1 w-1 rounded-full bg-[var(--warning)]" />
                      pending
                    </span>
                  )}
                  <span className="rounded-[var(--radius-sm)] bg-[var(--paper-2)] px-1.5 py-0.5 text-xs font-medium text-[var(--ink-3)]">
                    {roleLabel[u.role] ?? u.role ?? "—"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent listings */}
        <div className="animate-slide-up delay-4 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--forest-tint)]">
                <Package className="h-3.5 w-3.5 text-[var(--forest)]" />
              </div>
              <h2 className="text-[15.5px] font-semibold tracking-[-0.015em] text-[var(--ink)]">Recent Listings</h2>
            </div>
            <Link href="/admin/listings" className="text-[var(--ink-4)] hover:text-[var(--forest)] transition-colors">
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {activity.recentListings.length === 0 && (
              <p className="text-sm text-[var(--ink-4)] text-center py-4">No listings yet</p>
            )}
            {activity.recentListings.map((s: any) => (
              <div key={s.id} className="flex items-center justify-between gap-2 py-1">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-base text-[var(--ink)]">{s.title}</p>
                  <p className="truncate text-sm text-[var(--ink-4)]">{(s.companies as any)?.name ?? "—"}</p>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <span className="hidden rounded-[var(--radius-sm)] bg-[var(--paper-2)] px-1.5 py-0.5 text-xs font-medium text-[var(--ink-3)] sm:inline-block lg:hidden xl:inline-block">{s.category}</span>
                  <span className={`inline-flex items-center gap-1 rounded-[var(--radius-sm)] px-1.5 py-0.5 text-xs font-medium ${
                    s.status === "live" ? "bg-[var(--forest-tint)] text-[var(--forest)]" : "bg-[var(--paper-2)] text-[var(--ink-4)]"
                  }`}>
                    <span className={`h-1 w-1 rounded-full ${s.status === "live" ? "bg-[var(--forest)]" : "bg-[var(--ink-4)]"}`} />
                    {s.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent bids */}
        <div className="animate-slide-up delay-5 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--info)]/10">
                <Gavel className="h-3.5 w-3.5 text-[var(--info)]" />
              </div>
              <h2 className="text-[15.5px] font-semibold tracking-[-0.015em] text-[var(--ink)]">Recent Bids</h2>
            </div>
            <Link href="/admin/bids" className="text-[var(--ink-4)] hover:text-[var(--forest)] transition-colors">
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-3">
            {activity.recentBids.length === 0 && (
              <p className="text-sm text-[var(--ink-4)] text-center py-4">No bids yet</p>
            )}
            {activity.recentBids.map((b: any) => {
              const bs = bidStatusConfig[b.status] ?? bidStatusConfig.withdrawn;
              return (
                <div key={b.id} className="flex items-center justify-between py-1">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-base text-[var(--ink)]">{(b.scraps as any)?.title ?? "—"}</p>
                    <p className="text-sm text-[var(--ink-4)]">
                      by {(b.users as any)?.name ?? "—"} · ₹{b.offered_price?.toLocaleString("en-IN")}
                    </p>
                  </div>
                  <span className={`ml-2 shrink-0 inline-flex items-center gap-1 rounded-[var(--radius-sm)] px-1.5 py-0.5 text-xs font-medium ${bs.bg} ${bs.text}`}>
                    <span className={`h-1 w-1 rounded-full ${bs.dot}`} />
                    {b.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
