/*
  Put in Order — solo, endless.

  Category: puzzle / high-replay. Content is FREE: it reuses the same Wikidata
  bank as Higher or Lower and Guess the Year, so one run of
  scripts/generate-hl-bank.js refreshes three games at once. The mechanic is
  new though — you arrange four things rather than picking one — so it does not
  feel like a re-skin.

  Aesthetic: warm farm palette with a deep plum accent, distinct from the other
  solo games. No dark mode.
*/

import generated from '../higherlower/hlBank.generated.json';

export const THEME = {
  bg: '#FFF8E7',
  bgAlt: '#FFFFFF',
  border: '#FFE8C8',
  ink: '#2D1810',
  mut: '#6B5B4A',
  plum: '#8E3B7A',
  green: '#3D8B5A',
  red: '#D0463B',
};

export const FREDOKA = { fontFamily: "'Fredoka', system-ui, sans-serif" };
export const QUICKSAND = { fontFamily: "'Quicksand', system-ui, sans-serif" };

export const ITEMS_PER_ROUND = 4;
export const LIVES = 3;

const FMT = {
  millions: (v) => (v >= 1 ? `${v}M people` : `${Math.round(v * 1000)},000 people`),
  meters: (v) => `${v} m`,
  km: (v) => `${v} km`,
  year: (v) => `${v}`,
};

/* Prompt per category. "Smallest first" for populations and "oldest first" for
   years read far more naturally than a generic "ascending". */
const PROMPTS = {
  population: { ask: 'Order these countries by population', low: 'Fewest people', high: 'Most people' },
  citypop: { ask: 'Order these cities by population', low: 'Fewest people', high: 'Most people' },
  height: { ask: 'Order these by height', low: 'Shortest', high: 'Tallest' },
  elevation: { ask: 'Order these mountains by height', low: 'Lowest', high: 'Highest' },
  riverlength: { ask: 'Order these rivers by length', low: 'Shortest', high: 'Longest' },
  year: { ask: 'Order these films by release date', low: 'Oldest', high: 'Newest' },
};

/*
  Only the most famous slice of each category.

  The bank is sorted by Wikipedia sitelink count, so the head is recognisable
  and the tail is obscure. Higher or Lower can survive one obscure item in a
  pair — you still have a 50/50 — but ordering FOUR things you have never heard
  of is not a puzzle, it is a lottery. A playtest turned up "Moksha, Xi River,
  Okavango River, River Great Ouse", which no one could reasonably order.
  Keeping the top slice trades variety for a game that is actually playable.
*/
const FAME_SLICE = 120;

export const CATEGORIES = (generated?.categories || [])
  .filter((c) => PROMPTS[c.id] && (c.items?.length || 0) >= 20)
  .map((c) => ({
    id: c.id,
    label: c.label,
    fmt: FMT[c.fmtKind] || ((v) => `${v}`),
    ...PROMPTS[c.id],
    items: c.items.slice(0, FAME_SLICE),
  }));

/* Items in a round must be clearly separable, or ordering becomes a coin flip.
   For ratio scales we require each step up to be at least 25% larger; for
   years (an interval scale — the same trap that made Guess the Year a coin
   flip) we require at least 4 clear years between neighbours. */
const MIN_RATIO = 1.25;
const MIN_YEAR_GAP = 4;

function wellSeparated(sorted, isYear) {
  for (let i = 1; i < sorted.length; i++) {
    const lo = sorted[i - 1].v;
    const hi = sorted[i].v;
    if (isYear) { if (hi - lo < MIN_YEAR_GAP) return false; }
    else if (!(lo > 0 && hi / lo >= MIN_RATIO)) return false;
  }
  return true;
}

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Build a round. Retries until it finds a well-separated set, then falls back
 * to the best it saw so the game can always produce a round.
 */
export function buildRound() {
  if (!CATEGORIES.length) return null;
  const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  const isYear = cat.id === 'year';

  let fallback = null;
  for (let attempt = 0; attempt < 40; attempt++) {
    const picks = shuffle(cat.items).slice(0, ITEMS_PER_ROUND);
    if (new Set(picks.map((p) => p.n)).size !== ITEMS_PER_ROUND) continue;
    const sorted = picks.slice().sort((a, b) => a.v - b.v);
    if (!fallback) fallback = sorted;
    if (wellSeparated(sorted, isYear)) return makeRound(cat, sorted);
  }
  return makeRound(cat, fallback);
}

function makeRound(cat, sorted) {
  // Present them shuffled; the answer is the ascending order.
  let shown = shuffle(sorted);
  // Never hand the player the answer already solved.
  if (shown.every((it, i) => it.n === sorted[i].n)) shown = shown.slice().reverse();
  return {
    categoryId: cat.id,
    ask: cat.ask,
    low: cat.low,
    high: cat.high,
    fmt: cat.fmt,
    items: shown,
    answer: sorted.map((it) => it.n),
  };
}

export function rankFor(score) {
  if (score >= 20) return { label: 'Almanac', blurb: 'You just know things, don’t you.' };
  if (score >= 14) return { label: 'Very Well Read', blurb: 'That is a serious run.' };
  if (score >= 9) return { label: 'Sharp', blurb: 'Comfortably above average.' };
  if (score >= 5) return { label: 'Solid', blurb: 'Right about where most people land.' };
  if (score >= 2) return { label: 'Warming Up', blurb: 'One more go and you will beat that.' };
  return { label: 'Out of Order', blurb: 'They get easier, promise.' };
}
