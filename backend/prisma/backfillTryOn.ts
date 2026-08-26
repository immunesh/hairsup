/**
 * One-off backfill: flag each product's front-facing wig cut-out for virtual try-on.
 *
 * The catalogue was built through the admin panel, which (before this fix) posted
 * images as bare URL strings, so every row landed with the schema defaults
 * `angle: 0, isTryOn: false`. Virtual try-on loads only images with `isTryOn`, so it
 * had nothing to render and silently drew the bare camera feed.
 *
 * Ordering note: every image row of a product shares a createdAt and carries a random
 * uuid, so row order tells us nothing. The Cloudinary URL does - uploads embed an
 * ascending `/v<version>/` stamp, and the gallery was uploaded back view first, front
 * view last. This picks the highest-versioned PNG (the transparent cut-outs are PNG;
 * the primary catalogue photo is JPEG) and marks it as the 0-degree front asset.
 *
 * Deliberately conservative: the profile views are left untouched. Which of the two
 * mirrored profiles is +45 and which is 315 depends on MediaPipe's runtime yaw sign
 * and has to be read off the try-on debug HUD (`/try-on?wig=<slug>&debug=1`), not
 * guessed. A single front asset renders correctly on its own - getAngleBlend holds it
 * at full opacity when it is the only angle available.
 *
 *   npx ts-node prisma/backfillTryOn.ts           # dry run, prints the plan
 *   npx ts-node prisma/backfillTryOn.ts --apply   # writes
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const apply = process.argv.includes("--apply");

const cloudinaryVersion = (url: string): number => {
  const match = url.match(/\/v(\d+)\//);
  return match ? Number(match[1]) : 0;
};

const isCutout = (url: string): boolean =>
  /\.png(\?|$)/i.test(url.split("?")[0]);

async function main() {
  const products = await prisma.product.findMany({
    include: { images: true },
    orderBy: { createdAt: "asc" },
  });

  let planned = 0;
  let skipped = 0;

  for (const product of products) {
    const alreadyFlagged = product.images.filter((image) => image.isTryOn);

    if (alreadyFlagged.length > 0) {
      console.log(
        `SKIP  ${product.slug} - already has ${alreadyFlagged.length} try-on image(s)`
      );
      skipped++;
      continue;
    }

    const cutouts = product.images
      .filter((image) => isCutout(image.url))
      .sort((a, b) => cloudinaryVersion(a.url) - cloudinaryVersion(b.url));

    const front = cutouts[cutouts.length - 1];

    if (!front) {
      console.log(`SKIP  ${product.slug} - no PNG cut-out to use as a front view`);
      skipped++;
      continue;
    }

    console.log(
      `FLAG  ${product.slug} -> angle 0, isTryOn true  (${front.url.split("/").pop()})`
    );
    planned++;

    if (apply) {
      await prisma.productImage.update({
        where: { id: front.id },
        data: { angle: 0, isTryOn: true },
      });
    }
  }

  console.log(
    `\n${apply ? "Updated" : "Would update"} ${planned} product(s); skipped ${skipped}.`
  );

  if (!apply) {
    console.log("Dry run - re-run with --apply to write these changes.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
