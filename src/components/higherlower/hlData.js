/*
  Higher or Lower — frontend display data + theme.

  Aesthetic: the warm Herd farm palette — cream paper, cocoa ink, and a bright
  pink/amber "VS" energy. No dark mode anywhere on this site. The game still
  reads as loud and arcade-y through huge numerals and chunky buttons rather
  than through a dark background.

  Fully client-side: no backend, no daily gate. One life, endless streak.

  Bank shape: categories each share ONE unit so every comparison is fair.
  Values are well-established round figures; pairs are only offered when the gap
  is big enough that the answer is not a coin flip (see MIN_GAP_RATIO).
*/

// Wikidata-generated bank (see scripts/generate-hl-bank.js).
import generated from './hlBank.generated.json';

export const THEME = {
  bg: '#FFF8E7',      // site cream paper
  bgAlt: '#FFFFFF',   // card
  border: '#FFE8C8',
  ink: '#2D1810',     // cocoa
  mut: '#6B5B4A',
  hot: '#E84A8B',     // herd pink — the accent
  amber: '#F0A202',
  win: '#3D8B5A',     // meadow green
  lose: '#D0463B',
};

export const HEAVY = {
  fontFamily: "'Fredoka', system-ui, -apple-system, sans-serif",
  fontWeight: 700,
  letterSpacing: '-0.02em',
};
export const BODY = { fontFamily: "'Quicksand', system-ui, sans-serif" };

/* A pair is only used when the two values are far enough apart to be knowable
   rather than a coin flip (e.g. India vs China is unguessable).

   Two rules, because the categories are not all the same kind of scale:

   - RATIO (default) — right for ratio scales like population, height, length,
     where "twice as tall" is meaningful.
   - ABSOLUTE — required for interval scales, i.e. years. A ratio rule is
     meaningless there: 2013 vs 2014 passes any sane ratio test (1.0005) while
     being pure guesswork, and demanding hi/lo >= 1.18 would need 2000 vs 1695,
     which no two modern films satisfy. So EVERY year pair fell through to the
     fallback and the whole category was a coin flip. Caught by
     scripts/hl-logic-check.js. */
export const MIN_GAP_RATIO = 1.18;
export const MIN_GAP_YEARS = 5;

export function isFairPair(cat, a, b) {
  const hi = Math.max(a.v, b.v);
  const lo = Math.min(a.v, b.v);
  if (cat?.gapKind === 'absolute') return hi - lo >= (cat.minGap ?? MIN_GAP_YEARS);
  return lo > 0 ? hi / lo >= MIN_GAP_RATIO : true;
}

/* Hand-curated categories. These stay because Wikidata's coverage of animal
   speed and lifespan is too sparse to generate, and because the small curated
   sets carry per-item icons. Where a generated category shares an id, the
   generated (much larger) one wins — see CATEGORIES below. */
const CURATED = [
  {
    id: 'population',
    label: 'Population',
    question: 'Which country has MORE people?',
    unit: 'people',
    fmt: (v) => `${v} million`,
    items: [
      { n: 'India', v: 1428, e: '🇮🇳' },
      { n: 'China', v: 1425, e: '🇨🇳' },
      { n: 'United States', v: 335, e: '🇺🇸' },
      { n: 'Indonesia', v: 277, e: '🇮🇩' },
      { n: 'Pakistan', v: 240, e: '🇵🇰' },
      { n: 'Nigeria', v: 223, e: '🇳🇬' },
      { n: 'Brazil', v: 216, e: '🇧🇷' },
      { n: 'Bangladesh', v: 173, e: '🇧🇩' },
      { n: 'Russia', v: 144, e: '🇷🇺' },
      { n: 'Mexico', v: 128, e: '🇲🇽' },
      { n: 'Ethiopia', v: 127, e: '🇪🇹' },
      { n: 'Japan', v: 124, e: '🇯🇵' },
      { n: 'Philippines', v: 117, e: '🇵🇭' },
      { n: 'Egypt', v: 113, e: '🇪🇬' },
      { n: 'Vietnam', v: 98, e: '🇻🇳' },
      { n: 'Iran', v: 89, e: '🇮🇷' },
      { n: 'Turkey', v: 85, e: '🇹🇷' },
      { n: 'Germany', v: 83, e: '🇩🇪' },
      { n: 'Thailand', v: 72, e: '🇹🇭' },
      { n: 'France', v: 68, e: '🇫🇷' },
      { n: 'United Kingdom', v: 67, e: '🇬🇧' },
      { n: 'South Africa', v: 60, e: '🇿🇦' },
      { n: 'Italy', v: 59, e: '🇮🇹' },
      { n: 'South Korea', v: 52, e: '🇰🇷' },
      { n: 'Spain', v: 48, e: '🇪🇸' },
      { n: 'Canada', v: 39, e: '🇨🇦' },
      { n: 'Australia', v: 26, e: '🇦🇺' },
      { n: 'Netherlands', v: 18, e: '🇳🇱' },
      { n: 'Sweden', v: 10, e: '🇸🇪' },
      { n: 'Singapore', v: 5.9, e: '🇸🇬' },
      { n: 'Norway', v: 5.5, e: '🇳🇴' },
      { n: 'New Zealand', v: 5.2, e: '🇳🇿' },
      { n: 'Iceland', v: 0.39, e: '🇮🇸' },
    ],
  },
  {
    id: 'speed',
    label: 'Top speed',
    question: 'Which one is FASTER?',
    unit: 'km/h',
    fmt: (v) => `${v} km/h`,
    items: [
      { n: 'Peregrine falcon (diving)', v: 320, e: '🦅' },
      { n: 'Cheetah', v: 110, e: '🐆' },
      { n: 'Pronghorn antelope', v: 88, e: '🦌' },
      { n: 'Lion', v: 80, e: '🦁' },
      { n: 'Greyhound', v: 74, e: '🐕' },
      { n: 'Ostrich', v: 70, e: '🦤' },
      { n: 'Horse', v: 70, e: '🐎' },
      { n: 'Kangaroo', v: 70, e: '🦘' },
      { n: 'Grizzly bear', v: 56, e: '🐻' },
      { n: 'Rabbit', v: 56, e: '🐇' },
      { n: 'Domestic cat', v: 48, e: '🐈' },
      { n: 'Usain Bolt', v: 44, e: '🏃' },
      { n: 'Elephant', v: 40, e: '🐘' },
      { n: 'Squirrel', v: 20, e: '🐿️' },
      { n: 'Crocodile', v: 17, e: '🐊' },
      { n: 'Pig', v: 17, e: '🐖' },
      { n: 'Chicken', v: 14, e: '🐔' },
      { n: 'Tortoise', v: 0.5, e: '🐢' },
      { n: 'Sloth', v: 0.27, e: '🦥' },
      { n: 'Garden snail', v: 0.05, e: '🐌' },
    ],
  },
  {
    id: 'height',
    label: 'Height',
    question: 'Which is TALLER?',
    unit: 'm',
    fmt: (v) => `${v} m`,
    items: [
      { n: 'Burj Khalifa', v: 828, e: '🏙️' },
      { n: 'Merdeka 118', v: 679, e: '🏙️' },
      { n: 'Shanghai Tower', v: 632, e: '🏙️' },
      { n: 'Abraj Al Bait', v: 601, e: '🕌' },
      { n: 'Lotte World Tower', v: 555, e: '🏙️' },
      { n: 'One World Trade Center', v: 541, e: '🗽' },
      { n: 'Taipei 101', v: 508, e: '🏙️' },
      { n: 'Empire State Building', v: 443, e: '🏢' },
      { n: 'Eiffel Tower', v: 330, e: '🗼' },
      { n: 'Chrysler Building', v: 319, e: '🏢' },
      { n: 'Golden Gate Bridge towers', v: 227, e: '🌉' },
      { n: 'Space Needle', v: 184, e: '🗼' },
      { n: 'Great Pyramid of Giza', v: 139, e: '🔺' },
      { n: 'Big Ben', v: 96, e: '🕰️' },
      { n: 'Statue of Liberty', v: 93, e: '🗽' },
      { n: 'Leaning Tower of Pisa', v: 57, e: '🏛️' },
      { n: 'Christ the Redeemer', v: 38, e: '🙌' },
      { n: 'Giraffe', v: 5.5, e: '🦒' },
      { n: 'Basketball hoop', v: 3.05, e: '🏀' },
    ],
  },
  {
    id: 'lifespan',
    label: 'Lifespan',
    question: 'Which lives LONGER?',
    unit: 'years',
    fmt: (v) => (v < 1 ? `${Math.round(v * 365)} days` : `${v} years`),
    items: [
      { n: 'Greenland shark', v: 300, e: '🦈' },
      { n: 'Bowhead whale', v: 200, e: '🐋' },
      { n: 'Galápagos tortoise', v: 150, e: '🐢' },
      { n: 'Blue whale', v: 90, e: '🐳' },
      { n: 'Human', v: 73, e: '🧑' },
      { n: 'Elephant', v: 65, e: '🐘' },
      { n: 'Macaw', v: 60, e: '🦜' },
      { n: 'Chimpanzee', v: 40, e: '🐒' },
      { n: 'Horse', v: 30, e: '🐎' },
      { n: 'Domestic cat', v: 15, e: '🐈' },
      { n: 'Dog', v: 12, e: '🐕' },
      { n: 'Rabbit', v: 9, e: '🐇' },
      { n: 'Squirrel', v: 6, e: '🐿️' },
      { n: 'Mouse', v: 2, e: '🐁' },
      { n: 'Housefly', v: 0.08, e: '🪰' },
      { n: 'Mayfly (adult)', v: 0.003, e: '🦟' },
    ],
  },
  {
    id: 'year',
    label: 'Release year',
    question: 'Which came out LATER?',
    unit: 'year',
    fmt: (v) => `${v}`,
    items: [
      { n: 'Snow White and the Seven Dwarfs', v: 1937, e: '🍎' },
      { n: 'The Wizard of Oz', v: 1939, e: '🌪️' },
      { n: 'Psycho', v: 1960, e: '🔪' },
      { n: 'The Godfather', v: 1972, e: '🎩' },
      { n: 'Jaws', v: 1975, e: '🦈' },
      { n: 'Star Wars', v: 1977, e: '⭐' },
      { n: 'E.T. the Extra-Terrestrial', v: 1982, e: '🚲' },
      { n: 'Back to the Future', v: 1985, e: '🚗' },
      { n: 'Home Alone', v: 1990, e: '🏠' },
      { n: 'Jurassic Park', v: 1993, e: '🦖' },
      { n: 'The Lion King', v: 1994, e: '🦁' },
      { n: 'Forrest Gump', v: 1994, e: '🍫' },
      { n: 'Toy Story', v: 1995, e: '🤠' },
      { n: 'Titanic', v: 1997, e: '🚢' },
      { n: 'The Matrix', v: 1999, e: '💊' },
      { n: 'Gladiator', v: 2000, e: '⚔️' },
      { n: 'Shrek', v: 2001, e: '🧅' },
      { n: 'Finding Nemo', v: 2003, e: '🐠' },
      { n: 'Avatar', v: 2009, e: '💙' },
      { n: 'Inception', v: 2010, e: '🌀' },
      { n: 'The Avengers', v: 2012, e: '🦸' },
      { n: 'Frozen', v: 2013, e: '❄️' },
      { n: 'Parasite', v: 2019, e: '🏠' },
      { n: 'Barbie', v: 2023, e: '💗' },
    ],
  },
];

/* "Later year" reads naturally as higher, so no special-casing is needed —
   every category is simply "which value is bigger". */

/* ------------------------- generated bank (Wikidata) ----------------------
   scripts/generate-hl-bank.js pulls ~500 well-known items per category from
   Wikidata (CC0) and writes hlBank.generated.json. Re-running it refreshes the
   content without touching any code, so the game never runs dry: 500 items is
   ~125,000 distinct matchups per category.

   JSON can't hold functions, so each generated category carries a `fmtKind`
   string that we map back to a formatter here (see the import at the top). */

const FMT_BY_KIND = {
  millions: (v) => (v >= 1 ? `${v} million` : `${Math.round(v * 1000)},000`),
  meters: (v) => `${v} m`,
  km: (v) => `${v} km`,
  year: (v) => `${v}`,
  kmh: (v) => `${v} km/h`,
  years: (v) => (v < 1 ? `${Math.round(v * 365)} days` : `${v} years`),
};

const GENERATED = (generated?.categories || []).map((c) => ({
  ...c,
  // Years are an interval scale — see isFairPair above.
  gapKind: c.fmtKind === 'year' ? 'absolute' : 'ratio',
  minGap: c.fmtKind === 'year' ? MIN_GAP_YEARS : undefined,
  fmt: FMT_BY_KIND[c.fmtKind] || ((v) => `${v} ${c.unit}`),
  // Generated items have no per-item icon, and repeating one category glyph on
  // BOTH cards adds no information while eating scarce vertical space on a
  // phone — which pushed the Higher/Lower buttons below the fold. So they stay
  // icon-less; only the curated banks (which have a distinct icon per item)
  // show one.
  items: c.items,
}));

const GENERATED_IDS = new Set(GENERATED.map((c) => c.id));

/* Generated categories first (they are far richer), then any curated category
   the generator does not cover. If the JSON is ever missing or empty the
   curated bank alone still makes a complete, playable game. */
export const CATEGORIES = [
  ...GENERATED,
  ...CURATED.filter((c) => !GENERATED_IDS.has(c.id)),
];

export const CAT_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

/** Encouragement shown on the game-over screen, keyed by streak reached. */
export function rankFor(score) {
  if (score >= 25) return { label: 'Herd Legend', e: '👑' };
  if (score >= 15) return { label: 'Sharp Shooter', e: '🎯' };
  if (score >= 10) return { label: 'Solid Guesser', e: '💪' };
  if (score >= 5) return { label: 'Getting Warm', e: '🔥' };
  if (score >= 2) return { label: 'Just Warming Up', e: '🌱' };
  return { label: 'Rough Start', e: '🎲' };
}
