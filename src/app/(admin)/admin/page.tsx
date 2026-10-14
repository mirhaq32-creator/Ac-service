import Link from "next/link";

import { requireAdmin, getAdminConfigStatus } from "@/lib/admin/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { AdminShell } from "./AdminShell";

export const dynamic = "force-dynamic";

type Counts = {
  blogs: number;
  photos: number;
  reviews: number;
  services: number;
  faqs: number;
  areas: number;
  live: boolean;
  activity: Array<{ id: string; action: string; title: string; at: string }>;
};

async function loadCounts(): Promise<Counts> {
  const empty: Counts = {
    blogs: 0, photos: 0, reviews: 0, services: 0, faqs: 0, areas: 0,
    live: false, activity: [],
  };
  if (!getAdminConfigStatus().cmsReady) return empty;
  try {
    const db = getSupabaseAdminClient();
    const [blogs, photos, reviews, services, faqs, areas, activity] =
      await Promise.all([
        db.from("blogs").select("id", { count: "exact", head: true }),
        db.from("photos").select("id", { count: "exact", head: true }),
        db.from("reviews").select("id", { count: "exact", head: true }),
        db.from("sub_services").select("id", { count: "exact", head: true }),
        db.from("faqs").select("id", { count: "exact", head: true }),
        db.from("areas").select("id", { count: "exact", head: true }),
        db.from("activity").select("id, action, title, at").order("at", { ascending: false }).limit(8),
      ]);
    return {
      blogs: blogs.count ?? 0,
      photos: photos.count ?? 0,
      reviews: reviews.count ?? 0,
      services: services.count ?? 0,
      faqs: faqs.count ?? 0,
      areas: areas.count ?? 0,
      live: true,
      activity: (activity.data ?? []) as Counts["activity"],
    };
  } catch {
    return empty;
  }
}

/** Dashboard (PRD §12.3): summary cards, quick actions, recent activity. */
export default async function AdminDashboard() {
  const email = await requireAdmin();
  const counts = await loadCounts();

  const cards = [
    { label: "Blogs", value: counts.blogs, href: "/admin/blogs" },
    { label: "Photos / Work", value: counts.photos, href: "/admin/photos" },
    { label: "Reviews", value: counts.reviews, href: "/admin/reviews" },
    { label: "Services", value: counts.services, href: "/admin/services" },
    { label: "FAQs", value: counts.faqs, href: "/admin/faqs" },
    { label: "Areas", value: counts.areas, href: "/admin/areas" },
  ];

  const quick = [
    { label: "New Blog", href: "/admin/blogs?new=1" },
    { label: "New Photo", href: "/admin/photos?new=1" },
    { label: "New Review", href: "/admin/reviews?new=1" },
    { label: "New Service", href: "/admin/services" },
  ];

  return (
    <AdminShell active="/admin">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-ink">Dashboard</h1>
          <p dir="ltr" className="text-sm text-muted">{email}</p>
        </div>
        {!counts.live ? (
          <p className="rounded-xl bg-warn/10 px-4 py-2 text-sm text-warn" role="status">
            Supabase is not connected yet — the public site runs on built-in seed
            content. Changes will be stored once the environment variables are set
            and the migration is executed.
          </p>
        ) : null}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-2xl border border-line bg-bg p-4 transition hover:shadow-s2"
          >
            <p className="font-heading text-3xl font-bold text-ink">{c.value}</p>
            <p className="mt-1 text-sm text-muted">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {quick.map((q) => (
          <Link
            key={q.href}
            href={q.href}
            className="inline-flex min-h-11 items-center rounded-full bg-ink px-4 text-sm font-semibold text-white transition hover:bg-ink-2"
          >
            + {q.label}
          </Link>
        ))}
      </div>

      <section className="mt-8 rounded-2xl border border-line bg-bg p-5">
        <h2 className="font-heading text-lg font-bold text-ink">Recent Activity</h2>
        {counts.activity.length === 0 ? (
          <p className="mt-3 text-sm text-muted">
            No activity yet. Every save, publish, or delete will appear here automatically.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-line text-sm">
            {counts.activity.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-2.5">
                <span className="font-medium text-ink">
                  {a.action}
                  {a.title ? ` — ${a.title}` : ""}
                </span>
                <time className="shrink-0 text-xs text-muted" dir="ltr">
                  {new Date(a.at).toLocaleString("en-GB")}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminShell>
  );
}
