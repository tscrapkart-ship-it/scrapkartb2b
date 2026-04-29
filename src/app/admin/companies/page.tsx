import { Building2 } from "lucide-react";

async function getCompanies() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data } = await supabase
    .from("companies")
    .select(`
      id, name, industry_type, city, state, description, created_at,
      owner:users!companies_owner_id_fkey(name, email)
    `)
    .order("created_at", { ascending: false });

  return data ?? [];
}

export default async function AdminCompaniesPage() {
  const companies = await getCompanies();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.025em] text-[var(--ink)]">Companies</h1>
        <p className="mt-1 text-base text-[var(--ink-3)]">All seller company profiles on the platform</p>
      </div>

      {companies.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] py-16 text-center">
          <Building2 className="h-8 w-8 text-[var(--ink-4)]" />
          <p className="text-base text-[var(--ink-3)]">No companies yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {companies.map((company: any) => (
            <div
              key={company.id}
              className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-5 space-y-3"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--forest-tint)] text-base font-bold text-[var(--forest)]">
                  {company.name?.slice(0, 2).toUpperCase() ?? "??"}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[var(--ink)]">{company.name}</p>
                  <p className="text-sm text-[var(--ink-3)]">{company.industry_type ?? "—"}</p>
                </div>
              </div>

              {company.description && (
                <p className="line-clamp-2 text-sm text-[var(--ink-3)]">{company.description}</p>
              )}

              <div className="flex items-center justify-between gap-2 border-t border-[var(--line)] pt-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-[var(--ink)]">{(company.owner as any)?.name ?? "—"}</p>
                  <p className="truncate text-sm text-[var(--ink-3)]">{(company.owner as any)?.email ?? ""}</p>
                </div>
                <span className="shrink-0 rounded-full bg-[var(--paper-2)] px-2.5 py-1 text-sm text-[var(--ink-3)]">
                  {company.city}, {company.state}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-sm text-[var(--ink-4)]">{companies.length} compan{companies.length !== 1 ? "ies" : "y"} shown</p>
    </div>
  );
}
