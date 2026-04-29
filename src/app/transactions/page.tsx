import Link from "next/link";
import {
  ArrowLeftRight,
  IndianRupee,
  CalendarDays,
  ChevronRight,
  Package,
} from "lucide-react";

const statusConfig: Record<string, { dot: string; text: string; bg: string }> = {
  scheduled: {
    dot: "bg-[var(--info)]",
    text: "text-[var(--info)]",
    bg: "bg-[var(--info)]/10 border border-[var(--info)]/20",
  },
  in_progress: {
    dot: "bg-[var(--info)]",
    text: "text-[var(--info)]",
    bg: "bg-[var(--info)]/10 border border-[var(--info)]/20",
  },
  completed: {
    dot: "bg-[var(--forest)]",
    text: "text-[var(--forest)]",
    bg: "bg-[var(--forest-tint)] border border-[var(--forest)]/20",
  },
  cancelled: {
    dot: "bg-[var(--danger)]",
    text: "text-[var(--danger)]",
    bg: "bg-[var(--danger)]/10 border border-[var(--danger)]/30",
  },
};

const defaultStatus = {
  dot: "bg-[var(--ink-4)]",
  text: "text-[var(--ink-4)]",
  bg: "bg-[var(--paper-2)] border border-[var(--line)]",
};

async function getTransactions() {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { transactions: [], userId: "" };

  const { data } = await supabase
    .from("transactions")
    .select(`
      *,
      scraps(title, category, quantity, unit),
      producer:users!transactions_producer_id_fkey(name),
      recycler:users!transactions_recycler_id_fkey(name)
    `)
    .or(`producer_id.eq.${user.id},recycler_id.eq.${user.id}`)
    .order("created_at", { ascending: false });

  return { transactions: data ?? [], userId: user.id };
}

export default async function TransactionsPage() {
  const { transactions, userId } = await getTransactions();

  return (
    <div className="min-h-screen bg-[var(--paper)]">
      <div className="mx-auto max-w-4xl px-4 py-10 space-y-8">
        {/* Page Header */}
        <div className="animate-fade-in">
          <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)] font-medium">
            Transactions
          </p>
          <h1 className="mt-2 text-[clamp(28px,3.6vw,40px)] font-semibold tracking-[-0.025em] text-[var(--ink)]">My Deals</h1>
          <p className="mt-2 text-base text-[var(--ink-3)] max-w-md">
            All confirmed transactions from accepted bids. Track status, pickup dates, and payment details.
          </p>
        </div>

        {/* Summary bar */}
        {transactions.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 animate-slide-up delay-1">
            <div className="flex items-center gap-2 text-base text-[var(--ink-3)]">
              <div className="h-2 w-2 rounded-full bg-[var(--forest)]" />
              <span>{transactions.filter((t) => t.status === "completed").length} completed</span>
            </div>
            <div className="flex items-center gap-2 text-base text-[var(--ink-3)]">
              <div className="h-2 w-2 rounded-full bg-[var(--info)]" />
              <span>{transactions.filter((t) => t.status === "in_progress").length} in progress</span>
            </div>
            <div className="flex items-center gap-2 text-base text-[var(--ink-3)]">
              <div className="h-2 w-2 rounded-full bg-[var(--info)]" />
              <span>{transactions.filter((t) => t.status === "scheduled").length} scheduled</span>
            </div>
          </div>
        )}

        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-[var(--radius-lg)] border border-dashed border-[var(--line)] bg-[var(--paper)] py-20 animate-fade-in delay-2">
            <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-lg)] bg-[var(--paper-2)] border border-[var(--line)]">
              <ArrowLeftRight className="h-6 w-6 text-[var(--ink-4)]" />
            </div>
            <p className="mt-4 text-lg font-medium text-[var(--ink-3)]">No deals yet</p>
            <p className="mt-1 text-base text-[var(--ink-4)]">
              Deals are created when a bid gets accepted.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx, index) => {
              const isProducer = tx.producer_id === userId;
              const counterpart = isProducer
                ? (tx.recycler as { name: string } | null)?.name
                : (tx.producer as { name: string } | null)?.name;
              const scrap = tx.scraps as {
                title: string;
                category: string;
                quantity: number;
                unit: string;
              } | null;
              const status = statusConfig[tx.status] ?? defaultStatus;

              return (
                <Link
                  key={tx.id}
                  href={`/transactions/${tx.id}`}
                  className={`animate-slide-up delay-${Math.min(index + 1, 6)}`}
                  style={{ display: "block" }}
                >
                  <div className="group rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-5 transition-all duration-200 hover:border-[var(--line)] hover:bg-[var(--paper-2)]">
                    <div className="flex items-start justify-between gap-4">
                      {/* Left: scrap info */}
                      <div className="flex items-start gap-3.5 min-w-0 flex-1">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--forest-tint)] border border-[var(--forest)]/20">
                          <Package className="h-4.5 w-4.5 text-[var(--forest)]" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="rounded-full bg-[var(--paper-2)] border border-[var(--line)] px-2.5 py-0.5 text-xs font-medium text-[var(--ink-3)]">
                              {scrap?.category}
                            </span>
                            <span className="text-sm text-[var(--ink-4)]">
                              {isProducer ? "sold to" : "bought from"}{" "}
                              <span className="text-[var(--ink-3)]">{counterpart}</span>
                            </span>
                          </div>
                          <p className="font-semibold text-[var(--ink)] truncate group-hover:text-[var(--forest)] transition-colors">
                            {scrap?.title}
                          </p>
                          <p className="text-sm text-[var(--ink-4)] mt-0.5">
                            {scrap?.quantity} {scrap?.unit}
                          </p>
                        </div>
                      </div>

                      {/* Right: status badge + arrow */}
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${status.bg} ${status.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                          {tx.status.replace("_", " ")}
                        </span>
                        <ChevronRight className="h-4 w-4 text-[var(--ink-4)] group-hover:text-[var(--ink-3)] transition-colors" />
                      </div>
                    </div>

                    {/* Bottom row: price + dates */}
                    <div className="flex flex-wrap items-center gap-4 mt-4 pt-3.5 border-t border-[var(--line-2)]">
                      <div className="flex items-center gap-1.5">
                        <IndianRupee className="h-3.5 w-3.5 text-[var(--ink)]" />
                        <span className="text-[20px] font-semibold tabular-nums text-[var(--ink)]">
                          {"\u20B9"}{tx.final_price.toLocaleString("en-IN")}
                        </span>
                      </div>
                      {tx.pickup_date && (
                        <div className="flex items-center gap-1.5 text-xs text-[var(--ink-4)]">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {new Date(tx.pickup_date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                      )}
                      <span className="text-xs text-[var(--ink-4)] ml-auto">
                        {new Date(tx.created_at).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
