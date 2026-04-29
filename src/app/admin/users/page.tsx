import { Users } from "lucide-react";
import { ApproveUserButton } from "./approve-user-button";

async function getUsers(filter?: string) {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  let query = supabase
    .from("users")
    .select("id, name, email, role, is_approved, onboarding_completed, created_at")
    .neq("role", "admin")
    .order("created_at", { ascending: false });

  if (filter === "pending") {
    query = query.eq("is_approved", false).not("role", "is", null);
  }

  const { data } = await query;
  return data ?? [];
}

const roleLabel: Record<string, string> = {
  recycler: "Recycler",
  waste_producer: "Producer",
  both: "Both",
};

const roleColor: Record<string, string> = {
  recycler: "bg-[var(--info)]/10 text-[var(--info)]",
  waste_producer: "bg-[var(--forest-tint)] text-[var(--forest)]",
  both: "bg-[var(--info)]/10 text-[var(--info)]",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const params = await searchParams;
  const users = await getUsers(params.filter);
  const activeFilter = params.filter ?? "all";

  const tabs = [
    { value: "all", label: "All Users" },
    { value: "pending", label: "Pending Approval" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.025em] text-[var(--ink)]">Users</h1>
        <p className="mt-1 text-base text-[var(--ink-3)]">
          Manage and approve registered users
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <a
            key={tab.value}
            href={tab.value === "all" ? "/admin/users" : `/admin/users?filter=${tab.value}`}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
              activeFilter === tab.value
                ? "bg-[var(--forest)] text-white"
                : "border border-[var(--line)] text-[var(--ink-2)] hover:border-[var(--forest)]/30 hover:text-[var(--ink)]"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] overflow-hidden">
        {users.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Users className="h-8 w-8 text-[var(--ink-4)]" />
            <p className="text-base text-[var(--ink-3)]">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-base">
              <thead>
                <tr className="border-b border-[var(--line)]">
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Name</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Email</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Role</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Status</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Joined</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line-2)]">
                {users.map((user: any) => (
                  <tr key={user.id} className="hover:bg-[var(--paper-2)] transition-colors">
                    <td className="px-4 py-4 sm:px-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--forest-tint)] text-sm font-semibold text-[var(--forest)]">
                          {user.name?.slice(0, 2).toUpperCase() ?? "??"}
                        </div>
                        <span className="max-w-[120px] truncate font-medium text-[var(--ink)]">{user.name}</span>
                      </div>
                    </td>
                    <td className="max-w-[180px] truncate px-4 py-4 text-[var(--ink-2)] sm:px-5">{user.email}</td>
                    <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                      {user.role ? (
                        <span className={`rounded-full px-2.5 py-1 text-sm font-medium ${roleColor[user.role] ?? "bg-[var(--paper-2)] text-[var(--ink-2)]"}`}>
                          {roleLabel[user.role] ?? user.role}
                        </span>
                      ) : (
                        <span className="text-sm text-[var(--ink-3)]">No role</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                      {!user.onboarding_completed ? (
                        <span className="rounded-full bg-[var(--paper-2)] px-2.5 py-1 text-sm text-[var(--ink-3)]">Onboarding</span>
                      ) : user.is_approved ? (
                        <span className="rounded-full bg-[var(--forest-tint)] px-2.5 py-1 text-sm text-[var(--forest)]">Approved</span>
                      ) : (
                        <span className="rounded-full bg-[var(--warning)]/10 px-2.5 py-1 text-sm text-[var(--warning)]">Pending</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-[var(--ink-3)] tabular-nums sm:px-5">
                      {new Date(user.created_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      {!user.is_approved && user.onboarding_completed && (
                        <ApproveUserButton userId={user.id} />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-sm text-[var(--ink-4)]">{users.length} user{users.length !== 1 ? "s" : ""} shown</p>
    </div>
  );
}
