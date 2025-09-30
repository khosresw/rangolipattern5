import { getDotByCoord } from './grid.js';

export const inner_star_coords = [ [4,5],[3,4],[4,4],[4,3],[5,4],[6,4],[6,5],[6,6],[5,6],[4,7],[4,6],[3,6],[4,5] ];
export const outer_star = [ [3,5],[1,3],[3,3],[3,1],[5,3],[7,3],[7,5],[7,7],[5,7],[3,9],[3,7],[1,7],[3,5] ];
export const parallelograms = [
  [[0,0],[2,0],[2,2],[0,2]], [[3,0],[5,0],[7,2],[5,2]],
  [[5,8],[7,8],[5,10],[3,10]], [[0,8],[2,8],[2,10],[0,10]],
  [[0,5],[0,3],[2,5],[0,7]], [[8,3],[10,5],[8,7],[8,5]]
];
export const hexagons = [
  [[1,1],[2,1],[3,2],[3,3],[2,3],[1,2]], [[4,1],[5,1],[6,2],[6,3],[5,3],[4,2]],
  [[7,4],[8,4],[9,5],[8,6],[7,6],[7,5]], [[5,7],[6,7],[6,8],[5,9],[4,9],[4,8]],
  [[2,9],[1,9],[1,8],[2,7],[3,7],[3,8]], [[2,6],[1,6],[1,5],[1,4],[2,4],[3,5]]
];

export function hasDrawnInnerStar(playerLines) {
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
