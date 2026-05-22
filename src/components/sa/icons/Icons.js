import React from 'react';

/*
  Brand-matched SVG icons for Say Anything.
  Drop-in replacements for emoji that don't render reliably on all devices.
  Designed to match the playful cow-mascot aesthetic — chunky, rounded, with a hint of shadow.

  Each accepts: size (px), className, style.
  Defaults to size=24 — easy to scale up for hero use.
*/

const base = (size) => ({ width: size, height: size });

// ── Token (the betting coin — the most important one) ──────────────────────
export const TokenIcon = ({ size = 24, className = '', style }) => (
  <svg viewBox="0 0 64 64" {...base(size)} className={className} style={style} aria-hidden="true">
    <defs>
      <radialGradient id="tk-shine" cx="35%" cy="30%" r="55%">
        <stop offset="0%" stopColor="#FFF59D" />
        <stop offset="60%" stopColor="#FBC02D" />
        <stop offset="100%" stopColor="#F57F17" />
      </radialGradient>
    </defs>
    {/* shadow */}
    <ellipse cx="32" cy="58" rx="20" ry="3" fill="rgba(45,24,16,0.18)" />
    {/* coin body */}
    <circle cx="32" cy="32" r="26" fill="url(#tk-shine)" stroke="#E65100" strokeWidth="2.5" />
    {/* inner ring */}
    <circle cx="32" cy="32" r="20" fill="none" stroke="#F57F17" strokeWidth="2" opacity="0.6" />
    {/* star */}
    <path
      d="M32 18 L35 28 L46 28 L37.2 34.4 L40.5 44.4 L32 38.3 L23.5 44.4 L26.8 34.4 L18 28 L29 28 Z"
      fill="#FFFDE7" stroke="#E65100" strokeWidth="1.5" strokeLinejoin="round"
    />
    {/* highlight */}
    <ellipse cx="22" cy="20" rx="6" ry="3" fill="#FFFDE7" opacity="0.7" />
  </svg>
);

// ── Token slot (empty placeholder — dashed circle) ─────────────────────────
export const TokenSlotIcon = ({ size = 24, className = '', style }) => (
  <svg viewBox="0 0 64 64" {...base(size)} className={className} style={style} aria-hidden="true">
    <circle cx="32" cy="32" r="24" fill="#FFF8E7" stroke="#C9B98F" strokeWidth="3" strokeDasharray="5 4" />
    <text x="32" y="40" textAnchor="middle" fontSize="22" fill="#C9B98F" fontFamily="Fredoka, sans-serif" fontWeight="700">?</text>
  </svg>
);

// ── Dice (for picking/random) ──────────────────────────────────────────────
export const DiceIcon = ({ size = 24, className = '', style }) => (
  <svg viewBox="0 0 64 64" {...base(size)} className={className} style={style} aria-hidden="true">
    <rect x="10" y="10" width="44" height="44" rx="10" fill="#E84A8B" stroke="#C73B73" strokeWidth="2.5" />
    <rect x="14" y="14" width="44" height="44" rx="10" fill="none" stroke="#C73B73" strokeWidth="2.5" opacity="0" />
    <circle cx="22" cy="22" r="3.5" fill="white" />
    <circle cx="42" cy="22" r="3.5" fill="white" />
    <circle cx="32" cy="32" r="3.5" fill="white" />
    <circle cx="22" cy="42" r="3.5" fill="white" />
    <circle cx="42" cy="42" r="3.5" fill="white" />
  </svg>
);

// ── Scale (for the judge) ──────────────────────────────────────────────────
export const ScaleIcon = ({ size = 24, className = '', style }) => (
  <svg viewBox="0 0 64 64" {...base(size)} className={className} style={style} aria-hidden="true">
    {/* base */}
    <rect x="28" y="46" width="8" height="12" fill="#8B6347" rx="2" />
    <rect x="20" y="55" width="24" height="5" rx="2" fill="#6B4226" />
    {/* pole */}
    <rect x="30" y="14" width="4" height="34" fill="#8B6347" />
    {/* beam */}
    <rect x="10" y="18" width="44" height="4" rx="2" fill="#8B6347" />
    {/* left pan */}
    <path d="M 14 22 L 10 32 L 22 32 Z" fill="#FFD56B" stroke="#E65100" strokeWidth="1.5" />
    {/* right pan */}
    <path d="M 50 22 L 46 32 L 58 32 Z" fill="#FFD56B" stroke="#E65100" strokeWidth="1.5" />
    {/* top knob */}
    <circle cx="32" cy="14" r="3" fill="#FFD56B" stroke="#E65100" strokeWidth="1.5" />
  </svg>
);

// ── Pencil (for answering) ─────────────────────────────────────────────────
export const PencilIcon = ({ size = 24, className = '', style }) => (
  <svg viewBox="0 0 64 64" {...base(size)} className={className} style={style} aria-hidden="true">
    {/* body */}
    <rect x="10" y="20" width="36" height="14" rx="2" transform="rotate(-25 28 27)" fill="#FFD56B" stroke="#8B6347" strokeWidth="2" />
    {/* tip */}
    <path d="M 50 36 L 56 30 L 58 38 L 52 42 Z" fill="#3D8B5A" stroke="#2F6E45" strokeWidth="1.5" />
    {/* eraser */}
    <rect x="6" y="32" width="10" height="14" rx="2" transform="rotate(-25 11 39)" fill="#E84A8B" stroke="#C73B73" strokeWidth="2" />
  </svg>
);

// ── Speech bubble (for the game itself) ────────────────────────────────────
export const ChatBubbleIcon = ({ size = 24, className = '', style }) => (
  <svg viewBox="0 0 64 64" {...base(size)} className={className} style={style} aria-hidden="true">
    <path
      d="M 8 14 Q 8 8 14 8 L 50 8 Q 56 8 56 14 L 56 38 Q 56 44 50 44 L 24 44 L 14 54 L 16 44 L 14 44 Q 8 44 8 38 Z"
      fill="#3D8B5A" stroke="#2F6E45" strokeWidth="2.5" strokeLinejoin="round"
    />
    <circle cx="22" cy="26" r="3" fill="white" />
    <circle cx="32" cy="26" r="3" fill="white" />
    <circle cx="42" cy="26" r="3" fill="white" />
  </svg>
);

// ── Eye / spy (for "judge is picking") ─────────────────────────────────────
export const EyeIcon = ({ size = 24, className = '', style }) => (
  <svg viewBox="0 0 64 64" {...base(size)} className={className} style={style} aria-hidden="true">
    <path d="M 4 32 Q 32 8 60 32 Q 32 56 4 32 Z" fill="#FFF8E7" stroke="#2D1810" strokeWidth="2.5" strokeLinejoin="round" />
    <circle cx="32" cy="32" r="10" fill="#3D8B5A" />
    <circle cx="32" cy="32" r="5" fill="#2D1810" />
    <circle cx="34" cy="29" r="2" fill="white" />
  </svg>
);

// ── Trophy (winner) ────────────────────────────────────────────────────────
export const TrophyIcon = ({ size = 24, className = '', style }) => (
  <svg viewBox="0 0 64 64" {...base(size)} className={className} style={style} aria-hidden="true">
    <path d="M 16 12 L 48 12 L 46 32 Q 46 42 32 42 Q 18 42 18 32 Z" fill="#FBC02D" stroke="#E65100" strokeWidth="2.5" />
    <path d="M 16 16 L 10 16 Q 6 16 6 22 Q 6 28 16 30" fill="none" stroke="#E65100" strokeWidth="2.5" />
    <path d="M 48 16 L 54 16 Q 58 16 58 22 Q 58 28 48 30" fill="none" stroke="#E65100" strokeWidth="2.5" />
    <rect x="28" y="42" width="8" height="8" fill="#8B6347" />
    <rect x="20" y="50" width="24" height="6" rx="2" fill="#6B4226" />
    <path d="M 26 22 L 28 28 L 34 28 L 29 32 L 31 38 L 26 34 L 21 38 L 23 32 L 18 28 L 24 28 Z" fill="#FFFDE7" opacity="0.5" />
  </svg>
);

// ── Fire (double-down) ─────────────────────────────────────────────────────
export const FireIcon = ({ size = 24, className = '', style }) => (
  <svg viewBox="0 0 64 64" {...base(size)} className={className} style={style} aria-hidden="true">
    <path d="M 32 6 Q 22 18 22 28 Q 18 26 16 22 Q 12 32 14 42 Q 18 56 32 56 Q 46 56 50 42 Q 52 30 46 22 Q 44 30 40 30 Q 42 18 32 6 Z"
      fill="#FF7043" stroke="#D84315" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M 32 26 Q 27 34 27 40 Q 27 48 32 48 Q 37 48 37 40 Q 37 34 32 26 Z"
      fill="#FFD56B" stroke="#FB8C00" strokeWidth="1.5" />
  </svg>
);

// ── Shield (hedge) ─────────────────────────────────────────────────────────
export const ShieldIcon = ({ size = 24, className = '', style }) => (
  <svg viewBox="0 0 64 64" {...base(size)} className={className} style={style} aria-hidden="true">
    <path d="M 32 6 L 54 14 L 52 36 Q 50 50 32 58 Q 14 50 12 36 L 10 14 Z"
      fill="#5BA8D8" stroke="#2D6FA0" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M 22 30 L 30 38 L 44 22" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Sparkles (reveal moment) ───────────────────────────────────────────────
export const SparkleIcon = ({ size = 24, className = '', style }) => (
  <svg viewBox="0 0 64 64" {...base(size)} className={className} style={style} aria-hidden="true">
    <path d="M 32 6 L 36 26 L 56 30 L 36 34 L 32 54 L 28 34 L 8 30 L 28 26 Z" fill="#FFD56B" stroke="#E65100" strokeWidth="2" strokeLinejoin="round" />
    <path d="M 50 8 L 52 14 L 58 16 L 52 18 L 50 24 L 48 18 L 42 16 L 48 14 Z" fill="#FFD56B" stroke="#E65100" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M 14 44 L 16 50 L 22 52 L 16 54 L 14 60 L 12 54 L 6 52 L 12 50 Z" fill="#FFD56B" stroke="#E65100" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

// ── Cow head (brand mark) ──────────────────────────────────────────────────
export const CowIcon = ({ size = 24, className = '', style }) => (
  <svg viewBox="0 0 64 64" {...base(size)} className={className} style={style} aria-hidden="true">
    <ellipse cx="32" cy="38" rx="22" ry="20" fill="white" stroke="#2D1810" strokeWidth="2.5" />
    <ellipse cx="20" cy="22" rx="8" ry="6" fill="white" stroke="#2D1810" strokeWidth="2" />
    <ellipse cx="44" cy="22" rx="8" ry="6" fill="white" stroke="#2D1810" strokeWidth="2" />
    <ellipse cx="20" cy="22" rx="4" ry="3" fill="#F8BBD0" />
    <ellipse cx="44" cy="22" rx="4" ry="3" fill="#F8BBD0" />
    <ellipse cx="32" cy="48" rx="14" ry="9" fill="#FFCDD2" stroke="#2D1810" strokeWidth="2" />
    <ellipse cx="26" cy="48" rx="1.5" ry="2" fill="#2D1810" />
    <ellipse cx="38" cy="48" rx="1.5" ry="2" fill="#2D1810" />
    <circle cx="24" cy="32" r="3" fill="#2D1810" />
    <circle cx="40" cy="32" r="3" fill="#2D1810" />
    <ellipse cx="14" cy="40" rx="4" ry="3" fill="#FFCDD2" opacity="0.7" />
    <ellipse cx="50" cy="40" rx="4" ry="3" fill="#FFCDD2" opacity="0.7" />
  </svg>
);

// ── Clock (waiting) ────────────────────────────────────────────────────────
export const ClockIcon = ({ size = 24, className = '', style }) => (
  <svg viewBox="0 0 64 64" {...base(size)} className={className} style={style} aria-hidden="true">
    <circle cx="32" cy="32" r="24" fill="white" stroke="#8B6347" strokeWidth="2.5" />
    <circle cx="32" cy="32" r="20" fill="none" stroke="#FFE8C8" strokeWidth="2" />
    <line x1="32" y1="32" x2="32" y2="18" stroke="#2D1810" strokeWidth="3" strokeLinecap="round" />
    <line x1="32" y1="32" x2="42" y2="38" stroke="#2D1810" strokeWidth="3" strokeLinecap="round" />
    <circle cx="32" cy="32" r="2.5" fill="#E84A8B" />
  </svg>
);
