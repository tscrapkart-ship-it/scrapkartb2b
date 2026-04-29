"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-[var(--forest)]" />,
        info: <InfoIcon className="size-4 text-[var(--info)]" />,
        warning: <TriangleAlertIcon className="size-4 text-[var(--warning)]" />,
        error: <OctagonXIcon className="size-4 text-[var(--danger)]" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        style: {
          border: "1px solid var(--line)",
          borderRadius: "var(--radius-md)",
          background: "var(--paper)",
          color: "var(--ink)",
          boxShadow: "var(--shadow-2)",
          fontFamily: "var(--font-inter-tight), system-ui, sans-serif",
        },
        className: "font-sans",
      }}
      {...props}
    />
  )
}

export { Toaster }
