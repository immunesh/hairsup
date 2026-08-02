export interface WigConfig {
  scale: number;             // Scale factor relative to head width (normally ~1.1 to 1.4)
  offsetX: number;           // Horizontal offset as a fraction of head width (normally 0)
  offsetY: number;           // Vertical offset as a fraction of head height (normally ~ -0.15)
  rotationOffset: number;    // Additional rotation roll offset in radians (normally 0)
  foreheadOffset: number;    // Depth offset relative to faceWidth (how deep the wig is in the head, normally ~0.1)
  pitchScaleMultiplier?: number; // How much pitch changes the wig height (normally ~0.3)
  yawScaleMultiplier?: number;   // How much yaw scales down the width due to projection (normally ~0.15)
}

export const DEFAULT_WIG_CONFIG: WigConfig = {
  scale: 1.75,
  offsetX: 0.0,
  offsetY: -0.48, // Anchored slightly above forehead center (hairline region)
  rotationOffset: 0.0,
  foreheadOffset: 0.1,
  pitchScaleMultiplier: 0.2,
  yawScaleMultiplier: 0.1,
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
  },
  // Silk Straight Lace Front Wig
  "silk-straight-lace-front-wig": {
    scale: 1.75,
    offsetX: 0.0,
    offsetY: -0.48,
    rotationOffset: 0.0,
    foreheadOffset: 0.1,
    pitchScaleMultiplier: 0.2,
    yawScaleMultiplier: 0.1,
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
