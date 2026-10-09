import { createClient } from "@supabase/supabase-js";
import type { Env } from "./env";

const options = { auth: { persistSession: false, autoRefreshToken: false } };

// Full database access (bypasses RLS). Only ever used inside Functions.
export function dbClient(env: Env) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_SECRET_KEY, options);
}

// Used only to verify admin access tokens.
export function authClient(env: Env) {
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, options);
}
