import type { MetadataRoute } from "next";

/**
 * PWA manifest (PRD §10): Arabic name (never translated), RTL, standalone,
 * brand colors. Icons are neutral placeholders until the owner supplies the
 * real logo (§19); Serwist service worker arrives in Phase 6.
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
    theme_color: "#D93A17",
    background_color: "#FFFBF7",
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
