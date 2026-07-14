import type { MetadataRoute } from "next";
import { makers } from "@/data/makers";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date("2026-07-14"),
      changeFrequency: "weekly",
      priority: 1,
      images: makers.flatMap((maker) => maker.images.map(absoluteUrl)),
    },
    ...makers.map((maker) => ({
      url: absoluteUrl(`/makers/${maker.id}`),
      lastModified: new Date("2026-07-14"),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: maker.images.map(absoluteUrl),
    })),
  ];
}
