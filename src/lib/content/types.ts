/**
 * Content model — PRD §13 (CMS only; no bookings/customers/leads tables
 * exist or will ever exist).
 */

export type Lang2Code = "ar" | "en";
export interface Localized {
  ar: string;
  en: string;
}

export type ContentStatus = "draft" | "published" | "hidden";

/** Paragraph-based rich document (rendered via the safe renderer). */
export type RichText = string;

export interface ServiceCategory {
  slug: "ac" | "refrigerator" | "washing-machine" | "emergency";
  name: Localized;
  shortDescription: Localized;
  longDescription: Localized;
  problemsCovered: Localized[];
  technicianChecks: Localized[];
  icon: string;
  order: number;
  status: ContentStatus;
  seo: { title: Localized; description: Localized };
}

export interface SubService {
  slug: string;
  categorySlug: ServiceCategory["slug"];
  name: Localized;
  shortDescription: Localized;
  /** Show in the Smart Service Finder / search. */
  isProblem: boolean;
  order: number;
  status: ContentStatus;
}

export interface Faq {
  id: string;
  question: Localized;
  answer: Localized;
  /** When set, the FAQ shows on that category's pages. */
  categorySlug?: ServiceCategory["slug"];
  order: number;
  status: ContentStatus;
}

export interface BlogPost {
  slug: string;
  title: Localized;
  excerpt: Localized;
  content: Localized;
  mainImageUrl?: string;
  publishedAt: string;
  status: ContentStatus;
  seo?: { title: Localized; description: Localized };
}

export interface Review {
  id: string;
  customerName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: Localized;
  photoUrl?: string;
  order: number;
  status: ContentStatus;
}

export interface WorkPhoto {
  id: string;
  url: string;
  caption: Localized;
  tag: "ac" | "refrigerator" | "washing-machine" | "shop";
  order: number;
  status: ContentStatus;
}

export interface ServiceArea {
  id: string;
  name: Localized;
  info?: Localized;
  order: number;
  status: ContentStatus;
}

export interface LegalOrAboutPage {
  key: "about" | "privacy" | "terms";
  title: Localized;
  content: Localized;
  status: ContentStatus;
}

export interface SiteSettings {
  businessName: string;
  phone: string;
  whatsapp: string;
  address: Localized;
  mapsLink: string;
  emergencyEnabled: boolean;
  defaultWhatsappMessage: Localized;
  whatsappMessageMode: "current" | "bilingual";
  emergencyWhatsappMessage: Localized;
  seoTitle: Localized;
  seoDescription: Localized;
}

export const COLLECTIONS = [
  "services",
  "sub_services",
  "faqs",
  "blogs",
  "reviews",
  "photos",
  "areas",
  "pages",
  "settings",
  "activity",
  "notifications",
  "media",
] as const;
