import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-[var(--radius-md)] bg-[var(--paper-2)] animate-pulse",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
