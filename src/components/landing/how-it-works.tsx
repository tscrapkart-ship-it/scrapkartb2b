"use client";

import { Reveal, RevealStagger, RevealItem } from "@/components/shared/reveal";

const STEPS = [
  {
    num: "01",
    title: "List your lot",
    desc: "Material, weight, location, photos. Posted in under four minutes — self-serve, no sales call.",
    meta: "~3 min · self-serve",
  },
  {
    num: "02",
    title: "We verify it",
    desc: "Yard KYC, GST, lot photo audit. Live to verified buyers within 24 hours of submission.",
    meta: "~24 hrs · automated",
  },
  {
    num: "03",
    title: "Buyers bid openly",
    desc: "Verified recyclers compete in the open. Every bid is timestamped and visible to you in real time.",
    meta: "~48 hrs window",
  },
  {
    num: "04",
    title: "Settle and ship",
    desc: "Pickup booked, weighbridge slip uploaded, payment released to your account on weight-reconciled volume.",
    meta: "~72 hrs end-to-end",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-[var(--section-y)]">
      <div className="container-page">
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <p className="mono-caption">02 · Process</p>
              <h2 className="mt-3 text-[clamp(28px,3.6vw,40px)] font-semibold tracking-[var(--tracking-tight)] leading-[1.05]">
                List, verify, bid, <span className="italic-accent">settle.</span>
              </h2>
              <p className="mt-4 text-[15.5px] text-[var(--ink-2)] leading-[1.55] max-w-[520px]">
                Four steps end-to-end. No phone calls. No commission until weighbridge reconciliation clears.
              </p>
            </div>
          </div>
        </Reveal>

        <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--line)] border border-[var(--line)] rounded-[var(--radius-lg)] overflow-hidden">
          {STEPS.map((s) => (
            <RevealItem
              key={s.num}
              className="bg-[var(--paper)] p-7 flex flex-col gap-4"
            >
              <div className="font-mono text-[12px] tracking-[0.04em] text-[var(--forest)] font-medium">
                {s.num}
              </div>
              <h3 className="text-[19px] font-semibold tracking-[-0.015em] leading-tight">
                {s.title}
              </h3>
              <p className="text-[14.5px] text-[var(--ink-2)] leading-[1.55] flex-1">
                {s.desc}
              </p>
              <p className="mono-caption pt-3 border-t border-[var(--line-2)]">
                {s.meta}
              </p>
            </RevealItem>
          ))}
        </RevealStagger>
      </div>
    </section>
  );
}
