import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { makers } from "@/data/makers";
import { absoluteUrl, siteName, siteUrl } from "@/lib/seo";

export function generateStaticParams() {
  return makers.map(({ id }) => ({ slug: id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const maker = makers.find(({ id }) => id === slug);
  if (!maker) return {};
  const title = `${maker.brand} — ${maker.craft} in Harare`;
  return {
    title,
    description: `${maker.description} Discover ${maker.brand} at ${siteName}, Borrowdale Race Course, Harare.`,
    alternates: { canonical: `/makers/${maker.id}` },
    openGraph: { title, description: maker.description, url: `/makers/${maker.id}`, images: maker.images[0] ? [maker.images[0]] : ["/opengraph-image"] },
  };
}

export default async function MakerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const maker = makers.find(({ id }) => id === slug);
  if (!maker) notFound();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/makers/${maker.id}#maker`,
    name: maker.brand,
    description: maker.description,
    url: absoluteUrl(`/makers/${maker.id}`),
    image: maker.images.map(absoluteUrl),
    founder: maker.makers.map((name) => ({ "@type": "Person", name })),
    location: { "@type": "Place", name: `${siteName}, Stall ${maker.stall}`, address: { "@type": "PostalAddress", streetAddress: "Borrowdale Race Course", addressLocality: "Harare", addressCountry: "ZW" } },
  };
  return (
    <main className="maker-profile-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Link className="text-link" href="/#discover">← All makers</Link>
      <div className="maker-profile-page__grid">
        <div className="maker-profile-page__gallery">
          {maker.images.length ? maker.images.slice(0, 3).map((src, index) => <Image key={src} src={src} alt={`${maker.brand} ${maker.craft}${index ? `, image ${index + 1}` : ""}`} width={900} height={900} priority={index === 0} />) : <div className="maker-profile-page__placeholder">Photography coming soon.</div>}
        </div>
        <article>
          <span className="maker-card__stall">Stall {maker.stall} · {maker.category}</span>
          <h1>{maker.brand}</h1>
          <h2>{maker.craft}</h2>
          <p>{maker.description}</p>
          <p><strong>Made by</strong><br />{maker.makers.join(" · ")}</p>
          <a className="button button--primary" href="https://www.google.com/maps/search/?api=1&query=Borrowdale+Race+Course+Harare">Find the Circle</a>
        </article>
      </div>
    </main>
  );
}
