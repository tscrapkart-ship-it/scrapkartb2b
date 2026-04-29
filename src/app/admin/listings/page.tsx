import { Package } from "lucide-react";
import { DeleteListingButton } from "./delete-listing-button";

async function getListings(status?: string) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  let query = supabase
    .from("scraps")
    .select("id, title, category, quantity, unit, price, status, city, state, created_at, companies(name), users!scraps_seller_id_fkey(name)")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data } = await query;
  return data ?? [];
}

const statusColor: Record<string, string> = {
  available: "bg-[var(--forest-tint)] text-[var(--forest)]",
  booked: "bg-[var(--warning)]/10 text-[var(--warning)]",
  collected: "bg-[var(--forest-tint)] text-[var(--forest)]",
};

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const listings = await getListings(params.status);

  const tabs = [
    { value: "all", label: "All" },
    { value: "available", label: "Available" },
    { value: "booked", label: "Booked" },
    { value: "collected", label: "Collected" },
  ];

  const activeTab = params.status ?? "all";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.025em] text-[var(--ink)]">Listings</h1>
        <p className="mt-1 text-sm text-[var(--ink-3)]">All scrap listings on the platform</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <a
            key={tab.value}
            href={tab.value === "all" ? "/admin/listings" : `/admin/listings?status=${tab.value}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              activeTab === tab.value
                ? "bg-[var(--forest)] text-white"
                : "border border-[var(--line)] text-[var(--ink-2)] hover:border-[var(--forest)]/30 hover:text-[var(--ink)]"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] overflow-hidden">
        {listings.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Package className="h-8 w-8 text-[var(--ink-4)]" />
            <p className="text-sm text-[var(--ink-3)]">No listings found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-sm">
              <thead>
                <tr className="border-b border-[var(--line)]">
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Title</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Category</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Seller</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Price/kg</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Location</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Status</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line-2)]">
                {listings.map((listing: any) => (
                  <tr key={listing.id} className="hover:bg-[var(--paper-2)] transition-colors">
                    <td className="px-4 py-4 sm:px-5">
                      <p className="max-w-[180px] truncate font-medium text-[var(--ink)]">{listing.title}</p>
                      <p className="text-xs text-[var(--ink-3)] tabular-nums">{listing.quantity} {listing.unit}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                      <span className="rounded-full bg-[var(--forest-tint)] px-2.5 py-1 text-xs font-medium text-[var(--forest)]">
                        {listing.category}
                      </span>
                    </td>
                    <td className="max-w-[140px] truncate px-4 py-4 text-[var(--ink-2)] sm:px-5">
                      {(listing.companies as any)?.name ?? "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-[var(--ink)] tabular-nums sm:px-5">
                      ₹{listing.price.toLocaleString("en-IN")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-[var(--ink-2)] sm:px-5">
                      {listing.city}, {listing.state}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[listing.status] ?? "bg-[var(--paper-2)] text-[var(--ink-2)]"}`}>
                        {listing.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      <DeleteListingButton id={listing.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-[var(--ink-4)]">{listings.length} listing{listings.length !== 1 ? "s" : ""} shown</p>
    </div>
  );
}
