/*
  Verbal Memory Test — solo, endless.

  Category: memory (verbal, recognition). Procedural in the sense that the
  sequence is generated at runtime from a fixed bank; the only content is the
  word list itself, which never needs topping up because the test is about
  whether you have seen a word THIS RUN, not about the words themselves.

  Deliberately content words (concrete nouns, adjectives, verbs) rather than
  the function words used by the typing test: "the" and "of" are impossible to
  form a memory of, so a bank like that would make the test pure noise.

  Aesthetic: warm farm palette, deep-teal accent. No dark mode.
*/

export const THEME = {
  bg: '#FFF8E7',
  bgAlt: '#FFFFFF',
  border: '#FFE8C8',
  ink: '#2D1810',
  mut: '#6B5B4A',
  teal: '#0F6E7A',
  green: '#3D8B5A',
  red: '#D0463B',
};

export const FREDOKA = { fontFamily: "'Fredoka', system-ui, sans-serif" };
export const QUICKSAND = { fontFamily: "'Quicksand', system-ui, sans-serif" };

export const LIVES = 3;

/*
  Chance of re-showing a word already seen, once there are enough to draw from.
  Around half keeps the test honest: much lower and "NEW" is almost always
  right, much higher and "SEEN" is. Either way a player could score forever by
  mashing one button, which is the failure mode to design out.
*/
export const SEEN_CHANCE = 0.45;
export const MIN_POOL = 3;   // seen words needed before repeats can appear

const WORDS = [
  'anchor', 'apple', 'arrow', 'autumn', 'bacon', 'badger', 'balloon', 'bamboo',
  'banjo', 'basket', 'battery', 'beacon', 'beetle', 'bicycle', 'biscuit', 'blanket',
  'blossom', 'bottle', 'boulder', 'bracket', 'branch', 'bridge', 'bubble', 'bucket',
  'butter', 'button', 'cabbage', 'cactus', 'camera', 'candle', 'canyon', 'captain',
  'carpet', 'carrot', 'castle', 'cavern', 'ceiling', 'cellar', 'chimney', 'chisel',
  'cinema', 'circus', 'cliff', 'clover', 'cobweb', 'compass', 'copper', 'cottage',
  'cracker', 'crayon', 'creature', 'crimson', 'crystal', 'cupboard', 'curtain',
  'cushion', 'dagger', 'dairy', 'dandelion', 'desert', 'diamond', 'dolphin',
  'donkey', 'dragon', 'drawer', 'drizzle', 'eagle', 'elbow', 'engine', 'envelope',
  'fabric', 'falcon', 'feather', 'ferry', 'fiddle', 'fireplace', 'flannel',
  'flute', 'forest', 'fossil', 'fountain', 'freckle', 'frost', 'funnel', 'gallery',
  'garden', 'garlic', 'gazelle', 'ginger', 'glacier', 'glimmer', 'granite',
  'gravel', 'guitar', 'hammer', 'hamster', 'harbour', 'harvest', 'hazel', 'hedge',
  'helmet', 'hollow', 'honey', 'hurricane', 'iceberg', 'island', 'ivory', 'jacket',
  'jelly', 'jigsaw', 'journey', 'jungle', 'kettle', 'kitten', 'ladder', 'lantern',
  'lattice', 'lavender', 'leather', 'lemon', 'library', 'lighthouse', 'lilac',
  'linen', 'lizard', 'lobster', 'locket', 'lumber', 'magnet', 'mallet', 'mammoth',
  'mansion', 'maple', 'marble', 'marigold', 'market', 'meadow', 'melon', 'mermaid',
  'meteor', 'mitten', 'monkey', 'mosaic', 'moss', 'mountain', 'muffin', 'mushroom',
  'mustard', 'nectar', 'needle', 'nettle', 'noodle', 'nutmeg', 'oasis', 'olive',
  'onion', 'orchard', 'otter', 'oyster', 'paddle', 'palace', 'pancake', 'panther',
  'parcel', 'parrot', 'pasture', 'peach', 'peacock', 'pebble', 'pelican', 'pepper',
  'pewter', 'pickle', 'picnic', 'pigeon', 'pillow', 'pirate', 'pistol', 'planet',
  'plaster', 'plum', 'pocket', 'pollen', 'pony', 'poppy', 'porridge', 'postcard',
  'pottery', 'prairie', 'pretzel', 'pudding', 'puddle', 'pumpkin', 'puppet',
  'quarry', 'quilt', 'rabbit', 'radish', 'rafter', 'rainbow', 'raven', 'ribbon',
  'ripple', 'river', 'rocket', 'rooster', 'rubble', 'saddle', 'salmon', 'sandal',
  'sapphire', 'satchel', 'sausage', 'scarlet', 'seagull', 'seashell', 'shadow',
  'shovel', 'shutter', 'silver', 'skillet', 'sleigh', 'slipper', 'smoke', 'snail',
  'sparrow', 'spider', 'spindle', 'sponge', 'squirrel', 'stable', 'stallion',
  'steeple', 'stirrup', 'stocking', 'stream', 'sugar', 'sunset', 'swallow',
  'sweater', 'syrup', 'tadpole', 'tangerine', 'teapot', 'temple', 'thicket',
  'thimble', 'thistle', 'thunder', 'timber', 'toffee', 'tomato', 'torch',
  'tortoise', 'towel', 'tractor', 'trellis', 'trumpet', 'tulip', 'tunnel',
  'turnip', 'turtle', 'umbrella', 'valley', 'velvet', 'village', 'vinegar',
  'violet', 'vulture', 'waffle', 'walnut', 'walrus', 'whisker', 'whistle',
  'willow', 'window', 'winter', 'wizard', 'wombat', 'wooden', 'yoghurt', 'zebra',
];

export const WORD_COUNT = WORDS.length;

/**
 * Pick the next word.
 * Returns { word, isSeen } where isSeen is the TRUTH the player must guess.
 * `seen` is an array of words already shown this run.
 */
export function nextWord(seen, rand = Math.random) {
  const unseen = WORDS.filter((w) => !seen.includes(w));

  // Once the bank is exhausted there is nothing new left to show, so every
  // remaining word must be a repeat — otherwise this would loop forever
  // looking for an unseen word that does not exist.
  if (!unseen.length) {
    return { word: seen[Math.floor(rand() * seen.length)], isSeen: true };
  }

  const canRepeat = seen.length >= MIN_POOL;
  if (canRepeat && rand() < SEEN_CHANCE) {
    return { word: seen[Math.floor(rand() * seen.length)], isSeen: true };
  }
  return { word: unseen[Math.floor(rand() * unseen.length)], isSeen: false };
}

export function rankFor(score) {
  if (score >= 100) return { label: 'Extraordinary', blurb: 'Very few people get near three figures.' };
  if (score >= 70) return { label: 'Remarkable', blurb: 'Well past where most runs end.' };
  if (score >= 50) return { label: 'Sharp', blurb: 'Comfortably above average.' };
  if (score >= 30) return { label: 'Above Average', blurb: 'Better than the typical run.' };
  if (score >= 15) return { label: 'Typical', blurb: 'Right about where most people land.' };
  return { label: 'Warming Up', blurb: 'It gets much harder once the list grows.' };
}
