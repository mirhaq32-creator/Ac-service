import { requireAdmin, getAdminConfigStatus } from "@/lib/admin/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { seedSettings } from "@/lib/content/seed";
import type { SiteSettings } from "@/lib/content/types";
import { AdminShell } from "../AdminShell";
import { Field, LocalizedField, SubmitBar } from "../ui";
import { saveSettingsAction } from "../actions";

export const dynamic = "force-dynamic";

/**
 * Settings module (PRD §12.8): website identity, contact/WhatsApp defaults,
 * emergency switch, SEO defaults. Singleton row (id=1).
 */
export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  await requireAdmin();
  const { saved } = await searchParams;
  const cmsReady = getAdminConfigStatus().cmsReady;
  let settings: SiteSettings = seedSettings;
  if (cmsReady) {
    const db = getSupabaseAdminClient();
    const { data } = await db.from("settings").select("data").eq("id", 1).single();
    if (data?.data) settings = data.data as SiteSettings;
  }

  return (
    <AdminShell active="/admin/settings">
      <h1 className="font-heading text-2xl font-bold text-ink">Settings</h1>
      {saved ? (
        <p className="mt-4 rounded-xl bg-success/10 px-4 py-2.5 text-sm text-success" role="status">
          Saved successfully. The website has been updated.
        </p>
      ) : null}
      {!cmsReady ? (
        <p className="mt-4 rounded-xl bg-warn/10 px-4 py-2.5 text-sm text-warn" role="status">
          Supabase is not connected yet — this form shows the built-in seed values and
          will save once the connection is configured.
        </p>
      ) : null}

      {cmsReady ? (
        <form action={saveSettingsAction} className="mt-6 space-y-6">
          <section className="rounded-2xl border border-line bg-bg p-5">
            <h2 className="font-heading text-lg font-bold text-ink">Business Identity</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field
                label="Business name (display)"
                name="businessName"
                defaultValue={settings.businessName}
                hint="The official Arabic name — it is never translated."
              />
            </div>
            <label className="mt-4 flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface px-4 text-sm font-medium text-ink">
              <input
                type="checkbox"
                name="emergencyEnabled"
                defaultChecked={settings.emergencyEnabled}
                className="size-5 accent-[#D93A17]"
              />
              Enable the Emergency service section and pages
            </label>
          </section>

          <section className="rounded-2xl border border-line bg-bg p-5">
            <h2 className="font-heading text-lg font-bold text-ink">Contact & WhatsApp</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Call number" name="phone" dir="ltr" defaultValue={settings.phone} required />
              <Field label="WhatsApp number (international, no +)" name="whatsapp" dir="ltr" defaultValue={settings.whatsapp} required />
            </div>
            <div className="mt-4 space-y-4">
              <LocalizedField label="Address" name="address" required defaultValue={settings.address} />
              <Field label="Google Maps link" name="mapsLink" dir="ltr" defaultValue={settings.mapsLink} />
              <LocalizedField
                label="Default WhatsApp message"
                name="defaultWhatsappMessage"
                defaultValue={settings.defaultWhatsappMessage}
              />
              <LocalizedField
                label="Emergency WhatsApp message"
                name="emergencyWhatsappMessage"
                defaultValue={settings.emergencyWhatsappMessage}
              />
              <div>
                <label htmlFor="whatsappMessageMode" className="text-sm font-semibold text-muted">
                  Booking message mode
                </label>
                <select
                  id="whatsappMessageMode"
                  name="whatsappMessageMode"
                  defaultValue={settings.whatsappMessageMode}
                  className="mt-1 min-h-12 w-full rounded-xl border border-line bg-bg px-4 outline-none focus:border-accent"
                >
                  <option value="current">Current site language</option>
                  <option value="bilingual">Arabic + English together</option>
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-line bg-bg p-5">
            <h2 className="font-heading text-lg font-bold text-ink">SEO</h2>
            <div className="mt-4 space-y-4">
              <LocalizedField label="Default SEO title" name="seoTitle" defaultValue={settings.seoTitle} />
              <LocalizedField
                label="Default SEO description"
                name="seoDescription"
                multiline
                defaultValue={settings.seoDescription}
              />
            </div>
          </section>

          <SubmitBar label="Save Settings" />
        </form>
      ) : null}
    </AdminShell>
  );
}
