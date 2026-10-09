// Environment variables / secrets, set in Cloudflare Pages → Settings →
// Variables and Secrets (and in .dev.vars for local development).
export interface Env {
  SUPABASE_URL: string;
  // Public key ("publishable" or legacy "anon"). Sent to browsers for admin sign-in.
  SUPABASE_ANON_KEY: string;
  // Server-only key ("secret" or legacy "service_role"). Never expose to the browser.
  SUPABASE_SECRET_KEY: string;
  // Comma-separated emails allowed into /admin
  ADMIN_EMAILS?: string;
}
