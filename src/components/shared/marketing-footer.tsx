import Link from "next/link";
import Image from "next/image";

export function MarketingFooter() {
  return (
    <footer className="bg-[var(--ink)] text-[var(--paper)] border-t-2 border-[var(--ink)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="sm:col-span-2 md:col-span-1">
            <Image src="/logos/ScrapKart White Logo.png" alt="ScrapKart" width={150} height={42} />
            <p className="mt-5 font-sans text-sm leading-relaxed text-[var(--ink-4)]">
              India&apos;s B2B marketplace for industrial scrap trading. Connecting waste producers with verified recyclers.
            </p>
          </div>
          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.16em] text-[var(--green)] mb-4">Platform</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/marketplace" className="hover:text-[var(--green)]">Marketplace</Link></li>
              <li><Link href="/companies" className="hover:text-[var(--green)]">Companies</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-[var(--green)]">How it works</Link></li>
              <li><Link href="/blogs" className="hover:text-[var(--green)]">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.16em] text-[var(--green)] mb-4">Get started</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/signup" className="hover:text-[var(--green)]">Create account</Link></li>
              <li><Link href="/login" className="hover:text-[var(--green)]">Sign in</Link></li>
              <li><Link href="/contact" className="hover:text-[var(--green)]">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-xs uppercase tracking-[0.16em] text-[var(--green)] mb-4">Sister site</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="https://b2c.scrapkart.app" className="hover:text-[var(--green)]" target="_blank" rel="noopener">B2C — pickup scrap</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t-2 border-[var(--green)] pt-6 flex justify-between items-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-4)]">
            &copy; {new Date().getFullYear()} ScrapKart · All rights reserved
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--ink-4)]">
            Made in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
