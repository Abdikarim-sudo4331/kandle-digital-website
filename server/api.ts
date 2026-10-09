import { Hono, type Context, type MiddlewareHandler } from "hono";
import { z } from "zod";
import { api } from "../shared/routes";
import { contentKeys, contentSchemas, resolveBlock, type ContentKey, type PageContent } from "../shared/content";
import type { Env } from "./env";
import { Storage } from "./storage";
import { authClient, dbClient } from "./supabase";
import { getSiteData, invalidateSiteData } from "./site-data";

type AppEnv = { Bindings: Env; Variables: { adminEmail: string } };
type Ctx = Context<AppEnv>;

const storage = (c: Ctx) => new Storage(dbClient(c.env));

function parseId(c: Ctx): number | null {
  const id = Number(c.req.param("id"));
  return Number.isInteger(id) && id > 0 ? id : null;
}

// Signing in to Supabase is not enough: the email must also be in ADMIN_EMAILS.
const requireAdmin: MiddlewareHandler<AppEnv> = async (c, next) => {
  const header = c.req.header("Authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return c.json({ message: "Not signed in" }, 401);

  // Verifies the JWT with Supabase (handles expiry, revocation and key rotation).
  const { data, error } = await authClient(c.env).auth.getUser(token);
  if (error || !data.user) return c.json({ message: "Session expired, please sign in again" }, 401);

  const allowed = new Set(
    (c.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean),
  );
  const email = data.user.email?.toLowerCase();
  if (!email || !allowed.has(email)) return c.json({ message: "This account is not an admin" }, 403);

  c.set("adminEmail", email);
  await next();
};

export const app = new Hono<AppEnv>();

app.onError((err, c) => {
  if (err instanceof z.ZodError) {
    return c.json({ message: err.errors[0].message, field: err.errors[0].path.join(".") }, 400);
  }
  console.error(err);
  return c.json({ message: "Internal Server Error" }, 500);
});

app.notFound((c) => c.json({ message: "Not found" }, 404));

// ---- Public ------------------------------------------------------------

app.get(api.site.get.path, async (c) => {
  return c.json(await getSiteData(c.env, (p) => c.executionCtx.waitUntil(p)));
});

app.post(api.contact.submit.path, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  // Honeypot: a hidden field real visitors never fill in. Pretend success to bots.
  if (typeof body?.website === "string" && body.website.trim() !== "") {
    return c.json({}, 201);
  }
  const input = api.contact.submit.input.parse(body);
  return c.json(await storage(c).createContactInquiry(input), 201);
});

// ---- Admin -------------------------------------------------------------

app.use("/api/admin/*", requireAdmin);

app.get(api.admin.me.path, (c) => c.json({ email: c.get("adminEmail") }));

app.get(api.admin.inquiries.list.path, async (c) => c.json(await storage(c).listContactInquiries()));

app.patch(api.admin.inquiries.update.path, async (c) => {
  const id = parseId(c);
  if (!id) return c.json({ message: "Invalid id" }, 400);
  const { status } = api.admin.inquiries.update.input.parse(await c.req.json());
  const row = await storage(c).updateContactInquiryStatus(id, status);
  return row ? c.json(row) : c.json({ message: "Not found" }, 404);
});

app.delete(api.admin.inquiries.delete.path, async (c) => {
  const id = parseId(c);
  if (!id) return c.json({ message: "Invalid id" }, 400);
  if (!(await storage(c).deleteContactInquiry(id))) return c.json({ message: "Not found" }, 404);
  return c.body(null, 204);
});

app.get(api.admin.services.list.path, async (c) => c.json(await storage(c).listServices()));

app.post(api.admin.services.create.path, async (c) => {
  const input = api.admin.services.create.input.parse(await c.req.json());
  const row = await storage(c).createService(input);
  await invalidateSiteData();
  return c.json(row, 201);
});

app.put(api.admin.services.update.path, async (c) => {
  const id = parseId(c);
  if (!id) return c.json({ message: "Invalid id" }, 400);
  const input = api.admin.services.update.input.parse(await c.req.json());
  const row = await storage(c).updateService(id, input);
  if (!row) return c.json({ message: "Not found" }, 404);
  await invalidateSiteData();
  return c.json(row);
});

app.delete(api.admin.services.delete.path, async (c) => {
  const id = parseId(c);
  if (!id) return c.json({ message: "Invalid id" }, 400);
  if (!(await storage(c).deleteService(id))) return c.json({ message: "Not found" }, 404);
  await invalidateSiteData();
  return c.body(null, 204);
});

app.get(api.admin.content.list.path, async (c) => {
  const blocks = await storage(c).getContentBlocks();
  const content = Object.fromEntries(contentKeys.map((key) => [key, resolveBlock(key, blocks[key])])) as PageContent;
  return c.json(content);
});

app.put(api.admin.content.update.path, async (c) => {
  const key = c.req.param("key") as ContentKey;
  if (!contentKeys.includes(key)) return c.json({ message: "Unknown content section" }, 404);
  const data = contentSchemas[key].parse(await c.req.json());
  await storage(c).upsertContentBlock(key, data);
  await invalidateSiteData();
  return c.json(data);
});
