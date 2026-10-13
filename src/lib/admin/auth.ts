import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

/**
 * Admin auth (PRD §12.1): ONE admin account via Supabase Email/Password.
 * The allow-list (ADMIN_LOGIN_EMAIL) is re-verified server-side on every
 * page load and every mutation — session possession alone is not enough.
 * Passwords live only in Supabase Auth; never in code or env files.
 */
export const getAdminEmail = (): string =>
  (process.env.ADMIN_LOGIN_EMAIL ?? "").trim().toLowerCase();

export interface AdminConfigStatus {
  /** NEXT_PUBLIC_SUPABASE_URL present */
  supabaseUrl: boolean;
  /** anon/publishable key present (sb_publishable_… or legacy anon JWT) */
  anonKey: boolean;
  /** SUPABASE_SERVICE_ROLE_KEY present — required for CMS writes only */
  serviceRoleKey: boolean;
  /** ADMIN_LOGIN_EMAIL present — required for the fail-closed allow-list */
  adminEmail: boolean;
  /** Enough to show the login form and authenticate (url + anon + allow-list email) */
  loginReady: boolean;
  /** Enough for CMS CRUD (loginReady + service-role) */
  cmsReady: boolean;
}

/** Which of the required variables are set — booleans only, never values. */
export function getAdminConfigStatus(): AdminConfigStatus {
  const supabaseUrl = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim());
  const anonKey = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim());
  const serviceRoleKey = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
  const adminEmail = Boolean(getAdminEmail());
  return {
    supabaseUrl,
    anonKey,
    serviceRoleKey,
    adminEmail,
    loginReady: supabaseUrl && anonKey && adminEmail,
    cmsReady: supabaseUrl && anonKey && serviceRoleKey && adminEmail,
  };
}

/** Names of the variables still missing for login / CMS (for UI messaging). */
export function getMissingVarNames(status: AdminConfigStatus) {
  const missing: string[] = [];
  if (!status.supabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!status.anonKey) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  if (!status.adminEmail) missing.push("ADMIN_LOGIN_EMAIL");
  const missingForCms = missing.slice();
  if (!status.serviceRoleKey) missingForCms.push("SUPABASE_SERVICE_ROLE_KEY");
  return { missingForLogin: missing, missingForCms };
}

/** Returns the allow-listed admin user's email, or null. */
export const getAdminSession = cache(async (): Promise<string | null> => {
  const status = getAdminConfigStatus();
  if (!status.supabaseUrl || !status.anonKey) return null;
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;
  return user.email.toLowerCase() === getAdminEmail() ? user.email : null;
});

/** Guard for admin pages: redirects to login when not the allow-listed admin. */
export async function requireAdmin(): Promise<string> {
  const email = await getAdminSession();
  if (!email) redirect("/admin/login");
  return email;
}

/** Guard for admin mutations: throws unless the caller is the allow-listed admin. */
export async function assertAdmin(): Promise<string> {
  const email = await getAdminSession();
  if (!email) throw new Error("UNAUTHORIZED");
  return email;
}

/** Service-role DB handle for admin mutations (server-only, RLS-bypassing). */
export async function adminDb() {
  await assertAdmin();
  return getSupabaseAdminClient();
}

export async function logActivity(
  action: string,
  entityType: string,
  entityId: string | null,
  title: string
) {
  try {
    const db = getSupabaseAdminClient();
    await db.from("activity").insert({ action, entity_type: entityType, entity_id: entityId, title });
    await db.from("notifications").insert({ message: `${action}: ${title}`, entity_ref: entityId });
  } catch {
    // Activity logging must never break the mutation itself.
  }
}
