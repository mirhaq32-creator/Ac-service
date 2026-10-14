"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import {
  AirVent,
  CalendarCheck,
  ChevronDown,
  Refrigerator,
  Siren,
  WashingMachine,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { Lang } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import type { ApprovedImage } from "@/lib/content/images";

const icons: Record<string, LucideIcon> = {
  ac: AirVent,
  refrigerator: Refrigerator,
  "washing-machine": WashingMachine,
  emergency: Siren,
};

/**
 * Quick Service cards (PRD §7.2 H4): photo tops where an approved photo
 * exists, icon badge otherwise (no invented imagery). Clicking a card
 * expands its sub-service chips; each chip leads to the booking page.
 * Emergency is present but calm (D14).
 */
export function QuickServices({
  lang,
  dict,
  images = {},
}: {
  lang: Lang;
  dict: Dictionary;
  /** Optional approved photo per category id (ac | refrigerator | …). */
  images?: Partial<Record<string, ApprovedImage>>;
}) {
  const { items, title, subtitle } = dict.home.services;
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div>
      <h2 className="font-heading text-3xl font-bold text-ink md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-lg text-muted">{subtitle}</p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => {
          const Icon = icons[item.id] ?? Wrench;
          const open = openId === item.id;
          const panelId = `${baseId}-${item.id}`;
          const img = images[item.id];
          return (
            <div
              key={item.id}
              className={`flex flex-col overflow-hidden rounded-2xl border bg-bg transition-shadow duration-200 ${
                open
                  ? "border-accent/40 shadow-s2"
                  : "border-line hover:shadow-s2"
              }`}
            >
              <button
                type="button"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
                className="flex min-h-12 flex-1 cursor-pointer flex-col items-start text-start"
              >
                {img ? (
                  <span className="relative block h-36 w-full">
                    <Image
                      src={img.src}
                      alt={img.alt[lang]}
                      fill
                      loading="lazy"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
                      className="object-cover transition duration-300 hover:scale-[1.04]"
                    />
                    <span
                      className={`absolute bottom-3 start-3 inline-flex size-11 items-center justify-center rounded-xl shadow-s2 ${
                        item.id === "emergency"
                          ? "bg-accent text-white"
                          : "bg-bg text-accent"
                      }`}
                    >
                      <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                    </span>
                  </span>
                ) : (
                  <span
                    className={`mx-5 mt-5 inline-flex size-12 items-center justify-center rounded-xl ${
                      item.id === "emergency"
                        ? "bg-accent-tint text-accent"
                        : "bg-surface-2 text-ink"
                    }`}
                  >
                    <Icon className="size-6" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                )}
                <span className="mt-4 px-5 font-heading text-xl font-bold text-ink">
                  {item.title}
                </span>
                <span className="mt-2 px-5 text-sm leading-relaxed text-muted">
                  {item.desc}
                </span>
                <span className="mt-3 mb-4 inline-flex items-center gap-1 px-5 text-sm font-semibold text-accent">
                  {dict.a11y.expandService}
                  <ChevronDown
                    className={`size-4 transition-transform duration-200 ${
                      open ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </span>
              </button>
              <div
                id={panelId}
                hidden={!open}
                className="mt-auto flex flex-wrap gap-2 border-t border-line p-4"
              >
                {item.subs.map((sub) => (
                  <Link
                    key={sub}
                    href={`/${lang}/book`}
                    className="inline-flex min-h-10 items-center rounded-full bg-surface-2 px-3.5 text-sm font-medium text-ink transition hover:bg-accent-tint hover:text-accent"
                  >
                    {sub}
                  </Link>
                ))}
                <Link
                  href={`/${lang}/book`}
                  className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-ink px-3.5 text-sm font-semibold text-bg transition hover:bg-ink-2"
                >
                  <CalendarCheck className="size-4" aria-hidden="true" />
                  {dict.cta.bookService}
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
