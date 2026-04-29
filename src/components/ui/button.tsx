"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium tracking-[-0.005em] transition-[transform,box-shadow,background-color,color,border-color] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] focus-visible:outline-none focus-visible:shadow-[var(--ring-forest)] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--forest)] text-white border border-[var(--forest)] hover:bg-[var(--forest-2)] hover:border-[var(--forest-2)] hover:-translate-y-px shadow-[var(--shadow-1)]",
        secondary:
          "bg-[var(--paper)] text-[var(--ink)] border border-[var(--line)] hover:bg-[var(--paper-2)] hover:-translate-y-px",
        ghost:
          "bg-transparent text-[var(--ink)] border border-transparent hover:bg-[var(--paper-2)]",
        link:
          "bg-transparent text-[var(--ink)] border-0 h-auto p-0 underline-offset-4 hover:underline hover:text-[var(--forest)]",
        destructive:
          "bg-[var(--danger)] text-white border border-[var(--danger)] hover:opacity-90 hover:-translate-y-px shadow-[var(--shadow-1)]",
        // back-compat aliases (existing callsites in (buyer)/(seller)/admin still pass these)
        default:
          "bg-[var(--forest)] text-white border border-[var(--forest)] hover:bg-[var(--forest-2)] hover:border-[var(--forest-2)] hover:-translate-y-px shadow-[var(--shadow-1)]",
        outline:
          "bg-[var(--paper)] text-[var(--ink)] border border-[var(--line)] hover:bg-[var(--paper-2)] hover:-translate-y-px",
      },
      size: {
        sm:    "h-9 px-3 text-[13px] rounded-[var(--radius-sm)]",
        md:    "h-11 px-5 text-[14.5px] rounded-[var(--radius-md)]",
        lg:    "h-12 px-6 text-[15px] rounded-[var(--radius-md)]",
        icon:  "h-11 w-11 px-0 rounded-[var(--radius-md)]",
        // back-compat
        default:    "h-11 px-5 text-[14.5px] rounded-[var(--radius-md)]",
        "icon-sm":  "h-9 w-9 px-0 rounded-[var(--radius-sm)]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
