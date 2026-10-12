/**
 * Supabase access layers (PRD §3.1/§3.2, Supabase edition):
 * - browser.ts — anon client for Client Components (RLS-protected)
 * - server.ts — anon client for RSC / route handlers (RLS-protected)
 * - admin.ts  — service-role client, server-only, used only after the
 *               caller is verified as the allow-listed admin
 *
 * The database holds CMS content ONLY (D2). There are — and will never be —
 * bookings, customers, leads, or visitor-tracking tables: the booking form
 * builds a WhatsApp message in the browser and nothing else (D1).
 */
export { isSupabaseConfigured, getSupabaseEnv } from "./config";
