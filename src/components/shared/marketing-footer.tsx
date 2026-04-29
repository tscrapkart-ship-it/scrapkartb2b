import Link from "next/link";
import Image from "next/image";

export function MarketingFooter() {
  return (
    <footer className="bg-[var(--paper-2)] border-t border-[var(--line)] mt-[var(--section-y)]">
      <div className="container-page py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <Image src="/logos/ScrapKart Black Logo.png" alt="ScrapKart" width={140} height={40} />
            <p className="mt-5 text-[14px] leading-relaxed text-[var(--ink-2)] max-w-sm">
              India&apos;s B2B exchange for industrial scrap. Verified yards. Open bids. Settlement in 72 hours.
            </p>
          </div>
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-3)] mb-4">Platform</h4>
            <ul className="space-y-2.5 text-[14px]">
              <li><Link href="/marketplace" className="text-[var(--ink-2)] hover:text-[var(--forest)] transition-colors">Marketplace</Link></li>
              <li><Link href="/companies" className="text-[var(--ink-2)] hover:text-[var(--forest)] transition-colors">Companies</Link></li>
              <li><Link href="/#how-it-works" className="text-[var(--ink-2)] hover:text-[var(--forest)] transition-colors">How it works</Link></li>
              <li><Link href="/blogs" className="text-[var(--ink-2)] hover:text-[var(--forest)] transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-3)] mb-4">Get started</h4>
            <ul className="space-y-2.5 text-[14px]">
              <li><Link href="/signup" className="text-[var(--ink-2)] hover:text-[var(--forest)] transition-colors">Post a listing</Link></li>
              <li><Link href="/login" className="text-[var(--ink-2)] hover:text-[var(--forest)] transition-colors">Sign in</Link></li>
              <li><Link href="/contact" className="text-[var(--ink-2)] hover:text-[var(--forest)] transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-3)] mb-4">More</h4>
            <ul className="space-y-2.5 text-[14px]">
              <li>
                <a
                  href="https://b2c.scrapkart.app"
                  className="text-[var(--ink-2)] hover:text-[var(--forest)] transition-colors"
                  target="_blank"
                  rel="noopener"
                >
                  ScrapKart B2C
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-[var(--line)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
            &copy; {new Date().getFullYear()} ScrapKart · All rights reserved
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
            Made in India
          </p>
        </div>
      </div>
    </footer>
  );
}
