/*
  Guess the Year — solo, endless.

  Category: puzzle / high-replay. Content is FREE here: it reuses the movie
  category already pulled from Wikidata for Higher or Lower, so there is no new
  bank to write or maintain. Re-running scripts/generate-hl-bank.js refreshes
  both games at once.

  Aesthetic: warm farm palette (no dark mode anywhere on this site), with amber
  as the accent and a timeline/slider as the hero control — deliberately a
  different shape from Higher or Lower's two-card VS layout.

  Format: 5 rounds per run, scored on how close you are, so a run has a natural
  end and a shareable total. Films are drawn at random from the bank each time,
  so replaying is always a different set.
*/

import generated from '../higherlower/hlBank.generated.json';

export const THEME = {
  bg: '#FFF8E7',
  bgAlt: '#FFFFFF',
  border: '#FFE8C8',
  ink: '#2D1810',
  mut: '#6B5B4A',
  // Decorative only (thin bands, the slider track). At 2.1:1 against white it
  // is far too low-contrast for text or button labels.
  amber: '#F0A202',
  // Text/button amber — 4.88:1 on white, clears WCAG AA for normal text and
  // beats the site's existing green (4.2) and pink (3.6).
  amberDeep: '#A85F00',
  green: '#3D8B5A',
  red: '#D0463B',
};

export const FREDOKA = { fontFamily: "'Fredoka', system-ui, sans-serif" };
export const QUICKSAND = { fontFamily: "'Quicksand', system-ui, sans-serif" };

export const ROUNDS = 5;
export const MIN_YEAR = 1920;
export const MAX_YEAR = 2025;
export const MAX_ROUND_SCORE = 100;

/* The bank is ordered by Wikipedia sitelink count (fame). Taking the top slice
   keeps the game guessable — a film nobody has heard of is not a puzzle, it is
   a coin flip. */
const FAME_CUTOFF = 260;

const yearCat = (generated?.categories || []).find((c) => c.fmtKind === 'year');

export const FILMS = (yearCat?.items || [])
  .slice(0, FAME_CUTOFF)
  .filter((it) => it && typeof it.n === 'string' && Number.isFinite(it.v) && it.v >= MIN_YEAR && it.v <= MAX_YEAR);

/** Points for a guess: exact is 100, then 10 off per year, floor of 0. */
export function scoreGuess(guess, actual) {
  const diff = Math.abs(guess - actual);
  return { diff, points: Math.max(0, MAX_ROUND_SCORE - diff * 10) };
}

export function verdictFor(diff) {
  if (diff === 0) return { label: 'Spot on!', color: THEME.green };
  if (diff <= 2) return { label: 'So close', color: THEME.green };
  if (diff <= 5) return { label: 'Not bad', color: THEME.amber };
  if (diff <= 10) return { label: 'Way off', color: THEME.red };
  return { label: 'Wrong decade entirely', color: THEME.red };
}

/** Rank for a completed run, out of ROUNDS * MAX_ROUND_SCORE. */
export function rankFor(total) {
  const max = ROUNDS * MAX_ROUND_SCORE;
  const pct = total / max;
  if (pct >= 0.9) return { label: 'Film Archivist', blurb: 'You have seen everything. Twice.' };
  if (pct >= 0.7) return { label: 'Proper Cinephile', blurb: 'You know your decades.' };
  if (pct >= 0.5) return { label: 'Casual Viewer', blurb: 'Solid instincts, shaky details.' };
  if (pct >= 0.25) return { label: 'Popcorn Enjoyer', blurb: 'You are here for the snacks, and that is fine.' };
  return { label: 'Time Traveller', blurb: 'Your sense of time is entirely your own.' };
}

/** N distinct random films. */
export function drawFilms(n) {
  const pool = FILMS.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}
