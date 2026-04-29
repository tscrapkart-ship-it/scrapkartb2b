import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] px-4 py-2 text-[14.5px] text-[var(--ink)] placeholder:text-[var(--ink-4)] transition-[border-color,box-shadow] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:border-[var(--forest)] focus-visible:shadow-[var(--ring-forest)] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
