import React from 'react';
import { COLS, ROWS, colourAt } from '../../lib/hueGrid';

/*
  The hero.

  Not a mascot — the board IS the art here, and it costs nothing to draw
  because the same pure function that scores the game paints it. A screenshot
  of the actual thing you are about to play beats an illustration of it.

  Sized like CavemanArt learned to be: small enough that the Create button
  clears the fold on a phone. This is 14:9, so width is cheap in a way the
  caveman's 2:3 never was.
*/

const INK = '#2D1810';

/* The square the "cue" points at. Fixed, not random — a hero that changes on
   every render makes prerendered HTML differ from the hydrated page. */
const TARGET = { col: 9, row: 3 };

/*
  'mini' is a 6x4 SLICE of the same board, not the board shrunk.

  The hub card gives this 76px. Fourteen columns in 76px is a 5px cell — a
  smudge, the same mistake the caveman's full figure made at card size. A slice
  keeps the cells big enough to read as colours, which is the whole point of the
  picture.
*/
const MINI = { cols: 6, rows: 4, col0: 7, row0: 2 };

export default function HueArt({ className = '', variant = 'full' }) {
  const mini = variant === 'mini';
  const nCols = mini ? MINI.cols : COLS;
  const nRows = mini ? MINI.rows : ROWS;
  const cells = [];
  for (let r = 0; r < nRows; r += 1) {
    for (let c = 0; c < nCols; c += 1) {
      const col = mini ? MINI.col0 + c : c;
      const row = mini ? MINI.row0 + r : r;
      const d = Math.max(Math.abs(col - TARGET.col), Math.abs(row - TARGET.row));
      cells.push(
        <div
          key={`${col}-${row}`}
          className="rounded-[2px]"
          style={{
            background: colourAt(col, row),
            aspectRatio: '1',
            boxShadow: d === 0
              ? `inset 0 0 0 ${mini ? 2 : 3}px ${INK}`
              : d === 1 ? 'inset 0 0 0 2px rgba(255,255,255,.8)' : 'none',
            transform: d === 0 ? 'scale(1.3)' : 'none',
            zIndex: d === 0 ? 2 : 1,
            position: 'relative',
          }}
        />,
      );
    }
  }

  return (
    <div className={className} aria-hidden="true">
      <div
        className="grid gap-[2px] rounded-xl"
        style={{ gridTemplateColumns: `repeat(${nCols}, minmax(0, 1fr))` }}
      >
        {cells}
      </div>
    </div>
  );
}
