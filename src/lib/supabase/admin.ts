/**
 * Supabase ADMIN client — service role, SERVER-ONLY.
 *
 * `import "server-only"` makes any accidental import from a Client Component
 * fail at build time. The service role key bypasses Row Level Security, so
 * it must never be exposed to the browser, never be prefixed NEXT_PUBLIC_,
 * and never be logged.
 *
 * Every admin write must additionally be re-verified server-side against the
 * allow-listed admin (ADMIN_LOGIN_EMAIL) before this client is used (PRD §12.1).
 */
import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./config";

let adminClient: SupabaseClient | null = null;

export function getSupabaseAdminClient() {
  const { url, serviceRoleKey } = getSupabaseEnv();
  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase admin client is not configured. Set SUPABASE_SERVICE_ROLE_KEY in .env.local (server-side only)."
    );
  }
  adminClient ??= createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}
