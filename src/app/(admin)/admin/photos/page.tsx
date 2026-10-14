import { requireAdmin, getAdminConfigStatus } from "@/lib/admin/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { AdminShell, StatusBadge } from "../AdminShell";
import { DeleteForm } from "../DeleteForm";
import { Field, LocalizedField, StatusSelect, SubmitBar } from "../ui";
import { deletePhotoAction, savePhotoAction } from "../actions";

export const dynamic = "force-dynamic";

interface Row {
  id: string;
  url: string;
  caption: { ar: string; en: string };
  tag: string;
  status: string;
  order: number;
}

/** Work/Shop photos module (PRD §12.5): pick from media library or URL. */
export default async function AdminPhotosPage() {
  await requireAdmin();
  const cmsReady = getAdminConfigStatus().cmsReady;
  const db = getSupabaseAdminClient();
  const { data } = cmsReady
    ? await db.from("photos").select("*").order("order")
    : { data: [] };
  const rows = (data ?? []) as Row[];

  return (
    <AdminShell active="/admin/photos">
      <h1 className="font-heading text-2xl font-bold text-ink">Photos / Work</h1>
      <p className="mt-1 text-sm text-muted">
        Real photos of your work and shop only — published photos appear in the website gallery.
      </p>

      {cmsReady ? (
        <details className="mt-6 rounded-2xl border border-line bg-bg p-5" open={rows.length === 0}>
          <summary className="cursor-pointer font-heading text-lg font-bold text-accent">
            + New Photo
          </summary>
          <form action={savePhotoAction} className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="md:col-span-2">
                <Field
                  label="Image URL"
                  name="url"
                  dir="ltr"
                  required
                  hint="Upload the image in the Media Library, then paste its URL here."
                />
              </div>
              <div>
                <label htmlFor="tag" className="text-sm font-semibold text-muted">Tag</label>
                <select id="tag" name="tag" className="mt-1 min-h-12 w-full rounded-xl border border-line bg-bg px-4 outline-none focus:border-accent">
                  <option value="ac">AC</option>
                  <option value="refrigerator">Refrigerators</option>
                  <option value="washing-machine">Washing machines</option>
                  <option value="shop">Shop</option>
                </select>
              </div>
            </div>
            <LocalizedField label="Caption (optional)" name="caption" />
            <StatusSelect />
            <SubmitBar label="Save Photo" />
          </form>
        </details>
      ) : null}

      <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {rows.length === 0 ? (
          <p className="col-span-full rounded-2xl border border-dashed border-line bg-bg p-6 text-center text-muted">
            No photos yet.
          </p>
        ) : null}
        {rows.map((p) => (
          <details key={p.id} className="overflow-hidden rounded-2xl border border-line bg-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.url} alt={p.caption.en} className="aspect-video w-full object-cover" loading="lazy" />
            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-ink">{p.caption.en || p.tag}</span>
                <StatusBadge status={p.status} />
              </div>
              <details className="mt-2">
                <summary className="cursor-pointer text-sm font-semibold text-accent">Edit</summary>
                <form action={savePhotoAction} className="mt-3 space-y-3">
                  <input type="hidden" name="id" value={p.id} />
                  <Field label="Image URL" name="url" dir="ltr" required defaultValue={p.url} />
                  <LocalizedField label="Caption" name="caption" defaultValue={p.caption} />
                  <StatusSelect defaultValue={p.status} />
                  <SubmitBar label="Save" />
                </form>
                <div className="mt-2">
                  <DeleteForm action={deletePhotoAction} id={p.id} extra={{ title: p.caption.en }} />
                </div>
              </details>
            </div>
          </details>
        ))}
      </div>
    </AdminShell>
  );
}
