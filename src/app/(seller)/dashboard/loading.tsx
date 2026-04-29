export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 rounded-[var(--radius-sm)] bg-[var(--paper-2)] animate-pulse" />
          <div className="mt-2 h-4 w-64 rounded-[var(--radius-sm)] bg-[var(--paper)] animate-pulse" />
        </div>
        <div className="h-10 w-32 rounded-[var(--radius-md)] bg-[var(--paper-2)] animate-pulse" />
      </div>

      {/* Company card skeleton */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-5 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-[var(--radius-md)] bg-[var(--paper-2)]" />
          <div className="space-y-2">
            <div className="h-5 w-40 rounded bg-[var(--paper-2)]" />
            <div className="h-3 w-24 rounded bg-[var(--paper-2)]" />
          </div>
        </div>
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-5 animate-pulse">
            <div className="flex items-center justify-between mb-3">
              <div className="h-3 w-20 rounded bg-[var(--paper-2)]" />
              <div className="h-8 w-8 rounded-[var(--radius-sm)] bg-[var(--paper-2)]" />
            </div>
            <div className="h-7 w-12 rounded bg-[var(--paper-2)]" />
          </div>
        ))}
      </div>

      {/* Recent listings skeleton */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] divide-y divide-[var(--line-2)] overflow-hidden animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center px-5 py-3.5">
            <div className="flex items-center gap-3">
              <div className="h-6 w-16 rounded-[var(--radius-sm)] bg-[var(--paper-2)]" />
              <div className="h-4 w-36 rounded bg-[var(--paper-2)]" />
            </div>
            <div className="h-4 w-12 rounded bg-[var(--paper-2)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
