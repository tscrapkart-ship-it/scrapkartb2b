import type { Metadata } from "next";
import { Inter_Tight, Fraunces, JetBrains_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import NextTopLoader from "nextjs-toploader";
import { LenisProvider } from "@/components/shared/lenis-provider";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: "variable",
  style: ["italic"],
  axes: ["opsz"],
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ScrapKart — B2B Industrial Scrap Marketplace",
  description:
    "List your lot. Verified buyers bid. Settle in 72 hours. India's B2B exchange for industrial scrap.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "ScrapKart",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#FAFAF7" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${interTight.variable} ${fraunces.variable} ${jetBrainsMono.variable} antialiased overflow-x-hidden`}>
        <NextTopLoader color="#0F4D2A" height={2} showSpinner={false} shadow="none" />
        <LenisProvider />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
