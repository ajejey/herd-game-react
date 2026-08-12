import React from 'react';

/*
  Visual clover: 4 leaves at top/right/bottom/left, 4 clue chips at the diagonals.
  Zone i sits between leaf i and leaf (i+1)%4 → zone0 NE, zone1 SE, zone2 SW, zone3 NW.

  props:
    leaves       [4] content for each leaf (keyword string, or placed card, or null)
    clues        [4] clue strings shown on the zones
    mode         'static' | 'resolve' | 'reveal'
    onLeafTap    (i) => void   (resolve)
    selectedSlot index | null  (resolve highlight)
    correctMask  [4] bool       (reveal)
*/

const LEAF_POS = [
  { top: '0%', left: '50%', transform: 'translate(-50%, 0)' },
  { top: '50%', right: '0%', transform: 'translate(0, -50%)' },
  { bottom: '0%', left: '50%', transform: 'translate(-50%, 0)' },
  { top: '50%', left: '0%', transform: 'translate(0, -50%)' },
];
/*
  All four chips are anchored from the SAME two edges — top and left — because
  the wrapper carries `-translate-x-1/2 -translate-y-1/2` and that only centres
  a box on its anchor when the anchor is the top-left one. Anchored from `right`
  instead, the -50% shift pulls the chip further INWARD rather than centring it,
  so the two right-hand chips crept under the leaves while the two left-hand
  ones sat clear. Nothing caught it: the board is absolutely positioned, so an
  overlapping chip still renders, still reads, and still passes every test —
  right up until the type got a size bigger and the clue disappeared behind a
  card on the reveal screen.

  The percentages put each chip on the diagonal between two leaves, which is the
  one part of the board no leaf occupies at any breakpoint.
*/
const CLUE_POS = [
  { top: '17%', left: '83%' }, // NE, between the top and right leaves
  { top: '83%', left: '83%' }, // SE
  { top: '83%', left: '17%' }, // SW
  { top: '17%', left: '17%' }, // NW
];

export default function CloverBoard({ leaves = [], clues = [], mode = 'static', onLeafTap, selectedSlot, correctMask }) {
  return (
    <div className="relative mx-auto w-[300px] h-[300px] sm:w-[340px] sm:h-[340px]">
      {/* center clover dot */}
      <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" width="46" height="46" viewBox="0 0 24 24" aria-hidden="true">
        {[[12, 7], [17, 12], [12, 17], [7, 12]].map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="4.4" fill="#BfE3C8" stroke="#3D8B5A" strokeWidth="1.2" />
        ))}
        <circle cx="12" cy="12" r="2" fill="#3D8B5A" />
      </svg>

      {/* clue chips */}
      {clues.map((clue, i) => (
        <div key={`c${i}`} style={CLUE_POS[i]}
          className="absolute -translate-x-1/2 -translate-y-1/2 max-w-[88px]"
        >
          <div data-testid="clover-clue" className="bg-[#FFD56B] text-[#2D1810] text-sm sm:text-base font-bold px-2.5 py-1 rounded-full shadow text-center break-words border border-[#E8B84B]">
            {clue || '—'}
          </div>
        </div>
      ))}

      {/* leaves */}
      {LEAF_POS.map((pos, i) => {
        const content = leaves[i];
        const isReveal = mode === 'reveal' && correctMask;
        const correct = isReveal ? correctMask[i] : null;
        const interactive = mode === 'resolve';
        const selected = selectedSlot === i;
        let border = 'border-[#FFE8C8]';
        if (selected) border = 'border-[#E84A8B] ring-4 ring-[#E84A8B]/20';
        else if (isReveal) border = correct ? 'border-[#3D8B5A]' : 'border-[#E06A4A]';
        else if (interactive && !content) border = 'border-dashed border-[#C9B79B]';
        return (
          <button
            key={`l${i}`}
            type="button"
            data-testid="clover-leaf"
            data-slot={i}
            data-filled={content ? '1' : '0'}
            aria-label={content ? `Leaf ${i + 1}: ${content}` : `Leaf ${i + 1}, empty`}
            disabled={!interactive}
            onClick={() => interactive && onLeafTap?.(i)}
            style={pos}
            className={`absolute w-[92px] h-[92px] sm:w-[104px] sm:h-[104px] rounded-2xl border-4 ${border} bg-white flex items-center justify-center p-2 text-center transition-all ${interactive ? 'hover:border-[#E84A8B] active:scale-95 cursor-pointer' : ''}`}
          >
            <span className="text-[#2D1810] font-bold text-base break-words leading-tight">
              {content || (interactive ? <span className="text-[#C9B79B] font-medium text-sm">tap</span> : '')}
            </span>
          </button>
        );
      })}
    </div>
  );
}
