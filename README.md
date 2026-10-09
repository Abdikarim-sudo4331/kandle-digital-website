# Kandle Digital — website + light CMS

React (Vite) front end on **Cloudflare Pages**, API as **Pages Functions**, data and admin
login on **Supabase**.

- Public site: `/`, `/services`, `/about`, `/contact`
- Admin CMS: `/admin` — contact inquiries inbox, services, and editable copy for every page

## How it fits together

```
Browser ──► Cloudflare Pages
              ├─ static files (dist/public)
              ├─ functions/_middleware.ts  inlines CMS content into each page's HTML
              └─ functions/api/[[route]].ts → server/api.ts (Hono) ──► Supabase (HTTPS, secret key)
                                                     │
                                                     └─ verifies admin logins with Supabase Auth
                                                        + ADMIN_EMAILS allowlist
```

- The browser never touches the database. Every table has **Row Level Security on with no
  policies**, so the public key (which browsers see) can't read or write anything. Only the
  API, using the secret key, can.
- Page content is inlined into the HTML, so pages render with the CMS copy on first paint.
  It's cached at Cloudflare's edge for up to 60 seconds: a save clears the cache where you are,
  and other regions pick it up within a minute.
- If Supabase is unreachable, the site falls back to the built-in copy in `shared/content.ts`
  instead of going down.

## Setup

1. **Supabase project.** In the SQL Editor, run [`supabase/setup.sql`](supabase/setup.sql).
   It creates the tables, locks them down, and loads the current site copy. Safe to re-run.
2. **Admin user.** Supabase → Authentication → Users → *Add user* (tick *Auto Confirm User*).
3. **Turn off public sign-ups.** Supabase → Authentication → Sign In / Providers → disable
   *Allow new users to sign up*.
4. **Local env.** `cp .dev.vars.example .dev.vars` and fill it in (see comments in the file).
5. **Run locally:**
   ```bash
   npm install
   npm run dev       # http://localhost:5000, admin at /admin
   ```
   This runs the real Cloudflare runtime locally. It rebuilds on save; refresh the browser to
   see changes.

## Deploying to Cloudflare Pages

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → *Connect to Git* →
   pick this repo.
2. Build settings:
   - Framework preset: **None**
   - Build command: `npm run build`
   - Build output directory: `dist/public`
3. **Settings → Variables and Secrets** → add these four as type **Secret**, for Production
   (and Preview if you use preview deploys):
   `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SECRET_KEY`, `ADMIN_EMAILS`.
4. Redeploy after adding secrets (Deployments → ⋯ → Retry deployment).

### Spam protection

The contact form has a hidden honeypot field that silently drops most bots. For more, add a
free rate-limit rule: your domain → **Security → WAF → Rate limiting rules** → match
`URI Path equals /api/contact` and `Method equals POST`, e.g. 5 requests per 10 seconds per IP → Block.
(This needs the site on a custom domain in your Cloudflare account.)

## Editing content in code

- Tables: `supabase/setup.sql` (structure) and `shared/schema.ts` (types + validation) —
  keep them in sync.
- Editable page sections, their validation, default copy and admin form fields:
  `shared/content.ts`. To make new text editable, add it to the section's schema, its default,
  and its `contentFields` entry, then use it via `useContent()` in the page.
