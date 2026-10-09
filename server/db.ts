import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Use the Supabase connection string (Project Settings → Database).",
  );
}

// node-postgres lets `sslmode` in the URL override the `ssl` option below,
// so strip it and configure TLS explicitly.
const url = new URL(process.env.DATABASE_URL);
url.searchParams.delete("sslmode");
const isLocal = ["localhost", "127.0.0.1"].includes(url.hostname);

// Supabase signs its Postgres certs with its own CA. Download it from
// Project Settings → Database → SSL and set SUPABASE_DB_CA to the PEM
// contents to get full certificate verification.
const ca = process.env.SUPABASE_DB_CA?.replace(/\\n/g, "\n");
if (!isLocal && !ca) {
  console.warn("[db] SUPABASE_DB_CA not set — TLS is encrypted but the server certificate is not verified");
}

export const pool = new Pool({
  connectionString: url.toString(),
  ssl: isLocal ? false : ca ? { ca } : { rejectUnauthorized: false },
  max: 5,
});
export const db = drizzle(pool, { schema });
