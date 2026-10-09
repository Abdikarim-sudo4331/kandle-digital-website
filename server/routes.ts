import type { Express, Request, Response, NextFunction, RequestHandler } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { contentKeys, contentSchemas, resolveBlock, type ContentKey, type PageContent } from "@shared/content";
import { z } from "zod";
import { requireAdmin } from "./auth";
import { getSiteData, invalidateSiteData } from "./site-data";

// Express 4 doesn't forward rejected promises to the error handler.
const wrap =
  (fn: (req: Request, res: Response) => Promise<unknown>): RequestHandler =>
  (req, res, next) =>
    fn(req, res).catch(next);

function parseId(req: Request): number | null {
  const id = Number(req.params.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

// Basic per-IP limit on the public contact form to slow down spam.
const contactHits = new Map<string, number[]>();
function contactRateLimit(req: Request, res: Response, next: NextFunction) {
  const windowMs = 10 * 60_000;
  const max = 5;
  const now = Date.now();
  const key = req.ip ?? "unknown";
  const recent = (contactHits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    return res.status(429).json({ message: "Too many messages. Please try again later or reach us on WhatsApp." });
  }
  recent.push(now);
  contactHits.set(key, recent);
  if (contactHits.size > 10_000) contactHits.clear();
  next();
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // ---- Public ----------------------------------------------------------

  app.get(api.site.get.path, wrap(async (_req, res) => {
    res.json(await getSiteData());
  }));

  app.post(api.contact.submit.path, contactRateLimit, wrap(async (req, res) => {
    const input = api.contact.submit.input.parse(req.body);
    const result = await storage.createContactInquiry(input);
    res.status(201).json(result);
  }));

  // ---- Admin (Supabase session + ADMIN_EMAILS allowlist) ---------------

  app.use("/api/admin", requireAdmin);

  app.get(api.admin.me.path, (req, res) => {
    res.json({ email: req.adminUser!.email });
  });

  app.get(api.admin.inquiries.list.path, wrap(async (_req, res) => {
    res.json(await storage.listContactInquiries());
  }));

  app.patch(api.admin.inquiries.update.path, wrap(async (req, res) => {
    const id = parseId(req);
    if (!id) return res.status(400).json({ message: "Invalid id" });
    const { status } = api.admin.inquiries.update.input.parse(req.body);
    const row = await storage.updateContactInquiryStatus(id, status);
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(row);
  }));

  app.delete(api.admin.inquiries.delete.path, wrap(async (req, res) => {
    const id = parseId(req);
    if (!id) return res.status(400).json({ message: "Invalid id" });
    if (!(await storage.deleteContactInquiry(id))) return res.status(404).json({ message: "Not found" });
    res.status(204).end();
  }));

  app.get(api.admin.services.list.path, wrap(async (_req, res) => {
    res.json(await storage.listServices());
  }));

  app.post(api.admin.services.create.path, wrap(async (req, res) => {
    const input = api.admin.services.create.input.parse(req.body);
    const row = await storage.createService(input);
    invalidateSiteData();
    res.status(201).json(row);
  }));

  app.put(api.admin.services.update.path, wrap(async (req, res) => {
    const id = parseId(req);
    if (!id) return res.status(400).json({ message: "Invalid id" });
    const input = api.admin.services.update.input.parse(req.body);
    const row = await storage.updateService(id, input);
    if (!row) return res.status(404).json({ message: "Not found" });
    invalidateSiteData();
    res.json(row);
  }));

  app.delete(api.admin.services.delete.path, wrap(async (req, res) => {
    const id = parseId(req);
    if (!id) return res.status(400).json({ message: "Invalid id" });
    if (!(await storage.deleteService(id))) return res.status(404).json({ message: "Not found" });
    invalidateSiteData();
    res.status(204).end();
  }));

  app.get(api.admin.content.list.path, wrap(async (_req, res) => {
    const blocks = await storage.getContentBlocks();
    const content = Object.fromEntries(
      contentKeys.map((key) => [key, resolveBlock(key, blocks[key])]),
    ) as PageContent;
    res.json(content);
  }));

  app.put(api.admin.content.update.path, wrap(async (req, res) => {
    const key = req.params.key as ContentKey;
    if (!contentKeys.includes(key)) return res.status(404).json({ message: "Unknown content section" });
    const data = contentSchemas[key].parse(req.body);
    await storage.upsertContentBlock(key, data);
    invalidateSiteData();
    res.json(data);
  }));

  // Turn validation errors from any route into 400s.
  app.use("/api", (err: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        message: err.errors[0].message,
        field: err.errors[0].path.join('.'),
      });
    }
    next(err);
  });

  return httpServer;
}
