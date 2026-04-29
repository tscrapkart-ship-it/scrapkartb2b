import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--paper)]">
      {/* Left narrative panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-[var(--paper-2)] flex-col justify-between p-12 xl:p-16 border-r border-[var(--line)]">
        <Link href="/" className="inline-flex items-center gap-2.5 w-fit">
          <Image
            src="/logos/ScrapKart Black Logo.png"
            alt="ScrapKart"
            width={140}
            height={40}
            priority
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--ink-3)] border border-[var(--line)] rounded-[var(--radius-xs)] px-1.5 py-0.5">
            B2B
          </span>
        </Link>

        <div className="max-w-[440px]">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-3)] font-medium">
            India&apos;s industrial scrap exchange
          </p>
          <h2 className="mt-3 text-[clamp(28px,3.4vw,40px)] font-semibold tracking-[-0.025em] leading-[1.05] text-[var(--ink)]">
            List, verify, bid, <span className="italic-accent">settle.</span>
          </h2>
          <p className="mt-5 text-[15.5px] text-[var(--ink-2)] leading-[1.6]">
            120+ verified yards already trading on ScrapKart. Open bids, weighbridge-reconciled settlement in 72 hours.
          </p>
        </div>

        <div className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
          &copy; {new Date().getFullYear()} ScrapKart
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex w-full lg:w-1/2 flex-col px-5 sm:px-8 py-10 lg:py-12">
        {/* Mobile / tablet wordmark */}
        <Link href="/" className="lg:hidden inline-flex items-center gap-2.5 mb-8 w-fit">
          <Image
            src="/logos/ScrapKart Black Logo.png"
            alt="ScrapKart"
            width={132}
            height={36}
            priority
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--ink-3)] border border-[var(--line)] rounded-[var(--radius-xs)] px-1.5 py-0.5">
            B2B
          </span>
        </Link>

        <div className="flex-1 flex items-center justify-center w-full">
          <div className="w-full max-w-[420px]">{children}</div>
        </div>
      </div>
    </div>
  );
}
