import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { boot } from "./site";

const url = boot.config?.supabaseUrl;
const anonKey = boot.config?.supabaseAnonKey;

// Only used for admin sign-in. All data access goes through our API (functions/).
export const supabase: SupabaseClient | null =
  url && anonKey ? createClient(url, anonKey) : null;
