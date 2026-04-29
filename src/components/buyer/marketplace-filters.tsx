"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search, ArrowDownAZ, ArrowUpAZ, Clock } from "lucide-react";
import type { ScrapCategory } from "@/types";

const categories: (ScrapCategory | "All")[] = [
  "All",
  "Metal",
  "E-waste",
  "Plastic",
  "Paper",
  "Glass",
  "Mixed Scrap",
];

const sortOptions = [
  { value: "newest", label: "Newest", icon: Clock },
  { value: "price_asc", label: "Price: Low → High", icon: ArrowDownAZ },
  { value: "price_desc", label: "Price: High → Low", icon: ArrowUpAZ },
];

export function MarketplaceFilters({
  currentCategory,
  currentSort,
  currentSearch,
}: {
  currentCategory?: string;
  currentSort?: string;
  currentSearch?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "All" && value !== "newest") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`/marketplace?${params.toString()}`);
    });
  }

  function handleSearchChange(value: string) {
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    searchDebounce.current = setTimeout(() => {
      updateParams("search", value);
    }, 300);
  }

  return (
    <div
      className={`space-y-4 transition-opacity duration-200 ${
        isPending ? "opacity-60" : "opacity-100"
      }`}
    >
      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-4)]" />
        <Input
          placeholder="Search by title, material, or location..."
          defaultValue={currentSearch}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="h-11 rounded-[var(--radius-md)] border-[var(--line)] bg-[var(--paper)] pl-10 text-[var(--ink)] placeholder:text-[var(--ink-4)] focus-visible:border-[var(--forest)]/40 focus-visible:ring-1 focus-visible:ring-[var(--forest)]/20"
        />
      </div>

      {/* Category pills + Sort */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const isActive = (currentCategory ?? "All") === cat;
            return (
              <button
                key={cat}
                disabled={isPending}
                className={`rounded-[var(--radius-sm)] px-3.5 py-1.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--forest-tint)] border border-[var(--forest)]/30 text-[var(--forest)] shadow-[var(--shadow-1)]"
                    : "bg-[var(--paper)] border border-[var(--line)] text-[var(--ink-2)] hover:border-[var(--line)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]"
                }`}
                onClick={() => updateParams("category", cat)}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-1">
          {sortOptions.map((opt) => {
            const Icon = opt.icon;
            const isActive = (currentSort ?? "newest") === opt.value;
            return (
              <button
                key={opt.value}
                disabled={isPending}
                className={`flex items-center gap-1.5 rounded-[var(--radius-sm)] px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--forest-tint)] text-[var(--forest)]"
                    : "text-[var(--ink-3)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]"
                }`}
                onClick={() => updateParams("sort", opt.value)}
              >
                <Icon className="h-3.5 w-3.5" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
