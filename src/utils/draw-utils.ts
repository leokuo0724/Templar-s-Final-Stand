export function drawPolygon(
  ctx: CanvasRenderingContext2D,
  points: string,
  fill: string,
  offsetX?: number,
  offsetY?: number
) {
  const pointArray = points.split(" ").reduce((acc, cur, i, arr) => {
    if (i % 2 === 0) {
      acc.push({
        x: parseFloat(cur),
        y: parseFloat(arr[i + 1]),
      });
    }
    return acc;
  }, [] as { x: number; y: number }[]);

  ctx.beginPath();

  ctx.moveTo(
    pointArray[0].x + (offsetX ?? 0),
    pointArray[0].y + (offsetY ?? 0)
  );
  for (let i = 1; i < pointArray.length; i++) {
    ctx.lineTo(
      pointArray[i].x + (offsetX ?? 0),
      pointArray[i].y + (offsetY ?? 0)
    );
  }
  ctx.closePath();

  ctx.fillStyle = fill;
  ctx.fill();
  ctx.closePath();
}

export function drawRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  offsetX?: number,
  offsetY?: number
) {
  ctx.beginPath();
  ctx.rect(x + (offsetX ?? 0), y + (offsetY ?? 0), width, height);
  ctx.fillStyle = fill;
  ctx.fill();
  ctx.closePath();
}

export function drawShield(
  ctx: CanvasRenderingContext2D,
  color: string,
  x: number,
  y: number
) {
  drawPolygon(
    ctx,
    "28 0 0 7 0 42 7 54 28 68 48 54 55 42 55 7 28 0",
    color,
    x,
    y
  );
}

export function drawSword(
  ctx: CanvasRenderingContext2D,
  color: string,
  x: number,
  y: number
) {
  drawPolygon(ctx, "66 1 50 0 0 19 1 23 3 27 54 11 66 1", color, x, y);
}
