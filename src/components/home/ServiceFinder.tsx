"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, Wrench, X } from "lucide-react";

import type { Lang } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

export interface FinderItem {
  categorySlug: string;
  category: string;
  slug: string;
  name: string;
}

/**
 * Smart Service Finder (PRD §7.2 H2 + §4 services search): type-to-filter
 * over all problem/service chips; results deep-link to the matching
 * service page. Falls back to the curated chip grid when empty query.
 */
export function ServiceFinder({
  lang,
  dict,
  items,
}: {
  lang: Lang;
  dict: Dictionary;
  items: FinderItem[];
}) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const results = useMemo(() => {
    if (!q) return items.slice(0, 9);
    return items.filter(
      (i) => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q)
    );
  }, [items, q]);

  return (
    <div>
      <h2 className="font-heading text-3xl font-bold text-ink md:text-4xl">
        {dict.home.finder.title}
      </h2>
      <p className="mt-3 text-lg text-muted">{dict.home.finder.subtitle}</p>

      <div className="relative mt-8 max-w-xl">
        <Search
          className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={lang === "ar" ? "ابحث عن مشكلة أو خدمة…" : "Search a problem or service…"}
          aria-label={dict.home.finder.title}
          className="min-h-14 w-full rounded-full border border-line bg-bg ps-12 pe-12 text-lg text-ink shadow-s1 outline-none transition placeholder:text-muted focus:border-accent focus:shadow-s2"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label={lang === "ar" ? "مسح" : "Clear"}
            className="absolute end-3 top-1/2 inline-flex size-8 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-muted transition hover:bg-surface"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {results.length === 0 ? (
        <p className="mt-6 text-muted">
          {lang === "ar"
            ? "لا نتائج مطابقة — جرّب كلمة أخرى أو اتصل بنا."
            : "No matches — try another word or call us."}
        </p>
      ) : (
        <ul className="mt-8 flex flex-wrap gap-3">
          {results.map((item) => (
            <li key={`${item.categorySlug}-${item.slug}`}>
              <Link
                href={`/${lang}/services/${item.categorySlug}/${item.slug}`}
                className="inline-flex min-h-12 items-center gap-2 rounded-full border border-line bg-bg px-5 font-medium text-ink transition duration-200 hover:border-accent hover:bg-accent-tint hover:text-accent"
              >
                <Wrench className="size-4 text-accent" aria-hidden="true" />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
