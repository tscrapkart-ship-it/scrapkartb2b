// src/components/shared/marketing-nav.tsx
import { getLiveStats } from "@/lib/queries/live-stats";
import { MarketingNavClient } from "./marketing-nav-client";

// Server component — fetches initial live-stats and hands them to the client nav.
export async function MarketingNav() {
  const initialStats = await getLiveStats();
  return <MarketingNavClient initialStats={initialStats} />;
}
