/*
  Chimp Test — solo, endless.

  Category: reflex / spatial memory. Fully procedural: numbers are placed at
  random on a grid, so there is no content of any kind and it can never repeat.

  Named after the Ayumu working-memory experiments, where young chimpanzees
  outperformed humans at exactly this task. That is also the hook: most adults
  fail somewhere around 7-9, which is a genuinely humbling and very shareable
  result.

  Aesthetic: warm farm palette, indigo accent. No dark mode.
*/

export const THEME = {
  bg: '#FFF8E7',
  bgAlt: '#FFFFFF',
  border: '#FFE8C8',
  ink: '#2D1810',
  mut: '#6B5B4A',
  indigo: '#4C5BD4',
  green: '#3D8B5A',
  red: '#D0463B',
};

export const FREDOKA = { fontFamily: "'Fredoka', system-ui, sans-serif" };
export const QUICKSAND = { fontFamily: "'Quicksand', system-ui, sans-serif" };

export const GRID = 5;            // 5x5 board
export const START_COUNT = 4;     // first level shows 4 numbers
export const LIVES = 3;

/** Level N shows START_COUNT + N numbers, capped at the board size. */
export function countForLevel(level) {
  return Math.min(GRID * GRID, START_COUNT + level);
}

/** Random distinct cell indexes for the given count. */
export function buildLevel(level) {
  const count = countForLevel(level);
  const cells = [];
  for (let i = 0; i < GRID * GRID; i++) cells.push(i);
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  const chosen = cells.slice(0, count);
  // tiles: { cell, num } with num 1..count in the order they must be tapped
  return chosen.map((cell, i) => ({ cell, num: i + 1 }));
}

export function rankFor(best) {
  if (best >= 14) return { label: 'Better Than a Chimp', blurb: 'Genuinely exceptional. Ayumu would be worried.' };
  if (best >= 11) return { label: 'Remarkable', blurb: 'Very few people get this far.' };
  if (best >= 9) return { label: 'Sharp', blurb: 'Above where most adults stop.' };
  if (best >= 7) return { label: 'Typical Human', blurb: 'This is where most people land — and chimps beat it.' };
  if (best >= 5) return { label: 'Warming Up', blurb: 'It clicks after a couple of goes.' };
  return { label: 'Rough Start', blurb: 'Try looking at the shape, not the numbers.' };
}
