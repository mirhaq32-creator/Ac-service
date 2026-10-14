import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Default config: no R2 incremental cache. Pages are rendered on demand and
// content comes from Supabase (or the built-in seed content).
export default defineCloudflareConfig();
