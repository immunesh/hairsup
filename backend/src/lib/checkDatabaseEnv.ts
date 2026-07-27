// Fragments that only appear in the .env.example placeholders. Copying that
// file to .env is the normal first step for a new developer, so an unedited
// value is the most common reason the server will not start.
const PLACEHOLDER_MARKERS = [
  "host-pooler.region.aws.neon.tech",
  "host.region.aws.neon.tech",
  "user:password@",
  "/dbname",
  "file:./dev.db",
];

const SETUP_HELP = `
The database connection is not configured yet.

DATABASE_URL and DIRECT_URL still contain the example values from
.env.example, so there is no real database to connect to.

To fix this:

  1. Ask the project owner for a Neon branch of your own, or create a
     local Postgres database. Do not share the production database —
     your local runs would read and write live customer data.
  2. Copy BOTH connection strings into backend/.env:
       DATABASE_URL  the POOLED string  (hostname contains "-pooler")
       DIRECT_URL    the DIRECT string  (no "-pooler")
  3. Run: npx prisma migrate deploy && npx ts-node prisma/seed.ts

Note that SQLite ("file:./dev.db") no longer works — the schema targets
Postgres so the app can run on hosts with an ephemeral filesystem.
`;

/**
 * Throws a readable setup message when the database URLs are missing or still
 * hold example values. Without this, Prisma reports the placeholder hostname
 * as an unreachable server (P1001), which reads like an outage rather than a
 * configuration step that was never done.
 */
export function checkDatabaseEnv(): void {
  const problems: string[] = [];

  for (const name of ["DATABASE_URL", "DIRECT_URL"]) {
    const value = process.env[name];

    if (!value) {
      problems.push(`${name} is not set`);
      continue;
    }

    const marker = PLACEHOLDER_MARKERS.find((m) => value.includes(m));
    if (marker) {
      problems.push(`${name} still contains the example value "${marker}"`);
    }
  }

  if (problems.length > 0) {
    throw new Error(
      `Database not configured:\n  - ${problems.join("\n  - ")}\n${SETUP_HELP}`
    );
  }
}
