import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrapCard } from "@/components/shared/scrap-card";
import { isMockMode, mockScraps } from "@/lib/mock-data";
import { Package, Plus, Layers } from "lucide-react";

async function getScraps() {
  if (isMockMode()) {
    return mockScraps.filter((s) => s.seller_id === "u2");
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data } = await supabase
    .from("scraps")
    .select("*")
    .eq("seller_id", user!.id)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function SellerScrapsPage() {
  const scraps = await getScraps();

  const liveCount = scraps.filter((s) => s.status === "live").length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--forest-tint)] border border-[var(--forest)]/20">
            <Layers className="h-5 w-5 text-[var(--forest)]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-[28px] font-semibold tracking-[-0.025em] text-[var(--ink)]">My Listings</h1>
            <p className="text-sm text-[var(--ink-3)] sm:text-base">
              {scraps.length > 0
                ? `${scraps.length} total · ${liveCount} live`
                : "Create and manage your scrap listings"}
            </p>
          </div>
        </div>
        <Link href="/scraps/new" className="shrink-0">
          <Button className="h-10 px-4 sm:px-5">
            <Plus className="mr-2 h-4 w-4" />
            New Listing
          </Button>
        </Link>
      </div>

      {scraps.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--line)] bg-[var(--paper)]/50 py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--paper-2)] border border-[var(--line)] mb-4">
            <Package className="h-7 w-7 text-[var(--ink-4)]" />
          </div>
          <p className="text-xl font-semibold text-[var(--ink)]">No listings yet</p>
          <p className="mt-1 text-base text-[var(--ink-3)] max-w-xs text-center">
            Create your first scrap listing to start receiving bids from verified recyclers.
          </p>
          <Link href="/scraps/new" className="mt-6">
            <Button className="h-10 px-6">
              <Plus className="mr-2 h-4 w-4" />
              Create Listing
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {scraps.map((scrap) => (
            <Link key={scrap.id} href={`/scraps/${scrap.id}/edit`}>
              <ScrapCard scrap={scrap} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
