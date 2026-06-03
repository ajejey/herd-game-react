import React from 'react';

/* On-brand hand-drawn SVGs (no emoji). Meadow palette. */

export const Sheep = ({ size = 64, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
    {/* fluffy body */}
    <g fill="#FFFFFF" stroke="#2D1810" strokeWidth="2">
      <circle cx="24" cy="34" r="9" />
      <circle cx="40" cy="34" r="9" />
      <circle cx="32" cy="28" r="10" />
      <circle cx="32" cy="40" r="10" />
      <circle cx="20" cy="40" r="7" />
      <circle cx="44" cy="40" r="7" />
    </g>
    {/* legs */}
    <g stroke="#2D1810" strokeWidth="2.4" strokeLinecap="round">
      <line x1="26" y1="48" x2="26" y2="55" />
      <line x1="38" y1="48" x2="38" y2="55" />
    </g>
    {/* face */}
    <ellipse cx="32" cy="34" rx="8.5" ry="9.5" fill="#2D1810" />
    <ellipse cx="32" cy="26" rx="9" ry="6" fill="#2D1810" />
    <ellipse cx="23" cy="30" rx="3" ry="4.5" fill="#2D1810" transform="rotate(-20 23 30)" />
    <ellipse cx="41" cy="30" rx="3" ry="4.5" fill="#2D1810" transform="rotate(20 41 30)" />
    <circle cx="29" cy="33" r="1.7" fill="#fff" />
    <circle cx="35" cy="33" r="1.7" fill="#fff" />
    <path d="M29 39 Q32 41 35 39" stroke="#fff" strokeWidth="1.4" fill="none" strokeLinecap="round" />
  </svg>
);

export const Wolf = ({ size = 64, className = '' }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true">
    {/* ears */}
    <path d="M18 22 L22 8 L30 20 Z" fill="#8B7A6B" stroke="#2D1810" strokeWidth="2" strokeLinejoin="round" />
    <path d="M46 22 L42 8 L34 20 Z" fill="#8B7A6B" stroke="#2D1810" strokeWidth="2" strokeLinejoin="round" />
    {/* head */}
    <path d="M16 26 Q32 16 48 26 L44 44 Q32 52 20 44 Z" fill="#A89685" stroke="#2D1810" strokeWidth="2" strokeLinejoin="round" />
    {/* muzzle */}
    <path d="M26 40 Q32 36 38 40 L35 50 Q32 53 29 50 Z" fill="#F0EAE2" stroke="#2D1810" strokeWidth="1.6" strokeLinejoin="round" />
    {/* eyes */}
    <ellipse cx="26" cy="30" rx="2.4" ry="3" fill="#2D1810" />
    <ellipse cx="38" cy="30" rx="2.4" ry="3" fill="#2D1810" />
    {/* nose */}
    <ellipse cx="32" cy="42" rx="2.6" ry="2" fill="#2D1810" />
  </svg>
);
