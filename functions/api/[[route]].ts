// Every /api/* request is handled by the Hono app in server/api.ts.
import { handle } from "hono/cloudflare-pages";
import { app } from "../../server/api";

export const onRequest = handle(app);
