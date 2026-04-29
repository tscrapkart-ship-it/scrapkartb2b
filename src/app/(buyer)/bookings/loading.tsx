export default function BookingsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-32 rounded-[var(--radius-sm)] bg-[var(--paper-2)] animate-pulse" />
        <div className="mt-2 h-4 w-60 rounded-[var(--radius-sm)] bg-[var(--paper-2)] animate-pulse" />
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-4 animate-pulse">
            <div className="h-4 w-20 rounded bg-[var(--paper-2)] mb-2" />
            <div className="h-8 w-12 rounded bg-[var(--paper-2)]" />
          </div>
        ))}
      </div>

      {/* Bids list skeleton */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-4 animate-pulse">
            <div className="flex justify-between mb-3">
              <div className="h-5 w-full max-w-48 rounded bg-[var(--paper-2)]" />
              <div className="h-5 w-20 rounded-full bg-[var(--paper-2)]" />
            </div>
            <div className="flex gap-4">
              <div className="h-4 w-24 rounded bg-[var(--paper-2)]" />
              <div className="h-4 w-32 rounded bg-[var(--paper-2)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
