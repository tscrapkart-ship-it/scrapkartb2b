"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "font-display text-[11px] uppercase tracking-[0.14em] text-[var(--ink-3)] mb-2 inline-block",
        className
      )}
      {...props}
    />
  )
}

export { Label }
