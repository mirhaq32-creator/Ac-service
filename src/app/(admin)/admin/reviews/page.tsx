import { requireAdmin, getAdminConfigStatus } from "@/lib/admin/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { AdminShell, StatusBadge } from "../AdminShell";
import { DeleteForm } from "../DeleteForm";
import { Field, LocalizedField, StatusSelect, SubmitBar } from "../ui";
import { deleteReviewAction, saveReviewAction } from "../actions";

export const dynamic = "force-dynamic";

interface Row {
  id: string;
  customer_name: string;
  rating: number;
  text: { ar: string; en: string };
  status: string;
  order: number;
}

/**
 * Reviews module (PRD §12.5 + D5): the public section appears only when
 * ≥1 review is published — nothing is seeded and nothing is faked.
 */
export default async function AdminReviewsPage() {
  await requireAdmin();
  const cmsReady = getAdminConfigStatus().cmsReady;
  const db = getSupabaseAdminClient();
  const { data } = cmsReady
    ? await db.from("reviews").select("*").order("order")
    : { data: [] };
  const rows = (data ?? []) as Row[];

  return (
    <AdminShell active="/admin/reviews">
      <h1 className="font-heading text-2xl font-bold text-ink">Reviews</h1>
      <p className="mt-1 text-sm text-muted">
        No reviews appear on the website until you publish at least one real review —
        fake reviews are never added.
      </p>

      {cmsReady ? (
        <details className="mt-6 rounded-2xl border border-line bg-bg p-5" open={rows.length === 0}>
          <summary className="cursor-pointer font-heading text-lg font-bold text-accent">
            + New Review
          </summary>
          <form action={saveReviewAction} className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Customer name" name="customer_name" required />
              <Field label="Rating (1–5)" name="rating" type="number" defaultValue={5} required />
              <Field label="Order" name="order" type="number" defaultValue={rows.length + 1} />
            </div>
            <LocalizedField label="Review text" name="text" multiline required />
            <StatusSelect />
            <SubmitBar label="Save Review" />
          </form>
        </details>
      ) : null}

      <div className="mt-6 space-y-3">
        {rows.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-line bg-bg p-6 text-center text-muted">
            No reviews yet — the public Reviews section stays hidden.
          </p>
        ) : null}
        {rows.map((r) => (
          <details key={r.id} className="rounded-2xl border border-line bg-bg p-5">
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3">
              <span className="font-heading font-bold text-ink">{r.customer_name}</span>
              <span className="flex items-center gap-2">
                <span className="text-warn">{"★".repeat(r.rating)}</span>
                <StatusBadge status={r.status} />
              </span>
            </summary>
            <form action={saveReviewAction} className="mt-4 space-y-4">
              <input type="hidden" name="id" value={r.id} />
              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Customer name" name="customer_name" required defaultValue={r.customer_name} />
                <Field label="Rating (1–5)" name="rating" type="number" defaultValue={r.rating} required />
                <Field label="Order" name="order" type="number" defaultValue={r.order} />
              </div>
              <LocalizedField label="Review text" name="text" multiline required defaultValue={r.text} />
              <StatusSelect defaultValue={r.status} />
              <SubmitBar label="Save Changes" />
            </form>
            <div className="mt-3 border-t border-line pt-3">
              <DeleteForm action={deleteReviewAction} id={r.id} extra={{ title: r.customer_name }} />
            </div>
          </details>
        ))}
      </div>
    </AdminShell>
  );
}
