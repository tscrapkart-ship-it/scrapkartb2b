import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LiveListing } from "@/lib/queries/live-listings";

const categoryBg: Record<string, string> = {
  Metal: "bg-[var(--cat-metal)]",
  "E-waste": "bg-[var(--cat-ewaste)]",
  Plastic: "bg-[var(--cat-plastic)]",
  Paper: "bg-[var(--cat-paper)]",
  Glass: "bg-[var(--cat-glass)]",
  "Mixed Scrap": "bg-[var(--cat-mixed)]",
};

function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatQuantity(quantity: number, unit: string): string {
  const u = (unit ?? "").toLowerCase().trim();
  // Tonnes / T variants — display as-is with T suffix
  if (u === "tonnes" || u === "tonne" || u === "ton" || u === "tons" || u === "t") {
    return `${quantity}T`;
  }
  // Kilograms — convert to tonnes if large
  if (u === "kg" || u === "kgs" || u === "kilogram" || u === "kilograms") {
    if (quantity >= 1000) return `${(quantity / 1000).toFixed(1)}T`;
    return `${quantity}kg`;
  }
  // Unknown unit — show literally
  return `${quantity} ${unit}`.trim();
}

function priceUnitLabel(unit: string): string {
  const u = (unit ?? "").toLowerCase().trim();
  if (u === "tonnes" || u === "tonne" || u === "ton" || u === "tons" || u === "t") return "/ tonne";
  if (u === "kg" || u === "kgs" || u === "kilogram" || u === "kilograms") return "/ kg";
  return `/ ${unit || "unit"}`;
}

export function LiveMarketplacePanel({
  listings,
  totalOpen,
  totalBidsValueINR,
}: {
  listings: LiveListing[];
  totalOpen: number;
  totalBidsValueINR: number;
}) {
  const moreCount = Math.max(0, totalOpen - listings.length);

  // Empty state — extremely rare in production but handle gracefully.
  if (listings.length === 0) {
    return (
      <div className="border-2 border-[var(--ink)] bg-[var(--paper)] shadow-hard p-8 text-center">
        <h3 className="font-display text-xl">Be the first lot listed →</h3>
        <p className="text-sm text-[var(--ink-3)] mt-3">
          The marketplace is just opening. Post your first listing and we&apos;ll get verified buyers on it.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] mt-5 px-5 py-2.5 font-display text-xs uppercase tracking-[0.06em] shadow-green press-in-green"
        >
          Create account <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="border-2 border-[var(--ink)] bg-[var(--paper)] shadow-hard">
      {/* Header */}
      <div className="border-b-2 border-[var(--ink)] bg-[var(--cat-paper)] px-4 py-3 flex items-center justify-between">
        <div className="font-display text-xs uppercase tracking-[0.12em] flex items-center gap-2">
          <span className="pulse-dot" /> Live marketplace
        </div>
        <div className="font-mono text-[10px] font-bold tracking-[0.04em]">
          {totalOpen} OPEN · {formatINR(totalBidsValueINR)} IN BIDS
        </div>
      </div>

      {/* Listings */}
      {listings.map((row, i) => (
        <div
          key={row.id}
          className={`grid grid-cols-[auto_1fr_auto] gap-4 items-center px-4 py-4 ${
            i < listings.length - 1 ? "border-b border-[var(--border-soft)]" : ""
          }`}
        >
          <div
            className={`w-12 h-12 border-2 border-[var(--ink)] ${
              categoryBg[row.category] ?? "bg-[var(--bg-soft)]"
            } overflow-hidden`}
          >
            {row.thumbnail_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={row.thumbnail_url} alt="" className="w-full h-full object-cover" />
            ) : null}
          </div>
          <div>
            <div className="font-display text-sm leading-tight">{row.title}</div>
            <div className="font-mono text-[10px] text-[var(--ink-3)] tracking-[0.04em] mt-1">
              {formatQuantity(row.quantity, row.unit)} · {row.city}
              {row.state ? `, ${row.state}` : ""}
              {row.verified_badge ? ` · ${row.verified_badge}` : ""}
            </div>
            {row.bid_count > 0 ? (
              <span className="inline-block mt-1 bg-[var(--green)] text-[var(--ink)] font-mono text-[9px] font-bold px-1.5 py-0.5 tracking-[0.08em]">
                {row.bid_count} BID{row.bid_count === 1 ? "" : "S"}
              </span>
            ) : null}
          </div>
          <div className="text-right">
            <div className="font-display text-base">{formatINR(row.price)}</div>
            <div className="font-mono text-[9px] text-[var(--ink-3)] uppercase tracking-[0.1em] mt-0.5">
              {priceUnitLabel(row.unit)}
            </div>
          </div>
        </div>
      ))}

      {/* Footer */}
      <Link
        href="/marketplace"
        className="bg-[var(--ink)] text-[var(--paper)] px-4 py-3 flex items-center justify-between hover:bg-[var(--ink-2)] transition-colors"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.12em]">
          → {moreCount} more listings open
        </span>
        <span className="font-display text-xs text-[var(--green)] uppercase tracking-[0.08em] flex items-center gap-1">
          View all <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </Link>
    </div>
  );
}
