"use client";

import Link from "next/link";
import { ScrapCard } from "@/components/shared/scrap-card";
import { Package } from "lucide-react";
import type { Scrap } from "@/types";

interface ScrapWithCompany extends Scrap {
  companies: { name: string; logo_url: string | null } | null;
}

export function ScrapGrid({ scraps }: { scraps: ScrapWithCompany[] }) {
  if (scraps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--line)] bg-[var(--paper)] py-20">
        <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-md)] bg-[var(--forest-tint)]">
          <Package className="h-7 w-7 text-[var(--forest)]" />
        </div>
        <p className="mt-5 text-lg font-semibold text-[var(--ink)]">
          No listings found
        </p>
        <p className="mt-1 text-sm text-[var(--ink-3)]">
          Try adjusting your filters or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {scraps.map((scrap) => (
        <Link key={scrap.id} href={`/marketplace/${scrap.id}`}>
          <ScrapCard scrap={scrap} companyName={scrap.companies?.name} />
        </Link>
      ))}
    </div>
  );
}
