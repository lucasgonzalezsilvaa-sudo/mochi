import type { Metadata } from "next";
import { Geist, Fraunces } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Viajes en grupo y notas de viaje`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  keywords: [
    "viajes en grupo",
    "viajar Sudamérica",
    "blog de viajes",
    "Atacama",
    "Patagonia",
    "Colombia",
    "consejos de viaje",
  ],
  openGraph: {
    type: "website",
    locale: "es_UY",
    siteName: site.name,
    title: site.name,
    description: site.description,
    images: ["/images/hero-atacama.jpg"],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
