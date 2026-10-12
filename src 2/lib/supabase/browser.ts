/**
 * Supabase browser client — the ONLY module the browser may use.
 * It carries just NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
 * and is constrained by Row Level Security. The service role key can never
 * reach this file.
 */
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "./config";

let client: SupabaseClient | null = null;

export function getSupabaseBrowserClient() {
  const { url, anonKey } = getSupabaseEnv();
  if (!url || !anonKey) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local."
    );
  }
  client ??= createBrowserClient(url, anonKey);
  return client;
}
