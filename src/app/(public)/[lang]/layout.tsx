import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import { getDir, isLang } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { barlowCondensed, inter, plexArabic } from "@/lib/fonts";
import { getSiteUrl, localBusinessJsonLd } from "@/lib/seo";
import { getSiteContent } from "@/lib/content/repo";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomBar } from "@/components/layout/MobileBottomBar";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { JsonLd } from "@/components/seo/JsonLd";
import { ServiceWorkerRegister } from "@/components/pwa/ServiceWorkerRegister";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { IntroCurtain } from "@/components/motion/IntroCurtain";

import "../../globals.css";

export function generateStaticParams() {
  return [{ lang: "ar" }, { lang: "en" }];
}

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
};

export const viewport: Viewport = {
  themeColor: "#D93A17",
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

/**
 * Public root layout (multiple-root-layout pattern): owns <html lang dir>
 * for the /ar (RTL) and /en (LTR) trees. Only the font variables the
 * language needs are applied, so Arabic pages never download the Latin
 * display fonts and vice versa (PRD §4.3).
 */
export default async function PublicRootLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const [dict, content] = await Promise.all([getDictionary(lang), getSiteContent()]);
  const dir = getDir(lang);
  const fontVars =
    lang === "ar"
      ? plexArabic.variable
      : `${inter.variable} ${barlowCondensed.variable}`;

  const navCategories = content.categories.map((c) => ({
    slug: c.slug,
    name: c.name[lang],
    subs: content.subServices
      .filter((s) => s.categorySlug === c.slug)
      .map((s) => ({ slug: s.slug, name: s.name[lang] })),
  }));

  return (
    <html lang={lang} dir={dir} className={`${fontVars} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <JsonLd data={localBusinessJsonLd(getSiteUrl())} />
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:start-0 focus:top-0 focus:z-50 focus:bg-ink focus:px-4 focus:py-3 focus:text-bg"
        >
          {dict.a11y.skipToContent}
        </a>
        <IntroCurtain />
        <Header
          lang={lang}
          dict={dict}
          categories={navCategories}
          showBlogs={content.blogs.length > 0}
          showWork={content.photos.length > 0}
        />
        <MotionProvider>
          <main
            id="content"
            className="flex-1 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0"
          >
            {children}
          </main>
          <MobileBottomBar lang={lang} dict={dict} />
        </MotionProvider>
        <Footer lang={lang} dict={dict} />
        <ServiceWorkerRegister />
        <InstallPrompt lang={lang} />
      </body>
    </html>
  );
}
