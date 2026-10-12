import type { MetadataRoute } from "next";

import { DEFAULT_LANG, LANGS } from "@/i18n/config";
import { getSiteContent } from "@/lib/content/repo";
import { getSiteUrl } from "@/lib/seo";

/**
 * sitemap.xml (PRD §11): public published pages only, with hreflang
 * alternates per language.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl();
  const { categories, subServices, blogs } = await getSiteContent();

  const entry = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: `${site}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority,
    alternates: {
      languages: Object.fromEntries(
        LANGS.map((lang) => [lang, `${site}/${lang}${path === "/" ? "" : path}`])
      ),
    },
  });

  const staticPaths: Array<[string, number]> = [
    ["", 1],
    ["/services", 0.9],
    ["/work", 0.5],
    ["/blog", 0.6],
    ["/areas", 0.7],
    ["/about", 0.6],
    ["/contact", 0.7],
    ["/book", 0.8],
    ["/privacy", 0.3],
    ["/terms", 0.3],
  ];

  return [
    ...staticPaths.map(([p, prio]) => entry(p, prio)),
    ...categories.flatMap((c) => [
      entry(`/services/${c.slug}`, 0.8),
      ...subServices
        .filter((s) => s.categorySlug === c.slug)
        .map((s) => entry(`/services/${c.slug}/${s.slug}`, 0.7)),
    ]),
    ...blogs.map((b) => entry(`/blog/${b.slug}`, 0.5)),
  ].map((e) => (e.priority === 1 && e.url.endsWith(site) ? { ...e, priority: DEFAULT_LANG === "ar" ? 1 : 1 } : e));
}
