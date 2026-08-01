/*
  Word Scramble — solo, endless.

  Category: word puzzle / high-replay. The word list is embedded (a few hundred
  common English nouns), but the PUZZLE is generated: the letters are shuffled
  fresh every time, so the same word is a different puzzle on a different run
  and the list never really "runs out" the way a bank of fixed puzzles would.

  Words are deliberately common and concrete. An obscure word is not a harder
  puzzle, it is just an unfair one.

  Aesthetic: warm farm palette with a rust accent. No dark mode.
*/

export const THEME = {
  bg: '#FFF8E7',
  bgAlt: '#FFFFFF',
  border: '#FFE8C8',
  ink: '#2D1810',
  mut: '#6B5B4A',
  rust: '#B5533A',
  green: '#3D8B5A',
  red: '#D0463B',
};

export const FREDOKA = { fontFamily: "'Fredoka', system-ui, sans-serif" };
export const QUICKSAND = { fontFamily: "'Quicksand', system-ui, sans-serif" };

export const LIVES = 3;

/* Grouped by length so difficulty can ramp: short words first, longer later. */
export const WORDS = {
  4: ['FARM', 'GOAT', 'MILK', 'BARN', 'CORN', 'DUCK', 'GATE', 'HERD', 'LAMB', 'NEST', 'PATH', 'POND', 'RAIN', 'ROPE', 'SEED', 'WOOL', 'YARD', 'BOOT', 'CAKE', 'DESK', 'FISH', 'GOLD', 'HAND', 'KING', 'LAMP', 'MOON', 'NOSE', 'PARK', 'RING', 'SHIP', 'STAR', 'TREE', 'WIND', 'BOAT', 'DOOR', 'FIRE'],
  5: ['HORSE', 'SHEEP', 'FENCE', 'GRASS', 'STRAW', 'WHEAT', 'APPLE', 'BREAD', 'CHAIR', 'CLOUD', 'DREAM', 'EARTH', 'FLAME', 'GHOST', 'HEART', 'HOUSE', 'JUICE', 'KNIFE', 'LIGHT', 'MONEY', 'MUSIC', 'NIGHT', 'OCEAN', 'PAPER', 'PIANO', 'RIVER', 'SMILE', 'SNAKE', 'STONE', 'TABLE', 'TIGER', 'TRAIN', 'WATER', 'WHEEL'],
  6: ['CATTLE', 'DONKEY', 'FARMER', 'PLOUGH', 'CHEESE', 'MEADOW', 'STABLE', 'TURNIP', 'BASKET', 'BOTTLE', 'BRIDGE', 'CANDLE', 'CASTLE', 'CIRCLE', 'DESERT', 'FLOWER', 'FOREST', 'GARDEN', 'GUITAR', 'ISLAND', 'JUNGLE', 'MARKET', 'MIRROR', 'ORANGE', 'PENCIL', 'PLANET', 'POCKET', 'RABBIT', 'SILVER', 'SPRING', 'SUMMER', 'TUNNEL', 'WINDOW', 'WINTER', 'YELLOW'],
  7: ['CHICKEN', 'PASTURE', 'TRACTOR', 'VILLAGE', 'HARVEST', 'BLANKET', 'CABBAGE', 'CAPTAIN', 'CEILING', 'COMPASS', 'CRYSTAL', 'DIAMOND', 'FACTORY', 'GIRAFFE', 'HARBOUR', 'JOURNEY', 'KITCHEN', 'LANTERN', 'MACHINE', 'MUSTARD', 'PANTHER', 'PICTURE', 'PUMPKIN', 'RAINBOW', 'STATION', 'THUNDER', 'WHISTLE'],
};

export const LENGTHS = [4, 5, 6, 7];

/** Word length ramps with the streak, so early rounds are gentle. */
export function lengthForScore(score) {
  if (score < 4) return 4;
  if (score < 9) return 5;
  if (score < 15) return 6;
  return 7;
}

export function rankFor(score) {
  if (score >= 20) return { label: 'Wordsmith', blurb: 'That is a serious run.' };
  if (score >= 14) return { label: 'Very Sharp', blurb: 'Well above average.' };
  if (score >= 9) return { label: 'Quick Eye', blurb: 'Comfortably good.' };
  if (score >= 5) return { label: 'Solid', blurb: 'Right about where most people land.' };
  if (score >= 2) return { label: 'Warming Up', blurb: 'The letters start jumping out after a few.' };
  return { label: 'Tangled', blurb: 'They do get easier.' };
}

const shuffleArr = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Scramble a word. Guarantees the result is NOT the original — otherwise the
 * puzzle occasionally shows the answer, which reads as a bug.
 */
export function scramble(word) {
  const letters = word.split('');
  if (new Set(letters).size === 1) return letters;   // unscrambleable, e.g. "AAAA"
  for (let i = 0; i < 30; i++) {
    const out = shuffleArr(letters);
    if (out.join('') !== word) return out;
  }
  // Deterministic fallback: rotate by one.
  return [...letters.slice(1), letters[0]];
}

/** Build a round for the given streak. */
export function buildRound(score, recent = []) {
  const len = lengthForScore(score);
  const pool = WORDS[len].filter((w) => !recent.includes(w));
  const list = pool.length ? pool : WORDS[len];
  const word = list[Math.floor(Math.random() * list.length)];
  return { word, letters: scramble(word), length: len };
}
