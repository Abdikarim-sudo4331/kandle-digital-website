import { contentKeys, defaultSiteData, resolveBlock, type PageContent, type SiteData } from "../shared/content";
import type { Env } from "./env";
import { Storage } from "./storage";
import { dbClient } from "./supabase";

// Cloudflare's edge cache (per data center). Saving in the admin clears it
// in the admin's data center; elsewhere it expires within CACHE_SECONDS.
const CACHE_KEY = "https://kandle-cache.internal/site-data-v1";
const CACHE_SECONDS = 60;

export async function invalidateSiteData() {
  await caches.default.delete(CACHE_KEY);
}

async function loadSiteData(env: Env): Promise<SiteData> {
  const storage = new Storage(dbClient(env));
  const [blocks, rows] = await Promise.all([storage.getContentBlocks(), storage.listServices()]);
  const content = Object.fromEntries(contentKeys.map((key) => [key, resolveBlock(key, blocks[key])])) as PageContent;
  return {
    content,
    // An empty table means "not set up yet", not "no services".
    services: rows.length
      ? rows.filter((s) => s.published).map(({ id, title, summary, description, features, icon, featured }) => ({
          id, title, summary, description, features, icon, featured,
        }))
      : defaultSiteData.services,
  };
}

export async function getSiteData(env: Env, waitUntil: (p: Promise<unknown>) => void): Promise<SiteData> {
  const cached = await caches.default.match(CACHE_KEY);
  if (cached) return cached.json();

  try {
    const data = await loadSiteData(env);
    waitUntil(caches.default.put(
      CACHE_KEY,
      new Response(JSON.stringify(data), {
        headers: { "Content-Type": "application/json", "Cache-Control": `max-age=${CACHE_SECONDS}` },
      }),
    ));
    return data;
  } catch (err) {
    // Keep the public site up if Supabase is unreachable or not configured.
    console.error("[site-data] falling back to defaults:", err);
    return defaultSiteData;
  }
}

// Inline script giving the page its content and public Supabase config,
// so it renders with the right copy on first paint.
export async function bootScript(env: Env, waitUntil: (p: Promise<unknown>) => void): Promise<string> {
  const payload = {
    site: await getSiteData(env, waitUntil),
    config: { supabaseUrl: env.SUPABASE_URL ?? null, supabaseAnonKey: env.SUPABASE_ANON_KEY ?? null },
  };
  // Escape "<" so content can't close the script tag.
  const json = JSON.stringify(payload).replace(/</g, "\\u003c");
  return `<script>window.__BOOT__=${json}</script>`;
}
