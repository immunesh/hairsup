import { HeadPose } from "./headPose";
import { WigConfig } from "./wigConfig";
import { getAngleBlend } from "./angleInterpolation";

export interface WigRenderOptions {
  scale?: number;
  xOffset?: number;
  yOffset?: number;
}

/**
 * Advanced perspective-aware 3D skull-anchored wig rendering.
 * Animates roll, pitch, yaw, and handles dual-angle cross-fading for smooth transitions.
 */
export function drawWigPose(
  ctx: CanvasRenderingContext2D,
  wigImages: Record<string, HTMLImageElement>,
  pose: HeadPose,
  config: WigConfig,
  canvasWidth: number,
  canvasHeight: number
): void {
  // 1. Get all loaded available angles
  const availableAngles = Object.keys(wigImages).filter(
    (key) => wigImages[key] && wigImages[key].complete
  );

  if (availableAngles.length === 0) {
    return;
  }

  // 2. Compute blending angles based on current head yaw
  const blend = getAngleBlend(pose.yaw, availableAngles);

  // 3. Compute target 3D anchor position relative to the skull center
  // Offsets are scaled dynamically by the head's physical dimensions (width/height)
  const anchor3D = {
    x:
      pose.skullCenter.x +
      pose.vRight.x * (config.offsetX * pose.headWidth) +
      pose.vUp.x * (-config.offsetY * pose.headHeight) +
      pose.vBack.x * (config.foreheadOffset * pose.faceWidth),
    y:
      pose.skullCenter.y +
      pose.vRight.y * (config.offsetX * pose.headWidth) +
      pose.vUp.y * (-config.offsetY * pose.headHeight) +
      pose.vBack.y * (config.foreheadOffset * pose.faceWidth),
    z:
      pose.skullCenter.z +
      pose.vRight.z * (config.offsetX * pose.headWidth) +
      pose.vUp.z * (-config.offsetY * pose.headHeight) +
      pose.vBack.z * (config.foreheadOffset * pose.faceWidth),
  };

  // 4. Perspective projection calculation
  const F = Math.max(canvasWidth, canvasHeight) * 1.2;
  const relativeZ = anchor3D.z - pose.skullCenter.z;
  const perspectiveScale = F / (F + relativeZ);

  // 5. Dynamic scale adjustments for pitch and yaw projection compression
  const pitchScaleMult = config.pitchScaleMultiplier ?? 0.2;
  const yawScaleMult = config.yawScaleMultiplier ?? 0.1;

  // As the user tilts their head, the projected height changes
  const pitchFactor = 1.0 + Math.abs(pose.pitch) * pitchScaleMult;
  // As the user turns side profile, horizontal width compresses
  const yawFactor = 1.0 - Math.abs(pose.yaw) * yawScaleMult;

  const baseWigWidth = pose.headWidth * config.scale;
  const finalWigWidth = baseWigWidth * perspectiveScale * yawFactor;

  // Project 3D anchor point to screen 2D coordinates
  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2;
  const screenX = (anchor3D.x - cx) * perspectiveScale + cx;
  const screenY = (anchor3D.y - cy) * perspectiveScale + cy;

  // Draw helper with custom alpha blending
  const drawWigAsset = (img: HTMLImageElement, opacity: number) => {
    if (opacity <= 0.005) return;

    const aspect = img.height / img.width;
    const finalWigHeight = finalWigWidth * aspect * pitchFactor;

    ctx.save();

    // Translate to projected skull center
    ctx.translate(screenX, screenY);

    // Rotate canvas around anchor point by Roll + Offset
    ctx.rotate(pose.roll + config.rotationOffset);

    // Position image so the hairline aligns naturally.
    // The top ~15% of the wig typically represents the space above the hairline anchor.
    const verticalAlignOffset = finalWigHeight * 0.15;

    ctx.globalAlpha = opacity;
    ctx.drawImage(
      img,
      -finalWigWidth / 2,
      -verticalAlignOffset,
      finalWigWidth,
      finalWigHeight
    );

    ctx.restore();
  };

  // Render both neighboring angles for cross-fade blending
  const imgA = wigImages[blend.angleA];
  const imgB = wigImages[blend.angleB];

  if (imgA) drawWigAsset(imgA, blend.opacityA);
  if (imgB) drawWigAsset(imgB, blend.opacityB);

  // Restore opacity state
  ctx.globalAlpha = 1.0;
}

/**
 * Legacy drawWig compatibility wrapper for standard 2D drawing.
 */
export function drawWig(
  ctx: CanvasRenderingContext2D,
  wigImage: HTMLImageElement,
  headX: number,
  headY: number,
  faceWidth: number,
  faceHeight: number,
  angle: number,
  options: WigRenderOptions = {}
): void {
  if (!wigImage.complete) return;

  const scale = options.scale ?? 1.75;
  const xOffset = options.xOffset ?? 0;
  const yOffset = options.yOffset ?? 0;

  const aspect = wigImage.height / wigImage.width;
  const wigWidth = faceWidth * scale;
  const wigHeight = wigWidth * aspect;

  const angleFactor = Math.abs(angle) * 0.05;
  const anchorX = headX + xOffset;
  const anchorY = headY - wigHeight * (0.24 + angleFactor) + yOffset;

  ctx.save();
  ctx.translate(anchorX, anchorY + wigHeight * 0.12);
  ctx.rotate(angle);
  ctx.drawImage(
    wigImage,
    -wigWidth / 2,
    -wigHeight * 0.1,
    wigWidth,
    wigHeight
  );
  ctx.restore();
}