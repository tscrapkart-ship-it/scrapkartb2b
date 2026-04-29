"use client";

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
    <section className="py-[var(--section-y)] bg-[var(--paper-2)]">
      <div className="container-page">
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
                className="bg-[var(--paper)] border border-[var(--line)] rounded-[var(--radius-lg)] p-6 transition-[transform,box-shadow] duration-200 hover:-translate-y-px hover:shadow-[var(--shadow-2)]"
              >
                <div className="size-10 rounded-[var(--radius-md)] bg-[var(--forest-tint)] flex items-center justify-center text-[var(--forest)] mb-5">
                  <Icon className="size-[18px]" />
                </div>
                <h3 className="text-[17px] font-semibold tracking-[-0.015em]">{c.name}</h3>
                <p className="mt-2 text-[14px] text-[var(--ink-2)] leading-[1.55]">{c.desc}</p>
              </RevealItem>
            );
          })}
        </RevealStagger>
      </div>
    </section>
  );
}
