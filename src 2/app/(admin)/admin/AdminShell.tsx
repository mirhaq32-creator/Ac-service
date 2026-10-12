import Link from "next/link";
import { ExternalLink, LogOut, Snowflake } from "lucide-react";

import { requireAdmin } from "@/lib/admin/auth";
import { logoutAction } from "./actions";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/blogs", label: "Blogs" },
  { href: "/admin/photos", label: "Photos / Work" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/areas", label: "Areas" },
  { href: "/admin/pages/about", label: "About Page" },
  { href: "/admin/pages/privacy", label: "Privacy Policy" },
  { href: "/admin/pages/terms", label: "Terms & Conditions" },
  { href: "/admin/media", label: "Media Library" },
  { href: "/admin/settings", label: "Settings" },
];

/** Authenticated admin shell: English-only LTR sidebar + top bar. */
export async function AdminShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active: string;
}) {
  const email = await requireAdmin();

  return (
    <div className="flex min-h-svh flex-col lg:flex-row">
      <aside className="border-b border-line bg-ink p-4 text-surface lg:min-h-svh lg:w-64 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-white/10 text-accent-bright">
            <Snowflake className="size-6" strokeWidth={1.75} />
          </span>
          <span className="font-heading font-bold">Admin Panel</span>
        </div>
        <nav className="mt-6 flex flex-wrap gap-1 lg:flex-col" aria-label="Admin">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active === item.href ? "page" : undefined}
              className={`flex min-h-10 items-center rounded-xl px-3 text-sm transition ${
                active === item.href
                  ? "bg-accent font-semibold text-white"
                  : "text-surface/80 hover:bg-white/10 hover:text-surface"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-bg px-4 py-3">
          <a
            href="/en"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold text-ink transition hover:bg-surface"
          >
            <ExternalLink className="size-4" aria-hidden="true" />
            View Website
          </a>
          <div className="flex items-center gap-3">
            <span dir="ltr" className="hidden text-xs text-muted sm:block">
              {email}
            </span>
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-ink-2"
              >
                <LogOut className="size-4" aria-hidden="true" />
                Log Out
              </button>
            </form>
          </div>
        </header>
        <main className="min-w-0 flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

/** Status badge (Draft/Published/Hidden) shared by admin lists. */
export function StatusBadge({ status }: { status: string }) {
  const styles = {
    published: "bg-success/10 text-success",
    draft: "bg-warn/10 text-warn",
    hidden: "bg-danger/10 text-danger",
  } as const;
  const labels = {
    published: "Published",
    draft: "Draft",
    hidden: "Hidden",
  } as const;
  const key = (status in styles ? status : "draft") as keyof typeof styles;
  return (
    <span className={`inline-flex min-h-7 items-center rounded-full px-3 text-xs font-semibold ${styles[key]}`}>
      {labels[key]}
    </span>
  );
}
