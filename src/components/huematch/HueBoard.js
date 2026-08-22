import React, { useRef } from 'react';
import { COLS, ROWS, colourAt, labelOf } from '../../lib/hueGrid';

/*
  The color board.

  THE ONE HARD PROBLEM HERE IS TOUCH. A cell is about 25px on a 390px phone,
  which is below the 44px anyone would recommend for a tap target — and this is
  a game where landing one square off costs you a point, so a mis-tap is the
  game cheating you.

  It is solved by never making a tap final. A tap PLACES a marker; you can tap
  again to move it, nudge it a square at a time with the arrow keys, and nothing
  is committed until "Lock it in". So the small target costs a correction, not a
  point. That is why the grid is 14x9 rather than the boxed game's 30x16 —
  bigger cells, and a board that still fits a 360px screen without scrolling.

  KEYBOARD. 126 buttons is 126 tab stops, which is not a board, it is a wall —
  and a switch-control user would have had to cross all of it and then keep
  going to reach "Lock it in" underneath. So the grid is ONE tab stop (roving
  tabindex) and the arrows move within it, which is both the accessible pattern
  for a grid and the nudge the paragraph above promises. Enter or Space places.

  Rendered from the SAME grid module the server scores with, under a byte-for-
  byte drift guard, because a board that paints one color while the server
  scores another has no symptom except players insisting the colors are wrong.
*/

const INK = '#2D1810';

function HueBoard({
  value,            // { col, row } | null — this player's marker
  onPick,           // (col, row) => void
  disabled = false,
  target = null,    // revealed square, or the giver's secret
  markers = [],     // [{ col, row, name, points }] shown at the reveal
  showRings = false,
}) {
  const gridRef = useRef(null);

  /* The one focusable cell: wherever the marker is, or the middle of the board
     before anything is placed. Everything else is tabindex=-1. */
  const focusCol = value ? value.col : Math.floor(COLS / 2);
  const focusRow = value ? value.row : Math.floor(ROWS / 2);

  function onKeyDown(e) {
    const STEP = {
      ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1],
    }[e.key];
    if (!STEP || disabled) return;
    e.preventDefault();
    const col = Math.min(COLS - 1, Math.max(0, focusCol + STEP[0]));
    const row = Math.min(ROWS - 1, Math.max(0, focusRow + STEP[1]));
    if (col === focusCol && row === focusRow) return;
    /*
      Moving the focus PLACES the marker, rather than only travelling. Nothing
      is committed until "Lock it in", so there is nothing to protect the player
      from — and a separate "now press Enter" step would mean holding a position
      in your head that the screen is already showing you.
    */
    if (onPick) onPick(col, row);
    const next = gridRef.current?.querySelector(`[data-cell="${col}-${row}"]`);
    if (next) next.focus();
  }

  const cells = [];
  for (let row = 0; row < ROWS; row += 1) {
    for (let col = 0; col < COLS; col += 1) {
      const isPick = value && value.col === col && value.row === row;
      const isTarget = target && target.col === col && target.row === row;
      /* At the reveal, tint the two scoring rings so "you were one away" is
         visible rather than something to be counted. */
      const ring = showRings && target
        ? Math.max(Math.abs(col - target.col), Math.abs(row - target.row))
        : 99;

      cells.push(
        <button
          key={`${col}-${row}`}
          type="button"
          data-cell={`${col}-${row}`}
          disabled={disabled}
          tabIndex={col === focusCol && row === focusRow ? 0 : -1}
          aria-pressed={isPick}
          onClick={() => !disabled && onPick && onPick(col, row)}
          aria-label={`Square ${labelOf(col, row)}`}
          className="relative rounded-[3px] transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D1810]"
          style={{
            background: colourAt(col, row),
            aspectRatio: '1',
            /*
              The rings are drawn ON the board, not by taking the board away.

              The first version faded everything beyond ring 2 to 45% opacity.
              It made the rings obvious and it made the reveal — the one moment
              in the game when everybody is looking at the board — a screen of
              washed-out pastels, on a game whose entire subject is color. The
              white veils were then invisible against the fade, so it lost both
              things at once.

              Now: full-strength color everywhere, a heavy ink ring on the
              target, and white inner borders that get thinner as they get
              further out. Distance reads from the borders; the colors stay
              the colors.
            */
            boxShadow: isTarget
              ? `inset 0 0 0 3px ${INK}, 0 0 0 1px rgba(255,255,255,.9)`
              : ring === 1 ? 'inset 0 0 0 3px rgba(255,255,255,.95)'
              : ring === 2 ? 'inset 0 0 0 2px rgba(255,255,255,.7)'
              : 'none',
            opacity: 1,
            transform: isPick ? 'scale(1.35)' : 'none',
            zIndex: isPick || isTarget ? 2 : 1,
            cursor: disabled ? 'default' : 'pointer',
          }}
        >
          {isPick && (
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-[3px]"
              style={{ boxShadow: `inset 0 0 0 2.5px ${INK}, 0 2px 8px -2px rgba(45,24,16,.6)` }}
            />
          )}
        </button>,
      );
    }
  }

  return (
    <div>
      <div
        ref={gridRef}
        className="grid gap-[2px] select-none"
        style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        role="group"
        aria-label={disabled ? 'Color board' : 'Color board — arrow keys move your marker'}
        onKeyDown={onKeyDown}
      >
        {cells}
      </div>

      {/* Other players' markers, only ever at the reveal — before that, seeing
          where anyone else guessed would let the room copy the first to lock. */}
      {showRings && markers.length > 0 && (
        <ul className="mt-3 space-y-1 text-left">
          {markers.map((m, i) => (
            <li key={i} className="flex items-center gap-2 text-base">
              <span
                aria-hidden="true"
                className="inline-block h-4 w-4 shrink-0 rounded-[3px]"
                style={{ background: colourAt(m.col, m.row), boxShadow: `inset 0 0 0 2px ${INK}` }}
              />
              <span className="font-semibold text-[#2D1810]">{m.name}</span>
              <span className="text-[#8B6347]">{labelOf(m.col, m.row)}</span>
              <span className="ml-auto font-bold" style={{ color: m.points > 0 ? '#2D6E45' : '#8B6347' }}>
                {m.points > 0 ? `+${m.points}` : '0'}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/*
  Memoised because the room re-renders on every clock tick. Without this, one
  <span> counting down repainted 126 buttons — each with a freshly built inline
  style object — twice a second, for the whole game.
*/
export default React.memo(HueBoard);
