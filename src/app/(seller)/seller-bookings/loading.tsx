export default function SellerBookingsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-8 w-40 rounded-[var(--radius-sm)] bg-[var(--paper-2)] animate-pulse" />
        <div className="mt-2 h-4 w-64 rounded-[var(--radius-sm)] bg-[var(--paper-2)] animate-pulse" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-4 space-y-3 animate-pulse">
            <div className="flex justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-[var(--paper-2)]" />
                <div className="space-y-1">
                  <div className="h-4 w-28 rounded bg-[var(--paper-2)]" />
                  <div className="h-3 w-40 rounded bg-[var(--paper-2)]" />
                </div>
              </div>
              <div className="h-5 w-20 rounded-full bg-[var(--paper-2)]" />
            </div>
            <div className="flex gap-6">
              <div className="h-6 w-24 rounded bg-[var(--paper-2)]" />
              <div className="h-4 w-32 rounded bg-[var(--paper-2)]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
