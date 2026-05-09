import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { isMockMode, mockCompanies } from "@/lib/mock-data";
import { MapPin, Pencil, Factory, CheckCircle, Clock } from "lucide-react";

async function getCompany() {
  if (isMockMode()) return mockCompanies[0];

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("companies")
    .select("*")
    .eq("owner_id", user.id)
    .single();

  if (!data) redirect("/company/setup");
  return data;
}

export default async function CompanyPage() {
  const company = await getCompany();

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-[28px] font-semibold tracking-[-0.025em] text-[var(--ink)]">Company Profile</h1>
        <Link href="/company/edit" className="shrink-0">
          <Button>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </Link>
      </div>

      {/* Company card */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-4 sm:p-6 shadow-[var(--shadow-1)]">
        <div className="flex items-start gap-3 sm:gap-4">
          {company.logo_url ? (
            <Image
              src={company.logo_url}
              alt={company.name}
              width={80}
              height={80}
              className="h-16 w-16 shrink-0 rounded-[var(--radius-md)] border border-[var(--line)] object-cover sm:h-20 sm:w-20"
            />
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--forest-tint)] border border-[var(--forest)]/20 text-xl font-bold text-[var(--forest)] sm:h-20 sm:w-20 sm:text-2xl">
              {company.name.charAt(0)}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-xl font-semibold tracking-[-0.015em] text-[var(--ink)] truncate sm:text-2xl">{company.name}</h2>
            {company.industry_type && (
              <p className="mt-1 flex items-center gap-1.5 text-base text-[var(--forest)]">
                <Factory className="h-3.5 w-3.5" />
                {company.industry_type}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-[var(--radius-sm)] font-medium ${
                company.verification_status === "verified"
                  ? "bg-[var(--forest-tint)] text-[var(--forest)]"
                  : "bg-[var(--warning)]/10 text-[var(--warning)]"
              }`}>
                {company.verification_status === "verified" ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <Clock className="h-3 w-3" />
                )}
                {company.verification_status === "verified" ? "Verified" : "Pending Review"}
              </span>
            </div>
          </div>
        </div>

        {company.description && (
          <p className="mt-5 text-base leading-relaxed text-[var(--ink-2)] border-t border-[var(--line)] pt-5">
            {company.description}
          </p>
        )}

        {/* Location details */}
        {(company.address || company.city || company.state || company.pincode) && (
          <div className="mt-5 rounded-[var(--radius-md)] bg-[var(--paper-2)] border border-[var(--line-2)] p-4">
            <div className="flex items-center gap-1.5 text-[var(--ink-4)] mb-3">
              <MapPin className="h-3.5 w-3.5" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)] font-medium">Location</span>
            </div>
            <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2.5 text-sm sm:text-base">
              {company.address && (
                <>
                  <span className="text-[var(--ink-4)] shrink-0">Address</span>
                  <span className="text-[var(--ink-2)] break-words">{company.address}</span>
                </>
              )}
              {company.city && (
                <>
                  <span className="text-[var(--ink-4)] shrink-0">City</span>
                  <span className="text-[var(--ink-2)] break-words">{company.city}</span>
                </>
              )}
              {company.state && (
                <>
                  <span className="text-[var(--ink-4)] shrink-0">State</span>
                  <span className="text-[var(--ink-2)] break-words">{company.state}</span>
                </>
              )}
              {company.pincode && (
                <>
                  <span className="text-[var(--ink-4)] shrink-0">Pincode</span>
                  <span className="text-[var(--ink-2)] break-words">{company.pincode}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
