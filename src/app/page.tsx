import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MarketingNav } from "@/components/shared/marketing-nav";
import { MarketingFooter } from "@/components/shared/marketing-footer";
import { LiveMarketplacePanel } from "@/components/shared/live-marketplace-panel";
import { HeroStatCounter } from "@/components/landing/hero-stat-counter";
import { HowItWorks } from "@/components/landing/how-it-works";
import { CategoriesGrid } from "@/components/landing/categories-grid";
import { WhySection } from "@/components/landing/why-section";
import { CtaBand } from "@/components/landing/cta-band";
import { HeroEntrance, HeroEntranceItem } from "@/components/shared/reveal";
import { getLiveListings } from "@/lib/queries/live-listings";

export const revalidate = 60;

export default async function Home() {
  const { listings, totalOpen, totalBidsValueINR } = await getLiveListings(3);

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      <MarketingNav />

      {/* HERO */}
      <section className="relative isolate overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
        {/* Background — aerial forest road, brand-aligned moody green */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="/herobg.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
            aria-hidden
          />
          {/* Paper-to-transparent gradient: text-side stays readable on the left,
              forest shows through on the right where the live-marketplace panel sits. */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, var(--paper) 0%, rgba(250,250,247,0.94) 38%, rgba(250,250,247,0.55) 70%, rgba(250,250,247,0.30) 100%)",
            }}
          />
          {/* Subtle top-to-bottom tint so the section blends into the rest of the page below. */}
          <div
            className="absolute inset-x-0 bottom-0 h-24"
            style={{
              background:
                "linear-gradient(to bottom, rgba(250,250,247,0) 0%, var(--paper) 100%)",
            }}
          />
        </div>

        <div className="container-page grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-start">
          <HeroEntrance>
            <HeroEntranceItem>
              <div className="eyebrow">
                <span className="dot" /> India&apos;s industrial scrap exchange
              </div>
            </HeroEntranceItem>

            <HeroEntranceItem>
              <h1 className="mt-7 text-[clamp(48px,7.4vw,84px)] leading-[0.96] tracking-[var(--tracking-display)] font-semibold">
                Trade scrap.<br />
                By the <span className="italic-accent">truckload.</span>
              </h1>
            </HeroEntranceItem>

            <HeroEntranceItem>
              <p className="mt-7 max-w-[560px] text-[19px] leading-[1.5] text-[var(--ink-2)]">
                List your lot, verified buyers bid in the open, settlement clears in 72 hours. Built for yards moving real weight — not casual sellers.
              </p>
            </HeroEntranceItem>

            <HeroEntranceItem>
              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-1.5 bg-[var(--forest)] hover:bg-[var(--forest-2)] text-white px-5 py-3 rounded-[var(--radius-md)] text-[14.5px] font-medium shadow-[var(--shadow-1)] transition-[background-color,transform] duration-200 hover:-translate-y-px"
                >
                  Post a listing <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center justify-center px-5 py-3 rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] text-[14.5px] font-medium hover:bg-[var(--paper-2)] transition-colors"
                >
                  Browse marketplace
                </Link>
              </div>
            </HeroEntranceItem>
          </HeroEntrance>

          <HeroEntrance>
            <HeroEntranceItem>
              <LiveMarketplacePanel
                listings={listings}
                totalOpen={totalOpen}
                totalBidsValueINR={totalBidsValueINR}
              />
            </HeroEntranceItem>
          </HeroEntrance>
        </div>
      </section>

      {/* STAT STRIP */}
      <HeroStatCounter />

      <HowItWorks />

      <CategoriesGrid />

      <WhySection />

      <CtaBand />

      <MarketingFooter />
    </div>
  );
}
