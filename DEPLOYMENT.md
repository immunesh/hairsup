# HairsUp — Deployment Plan

**Target architecture** (per decisions taken):

| Piece | Host | Why |
|---|---|---|
| Next.js frontend | **Vercel** | Native target. |
| Express backend | **Render or Railway** | Long-running Node server — keeps the in-memory rate limiter, disk uploads and Prisma connection pooling behaving as they do locally. No serverless rewrite. |
| Database | **Neon Postgres** | SQLite cannot run on either host. |

Nothing in this document has been applied. No code has been changed.

---

## Status: the app does not currently build

This is the blocker to clear before anything else. Verified on this machine:

```
$ npx next build
BUILD EXIT: 1

> Export encountered errors on following paths:
	/(shop)/order-confirmed/page: /order-confirmed
	/(shop)/products/page: /products
	/(shop)/search/page: /search
	/(shop)/shop/page: /shop
	/(shop)/women/page: /women
```

`next build` is exactly what Vercel runs. **A deploy today fails in CI and never goes live.** The backend is healthier — `npx tsc --noEmit` exits 0 — but note `npm run dev` uses `ts-node-dev --transpile-only`, so local dev has never been typechecking; only the production build catches these.

---

## Step 1 — Fix the build (blocking)

Five pages call `useSearchParams()` without a Suspense boundary. Next 14 fails the static export for each:

- `app/(shop)/order-confirmed/page.tsx`
- `app/(shop)/products/page.tsx`
- `app/(shop)/search/page.tsx`
- `app/(shop)/shop/page.tsx`
- `app/(shop)/women/page.tsx`

**Fix:** split each page so the `useSearchParams()` call lives in a child component, and wrap that child in `<Suspense fallback={...}>` in the page. The existing `app/(shop)/stores/` folder already uses the split-client-component pattern (`StoresClient.tsx`) and is the model to copy.

**Exit criteria:** `npx next build` exits 0.

---

## Step 2 — Provision Neon

1. Create a Neon project, region close to your users.
2. Copy **two** connection strings:
   - **Pooled** (`-pooler` host) → runtime `DATABASE_URL`
   - **Direct** → `DIRECT_URL`, used for migrations

Prisma needs both; migrations must not run through the pooler.

---
DIRECT_URL: postgresql://neondb_owner:npg_aF4xyzfboH1L@ep-spring-sunset-az0uec1h.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require


DATABASE_URL: postgresql://neondb_owner:npg_aF4xyzfboH1L@ep-spring-sunset-az0uec1h-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

For Dev Branch:
DATABASE_URL: postgresql://neondb_owner:npg_aF4xyzfboH1L@ep-fancy-heart-az3pbsmn-pooler.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

DIRECT_URL: postgresql://neondb_owner:npg_aF4xyzfboH1L@ep-fancy-heart-az3pbsmn.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require&connect_timeout=15


## Step 3 — Migrate Prisma from SQLite to Postgres

Both schemas are currently SQLite:

- `backend/prisma/schema.prisma`
- `frontend/prisma/schema.prisma`

**Work:**

1. Change `provider = "sqlite"` → `"postgresql"` in both; add `directUrl = env("DIRECT_URL")` to the datasource block.
2. **Delete and regenerate the 14 migrations** in `backend/prisma/migrations/`. SQLite migration SQL is not valid Postgres — they cannot be reused. Regenerate one clean `init` against Neon.
3. Review column types after regeneration. SQLite is loosely typed and Postgres is not; the `String`-typed enum-ish fields (`User.role`, `Order.status`) are worth confirming.
4. Seed production: `npx ts-node prisma/seed.ts` against Neon. This creates `admin@hairsup.com` / `Admin@123` — **change this password before going live.**

> **Data note:** the local `backend/prisma/dev.db` was created from scratch during setup and holds only the seeded admin plus 10 products. There is no existing user data to migrate. If you have an older `dev.db` with real data, say so before this step — moving it needs a separate export/import pass.

---

## Step 4 — Remove hardcoded `localhost:5000`

**35 references across 22 files** bypass `NEXT_PUBLIC_API_URL` and call `http://localhost:5000` directly. In production these point at the visitor's own machine, so every affected page breaks.

Worst offenders:

| File | Refs |
|---|---|
| `app/admin/products/edit/[id]/page.tsx` | 5 |
| `app/admin/products/create/page.tsx` | 4 |
| `app/admin/page.tsx` | 3 |
| `components/admin/EditHeroSlideForm.tsx` | 2 |
| `components/admin/EditCategoryForm.tsx` | 2 |
| `app/admin/hero-slides/create/page.tsx` | 2 |
| `app/admin/categories/create/page.tsx` | 2 |
| …15 more files | 1 each |

Full list: `app/(shop)/products/[id]/page.tsx`, `app/(shop)/try-on/page.tsx`, `app/admin/categories/edit/[id]/page.tsx`, `app/admin/categories/page.tsx`, `app/admin/hero-slides/edit/[id]/page.tsx`, `app/admin/hero-slides/page.tsx`, `app/admin/products/page.tsx`, `components/DeleteProductButton.tsx`, `components/admin/DeleteCategoryButton.tsx`, `components/admin/DeleteHeroSlideButton.tsx`, `components/features/VirtualTryOn.tsx`, `components/ui/ProductCard.tsx`, `lib/api.ts`, `lib/category-api.ts`, `lib/hero-api.ts`.

**Fix:** route everything through the existing `api` client in `lib/api.ts`, or at minimum through `process.env.NEXT_PUBLIC_API_URL`. The admin pages using raw `fetch()` are the bulk of this.

**Backend side, same problem:**
- `backend/src/routes/upload.routes.ts:51` and `backend/src/controllers/upload.controller.ts:19` both return `http://localhost:5000/uploads/...` as the stored image URL. These must derive from an env var, or every uploaded image is unreachable in production — and any URL written to the DB while this is unfixed is permanently wrong.

Also update `frontend/next.config.js` — `remotePatterns` allows `localhost:5000` for images; add the production backend host or `next/image` will refuse to render product images.

---

## Step 5 — Move uploads off local disk

`backend/src/routes/upload.routes.ts` uses `multer.diskStorage` writing to `uploads/`, served via `express.static("uploads")`.

- **On Render/Railway:** works, but the disk is **ephemeral** — uploads vanish on every redeploy and restart. A persistent volume is required, or:
- **Recommended:** upload to Cloudinary. It is already a backend dependency and the `CLOUDINARY_*` env vars already exist in `.env.example` — the integration was started but never wired up. This also removes the hardcoded URL problem in Step 4.

Note `backend/uploads/` does not currently exist, so there are no existing files to migrate.

---

## Step 6 — Add `prisma generate` to the build

Neither `package.json` runs `prisma generate` in a `build` or `postinstall` script. Vercel and Render install dependencies fresh, so the Prisma client will be missing or stale at build time. This is what the stale `frontend/build-output.txt` recorded from a previous machine:

```
./lib/prisma.ts:1:10
Type error: Module '"@prisma/client"' has no exported member 'PrismaClient'.
```

**Fix:** add `"postinstall": "prisma generate"` to both `package.json` files.

Separately: `frontend/app/api/categories/route.ts` queries the database **directly** via `lib/prisma.ts`, bypassing the backend. That means the Vercel frontend also needs `DATABASE_URL`. Worth deciding whether that route should exist at all, since the backend already owns categories — collapsing it into the backend removes a database credential from the frontend.

---

## Step 7 — Environment variables

**Backend (Render/Railway)** — from `backend/.env.example`:

| Var | Value |
|---|---|
| `DATABASE_URL` | Neon **pooled** string |
| `DIRECT_URL` | Neon **direct** string |
| `JWT_SECRET` / `JWT_REFRESH_SECRET` | **Generate new 32+ char secrets.** The committed `.env.example` values are public. |
| `FRONTEND_URL` | Vercel production URL — drives CORS (`backend/src/app.ts:39`) |
| `PORT` | Provided by host; the code already reads it |
| `NODE_ENV` | `production` |

**Frontend (Vercel)** — from `frontend/.env.example`:

| Var | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `https://<backend-host>/api` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Real Google OAuth client ID |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Real Razorpay key |
| `DATABASE_URL` | Only if `app/api/categories/route.ts` is kept |

**Still placeholders** — every one of these is a stub in `.env.example`, and each corresponding feature is dead until filled: Stripe, Razorpay, Cloudinary, Google OAuth, Gmail (nodemailer), Twilio/WhatsApp. Checkout and payments will not work without them.

---

## Step 8 — Deploy

Cloudinary:
Cloud Name: slvgkmne
Api Key: 944621136268862
API secret: -q7gPjuHLvK4_H_Hd4O6HvVz_Q0

1. **Backend first** (it has no dependency on the frontend URL beyond CORS):
   - Root directory `backend/`, build `npm install && npm run build`, start `npm start`
   - Run `npx prisma migrate deploy` against Neon, then seed
   - Verify: `curl https://<backend>/api/products` → 200
2. **Frontend on Vercel:**
   - Root directory `frontend/`
   - Set env vars from Step 7 **before** the first build — `NEXT_PUBLIC_*` vars are inlined at build time, so changing them later requires a rebuild
3. **Set `FRONTEND_URL` on the backend** to the real Vercel domain and redeploy, or CORS will reject the browser.
4. Smoke test: home page, `/shop`, product detail, login, admin dashboard.

---

## Branching

`main` is protected, so this lands as a branch + PR. Suggested split so review stays tractable:

1. `fix/build-suspense-boundaries` — Step 1. Small, self-contained, unblocks everything.
2. `fix/api-url-config` — Steps 4 and 6. Large but mechanical.
3. `feat/postgres-migration` — Step 3. Needs Neon to exist first.
4. `feat/cloudinary-uploads` — Step 5.

---

## Known issues worth fixing before public launch

Not deployment blockers, but they become real once the app is internet-facing:

1. **Admin auth is client-side only.** `app/admin/layout.tsx:33` gates on `localStorage` `role === "ADMIN"`, and the admin pages call the API with raw `fetch()`, bypassing the axios interceptor. Anyone can set that key and load the admin shell. The backend does enforce auth so the data stays empty — but the UI should not be reachable, and this is far more exposed on a public URL than on localhost.
2. **Seeded admin password** `Admin@123` is in the repo. Rotate before launch.
3. **Rate limiter is in-memory** (`backend/src/app.ts:84`, 200 req/15 min). Fine on a single instance; resets on restart and is per-instance if you ever scale out.
4. **Dependency advisories:** `next@14.1.0` has a published security advisory and `multer@1.x` is deprecated with known vulnerabilities. Both are worth upgrading before going public.
5. **Backend dev script skips typechecking** (`--transpile-only`). Consider running `tsc --noEmit` in CI so type errors surface before a deploy does.
