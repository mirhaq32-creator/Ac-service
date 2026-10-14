"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  adminDb,
  assertAdmin,
  getAdminEmail,
  getAdminConfigStatus,
  getMissingVarNames,
  logActivity,
} from "@/lib/admin/auth";

/**
 * Admin server actions. Every mutation flows through assertAdmin()
 * (allow-list re-check) and uses the service-role client server-side only.
 * Bookings/leads are never written anywhere (D1).
 */

export type ActionState = { ok: boolean; message: string };

function revalidateSite() {
  revalidatePath("/", "layout");
}

/* ── Auth ─────────────────────────────────────────────────────────────── */

export async function loginAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState | null> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  // Fail closed with the exact missing variable NAMES (never values).
  const status = getAdminConfigStatus();
  if (!status.supabaseUrl || !status.anonKey) {
    const { missingForLogin } = getMissingVarNames(status);
    return {
      ok: false,
      message: `Supabase is not fully configured in .env.local — missing: ${missingForLogin.join(", ")}. Fill them and restart the server.`,
    };
  }
  if (!status.adminEmail) {
    return {
      ok: false,
      message:
        "ADMIN_LOGIN_EMAIL is not configured in .env.local — the single-admin allow-list cannot be enforced, so login is disabled. Set it and restart the server.",
    };
  }
  if (email !== getAdminEmail()) {
    // Generic wording — do not reveal whether the account exists.
    return { ok: false, message: "Invalid email or password." };
  }

  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { ok: false, message: "Invalid email or password." };
  }
  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await getSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function forgotPasswordAction(
  _prev: ActionState | null,
  formData: FormData
): Promise<ActionState | null> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const status = getAdminConfigStatus();
  if (!status.supabaseUrl || !status.anonKey) {
    const { missingForLogin } = getMissingVarNames(status);
    return {
      ok: false,
      message: `Supabase is not fully configured in .env.local — missing: ${missingForLogin.join(", ")}.`,
    };
  }
  const supabase = await getSupabaseServerClient();
  // Always respond generically (do not reveal whether the email exists).
  await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin/login`,
  });
  return {
    ok: true,
    message: "If the address is registered, a reset link has been sent.",
  };
}

/* ── Shared helpers ───────────────────────────────────────────────────── */

function localized(formData: FormData, field: string) {
  return { ar: String(formData.get(`${field}_ar`) ?? "").trim(), en: String(formData.get(`${field}_en`) ?? "").trim() };
}

function status(formData: FormData): "draft" | "published" | "hidden" {
  const s = String(formData.get("status") ?? "draft");
  return s === "published" || s === "hidden" ? s : "draft";
}

function lines(formData: FormData, field: string) {
  return String(formData.get(field) ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((l) => {
      const [ar, en] = l.split("|").map((s) => s.trim());
      return { ar: ar ?? "", en: en ?? ar ?? "" };
    });
}
void lines;

/* ── Blogs ────────────────────────────────────────────────────────────── */

export async function saveBlogAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const db = await adminDb();
  const id = String(formData.get("id") ?? "");
  const row = {
    slug: String(formData.get("slug") ?? "").trim(),
    title: localized(formData, "title"),
    excerpt: localized(formData, "excerpt"),
    content: localized(formData, "content"),
    main_image_url: String(formData.get("main_image_url") ?? "").trim() || null,
    published_at:
      String(formData.get("published_at") ?? "").trim() || new Date().toISOString(),
    status: status(formData),
  };
  const { error } = id
    ? await db.from("blogs").update(row).eq("id", id)
    : await db.from("blogs").insert(row);
  if (!error) {
    await logActivity(id ? "Blog updated" : "Blog created", "blogs", id || null, row.title.ar || row.title.en);
    revalidateSite();
    redirect("/admin/blogs");
  }
  redirect("/admin/blogs?error=1");
}

export async function deleteBlogAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const db = await adminDb();
  const id = String(formData.get("id") ?? "");
  await db.from("blogs").delete().eq("id", id);
  await logActivity("Blog deleted", "blogs", id, String(formData.get("title") ?? ""));
  revalidateSite();
  redirect("/admin/blogs");
}

/* ── Reviews ──────────────────────────────────────────────────────────── */

export async function saveReviewAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const db = await adminDb();
  const id = String(formData.get("id") ?? "");
  const row = {
    customer_name: String(formData.get("customer_name") ?? "").trim(),
    rating: Math.min(5, Math.max(1, Number(formData.get("rating") ?? 5))),
    text: localized(formData, "text"),
    status: status(formData),
    order: Number(formData.get("order") ?? 0),
  };
  const { error } = id
    ? await db.from("reviews").update(row).eq("id", id)
    : await db.from("reviews").insert(row);
  if (!error) {
    await logActivity(id ? "Review updated" : "Review published", "reviews", id || null, row.customer_name);
    revalidateSite();
  }
  redirect("/admin/reviews");
}

export async function deleteReviewAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const db = await adminDb();
  await db.from("reviews").delete().eq("id", String(formData.get("id") ?? ""));
  revalidateSite();
  redirect("/admin/reviews");
}

/* ── Photos ───────────────────────────────────────────────────────────── */

export async function savePhotoAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const db = await adminDb();
  const id = String(formData.get("id") ?? "");
  const row = {
    url: String(formData.get("url") ?? "").trim(),
    caption: localized(formData, "caption"),
    tag: String(formData.get("tag") ?? "shop"),
    status: status(formData),
    order: Number(formData.get("order") ?? 0),
  };
  const { error } = id
    ? await db.from("photos").update(row).eq("id", id)
    : await db.from("photos").insert(row);
  if (!error) {
    await logActivity(id ? "Photo updated" : "Photo published", "photos", id || null, row.caption.ar || row.url);
    revalidateSite();
  }
  redirect("/admin/photos");
}

export async function deletePhotoAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const db = await adminDb();
  await db.from("photos").delete().eq("id", String(formData.get("id") ?? ""));
  revalidateSite();
  redirect("/admin/photos");
}

/* ── FAQs ─────────────────────────────────────────────────────────────── */

export async function saveFaqAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const db = await adminDb();
  const id = String(formData.get("id") ?? "");
  const category = String(formData.get("category_slug") ?? "");
  const row = {
    question: localized(formData, "question"),
    answer: localized(formData, "answer"),
    category_slug: category || null,
    status: status(formData),
    order: Number(formData.get("order") ?? 0),
  };
  const { error } = id
    ? await db.from("faqs").update(row).eq("id", id)
    : await db.from("faqs").insert(row);
  if (!error) {
    await logActivity(id ? "FAQ updated" : "FAQ created", "faqs", id || null, row.question.ar || row.question.en);
    revalidateSite();
  }
  redirect("/admin/faqs");
}

export async function deleteFaqAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const db = await adminDb();
  await db.from("faqs").delete().eq("id", String(formData.get("id") ?? ""));
  revalidateSite();
  redirect("/admin/faqs");
}

/* ── Areas ────────────────────────────────────────────────────────────── */

export async function saveAreaAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const db = await adminDb();
  const id = String(formData.get("id") ?? "");
  const row = {
    name: localized(formData, "name"),
    info: localized(formData, "info"),
    status: status(formData),
    order: Number(formData.get("order") ?? 0),
  };
  const { error } = id
    ? await db.from("areas").update(row).eq("id", id)
    : await db.from("areas").insert(row);
  if (!error) {
    await logActivity(id ? "Area updated" : "Area added", "areas", id || null, row.name.ar || row.name.en);
    revalidateSite();
  }
  redirect("/admin/areas");
}

export async function deleteAreaAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const db = await adminDb();
  await db.from("areas").delete().eq("id", String(formData.get("id") ?? ""));
  revalidateSite();
  redirect("/admin/areas");
}

/* ── Pages (about / privacy / terms) ──────────────────────────────────── */

export async function savePageAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const db = await adminDb();
  const key = String(formData.get("key") ?? "");
  const row = {
    key,
    title: localized(formData, "title"),
    content: localized(formData, "content"),
    status: status(formData),
  };
  await db.from("pages").upsert(row);
  await logActivity("Page updated", "pages", key, row.title.ar || row.title.en);
  revalidateSite();
  redirect(`/admin/pages/${key}`);
}

/* ── Services & sub-services ──────────────────────────────────────────── */

export async function saveSubServiceAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const db = await adminDb();
  const id = String(formData.get("id") ?? "");
  const row = {
    category_slug: String(formData.get("category_slug") ?? "ac"),
    slug: String(formData.get("slug") ?? "").trim(),
    name: localized(formData, "name"),
    short_description: localized(formData, "short_description"),
    is_problem: formData.get("is_problem") === "on",
    status: status(formData),
    order: Number(formData.get("order") ?? 0),
  };
  const { error } = id
    ? await db.from("sub_services").update(row).eq("id", id)
    : await db.from("sub_services").insert(row);
  if (!error) {
    await logActivity(id ? "Service updated" : "Service added", "sub_services", id || null, row.name.ar || row.name.en);
    revalidateSite();
  }
  redirect("/admin/services");
}

export async function deleteSubServiceAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const db = await adminDb();
  await db.from("sub_services").delete().eq("id", String(formData.get("id") ?? ""));
  revalidateSite();
  redirect("/admin/services");
}

export async function reorderAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const db = await adminDb();
  const table = String(formData.get("table") ?? "");
  const id = String(formData.get("id") ?? "");
  const direction = String(formData.get("direction") ?? "up");
  const allowed = ["sub_services", "faqs", "reviews", "photos", "areas"];
  if (!allowed.includes(table)) return;

  const { data: current } = await db.from(table).select("*").eq("id", id).single();
  if (!current) return;

  const query = db.from(table).select("id, order").order("order");
  const { data: siblings } =
    table === "sub_services"
      ? await query.eq("category_slug", current.category_slug)
      : await query;
  const list = siblings ?? [];
  const idx = list.findIndex((r) => r.id === id);
  const swapWith = direction === "up" ? list[idx - 1] : list[idx + 1];
  if (swapWith) {
    await db.from(table).update({ order: swapWith.order }).eq("id", current.id);
    await db.from(table).update({ order: current.order }).eq("id", swapWith.id);
    revalidateSite();
  }
  redirect(`/admin/${table === "sub_services" ? "services" : table}`);
}

/* ── Settings (singleton row id=1) ────────────────────────────────────── */

export async function saveSettingsAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const db = await adminDb();
  const data = {
    businessName: String(formData.get("businessName") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    whatsapp: String(formData.get("whatsapp") ?? "").trim(),
    address: localized(formData, "address"),
    mapsLink: String(formData.get("mapsLink") ?? "").trim(),
    emergencyEnabled: formData.get("emergencyEnabled") === "on",
    defaultWhatsappMessage: localized(formData, "defaultWhatsappMessage"),
    emergencyWhatsappMessage: localized(formData, "emergencyWhatsappMessage"),
    whatsappMessageMode: String(formData.get("whatsappMessageMode") ?? "current"),
    seoTitle: localized(formData, "seoTitle"),
    seoDescription: localized(formData, "seoDescription"),
  };
  const { error } = await db
    .from("settings")
    .upsert({ id: 1, data, updated_at: new Date().toISOString() });
  if (!error) {
    await logActivity("Settings updated", "settings", "1", "Website settings");
    revalidateSite();
  }
  redirect("/admin/settings?saved=1");
}

/* ── Media library ────────────────────────────────────────────────────── */

export async function uploadMediaAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const db = await adminDb();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) redirect("/admin/media?error=empty");
  if (file.size > 8 * 1024 * 1024) redirect("/admin/media?error=size");
  const type = file.type;
  if (!/^image\/(png|jpe?g|webp|avif)$/.test(type)) redirect("/admin/media?error=type");

  const ext = type.split("/")[1].replace("jpeg", "jpg");
  const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error: upErr } = await db.storage
    .from("media")
    .upload(path, file, { contentType: type, upsert: false });
  if (upErr) redirect("/admin/media?error=upload");

  const { data } = db.storage.from("media").getPublicUrl(path);
  await db.from("media").insert({ url: data.publicUrl, path, size_bytes: file.size });
  await logActivity("Photo uploaded", "media", null, path);
  revalidateSite();
  redirect("/admin/media");
}

export async function deleteMediaAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const db = await adminDb();
  const id = String(formData.get("id") ?? "");
  const path = String(formData.get("path") ?? "");
  if (path) await db.storage.from("media").remove([path]);
  await db.from("media").delete().eq("id", id);
  revalidateSite();
  redirect("/admin/media");
}
