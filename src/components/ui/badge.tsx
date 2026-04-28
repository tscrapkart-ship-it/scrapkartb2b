import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.1em] font-bold border-2 border-[var(--ink)] px-2 py-0.5 leading-none",
  {
    variants: {
      variant: {
        default: "bg-[var(--paper)] text-[var(--ink)]",
        verified: "bg-[var(--paper)] text-[var(--ink)]",
        active: "bg-[var(--green)] text-[var(--ink)]",
        pending: "bg-[var(--warning)] text-[var(--ink)]",
        booked: "bg-[var(--cat-metal)] text-[var(--ink)]",
        suspended: "bg-[var(--danger)] text-[var(--paper)]",
        secondary: "bg-[var(--bg-soft)] text-[var(--ink)]",
        destructive: "bg-[var(--danger)] text-[var(--paper)]",
        outline: "bg-[var(--paper)] text-[var(--ink)]",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
