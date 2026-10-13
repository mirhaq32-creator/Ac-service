import "server-only";

import { cache } from "react";

import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import {
  seedCategories,
  seedFaqs,
  seedPhotos,
  seedSettings,
  seedSubServices,
} from "./seed";
import type {
  BlogPost,
  Faq,
  LegalOrAboutPage,
  Review,
  ServiceArea,
  ServiceCategory,
  SiteSettings,
  SubService,
  WorkPhoto,
} from "./types";

/**
 * Content repository (server-only).
 *
 * Reads Supabase when configured; otherwise serves the PRD seed content so
 * the public site is fully functional before credentials exist. Public
 * pages read published items only (PRD §3.2: server reads, never browser).
 * Admin writes revalidate the affected paths.
 */

async function readTable<T>(table: string): Promise<T[] | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const db = getSupabaseAdminClient();
    const { data, error } = await db.from(table).select("*");
    if (error) throw error;
    return (data ?? []) as T[];
  } catch {
    // Unreachable schema or network issue: fall back to seed content so
    // the public site never breaks.
    return null;
  }
}

const published = <T extends { status?: string }>(rows: T[]): T[] =>
  rows.filter((r) => r.status === undefined || r.status === "published");

const byOrder = <T,>(rows: T[]): T[] =>
  [...rows].sort(
    (a, b) =>
      ((a as { order?: number }).order ?? 0) -
      ((b as { order?: number }).order ?? 0)
  );

/**
 * Supabase rows win when present; an EMPTY table (migration run, admin
 * hasn't populated content yet) falls back to the seed so the public site
 * is never blank.
 */
function rowsOrSeed<T>(raw: T[] | null, seed: T[]): T[] {
  return raw && raw.length > 0 ? raw : seed;
}

export interface SiteContent {
  categories: ServiceCategory[];
  subServices: SubService[];
  faqs: Faq[];
  blogs: BlogPost[];
  reviews: Review[];
  photos: WorkPhoto[];
  areas: ServiceArea[];
  pages: LegalOrAboutPage[];
  settings: SiteSettings;
  /** True when live content came from Supabase (vs seed fallback). */
  live: boolean;
}

export const getSiteContent = cache(async (): Promise<SiteContent> => {
  const [
    categoriesRaw,
    subRaw,
    faqRaw,
    blogRaw,
    reviewRaw,
    photoRaw,
    areaRaw,
    pageRaw,
    settingsRaw,
  ] = await Promise.all([
    readTable<ServiceCategory>("services"),
    readTable<SubService>("sub_services"),
    readTable<Faq>("faqs"),
    readTable<BlogPost>("blogs"),
    readTable<Review>("reviews"),
    readTable<WorkPhoto>("photos"),
    readTable<ServiceArea>("areas"),
    readTable<LegalOrAboutPage>("pages"),
    readTable<SiteSettings>("settings"),
  ]);

  const live = categoriesRaw !== null;

  return {
    categories: byOrder(
      published(rowsOrSeed(categoriesRaw, seedCategories as ServiceCategory[]))
    ),
    subServices: byOrder(published(rowsOrSeed(subRaw, seedSubServices))),
    faqs: byOrder(published(rowsOrSeed(faqRaw, seedFaqs))),
    blogs: byOrder(published(blogRaw ?? [])),
    reviews: byOrder(published(reviewRaw ?? [])),
    photos: byOrder(published(rowsOrSeed(photoRaw, seedPhotos))),
    areas: byOrder(published(areaRaw ?? [])),
    pages: published(rowsOrSeed(pageRaw, seedPages())),
    settings: settingsRaw?.[0] ?? seedSettings,
    live,
  };
});

function seedPages(): LegalOrAboutPage[] {
  return [
    {
      key: "about",
      title: { ar: "من نحن", en: "About Us" },
      content: {
        ar: "للتبريد والتكييف مشروع رياضي متخصص في خدمة المنازل منذ عام 2013، بخبرة عملية تتجاوز 16 عامًا في التبريد والتكييف.\n\nنخدم جميع أحياء الرياض: صيانة المكيفات وإصلاحها وتنظيفها وتركيبها، وإصلاح الثلاجات والغسالات وصيانتها — في منزلك دون الحاجة إلى نقل الأجهزة.\n\nنستقبل بلاغات الطوارئ يوميًا من 10 صباحًا حتى 11 مساءً.\n\nطريقة عملنا بسيطة وواضحة: تتواصل معنا هاتفيًا أو عبر واتساب، تخبرنا بالخدمة المطلوبة، يتواصل معك الفني لتنسيق الزيارة، ثم تُنجز الخدمة في منزلك.",
        en: "للتبريد والتكييف is a Riyadh home-service business established in 2013, with over 16 years of hands-on experience in cooling and refrigeration.\n\nWe serve all Riyadh areas: AC repair, cleaning and installation, plus refrigerator and washing machine repair and maintenance — at your home, with no need to move appliances.\n\nWe receive emergency reports daily from 10 AM to 11 PM.\n\nOur process is simple: call or WhatsApp us, tell us the service you need, a technician contacts you to arrange the visit, and the work is done at your home.",
      },
      status: "published",
    },
    {
      key: "privacy",
      title: { ar: "سياسة الخصوصية", en: "Privacy Policy" },
      content: {
        ar: "لا ينشئ هذا الموقع حسابات للعملاء ولا يحتفظ ببيانات الحجز. عند استخدام زر «احجز الخدمة» تُضاف البيانات التي تدخلها إلى رسالة واتساب ترسلها أنت إلينا.\n\nنستخدم المتصفح فقط لتذكّر لغتك المفضلة وما إذا كنت قد أغلقت نافذة تثبيت التطبيق. لا نستخدم ملفات تعريف الارتباط للتحليلات أو الإعلانات.\n\nللتواصل: 966535757650+",
        en: "This website does not create customer accounts or store booking details. When you use Book Service, the details you enter are placed in a WhatsApp message that you send to us yourself.\n\nWe use your browser only to remember your language choice and whether you dismissed the install prompt. We do not use analytics or advertising cookies.\n\nContact us at +966 53 575 7650.",
      },
      status: "published",
    },
    {
      key: "terms",
      title: { ar: "الشروط والأحكام", en: "Terms & Conditions" },
      content: {
        ar: "المعلومات المعروضة في هذا الموقع عامة. يتم تأكيد نطاق الخدمة وموعدها وتكلفتها معك مباشرة عبر الاتصال أو واتساب قبل بدء أي عمل.",
        en: "Information on this website is general. Service scope, timing and pricing are confirmed directly with you by phone or WhatsApp before any work begins.",
      },
      status: "published",
    },
  ];
}

export async function getPageContent(
  key: LegalOrAboutPage["key"]
): Promise<LegalOrAboutPage | undefined> {
  const content = await getSiteContent();
  return content.pages.find((p) => p.key === key);
}

export async function getCategory(slug: string) {
  const { categories } = await getSiteContent();
  return categories.find((c) => c.slug === slug);
}

export async function getSubServicesOf(categorySlug: string) {
  const { subServices } = await getSiteContent();
  return subServices.filter((s) => s.categorySlug === categorySlug);
}

export async function getSubService(slug: string, categorySlug: string) {
  const { subServices } = await getSiteContent();
  return subServices.find(
    (s) => s.slug === slug && s.categorySlug === categorySlug
  );
}

export async function getFaqsFor(categorySlug?: string) {
  const { faqs } = await getSiteContent();
  return faqs.filter(
    (f) => !categorySlug || f.categorySlug === undefined || f.categorySlug === categorySlug
  );
}
