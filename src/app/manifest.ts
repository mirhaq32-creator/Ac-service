import type { MetadataRoute } from "next";

/**
 * PWA manifest (PRD §10): Arabic name (never translated), RTL, standalone,
 * brand colors. Icons are generated from the real brand emblem (public/brand).
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "للتبريد والتكييف",
    short_name: "للتبريد والتكييف",
    description:
      "خدمة منزلية في الرياض لصيانة المكيفات والثلاجات والغسالات — اتصل أو راسل واتساب",
    lang: "ar",
    dir: "rtl",
    start_url: "/",
    display: "standalone",
    theme_color: "#1456c4",
    background_color: "#fbfdff",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/maskable-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
