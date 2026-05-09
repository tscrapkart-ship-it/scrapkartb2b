import { Recycle } from "lucide-react";
import { VerifyRecyclerButton } from "./verify-recycler-button";

type UserRef = { name: string | null; email: string | null };
type RecyclerProfileRow = {
  id: string;
  user_id: string;
  verification_status: string;
  waste_types_accepted: string[] | null;
  service_radius_km: number | null;
  pricing_model: string | null;
  cpcb_license_url: string | null;
  epr_authorization_url: string | null;
  iso_certificate_url: string | null;
  users: UserRef | UserRef[] | null;
};

function pickOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

async function getRecyclerProfiles(status?: string): Promise<RecyclerProfileRow[]> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  let query = supabase
    .from("recycler_profiles")
    .select("*, users!recycler_profiles_user_id_fkey(name, email)")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("verification_status", status);
  }

  const { data } = await query;
  return (data as RecyclerProfileRow[] | null) ?? [];
}

const statusColor: Record<string, string> = {
  pending: "bg-[var(--warning)]/10 text-[var(--warning)]",
  verified: "bg-[var(--forest-tint)] text-[var(--forest)]",
  rejected: "bg-[var(--danger)]/10 text-[var(--danger)]",
};

export default async function AdminRecyclersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const profiles = await getRecyclerProfiles(params.status);
  const activeStatus = params.status ?? "all";

  const tabs = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending Verification" },
    { value: "verified", label: "Verified" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.025em] text-[var(--ink)]">Recycler Verification</h1>
        <p className="mt-1 text-sm text-[var(--ink-3)]">
          Review recycler profiles and compliance documents
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <a
            key={tab.value}
            href={tab.value === "all" ? "/admin/recyclers" : `/admin/recyclers?status=${tab.value}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              activeStatus === tab.value
                ? "bg-[var(--forest)] text-white"
                : "border border-[var(--line)] text-[var(--ink-2)] hover:border-[var(--forest)]/30 hover:text-[var(--ink)]"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      {profiles.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-[var(--radius-lg)] border border-dashed border-[var(--line)] py-16 text-center">
          <Recycle className="h-8 w-8 text-[var(--ink-4)]" />
          <p className="text-sm text-[var(--ink-3)]">No recycler profiles found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {profiles.map((profile) => {
            const user = pickOne(profile.users);
            return (
            <div key={profile.id} className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-5 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-[var(--ink)]">{user?.name ?? "Unknown"}</p>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor[profile.verification_status]}`}>
                      {profile.verification_status}
                    </span>
                  </div>
                  <p className="truncate text-sm text-[var(--ink-3)]">{user?.email}</p>
                </div>
                {profile.verification_status === "pending" && (
                  <VerifyRecyclerButton profileId={profile.id} userId={profile.user_id} />
                )}
              </div>

              {profile.waste_types_accepted && profile.waste_types_accepted.length > 0 && (
                <div>
                  <p className="text-xs text-[var(--ink-3)] mb-2">Waste Types Accepted</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.waste_types_accepted.map((t) => (
                      <span key={t} className="rounded-full bg-[var(--forest-tint)] px-2.5 py-0.5 text-xs text-[var(--forest)]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                {profile.service_radius_km && (
                  <div>
                    <p className="text-xs text-[var(--ink-3)]">Service Radius</p>
                    <p className="text-[var(--ink-2)]">{profile.service_radius_km} km</p>
                  </div>
                )}
                {profile.pricing_model && (
                  <div>
                    <p className="text-xs text-[var(--ink-3)]">Pricing Model</p>
                    <p className="text-[var(--ink-2)] capitalize">{profile.pricing_model}</p>
                  </div>
                )}
              </div>

              {/* Compliance docs */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {[
                  { label: "CPCB License", url: profile.cpcb_license_url },
                  { label: "EPR Authorization", url: profile.epr_authorization_url },
                  { label: "ISO Certificate", url: profile.iso_certificate_url },
                ].map((doc) => (
                  <div key={doc.label} className="rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--paper-2)] px-3 py-2">
                    <p className="text-xs text-[var(--ink-3)]">{doc.label}</p>
                    {doc.url ? (
                      <a
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[var(--forest)] hover:underline truncate block mt-0.5"
                      >
                        View Document →
                      </a>
                    ) : (
                      <p className="text-xs text-[var(--ink-4)] mt-0.5">Not provided</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
