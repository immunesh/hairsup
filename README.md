# HairsUp

E-commerce store for hair wigs and hair systems.

- `backend/` — Express + Prisma API, deployed to Render
- `frontend/` — Next.js 14 app, deployed to Vercel
- Database — Postgres on Neon
- Image uploads — Cloudinary

## Local setup

Requires Node 20+ and access to a Postgres database (see below).

```bash
# 1. Backend
cd backend
cp .env.example .env      # then edit it — see "Database" below
npm install               # also runs prisma generate
npx prisma migrate deploy
npx ts-node prisma/seed.ts
npm run dev               # http://localhost:5000

# 2. Frontend, in a second terminal
cd frontend
cp .env.example .env.local
npm install
npm run dev               # http://localhost:3000
```

Seeded admin login: `admin@hairsup.com` / `Admin@123`.

## Database

**The app no longer runs on SQLite.** The schema targets Postgres, because
Render and Vercel give the app an ephemeral filesystem where a SQLite file
would not survive a restart.

You need your own database — **do not point your local environment at the
production one**, or your local runs will read and write live customer data.
Either:

- **A Neon branch** (preferred). Ask the project owner to create one for you
  in the Neon console under **Branches → New Branch**. The free plan includes
  10 branches per project, and each is an isolated copy.
- **A local Postgres**, e.g. `createdb hairsup_dev`.

Then set **both** connection strings in `backend/.env`:

| Variable | Which string | Used for |
|---|---|---|
| `DATABASE_URL` | **pooled** — hostname contains `-pooler` | the app at runtime |
| `DIRECT_URL` | **direct** — no `-pooler` | `prisma migrate` |

Migrations must not run through the pooler; mixing these up makes them hang
rather than fail with a clear message. On a local Postgres, set both to the
same URL.

The server refuses to start while these still hold the `.env.example`
placeholder values, and prints setup instructions instead.

## Required environment variables

`backend/.env` — the server will not start without these:

`DATABASE_URL`, `DIRECT_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`

In production (`NODE_ENV=production`) it additionally requires
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`, and
rejects JWT secrets that are missing, under 32 characters, or left at the
example values. Locally, uploads fall back to `backend/uploads/` when
Cloudinary is unset.

`frontend/.env.local` — `NEXT_PUBLIC_API_URL` (defaults to
`http://localhost:5000/api`). `NEXT_PUBLIC_*` values are inlined at build time,
so changing one in a deployment requires a rebuild, not just a restart.

The frontend holds no database credentials; it reaches Postgres only through
the backend API.

## Branching and deploys

Work on `dev`, then raise a PR into `main`. Merging to `main` deploys
automatically: Render rebuilds the backend and Vercel the frontend.

The Render build command runs `prisma migrate deploy`, so **a merge to `main`
applies migrations to the production database**. Review any migration in the PR
before merging.

Pushes to `dev` create Vercel preview deployments. Those previews are blocked
by CORS until their origin is added to the backend's `FRONTEND_URL`, which
accepts a comma-separated list.

## Useful commands

```bash
# backend
npm run dev            # ts-node-dev, transpile only — does NOT typecheck
npm run build          # tsc — this is what catches type errors
npx tsc --noEmit       # typecheck without emitting
npm run db:studio      # browse the database

# frontend
npm run dev
npm run build          # what Vercel runs; catches errors dev mode does not
```

Note that `npm run dev` in the backend uses `--transpile-only`, so type errors
only surface in `npm run build`. Run the build before opening a PR.
