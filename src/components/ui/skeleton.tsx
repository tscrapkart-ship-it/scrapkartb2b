import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-[var(--bg-soft)] border-2 border-[var(--border-soft)]", className)}
      {...props}
    />
  )
}

export { Skeleton }
