// src/app/api/live-stats/route.ts
import { NextResponse } from "next/server";
import { getLiveStats } from "@/lib/queries/live-stats";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const stats = await getLiveStats();
  return NextResponse.json(stats, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
