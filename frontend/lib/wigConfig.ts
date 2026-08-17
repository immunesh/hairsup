export interface WigConfig {
  scale: number;             // Scale factor relative to head width (normally ~1.1 to 1.4)
  offsetX: number;           // Horizontal offset as a fraction of head width (normally 0)
  offsetY: number;           // Vertical offset as a fraction of head height (normally ~ -0.15)
  rotationOffset: number;    // Additional rotation roll offset in radians (normally 0)
  foreheadOffset: number;    // Depth offset relative to faceWidth (how deep the wig is in the head, normally ~0.1)
  pitchScaleMultiplier?: number; // How much pitch changes the wig height (normally ~0.3)
  yawScaleMultiplier?: number;   // How much yaw scales down the width due to projection (normally ~0.15)
  // How far down the wig PNG (as a fraction of its own height) the anchor point
  // should land. This is NOT the same as "empty transparent padding at the top of
  // the image" - the anchor sits near the crown, well above the visible forehead
  // landmark, so this value is normally close to the crown/parting row, tuned by
  // eye against a live camera, not measured from the PNG's alpha channel.
  hairlineRatio?: number;
  // Horizontal counterpart to hairlineRatio: how far across the wig PNG (as a
  // fraction of its own width) the anchor point should land. Normally 0.5
  // (image is horizontally centered on its own hair mass). This is a pure 2D
  // draw-space offset applied after the 3D pose projection - unlike offsetX,
  // it must NOT be used to compensate for off-center source photos via the
  // 3D anchor (offsetX travels through vRight, which gains a real depth/z
  // component once the head is actually turned, so perturbing it destabilizes
  // the perspective-scale projection at real turn angles even though it looks
  // fine near yaw=0).
  centerXRatio?: number;
  // Per-angle tuning, keyed by the same angle string used for the ProductImage's
  // `angle` field (e.g. "315"). Side/turned-view photos rarely share the exact
  // same crop/centering as the front photo, so their hair mass can sit off-center
  // within the frame - these let a single angle override scale/hairlineRatio/
  // centerXRatio without needing every angle image to be pixel-aligned to the
  // front shot. Prefer centerXRatio over offsetX for this - see its doc above.
  angleOverrides?: Record<string, Partial<Omit<WigConfig, "angleOverrides">>>;
}

export const DEFAULT_WIG_CONFIG: WigConfig = {
  scale: 1.75,
  offsetX: 0.0,
  offsetY: -0.48, // Anchored slightly above forehead center (hairline region)
  rotationOffset: 0.0,
  foreheadOffset: 0.1,
  pitchScaleMultiplier: 0.2,
  yawScaleMultiplier: 0.1,
  hairlineRatio: 0.15,
};

// Custom configurations for specific wigs seeded in the database
const WIG_CONFIGS: Record<string, WigConfig> = {
  // Bouncy Curl Bob Wig (short, needs slightly larger scale but lower offset)
  "bouncy-curl-bob-wig": {
    scale: 1.85,
    offsetX: 0.0,
    offsetY: -0.46,
    rotationOffset: 0.0,
    foreheadOffset: 0.08,
    pitchScaleMultiplier: 0.15,
    yawScaleMultiplier: 0.08,
    hairlineRatio: 0.15,
  },
  // Goddess Waves Body Wave Wig (long, needs slightly smaller scale to fit and higher offset)
  "goddess-waves-body-wave-wig": {
    scale: 1.7,
    offsetX: 0.0,
    offsetY: -0.52,
    rotationOffset: 0.0,
    foreheadOffset: 0.12,
    pitchScaleMultiplier: 0.25,
    yawScaleMultiplier: 0.12,
    hairlineRatio: 0.15,
  },
  // Silky Straight Lace Front Wig (slug must match seed.ts exactly, otherwise this
  // config silently never matches and every render falls back to DEFAULT_WIG_CONFIG)
  "silky-straight-lace-front-wig": {
    scale: 1.75,
    offsetX: 0.0,
    offsetY: -0.48,
    rotationOffset: 0.0,
    foreheadOffset: 0.1,
    pitchScaleMultiplier: 0.2,
    yawScaleMultiplier: 0.1,
    hairlineRatio: 0.15,
  },
  // Deep Wave Ombre Wig
  "deep-wave-ombre-wig": {
    ...DEFAULT_WIG_CONFIG,
  },
  // Sleek Ponytail Wig
  "sleek-ponytail-wig": {
    ...DEFAULT_WIG_CONFIG,
  },
  // Voluminous Afro Kinky Wig
  "voluminous-afro-kinky-wig": {
    ...DEFAULT_WIG_CONFIG,
  },
  // Full Head Hair Wig for Man (tightly-cropped source photo: the hair fills
  // almost the entire frame with the fringe near the bottom edge, unlike the
  // other assets which have empty padding above the crown - so this needs a
  // much higher hairlineRatio and a smaller scale than DEFAULT_WIG_CONFIG.
  "full-head-hair-wig-for-man-black-breathable-front-hair-patch": {
    scale: 1.35,
    offsetX: 0.0,
    offsetY: -0.34,
    rotationOffset: 0.0,
    foreheadOffset: 0.08,
    pitchScaleMultiplier: 0.15,
    yawScaleMultiplier: 0.08,
    hairlineRatio: 0.65,
    angleOverrides: {
      // centerXRatio is measured from the crown/parting point (the top ~3% of
      // the hair silhouette), matched against where the front photo's crown
      // sits - NOT the overall hair-mass centroid. The full silhouette centroid
      // is skewed by how far the longer side-strands hang down on one side,
      // which over/under-shoots the actual anchor point (confirmed live: using
      // the mass centroid for "45" put the wig visibly too far left).
      // "men left view.png": crown sits ~2.3% right of where it sits in the front photo.
      "315": {
        centerXRatio: 0.523,
      },
      // "men right view.png": crown sits ~9.1% left of where it sits in the front photo.
      "45": {
        centerXRatio: 0.409,
      },
    },
  },
  // AHS Bob Hair Wig for Women (uses the same framing as DEFAULT_WIG_CONFIG for
  // its front photo - only the left-view angle needs a centerXRatio nudge).
  "ahs-bob-hair-wig-for-women-full-head-synthetic-straight-bob-wig": {
    ...DEFAULT_WIG_CONFIG,
    angleOverrides: {
      // centerXRatio is measured from the crown/parting point, matched against
      // the front photo's crown position - see the wig7 angleOverrides comment
      // for why this replaced the (less accurate) full hair-mass centroid.
      // "women left view.png": crown sits ~2.8% right of the front photo's crown.
      "315": {
        centerXRatio: 0.528,
      },
      // "women right view.png": crown sits ~1% left of the front photo's crown.
      "45": {
        centerXRatio: 0.49,
      },
    },
  },
};

/**
 * Retrieves the custom configuration for a wig based on its slug or ID, falling back to defaults.
 */
export function getWigConfig(productIdOrSlug?: string): WigConfig {
  if (!productIdOrSlug) {
    return DEFAULT_WIG_CONFIG;
  }

  // Check by slug/id direct match
  if (WIG_CONFIGS[productIdOrSlug]) {
    return WIG_CONFIGS[productIdOrSlug];
  }

  // Try to find a partial match (e.g. if the ID or name is passed and contains slug terms)
  const normalizedKey = productIdOrSlug.toLowerCase();
  for (const [key, config] of Object.entries(WIG_CONFIGS)) {
    if (normalizedKey.includes(key) || key.includes(normalizedKey)) {
      return config;
    }
  }

  return DEFAULT_WIG_CONFIG;
}
