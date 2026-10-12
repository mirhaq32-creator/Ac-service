import { requireAdmin, getAdminConfigStatus } from "@/lib/admin/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { AdminShell, StatusBadge } from "../AdminShell";
import { DeleteForm } from "../DeleteForm";
import { Field, LocalizedField, StatusSelect, SubmitBar } from "../ui";
import { deleteBlogAction, saveBlogAction } from "../actions";

export const dynamic = "force-dynamic";

/** DB row shape (snake_case as stored in Supabase). */
interface Row {
  id: string;
  slug: string;
  title: { ar: string; en: string };
  excerpt: { ar: string; en: string };
  content: { ar: string; en: string };
  main_image_url: string | null;
  published_at: string | null;
  status: string;
}

/** Blogs module (PRD §12.5): list + bilingual editor, no categories (D7). */
export default async function AdminBlogsPage() {
  await requireAdmin();
  const cmsReady = getAdminConfigStatus().cmsReady;
  const db = getSupabaseAdminClient();
  const { data } = cmsReady
    ? await db.from("blogs").select("*").order("created_at", { ascending: false })
    : { data: [] };
  const rows = (data ?? []) as Row[];

  return (
    <AdminShell active="/admin/blogs">
      <h1 className="font-heading text-2xl font-bold text-ink">Blogs</h1>
      <p className="mt-1 text-sm text-muted">
        Bilingual articles — no categories. Only published posts appear on the website.
      </p>

      {cmsReady ? (
        <details className="mt-6 rounded-2xl border border-line bg-bg p-5" open={rows.length === 0}>
          <summary className="cursor-pointer font-heading text-lg font-bold text-accent">
            + New Blog
          </summary>
          <form action={saveBlogAction} className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Slug" name="slug" required dir="ltr" />
              <Field label="Publish date" name="published_at" type="date" />
            </div>
            <LocalizedField label="Title" name="title" required />
            <LocalizedField label="Excerpt" name="excerpt" multiline />
            <LocalizedField label="Article body" name="content" multiline required />
            <Field
              label="Main image URL (from Media Library)"
              name="main_image_url"
              dir="ltr"
              hint="Upload the image in the Media Library, then paste its URL here."
            />
            <StatusSelect />
            <SubmitBar label="Save Blog" />
          </form>
        </details>
      ) : null}

      <div className="mt-6 space-y-3">
        {rows.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line bg-bg p-6 text-center text-muted">
            No blog posts yet.
          </p>
        ) : null}
        {rows.map((post) => (
          <details key={post.id} className="rounded-2xl border border-line bg-bg p-5">
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3">
              <span className="font-heading font-bold text-ink">{post.title.en || post.title.ar}</span>
              <span className="flex items-center gap-2">
                <StatusBadge status={post.status} />
                <span dir="ltr" className="text-xs text-muted">{post.slug}</span>
              </span>
            </summary>
            <form action={saveBlogAction} className="mt-4 space-y-4">
              <input type="hidden" name="id" value={post.id} />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Slug" name="slug" required dir="ltr" defaultValue={post.slug} />
                <Field
                  label="Publish date"
                  name="published_at"
                  type="date"
                  defaultValue={post.published_at?.slice(0, 10)}
                />
              </div>
              <LocalizedField label="Title" name="title" required defaultValue={post.title} />
              <LocalizedField label="Excerpt" name="excerpt" multiline defaultValue={post.excerpt} />
              <LocalizedField label="Article body" name="content" multiline required defaultValue={post.content} />
              <Field
                label="Main image URL"
                name="main_image_url"
                dir="ltr"
                defaultValue={post.main_image_url ?? ""}
              />
              <StatusSelect defaultValue={post.status} />
              <SubmitBar label="Save Changes" />
            </form>
            <div className="mt-3 border-t border-line pt-3">
              <DeleteForm action={deleteBlogAction} id={post.id} extra={{ title: post.title.en }} />
            </div>
          </details>
        ))}
      </div>
    </AdminShell>
  );
}
