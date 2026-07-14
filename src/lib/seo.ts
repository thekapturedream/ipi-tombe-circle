export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://ipi-tombe-circle.vercel.app"
).replace(/\/$/, "");

export const siteName = "Ipi Tombe Circle";
export const siteDescription =
  "Discover 18 Zimbabwean artists and makers at Borrowdale Race Course, Harare. Shop local art, craft, fashion, homeware and natural wellbeing.";

export const absoluteUrl = (path = "/") =>
  `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
