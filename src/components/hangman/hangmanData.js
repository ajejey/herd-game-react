/*
  Hangman — solo, endless.

  Category: word. The word list is embedded but the puzzle is generated: a
  random word from a random category, so it never needs topping up.

  Words carry a CATEGORY, which is shown as a hint. Hangman without one is a
  guessing game about letter frequency; with one it is a word game. Every word
  is common and concrete for the same reason the scramble list is — an obscure
  word is not a harder puzzle, just an unfair one.

  Aesthetic: warm farm palette, forest-green accent. No dark mode.
*/

export const THEME = {
  bg: '#FFF8E7',
  bgAlt: '#FFFFFF',
  border: '#FFE8C8',
  ink: '#2D1810',
  mut: '#6B5B4A',
  forest: '#2F6B4F',
  green: '#3D8B5A',
  red: '#D0463B',
};

export const FREDOKA = { fontFamily: "'Fredoka', system-ui, sans-serif" };
export const QUICKSAND = { fontFamily: "'Quicksand', system-ui, sans-serif" };

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

/* Six wrong guesses is the traditional figure — head, body, two arms, two legs. */
export const MAX_WRONG = 6;

/*
  Categories. Every word is A-Z only: no spaces, hyphens or accents, because
  the keyboard only offers A-Z and a word containing anything else could never
  be completed.
*/
export const CATEGORIES = [
  {
    name: 'Animals',
    words: ['ELEPHANT', 'GIRAFFE', 'PENGUIN', 'DOLPHIN', 'SQUIRREL', 'TORTOISE', 'HEDGEHOG',
      'KANGAROO', 'BUTTERFLY', 'CROCODILE', 'FLAMINGO', 'OCTOPUS', 'RACCOON', 'BADGER',
      'OTTER', 'PANDA', 'WALRUS', 'LEOPARD', 'BEAVER', 'MONKEY', 'RABBIT', 'DONKEY',
      'CHICKEN', 'SPIDER', 'TIGER'],
  },
  {
    name: 'Food',
    words: ['SPAGHETTI', 'PANCAKE', 'CHOCOLATE', 'SANDWICH', 'PORRIDGE', 'BROCCOLI',
      'STRAWBERRY', 'PINEAPPLE', 'AVOCADO', 'LASAGNE', 'OMELETTE', 'CUCUMBER', 'PUMPKIN',
      'BISCUIT', 'MUSHROOM', 'YOGHURT', 'NOODLES', 'CABBAGE', 'PEPPER', 'HONEY',
      'CHEESE', 'BANANA', 'WAFFLE', 'CUSTARD', 'MUFFIN'],
  },
  {
    name: 'Countries',
    words: ['PORTUGAL', 'THAILAND', 'MOROCCO', 'ARGENTINA', 'DENMARK', 'ETHIOPIA',
      'MALAYSIA', 'COLOMBIA', 'HUNGARY', 'PAKISTAN', 'AUSTRIA', 'NIGERIA', 'ICELAND',
      'VIETNAM', 'BELGIUM', 'JAMAICA', 'SWEDEN', 'CANADA', 'BRAZIL', 'GREECE',
      'NORWAY', 'POLAND', 'TURKEY', 'EGYPT', 'KENYA'],
  },
  {
    name: 'Around the house',
    words: ['CUPBOARD', 'MATTRESS', 'CURTAIN', 'RADIATOR', 'BLANKET', 'TOASTER',
      'CUSHION', 'WARDROBE', 'KETTLE', 'MIRROR', 'DRAWER', 'CARPET', 'PILLOW',
      'LADDER', 'BUCKET', 'CANDLE', 'SHELF', 'TOWEL', 'CHAIR', 'CLOCK',
      'LAMP', 'SOFA', 'DOORBELL', 'FRIDGE', 'WINDOW'],
  },
  {
    name: 'Nature',
    words: ['MOUNTAIN', 'WATERFALL', 'RAINBOW', 'THUNDER', 'GLACIER', 'MEADOW',
      'BLOSSOM', 'HARVEST', 'VOLCANO', 'DESERT', 'FOREST', 'ISLAND', 'CANYON',
      'STREAM', 'PEBBLE', 'BOULDER', 'SUNSET', 'BREEZE', 'FROST', 'CLOUD',
      'RIVER', 'VALLEY', 'THISTLE', 'ACORN', 'WILLOW'],
  },
  {
    name: 'Sports',
    words: ['BASKETBALL', 'BADMINTON', 'SWIMMING', 'CRICKET', 'ATHLETICS', 'ROWING',
      'CYCLING', 'SNOOKER', 'NETBALL', 'HOCKEY', 'BOXING', 'TENNIS', 'RUGBY',
      'SKIING', 'DIVING', 'FENCING', 'JUDO', 'GOLF', 'SURFING', 'CLIMBING',
      'SAILING', 'ARCHERY', 'CURLING', 'SKATING', 'MARATHON'],
  },
];

export const WORD_COUNT = CATEGORIES.reduce((n, c) => n + c.words.length, 0);

/** A random word plus the category it came from. */
export function dealWord() {
  const cat = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
  const word = cat.words[Math.floor(Math.random() * cat.words.length)];
  return { word, category: cat.name };
}

/** The word with unguessed letters masked. */
export function maskWord(word, guessed) {
  return word.split('').map((ch) => (guessed.includes(ch) ? ch : null));
}

/** True once every distinct letter of the word has been guessed. */
export function isSolved(word, guessed) {
  return word.split('').every((ch) => guessed.includes(ch));
}

export function rankFor(streak) {
  if (streak >= 15) return { label: 'Extraordinary', blurb: 'Fifteen in a row is a serious run.' };
  if (streak >= 10) return { label: 'Remarkable', blurb: 'Double figures is rare.' };
  if (streak >= 6) return { label: 'Sharp', blurb: 'Well past the usual run.' };
  if (streak >= 3) return { label: 'Solid', blurb: 'A good streak going.' };
  if (streak >= 1) return { label: 'Warming Up', blurb: 'Start with the vowels — it really does help.' };
  return { label: 'Unlucky', blurb: 'The category is the biggest clue you get.' };
}
