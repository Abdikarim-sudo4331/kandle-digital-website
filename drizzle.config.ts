import { defineConfig } from "drizzle-kit";
import { existsSync } from "fs";

if (existsSync(".env")) process.loadEnvFile(".env");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set (use your Supabase connection string)");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
  // Only manage our own tables; Supabase owns auth/storage/etc.
  schemaFilter: ["public"],
});
