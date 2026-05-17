import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ScrapCard } from "@/components/shared/scrap-card";
import { isMockMode, mockCompanies, mockScraps } from "@/lib/mock-data";
import { MapPin, Factory, Package, ChevronLeft, CheckCircle } from "lucide-react";

async function getCompanyWithScraps(id: string) {
  if (isMockMode()) {
    const company = mockCompanies.find((c) => c.id === id);
    if (!company) return null;
    const scraps = mockScraps.filter(
      (s) => s.company_id === id && s.status === "live"
    );
    return { company, scraps };
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single();
  if (!company) return null;

  const { data: scraps } = await supabase
    .from("scraps")
    .select("*")
    .eq("company_id", id)
    .eq("status", "live")
    .order("created_at", { ascending: false });

  return { company, scraps: scraps ?? [] };
}

export default async function CompanyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getCompanyWithScraps(id);
  if (!result) notFound();

  const { company, scraps } = result;

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
      {/* Back link */}
      <Link href="/companies" className="inline-flex items-center gap-1 text-base text-[var(--ink-4)] hover:text-[var(--forest)] transition-colors">
        <ChevronLeft className="h-4 w-4" />
        All Companies
      </Link>

      {/* Company hero card */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-4 sm:p-6 animate-slide-up delay-1">
        <div className="flex items-start gap-4 sm:gap-5">
          {company.logo_url ? (
            <Image
              src={company.logo_url}
              alt={company.name}
              width={80}
              height={80}
              className="h-14 w-14 sm:h-20 sm:w-20 rounded-[var(--radius-md)] border border-[var(--line)] object-cover shrink-0"
            />
          ) : (
            <div className="flex h-14 w-14 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--forest-tint)] border border-[var(--forest)]/20 text-xl sm:text-2xl font-bold text-[var(--forest)]">
              {company.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-[clamp(28px,3.6vw,40px)] font-semibold tracking-[-0.025em] text-[var(--ink)] break-words">
                {company.name}
              </h1>
              {company.verification_status === "verified" && (
                <CheckCircle className="h-5 w-5 text-[var(--forest)] shrink-0" />
              )}
            </div>
            {company.industry_type && (
              <p className="mt-1 flex items-center gap-1.5 text-base text-[var(--forest)]">
                <Factory className="h-3.5 w-3.5" />
                {company.industry_type}
              </p>
            )}
            {company.city && (
              <p className="mt-1 flex items-center gap-1.5 text-base text-[var(--ink-3)]">
                <MapPin className="h-3.5 w-3.5" />
                {company.city}
                {company.state ? `, ${company.state}` : ""}
              </p>
            )}
          </div>
        </div>
        {company.description && (
          <p className="mt-5 text-base leading-relaxed text-[var(--ink-3)] border-t border-[var(--line)] pt-5">
            {company.description}
          </p>
        )}
      </div>

      {/* Available listings */}
      <div className="animate-slide-up delay-2">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--forest-tint)]">
            <Package className="h-3.5 w-3.5 text-[var(--forest)]" />
          </div>
          <h2 className="text-[15.5px] font-semibold tracking-[-0.015em] text-[var(--ink)]">
            Available Listings
          </h2>
          <span className="rounded-[var(--radius-sm)] bg-[var(--paper-2)] border border-[var(--line)] px-2 py-0.5 text-xs font-medium text-[var(--ink-3)]">
            {scraps.length}
          </span>
        </div>
        {scraps.length === 0 ? (
          <div className="rounded-[var(--radius-lg)] border border-dashed border-[var(--line)] bg-[var(--paper)]/50 py-12 text-center">
            <p className="text-base text-[var(--ink-4)]">
              No available listings from this company.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {scraps.map((scrap) => (
              <Link key={scrap.id} href={`/marketplace/${scrap.id}`}>
                <ScrapCard scrap={scrap} companyName={company.name} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
