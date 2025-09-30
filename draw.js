import { dotMatrix, getDotByCoord, DOT_RADIUS } from './grid.js';

export function drawDot(ctx, dot) {
  ctx.beginPath();
  ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
/*  ctx.fillStyle = "#ccc";
  ctx.font = "12px sans-serif";
  ctx.fillText(`(${dot.col},${dot.row})`, dot.x + 6, dot.y - 12);*/
}

export function drawLine(ctx, a, b, color = "#FFD700", width = 3) {
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

export function drawShape(ctx, shape, color, width) {
  for (let i = 0; i < shape.length; i++) {
    const a = getDotByCoord(shape[i]);
    const b = getDotByCoord(shape[(i + 1) % shape.length]);
    if (a && b) drawLine(ctx, a, b, color, width);
  }
}
