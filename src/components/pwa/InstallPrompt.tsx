"use client";

import { useEffect, useRef, useState } from "react";
import { Share, X } from "lucide-react";

import type { Lang } from "@/i18n/config";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const COPY = {
  ar: {
    title: "ثبّت تطبيقنا",
    text: "وصول أسرع لخدماتنا من جوالك.",
    install: "ثبّت الآن",
    later: "ربما لاحقًا",
    iosTitle: "أضف الموقع إلى شاشتك الرئيسية",
    iosSteps: ["اضغط زر المشاركة", "اختر «إضافة إلى الشاشة الرئيسية»", "اضغط «إضافة»"],
  },
  en: {
    title: "Install our app",
    text: "Faster access to our services from your phone.",
    install: "Install Now",
    later: "Maybe Later",
    iosTitle: "Add to Home Screen",
    iosSteps: ["Tap the Share button", "Choose “Add to Home Screen”", "Tap “Add”"],
  },
} as const;

const LATER_KEY = "install-later-until";
const DISMISS_KEY = "install-dismissals";
const SNOOZE_DAYS = 14;
const MAX_DISMISSALS = 3;

/**
 * Smart install popup (PRD §10, A19): Android → native beforeinstallprompt;
 * iOS → Add-to-Home-Screen guidance. Gated on real engagement (≥20s on
 * site AND ≥2 scroll/click interactions, or a 2nd page view), never on
 * /book, never when installed, 14-day snooze, max 3 dismissals.
 */
export function InstallPrompt({ lang }: { lang: Lang }) {
  const t = COPY[lang];
  const [visible, setVisible] = useState(false);
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIos, setIsIos] = useState(false);
  const engaged = useRef({ start: 0, interactions: 0, done: false });

  useEffect(() => {
    // Mobile-only (PRD §10): desktop browsers have no meaningful install flow.
    const mobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent);
    if (!mobile) return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // iOS Safari standalone
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) return;
    if (window.location.pathname.includes("/book")) return;

    const laterUntil = Number(localStorage.getItem(LATER_KEY) ?? 0);
    if (Date.now() < laterUntil) return;
    const dismissals = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
    if (dismissals >= MAX_DISMISSALS) return;

    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);

    function onPrompt(e: Event) {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    }
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", () => setVisible(false));

    engaged.current.start = Date.now();
    const count = () => {
      engaged.current.interactions += 1;
    };
    window.addEventListener("scroll", count, { passive: true });
    document.addEventListener("click", count);

    // Engagement gate checked on an interval (async state updates only).
    const timer = setInterval(() => {
      const seconds = (Date.now() - engaged.current.start) / 1000;
      const pageViews =
        Number(sessionStorage.getItem("page-views") ?? 0) + 1;
      sessionStorage.setItem("page-views", String(pageViews));
      const engagedEnough =
        (seconds >= 20 && engaged.current.interactions >= 2) || pageViews >= 2;
      if (engagedEnough) {
        engaged.current.done = true;
        setIsIos(ios);
        setVisible(true);
        clearInterval(timer);
      }
    }, 5000);

    return () => {
      clearInterval(timer);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("scroll", count);
      document.removeEventListener("click", count);
    };
  }, []);

  function snooze() {
    localStorage.setItem(
      LATER_KEY,
      String(Date.now() + SNOOZE_DAYS * 24 * 60 * 60 * 1000)
    );
    const d = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
    localStorage.setItem(DISMISS_KEY, String(d + 1));
    setVisible(false);
  }

  async function install() {
    if (deferred) {
      await deferred.prompt();
      await deferred.userChoice;
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-3 bottom-[5.5rem] z-50 mx-auto max-w-md rounded-2xl border border-line bg-bg p-5 shadow-s3 md:bottom-6"
      role="dialog"
      aria-label={t.title}
    >
      <button
        type="button"
        onClick={snooze}
        aria-label={t.later}
        className="absolute end-3 top-3 inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-muted transition hover:bg-surface"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
      {isIos || !deferred ? (
        <>
          <h2 className="font-heading text-lg font-bold text-ink">{t.iosTitle}</h2>
          <ol className="mt-3 space-y-2 text-sm text-ink-2">
            {t.iosSteps.map((step, i) => (
              <li key={step} className="flex items-center gap-2">
                <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-accent-tint text-xs font-bold text-accent">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted">
            <Share className="size-4" aria-hidden="true" />
            {t.text}
          </p>
        </>
      ) : (
        <>
          <h2 className="font-heading text-lg font-bold text-ink">{t.title}</h2>
          <p className="mt-1 text-sm text-ink-2">{t.text}</p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={install}
              className="min-h-12 flex-1 cursor-pointer rounded-full bg-accent font-semibold text-white shadow-glow transition hover:bg-accent-hover"
            >
              {t.install}
            </button>
            <button
              type="button"
              onClick={snooze}
              className="min-h-12 cursor-pointer rounded-full border-[1.5px] border-ink px-5 font-semibold text-ink transition hover:bg-surface"
            >
              {t.later}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
