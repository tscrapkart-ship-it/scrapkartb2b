import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full border-2 border-[var(--ink)] bg-[var(--paper)] px-4 py-2 text-base font-sans text-[var(--ink)] placeholder:text-[var(--ink-4)] focus-visible:outline-none focus-visible:shadow-green disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Input }
