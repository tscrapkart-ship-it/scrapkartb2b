import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LiveListing } from "@/lib/queries/live-listings";

const categoryAbbr: Record<string, string> = {
  Metal: "FE",
  "E-waste": "EW",
  Plastic: "PL",
  Paper: "PA",
  Glass: "GL",
  "Mixed Scrap": "MX",
};

function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

function formatQuantity(quantity: number, unit: string): string {
  const u = (unit ?? "").toLowerCase().trim();
  if (["tonnes","tonne","ton","tons","t"].includes(u)) return `${quantity} MT`;
  if (["kg","kgs","kilogram","kilograms"].includes(u)) {
    if (quantity >= 1000) return `${(quantity / 1000).toFixed(1)} MT`;
    return `${quantity} kg`;
  }
  return `${quantity} ${unit}`.trim();
}

function priceUnitLabel(unit: string): string {
  const u = (unit ?? "").toLowerCase().trim();
  if (["tonnes","tonne","ton","tons","t"].includes(u)) return "/MT";
  if (["kg","kgs","kilogram","kilograms"].includes(u)) return "/kg";
  return `/${unit || "unit"}`;
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

  if (listings.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] shadow-[var(--shadow-1)] p-8 text-center">
        <h3 className="text-[18px] font-semibold tracking-[-0.015em]">Be the first lot listed.</h3>
        <p className="text-[14px] text-[var(--ink-3)] mt-2 leading-relaxed">
          The marketplace is just opening. Post your first listing and we&apos;ll get verified buyers on it.
        </p>
        <Link
          href="/signup"
          className="inline-flex items-center gap-1.5 mt-5 bg-[var(--forest)] hover:bg-[var(--forest-2)] text-white px-4 py-2.5 rounded-[var(--radius-md)] text-[14px] font-medium shadow-[var(--shadow-1)] transition-colors"
        >
          Create account <ArrowRight className="size-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] shadow-[var(--shadow-2)] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[var(--line-2)] flex items-center justify-between bg-[var(--paper)]">
        <div className="flex items-center gap-2">
          <span className="pulse-dot" />
          <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-2)] font-medium">
            Live marketplace
          </span>
        </div>
        <div className="font-mono text-[10.5px] tracking-[0.04em] text-[var(--ink-3)]">
          {totalOpen} OPEN · {formatINR(totalBidsValueINR)} BIDS
        </div>
      </div>

      {/* Listings */}
      <div>
        {listings.map((row, i) => (
          <div
            key={row.id}
            className={`grid grid-cols-[auto_1fr_auto] gap-4 items-center px-5 py-4 ${
              i < listings.length - 1 ? "border-b border-[var(--line-2)]" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--paper-2)] flex items-center justify-center font-mono text-[11px] font-semibold text-[var(--forest)] tracking-[0.04em]">
              {categoryAbbr[row.category] ?? "??"}
            </div>
            <div className="min-w-0">
              <div className="text-[14.5px] font-semibold leading-tight text-[var(--ink)] truncate">
                {row.title}
              </div>
              <div className="font-mono text-[11px] text-[var(--ink-3)] tracking-[0.02em] mt-1 truncate">
                {formatQuantity(row.quantity, row.unit)} · {row.city}
                {row.state ? `, ${row.state}` : ""}
                {row.bid_count > 0 ? ` · ${row.bid_count} bid${row.bid_count === 1 ? "" : "s"}` : ""}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[15px] font-semibold tabular-nums text-[var(--ink)]">{formatINR(row.price)}</div>
              <div className="font-mono text-[10px] text-[var(--ink-3)] tracking-[0.04em] mt-0.5">
                {priceUnitLabel(row.unit)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <Link
        href="/marketplace"
        className="px-5 py-3.5 flex items-center justify-between bg-[var(--paper-2)] hover:bg-[var(--paper-3)] border-t border-[var(--line-2)] transition-colors"
      >
        <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
          {moreCount} more listings open
        </span>
        <span className="text-[13px] font-medium text-[var(--forest)] inline-flex items-center gap-1.5">
          View all <ArrowRight className="size-3.5" />
        </span>
      </Link>
    </div>
  );
}
