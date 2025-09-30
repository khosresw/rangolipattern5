export const DOT_RADIUS = 5;
export const ROW_SPACING = 40;
export const COL_SPACING = 40;

export let dotMatrix = [];

export function buildGrid(canvas) {
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  const CENTER_X = WIDTH / 2;
  const CENTER_Y = HEIGHT / 2;

  dotMatrix = [];
  let rows = [];
  for (let i = 6; i <= 11; i++) rows.push(i);
  rows = rows.concat(rows.slice(0, -1).reverse());

  rows.forEach((dotCount, rowIndex) => {
    const y = CENTER_Y + (rowIndex - rows.length / 2) * ROW_SPACING;
    const totalWidth = (dotCount - 1) * COL_SPACING;
    const startX = CENTER_X - totalWidth / 2;
    const rowDots = [];
    for (let j = 0; j < dotCount; j++) {
      const x = startX + j * COL_SPACING;
      rowDots.push({ x, y, col: j, row: rowIndex });
    }
    dotMatrix.push(rowDots);
  });
}

export function getDotByCoord([col, row]) {
  if (row >= 0 && row < dotMatrix.length) {
    const rowDots = dotMatrix[row];
    if (col >= 0 && col < rowDots.length) return rowDots[col];
  }
  return null;
}
