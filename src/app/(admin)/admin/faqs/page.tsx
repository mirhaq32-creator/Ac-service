import { requireAdmin, getAdminConfigStatus } from "@/lib/admin/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { seedFaqs } from "@/lib/content/seed";
import { AdminShell, StatusBadge } from "../AdminShell";
import { DeleteForm } from "../DeleteForm";
import { Field, LocalizedField, StatusSelect, SubmitBar } from "../ui";
import { deleteFaqAction, reorderAction, saveFaqAction } from "../actions";

export const dynamic = "force-dynamic";

interface Row {
  id: string;
  question: { ar: string; en: string };
  answer: { ar: string; en: string };
  category_slug: string | null;
  status: string;
  order: number;
}

const CATEGORIES = [
  ["", "General (homepage)"],
  ["ac", "AC"],
  ["refrigerator", "Refrigerators"],
  ["washing-machine", "Washing machines"],
  ["emergency", "Emergency"],
] as const;

/** FAQs module (PRD §12.5): global + per-category, reorderable. */
export default async function AdminFaqsPage() {
  await requireAdmin();
  const cmsReady = getAdminConfigStatus().cmsReady;
  const db = getSupabaseAdminClient();
  const { data } = cmsReady
    ? await db.from("faqs").select("*").order("order")
    : { data: null };
  const rows: Row[] = (data as Row[] | null) ?? (seedFaqs as unknown as Row[]);

  return (
    <AdminShell active="/admin/faqs">
      <h1 className="font-heading text-2xl font-bold text-ink">FAQs</h1>
      <p className="mt-1 text-sm text-muted">
        Frequently asked questions shown on the homepage and service pages.
      </p>

      {cmsReady ? (
        <details className="mt-6 rounded-2xl border border-line bg-bg p-5">
          <summary className="cursor-pointer font-heading text-lg font-bold text-accent">
            + New FAQ
          </summary>
          <form action={saveFaqAction} className="mt-4 space-y-4">
            <LocalizedField label="Question" name="question" required />
            <LocalizedField label="Answer" name="answer" multiline required />
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label htmlFor="category_slug" className="text-sm font-semibold text-muted">Category</label>
                <select id="category_slug" name="category_slug" className="mt-1 min-h-12 w-full rounded-xl border border-line bg-bg px-4 outline-none focus:border-accent">
                  {CATEGORIES.map(([v, l]) => (
                    <option key={v} value={v}>{l}</option>
                  ))}
                </select>
              </div>
              <Field label="Order" name="order" type="number" defaultValue={rows.length + 1} />
              <StatusSelect />
            </div>
            <SubmitBar label="Save FAQ" />
          </form>
        </details>
      ) : null}

      <div className="mt-6 space-y-3">
        {rows.map((f, i) => (
          <details key={f.id} className="rounded-2xl border border-line bg-bg p-5">
            <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-3">
              <span className="font-semibold text-ink">{f.question.en || f.question.ar}</span>
              <StatusBadge status={f.status} />
            </summary>
            <form action={saveFaqAction} className="mt-4 space-y-4">
              <input type="hidden" name="id" value={f.id} />
              <LocalizedField label="Question" name="question" required defaultValue={f.question} />
              <LocalizedField label="Answer" name="answer" multiline required defaultValue={f.answer} />
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label htmlFor={`cat-${f.id}`} className="text-sm font-semibold text-muted">Category</label>
                  <select
                    id={`cat-${f.id}`}
                    name="category_slug"
                    defaultValue={f.category_slug ?? ""}
                    className="mt-1 min-h-12 w-full rounded-xl border border-line bg-bg px-4 outline-none focus:border-accent"
                  >
                    {CATEGORIES.map(([v, l]) => (
                      <option key={v} value={v}>{l}</option>
                    ))}
                  </select>
                </div>
                <Field label="Order" name="order" type="number" defaultValue={f.order} />
                <StatusSelect defaultValue={f.status} />
              </div>
              <SubmitBar label="Save Changes" />
            </form>
            <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
              {cmsReady && i > 0 ? (
                <form action={reorderAction}>
                  <input type="hidden" name="table" value="faqs" />
                  <input type="hidden" name="id" value={f.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button className="min-h-9 cursor-pointer rounded-lg px-2 text-sm" aria-label="Move up">↑</button>
                </form>
              ) : null}
              {cmsReady && i < rows.length - 1 ? (
                <form action={reorderAction}>
                  <input type="hidden" name="table" value="faqs" />
                  <input type="hidden" name="id" value={f.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button className="min-h-9 cursor-pointer rounded-lg px-2 text-sm" aria-label="Move down">↓</button>
                </form>
              ) : null}
              {cmsReady ? <DeleteForm action={deleteFaqAction} id={f.id} /> : null}
            </div>
          </details>
        ))}
      </div>
    </AdminShell>
  );
}
