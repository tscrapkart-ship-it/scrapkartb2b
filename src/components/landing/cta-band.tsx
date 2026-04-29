"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";

export function CtaBand() {
  return (
    <section className="py-[var(--section-y)] bg-[var(--forest-tint)]">
      <div className="container-page">
        <Reveal>
          <div className="max-w-[760px] mx-auto text-center">
            <h2 className="text-[clamp(36px,5.2vw,56px)] font-semibold tracking-[var(--tracking-display)] leading-[0.98]">
              Ready to <span className="italic-accent">trade?</span>
            </h2>
            <p className="mt-5 text-[16px] md:text-[17px] text-[var(--ink-2)] leading-[1.55] max-w-[520px] mx-auto">
              Join 120+ verified yards already listing on ScrapKart. Free to post. We earn only on settlement.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-1.5 bg-[var(--forest)] hover:bg-[var(--forest-2)] text-white px-6 py-3.5 rounded-[var(--radius-md)] text-[15px] font-medium shadow-[var(--shadow-1)] transition-[background-color,transform] duration-200 hover:-translate-y-px"
              >
                Create account <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-[var(--radius-md)] border border-[var(--ink)]/15 bg-transparent text-[var(--ink)] text-[15px] font-medium hover:bg-[var(--paper)] transition-colors"
              >
                Browse listings
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
