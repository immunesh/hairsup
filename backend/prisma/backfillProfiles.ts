/**
 * One-off backfill: flag each product's left/right profile cut-outs for try-on.
 *
 * Only the front view was flagged previously, so getAngleBlend had a single
 * angle to work with and held it at full opacity - turning your head kept
 * showing the front wig instead of cross-fading to a profile.
 *
 * Which of the two mirrored profiles is 45 and which is 315 was NOT guessed. It
 * was read off the alpha channel: a profile cut-out hangs most of its hair mass
 * on the back-of-head side, so comparing the opaque pixel count in the left and
 * right thirds of the silhouette identifies which way the wig faces. Calibrated
 * against the seeded assets, whose angles are fixed by seed.ts:
 *
 *   angle 315 ("left view")   wig7 L/R 0.60 cx 0.554   wig8 L/R 0.72 cx 0.530
 *   angle 45  ("right view")  wig7 L/R 1.75 cx 0.442   wig8 L/R 1.28 cx 0.479
 *   angle 0   (front)         wig7 L/R 1.09 cx 0.490   wig8 L/R 0.98 cx 0.501
 *
 * The Cloudinary cut-outs land on the same values, so the mapping carries over.
 * The per-URL result of that classification lives in tryon-angles.json.
 *
 * Try-on itself currently uses the front view only - the profiles are kept for
 * the 360 view, which reads every image sorted by angle and ignores isTryOn. So
 * the angles set here still matter even while --revert has cleared the flags.
 *
 *   npx ts-node prisma/backfillProfiles.ts            # dry run
 *   npx ts-node prisma/backfillProfiles.ts --apply    # flag profiles for try-on
 *   npx ts-node prisma/backfillProfiles.ts --revert   # keep angles, drop try-on
 */
import { PrismaClient } from "@prisma/client";
import angles from "./tryon-angles.json";

const prisma = new PrismaClient();
const revert = process.argv.includes("--revert");
const apply = process.argv.includes("--apply") || revert;

async function main() {
  const plan = angles as Record<string, Record<string, number>>;
  let updated = 0;

  for (const [slug, byUrl] of Object.entries(plan)) {
    const product = await prisma.product.findFirst({
      where: { slug },
      include: { images: true },
    });

    if (!product) {
      console.log(`SKIP  ${slug} - no such product`);
      continue;
    }

    for (const [url, angle] of Object.entries(byUrl)) {
      const image = product.images.find((i) => i.url === url);

      if (!image) {
        console.log(`SKIP  ${slug} - image not found: ${url.split("/").pop()}`);
        continue;
      }

      console.log(
        `${revert ? "UNFLAG" : "FLAG  "} ${slug.padEnd(22)} angle ${String(
          angle
        ).padStart(3)}  ${url.split("/").pop()}`
      );
      updated++;

      if (apply) {
        // The angle is written either way: the 360 view needs it, and only
        // isTryOn decides whether try-on picks the image up.
        await prisma.productImage.update({
          where: { id: image.id },
          data: { angle, isTryOn: !revert },
        });
      }
    }
  }

  console.log(`\n${apply ? "Updated" : "Would update"} ${updated} image(s).`);
  if (!apply) console.log("Dry run - re-run with --apply to write.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
