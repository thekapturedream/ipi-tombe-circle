import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Ipi Tombe Circle | Zimbabwean creativity, gathered",
    template: "%s | Ipi Tombe Circle",
  },
  description:
    "A collective of Zimbabwean artists, artisans, creators and crafters at Borrowdale Race Course in Harare.",
  keywords: [
    "Zimbabwean artists",
    "Harare craft",
    "Borrowdale Race Course",
    "Zimbabwean design",
    "Ipi Tombe Circle",
  ],
  openGraph: {
    title: "Ipi Tombe Circle",
    description:
      "Made by hand. Held in community. Opening 01 July 2026 in Harare.",
    type: "website",
    locale: "en_ZW",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f3eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>{children}</body>
    </html>
  );
}
