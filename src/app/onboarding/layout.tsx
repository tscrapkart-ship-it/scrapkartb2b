import Image from "next/image";
import Link from "next/link";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)] flex flex-col">
      {/* Minimal header */}
      <header className="border-b border-[var(--line)] px-4 sm:px-6 h-16 flex items-center">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/logos/ScrapKart Black Logo.png"
            alt="ScrapKart"
            width={130}
            height={36}
            priority
          />
          <span className="hidden sm:inline-block h-5 w-px bg-[var(--line)]" />
          <span className="hidden sm:inline-block text-xs font-medium uppercase tracking-widest text-[var(--ink-4)] group-hover:text-[var(--ink-3)] transition-colors">
            Onboarding
          </span>
        </Link>
      </header>

      {/* Subtle grid background */}
      <main className="flex-1 flex items-start justify-center px-4 py-10 bg-grid-pattern">
        <div className="w-full max-w-xl animate-fade-in">{children}</div>
      </main>
    </div>
  );
}
