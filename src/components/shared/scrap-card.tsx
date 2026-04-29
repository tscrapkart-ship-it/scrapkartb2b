"use client";

import Image from "next/image";
import { useState } from "react";
import {
  MapPin,
  ArrowUpRight,
  Cog,
  Cpu,
  Recycle,
  FileText,
  GlassWater,
  Layers,
} from "lucide-react";
import type { Scrap, ScrapCategory } from "@/types";

// Refined Premium: collapse all categories to a single accent — categories
// stay distinguishable via their icon + label.
const CATEGORY_BADGE = {
  bg: "bg-[var(--forest-tint)]",
  text: "text-[var(--forest)]",
  dot: "bg-[var(--forest)]",
};

const categoryIcons: Record<ScrapCategory, React.ElementType> = {
  Metal: Cog,
  "E-waste": Cpu,
  Plastic: Recycle,
  Paper: FileText,
  Glass: GlassWater,
  "Mixed Scrap": Layers,
};

/* ── Skeleton / Loading Card ───────────────────────────────── */
export function ScrapCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)]">
      {/* Image placeholder */}
      <div className="relative aspect-[16/10] bg-[var(--paper-2)]">
        <div className="absolute inset-0 animate-pulse bg-[var(--paper-2)]" />
        {/* Category badge skeleton */}
        <div className="absolute left-3 top-3">
          <div className="h-6 w-20 animate-pulse rounded-[var(--radius-xs)] bg-[var(--paper-2)]" />
        </div>
      </div>

      {/* Content placeholder */}
      <div className="p-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-[var(--paper-2)]" />
        <div className="mt-1.5 h-3 w-1/3 animate-pulse rounded bg-[var(--paper-2)]" />

        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="h-3 w-16 animate-pulse rounded bg-[var(--paper-2)]" />
            <div className="mt-1.5 h-6 w-24 animate-pulse rounded bg-[var(--paper-2)]" />
          </div>
          <div className="text-right">
            <div className="h-3 w-14 animate-pulse rounded bg-[var(--paper-2)]" />
            <div className="mt-1.5 h-4 w-16 animate-pulse rounded bg-[var(--paper-2)]" />
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1.5 border-t border-[var(--line)] pt-3">
          <div className="h-3.5 w-3.5 animate-pulse rounded bg-[var(--paper-2)]" />
          <div className="h-3 w-20 animate-pulse rounded bg-[var(--paper-2)]" />
        </div>
      </div>
    </div>
  );
}

/* ── Scrap Card ────────────────────────────────────────────── */
export function ScrapCard({
  scrap,
  companyName,
}: {
  scrap: Scrap;
  companyName?: string | null;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const cat = CATEGORY_BADGE;

  const FallbackIcon =
    categoryIcons[scrap.category as ScrapCategory] ?? Layers;
  const showFallback = !scrap.images?.[0] || imgError;

  return (
    <div className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] transition-all duration-300 hover:border-[var(--forest)]/20 hover:shadow-[var(--shadow-2)]">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--paper-2)]">
        {showFallback ? (
          /* Category-appropriate fallback icon */
          <div className="flex h-full items-center justify-center bg-[var(--paper-2)]">
            <div className="flex flex-col items-center gap-2">
              <FallbackIcon
                className={`h-12 w-12 ${cat.text} opacity-40`}
              />
              <span className="text-xs text-[var(--ink-4)]">
                {scrap.category}
              </span>
            </div>
          </div>
        ) : (
          <>
            {/* Pulse loader while image is loading */}
            {!imgLoaded && (
              <div className="absolute inset-0 z-10 animate-pulse bg-[var(--paper-2)]" />
            )}
            <Image
              src={scrap.images[0]}
              alt={scrap.title}
              fill
              className={`object-cover transition-all duration-500 group-hover:scale-[1.03] ${
                imgLoaded ? "opacity-100" : "opacity-0"
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
            />
          </>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--paper)] via-transparent to-transparent opacity-30" />

        {/* Category badge */}
        <div className="absolute left-3 top-3">
          <span
            className={`inline-flex items-center gap-1.5 rounded-[var(--radius-xs)] px-2.5 py-1 text-xs font-semibold ${cat.bg} ${cat.text} backdrop-blur-sm`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${cat.dot}`} />
            {scrap.category}
          </span>
        </div>

        {/* Status badge */}
        {scrap.status && scrap.status !== "live" && (
          <span className="absolute right-3 top-3 rounded-[var(--radius-xs)] bg-[var(--paper)]/80 px-2.5 py-1 text-xs font-medium capitalize text-[var(--ink-3)] backdrop-blur-sm">
            {scrap.status}
          </span>
        )}

        {/* Hover arrow */}
        <div className="absolute right-3 bottom-3 flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-[var(--forest)] text-white opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-1">
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="line-clamp-1 text-base font-semibold text-[var(--ink)] group-hover:text-[var(--ink)] transition-colors">
          {scrap.title}
        </h3>
        {companyName && (
          <p className="mt-0.5 text-sm text-[var(--ink-3)]">{companyName}</p>
        )}

        {/* Price row */}
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-sm text-[var(--ink-3)]">Asking price</p>
            <p className="text-xl font-bold text-[var(--forest)]">
              ₹{scrap.price.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-[var(--ink-3)]">Quantity</p>
            <p className="text-base font-medium text-[var(--ink-2)]">
              {scrap.quantity} {scrap.unit}
            </p>
          </div>
        </div>

        {/* Footer */}
        {scrap.city && (
          <div className="mt-3 flex items-center gap-1.5 border-t border-[var(--line)] pt-3">
            <MapPin className="h-3.5 w-3.5 text-[var(--ink-4)]" />
            <span className="text-sm text-[var(--ink-3)]">{scrap.city}</span>
          </div>
        )}
      </div>
    </div>
  );
}
