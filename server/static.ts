import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { injectSiteData } from "./site-data";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // index: false so "/" falls through to the handler below and gets site data injected
  app.use(express.static(distPath, { index: false }));

  const template = fs.readFileSync(path.resolve(distPath, "index.html"), "utf-8");

  // fall through to index.html if the file doesn't exist
  app.use("*", async (_req, res, next) => {
    try {
      const page = await injectSiteData(template);
      res.status(200).set({ "Content-Type": "text/html", "Cache-Control": "no-cache" }).end(page);
    } catch (e) {
      next(e);
    }
  });
}
