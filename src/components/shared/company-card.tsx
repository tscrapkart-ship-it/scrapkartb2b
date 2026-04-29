import Image from "next/image";
import { MapPin, ArrowUpRight } from "lucide-react";
import type { Company } from "@/types";

export function CompanyCard({ company }: { company: Company }) {
  return (
    <div className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-5 transition-all duration-300 hover:border-[var(--forest)]/20 hover:shadow-[var(--shadow-2)]">
      <div className="flex items-start gap-4">
        {/* Logo */}
        {company.logo_url ? (
          <Image
            src={company.logo_url}
            alt={company.name}
            width={48}
            height={48}
            className="rounded-[var(--radius-md)] border border-[var(--line)] object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper-2)] text-lg font-bold text-[var(--forest)]">
            {company.name.charAt(0)}
          </div>
        )}

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate font-semibold text-[var(--ink)] group-hover:text-[var(--ink)] transition-colors">
              {company.name}
            </h3>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-xs)] bg-[var(--paper-2)] text-[var(--ink-4)] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:text-[var(--forest)]">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </div>
          </div>

          {company.industry_type && (
            <span className="mt-1.5 inline-block rounded-[var(--radius-xs)] bg-[var(--forest-tint)] px-2 py-0.5 text-xs font-medium text-[var(--forest)]">
              {company.industry_type}
            </span>
          )}

          {company.city && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-[var(--ink-3)]">
              <MapPin className="h-3 w-3" />
              {company.city}
              {company.state ? `, ${company.state}` : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
