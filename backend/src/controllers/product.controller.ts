import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import { AppError } from "../middleware/error.middleware";

/**
 * Product images arrive from the admin form as either plain URL strings (the
 * legacy shape) or objects carrying the per-image metadata the storefront needs.
 *
 * `angle` and `isTryOn` are not cosmetic: the virtual try-on picks its wig assets
 * by filtering images on `isTryOn` and keying them by `angle` (see
 * VirtualTryOn.tsx / wigRenderer.ts). The previous version of this mapper built
 * rows from the URL alone, so every image fell back to `angle: 0, isTryOn: false`
 * and try-on had nothing to render — and because updateProduct deletes and
 * recreates the image rows, editing a product in admin also wiped flags that had
 * been set by the seed.
 */
type ProductImageInput =
  | string
  | {
      url?: unknown;
      alt?: unknown;
      angle?: unknown;
      isPrimary?: unknown;
      isTryOn?: unknown;
    };

interface NormalizedProductImage {
  url: string;
  alt: string | null;
  angle: number;
  isPrimary: boolean;
  isTryOn: boolean;
}

const normalizeProductImages = (
  images: unknown
): NormalizedProductImage[] => {
  if (!Array.isArray(images)) return [];

  return (images as ProductImageInput[])
    .map((image, index): NormalizedProductImage | null => {
      const raw = typeof image === "string" ? { url: image } : image ?? {};
      const url = typeof raw.url === "string" ? raw.url.trim() : "";

      if (!url) return null;

      // Angles are stored as degrees in [0, 360) so the try-on angle blend can
      // wrap cleanly between, say, 315 and 0.
      const angle = Number(raw.angle);
      const normalizedAngle = Number.isFinite(angle)
        ? ((Math.round(angle) % 360) + 360) % 360
        : 0;

      return {
        url,
        alt: typeof raw.alt === "string" ? raw.alt : null,
        angle: normalizedAngle,
        isPrimary:
          typeof raw.isPrimary === "boolean" ? raw.isPrimary : index === 0,
        isTryOn: raw.isTryOn === true,
      };
    })
    .filter((image): image is NormalizedProductImage => image !== null);
};

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    page = "1",
    limit = "12",
    gender,
    category,
    minPrice,
    maxPrice,
    sort = "createdAt",
    order = "desc",
    featured,
    bestSeller,
    newArrival,
    search,
     images,
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const skip = (pageNum - 1) * limitNum;

  const where: Record<string, any> = {
    isActive: true,
  };

  if (gender) where.gender = (gender as string).toUpperCase();
  if (featured === "true") where.isFeatured = true;
  if (bestSeller === "true") where.isBestSeller = true;
  if (newArrival === "true") where.isNewArrival = true;
  if (category) where.category = { slug: category };

  if (search) {
    where.OR = [
      { name: { contains: search as string } },
      { description: { contains: search as string } },
      { tags: { contains: search as string } },
    ];
  }

  if (minPrice || maxPrice) {
    where.basePrice = {};

    if (minPrice) {
      where.basePrice.gte = parseFloat(
        minPrice as string
      );
    }

    if (maxPrice) {
      where.basePrice.lte = parseFloat(
        maxPrice as string
      );
    }
  }

  const orderBy: Record<string, string> = {};
  orderBy[sort as string] = order as string;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
    include: {
  images: true,

  category: {
    select: {
      name: true,
      slug: true,
    },
  },

  variants: true,
  includedItems: true,
  faqs: true,
  careGuides: true,
  features: true,
  highlights: true,
},
      skip,
      take: limitNum,
      orderBy,
    }),
    prisma.product.count({ where }),
  ]);

  const parsed = products.map((p) => ({
    ...p,
    tags: safeParseJson(p.tags, []),
  }));

  res.json({
    success: true,
    data: parsed,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
};

export const getProductById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
      isActive: true,
    },

    include: {
      images: {
        orderBy: {
          angle: "asc",
        },
      },
       includedItems: true,
       faqs: true,
       careGuides: true,
      category: true,
      variants: true,
      highlights: true,
        features: true,
      reviews: {

        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
    },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  res.json({
    success: true,
    data: {
      ...product,
      tags: safeParseJson(product.tags, []),
      reviews: product.reviews.map((r) => ({
        ...r,
        images: safeParseJson(r.images, []),
      })),
    },
  });
};

export const getCategories = async (
  req: Request,
  res: Response
): Promise<void> => {
  const categories = await prisma.category.findMany({
    where: {
      parentId: null,
    },
    include: {
      children: true,
      _count: {
        select: {
          products: true,
        },
      },
    },
  });

  res.json({
    success: true,
    data: categories,
  });
};

export const getFeaturedProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const products = await prisma.product.findMany({
    where: {
      isFeatured: true,
      isActive: true,
    },
    include: {
      images: {
        where: {
          isPrimary: true,
        },
        take: 1,
      },
    },
    take: 8,
  });

  res.json({
    success: true,
    data: products.map((p) => ({
      ...p,
      tags: safeParseJson(p.tags, []),
    })),
  });
};

export const getRelatedProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      gender: product.gender,
      id: {
        not: id,
      },
      isActive: true,
    },
    include: {
      images: {
        where: {
          isPrimary: true,
        },
        take: 1,
      },
    },
    take: 6,
  });

  res.json({
    success: true,
    data: related.map((p) => ({
      ...p,
      tags: safeParseJson(p.tags, []),
    })),
  });
};


/**
 * Product URLs are /products/<slug>, and getProductById matches the path
 * segment against slug or id. The admin form takes the slug as free text and
 * posted it through untouched, so a product was stored with the slug
 * "Natural Looking Synthetic Hair Wig for Men " - capitals, spaces, and a
 * trailing space. The card linked to it, the browser dropped the trailing
 * space, and the lookup missed: the listing worked while the detail page 404'd.
 *
 * Normalise on write instead of trusting the client, and guarantee uniqueness
 * so the @unique constraint can't reject an otherwise valid save.
 */
const toSlug = (value: string): string =>
  String(value ?? "")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");

const uniqueProductSlug = async (
  desired: string,
  fallback: string,
  excludeId?: string
): Promise<string> => {
  const root = toSlug(desired) || toSlug(fallback) || `product-${Date.now()}`;

  for (let attempt = 0; attempt < 50; attempt++) {
    const candidate = attempt === 0 ? root : `${root}-${attempt + 1}`;
    const clash = await prisma.product.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (!clash) return candidate;
  }

  return `${root}-${Date.now()}`;
};

/* -------------------- ADMIN CRUD -------------------- */

export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    console.log(req.body);
const {
  name,
  slug,
  shortDesc,
  description,
  categoryId,
  gender,
  basePrice,
  salePrice,
  stock,
  sku,
  brand,
  tags,
  images,

  material,
  capSize,
  length,
  density,
  texture,
  color,

  rating,

  isFeatured,
  isBestSeller,
  isNewArrival,
  features,
faqs,
careGuides,
includedItems,

} = req.body;
console.log("IMAGES RECEIVED:");
    const finalSlug = await uniqueProductSlug(slug, name);

    const product =
      await prisma.product.create({
    data: {
  name,
  slug: finalSlug,
  description,
  shortDesc,
material,
capSize,
length,
density,
texture,
color,

rating: Number(rating || 0),

isFeatured,
isBestSeller,
isNewArrival,
  

  tags: JSON.stringify(
    Array.isArray(tags)
      ? tags
      : []
  ),

  categoryId,
  gender,
          basePrice: Number(
            basePrice
          ),
          salePrice: salePrice
            ? Number(
                salePrice
              )
            : null,
          stock: Number(stock),
          sku,
          brand:
            brand || "HairsUp",

          images: {
            create: normalizeProductImages(images),
          },
          
          features: {
  create: Array.isArray(features)
    ? features
    : [],
},

faqs: {
  create: Array.isArray(faqs)
    ? faqs
    : [],
},

careGuides: {
  create: Array.isArray(careGuides)
    ? careGuides
    : [],
},

includedItems: {
  create: Array.isArray(includedItems)
    ? includedItems
    : [],
},
          
        },

       include: {
  images: true,
  features: true,
  faqs: true,
  careGuides: true,
  includedItems: true,
},
      });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
  console.error(
    "CREATE PRODUCT ERROR:"
  );

  console.error(error);

  res.status(500).json({
    success: false,
    message:
      error?.message ||
      "Failed to create product",
  });
}
};

export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;

const {
  name,
  slug,
  shortDesc,
  description,
  categoryId,
  gender,
  basePrice,
  salePrice,
  stock,
  sku,
  brand,
  tags,
  images,

  material,
  capSize,
  length,
  density,
  texture,
  color,

  rating,

  isFeatured,
  isBestSeller,
  isNewArrival,
  features,
faqs,
careGuides,
includedItems,
} = req.body;

  // Delete old images
  await prisma.productImage.deleteMany({
    where: {
      productId: id,
    },
  });
await prisma.productFeature.deleteMany({
  where: {
    productId: id,
  },
});

await prisma.productFAQ.deleteMany({
  where: {
    productId: id,
  },
});

await prisma.careGuide.deleteMany({
  where: {
    productId: id,
  },
});

await prisma.includedItem.deleteMany({
  where: {
    productId: id,
  },
});
  const finalSlug = await uniqueProductSlug(slug, name, id);

  const product = await prisma.product.update({
    where: { id },

    data: {
      name,
      slug: finalSlug,
      shortDesc,
      description,
      categoryId,
      gender,
      material,
capSize,
length,
density,
texture,
color,

rating: Number(rating || 0),

isFeatured,
isBestSeller,
isNewArrival,
      basePrice: Number(basePrice),
      salePrice: salePrice
        ? Number(salePrice)
        : null,
      stock: Number(stock),
      sku,
      brand,

      tags: JSON.stringify(
        Array.isArray(tags)
          ? tags
          : typeof tags === "string"
          ? tags
              .split(",")
              .map((t) => t.trim())
          : []
      ),

      images: {
        create: normalizeProductImages(images),
      },
      features: {
  create: Array.isArray(features)
    ? features
    : [],
},

faqs: {
  create: Array.isArray(faqs)
    ? faqs
    : [],
},

careGuides: {
  create: Array.isArray(careGuides)
    ? careGuides
    : [],
},

includedItems: {
  create: Array.isArray(includedItems)
    ? includedItems
    : [],
},
    },

    include: {
  images: true,
  features: true,
  faqs: true,
  careGuides: true,
  includedItems: true,
},
  });

  res.json({
    success: true,
    data: product,
  });
};


export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await prisma.product.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Product deleted",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

function safeParseJson(
  val: string,
  fallback: unknown
) {
  try {
    return JSON.parse(val);
  } catch {
    return fallback;
  }
}