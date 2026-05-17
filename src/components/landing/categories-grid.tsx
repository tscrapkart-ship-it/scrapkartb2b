"use client";

import Image from "next/image";
import { Cog, Cpu, Recycle, FileText, GlassWater, Package, type LucideIcon } from "lucide-react";
import { Reveal, RevealStagger, RevealItem } from "@/components/shared/reveal";

type Category = { name: string; desc: string; icon: LucideIcon };

const CATEGORIES: Category[] = [
  { name: "Metal",       desc: "Steel, aluminium, copper, brass, iron scrap.",   icon: Cog },
  { name: "E-waste",     desc: "Circuit boards, servers, monitors, electronics.", icon: Cpu },
  { name: "Plastic",     desc: "HDPE, PP, PET, PVC, mixed polymers.",            icon: Recycle },
  { name: "Paper",       desc: "OCC cardboard, office paper, newsprint.",         icon: FileText },
  { name: "Glass",       desc: "Clear cullet, colored glass, float glass.",       icon: GlassWater },
  { name: "Mixed Scrap", desc: "Unsorted or multi-material industrial waste.",    icon: Package },
];

export function CategoriesGrid() {
  return (
    <section className="bg-[var(--paper-2)] border-t border-[var(--line)]">
      {/* Image banner — full image visible, slight dark gradient at the bottom for the
          section title that overlays it. Distinct treatment from other sections. */}
      <div className="relative h-[260px] sm:h-[320px] w-full overflow-hidden">
        <Image
          src="/categoriesbg.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-center"
          aria-hidden
        />
        {/* Soft fade at the bottom so the banner blends into the cards below */}
        <div
          className="absolute inset-x-0 bottom-0 h-24"
          style={{
            background:
              "linear-gradient(to bottom, rgba(244,242,236,0) 0%, var(--paper-2) 100%)",
          }}
        />
      </div>

      <div className="container-page py-[var(--section-y)]">
        <Reveal>
          <div className="mb-12 max-w-[640px]">
            <p className="mono-caption">03 · Categories</p>
            <h2 className="mt-3 text-[clamp(28px,3.6vw,40px)] font-semibold tracking-[var(--tracking-tight)] leading-[1.05]">
              Six material <span className="italic-accent">types.</span>
            </h2>
            <p className="mt-4 text-[15.5px] text-[var(--ink-2)] leading-[1.55]">
              Industrial scrap, sorted on the way in. Pricing is set by buyers, not by us — bid history is visible on every category.
            </p>
          </div>
        </Reveal>

        <RevealStagger className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            return (
              <RevealItem
                key={c.name}
                className="relative overflow-hidden bg-[var(--paper)] border border-[var(--line)] rounded-[var(--radius-lg)] p-6 min-h-[160px] transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[var(--shadow-2)]"
              >
                {/* Large faded icon watermark on the right — decorative bg */}
                <Icon
                  className="pointer-events-none absolute -right-3 top-1/2 -translate-y-1/2 size-[150px] text-[var(--forest)] opacity-[0.10]"
                  aria-hidden
                />

                {/* Content on the left, constrained so it doesn't overlap the watermark */}
                <div className="relative z-10 max-w-[65%]">
                  <h3 className="text-[18px] font-semibold tracking-[-0.015em]">{c.name}</h3>
                  <p className="mt-2 text-[14px] text-[var(--ink-2)] leading-[1.55]">{c.desc}</p>
                </div>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
