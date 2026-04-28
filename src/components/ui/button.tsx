"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-display uppercase tracking-[0.06em] border-2 border-[var(--ink)] transition-[transform,box-shadow] duration-100 ease-[cubic-bezier(0.2,0.8,0.2,1)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-green)] disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--ink)] text-[var(--paper)] shadow-green hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--green)]",
        secondary:
          "bg-[var(--paper)] text-[var(--ink)] shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--ink)]",
        ghost:
          "border-transparent bg-transparent text-[var(--ink)] font-sans normal-case tracking-normal underline-offset-4 hover:underline",
        destructive:
          "bg-[var(--danger)] text-[var(--paper)] shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--ink)]",
        // Back-compat aliases (callsites haven't been updated yet)
        default:
          "bg-[var(--ink)] text-[var(--paper)] shadow-green hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--green)]",
        outline:
          "bg-[var(--paper)] text-[var(--ink)] shadow-hard-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_var(--ink)]",
        link: "border-transparent bg-transparent text-[var(--ink)] font-sans normal-case tracking-normal underline-offset-4 underline hover:no-underline p-0 h-auto",
      },
      size: {
        sm: "h-9 px-3 text-xs",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-sm",
        icon: "h-11 w-11 px-0",
        // Back-compat aliases
        default: "h-11 px-5 text-sm",
        "icon-sm": "h-9 w-9 px-0",
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
