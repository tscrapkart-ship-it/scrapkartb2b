import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center font-mono text-[10px] uppercase tracking-[0.1em] font-medium rounded-[var(--radius-xs)] px-2 py-1 leading-none border",
  {
    variants: {
      variant: {
        default:     "bg-[var(--paper-2)] text-[var(--ink-2)] border-[var(--line)]",
        forest:      "bg-[var(--forest-tint)] text-[var(--forest)] border-[var(--forest-tint)]",
        ink:         "bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]",
        warning:     "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/30",
        danger:      "bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/30",
        success:     "bg-[var(--forest-tint)] text-[var(--forest)] border-[var(--forest-tint)]",
        outline:     "bg-transparent text-[var(--ink-2)] border-[var(--line)]",
        // back-compat aliases (existing callsites)
        verified:    "bg-[var(--forest-tint)] text-[var(--forest)] border-[var(--forest-tint)]",
        active:      "bg-[var(--forest-tint)] text-[var(--forest)] border-[var(--forest-tint)]",
        pending:     "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/30",
        booked:      "bg-[var(--paper-2)] text-[var(--ink-2)] border-[var(--line)]",
        suspended:   "bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/30",
        secondary:   "bg-[var(--paper-2)] text-[var(--ink-2)] border-[var(--line)]",
        destructive: "bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/30",
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
      { className: cn(badgeVariants({ variant }), className) },
      props
    ),
    render,
    state: { slot: "badge", variant },
  })
}

export { Badge, badgeVariants }
