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
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      toastOptions={{
        style: {
          border: "2px solid var(--ink)",
          borderRadius: 0,
          background: "var(--paper)",
          color: "var(--ink)",
          boxShadow: "var(--shadow-sm)",
          fontFamily: "var(--font-archivo), system-ui, sans-serif",
        },
        className: "font-sans",
      }}
      {...props}
    />
  )
}

export { Toaster }
