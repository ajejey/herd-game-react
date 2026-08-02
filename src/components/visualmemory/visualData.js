/*
  Visual Memory Test — solo, endless.

  Category: memory (spatial). Fully procedural — the pattern is random cells on
  a grid, so it never repeats and needs no content.

  Third leg of the memory trio, and deliberately distinct from the other two:
    - Chimp Test      — spatial memory WITH order (tap 1,2,3… from memory)
    - Number Memory   — verbal memory (what the digits were)
    - Visual Memory   — spatial memory WITHOUT order (which squares lit up)

  Aesthetic: warm farm palette, violet accent. No dark mode.
*/

export const THEME = {
  bg: '#FFF8E7',
  bgAlt: '#FFFFFF',
  border: '#FFE8C8',
  ink: '#2D1810',
  mut: '#6B5B4A',
  violet: '#6D3BC4',
  green: '#3D8B5A',
  red: '#D0463B',
};

export const FREDOKA = { fontFamily: "'Fredoka', system-ui, sans-serif" };
export const QUICKSAND = { fontFamily: "'Quicksand', system-ui, sans-serif" };

export const LIVES = 3;
export const FLASH_MS = 1100;

/* The board grows every third level so the difficulty comes from both a bigger
   board and more squares, rather than cramming 15 squares into a 3x3 grid. */
export function gridFor(level) {
  return Math.min(7, 3 + Math.floor(level / 3));
}

/* Squares to remember. Capped well below the board size — a pattern covering
   most of the grid is easier, not harder, because the gaps become the pattern. */
export function countFor(level) {
  const g = gridFor(level);
  return Math.min(g * g - 2, level + 2);
}

/** A random set of distinct cell indexes for the level. */
export function buildPattern(level) {
  const g = gridFor(level);
  const cells = [];
  for (let i = 0; i < g * g; i++) cells.push(i);
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  return cells.slice(0, countFor(level));
}

export function rankFor(level) {
  if (level >= 15) return { label: 'Extraordinary', blurb: 'Genuinely rare territory.' };
  if (level >= 12) return { label: 'Remarkable', blurb: 'Very few people get this far.' };
  if (level >= 9) return { label: 'Sharp', blurb: 'Well above where most people stop.' };
  if (level >= 6) return { label: 'Above Average', blurb: 'Better than the typical run.' };
  if (level >= 4) return { label: 'Typical', blurb: 'Right about where most people land.' };
  return { label: 'Warming Up', blurb: 'Try seeing the shape rather than the squares.' };
}
