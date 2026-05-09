import { MessageSquare } from "lucide-react";
import { MarkReadButton } from "./mark-read-button";

type SubmissionRow = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
};

async function getSubmissions(status?: string): Promise<SubmissionRow[]> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  let query = supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (status === "new") {
    query = query.eq("status", "new");
  } else if (status === "read") {
    query = query.neq("status", "new");
  }

  const { data } = await query;
  return (data as SubmissionRow[] | null) ?? [];
}

const statusColor: Record<string, string> = {
  new: "bg-[var(--forest-tint)] text-[var(--forest)]",
  read: "bg-[var(--paper-2)] text-[var(--ink-3)]",
  replied: "bg-[var(--forest-tint)] text-[var(--forest)]",
  archived: "bg-[var(--paper-2)] text-[var(--ink-4)]",
};

export default async function AdminContactPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const params = await searchParams;
  const submissions = await getSubmissions(params.status);
  const activeStatus = params.status ?? "all";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.025em] text-[var(--ink)]">Contact Submissions</h1>
        <p className="mt-1 text-base text-[var(--ink-3)]">Messages from the public contact form</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[
          { value: "all", label: "All" },
          { value: "new", label: "Unread" },
          { value: "read", label: "Read" },
        ].map((tab) => (
          <a
            key={tab.value}
            href={tab.value === "all" ? "/admin/contact" : `/admin/contact?status=${tab.value}`}
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

      {submissions.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-[var(--radius-lg)] border border-dashed border-[var(--line)] py-16 text-center">
          <MessageSquare className="h-8 w-8 text-[var(--ink-4)]" />
          <p className="text-base text-[var(--ink-3)]">No submissions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className={`rounded-[var(--radius-lg)] border bg-[var(--paper)] p-5 space-y-3 ${sub.status === "new" ? "border-[var(--forest)]/30" : "border-[var(--line)]"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-[var(--ink)]">{sub.name}</p>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-sm font-medium ${statusColor[sub.status]}`}>
                      {sub.status}
                    </span>
                  </div>
                  <p className="truncate text-base text-[var(--ink-3)]">{sub.email}{sub.phone ? ` · ${sub.phone}` : ""}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <p className="whitespace-nowrap text-sm text-[var(--ink-3)] tabular-nums">
                    {new Date(sub.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  {sub.status === "new" && <MarkReadButton submissionId={sub.id} />}
                </div>
              </div>

              {sub.subject && (
                <p className="text-base font-medium text-[var(--ink-2)]">{sub.subject}</p>
              )}

              <p className="text-base text-[var(--ink-2)] leading-relaxed">{sub.message}</p>

              <a
                href={`mailto:${sub.email}?subject=Re: ${sub.subject ?? "Your message to ScrapKart"}`}
                className="inline-block text-sm text-[var(--forest)] hover:opacity-80 transition-opacity"
              >
                Reply via email →
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
