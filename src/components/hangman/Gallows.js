import React from 'react';
import { THEME, MAX_WRONG } from './hangmanData';

/*
  The gallows, drawn in SVG so it scales cleanly and needs no images.

  Deliberately a snowman-ish stick figure on a frame rather than anything
  graphic — this is a family word game on a farm-themed site, and a literal
  hanging illustration would be a jarring thing to put in front of a child.
  The six stages are still the traditional head / body / two arms / two legs,
  so the game reads exactly as people expect.
*/
/*
  Height is deliberately modest on mobile (h-32). At h-40 the bottom row of the
  letter keyboard fell 2px below the fold on an iPhone 13, so reaching Z meant
  scrolling in the middle of a guess. There is room to grow on a larger screen.
*/
export default function Gallows({ wrong }) {
  const show = (n) => wrong >= n;
  const stroke = THEME.ink;

  return (
    <svg
      viewBox="0 0 120 130"
      role="img"
      aria-label={`${wrong} of ${MAX_WRONG} wrong guesses used`}
      className="mx-auto h-32 w-auto md:h-48"
    >
      {/* frame — always visible, it is the board rather than a penalty */}
      <g stroke={THEME.mut} strokeWidth="4" strokeLinecap="round" fill="none">
        <line x1="10" y1="125" x2="70" y2="125" />
        <line x1="30" y1="125" x2="30" y2="10" />
        <line x1="30" y1="10" x2="80" y2="10" />
        <line x1="80" y1="10" x2="80" y2="25" />
      </g>

      <g stroke={stroke} strokeWidth="4" strokeLinecap="round" fill="none">
        {show(1) && <circle cx="80" cy="38" r="13" />}
        {show(2) && <line x1="80" y1="51" x2="80" y2="85" />}
        {show(3) && <line x1="80" y1="60" x2="66" y2="74" />}
        {show(4) && <line x1="80" y1="60" x2="94" y2="74" />}
        {show(5) && <line x1="80" y1="85" x2="67" y2="105" />}
        {show(6) && <line x1="80" y1="85" x2="93" y2="105" />}
      </g>
    </svg>
  );
}
