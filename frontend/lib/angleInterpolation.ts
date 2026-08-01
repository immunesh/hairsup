export interface AngleBlend {
  angleA: string;
  opacityA: number;
  angleB: string;
  opacityB: number;
}

/**
 * Computes the two closest angles and their opacities for cross-fading wig assets.
 * 
 * @param yawRad Head yaw rotation in radians.
 * @param availableAngles List of available angles as string keys (e.g. ["0", "45", "90"])
 */
export function getAngleBlend(yawRad: number, availableAngles: string[]): AngleBlend {
  // Graceful fallbacks
  if (!availableAngles || availableAngles.length === 0) {
    return { angleA: "0", opacityA: 1, angleB: "0", opacityB: 0 };
  }
  if (availableAngles.length === 1) {
    return { angleA: availableAngles[0], opacityA: 1, angleB: availableAngles[0], opacityB: 0 };
  }

  // Convert yaw to degrees and normalize to [0, 360)
  let yawDeg = (yawRad * 180) / Math.PI;
  yawDeg = ((yawDeg % 360) + 360) % 360;

  // Parse angles as numbers and sort them ascending
  const anglesNum = availableAngles.map(Number).sort((a, b) => a - b);

  let lowerIdx = -1;
  let upperIdx = -1;

  // Find the bracket indices
  for (let i = 0; i < anglesNum.length; i++) {
    const current = anglesNum[i];
    const next = anglesNum[(i + 1) % anglesNum.length];

    if (next > current) {
      if (yawDeg >= current && yawDeg <= next) {
        lowerIdx = i;
        upperIdx = (i + 1) % anglesNum.length;
        break;
      }
    } else {
      // Wrap around case (e.g., current is 315, next is 0)
      if (yawDeg >= current || yawDeg <= next) {
        lowerIdx = i;
        upperIdx = (i + 1) % anglesNum.length;
        break;
      }
    }
  }

  // Fallback if bracket not found
  if (lowerIdx === -1 || upperIdx === -1) {
    const sortedStr = String(anglesNum[0]);
    return { angleA: sortedStr, opacityA: 1, angleB: sortedStr, opacityB: 0 };
  }

  const angleValA = anglesNum[lowerIdx];
  const angleValB = anglesNum[upperIdx];

  // Calculate interpolation factor t
  let t = 0;
  if (angleValB > angleValA) {
    t = (yawDeg - angleValA) / (angleValB - angleValA);
  } else {
    // Wrap-around interpolation (e.g., between 315 and 0)
    const normalizedB = angleValB + 360;
    const normalizedYaw = yawDeg < angleValA ? yawDeg + 360 : yawDeg;
    t = (normalizedYaw - angleValA) / (normalizedB - angleValA);
  }

  // Clamp t to [0, 1] to prevent floating point issues
  t = Math.max(0, Math.min(1, t));

  return {
    angleA: String(angleValA),
    opacityA: 1.0 - t,
    angleB: String(angleValB),
    opacityB: t,
  };
}
