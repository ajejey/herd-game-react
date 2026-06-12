/*
  Daily Hot Takes — frontend display data + theme.

  Aesthetic: bold "versus / debate" — warm paper, heavy editorial type, a spicy
  red and a cool blue for the two sides. Deliberately NOT the Aura pastel or the
  Herd meadow. Questions + crowd split come from the backend; this file maps the
  archetype id → its name, color, and blurb.
*/

export const THEME = {
  paper: '#FFF7F0',
  ink: '#1A1714',
  mut: '#7A6E66',
  hot: '#FF4D2E',   // option A side
  cool: '#2D6BE0',  // option B side
};

// Heavy editorial headline stack (distinct from Fredoka/Quicksand used elsewhere).
export const HEAVY = { fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif", fontWeight: 800, letterSpacing: '-0.02em' };
export const BODY = { fontFamily: "'Quicksand', system-ui, sans-serif" };

export const ARCHETYPES = {
  maxi: { id: 'maxi', name: 'The Maximalist', swatch: '🎉', color: '#FF4D2E', traits: ['bold', 'spontaneous', 'extra'], line: 'More is more. You say yes to the big, the loud, the extra.' },
  mini: { id: 'mini', name: 'The Minimalist', swatch: '🌿', color: '#2F9E6B', traits: ['calm', 'curated', 'intentional'], line: 'Less, but better. Quiet, considered, never cluttered.' },
  romantic: { id: 'romantic', name: 'The Romantic', swatch: '💛', color: '#E0992D', traits: ['warm', 'nostalgic', 'sentimental'], line: 'You feel everything. Nostalgia, warmth, the little moments.' },
  pragmatic: { id: 'pragmatic', name: 'The Pragmatist', swatch: '🧭', color: '#2D6BE0', traits: ['logical', 'efficient', 'grounded'], line: 'Logic over hype. You pick what actually works.' },
  rebel: { id: 'rebel', name: 'The Rebel', swatch: '🌶️', color: '#D7263D', traits: ['independent', 'contrarian', 'bold'], line: 'Against the grain on principle. Spicy takes, zero regrets.' },
  connector: { id: 'connector', name: 'The Connector', swatch: '🤝', color: '#B5479B', traits: ['social', 'warm', 'inclusive'], line: 'People-first. You are the one who brings everyone together.' },
};

// Spice = how many of your takes put you in the minority (0..7).
export function spiceLabel(spice, total) {
  const r = total ? spice / total : 0;
  if (r >= 0.7) return { label: 'Certified contrarian', chili: '🌶️🌶️🌶️' };
  if (r >= 0.45) return { label: 'Pretty spicy', chili: '🌶️🌶️' };
  if (r >= 0.2) return { label: 'A little spicy', chili: '🌶️' };
  return { label: 'Crowd-pleaser', chili: '🤝' };
}
