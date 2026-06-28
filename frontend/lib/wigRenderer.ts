export function drawWig(
  ctx: CanvasRenderingContext2D,
  wigImage: HTMLImageElement,
  foreheadX: number,
  foreheadY: number,
  faceWidth: number,
  faceHeight: number,
  angle: number
) {
  // Wig size based on face
  const wigWidth = faceWidth * 2.45;
  const wigHeight = faceHeight * 2.60;

  // Move wig upward from forehead
  const wigX = foreheadX;
const wigY = foreheadY - faceHeight * 0.25;

  ctx.save();

  

  // Move to wig position
  ctx.translate(wigX, wigY);

  // Rotate with head
  ctx.rotate(angle);

  // Draw wig
  ctx.drawImage(
    wigImage,
    -wigWidth / 2,
    -wigHeight * 0.15,
    wigWidth,
    wigHeight
  );

  ctx.restore();
}