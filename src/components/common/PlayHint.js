import React from 'react';
import { FiInfo } from 'react-icons/fi';

/*
  The one line that tells you how to play, shown WHILE you play.

  Every solo game already had this line. It was 14px muted grey sitting under
  the play area, and when real players were handed the app, none of them read
  it — they landed on the page, hit the big coloured button, and then had no
  idea what they were supposed to do. Size was part of it. The rest was that
  small grey body text tucked under a control reads as a footnote, not as an
  instruction, so the eye files it with the copyright notice and moves on.

  So it stops being body text. It is a chip: tinted in the game's own accent,
  ink-coloured rather than muted, bold, with an icon in front. Nothing else on
  a solo game screen looks like this, which is the entire point — it cannot be
  mistaken for page furniture.

  Pass `live` when the text changes as the game moves between states, so a
  screen reader announces the new instruction instead of leaving someone on the
  old one.
*/

const FONT = { fontFamily: "'Quicksand', system-ui, sans-serif" };

/*
  '#RRGGBB' or '#RGB' -> 'rgba(r, g, b, a)'.

  Falls back to a neutral warm tint rather than 'transparent'. Returning
  transparent cleared the background AND the border, so a game passing an
  rgb() string, a 3-digit hex, or a renamed-away theme key rendered this as
  plain bold text with an icon — which is precisely the appearance the chip
  exists to avoid, arrived at silently, with no error and no failing test.
  Failing to a visible chip in the wrong shade is strictly better than failing
  to an invisible one in the right one.
*/
const FALLBACK = { bg: 'rgba(45, 24, 16, 0.06)', border: 'rgba(45, 24, 16, 0.22)', ink: '#6B5B4A' };

function tint(hex, alpha, fallback) {
  const raw = String(hex || '').trim();
  const six = /^#([0-9a-fA-F]{6})$/.exec(raw);
  const three = /^#([0-9a-fA-F]{3})$/.exec(raw);
  if (!six && !three) return fallback;
  const hx = six ? six[1] : three[1].split('').map((c) => c + c).join('');
  const n = parseInt(hx, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

const isColour = (hex) => /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(String(hex || '').trim());

export default function PlayHint({ accent, ink = '#2D1810', live = false, className = '', children }) {
  return (
    <p
      data-testid="play-hint"
      {...(live ? { role: 'status', 'aria-live': 'polite' } : {})}
      style={{
        ...FONT,
        color: ink,
        background: tint(accent, 0.1, FALLBACK.bg),
        borderColor: tint(accent, 0.32, FALLBACK.border),
      }}
      className={`mx-auto flex max-w-sm items-center justify-center gap-2 rounded-2xl border-2 px-4 py-2.5 text-center text-base font-bold ${className}`}
    >
      <FiInfo aria-hidden="true" size={18} className="shrink-0" style={{ color: isColour(accent) ? accent : FALLBACK.ink }} />
      <span>{children}</span>
    </p>
  );
}
