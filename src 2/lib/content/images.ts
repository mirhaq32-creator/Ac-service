/**
 * Approved image registry — the ONLY images published on the site.
 *
 * Sourced from the project `assets/` folder after a full visual review.
 * Every entry is a real work photograph of the business's own trade with
 * no baked-in branding, phone numbers, or claims. Everything else in
 * `assets/` (blue logos, stock vectors with watermarks, other-brand
 * posters, banners with fake contact info or "24/7"/pricing claims) is
 * intentionally excluded — see the report in the project conversation.
 *
 * Note: the outdoor photo's equipment shows a GREE label — that is the
 * appliance being repaired, not business branding, and is normal for a
 * repair company's work photos.
 *
 * Safe for client import: static paths + alt text only, no secrets.
 */

export interface ApprovedImage {
  /** File under /public/images (original preserved in assets/). */
  src: string;
  width: number;
  height: number;
  alt: { ar: string; en: string };
}

export const APPROVED_IMAGES = {
  /** Indoor AC repair — premium hero candidate (portrait). */
  acIndoor: {
    src: "/images/work-ac-indoor.webp",
    width: 1086,
    height: 1448,
    alt: {
      ar: "فني يعمل على إصلاح وحدة تكييف مثبتة على الحائط داخل منزل",
      en: "Technician repairing a wall-mounted air conditioning unit inside a home",
    },
  },
  /** Technician + helper on an indoor AC — teamwork shot (portrait). */
  acTeam: {
    src: "/images/work-ac-team.webp",
    width: 1086,
    height: 1448,
    alt: {
      ar: "فنيان يتعاونان في إصلاح مكيف سبليت مفتوح",
      en: "Two technicians working together on an opened split AC unit",
    },
  },
  /** Outdoor unit repair on a Riyadh street (portrait). */
  acOutdoor: {
    src: "/images/work-ac-outdoor.webp",
    width: 1086,
    height: 1448,
    alt: {
      ar: "فني يصلح وحدة تكييف خارجية على سلم في أحد أحياء الرياض",
      en: "Technician on a ladder repairing an outdoor AC condenser in a Riyadh neighbourhood",
    },
  },
  /** Refrigerator compressor repair in a kitchen (landscape). */
  refrigerator: {
    src: "/images/work-refrigerator.webp",
    width: 1536,
    height: 1024,
    alt: {
      ar: "فني يصلح ضاغط الثلاجة في مطبخ منزلي",
      en: "Technician repairing a refrigerator compressor in a home kitchen",
    },
  },
} as const satisfies Record<string, ApprovedImage>;

export type ApprovedImageKey = keyof typeof APPROVED_IMAGES;

/** Home hero — the most premium indoor work shot. */
export const HERO_IMAGE = APPROVED_IMAGES.acIndoor;

/** Work gallery order (home bento + /work page). */
export const GALLERY_ORDER: ApprovedImageKey[] = [
  "acIndoor",
  "acTeam",
  "refrigerator",
  "acOutdoor",
];
