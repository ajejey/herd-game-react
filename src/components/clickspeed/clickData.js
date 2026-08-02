/*
  Click Speed Test (CPS) — solo, endless.

  Category: reflex. Entirely procedural — there is no content at all, just a
  clock and a counter, which makes it the cheapest game in the hub to maintain
  and one of the highest-volume queries ("cps test", "click speed test").

  Aesthetic: warm farm palette, burnt-orange accent. No dark mode.
*/

export const THEME = {
  bg: '#FFF8E7',
  bgAlt: '#FFFFFF',
  border: '#FFE8C8',
  ink: '#2D1810',
  mut: '#6B5B4A',
  orange: '#C2410C',
  green: '#3D8B5A',
  red: '#D0463B',
};

export const FREDOKA = { fontFamily: "'Fredoka', system-ui, sans-serif" };
export const QUICKSAND = { fontFamily: "'Quicksand', system-ui, sans-serif" };

/* Five seconds is the length every other CPS test uses, so scores compare. */
export const DURATION_MS = 5000;

export function cpsFrom(clicks) {
  return Math.round((clicks / (DURATION_MS / 1000)) * 100) / 100;
}

export function rankFor(cps) {
  if (cps >= 10) return { label: 'Suspiciously Fast', blurb: 'That is butterfly-clicking territory.' };
  if (cps >= 8) return { label: 'Very Quick', blurb: 'Faster than almost anyone gets on a first go.' };
  if (cps >= 6.5) return { label: 'Sharp', blurb: 'Comfortably above the usual 6 or 7.' };
  if (cps >= 5) return { label: 'Average', blurb: 'Right around where most people land.' };
  if (cps >= 3.5) return { label: 'Steady', blurb: 'Try tapping with two fingers instead of one.' };
  return { label: 'Warming Up', blurb: 'Rest your wrist and let your fingers do the work.' };
}
