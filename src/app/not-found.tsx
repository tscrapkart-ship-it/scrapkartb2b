import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { MarketingNav } from "@/components/shared/marketing-nav";
import { MarketingFooter } from "@/components/shared/marketing-footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col">
      <MarketingNav />
      <main className="flex-1 flex items-center justify-center py-24">
        <div className="text-center max-w-md container-page">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-3)]">Error 404</p>
          <h1 className="mt-3 text-[clamp(48px,7vw,84px)] font-semibold tracking-[var(--tracking-display)] leading-[0.98]">
            Page <span className="italic-accent">not found.</span>
          </h1>
          <p className="text-[16px] text-[var(--ink-2)] mt-5 leading-relaxed max-w-[420px] mx-auto">
            The page you were looking for doesn&apos;t exist or has been moved.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-1.5 bg-[var(--forest)] hover:bg-[var(--forest-2)] text-white px-5 py-3 rounded-[var(--radius-md)] text-[14.5px] font-medium shadow-[var(--shadow-1)] transition-colors"
            >
              <ArrowLeft className="size-4" /> Back home
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-3 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] text-[14.5px] font-medium hover:bg-[var(--paper-2)] transition-colors"
            >
              Contact support
            </Link>
          </div>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
