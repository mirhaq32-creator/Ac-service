import { requireAdmin, getAdminConfigStatus } from "@/lib/admin/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { AdminShell } from "../AdminShell";
import { DeleteForm } from "../DeleteForm";
import { SubmitBar } from "../ui";
import { deleteMediaAction, uploadMediaAction } from "../actions";

export const dynamic = "force-dynamic";

interface Row {
  id: string;
  url: string;
  path: string;
  size_bytes: number | null;
}

const ERRORS: Record<string, string> = {
  empty: "Choose a file first.",
  size: "Maximum image size is 8 MB.",
  type: "Supported formats: PNG, JPG, WebP, AVIF.",
  upload: "Upload failed — check the Storage settings in Supabase.",
};

/** Media library (PRD §12.5): upload to Supabase Storage, grid + delete. */
export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  await requireAdmin();
  const { error } = await searchParams;
  const cmsReady = getAdminConfigStatus().cmsReady;
  const db = getSupabaseAdminClient();
  const { data } = cmsReady
    ? await db.from("media").select("*").order("created_at", { ascending: false })
    : { data: [] };
  const rows = (data ?? []) as Row[];

  return (
    <AdminShell active="/admin/media">
      <h1 className="font-heading text-2xl font-bold text-ink">Media Library</h1>
      <p className="mt-1 text-sm text-muted">
        Upload work and blog images (PNG/JPG/WebP — up to 8 MB), then use their URLs in content.
      </p>

      {error ? (
        <p className="mt-4 rounded-xl bg-danger/10 px-4 py-2.5 text-sm text-danger" role="alert">
          {ERRORS[error] ?? "Something went wrong. Please try again."}
        </p>
      ) : null}

      {cmsReady ? (
        <form
          action={uploadMediaAction}
          className="mt-6 rounded-2xl border border-line bg-bg p-5"
        >
          <label htmlFor="file" className="text-sm font-semibold text-muted">
            Choose an image
          </label>
          <input
            id="file"
            name="file"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            required
            className="mt-2 block w-full cursor-pointer rounded-xl border border-dashed border-line bg-surface p-4 text-sm"
          />
          <div className="mt-4">
            <SubmitBar label="Upload Image" />
          </div>
        </form>
      ) : (
        <p className="mt-6 rounded-2xl border border-dashed border-line bg-bg p-6 text-muted">
          Uploading requires a configured Supabase connection (including the “media”
          storage bucket from the migration file).
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {rows.length === 0 ? (
          <p className="col-span-full rounded-2xl border border-dashed border-line bg-bg p-6 text-center text-muted">
            No images uploaded yet.
          </p>
        ) : null}
        {rows.map((m) => (
          <figure key={m.id} className="overflow-hidden rounded-2xl border border-line bg-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.url} alt={m.path} loading="lazy" className="aspect-square w-full object-cover" />
            <figcaption className="space-y-2 p-3">
              <code dir="ltr" className="block truncate text-xs text-muted">
                {m.url}
              </code>
              <div className="flex items-center justify-between">
                <a
                  href={m.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-accent"
                >
                  Open
                </a>
                <DeleteForm action={deleteMediaAction} id={m.id} extra={{ path: m.path }} />
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </AdminShell>
  );
}
