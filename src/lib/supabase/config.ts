/**
 * Supabase environment access.
 * Phase 0 keeps everything lazy: no credentials are required for the app
 * to build or render. Clients throw a descriptive error only if used
 * while unconfigured (see browser.ts / server.ts / admin.ts).
 */
export function getSupabaseEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

/** True when the public (anon) Supabase config is present. */
export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseEnv();
  return Boolean(url && anonKey);
}
