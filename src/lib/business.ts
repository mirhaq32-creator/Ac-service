/**
 * Business facts — single source of truth (PRD §1.2).
 * Golden rule 2: the official name للتبريد والتكييف is never translated
 * or replaced by an invented English name; it appears in Arabic script in
 * both languages.
 */
export const BUSINESS = {
  name: "للتبريد والتكييف",
  /** Phone (call is the primary action everywhere — PRD golden rule 3). */
  phoneDisplay: "+966 53 575 7650",
  phoneHref: "tel:+966535757650",
  /** WhatsApp — same number. Bookings are never stored; they end in a wa.me link (D1). */
  whatsappNumber: "966535757650",
  whatsappUrl: "https://wa.me/966535757650",
  /** Google Maps directions to the shop (plus code, no API key needed). */
  mapsLink:
    "https://www.google.com/maps/dir/?api=1&destination=RQFP%2BH7C%20Al%20Munsiyah%20Riyadh",
  address: {
    ar: "RQFP+H7C، المونسية، الرياض، المملكة العربية السعودية",
    en: "RQFP+H7C, Al Munsiah, Riyadh, Saudi Arabia",
  },
  city: { ar: "الرياض", en: "Riyadh" },
  /** Hours: daily 10:00–23:00 Asia/Riyadh. Never claim 24/7 (D15). */
  hours: {
    opens: "10:00",
    closes: "23:00",
    timezone: "Asia/Riyadh",
  },
  since: 2013,
} as const;

/** Build a wa.me link with a prefilled message (PRD §8.5). */
export function whatsappLink(message?: string): string {
  const base = `https://wa.me/${BUSINESS.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
