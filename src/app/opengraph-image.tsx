import { ImageResponse } from "next/og";
import { absoluteUrl } from "@/lib/seo";

export const alt = "Ipi Tombe Circle — Zimbabwean creativity, gathered";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const photos = [
    "/media/makers/kd-poratoe/kd-poratoe-3026.jpg",
    "/media/makers/back-to-earth/back-to-earth-3138.jpg",
    "/media/makers/highlands-trading/highlands-trading-3044.jpg",
  ];
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", background: "#f6f0e5", color: "#173a32" }}>
      <div style={{ width: "52%", padding: "66px 54px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ fontSize: 27, letterSpacing: 3, textTransform: "uppercase" }}>Ipi Tombe Circle · Harare</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontFamily: "serif", fontSize: 78, lineHeight: .94, display: "flex", flexDirection: "column" }}><span>Made here.</span><span>Made to matter.</span></div>
          <div style={{ width: 120, borderTop: "5px solid #c68b3c", margin: "30px 0" }} />
          <div style={{ fontSize: 28 }}>18 Zimbabwean makers. One remarkable circle.</div>
        </div>
        <div style={{ fontSize: 22 }}>Borrowdale Race Course, Harare</div>
      </div>
      <div style={{ width: "48%", display: "flex" }}>
        {photos.map((photo) => <img key={photo} src={absoluteUrl(photo)} alt="" width={192} height={630} style={{ objectFit: "cover" }} />)}
      </div>
    </div>,
    size,
  );
}
