"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type Stat = { value: number; suffix: string; prefix?: string; label: string; decimals?: number };

const STATS: Stat[] = [
  { value: 2400, suffix: "T", label: "diverted from landfill" },
  { value: 15, suffix: "", label: "cities live" },
  { value: 98.4, suffix: "%", label: "on-time settlement", decimals: 1 },
  { value: 500, suffix: "+", label: "active listings" },
];

export function HeroStatCounter() {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    refs.current.forEach((el, i) => {
      if (!el) return;
      const stat = STATS[i];
      const target = stat.value;
      gsap.fromTo(
        el,
        { textContent: 0 },
        {
          textContent: target,
          duration: 1.2,
          ease: "power2.out",
          snap: stat.decimals ? { textContent: 0.1 } : { textContent: 1 },
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate() {
            const n = parseFloat((el as HTMLElement).textContent ?? "0");
            const formatted = stat.decimals
              ? n.toFixed(stat.decimals)
              : Math.round(n).toLocaleString("en-IN");
            (el as HTMLElement).textContent = `${stat.prefix ?? ""}${formatted}${stat.suffix}`;
          },
        }
      );
    });
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-y-2 border-[var(--ink)] bg-[var(--green)]">
      {STATS.map((stat, i) => (
        <div
          key={stat.label}
          className={`py-8 px-6 text-center flex flex-col items-center justify-center ${i < 3 ? "md:border-r-2 border-[var(--ink)]" : ""} ${i === 1 ? "border-r-2" : ""} ${i < 2 ? "border-b-2 md:border-b-0" : ""}`}
        >
          <div ref={(el) => { refs.current[i] = el; }} className="font-display text-3xl md:text-4xl leading-none">
            {stat.prefix ?? ""}0{stat.suffix}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.14em] mt-2 font-bold">{stat.label}</div>
        </div>
      ))}
    </div>
  );
}
