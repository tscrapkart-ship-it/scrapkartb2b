import type { LiveStats, ScrapCategory, TrendingCategory } from "@/types";
import { isMockMode } from "@/lib/mock-data";

const MOCK_STATS: LiveStats = {
  listingsLive: 47,
  listingsToday: 3,
  lastActivityAt: new Date(Date.now() - 4 * 60 * 1000).toISOString(),
  trendingCategories: [
    { category: "Metal", count: 8 },
    { category: "E-waste", count: 5 },
  ],
};

function todayStartIST(): string {
  // IST = UTC+5:30. Midnight IST = 18:30 previous UTC day.
  const now = new Date();
  const istNow = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
  const istMidnight = new Date(
    Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate())
  );
  const utcEquivalent = new Date(istMidnight.getTime() - 5.5 * 60 * 60 * 1000);
  return utcEquivalent.toISOString();
}

export async function getLiveStats(): Promise<LiveStats> {
  if (isMockMode()) return MOCK_STATS;

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const todayStart = todayStartIST();
  const yesterdayUTC = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  // 1. Live listings count
  const { count: liveCount } = await supabase
    .from("scraps")
    .select("id", { count: "exact", head: true })
    .eq("status", "live");

  // 2. Today's new listings (live only)
  const { count: todayCount } = await supabase
    .from("scraps")
    .select("id", { count: "exact", head: true })
    .eq("status", "live")
    .gte("created_at", todayStart);

  // 3. Last activity — newest of (listing_bids, transactions)
  const [bidsResult, txnsResult] = await Promise.all([
    supabase
      .from("listing_bids")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("transactions")
      .select("created_at")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);
  const lastBidAt = bidsResult.data?.created_at ?? null;
  const lastTxnAt = txnsResult.data?.created_at ?? null;
  let lastActivityAt: string | null = null;
  if (lastBidAt && lastTxnAt) {
    lastActivityAt = lastBidAt > lastTxnAt ? lastBidAt : lastTxnAt;
  } else {
    lastActivityAt = lastBidAt ?? lastTxnAt;
  }

  // 4. Trending categories — top 2 by count of NEW listings in last 24h
  const { data: recentScraps } = await supabase
    .from("scraps")
    .select("category")
    .eq("status", "live")
    .gte("created_at", yesterdayUTC);

  const categoryCounts = new Map<ScrapCategory, number>();
  for (const row of (recentScraps ?? []) as Array<{ category: ScrapCategory }>) {
    categoryCounts.set(row.category, (categoryCounts.get(row.category) ?? 0) + 1);
  }
  const trendingCategories: TrendingCategory[] = Array.from(categoryCounts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 2);

  return {
    listingsLive: liveCount ?? 0,
    listingsToday: todayCount ?? 0,
    lastActivityAt,
    trendingCategories,
  };
}
