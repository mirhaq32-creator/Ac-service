import type { Metadata } from "next";

import { inter } from "@/lib/fonts";

import "../../globals.css";

export const metadata: Metadata = {
  title: "Control Panel | Admin",
  robots: { index: false, follow: false },
};

/**
 * Admin root layout (multiple-root-layout pattern).
 * English-only, always LTR — independent from the public site's EN/AR system.
 */
export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-surface text-ink-2">{children}</body>
    </html>
  );
}
