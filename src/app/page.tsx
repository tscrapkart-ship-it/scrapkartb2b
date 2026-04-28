import Link from "next/link";
import { ArrowRight, Cog, Cpu, Recycle, FileText, GlassWater, Package } from "lucide-react";
import { MarketingNav } from "@/components/shared/marketing-nav";
import { MarketingFooter } from "@/components/shared/marketing-footer";
import { LiveMarketplacePanel } from "@/components/shared/live-marketplace-panel";
import { HeroStatCounter } from "@/components/landing/hero-stat-counter";
import { getLiveListings } from "@/lib/queries/live-listings";

export const revalidate = 60;

const HOW_IT_WORKS = [
  { num: "01", title: "List your lot", desc: "Material, weight, location, photos. Posted in under 4 minutes.", meta: "→ ~3 min · self-serve", bg: "bg-[var(--cat-metal)]" },
  { num: "02", title: "We verify it", desc: "Seller KYC, GST check, lot photo audit. Live to buyers in 24 hours.", meta: "→ ~24 hrs · automated", bg: "bg-[var(--cat-plastic)]" },
  { num: "03", title: "Buyers bid", desc: "Verified recyclers compete openly. You see every bid as it lands.", meta: "→ ~48 hrs window", bg: "bg-[var(--cat-ewaste)]" },
  { num: "04", title: "Settle & ship", desc: "Pickup booked, weight reconciled, payment released to your account.", meta: "→ ~72 hrs end-to-end", bg: "bg-[var(--cat-paper)]" },
];

const CATEGORIES = [
  { name: "Metal", desc: "Steel, aluminium, copper, brass, iron scrap", icon: Cog, bg: "bg-[var(--cat-metal)]" },
  { name: "E-waste", desc: "Circuit boards, servers, monitors, electronics", icon: Cpu, bg: "bg-[var(--cat-ewaste)]" },
  { name: "Plastic", desc: "HDPE, PP, PET, PVC, mixed polymers", icon: Recycle, bg: "bg-[var(--cat-plastic)]" },
  { name: "Paper", desc: "OCC cardboard, office paper, newsprint", icon: FileText, bg: "bg-[var(--cat-paper)]" },
  { name: "Glass", desc: "Clear cullet, colored glass, float glass", icon: GlassWater, bg: "bg-[var(--cat-glass)]" },
  { name: "Mixed Scrap", desc: "Unsorted or multi-material industrial waste", icon: Package, bg: "bg-[var(--cat-mixed)]" },
];

export default async function Home() {
  const { listings, totalOpen, totalBidsValueINR } = await getLiveListings(3);

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <MarketingNav />

      {/* HERO */}
      <section className="border-b-2 border-[var(--ink)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
            <div>
              <p className="font-serif-italic text-lg md:text-xl text-[var(--green-deep)]">
                for the businesses moving real weight,
              </p>
              <h1 className="text-hero font-display mt-3">
                Trade scrap.<br />
                By the <em className="font-serif-italic text-[var(--green)]" style={{ fontStyle: "italic" }}>truckload.</em>
              </h1>
              <p className="mt-6 max-w-xl text-base md:text-lg text-[var(--ink-2)] leading-[1.5]">
                List your lot. Verified buyers bid. Settlement in 72 hours. The B2B marketplace built on the same trust network behind <a href="https://b2c.scrapkart.app" className="underline" target="_blank" rel="noopener">b2c.scrapkart.app</a>.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] px-6 py-3.5 font-display text-sm uppercase tracking-[0.06em] shadow-green press-in-green"
                >
                  Post a listing <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center justify-center gap-2 border-2 border-[var(--ink)] bg-[var(--paper)] px-6 py-3.5 font-display text-sm uppercase tracking-[0.06em] shadow-hard-sm press-in-sm"
                >
                  Browse marketplace
                </Link>
              </div>
              <div className="mt-10 pt-6 border-t-2 border-[var(--ink)] flex flex-wrap gap-x-8 gap-y-4">
                <div>
                  <div className="font-display text-2xl">₹2.4Cr</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] mt-1 text-[var(--ink-3)]">Monthly GMV</div>
                </div>
                <div>
                  <div className="font-display text-2xl">120+</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] mt-1 text-[var(--ink-3)]">Verified yards</div>
                </div>
                <div>
                  <div className="font-display text-2xl">72hrs</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] mt-1 text-[var(--ink-3)]">Avg. settlement</div>
                </div>
              </div>
            </div>

            <div>
              <LiveMarketplacePanel listings={listings} totalOpen={totalOpen} totalBidsValueINR={totalBidsValueINR} />
            </div>
          </div>
        </div>
      </section>

      {/* STAT BAR */}
      <HeroStatCounter />

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-b-2 border-[var(--ink)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <h2 className="font-display text-4xl md:text-5xl uppercase">
              How it <em className="font-serif-italic text-[var(--green-deep)]" style={{ fontStyle: "italic" }}>works.</em>
            </h2>
            <span className="hidden md:inline-block font-mono text-xs uppercase tracking-[0.12em] text-[var(--ink-3)]">
              List → Verify → Bid → Settle
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.num} className={`border-2 border-[var(--ink)] ${s.bg} p-6 shadow-hard press-in`}>
                <div className="font-display text-4xl text-black/[0.18] leading-none">{s.num}</div>
                <h3 className="font-display text-xl mt-5 leading-tight">{s.title}</h3>
                <p className="text-sm leading-relaxed mt-2.5">{s.desc}</p>
                <div className="font-mono text-[10px] uppercase tracking-[0.1em] mt-4 pt-3 border-t-2 border-black/[0.18] font-medium">{s.meta}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="border-b-2 border-[var(--ink)] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-4xl md:text-5xl uppercase">
            Six material <em className="font-serif-italic text-[var(--green-deep)]" style={{ fontStyle: "italic" }}>types.</em>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-10">
            {CATEGORIES.map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.name} className={`border-2 border-[var(--ink)] ${c.bg} p-6 shadow-hard press-in flex items-start gap-4`}>
                  <div className="border-2 border-[var(--ink)] bg-[var(--paper)] w-12 h-12 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg leading-none">{c.name}</h3>
                    <p className="text-sm leading-relaxed mt-2">{c.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b-2 border-[var(--ink)] bg-[var(--green)] py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-4xl md:text-6xl uppercase">
            Ready to <em className="font-serif-italic" style={{ fontStyle: "italic" }}>trade?</em>
          </h2>
          <p className="text-base md:text-lg mt-5 max-w-xl mx-auto">
            Join 120+ verified yards already listing on ScrapKart. Free to post. Pay only on settlement.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] px-7 py-4 font-display text-base uppercase tracking-[0.06em] shadow-hard press-in"
            >
              Create account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center justify-center gap-2 border-2 border-[var(--ink)] bg-[var(--paper)] px-7 py-4 font-display text-base uppercase tracking-[0.06em] shadow-hard press-in"
            >
              Browse listings
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
