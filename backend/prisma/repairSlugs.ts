/**
 * One-off repair: normalise product slugs that were stored as free text.
 *
 * The admin form posted the slug field through untouched, so a product landed
 * with "Natural Looking Synthetic Hair Wig for Men " - capitals, spaces and a
 * trailing space. Product links are /products/<slug>; the browser drops the
 * trailing space, so the lookup missed and the detail page 404'd while the
 * product still listed fine on the shop page.
 *
 * Only touches slugs that are not already URL-safe, so existing product URLs
 * are left exactly as they are.
 *
 *   npx ts-node prisma/repairSlugs.ts           # dry run
 *   npx ts-node prisma/repairSlugs.ts --apply
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const apply = process.argv.includes("--apply");

const SAFE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const toSlug = (value: string): string =>
  String(value ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");

async function main() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, slug: true },
  });

  const taken = new Set(products.map((p) => p.slug));
  let changed = 0;

  for (const product of products) {
    if (SAFE.test(product.slug)) continue;

    const root = toSlug(product.slug) || toSlug(product.name) || product.id;
    let candidate = root;
    for (let n = 2; taken.has(candidate); n++) candidate = `${root}-${n}`;

    console.log(`FIX  ${JSON.stringify(product.slug)}\n  -> ${JSON.stringify(candidate)}`);
    taken.delete(product.slug);
    taken.add(candidate);
    changed++;

    if (apply) {
      await prisma.product.update({
        where: { id: product.id },
        data: { slug: candidate },
      });
    }
  }

  console.log(`\n${apply ? "Updated" : "Would update"} ${changed} of ${products.length} product(s).`);
  if (!apply && changed) console.log("Dry run - re-run with --apply to write.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
