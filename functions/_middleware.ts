// Runs for page requests (see client/public/_routes.json): inlines the CMS
// content into the HTML so pages render with the right copy on first paint.
import type { Env } from "../server/env";
import { bootScript } from "../server/site-data";

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const res = await ctx.next();
  const url = new URL(ctx.request.url);
  if (url.pathname.startsWith("/api/") || !(res.headers.get("Content-Type") ?? "").includes("text/html")) {
    return res;
  }

  try {
    const script = await bootScript(ctx.env, (p) => ctx.waitUntil(p));
    const html = new HTMLRewriter()
      .on("head", { element: (el) => { el.append(script, { html: true }); } })
      .transform(res);
    const out = new Response(html.body, html);
    // The HTML now carries live content, so browsers must not reuse a stale copy.
    out.headers.set("Cache-Control", "no-cache");
    out.headers.delete("ETag");
    return out;
  } catch (err) {
    console.error("[middleware] could not inject site data:", err);
    return res;
  }
};
