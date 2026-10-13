import { plexArabic } from "@/lib/fonts";

import "../../globals.css";

/** Minimal root layout for the offline fallback page (bilingual by design). */
export default function OfflineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" className={`${plexArabic.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-bg">{children}</body>
    </html>
  );
}
