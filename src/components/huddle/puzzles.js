/*
  Huddle — a daily "group 16 words into 4 sets of 4" puzzle (Connections-style).

  Client-only: the puzzle bank ships in the bundle and the daily puzzle is chosen
  deterministically by day number, so there's no backend, no DB load, and the page
  is fully prerenderable. Streaks live in localStorage (see share.js).

  Each puzzle = 4 groups. level 0 = easiest (yellow) … 3 = trickiest (purple).
  Words are deliberately chosen so some belong to more than one theme — the trap
  is the fun. Every word must appear exactly once per puzzle.
*/

export const LEVELS = [
  { key: 0, color: '#E9B949', label: 'Straightforward' },
  { key: 1, color: '#3D8B5A', label: 'Medium' },
  { key: 2, color: '#4A90D9', label: 'Tricky' },
  { key: 3, color: '#7C4DFF', label: 'Devious' },
];

export const colorForLevel = (lvl) => (LEVELS.find((l) => l.key === lvl) || LEVELS[0]).color;
export const emojiForLevel = (lvl) => ['🟨', '🟩', '🟦', '🟪'][lvl] || '⬜';

// ── The puzzle bank ──────────────────────────────────────────────────────────
export const PUZZLES = [
  {
    groups: [
      { level: 0, name: 'Types of bear', words: ['BLACK', 'BROWN', 'POLAR', 'SUN'] },
      { level: 1, name: '___ berry', words: ['STRAW', 'BLUE', 'RASP', 'GOOSE'] },
      { level: 2, name: 'Card games', words: ['HEARTS', 'POKER', 'RUMMY', 'SOLITAIRE'] },
      { level: 3, name: 'London landmarks', words: ['EYE', 'SHARD', 'GHERKIN', 'BRIDGE'] },
    ],
  },
  {
    groups: [
      { level: 0, name: 'Citrus fruits', words: ['LEMON', 'LIME', 'ORANGE', 'POMELO'] },
      { level: 1, name: 'Shades of blue', words: ['NAVY', 'TEAL', 'SKY', 'COBALT'] },
      { level: 2, name: 'Apple products', words: ['MAC', 'WATCH', 'PENCIL', 'TV'] },
      { level: 3, name: '___ band', words: ['RUBBER', 'WRIST', 'HEAD', 'BOY'] },
    ],
  },
  {
    groups: [
      { level: 0, name: 'Planets', words: ['MARS', 'VENUS', 'SATURN', 'MERCURY'] },
      { level: 1, name: 'Chocolate bars', words: ['TWIX', 'BOUNTY', 'FLAKE', 'AERO'] },
      { level: 2, name: 'Roman gods', words: ['JUNO', 'NEPTUNE', 'PLUTO', 'APOLLO'] },
      { level: 3, name: 'Car brands', words: ['JAGUAR', 'TESLA', 'VIPER', 'COBRA'] },
    ],
  },
  {
    groups: [
      { level: 0, name: 'Dog breeds', words: ['BOXER', 'POODLE', 'BEAGLE', 'PUG'] },
      { level: 1, name: 'Boxing terms', words: ['JAB', 'HOOK', 'BELL', 'ROUND'] },
      { level: 2, name: 'Captain ___', words: ['AMERICA', 'MORGAN', 'MARVEL', 'CRUNCH'] },
      { level: 3, name: 'Peter Pan', words: ['WENDY', 'TINK', 'SMEE', 'NANA'] },
    ],
  },
  {
    groups: [
      { level: 0, name: 'Breakfast foods', words: ['TOAST', 'EGGS', 'BACON', 'CEREAL'] },
      { level: 1, name: 'Public speaking', words: ['ADDRESS', 'PITCH', 'SPEECH', 'SERMON'] },
      { level: 2, name: 'Coffee orders', words: ['LATTE', 'MOCHA', 'FLAT', 'AMERICANO'] },
      { level: 3, name: 'Cooking methods', words: ['ROAST', 'GRILL', 'STEAM', 'BOIL'] },
    ],
  },
  {
    groups: [
      { level: 0, name: 'Board games', words: ['CLUE', 'RISK', 'SORRY', 'LIFE'] },
      { level: 1, name: 'Apology words', words: ['PARDON', 'OOPS', 'FORGIVE', 'APOLOGY'] },
      { level: 2, name: 'Detective needs', words: ['MOTIVE', 'ALIBI', 'SUSPECT', 'WITNESS'] },
      { level: 3, name: 'Board ___', words: ['ROOM', 'WALK', 'GAME', 'MEMBER'] },
    ],
  },
  {
    groups: [
      { level: 0, name: 'Pizza toppings', words: ['CHEESE', 'OLIVE', 'HAM', 'PEPPER'] },
      { level: 1, name: '___ oil', words: ['PALM', 'CRUDE', 'BABY', 'MOTOR'] },
      { level: 2, name: 'Parts of the hand', words: ['THUMB', 'KNUCKLE', 'WRIST', 'NAIL'] },
      { level: 3, name: 'Salad ingredients', words: ['LETTUCE', 'TOMATO', 'CUCUMBER', 'CROUTON'] },
    ],
  },
  {
    groups: [
      { level: 0, name: 'Ocean animals', words: ['WHALE', 'SHARK', 'CRAB', 'SEAL'] },
      { level: 1, name: 'Close tightly', words: ['SHUT', 'LOCK', 'CLAMP', 'FASTEN'] },
      { level: 2, name: 'Poker actions', words: ['CALL', 'RAISE', 'FOLD', 'BLUFF'] },
      { level: 3, name: 'Laundry steps', words: ['WASH', 'DRY', 'SORT', 'IRON'] },
    ],
  },
  {
    groups: [
      { level: 0, name: 'Musical instruments', words: ['DRUM', 'FLUTE', 'CELLO', 'HARP'] },
      { level: 1, name: 'Champagne glass', words: ['COUPE', 'TULIP', 'BUBBLE', 'SAUCER'] },
      { level: 2, name: '___ roll', words: ['ROCK', 'BARREL', 'EGG', 'BREAD'] },
      { level: 3, name: 'Nag repeatedly', words: ['BADGER', 'HOUND', 'NEEDLE', 'PESTER'] },
    ],
  },
  {
    groups: [
      { level: 0, name: 'Days off', words: ['SUNDAY', 'HOLIDAY', 'WEEKEND', 'BREAK'] },
      { level: 1, name: 'Dance styles', words: ['SALSA', 'TANGO', 'WALTZ', 'SWING'] },
      { level: 2, name: 'Dips', words: ['HUMMUS', 'GUAC', 'QUESO', 'RANCH'] },
      { level: 3, name: 'Playground gear', words: ['SLIDE', 'SEESAW', 'BARS', 'ROUNDABOUT'] },
    ],
  },
  {
    groups: [
      { level: 0, name: 'Shapes', words: ['CIRCLE', 'OVAL', 'TRIANGLE', 'DIAMOND'] },
      { level: 1, name: 'Old-fashioned person', words: ['FOGEY', 'PRUDE', 'STIFF', 'SQUARE'] },
      { level: 2, name: 'Celebrity', words: ['ICON', 'IDOL', 'CELEB', 'STAR'] },
      { level: 3, name: 'Times ___', words: ['TABLE', 'UP', 'OUT', 'ZONE'] },
    ],
  },
  {
    groups: [
      { level: 0, name: 'Fast animals', words: ['CHEETAH', 'FALCON', 'HARE', 'HORSE'] },
      { level: 1, name: 'Snakes', words: ['VIPER', 'COBRA', 'PYTHON', 'MAMBA'] },
      { level: 2, name: 'Programming languages', words: ['RUBY', 'SWIFT', 'GO', 'RUST'] },
      { level: 3, name: 'Car models', words: ['MUSTANG', 'STINGRAY', 'CHARGER', 'BEETLE'] },
    ],
  },
  {
    groups: [
      { level: 0, name: 'Kitchen appliances', words: ['OVEN', 'KETTLE', 'TOASTER', 'BLENDER'] },
      { level: 1, name: 'Hot-tempered', words: ['FIERY', 'SHORT', 'TESTY', 'SNAPPY'] },
      { level: 2, name: 'Bell ___', words: ['BOY', 'HOP', 'PEPPER', 'TOWER'] },
      { level: 3, name: 'Mix smoothly', words: ['PUREE', 'WHISK', 'FOLD', 'CREAM'] },
    ],
  },
  {
    groups: [
      { level: 0, name: 'Things with keys', words: ['PIANO', 'LOCK', 'KEYBOARD', 'MAP'] },
      { level: 1, name: 'Body of water', words: ['SEA', 'BAY', 'GULF', 'SOUND'] },
      { level: 2, name: 'Treasure ___', words: ['CHEST', 'HUNT', 'ISLAND', 'TROVE'] },
      { level: 3, name: 'Make sense', words: ['ADD', 'CLICK', 'FOLLOW', 'REGISTER'] },
    ],
  },
  {
    groups: [
      { level: 0, name: 'Salad greens', words: ['KALE', 'SPINACH', 'ROCKET', 'CRESS'] },
      { level: 1, name: 'Goes up fast', words: ['SOAR', 'SPIKE', 'SURGE', 'CLIMB'] },
      { level: 2, name: 'Tennis gear / terms', words: ['ACE', 'NET', 'SERVE', 'RACKET'] },
      { level: 3, name: 'Noisy commotion', words: ['DIN', 'CLAMOUR', 'UPROAR', 'FRACAS'] },
    ],
  },
  {
    groups: [
      { level: 0, name: 'Weather', words: ['RAIN', 'SNOW', 'WIND', 'HAIL'] },
      { level: 1, name: 'Greet / summon', words: ['WAVE', 'CALL', 'FLAG', 'SUMMON'] },
      { level: 2, name: 'Ocean movements', words: ['TIDE', 'CURRENT', 'SWELL', 'SURF'] },
      { level: 3, name: 'Detergent brands', words: ['PERSIL', 'BOLD', 'ARIEL', 'DAZ'] },
    ],
  },
];

// ── Daily selection (deterministic) ──────────────────────────────────────────
const EPOCH = Date.UTC(2026, 5, 1); // 2026-06-01 = day 1 (month is 0-indexed)

export function getDayNumber(now = new Date()) {
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.floor((todayUTC - EPOCH) / 86400000) + 1;
}

export const puzzleCount = () => PUZZLES.length;

// Index into the bank for a given day (cycles once the bank is exhausted).
export function puzzleIndexForDay(dayNumber) {
  const n = PUZZLES.length;
  return (((dayNumber - 1) % n) + n) % n;
}

export function getPuzzleForDay(dayNumber) {
  return PUZZLES[puzzleIndexForDay(dayNumber)];
}

// ── Seeded shuffle (mulberry32) so the tile order is stable per day ───────────
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Flatten a puzzle's 16 words and shuffle deterministically by seed.
export function buildTiles(puzzle, seed) {
  const tiles = [];
  puzzle.groups.forEach((g, gi) => g.words.forEach((w) => tiles.push({ word: w, group: gi, level: g.level })));
  const rand = mulberry32(seed);
  for (let i = tiles.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
  }
  return tiles;
}
