/*
  Reaction Time — solo, endless.

  Category: quick reflex. Zero content of any kind: the wait is a random
  interval and the score is a measurement. Nothing to write, nothing to refresh,
  and it can never repeat itself.

  Aesthetic: warm farm palette with the meadow green as "go" and a soft clay as
  "wait" — deliberately not a traffic-light red/green, which would clash with
  the rest of the site and be poor for red-green colour blindness. The state is
  always stated in words as well as colour.
*/

export const THEME = {
  bg: '#FFF8E7',
  bgAlt: '#FFFFFF',
  border: '#FFE8C8',
  ink: '#2D1810',
  mut: '#6B5B4A',
  wait: '#C9762F',    // clay — "hold"
  go: '#3D8B5A',      // meadow green — "tap"
  early: '#D0463B',
  pink: '#E84A8B',
};

export const FREDOKA = { fontFamily: "'Fredoka', system-ui, sans-serif" };
export const QUICKSAND = { fontFamily: "'Quicksand', system-ui, sans-serif" };

export const ROUNDS = 5;
export const MIN_WAIT_MS = 1400;
export const MAX_WAIT_MS = 4200;

/** A random hold, long enough that you cannot time it by rhythm. */
export const randomWait = () => MIN_WAIT_MS + Math.random() * (MAX_WAIT_MS - MIN_WAIT_MS);

/* Benchmarks are the honest, widely cited ballpark: ~200-250ms is a normal
   visual reaction time for an adult, and anything under 150ms is exceptional
   (and often a lucky guess rather than a true reaction). */
export function rankFor(ms) {
  if (ms < 180) return { label: 'Lightning', blurb: 'Faster than almost anyone. Suspiciously so.' };
  if (ms < 220) return { label: 'Very Quick', blurb: 'Well above average.' };
  if (ms < 270) return { label: 'Sharp', blurb: 'A typical good reaction time.' };
  if (ms < 340) return { label: 'Average', blurb: 'Right about where most people sit.' };
  if (ms < 450) return { label: 'Relaxed', blurb: 'Nothing wrong with taking your time.' };
  return { label: 'Positively Bovine', blurb: 'The herd is not in a hurry either.' };
}
