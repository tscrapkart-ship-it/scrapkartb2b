import { ArrowLeftRight } from "lucide-react";

type ScrapRef = { title: string; category: string };
type UserRef = { name: string };
type TransactionRow = {
  id: string;
  final_price: number | null;
  pickup_date: string | null;
  status: string;
  created_at: string;
  scraps: ScrapRef | ScrapRef[] | null;
  producer: UserRef | UserRef[] | null;
  recycler: UserRef | UserRef[] | null;
};

function pickOne<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

const statusColor: Record<string, string> = {
  scheduled: "bg-[var(--info)]/10 text-[var(--info)]",
  in_progress: "bg-[var(--info)]/10 text-[var(--info)]",
  completed: "bg-[var(--forest-tint)] text-[var(--forest)]",
  cancelled: "bg-[var(--danger)]/10 text-[var(--danger)]",
};

async function getTransactions(): Promise<TransactionRow[]> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data } = await supabase
    .from("transactions")
    .select(`
      *,
      scraps(title, category),
      producer:users!transactions_producer_id_fkey(name),
      recycler:users!transactions_recycler_id_fkey(name)
    `)
    .order("created_at", { ascending: false });

  return (data as TransactionRow[] | null) ?? [];
}

export default async function AdminTransactionsPage() {
  const transactions = await getTransactions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.025em] text-[var(--ink)]">Deals / Transactions</h1>
        <p className="mt-1 text-sm text-[var(--ink-3)]">All confirmed deals created from accepted bids</p>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] overflow-hidden">
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <ArrowLeftRight className="h-8 w-8 text-[var(--ink-4)]" />
            <p className="text-sm text-[var(--ink-3)]">No transactions yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-sm">
              <thead>
                <tr className="border-b border-[var(--line)]">
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Listing</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Producer</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Recycler</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Price</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Pickup</th>
                  <th className="px-4 py-3 text-left font-mono text-[10.5px] uppercase tracking-[0.1em] font-medium text-[var(--ink-3)] sm:px-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line-2)]">
                {transactions.map((tx) => {
                  const scrap = pickOne(tx.scraps);
                  const producer = pickOne(tx.producer);
                  const recycler = pickOne(tx.recycler);
                  return (
                  <tr key={tx.id} className="hover:bg-[var(--paper-2)] transition-colors">
                    <td className="px-4 py-4 sm:px-5">
                      <p className="max-w-[160px] truncate font-medium text-[var(--ink)]">{scrap?.title ?? "—"}</p>
                      <p className="text-xs text-[var(--ink-3)]">{scrap?.category}</p>
                    </td>
                    <td className="max-w-[120px] truncate px-4 py-4 text-[var(--ink-2)] sm:px-5">{producer?.name ?? "—"}</td>
                    <td className="max-w-[120px] truncate px-4 py-4 text-[var(--ink-2)] sm:px-5">{recycler?.name ?? "—"}</td>
                    <td className="whitespace-nowrap px-4 py-4 font-semibold text-[var(--ink)] tabular-nums sm:px-5">
                      ₹{tx.final_price?.toLocaleString("en-IN")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-[var(--ink-3)] tabular-nums sm:px-5">
                      {tx.pickup_date
                        ? new Date(tx.pickup_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : "—"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[tx.status] ?? "bg-[var(--paper-2)] text-[var(--ink-3)]"}`}>
                        {tx.status?.replace("_", " ")}
                      </span>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <p className="text-xs text-[var(--ink-4)]">{transactions.length} transaction{transactions.length !== 1 ? "s" : ""}</p>
    </div>
  );
}
