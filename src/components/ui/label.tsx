"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "inline-block text-[13px] font-medium text-[var(--ink-2)] mb-2",
        className
      )}
      {...props}
    />
  )
}

export { Label }
