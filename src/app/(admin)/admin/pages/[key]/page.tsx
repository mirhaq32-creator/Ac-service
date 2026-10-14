import { notFound } from "next/navigation";
import { requireAdmin, getAdminConfigStatus } from "@/lib/admin/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getPageContent } from "@/lib/content/repo";
import { AdminShell, StatusBadge } from "../../AdminShell";
import { LocalizedField, StatusSelect, SubmitBar } from "../../ui";
import { savePageAction } from "../../actions";

export const dynamic = "force-dynamic";

const KEYS = ["about", "privacy", "terms"] as const;

interface Row {
  key: string;
  title: { ar: string; en: string };
  content: { ar: string; en: string };
  status: string;
}

const LABELS: Record<string, string> = {
  about: "About Page",
  privacy: "Privacy Policy",
  terms: "Terms & Conditions",
};

/** Pages module (PRD §12.6/§12.7): About + Privacy + Terms bilingual editors. */
export default async function AdminPageEditor({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  await requireAdmin();
  const { key } = await params;
  if (!KEYS.includes(key as (typeof KEYS)[number])) notFound();

  const cmsReady = getAdminConfigStatus().cmsReady;
  let row: Row | undefined;
  if (cmsReady) {
    const db = getSupabaseAdminClient();
    const { data } = await db.from("pages").select("*").eq("key", key).single();
    row = (data as Row | null) ?? undefined;
  }
  if (!row) {
    const seeded = await getPageContent(key as (typeof KEYS)[number]);
    row = seeded
      ? { key, title: seeded.title, content: seeded.content, status: seeded.status }
      : undefined;
  }

  return (
    <AdminShell active={`/admin/pages/${key}`}>
      <div className="flex items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold text-ink">{LABELS[key]}</h1>
        {row ? <StatusBadge status={row.status} /> : null}
      </div>

      {cmsReady && row ? (
        <form action={savePageAction} className="mt-6 space-y-4">
          <input type="hidden" name="key" value={key} />
          <LocalizedField label="Title" name="title" required defaultValue={row.title} />
          <LocalizedField label="Content" name="content" multiline required defaultValue={row.content} />
          <StatusSelect defaultValue={row.status} />
          <SubmitBar label="Save Page" />
        </form>
      ) : null}

      {cmsReady && !row ? (
        <>
          <p className="mt-6 rounded-2xl border border-dashed border-line bg-bg p-6 text-muted">
            No saved version yet — create it below.
          </p>
          <form action={savePageAction} className="mt-4 space-y-4">
            <input type="hidden" name="key" value={key} />
            <LocalizedField label="Title" name="title" required />
            <LocalizedField label="Content" name="content" multiline required />
            <StatusSelect />
            <SubmitBar label="Save Page" />
          </form>
        </>
      ) : null}

      {!cmsReady ? (
        <p className="mt-6 rounded-2xl border border-dashed border-line bg-bg p-6 text-muted">
          Editing requires a configured Supabase connection. The current content comes
          from the built-in seed and is displayed on the public site.
        </p>
      ) : null}
    </AdminShell>
  );
}
