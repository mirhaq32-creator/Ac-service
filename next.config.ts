import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Geolocation stays self-only: the booking flow (PRD §8.3) uses the
  // browser geolocation API; no third-party frames need it.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Cloudflare Workers has no built-in image optimizer; every photo is already
  // shipped as a compressed .webp, so serve them as-is.
  images: { unoptimized: true },
  // Old static-site URLs -> new routes (keeps Google rankings)
  async redirects() {
    const map: Record<string, string> = {
      "ac-repair": "ac",
      "refrigerator-repair": "refrigerator",
      "washing-machine-repair": "washing-machine",
      emergency: "emergency",
    };
    const rules = [];
    for (const [oldSlug, newSlug] of Object.entries(map)) {
      for (const base of ["service", "services"]) {
        rules.push({
          source: `/:lang(ar|en)/${base}/${oldSlug}`,
          destination: `/:lang/services/${newSlug}`,
          permanent: true,
        });
      }
    }
    rules.push({
      source: "/:lang(ar|en)/service",
      destination: "/:lang/services",
      permanent: true,
    });
    return rules;
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
