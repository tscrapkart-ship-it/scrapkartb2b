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

// Used to resolve relative URLs in openGraph.images / twitter.images below.
// Currently the b2b app is deployed at scrapkart.app; once split, switch to
// https://b2b.scrapkart.app. The card image itself is identical in both
// deployments, so social previews stay correct either way.
const SITE_URL = "https://scrapkart.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "ScrapKart — B2B Industrial Scrap Marketplace",
  description:
    "List your lot. Verified buyers bid. Settle in 72 hours. India's B2B exchange for industrial scrap.",
  manifest: "/manifest.json",
  icons: {
    icon: "/logos/Scrapkart Full Logo White BG.png",
    shortcut: "/logos/Scrapkart Full Logo White BG.png",
    apple: "/logos/Scrapkart Full Logo White BG.png",
  },
  openGraph: {
    type: "website",
    siteName: "ScrapKart",
    title: "ScrapKart — B2B Industrial Scrap Marketplace",
    description:
      "List your lot. Verified buyers bid. Settle in 72 hours. India's B2B exchange for industrial scrap.",
    url: SITE_URL,
    locale: "en_IN",
    images: [
      {
        url: "/og-card.png",
        width: 1200,
        height: 630,
        alt: "ScrapKart — Trade. Recycle. Repeat.",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@scrapkart",
    title: "ScrapKart — B2B Industrial Scrap Marketplace",
    description:
      "List your lot. Verified buyers bid. Settle in 72 hours. India's B2B exchange for industrial scrap.",
    images: [
      {
        url: "/og-card.png",
        alt: "ScrapKart — Trade. Recycle. Repeat.",
      },
    ],
  },
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
