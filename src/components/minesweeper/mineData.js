/*
  Minesweeper — solo, endless.

  Category: puzzle. Fully procedural — the board is generated per game, so it
  never repeats and needs no content at all.

  Two rules here are what separate a real Minesweeper from a broken one:

   1. THE FIRST TAP IS ALWAYS SAFE. Mines are laid AFTER the first tap, with
      that cell and its neighbours excluded. Laying them up front means the
      game can be lost on move one through no fault of the player, which is
      both unfair and the fastest way to make someone leave.
   2. Zero-cells cascade. Revealing a cell with no adjacent mines must open its
      neighbours too, recursively, or every game becomes hundreds of taps.

  Aesthetic: warm farm palette, slate-blue accent. No dark mode.
*/

export const THEME = {
  bg: '#FFF8E7',
  bgAlt: '#FFFFFF',
  border: '#FFE8C8',
  covered: '#EBD9BC',
  ink: '#2D1810',
  mut: '#6B5B4A',
  slate: '#3A5A8C',
  green: '#3D8B5A',
  red: '#D0463B',
};

export const FREDOKA = { fontFamily: "'Fredoka', system-ui, sans-serif" };
export const QUICKSAND = { fontFamily: "'Quicksand', system-ui, sans-serif" };

/* Board sizes chosen to fit a phone screen without pinch-zooming. The classic
   "expert" 30x16 is unplayable on a 390px-wide screen, so the largest here is
   deliberately narrower than the desktop tradition. */
export const LEVELS = [
  { id: 'easy', name: 'Easy', cols: 8, rows: 8, mines: 10 },
  { id: 'medium', name: 'Medium', cols: 9, rows: 12, mines: 20 },
  { id: 'hard', name: 'Hard', cols: 10, rows: 16, mines: 40 },
];

/* Traditional Minesweeper number colours, darkened where needed to stay legible
   on the light cell background (all clear 4.5:1 against #FFFFFF). */
export const NUMBER_COLOURS = {
  1: '#1D4ED8', 2: '#15803D', 3: '#B91C1C', 4: '#4C1D95',
  5: '#9A3412', 6: '#0F766E', 7: '#1F2937', 8: '#6B5B4A',
};

export const idx = (c, r, cols) => r * cols + c;

/** The up-to-eight neighbouring cell indexes. */
export function neighbours(i, cols, rows) {
  const c = i % cols;
  const r = Math.floor(i / cols);
  const out = [];
  for (let dr = -1; dr <= 1; dr++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const nc = c + dc;
      const nr = r + dr;
      if (nc < 0 || nc >= cols || nr < 0 || nr >= rows) continue;
      out.push(idx(nc, nr, cols));
    }
  }
  return out;
}

/**
 * Lay mines, excluding `safe` and everything touching it.
 * Returns { mines:Set, counts:number[] }.
 */
export function layMines(level, safe, rand = Math.random) {
  const { cols, rows, mines } = level;
  const total = cols * rows;
  const banned = new Set([safe, ...neighbours(safe, cols, rows)]);

  // With a big enough opening pocket there might not be room for every mine;
  // cap so the loop below can always terminate.
  const room = total - banned.size;
  const want = Math.min(mines, room);

  const pool = [];
  for (let i = 0; i < total; i++) if (!banned.has(i)) pool.push(i);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const mineSet = new Set(pool.slice(0, want));

  const counts = new Array(total).fill(0);
  for (let i = 0; i < total; i++) {
    if (mineSet.has(i)) { counts[i] = -1; continue; }
    counts[i] = neighbours(i, cols, rows).filter((n) => mineSet.has(n)).length;
  }
  return { mines: mineSet, counts, mineCount: want };
}

/**
 * Reveal `start` and, if it is a zero, everything it opens up.
 * Returns a new Set of revealed indexes. Flagged cells are never opened.
 */
export function floodReveal(start, counts, revealed, flagged, cols, rows) {
  const out = new Set(revealed);
  const stack = [start];
  while (stack.length) {
    const i = stack.pop();
    if (out.has(i) || flagged.has(i)) continue;
    out.add(i);
    if (counts[i] === 0) {
      for (const n of neighbours(i, cols, rows)) {
        if (!out.has(n) && !flagged.has(n)) stack.push(n);
      }
    }
  }
  return out;
}

/** Won once every cell that is not a mine has been revealed. */
export function hasWon(revealed, mineSet, total) {
  return revealed.size === total - mineSet.size;
}

export function rankFor(seconds, levelId) {
  const par = { easy: 60, medium: 150, hard: 300 }[levelId] || 120;
  if (seconds <= par * 0.4) return { label: 'Extraordinary', blurb: 'That is a seriously quick clear.' };
  if (seconds <= par * 0.7) return { label: 'Very Quick', blurb: 'Well under par for this board.' };
  if (seconds <= par) return { label: 'Sharp', blurb: 'Comfortably inside a good time.' };
  if (seconds <= par * 1.6) return { label: 'Solid', blurb: 'A clean clear is a clean clear.' };
  return { label: 'Steady', blurb: 'No rush — finishing is the hard part.' };
}
