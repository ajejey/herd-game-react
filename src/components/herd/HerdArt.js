import React from 'react';

/*
  Drawings for the original Herd Mentality room.

  Copied in the same spirit as cavemanclues/CavemanArt.js: every other game on
  the site draws its own furniture rather than borrowing a font's. The room this
  serves used 🐄 and 🏆 as interface elements, which render as three different
  animals across Android, iOS and Windows and as a hollow box on the machines
  that have neither.
*/

const fredoka = { fontFamily: "'Fredoka', system-ui, sans-serif" };

/** The pink cow — the thing you do not want to be holding when you hit 8. */
export const PinkCowIcon = ({ size = 28, className = '', title }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    className={className}
    role={title ? 'img' : undefined}
    aria-label={title || undefined}
    aria-hidden={title ? undefined : true}
  >
    {title ? <title>{title}</title> : null}
    <ellipse cx="32" cy="36" rx="22" ry="20" fill="#FFB6C1" stroke="#2D1810" strokeWidth="2.5" />
    <ellipse cx="32" cy="44" rx="13" ry="10" fill="#FFE0E8" stroke="#2D1810" strokeWidth="2" />
    <ellipse cx="20" cy="28" rx="6" ry="9" fill="#FFB6C1" stroke="#2D1810" strokeWidth="2" transform="rotate(-25 20 28)" />
    <ellipse cx="44" cy="28" rx="6" ry="9" fill="#FFB6C1" stroke="#2D1810" strokeWidth="2" transform="rotate(25 44 28)" />
    <ellipse cx="24" cy="30" rx="3" ry="4" fill="#E84A8B" transform="rotate(-25 24 30)" />
    <path d="M22 18 Q18 12 14 14" stroke="#2D1810" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M42 18 Q46 12 50 14" stroke="#2D1810" strokeWidth="2" fill="none" strokeLinecap="round" />
    <circle cx="29" cy="40" r="0.9" fill="#2D1810" />
    <circle cx="35" cy="40" r="0.9" fill="#2D1810" />
  </svg>
);

/** First place. Shown once, on the winner's screen. */
export const Rosette = ({ size = 72 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
    <g transform="translate(32 28)">
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
        <ellipse key={i} rx="6" ry="14" cx="0" cy="-16" fill="#FFD56B" stroke="#2D1810" strokeWidth="1.5" transform={`rotate(${deg})`} />
      ))}
    </g>
    <circle cx="32" cy="28" r="11" fill="#E84A8B" stroke="#2D1810" strokeWidth="2" />
    <text x="32" y="33" textAnchor="middle" fontSize="13" fontWeight="700" fill="#FFFFFF" style={fredoka}>1</text>
    <path d="M22 38 L18 60 L26 54 L32 60 L38 54 L46 60 L42 38" fill="#E84A8B" stroke="#2D1810" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);

/**
 * A herd of three, used where the screen needs to say "everyone" without words.
 * The middle cow is the odd one out — which is the entire game.
 */
export const HerdIcon = ({ size = 64 }) => (
  <svg width={size} height={(size * 64) / 80} viewBox="0 0 80 64" aria-hidden="true">
    {[6, 30, 54].map((cx, i) => (
      <g key={i} transform={`translate(${cx} ${i === 1 ? 8 : 16})`}>
        <ellipse cx="10" cy="28" rx="12" ry="11" fill="#FFFFFF" stroke="#2D1810" strokeWidth="1.6" />
        <ellipse cx="10" cy="32" rx="7" ry="5" fill="#FFE8C8" stroke="#2D1810" strokeWidth="1.4" />
        <ellipse cx="4" cy="22" rx="3" ry="5" fill="#FFFFFF" stroke="#2D1810" strokeWidth="1.4" transform="rotate(-25 4 22)" />
        <ellipse cx="16" cy="22" rx="3" ry="5" fill="#FFFFFF" stroke="#2D1810" strokeWidth="1.4" transform="rotate(25 16 22)" />
        <circle cx="7.5" cy="28" r="0.8" fill="#2D1810" />
        <circle cx="12.5" cy="28" r="0.8" fill="#2D1810" />
        {i === 1 && <ellipse cx="6" cy="26" rx="3" ry="4" fill="#2D1810" />}
      </g>
    ))}
  </svg>
);

export default PinkCowIcon;
