export function drawWig(
  ctx: CanvasRenderingContext2D,
  wigImage: HTMLImageElement,
  foreheadX: number,
  foreheadY: number,
  headWidth: number,
  angle: number
) {
  // Scale wig based on head width
  const wigWidth = headWidth * 2.5;
  const wigHeight = wigWidth * 1.2;

  // Move wig slightly down so it sits on the head
  const yOffset = 285;

  ctx.save();

  // Position wig on forehead
  ctx.translate(
    foreheadX,
    foreheadY + yOffset
  );

  // Rotate with head
  ctx.rotate(angle);

  // Draw centered
  ctx.drawImage(
    wigImage,
    -wigWidth / 2,
    -wigHeight * 0.55,
    wigWidth,
    wigHeight
  );

  ctx.restore();
}