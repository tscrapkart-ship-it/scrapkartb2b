import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-[112px] w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-[14.5px] text-[var(--ink)] placeholder:text-[var(--ink-4)] transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:border-[var(--forest)] focus-visible:shadow-[var(--ring-forest)] disabled:cursor-not-allowed disabled:opacity-50 resize-none",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
