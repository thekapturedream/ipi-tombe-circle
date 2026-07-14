import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ipi Tombe Circle",
    short_name: "Ipi Tombe",
    description: "Zimbabwean creativity, gathered in Harare.",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f3eb",
    theme_color: "#173a32",
  };
}
