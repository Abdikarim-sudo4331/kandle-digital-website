import type { Request, Response, NextFunction } from "express";
import { createClient, type User } from "@supabase/supabase-js";

declare global {
  namespace Express {
    interface Request {
      adminUser?: User;
    }
  }
}

export const supabaseUrl = process.env.SUPABASE_URL;
export const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

// Comma-separated allowlist. Signing in to Supabase is not enough on its own:
// the user's email must also be listed here.
const adminEmails = new Set(
  (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
);

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!supabase) {
    return res.status(503).json({ message: "Admin is not configured (SUPABASE_URL / SUPABASE_ANON_KEY missing)" });
  }

  const header = req.headers.authorization ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "Not signed in" });

  // Verifies the JWT with Supabase (handles expiry, revocation and key rotation).
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return res.status(401).json({ message: "Session expired, please sign in again" });

  const email = data.user.email?.toLowerCase();
  if (!email || !adminEmails.has(email)) {
    return res.status(403).json({ message: "This account is not an admin" });
  }

  req.adminUser = data.user;
  next();
}
