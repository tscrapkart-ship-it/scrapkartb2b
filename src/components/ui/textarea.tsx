import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[96px] w-full border-2 border-[var(--ink)] bg-[var(--paper)] px-4 py-3 text-base font-sans text-[var(--ink)] placeholder:text-[var(--ink-4)] focus-visible:outline-none focus-visible:shadow-green disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
