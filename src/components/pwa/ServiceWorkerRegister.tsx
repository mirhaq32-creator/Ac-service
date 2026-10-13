"use client";

import { useEffect } from "react";

/**
 * Registers the service worker in production only.
 *
 * In development it actively REMOVES any service worker left over from a
 * previous production visit on this origin (and clears its caches) — a
 * stale SW otherwise keeps controlling localhost and serves outdated
 * cached responses over the dev server.
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // SW is an enhancement; the site works fully without it.
      });
      return;
    }

    // Development: clean up any production-era SW + caches.
    navigator.serviceWorker
      .getRegistrations()
      .then((registrations) => {
        registrations.forEach((registration) => registration.unregister());
      })
      .catch(() => {
        // best-effort cleanup
      });
    if ("caches" in window) {
      caches
        .keys()
        .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
        .catch(() => {
          // best-effort cleanup
        });
    }
  }, []);
  return null;
}
