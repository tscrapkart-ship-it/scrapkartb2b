"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

type Stat = { value: number; suffix?: string; prefix?: string; label: string; decimals?: number; serif?: boolean };

const STATS: Stat[] = [
  { value: 2400, suffix: "T", label: "diverted from landfill", serif: false },
  { value: 15,   suffix: "",  label: "cities live" },
  { value: 98.4, suffix: "%", label: "on-time settlement", decimals: 1 },
  { value: 500,  suffix: "+", label: "active listings", serif: true },
];

function formatStat(n: number, decimals?: number): string {
  if (decimals) return n.toFixed(decimals);
  return Math.round(n).toLocaleString("en-IN");
}

function StatNumber({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, stat.value, {
      duration: 1.0,
      ease: [0.32, 0.72, 0, 1],
      onUpdate(latest) {
        setDisplay(formatStat(latest, stat.decimals));
      },
    });
    return () => controls.stop();
  }, [inView, stat.value, stat.decimals]);

  return (
    <span ref={ref} className="text-[clamp(34px,4vw,46px)] font-semibold leading-none tracking-[-0.025em] text-[var(--ink)] tabular-nums">
      {stat.prefix ?? ""}
      {display}
      {stat.suffix && (
        <span className="font-serif-italic text-[var(--forest)] ml-0.5 align-baseline">
          {stat.suffix}
        </span>
      )}
    </span>
  );
}

export function HeroStatCounter() {
  return (
    <div className="border-t border-b border-[var(--line)] bg-[var(--paper)]">
      <div className="container-page grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--line-2)]">
        {STATS.map((stat) => (
          <div key={stat.label} className="px-6 py-8 md:py-10 flex flex-col items-start gap-3 first:pl-0 last:pr-0">
            <StatNumber stat={stat} />
            <span className="mono-caption">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
