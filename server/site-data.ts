import {
  contentKeys,
  defaultSiteData,
  resolveBlock,
  type PageContent,
  type SiteData,
} from "@shared/content";
import { storage } from "./storage";
import { supabaseAnonKey, supabaseUrl } from "./auth";

// Public content changes only when an admin saves, so cache it in memory and
// drop the cache on every admin write.
let cache: { data: SiteData; at: number } | null = null;
const TTL_MS = 60_000;

export function invalidateSiteData() {
  cache = null;
}

export async function getSiteData(): Promise<SiteData> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.data;

  try {
    const [blocks, rows] = await Promise.all([
      storage.getContentBlocks(),
      storage.listServices(),
    ]);
    const content = Object.fromEntries(
      contentKeys.map((key) => [key, resolveBlock(key, blocks[key])]),
    ) as PageContent;
    const data: SiteData = {
      content,
      // An empty table means "not seeded yet", not "no services".
      services: rows.length
        ? rows.filter((s) => s.published).map(({ id, title, summary, description, features, icon, featured }) => ({
            id, title, summary, description, features, icon, featured,
          }))
        : defaultSiteData.services,
    };
    cache = { data, at: Date.now() };
    return data;
  } catch (err) {
    // Keep the public site up if the database is unreachable.
    console.error("[site-data] falling back to defaults:", err);
    return cache?.data ?? defaultSiteData;
  }
}

// Inline site data and public Supabase config into index.html so pages render
// with the right copy on first paint, with no extra request.
export async function injectSiteData(html: string): Promise<string> {
  const payload = {
    site: await getSiteData(),
    config: { supabaseUrl: supabaseUrl ?? null, supabaseAnonKey: supabaseAnonKey ?? null },
  };
  // Escape "<" so content can't close the script tag.
  const json = JSON.stringify(payload).replace(/</g, "\\u003c");
  return html.replace("</head>", `<script>window.__BOOT__=${json}</script></head>`);
}
