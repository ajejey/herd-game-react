/*
  Aim Trainer — solo, endless.

  Category: reflex. Fully procedural: targets appear at random positions inside
  the play area, so there is no content at all.

  Note the scoring direction — LOWER is better here, unlike every other game in
  the hub. That single fact is the thing most likely to be got wrong: a
  "best score" comparison written the usual way round would record your WORST
  run as your best and never update again.

  Aesthetic: warm farm palette, deep-rose accent. No dark mode.
*/

export const THEME = {
  bg: '#FFF8E7',
  bgAlt: '#FFFFFF',
  border: '#FFE8C8',
  ink: '#2D1810',
  mut: '#6B5B4A',
  rose: '#B02E62',
  green: '#3D8B5A',
  red: '#D0463B',
};

export const FREDOKA = { fontFamily: "'Fredoka', system-ui, sans-serif" };
export const QUICKSAND = { fontFamily: "'Quicksand', system-ui, sans-serif" };

export const TARGETS = 30;      // hits per run — the usual length for this test
export const TARGET_PCT = 14;   // target diameter as a % of the board width

/*
  A random position as percentages, inset by half the target so the target can
  never be clipped by the edge of the board — a target you physically cannot
  hit would end the run for reasons nothing to do with aim.
*/
export function randomSpot() {
  const half = TARGET_PCT / 2;
  const span = 100 - TARGET_PCT;
  return {
    x: half + Math.random() * span,
    y: half + Math.random() * span,
  };
}

/** Average milliseconds per target. Lower is better. */
export function averageMs(totalMs, hits) {
  if (hits <= 0) return 0;
  return Math.round(totalMs / hits);
}

export function rankFor(avgMs) {
  if (avgMs <= 0) return { label: '—', blurb: '' };
  if (avgMs < 400) return { label: 'Extraordinary', blurb: 'That is competitive-shooter territory.' };
  if (avgMs < 500) return { label: 'Very Quick', blurb: 'Faster than almost anyone gets on a first go.' };
  if (avgMs < 650) return { label: 'Sharp', blurb: 'Comfortably above average.' };
  if (avgMs < 800) return { label: 'Average', blurb: 'Right around where most people land.' };
  if (avgMs < 1000) return { label: 'Steady', blurb: 'Try moving before you aim, not after.' };
  return { label: 'Warming Up', blurb: 'A bigger screen and a mouse both help a lot.' };
}
