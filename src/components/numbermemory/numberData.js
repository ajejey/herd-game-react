/*
  Number Memory Test — solo, endless.

  Category: memory. Fully procedural — the digits are random, so it never
  repeats and never needs content.

  Sits deliberately next to the Chimp Test: that one is spatial working memory
  (where things were), this one is verbal working memory (what the digits
  were). People who are good at one are often surprisingly bad at the other,
  which is a nice reason to play both.

  Aesthetic: warm farm palette, blue accent. No dark mode.
*/

export const THEME = {
  bg: '#FFF8E7',
  bgAlt: '#FFFFFF',
  border: '#FFE8C8',
  ink: '#2D1810',
  mut: '#6B5B4A',
  blue: '#1D5FA8',
  green: '#3D8B5A',
  red: '#D0463B',
};

export const FREDOKA = { fontFamily: "'Fredoka', system-ui, sans-serif" };
export const QUICKSAND = { fontFamily: "'Quicksand', system-ui, sans-serif" };

export const START_DIGITS = 3;
export const LIVES = 3;

/*
  Longer numbers get longer on screen. A flat display time would make the test
  purely about reading speed once you pass about seven digits, which is the
  point where it should be about memory instead.
*/
export function showMsFor(digits) {
  return 1200 + Math.max(0, digits - START_DIGITS) * 700;
}

/** A random number of the given length. Never starts with a zero — a leading
 *  zero is easy to lose when reading back and is not a memory failure. */
export function buildNumber(digits) {
  let s = String(1 + Math.floor(Math.random() * 9));
  for (let i = 1; i < digits; i++) s += String(Math.floor(Math.random() * 10));
  return s;
}

export function rankFor(digits) {
  if (digits >= 14) return { label: 'Extraordinary', blurb: 'This is competitive-memory territory.' };
  if (digits >= 12) return { label: 'Remarkable', blurb: 'Very few people reach this without a technique.' };
  if (digits >= 10) return { label: 'Sharp', blurb: 'Well past the seven most people manage.' };
  if (digits >= 8) return { label: 'Above Average', blurb: 'Better than the typical result.' };
  if (digits >= 6) return { label: 'Typical Human', blurb: 'The famous span really is about seven.' };
  return { label: 'Warming Up', blurb: 'Try saying the digits out loud as they appear.' };
}
