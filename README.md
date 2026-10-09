# Kandle Digital — website + light CMS

React (Vite) front end, Express API, Postgres on **Supabase**, admin login via **Supabase Auth**.

- Public site: `/`, `/services`, `/about`, `/contact`
- Admin CMS: `/admin` — contact inquiries inbox, services, and editable copy for every page

## How it fits together

```
Browser ──► Express (server/) ──► Supabase Postgres (via DATABASE_URL, Drizzle ORM)
   │                 │
   │                 └── verifies admin JWTs with Supabase Auth + ADMIN_EMAILS allowlist
   └── /admin signs in with Supabase Auth (email + password)
```

- All reads/writes go through the Express API. The browser never queries the database directly.
- Every table has **Row Level Security enabled with no policies**, so Supabase's auto-generated
  REST API (reachable with the public anon key) can't read or write them. The server connects as
  the database owner, which bypasses RLS.
- Page content is injected into the HTML on each request (`window.__BOOT__`), so pages render
  with the CMS copy on first paint with no loading flash. Edits go live immediately; direct SQL
  edits show up within 60 seconds (in-memory cache).
- If the database is unreachable, the site falls back to the built-in default copy in
  `shared/content.ts` instead of going down.

## Setup

1. **Create a Supabase project** at https://supabase.com.
2. **Configure env vars**: `cp .env.example .env` and fill it in (see comments in the file).
3. **Create the tables** and **seed the current site copy**:
   ```bash
   npm install
   npm run db:push   # creates tables (with RLS enabled)
   npm run db:seed   # inserts current copy + services; safe to re-run
   ```
4. **Create your admin user** in Supabase → Authentication → Users → *Add user*
   (email + password, tick *Auto Confirm User*). Put the same email in `ADMIN_EMAILS`.
5. **Turn off public sign-ups**: Supabase → Authentication → Sign In / Providers →
   disable *Allow new users to sign up*. The `ADMIN_EMAILS` allowlist already blocks
   strangers from the CMS, but there's no reason to let them create accounts.
6. Run it:
   ```bash
   npm run dev       # http://localhost:5000, admin at /admin
   ```

## Deploying

This is a Node server (not a static site). Any Node host works — Render, Railway, Fly.io, a VPS.

```bash
npm run build
npm start          # serves the built site + API on $PORT (default 5000)
```

Set the same env vars on the host. Run `npm run db:push` again whenever `shared/schema.ts` changes.

## Editing content in code

- Table definitions: `shared/schema.ts`
- Editable page sections, their validation, default copy and admin form fields: `shared/content.ts`.
  To make a new piece of text editable, add it to the section's schema, its default, and its
  `contentFields` entry, then use it via `useContent()` in the page.
