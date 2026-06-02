import React from 'react';

/*
  Guesstimate icons — pub-quiz / chalkboard aesthetic.
  Pairs with the existing meadow brand: warm browns, chalk whites, board green.
*/

const base = (size) => ({ width: size, height: size });

// ── Chip (the betting token) — wooden coaster style ────────────────────────
export const ChipIcon = ({ size = 24, className = '', style }) => (
  <svg viewBox="0 0 64 64" {...base(size)} className={className} style={style} aria-hidden="true">
    <defs>
      <radialGradient id="ck-wood" cx="35%" cy="30%" r="60%">
        <stop offset="0%" stopColor="#D9A05B" />
        <stop offset="50%" stopColor="#A86F2F" />
        <stop offset="100%" stopColor="#6B4226" />
      </radialGradient>
    </defs>
    <ellipse cx="32" cy="58" rx="20" ry="3" fill="rgba(0,0,0,0.15)" />
    <circle cx="32" cy="32" r="26" fill="url(#ck-wood)" stroke="#3B2A18" strokeWidth="2.5" />
    {/* wood grain rings */}
    <circle cx="32" cy="32" r="20" fill="none" stroke="#6B4226" strokeWidth="1.5" opacity="0.5" />
    <circle cx="32" cy="32" r="14" fill="none" stroke="#3B2A18" strokeWidth="1" opacity="0.4" />
    <circle cx="32" cy="32" r="8"  fill="none" stroke="#3B2A18" strokeWidth="1" opacity="0.4" />
    {/* highlight */}
    <ellipse cx="24" cy="22" rx="6" ry="3" fill="#FFE0B2" opacity="0.5" />
  </svg>
);

// ── Empty chip slot — dashed circle ────────────────────────────────────────
export const ChipSlotIcon = ({ size = 24, className = '', style }) => (
  <svg viewBox="0 0 64 64" {...base(size)} className={className} style={style} aria-hidden="true">
    <circle cx="32" cy="32" r="24" fill="rgba(255,255,255,0.08)" stroke="#8B6347" strokeWidth="3" strokeDasharray="5 4" />
    <text x="32" y="40" textAnchor="middle" fontSize="22" fill="#8B6347" fontFamily="Fredoka, sans-serif" fontWeight="700">?</text>
  </svg>
);

// ── Chalk pencil (question/answering phase) ────────────────────────────────
export const ChalkIcon = ({ size = 24, className = '', style }) => (
  <svg viewBox="0 0 64 64" {...base(size)} className={className} style={style} aria-hidden="true">
    {/* chalk body */}
    <rect x="14" y="22" width="42" height="12" rx="2" transform="rotate(-20 35 28)" fill="#FAFAFA" stroke="#5C4A36" strokeWidth="1.5" />
    {/* tip */}
    <path d="M 11 36 L 6 40 L 9 44 L 14 41 Z" fill="#FAFAFA" stroke="#5C4A36" strokeWidth="1.5" />
    {/* highlight stripe */}
    <rect x="18" y="24" width="36" height="2.5" rx="1" transform="rotate(-20 35 28)" fill="#ECECEC" />
  </svg>
);

// ── Pint glass (chalkboard pub vibe) ───────────────────────────────────────
export const PintIcon = ({ size = 24, className = '', style }) => (
  <svg viewBox="0 0 64 64" {...base(size)} className={className} style={style} aria-hidden="true">
    {/* glass */}
    <path d="M 18 12 L 46 12 L 42 56 L 22 56 Z" fill="#FFD180" stroke="#5C4A36" strokeWidth="2" strokeLinejoin="round" />
    {/* froth */}
    <path d="M 18 12 Q 22 6 28 10 Q 32 6 36 10 Q 42 6 46 12 Q 42 16 36 14 Q 32 18 28 14 Q 22 16 18 12 Z" fill="#FAFAFA" stroke="#5C4A36" strokeWidth="2" strokeLinejoin="round" />
    {/* highlight */}
    <path d="M 24 20 L 26 50" stroke="#FFFDE7" strokeWidth="2" opacity="0.8" strokeLinecap="round" />
  </svg>
);

// ── Question mark in a thought bubble ──────────────────────────────────────
export const ThinkIcon = ({ size = 24, className = '', style }) => (
  <svg viewBox="0 0 64 64" {...base(size)} className={className} style={style} aria-hidden="true">
    <circle cx="32" cy="30" r="22" fill="#FFF8E7" stroke="#2D1810" strokeWidth="2.5" />
    <circle cx="18" cy="52" r="4"  fill="#FFF8E7" stroke="#2D1810" strokeWidth="2" />
    <circle cx="12" cy="58" r="2.5" fill="#FFF8E7" stroke="#2D1810" strokeWidth="1.5" />
    <text x="32" y="40" textAnchor="middle" fontSize="28" fontFamily="Fredoka, sans-serif" fontWeight="700" fill="#2D1810">?</text>
  </svg>
);

// ── Trophy ─────────────────────────────────────────────────────────────────
export const TrophyIcon = ({ size = 24, className = '', style }) => (
  <svg viewBox="0 0 64 64" {...base(size)} className={className} style={style} aria-hidden="true">
    <path d="M 16 12 L 48 12 L 46 32 Q 46 42 32 42 Q 18 42 18 32 Z" fill="#FBC02D" stroke="#E65100" strokeWidth="2.5" />
    <path d="M 16 16 L 10 16 Q 6 16 6 22 Q 6 28 16 30" fill="none" stroke="#E65100" strokeWidth="2.5" />
    <path d="M 48 16 L 54 16 Q 58 16 58 22 Q 58 28 48 30" fill="none" stroke="#E65100" strokeWidth="2.5" />
    <rect x="28" y="42" width="8" height="8" fill="#8B6347" />
    <rect x="20" y="50" width="24" height="6" rx="2" fill="#6B4226" />
  </svg>
);

// ── Chalkboard (reveal / board) ────────────────────────────────────────────
export const BoardIcon = ({ size = 24, className = '', style }) => (
  <svg viewBox="0 0 64 64" {...base(size)} className={className} style={style} aria-hidden="true">
    {/* wood frame */}
    <rect x="4" y="10" width="56" height="44" rx="3" fill="#A86F2F" stroke="#3B2A18" strokeWidth="2" />
    {/* board surface */}
    <rect x="8" y="14" width="48" height="36" rx="2" fill="#2D5C3F" />
    {/* chalk lines */}
    <line x1="14" y1="22" x2="50" y2="22" stroke="#FAFAFA" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="14" y1="30" x2="42" y2="30" stroke="#FAFAFA" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="14" y1="38" x2="50" y2="38" stroke="#FAFAFA" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="14" y1="44" x2="36" y2="44" stroke="#FAFAFA" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ── Clock ─────────────────────────────────────────────────────────────────
export const ClockIcon = ({ size = 24, className = '', style }) => (
  <svg viewBox="0 0 64 64" {...base(size)} className={className} style={style} aria-hidden="true">
    <circle cx="32" cy="32" r="24" fill="white" stroke="#8B6347" strokeWidth="2.5" />
    <line x1="32" y1="32" x2="32" y2="18" stroke="#2D1810" strokeWidth="3" strokeLinecap="round" />
    <line x1="32" y1="32" x2="42" y2="38" stroke="#2D1810" strokeWidth="3" strokeLinecap="round" />
    <circle cx="32" cy="32" r="2.5" fill="#E84A8B" />
  </svg>
);

// ── Fire / Shield (carry-over from SA — double-down / hedge) ───────────────
export const FireIcon = ({ size = 24, className = '', style }) => (
  <svg viewBox="0 0 64 64" {...base(size)} className={className} style={style} aria-hidden="true">
    <path d="M 32 6 Q 22 18 22 28 Q 18 26 16 22 Q 12 32 14 42 Q 18 56 32 56 Q 46 56 50 42 Q 52 30 46 22 Q 44 30 40 30 Q 42 18 32 6 Z"
      fill="#FF7043" stroke="#D84315" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M 32 26 Q 27 34 27 40 Q 27 48 32 48 Q 37 48 37 40 Q 37 34 32 26 Z"
      fill="#FFD56B" stroke="#FB8C00" strokeWidth="1.5" />
  </svg>
);

export const ShieldIcon = ({ size = 24, className = '', style }) => (
  <svg viewBox="0 0 64 64" {...base(size)} className={className} style={style} aria-hidden="true">
    <path d="M 32 6 L 54 14 L 52 36 Q 50 50 32 58 Q 14 50 12 36 L 10 14 Z"
      fill="#5BA8D8" stroke="#2D6FA0" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M 22 30 L 30 38 L 44 22" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
