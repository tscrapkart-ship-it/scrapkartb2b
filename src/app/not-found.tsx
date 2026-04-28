import Link from "next/link";
import { MarketingNav } from "@/components/shared/marketing-nav";
import { MarketingFooter } from "@/components/shared/marketing-footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col">
      <MarketingNav />
      <main className="flex-1 flex items-center justify-center py-24">
        <div className="text-center max-w-md px-6">
          <div className="font-display text-[120px] leading-none text-[var(--ink-4)]">404</div>
          <h1 className="font-display text-3xl uppercase mt-4">Page not found</h1>
          <p className="text-[var(--ink-2)] mt-3">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-block mt-8 border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] px-6 py-3 font-display text-sm uppercase tracking-[0.06em] shadow-green press-in-green"
          >
            Back home →
          </Link>
          <div className="mt-8">
            <div className="h-px w-16 mx-auto bg-[var(--border-soft)] mb-4" />
            <p className="font-mono text-xs text-[var(--ink-3)]">
              Need help?{" "}
              <Link
                href="/contact"
                className="text-[var(--green-deep)] hover:underline"
              >
                Contact support
              </Link>
            </p>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
