import { isMockMode } from "@/lib/mock-data";

export type LiveListing = {
  id: string;
  title: string;
  category: string;
  quantity: number;
  unit: string;
  city: string;
  state: string;
  price: number;
  bid_count: number;
  thumbnail_url: string | null;
  seller_name: string;
  verified_badge: string | null; // "GST" | "VERIFIED" | null
};

const MOCK: LiveListing[] = [
  {
    id: "mock-1",
    title: "HMS Steel Scrap",
    category: "Metal",
    quantity: 12.4,
    unit: "tonnes",
    city: "Pune",
    state: "MH",
    price: 38200,
    bid_count: 7,
    thumbnail_url: null,
    seller_name: "Iron & Steel Co.",
    verified_badge: "GST",
  },
  {
    id: "mock-2",
    title: "Copper Wire (No.1)",
    category: "Metal",
    quantity: 2.8,
    unit: "tonnes",
    city: "Bengaluru",
    state: "KA",
    price: 680000,
    bid_count: 12,
    thumbnail_url: null,
    seller_name: "EcoRecycle Ltd.",
    verified_badge: "VERIFIED",
  },
  {
    id: "mock-3",
    title: "Server e-waste, mixed",
    category: "E-waste",
    quantity: 5.2,
    unit: "tonnes",
    city: "Hyderabad",
    state: "TS",
    price: 112500,
    bid_count: 4,
    thumbnail_url: null,
    seller_name: "EcoRecycle Ltd.",
    verified_badge: "VERIFIED",
  },
];

export type LiveListingsResult = {
  listings: LiveListing[];
  totalOpen: number;
  totalBidsValueINR: number;
};

export async function getLiveListings(limit = 3): Promise<LiveListingsResult> {
  if (isMockMode()) {
    return {
      listings: MOCK.slice(0, limit),
      totalOpen: 47,
      totalBidsValueINR: 8400000,
    };
  }

  // Dynamic import to avoid build-time env-var errors when Supabase env is absent.
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  // Top N live listings by recency
  const { data: scrapData, error: scrapErr } = await supabase
    .from("scraps")
    .select(`
      id,
      title,
      category,
      quantity,
      unit,
      city,
      state,
      price,
      images,
      companies!scraps_company_id_fkey(name, verification_status, gst_number)
    `)
    .eq("status", "live")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (scrapErr || !scrapData) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[live-listings] fetch failed, falling back to mock:", scrapErr?.message);
    }
    return { listings: MOCK.slice(0, limit), totalOpen: 0, totalBidsValueINR: 0 };
  }

  // Total open count (head:true returns no rows, only count)
  const { count: totalOpenCount } = await supabase
    .from("scraps")
    .select("id", { count: "exact", head: true })
    .eq("status", "live");

  const ids = scrapData.map((d) => d.id as string);

  // Bid counts per scrap (all open bids across these listings)
  const bidCountById: Record<string, number> = {};
  let totalBidsValueINR = 0;

  if (ids.length > 0) {
    const { data: bids } = await supabase
      .from("listing_bids")
      .select("listing_id, offered_price, status")
      .in("listing_id", ids)
      .eq("status", "pending");

    if (bids) {
      for (const b of bids as Array<{ listing_id: string; offered_price: number | null }>) {
        bidCountById[b.listing_id] = (bidCountById[b.listing_id] ?? 0) + 1;
        totalBidsValueINR += Number(b.offered_price ?? 0);
      }
    }
  }

  const listings: LiveListing[] = scrapData.map((row) => {
    const r = row as {
      id: string;
      title: string;
      category: string;
      quantity: number;
      unit: string;
      city: string | null;
      state: string | null;
      price: number;
      images: string[] | null;
      companies: { name: string; verification_status: string; gst_number: string | null } | { name: string; verification_status: string; gst_number: string | null }[] | null;
    };
    const company = Array.isArray(r.companies) ? r.companies[0] : r.companies;
    let badge: string | null = null;
    if (company?.gst_number) badge = "GST";
    else if (company?.verification_status === "verified") badge = "VERIFIED";
    return {
      id: r.id,
      title: r.title,
      category: r.category,
      quantity: r.quantity,
      unit: r.unit,
      city: r.city ?? "",
      state: r.state ?? "",
      price: r.price,
      bid_count: bidCountById[r.id] ?? 0,
      thumbnail_url: r.images && r.images.length > 0 ? r.images[0] : null,
      seller_name: company?.name ?? "Verified seller",
      verified_badge: badge,
    };
  });

  return { listings, totalOpen: totalOpenCount ?? 0, totalBidsValueINR };
}
