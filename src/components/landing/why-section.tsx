"use client";

import { Reveal } from "@/components/shared/reveal";

const POINTS = [
  {
    label: "Open price discovery",
    body: "Bids are timestamped and visible to the seller in real time. No back-channel offers. No black box. The market sets the price.",
  },
  {
    label: "Verified at the yard",
    body: "Every yard is GST and KYC checked before listings go live. Buyers see verification status, ISO/CPCB certifications, and dispute history before bidding.",
  },
  {
    label: "Settled in 72 hours",
    body: "Weighbridge reconciliation closes the loop. Funds release within 72 hours of pickup confirmation — not 30, not 45, not 60.",
  },
];

export function WhySection() {
  return (
    <section className="py-[var(--section-y)]">
      <div className="container-page">
        <Reveal>
          <div className="mb-14 max-w-[680px]">
            <p className="mono-caption">04 · Why ScrapKart</p>
            <h2 className="mt-3 text-[clamp(28px,3.6vw,40px)] font-semibold tracking-[var(--tracking-tight)] leading-[1.05]">
              Built for yards moving <span className="italic-accent">real weight.</span>
            </h2>
            <p className="mt-4 text-[15.5px] text-[var(--ink-2)] leading-[1.55]">
              Not a directory. Not a lead-gen funnel. A live exchange with the operational guarantees that make repeat trade possible.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
          {POINTS.map((p, i) => (
            <Reveal key={p.label} transition={{ delay: i * 0.08 }}>
              <div className="border-t border-[var(--ink)] pt-5">
                <p className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-[var(--forest)] font-medium">
                  0{i + 1}
                </p>
                <h3 className="mt-3 text-[20px] font-semibold tracking-[-0.015em] leading-tight">
                  {p.label}
                </h3>
                <p className="mt-3 text-[14.5px] text-[var(--ink-2)] leading-[1.6]">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
