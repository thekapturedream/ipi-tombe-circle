import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { absoluteUrl, siteDescription, siteName, siteUrl } from "@/lib/seo";

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
  metadataBase: new URL(siteUrl),
  title: {
    default: "Zimbabwean Art & Craft in Harare | Ipi Tombe Circle",
    template: "%s | Ipi Tombe Circle",
  },
  description: siteDescription,
  applicationName: siteName,
  alternates: { canonical: "/" },
  keywords: [
    "Zimbabwean artists",
    "Harare craft",
    "Borrowdale Race Course",
    "Zimbabwean design",
    "Ipi Tombe Circle",
  ],
  openGraph: {
    title: "Made here. Found in Harare.",
    description: siteDescription,
    type: "website",
    locale: "en_ZW",
    url: "/",
    siteName,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Zimbabwean art and craft at Ipi Tombe Circle" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Made here. Found in Harare.",
    description: "Meet 18 Zimbabwean makers. One remarkable circle.",
    images: ["/twitter-image"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  category: "arts and crafts",
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
      lang="en-ZW"
      className={`${display.variable} ${sans.variable}`}
      data-scroll-behavior="smooth"
    >
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": `${siteUrl}/#website`,
                  url: siteUrl,
                  name: siteName,
                  alternateName: "Ipi Tombe",
                  description: siteDescription,
                  inLanguage: "en-ZW",
                },
                {
                  "@type": ["LocalBusiness", "Store"],
                  "@id": `${siteUrl}/#circle`,
                  name: siteName,
                  url: siteUrl,
                  image: absoluteUrl("/opengraph-image"),
                  description: siteDescription,
                  address: {
                    "@type": "PostalAddress",
                    streetAddress: "Borrowdale Race Course",
                    addressLocality: "Harare",
                    addressCountry: "ZW",
                  },
                  hasMap: "https://www.google.com/maps/search/?api=1&query=Borrowdale+Race+Course+Harare",
                  areaServed: { "@type": "City", name: "Harare" },
                  currenciesAccepted: "USD, ZWG",
                },
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
      </body>
    </html>
  );
}
