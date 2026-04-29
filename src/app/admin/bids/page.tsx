import { Gavel } from "lucide-react";

const statusColor: Record<string, string> = {
  pending: "bg-[var(--warning)]/10 text-[var(--warning)]",
  accepted: "bg-[var(--forest-tint)] text-[var(--forest)]",
  rejected: "bg-[var(--danger)]/10 text-[var(--danger)]",
  withdrawn: "bg-[var(--paper-2)] text-[var(--ink-3)]",
};

async function getBids(status?: string) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  let query = supabase
    .from("listing_bids")
    .select("*, scraps(title, category), users!listing_bids_recycler_id_fkey(name, email)")
    .order("created_at", { ascending: false })
    .limit(100);

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data } = await query;
  return data ?? [];
}

export default async function AdminBidsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const bids = await getBids(params.status);
  const activeStatus = params.status ?? "all";

  const tabs = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "accepted", label: "Accepted" },
    { value: "rejected", label: "Rejected" },
    { value: "withdrawn", label: "Withdrawn" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.025em] text-[var(--ink)]">Bids</h1>
        <p className="mt-1 text-base text-[var(--ink-3)]">All bids submitted by recyclers</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <a
            key={tab.value}
            href={tab.value === "all" ? "/admin/bids" : `/admin/bids?status=${tab.value}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              activeStatus === tab.value
                ? "bg-[var(--forest)] text-white"
                : "border border-[var(--line)] text-[var(--ink-2)] hover:border-[var(--forest)]/30 hover:text-[var(--ink)]"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] overflow-hidden">
        {bids.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Gavel className="h-8 w-8 text-[var(--ink-4)]" />
            <p className="text-base text-[var(--ink-3)]">No bids found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-base">
              <thead>
                <tr className="border-b border-[var(--line)]">
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Listing</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Recycler</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Offered Price</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Pickup Date</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Status</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line-2)]">
                {bids.map((bid: any) => (
                  <tr key={bid.id} className="hover:bg-[var(--paper-2)] transition-colors">
                    <td className="px-4 py-4 sm:px-5">
                      <p className="max-w-[180px] truncate font-medium text-[var(--ink)]">{bid.scraps?.title ?? "—"}</p>
                      <p className="text-sm text-[var(--ink-3)]">{bid.scraps?.category}</p>
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      <p className="max-w-[140px] truncate text-[var(--ink)]">{bid.users?.name ?? "—"}</p>
                      <p className="max-w-[140px] truncate text-sm text-[var(--ink-3)]">{bid.users?.email}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 font-semibold text-[var(--ink)] tabular-nums sm:px-5">
                      ₹{bid.offered_price?.toLocaleString("en-IN")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-[var(--ink-2)] tabular-nums sm:px-5">
                      {bid.estimated_pickup_date
                        ? new Date(bid.estimated_pickup_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                      <span className={`rounded-full px-2.5 py-1 text-sm font-medium ${statusColor[bid.status] ?? "bg-[var(--paper-2)] text-[var(--ink-2)]"}`}>
                        {bid.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-[var(--ink-3)] tabular-nums sm:px-5">
                      {new Date(bid.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-sm text-[var(--ink-4)]">{bids.length} bid{bids.length !== 1 ? "s" : ""} shown</p>
    </div>
  );
}
