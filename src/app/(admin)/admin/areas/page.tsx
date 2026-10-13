import { requireAdmin, getAdminConfigStatus } from "@/lib/admin/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { AdminShell, StatusBadge } from "../AdminShell";
import { DeleteForm } from "../DeleteForm";
import { Field, LocalizedField, StatusSelect, SubmitBar } from "../ui";
import { deleteAreaAction, saveAreaAction } from "../actions";

export const dynamic = "force-dynamic";

interface Row {
  id: string;
  name: { ar: string; en: string };
  info: { ar: string; en: string };
  status: string;
  order: number;
}

/** Service Areas module (PRD §12.5): admin adds neighborhoods; none seeded. */
export default async function AdminAreasPage() {
  await requireAdmin();
  const cmsReady = getAdminConfigStatus().cmsReady;
  const db = getSupabaseAdminClient();
  const { data } = cmsReady
    ? await db.from("areas").select("*").order("order")
    : { data: [] };
  const rows = (data ?? []) as Row[];

  return (
    <AdminShell active="/admin/areas">
      <h1 className="font-heading text-2xl font-bold text-ink">Service Areas</h1>
      <p className="mt-1 text-sm text-muted">
        Add the neighborhoods you serve — no areas are seeded automatically.
      </p>

      {cmsReady ? (
        <details className="mt-6 rounded-2xl border border-line bg-bg p-5" open={rows.length === 0}>
          <summary className="cursor-pointer font-heading text-lg font-bold text-accent">
            + New Area
          </summary>
          <form action={saveAreaAction} className="mt-4 space-y-4">
            <LocalizedField label="Area name" name="name" required />
            <LocalizedField label="Short info (optional)" name="info" />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Order" name="order" type="number" defaultValue={rows.length + 1} />
              <StatusSelect />
            </div>
            <SubmitBar label="Save Area" />
          </form>
        </details>
      ) : null}

      <div className="mt-6 space-y-3">
        {rows.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line bg-bg p-6 text-center text-muted">
            No areas yet — the public site shows the “All Riyadh areas” message.
          </p>
        ) : null}
        {rows.map((a) => (
          <details key={a.id} className="rounded-2xl border border-line bg-bg p-5">
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3">
              <span className="font-heading font-bold text-ink">{a.name.en}</span>
              <StatusBadge status={a.status} />
            </summary>
            <form action={saveAreaAction} className="mt-4 space-y-4">
              <input type="hidden" name="id" value={a.id} />
              <LocalizedField label="Area name" name="name" required defaultValue={a.name} />
              <LocalizedField label="Short info" name="info" defaultValue={a.info} />
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Order" name="order" type="number" defaultValue={a.order} />
                <StatusSelect defaultValue={a.status} />
              </div>
              <SubmitBar label="Save Changes" />
            </form>
            <div className="mt-3 border-t border-line pt-3">
              <DeleteForm action={deleteAreaAction} id={a.id} extra={{ title: a.name.en }} />
            </div>
          </details>
        ))}
      </div>
    </AdminShell>
  );
}
