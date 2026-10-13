"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronLeft, MapPin, Paperclip } from "lucide-react";

import { BUSINESS } from "@/lib/business";
import type { Lang } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";

export interface BookOption {
  categorySlug: string;
  categoryName: string;
  slug: string;
  name: string;
}

type Answers = {
  service: string;
  sub: string;
  locationMethod: "manual" | "geo";
  locationText: string;
  geoUrl: string;
  problem: string;
  timeWhen: "asap" | "today" | "pick";
  date: string;
  time: string;
  name: string;
  phone: string;
  photoNote: boolean;
  notes: string;
};

const EMPTY: Answers = {
  service: "",
  sub: "",
  locationMethod: "manual",
  locationText: "",
  geoUrl: "",
  problem: "",
  timeWhen: "asap",
  date: "",
  time: "",
  name: "",
  phone: "",
  photoNote: false,
  notes: "",
};

const STORAGE_KEY = "booking-draft";

function normalizeSaudiPhone(raw: string): string | null {
  const digits = raw.replace(/[^\d+]/g, "");
  if (/^\+9665\d{8}$/.test(digits)) return digits;
  if (/^9665\d{8}$/.test(digits)) return `+${digits}`;
  if (/^05\d{8}$/.test(digits)) return `+966${digits.slice(1)}`;
  if (/^5\d{8}$/.test(digits)) return `+966${digits}`;
  return null;
}

/**
 * Booking flow (PRD §8): 6 screens + review → builds a wa.me message in
 * the browser and opens WhatsApp. NOTHING is stored or transmitted to any
 * server (D1) — state lives in sessionStorage only, cleared after send.
 */
export function BookingFlow({
  lang,
  dict,
  categories,
  subs,
}: {
  lang: Lang;
  dict: Dictionary;
  categories: Array<{ slug: string; name: string }>;
  subs: Array<{ categorySlug: string; slug: string; name: string }>;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [geoState, setGeoState] = useState<"idle" | "busy" | "denied">("idle");
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);
  const [touched, setTouched] = useState(false);

  // Load draft + URL prefill (?service=&sub=) after mount (async so the
  // initial render stays hydration-stable with the server HTML).
  useEffect(() => {
    const t = setTimeout(() => {
      let initial = { ...EMPTY };
      try {
        const saved = sessionStorage.getItem(STORAGE_KEY);
        if (saved) initial = { ...initial, ...JSON.parse(saved) };
      } catch {
        // ignore corrupt drafts
      }
      const svc = searchParams.get("service");
      const sub = searchParams.get("sub");
      if (svc && categories.some((c) => c.slug === svc)) initial.service = svc;
      if (sub) initial.sub = sub;
      setAnswers(initial);
    }, 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (answers !== EMPTY) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  const steps = [
    dict.book.steps.service,
    dict.book.steps.location,
    dict.book.steps.problem,
    dict.book.steps.time,
    dict.book.steps.details,
    dict.book.steps.review,
  ];

  const subsForService = useMemo(
    () => subs.filter((s) => s.categorySlug === answers.service),
    [subs, answers.service]
  );

  const service = categories.find((c) => c.slug === answers.service);
  const subName = subs.find(
    (s) => s.categorySlug === answers.service && s.slug === answers.sub
  )?.name;

  const phoneOk = answers.phone === "" ? false : normalizeSaudiPhone(answers.phone);
  const canNext =
    (step === 0 && answers.service !== "") ||
    step === 1 ||
    step === 2 ||
    (step === 3 && (answers.timeWhen !== "pick" || (answers.date && answers.time))) ||
    (step === 4 && answers.name.trim() !== "" && !!phoneOk) ||
    step === 5;

  function next() {
    setTouched(true);
    if (!canNext) return;
    setTouched(false);
    setStep((s) => Math.min(s + 1, 5));
  }

  function buildMessage(): { text: string; wa: string } {
    const isAr = lang === "ar";
    const L: string[] = [];
    L.push(isAr ? "السلام عليكم، أرغب بحجز خدمة." : "Hello, I'd like to book a service.");
    L.push(`${isAr ? "الخدمة" : "Service"}: ${service?.name ?? ""}`);
    if (subName) L.push(`${isAr ? "الخدمة الفرعية" : "Sub-service"}: ${subName}`);
    if (answers.problem) L.push(`${isAr ? "المشكلة" : "Problem"}: ${answers.problem}`);
    L.push(`${isAr ? "الاسم" : "Name"}: ${answers.name}`);
    L.push(`${isAr ? "الجوال" : "Phone"}: ${phoneOk ?? answers.phone}`);
    const loc = [
      answers.locationText,
      answers.geoUrl,
    ]
      .filter(Boolean)
      .join(isAr ? " — " : " — ");
    if (loc) L.push(`${isAr ? "الموقع" : "Location"}: ${loc}`);
    const time =
      answers.timeWhen === "asap"
        ? isAr
          ? "في أقرب وقت"
          : "As soon as possible"
        : answers.timeWhen === "today"
          ? isAr
            ? "اليوم"
            : "Today"
          : `${answers.date} ${answers.time}`;
    L.push(`${isAr ? "الوقت المناسب" : "Preferred time"}: ${time}`);
    if (answers.photoNote)
      L.push(isAr ? "سأرسل صورة/فيديو للمشكلة في واتساب." : "I'll send a photo/video in WhatsApp.");
    if (answers.notes) L.push(`${isAr ? "ملاحظات" : "Notes"}: ${answers.notes}`);
    L.push(isAr ? "(أُرسلت من الموقع)" : "(Sent from the website)");
    const text = L.join("\n");
    return { text, wa: `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(text)}` };
  }

  function send() {
    const { wa } = buildMessage();
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // storage may be unavailable; nothing else to clear
    }
    setSent(true);
    window.open(wa, "_blank", "noopener");
  }

  const { text } = buildMessage();

  // ── Success screen ──────────────────────────────────────────────
  if (sent) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-line bg-bg p-8 text-center shadow-s2">
        <span className="mx-auto inline-flex size-16 items-center justify-center rounded-full bg-success/10">
          <Check className="size-9 text-success" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-heading text-2xl font-bold text-ink">
          {dict.book.success.title}
        </h2>
        <p className="mt-2 text-ink-2">{dict.book.success.body}</p>
        <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted">
          <Paperclip className="size-4" aria-hidden="true" />
          {dict.book.success.attachReminder}
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <a
            href={`https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(text)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-12 items-center justify-center rounded-full bg-[#25D366] font-semibold text-white"
          >
            {dict.book.success.openAgain}
          </a>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(text);
                setCopied(true);
              } catch {
                setCopied(false);
              }
            }}
            className="min-h-12 cursor-pointer rounded-full border-[1.5px] border-ink font-semibold text-ink transition hover:bg-surface"
          >
            {copied ? dict.book.success.copied : dict.book.success.copy}
          </button>
          <a
            href={BUSINESS.phoneHref}
            className="flex min-h-12 items-center justify-center rounded-full bg-ink font-semibold text-white"
          >
            {dict.book.success.callInstead}
          </a>
        </div>
        <button
          type="button"
          onClick={() => router.push(`/${lang}`)}
          className="mt-6 min-h-12 cursor-pointer text-sm font-semibold text-accent"
        >
          {lang === "ar" ? "العودة للرئيسية" : "Back to home"}
        </button>
      </div>
    );
  }

  const fieldCls =
    "min-h-12 w-full rounded-xl border border-line bg-bg px-4 text-ink outline-none transition placeholder:text-muted focus:border-accent focus:shadow-s1";
  const chipCls = (active: boolean) =>
    `flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-xl border px-4 text-start font-medium transition ${
      active
        ? "border-accent bg-accent-tint text-accent"
        : "border-line bg-bg text-ink hover:border-accent/50"
    }`;

  return (
    <div className="mx-auto max-w-xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm font-medium text-muted">
          <span>
            {steps[step]} · {step + 1}/{steps.length}
          </span>
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="inline-flex min-h-10 cursor-pointer items-center gap-1 text-accent"
            >
              <ChevronLeft className="size-4 rotate-180 rtl:rotate-0" aria-hidden="true" />
              {dict.book.back}
            </button>
          ) : null}
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-accent transition-all duration-300"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 0 — Service (+ optional sub-service) */}
      {step === 0 ? (
        <div className="space-y-6">
          <fieldset>
            <legend className="font-heading text-xl font-bold text-ink">
              {dict.book.steps.service}
            </legend>
            <div className="mt-4 space-y-2">
              {categories.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setAnswers((a) => ({ ...a, service: c.slug, sub: "" }))}
                  className={chipCls(answers.service === c.slug)}
                >
                  {c.name}
                  {answers.service === c.slug ? (
                    <Check className="ms-auto size-5" aria-hidden="true" />
                  ) : null}
                </button>
              ))}
            </div>
          </fieldset>
          {subsForService.length > 0 ? (
            <fieldset>
              <legend className="text-sm font-semibold text-muted">
                {dict.book.steps.subService}
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {subsForService.map((s) => (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() =>
                      setAnswers((a) => ({ ...a, sub: a.sub === s.slug ? "" : s.slug }))
                    }
                    className={`min-h-10 cursor-pointer rounded-full border px-4 text-sm font-medium transition ${
                      answers.sub === s.slug
                        ? "border-accent bg-accent-tint text-accent"
                        : "border-line text-ink hover:border-accent/50"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </fieldset>
          ) : null}
        </div>
      ) : null}

      {/* Step 1 — Location */}
      {step === 1 ? (
        <fieldset className="space-y-4">
          <legend className="font-heading text-xl font-bold text-ink">
            {dict.book.location.title}
          </legend>
          <div className="rounded-xl border border-line bg-bg p-4">
            <label htmlFor="loc-text" className="text-sm font-semibold text-muted">
              {dict.book.location.manualLabel}
            </label>
            <input
              id="loc-text"
              type="text"
              value={answers.locationText}
              onChange={(e) => setAnswers((a) => ({ ...a, locationText: e.target.value }))}
              placeholder={dict.book.location.manual}
              className={`${fieldCls} mt-2`}
            />
          </div>
          <button
            type="button"
            onClick={() => {
              if (!("geolocation" in navigator)) {
                setGeoState("denied");
                return;
              }
              setGeoState("busy");
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  const { latitude, longitude } = pos.coords;
                  setAnswers((a) => ({
                    ...a,
                    geoUrl: `https://maps.google.com/?q=${latitude},${longitude}`,
                  }));
                  setGeoState("idle");
                },
                () => setGeoState("denied"),
                { timeout: 8000 }
              );
            }}
            className="flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-surface font-semibold text-ink transition hover:border-accent/50"
          >
            <MapPin className="size-5 text-accent" aria-hidden="true" />
            {geoState === "busy" ? dict.book.location.detecting : dict.book.location.useMine}
          </button>
          {answers.geoUrl ? (
            <p className="flex items-center gap-2 text-sm text-success">
              <Check className="size-4" aria-hidden="true" />
              <span dir="ltr">{answers.geoUrl}</span>
            </p>
          ) : null}
          {geoState === "denied" ? (
            <p className="text-sm text-warn">{dict.book.location.denied}</p>
          ) : null}
        </fieldset>
      ) : null}

      {/* Step 2 — Problem */}
      {step === 2 ? (
        <fieldset>
          <legend className="font-heading text-xl font-bold text-ink">
            {dict.book.problem.title}
          </legend>
          <p className="mt-1 text-sm text-muted">{dict.book.problem.hint}</p>
          <textarea
            rows={4}
            value={answers.problem}
            onChange={(e) => setAnswers((a) => ({ ...a, problem: e.target.value }))}
            placeholder={dict.book.problem.placeholder}
            className={`${fieldCls} mt-4 py-3`}
          />
        </fieldset>
      ) : null}

      {/* Step 3 — Time */}
      {step === 3 ? (
        <fieldset className="space-y-2">
          <legend className="font-heading text-xl font-bold text-ink">
            {dict.book.time.title}
          </legend>
          {(
            [
              ["asap", dict.book.time.asap],
              ["today", dict.book.time.today],
              ["pick", dict.book.time.pick],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setAnswers((a) => ({ ...a, timeWhen: value }))}
              className={chipCls(answers.timeWhen === value)}
            >
              {label}
            </button>
          ))}
          {answers.timeWhen === "pick" ? (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label htmlFor="bk-date" className="text-sm font-semibold text-muted">
                  {dict.book.time.date}
                </label>
                <input
                  id="bk-date"
                  type="date"
                  value={answers.date}
                  onChange={(e) => setAnswers((a) => ({ ...a, date: e.target.value }))}
                  className={`${fieldCls} mt-1`}
                />
              </div>
              <div>
                <label htmlFor="bk-time" className="text-sm font-semibold text-muted">
                  {dict.book.time.timeLabel}
                </label>
                <input
                  id="bk-time"
                  type="time"
                  min="10:00"
                  max="23:00"
                  value={answers.time}
                  onChange={(e) => setAnswers((a) => ({ ...a, time: e.target.value }))}
                  className={`${fieldCls} mt-1`}
                />
              </div>
            </div>
          ) : null}
        </fieldset>
      ) : null}

      {/* Step 4 — Details */}
      {step === 4 ? (
        <fieldset className="space-y-4">
          <legend className="font-heading text-xl font-bold text-ink">
            {dict.book.details.title}
          </legend>
          <div>
            <label htmlFor="bk-name" className="text-sm font-semibold text-muted">
              {dict.book.details.name} *
            </label>
            <input
              id="bk-name"
              type="text"
              required
              value={answers.name}
              onChange={(e) => setAnswers((a) => ({ ...a, name: e.target.value }))}
              className={`${fieldCls} mt-1 ${touched && !answers.name.trim() ? "border-danger" : ""}`}
              aria-invalid={touched && !answers.name.trim()}
            />
            {touched && !answers.name.trim() ? (
              <p className="mt-1 text-sm text-danger">{dict.book.details.required}</p>
            ) : null}
          </div>
          <div>
            <label htmlFor="bk-phone" className="text-sm font-semibold text-muted">
              {dict.book.details.phone} *
            </label>
            <input
              id="bk-phone"
              type="tel"
              dir="ltr"
              inputMode="tel"
              required
              value={answers.phone}
              onChange={(e) => setAnswers((a) => ({ ...a, phone: e.target.value }))}
              placeholder={dict.book.details.phoneHint}
              className={`${fieldCls} mt-1 ${touched && !phoneOk ? "border-danger" : ""}`}
              aria-invalid={touched && !phoneOk}
            />
            {touched && !phoneOk ? (
              <p className="mt-1 text-sm text-danger">{dict.book.details.invalidPhone}</p>
            ) : null}
          </div>
          <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-line bg-bg px-4 text-sm font-medium text-ink">
            <input
              type="checkbox"
              checked={answers.photoNote}
              onChange={(e) => setAnswers((a) => ({ ...a, photoNote: e.target.checked }))}
              className="size-5 accent-[#D93A17]"
            />
            {dict.book.details.photo}
          </label>
          <div>
            <label htmlFor="bk-notes" className="text-sm font-semibold text-muted">
              {dict.book.details.notes}
            </label>
            <textarea
              id="bk-notes"
              rows={3}
              value={answers.notes}
              onChange={(e) => setAnswers((a) => ({ ...a, notes: e.target.value }))}
              className={`${fieldCls} mt-1 py-3`}
            />
          </div>
        </fieldset>
      ) : null}

      {/* Step 5 — Review */}
      {step === 5 ? (
        <div>
          <h2 className="font-heading text-xl font-bold text-ink">
            {dict.book.review.title}
          </h2>
          <dl className="mt-4 divide-y divide-line rounded-2xl border border-line bg-bg">
            {(
              [
                [dict.book.steps.service, `${service?.name ?? ""}${subName ? ` — ${subName}` : ""}`],
                [dict.book.steps.location, [answers.locationText, answers.geoUrl].filter(Boolean).join(" — ")],
                [dict.book.steps.problem, answers.problem],
                [
                  dict.book.steps.time,
                  answers.timeWhen === "asap"
                    ? dict.book.time.asap
                    : answers.timeWhen === "today"
                      ? dict.book.time.today
                      : `${answers.date} ${answers.time}`,
                ],
                [dict.book.details.name, answers.name],
                [dict.book.details.phone, phoneOk ?? answers.phone],
                [dict.book.details.notes, answers.notes],
              ] as Array<[string, string]>
            )
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k} className="flex items-start justify-between gap-4 px-4 py-3">
                  <dt className="shrink-0 text-sm font-semibold text-muted">{k}</dt>
                  <dd className="text-end font-medium text-ink" dir="auto">
                    {v}
                  </dd>
                </div>
              ))}
          </dl>
        </div>
      ) : null}

      {/* Actions */}
      <div className="mt-8 flex gap-3">
        {step < 5 ? (
          <button
            type="button"
            onClick={next}
            disabled={!canNext}
            className="min-h-14 flex-1 cursor-pointer rounded-full bg-accent font-semibold text-white shadow-glow transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {dict.book.next}
          </button>
        ) : (
          <button
            type="button"
            onClick={send}
            className="min-h-14 flex-1 cursor-pointer rounded-full bg-[#25D366] font-semibold text-white shadow-s2 transition hover:brightness-105"
          >
            {dict.book.review.send}
          </button>
        )}
      </div>
    </div>
  );
}
