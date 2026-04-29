export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-44 rounded-[var(--radius-sm)] bg-[var(--paper-2)] animate-pulse" />
        <div className="mt-2 h-4 w-48 rounded-[var(--radius-sm)] bg-[var(--paper-2)] animate-pulse" />
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-5 animate-pulse">
            <div className="h-4 w-28 rounded bg-[var(--paper-2)] mb-3" />
            <div className="h-8 w-14 rounded bg-[var(--paper-2)]" />
          </div>
        ))}
      </div>

      {/* Recent activity skeleton */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-5 space-y-4 animate-pulse">
        <div className="h-5 w-32 rounded bg-[var(--paper-2)]" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex justify-between items-center py-2 border-t border-[var(--line-2)]">
            <div className="h-4 w-56 rounded bg-[var(--paper-2)]" />
            <div className="h-4 w-20 rounded bg-[var(--paper-2)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
