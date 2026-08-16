import { HeadPose } from "./headPose";
import { WigConfig } from "./wigConfig";
import { getAngleBlend } from "./angleInterpolation";

function resolveAngleConfig(config: WigConfig, angleKey: string): WigConfig {
  const override = config.angleOverrides?.[angleKey];
  return override ? { ...config, ...override } : config;
}

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

  const F = Math.max(canvasWidth, canvasHeight) * 1.2;
  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2;

  // Draw helper with custom alpha blending. Each angle resolves its own merged
  // config (see WigConfig.angleOverrides) so a turned-view photo whose hair mass
  // isn't framed identically to the front photo can still anchor to the head
  // correctly instead of inheriting the front image's offsets verbatim.
  const drawWigAsset = (img: HTMLImageElement, opacity: number, angleKey: string) => {
    if (opacity <= 0.005) return;

    const cfg = resolveAngleConfig(config, angleKey);

    // 3. Compute target 3D anchor position relative to the skull center
    // Offsets are scaled dynamically by the head's physical dimensions (width/height)
    const anchor3D = {
      x:
        pose.skullCenter.x +
        pose.vRight.x * (cfg.offsetX * pose.headWidth) +
        pose.vUp.x * (-cfg.offsetY * pose.headHeight) +
        pose.vBack.x * (cfg.foreheadOffset * pose.faceWidth),
      y:
        pose.skullCenter.y +
        pose.vRight.y * (cfg.offsetX * pose.headWidth) +
        pose.vUp.y * (-cfg.offsetY * pose.headHeight) +
        pose.vBack.y * (cfg.foreheadOffset * pose.faceWidth),
      z:
        pose.skullCenter.z +
        pose.vRight.z * (cfg.offsetX * pose.headWidth) +
        pose.vUp.z * (-cfg.offsetY * pose.headHeight) +
        pose.vBack.z * (cfg.foreheadOffset * pose.faceWidth),
    };

    // 4. Perspective projection calculation
    const relativeZ = anchor3D.z - pose.skullCenter.z;
    const perspectiveScale = F / (F + relativeZ);

    // 5. Dynamic scale adjustments for pitch and yaw projection compression
    const pitchScaleMult = cfg.pitchScaleMultiplier ?? 0.2;
    const yawScaleMult = cfg.yawScaleMultiplier ?? 0.1;

    // As the user tilts their head, the projected height changes
    const pitchFactor = 1.0 + Math.abs(pose.pitch) * pitchScaleMult;
    // As the user turns side profile, horizontal width compresses
    const yawFactor = 1.0 - Math.abs(pose.yaw) * yawScaleMult;

    const baseWigWidth = pose.headWidth * cfg.scale;
    const finalWigWidth = baseWigWidth * perspectiveScale * yawFactor;

    // Project 3D anchor point to screen 2D coordinates
    const screenX = (anchor3D.x - cx) * perspectiveScale + cx;
    const screenY = (anchor3D.y - cy) * perspectiveScale + cy;

    const aspect = img.height / img.width;
    const finalWigHeight = finalWigWidth * aspect * pitchFactor;

    ctx.save();

    // Translate to projected skull center
    ctx.translate(screenX, screenY);

    // Rotate canvas around anchor point by Roll + Offset
    ctx.rotate(pose.roll + cfg.rotationOffset);

    // Position image so the hairline aligns naturally.
    // See WigConfig.hairlineRatio - live-tuned per wig, not derived from the PNG.
    const verticalAlignOffset = finalWigHeight * (cfg.hairlineRatio ?? 0.15);
    // Horizontal counterpart - see WigConfig.centerXRatio. Pure local draw-space
    // shift, computed independently of the 3D pose so it can't destabilize the
    // perspective projection the way perturbing offsetX/vRight would.
    const horizontalAlignOffset = finalWigWidth * (cfg.centerXRatio ?? 0.5);

    ctx.globalAlpha = opacity;
    ctx.drawImage(
      img,
      -horizontalAlignOffset,
      -verticalAlignOffset,
      finalWigWidth,
      finalWigHeight
    );

    ctx.restore();
  };

  // Render both neighboring angles for cross-fade blending
  const imgA = wigImages[blend.angleA];
  const imgB = wigImages[blend.angleB];

  if (imgA) drawWigAsset(imgA, blend.opacityA, blend.angleA);
  if (imgB) drawWigAsset(imgB, blend.opacityB, blend.angleB);

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