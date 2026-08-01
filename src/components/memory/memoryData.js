/*
  Herd Memory — solo, endless, Simon-style.

  Category: quick reflex / memory. The purest tier-1 game we have: the sequence
  is generated at runtime, so there is NO content bank at all. It can never run
  dry, never needs refreshing, and adds zero content maintenance.

  Aesthetic: the meadow. Six pasture tiles, each a farm colour with its own
  pitch, on the usual cream paper. No dark mode.
*/

export const THEME = {
  bg: '#FFF8E7',
  bgAlt: '#FFFFFF',
  border: '#FFE8C8',
  ink: '#2D1810',
  mut: '#6B5B4A',
  green: '#3D8B5A',
  pink: '#E84A8B',
  red: '#D0463B',
};

export const FREDOKA = { fontFamily: "'Fredoka', system-ui, sans-serif" };
export const QUICKSAND = { fontFamily: "'Quicksand', system-ui, sans-serif" };

/* Six tiles: enough that a long sequence is genuinely hard, few enough that
   they stay big tap targets on a phone. Pitches are a pentatonic scale so any
   sequence sounds pleasant rather than random — the notes are a memory aid,
   not just decoration. */
export const TILES = [
  { id: 0, name: 'Meadow',   color: '#3D8B5A', lit: '#63BE84', freq: 261.63 },
  { id: 1, name: 'Sky',      color: '#3AA6B9', lit: '#6FD0E0', freq: 293.66 },
  { id: 2, name: 'Blossom',  color: '#E84A8B', lit: '#FF7FB0', freq: 329.63 },
  { id: 3, name: 'Hay',      color: '#F0A202', lit: '#FFC44D', freq: 392.00 },
  { id: 4, name: 'Lavender', color: '#8E5CF7', lit: '#B393FF', freq: 440.00 },
  { id: 5, name: 'Barn',     color: '#D0463B', lit: '#F0796E', freq: 523.25 },
];

/* Playback speed. The sequence tightens as it grows, which is what stops a
   long run becoming a slog — but never below FLOOR_MS, or it becomes
   unwatchable rather than hard. */
export const BASE_STEP_MS = 620;
export const FLOOR_MS = 300;

export function stepMsFor(length) {
  return Math.max(FLOOR_MS, BASE_STEP_MS - (length - 1) * 22);
}

export function rankFor(score) {
  if (score >= 15) return { label: 'Elephant Memory', blurb: 'This is genuinely unusual. Well done.' };
  if (score >= 11) return { label: 'Steel Trap', blurb: 'Very few people get this far.' };
  if (score >= 8) return { label: 'Sharp as a Tack', blurb: 'Comfortably above average.' };
  if (score >= 5) return { label: 'Pretty Good', blurb: 'Right about where most people land.' };
  if (score >= 3) return { label: 'Warming Up', blurb: 'One more go and you will beat that.' };
  return { label: 'Goldfish', blurb: 'It happens. Go again.' };
}

export const randomTile = () => Math.floor(Math.random() * TILES.length);
