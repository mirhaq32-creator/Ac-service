import { requireAdmin, getAdminConfigStatus } from "@/lib/admin/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { seedCategories, seedSubServices } from "@/lib/content/seed";
import { AdminShell, StatusBadge } from "../AdminShell";
import { DeleteForm } from "../DeleteForm";
import { Field, LocalizedField, StatusSelect, SubmitBar } from "../ui";
import {
  deleteSubServiceAction,
  reorderAction,
  saveSubServiceAction,
} from "../actions";

export const dynamic = "force-dynamic";

/** DB row shapes (snake_case as stored in Supabase). */
interface CategoryRow {
  slug: string;
  name: { ar: string; en: string };
  short_description: { ar: string; en: string };
  status: string;
}
interface SubRow {
  id: string;
  category_slug: string;
  slug: string;
  name: { ar: string; en: string };
  is_problem: boolean;
  status: string;
  order: number;
}

/** Services module (PRD §12.5): two-level tree with reorder + delete. */
export default async function AdminServicesPage() {
  await requireAdmin();
  const cmsReady = getAdminConfigStatus().cmsReady;
  const db = getSupabaseAdminClient();

  let categories = seedCategories as unknown as CategoryRow[];
  let subs = seedSubServices as unknown as SubRow[];
  if (cmsReady) {
    const [cats, subRows] = await Promise.all([
      db.from("services").select("*").order("order"),
      db.from("sub_services").select("*").order("order"),
    ]);
    if (cats.data && cats.data.length > 0) categories = cats.data;
    if (subRows.data && subRows.data.length > 0) subs = subRows.data;
  }

  const formsEnabled = cmsReady; // forms write to Supabase only when configured

  return (
    <AdminShell active="/admin/services">
      <h1 className="font-heading text-2xl font-bold text-ink">Services</h1>
      <p className="mt-1 text-sm text-muted">
        Service tree: main category → sub-services shown in menus, pages, and search.
      </p>

      <div className="mt-6 space-y-6">
        {categories.map((cat) => {
          const catSubs = subs.filter((s) => s.category_slug === cat.slug);
          return (
            <section key={cat.slug} className="rounded-2xl border border-line bg-bg p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-lg font-bold text-ink">
                    {cat.name.en}
                  </h2>
                  <code dir="ltr" className="text-xs text-muted">/{cat.slug}</code>
                </div>
                <StatusBadge status={cat.status} />
              </div>

              <ul className="mt-4 divide-y divide-line border-t border-line">
                {catSubs.map((s, i) => (
                  <li key={s.id} className="flex flex-wrap items-center gap-2 py-2.5">
                    <span className="min-w-0 flex-1 font-medium text-ink">
                      {s.name.en}
                      {s.is_problem ? (
                        <span className="ms-2 rounded-full bg-accent-tint px-2 py-0.5 text-xs text-accent">
                          in search
                        </span>
                      ) : null}
                    </span>
                    <StatusBadge status={s.status} />
                    {formsEnabled ? (
                      <>
                        {i > 0 ? (
                          <form action={reorderAction}>
                            <input type="hidden" name="table" value="sub_services" />
                            <input type="hidden" name="id" value={s.id} />
                            <input type="hidden" name="direction" value="up" />
                            <button className="min-h-9 cursor-pointer rounded-lg px-2 text-sm" aria-label="Move up">↑</button>
                          </form>
                        ) : null}
                        {i < catSubs.length - 1 ? (
                          <form action={reorderAction}>
                            <input type="hidden" name="table" value="sub_services" />
                            <input type="hidden" name="id" value={s.id} />
                            <input type="hidden" name="direction" value="down" />
                            <button className="min-h-9 cursor-pointer rounded-lg px-2 text-sm" aria-label="Move down">↓</button>
                          </form>
                        ) : null}
                        <DeleteForm
                          action={deleteSubServiceAction}
                          id={s.id}
                          extra={{ title: s.name.en }}
                        />
                      </>
                    ) : null}
                  </li>
                ))}
                {catSubs.length === 0 ? (
                  <li className="py-3 text-sm text-muted">No sub-services yet.</li>
                ) : null}
              </ul>

              {formsEnabled ? (
                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-accent">
                    + Add sub-service to “{cat.name.en}”
                  </summary>
                  <form action={saveSubServiceAction} className="mt-4 space-y-4">
                    <input type="hidden" name="category_slug" value={cat.slug} />
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Slug" name="slug" required dir="ltr" />
                      <Field label="Order" name="order" type="number" defaultValue={catSubs.length + 1} />
                    </div>
                    <LocalizedField label="Name" name="name" required />
                    <LocalizedField label="Short description" name="short_description" multiline />
                    <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface px-4 text-sm font-medium text-ink">
                      <input type="checkbox" name="is_problem" className="size-5 accent-[#1456c4]" />
                      Show in search and in “What do you need help with?”
                    </label>
                    <StatusSelect />
                    <SubmitBar label="Add Service" />
                  </form>
                </details>
              ) : null}
            </section>
          );
        })}
      </div>
    </AdminShell>
  );
}
