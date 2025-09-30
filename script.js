const canvas = document.getElementById("ritualCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const DOT_RADIUS = 5;
const ROW_SPACING = 40;
const COL_SPACING = 40;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2 + 2 * ROW_SPACING;

const inner_star_coords = [
  [4,5],[3,4],[4,4],[4,3],[5,4],[6,4],[6,5],
  [6,6],[5,6],[4,7],[4,6],[3,6],[4,5]
];

const outer_star = [
  [3,5],[1,3],[3,3],[3,1],[5,3],[7,3],[7,5],
  [7,7],[5,7],[3,9],[3,7],[1,7],[3,5]
];

const parallelograms = [
  [[0,0],[2,0],[2,2],[0,2]],
  [[3,0],[5,0],[7,2],[5,2]],
  [[5,8],[7,8],[5,10],[3,10]],
  [[0,8],[2,8],[2,10],[0,10]],
  [[0,5],[0,3],[2,5],[0,7]],
  [[8,3],[10,5],[8,7],[8,5]]
];

const hexagons = [
  [[1,1],[2,1],[3,2],[3,3],[2,3],[1,2]],
  [[4,1],[5,1],[6,2],[6,3],[5,3],[4,2]],
  [[7,4],[8,4],[9,5],[8,6],[7,6],[7,5]],
  [[5,7],[6,7],[6,8],[5,9],[4,9],[4,8]],
  [[2,9],[1,9],[1,8],[2,7],[3,7],[3,8]],
  [[2,6],[1,6],[1,5],[1,4],[2,4],[3,5]]
];

let dotMatrix = [];
let selectedDot = null;
let playerLines = [];

function buildGrid() {
  dotMatrix = [];
  let rows = [];
  for (let i = 6; i < 11; i++) rows.push(i);
  rows.push(11);
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

function drawDot(dot) {
  ctx.beginPath();
  ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
}

function getDotByCoord(coord) {
  const [x, y] = coord;
  if (y >= 0 && y < dotMatrix.length) {
    const row = dotMatrix[y];
    if (x >= 0 && x < row.length) {
      return row[x];
    }
  }
  return null;
}

function drawLine(a, b, color = "#FFD700", width = 3) {
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke();
}

function hasDrawnInnerStar() {
  const expected = new Set();
  for (let i = 0; i < inner_star_coords.length - 1; i++) {
    const a = getDotByCoord(inner_star_coords[i]);
    const b = getDotByCoord(inner_star_coords[i + 1]);
    if (a && b) expected.add(JSON.stringify([a.x, a.y, b.x, b.y]));
  }
  const drawn = new Set(playerLines.map(([a, b]) => JSON.stringify([a.x, a.y, b.x, b.y])));
  for (let line of expected) {
    if (!drawn.has(line)) return false;
  }
  return true;
}

function drawShapes() {
  outer_star.forEach((coord, i) => {
    if (i < outer_star.length - 1) {
      const a = getDotByCoord(coord);
      const b = getDotByCoord(outer_star[i + 1]);
      if (a && b) drawLine(a, b);
    }
  });

  parallelograms.forEach(shape => {
    for (let i = 0; i < shape.length; i++) {
      const a = getDotByCoord(shape[i]);
      const b = getDotByCoord(shape[(i + 1) % shape.length]);
      if (a && b) drawLine(a, b, "#00FFFF", 2);
    }
  });

  hexagons.forEach(shape => {
    for (let i = 0; i < shape.length; i++) {
      const a = getDotByCoord(shape[i]);
      const b = getDotByCoord(shape[(i + 1) % shape.length]);
      if (a && b) drawLine(a, b, "#FFFFFF", 2);
    }
  });
}

function redraw() {
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  dotMatrix.forEach(row => row.forEach(drawDot));
  playerLines.forEach(([a, b]) => drawLine(a, b));
  if (hasDrawnInnerStar()) {
    document.getElementById("instruction").style.display = "none";
    drawShapes();
  }
}

canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;
  let clicked = null;
  dotMatrix.forEach(row => {
    row.forEach(dot => {
      if (Math.hypot(mx - dot.x, my - dot.y) < 15) {
        clicked = dot;
      }
    });
  });
  if (clicked) {
    const allowed = inner_star_coords.map(getDotByCoord);
    if (allowed.includes(clicked)) {
      if (!selectedDot) {
        selectedDot = clicked;
      } else if (selectedDot !== clicked && allowed.includes(selectedDot)) {
        playerLines.push([selectedDot, clicked]);
        selectedDot = null;
      }
    }
  }
  redraw();
});

buildGrid();
redraw();
