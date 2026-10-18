/**
 * SEO helpers (PRD §11).
 * Titles follow `{Service} in Riyadh | للتبريد والتكييف` (≤60 chars),
 * descriptions 140–160 chars mentioning "Call or WhatsApp".
 * hreflang alternates: ar / en, x-default = Arabic (default language).
 */
import type { Metadata } from "next";

import { DEFAULT_LANG, type Lang } from "@/i18n/config";
import { BUSINESS } from "@/lib/business";

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "https://riyadhacservice.site").replace(
    /\/$/,
    ""
  );
}

/** Canonical + hreflang alternates for a public page. `path` excludes the lang segment. */
export function languageAlternates(lang: Lang, path = ""): Metadata["alternates"] {
  const site = getSiteUrl();
  const p = path ? `/${path}` : "";
  return {
    canonical: `${site}/${lang}${p}`,
    languages: {
      ar: `${site}/ar${p}`,
      en: `${site}/en${p}`,
      "x-default": `${site}/${DEFAULT_LANG}${p}`,
    },
  };
}

export function pageMetadata(
  lang: Lang,
  opts: { title: string; description: string; path?: string }
): Metadata {
  const site = getSiteUrl();
  const url = `${site}/${lang}${opts.path ? `/${opts.path}` : ""}`;
  return {
    title: opts.title,
    description: opts.description,
    alternates: languageAlternates(lang, opts.path),
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: BUSINESS.name,
      locale: lang === "ar" ? "ar_SA" : "en_US",
      type: "website",
      images: [
        {
          url: `${site}/og-default.png`,
          width: 1200,
          height: 630,
          alt: lang === "ar" ? "للتبريد والتكييف — خدمات التكييف والثلاجات في الرياض" : "AC and refrigerator repair services in Riyadh",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [`${site}/og-default.png`],
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    ...(process.env.NEXT_PUBLIC_GSC_VERIFICATION
      ? { verification: { google: process.env.NEXT_PUBLIC_GSC_VERIFICATION } }
      : {}),
  };
}

/**
 * LocalBusiness JSON-LD (PRD §11, Appendix A).
 * Deliberately omits geo coordinates and aggregateRating — those are added
 * only when the owner supplies real ones. No invented values.
 */
export function localBusinessJsonLd(siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "HVACBusiness",
    name: BUSINESS.name,
    url: `${siteUrl}/ar`,
    telephone: "+966535757650",
    address: {
      "@type": "PostalAddress",
      streetAddress: "RQFP+H7C، المونسية",
      addressLocality: "الرياض",
      addressCountry: "SA",
    },
    areaServed: { "@type": "City", name: "Riyadh" },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: BUSINESS.hours.opens,
        closes: BUSINESS.hours.closes,
      },
    ],
  };
}
