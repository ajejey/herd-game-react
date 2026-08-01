/*
  Odd One Out — solo, endless.

  Category: puzzle / high-replay. Content is combinatorial rather than a fixed
  bank: a round is 3 members of one group plus 1 member of another, so N groups
  of M items give an enormous number of distinct rounds without writing a single
  puzzle by hand. The groups below yield well over a million possible rounds.

  Aesthetic: warm farm palette, teal accent (distinct from the pink of Higher or
  Lower, the amber of Guess the Year and the green of Herd Memory). No dark mode.
*/

export const THEME = {
  bg: '#FFF8E7',
  bgAlt: '#FFFFFF',
  border: '#FFE8C8',
  ink: '#2D1810',
  mut: '#6B5B4A',
  teal: '#1F7A8C',
  green: '#3D8B5A',
  red: '#D0463B',
};

export const FREDOKA = { fontFamily: "'Fredoka', system-ui, sans-serif" };
export const QUICKSAND = { fontFamily: "'Quicksand', system-ui, sans-serif" };

export const LIVES = 3;
export const CHOICES = 4;

/*
  Groups must be UNAMBIGUOUS: no item may plausibly belong to another group, or
  a round becomes unfair. That is why there is no "yellow things" group next to
  "fruits" (a banana is both), and why instruments are split from the things
  that merely make noise.
*/
export const GROUPS = [
  { id: 'fruit',      label: 'fruits',                items: ['Apple', 'Banana', 'Mango', 'Peach', 'Cherry', 'Grape', 'Pineapple', 'Strawberry', 'Watermelon', 'Pear', 'Plum', 'Apricot'] },
  { id: 'vegetable',  label: 'vegetables',            items: ['Carrot', 'Broccoli', 'Spinach', 'Cabbage', 'Onion', 'Turnip', 'Celery', 'Leek', 'Cauliflower', 'Parsnip'] },
  { id: 'bigcat',     label: 'big cats',              items: ['Lion', 'Tiger', 'Leopard', 'Jaguar', 'Cheetah', 'Cougar', 'Lynx', 'Panther'] },
  { id: 'bird',       label: 'birds',                 items: ['Sparrow', 'Eagle', 'Penguin', 'Owl', 'Falcon', 'Robin', 'Pelican', 'Flamingo', 'Ostrich', 'Swan'] },
  { id: 'fish',       label: 'fish',                  items: ['Salmon', 'Tuna', 'Trout', 'Cod', 'Herring', 'Mackerel', 'Sardine', 'Haddock'] },
  { id: 'insect',     label: 'insects',               items: ['Ant', 'Beetle', 'Wasp', 'Moth', 'Dragonfly', 'Grasshopper', 'Termite', 'Ladybird'] },
  { id: 'instrument', label: 'musical instruments',   items: ['Violin', 'Trumpet', 'Cello', 'Flute', 'Harp', 'Clarinet', 'Trombone', 'Oboe', 'Banjo', 'Accordion'] },
  { id: 'planet',     label: 'planets',               items: ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'] },
  { id: 'country',    label: 'countries',             items: ['Brazil', 'Norway', 'Kenya', 'Vietnam', 'Portugal', 'Peru', 'Nepal', 'Morocco', 'Hungary', 'Chile'] },
  { id: 'capital',    label: 'capital cities',        items: ['Nairobi', 'Lisbon', 'Hanoi', 'Oslo', 'Lima', 'Kathmandu', 'Budapest', 'Ottawa', 'Canberra', 'Helsinki'] },
  { id: 'metal',      label: 'metals',                items: ['Copper', 'Iron', 'Zinc', 'Nickel', 'Aluminium', 'Titanium', 'Lead', 'Tin', 'Silver', 'Platinum'] },
  { id: 'sport',      label: 'sports',                items: ['Tennis', 'Rugby', 'Hockey', 'Cricket', 'Badminton', 'Rowing', 'Archery', 'Fencing', 'Judo', 'Netball'] },
  { id: 'shape',      label: 'shapes',                items: ['Triangle', 'Hexagon', 'Pentagon', 'Rhombus', 'Trapezium', 'Octagon', 'Cylinder', 'Sphere'] },
  { id: 'weather',    label: 'weather',               items: ['Thunder', 'Drizzle', 'Blizzard', 'Hailstorm', 'Fog', 'Monsoon', 'Sleet', 'Tornado'] },
  { id: 'furniture',  label: 'furniture',             items: ['Wardrobe', 'Bookshelf', 'Armchair', 'Dresser', 'Stool', 'Bunk bed', 'Sideboard', 'Coffee table'] },
  { id: 'tree',       label: 'trees',                 items: ['Oak', 'Birch', 'Willow', 'Maple', 'Cedar', 'Redwood', 'Sycamore', 'Poplar', 'Beech'] },
  { id: 'tool',       label: 'tools',                 items: ['Hammer', 'Chisel', 'Wrench', 'Screwdriver', 'Pliers', 'Mallet', 'Crowbar', 'Handsaw'] },
  { id: 'dance',      label: 'dances',                items: ['Tango', 'Waltz', 'Salsa', 'Foxtrot', 'Flamenco', 'Samba', 'Ballet', 'Jive'] },
];

/* Pairs that would make an unfair round if used together, because an item in
   one reads as a member of the other. Checked in both directions.

   Note: no item may appear in two groups at all — scripts/ooo-check.js asserts
   that. "Cricket" originally sat in both insects and sports and was removed
   from insects rather than papered over with a conflict rule. */
const CONFLICTS = [
  ['fruit', 'vegetable'],
  ['country', 'capital'],
  ['bird', 'fish'],
  ['bird', 'insect'],
  ['bigcat', 'bird'],
];

export function conflicts(aId, bId) {
  return CONFLICTS.some(([x, y]) => (x === aId && y === bId) || (x === bId && y === aId));
}

export function rankFor(score) {
  if (score >= 25) return { label: 'Encyclopedic', blurb: 'You did not miss a thing.' };
  if (score >= 18) return { label: 'Very Sharp', blurb: 'That is a long streak.' };
  if (score >= 12) return { label: 'Quick Thinker', blurb: 'Comfortably above average.' };
  if (score >= 7) return { label: 'Solid', blurb: 'Right about where most people land.' };
  if (score >= 3) return { label: 'Warming Up', blurb: 'One more go and you will beat that.' };
  return { label: 'Caught Out', blurb: 'They get easier once you spot the trick.' };
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
 * Build a round: CHOICES-1 items from one group, 1 from a non-conflicting
 * other. Returns { options, oddIndex, groupLabel, oddLabel }.
 */
export function buildRound() {
  const main = GROUPS[Math.floor(Math.random() * GROUPS.length)];
  const candidates = GROUPS.filter((g) => g.id !== main.id && !conflicts(g.id, main.id));
  const other = candidates[Math.floor(Math.random() * candidates.length)];

  const picks = shuffle(main.items).slice(0, CHOICES - 1);
  const odd = shuffle(other.items)[0];

  const options = shuffle([...picks.map((t) => ({ text: t, odd: false })), { text: odd, odd: true }]);
  return {
    options,
    oddIndex: options.findIndex((o) => o.odd),
    groupLabel: main.label,
    oddLabel: other.label,
  };
}
