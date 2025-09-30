import { buildGrid, dotMatrix } from './grid.js';
import { drawDot, drawLine, drawShape } from './draw.js';
import * as drawModule from './draw.js';
import { outer_star, parallelograms, hexagons } from './ritual.js';

document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("ritualCanvas");
  const ctx = canvas.getContext("2d");
  const activateBtn = document.getElementById("activateBtn");
  const toggleCoordsBtn = document.getElementById("toggleCoordsBtn");

  let selectedDot = null;
  let playerLines = [];
  let ritualActivated = false;

  buildGrid(canvas);
  redraw();

  canvas.addEventListener("click", e => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    let clicked = null;
    dotMatrix.forEach(row => {
      row.forEach(dot => {
        if (Math.hypot(mx - dot.x, my - dot.y) < 15) clicked = dot;
      });
    });
    if (clicked) {
      if (!selectedDot) selectedDot = clicked;
      else if (selectedDot !== clicked) {
        playerLines.push([selectedDot, clicked]);
        selectedDot = null;
      }
    }
    redraw();
  });

  activateBtn.addEventListener("click", () => {
    ritualActivated = true;
    activateBtn.innerText = "Ritual Revealed";
    redraw();
  });

 toggleCoordsBtn.addEventListener("click", () => {
  drawModule.showCoordinates = false; // 🧹 Always hide
  toggleCoordsBtn.disabled = true;    // Optional: disable button after use
  toggleCoordsBtn.innerText = "Coordinates Removed";
  redraw();
});
  
  function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dotMatrix.forEach(row => row.forEach(dot => drawDot(ctx, dot)));
    playerLines.forEach(([a, b]) => drawLine(ctx, a, b));

    if (ritualActivated) {
      drawShape(ctx, outer_star, "#FFD700", 3);
      parallelograms.forEach(shape => drawShape(ctx, shape, "#00FFFF", 2));
      hexagons.forEach(shape => drawShape(ctx, shape, "#FFFFFF", 2));
      ctx.fillStyle = "#FFD700";
      ctx.font = "20px sans-serif";
      ctx.fillText("✨ Ritual Unlocked ✨", canvas.width / 2 - 80, 30);
    }
  }
});
