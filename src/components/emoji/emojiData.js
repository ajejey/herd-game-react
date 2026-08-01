/*
  Emoji Movie Quiz — solo, 10 rounds.

  Category: pop-culture guessing / share-bait. Content is a hand-written bank,
  but a small static one that does not expire: film titles do not go stale, and
  drawing 10 at a time from ~85 gives a long tail before anyone sees a repeat.

  Licensing note: film TITLES are not copyrightable and no artwork is used —
  the puzzles are emoji sequences written here. That is deliberate. An emoji
  quiz built on posters or stills would not be safe on an ad-supported site.

  Aesthetic: warm farm palette with a cinema purple accent, distinct from the
  other solo games. No dark mode.
*/

// Wikidata film list, reused from Higher or Lower — see decoyPool below.
import generated from '../higherlower/hlBank.generated.json';

export const THEME = {
  bg: '#FFF8E7',
  bgAlt: '#FFFFFF',
  border: '#FFE8C8',
  ink: '#2D1810',
  mut: '#6B5B4A',
  purple: '#8E5CF7',
  green: '#3D8B5A',
  red: '#D0463B',
};

export const FREDOKA = { fontFamily: "'Fredoka', system-ui, sans-serif" };
export const QUICKSAND = { fontFamily: "'Quicksand', system-ui, sans-serif" };

export const ROUNDS = 10;
export const CHOICES = 4;

/* Titles must be UNIQUE — buildQuiz() dedupes anyway, but a duplicate here
   would waste a slot and could put the same answer in two rounds of one run. */
export const PUZZLES = [
  { e: '🦁👑', t: 'The Lion King' },
  { e: '🚢🧊💔', t: 'Titanic' },
  { e: '🦖🏝️🧬', t: 'Jurassic Park' },
  { e: '🤠🚀🧸', t: 'Toy Story' },
  { e: '🐠🔍👨‍👦', t: 'Finding Nemo' },
  { e: '🧅👹🏰', t: 'Shrek' },
  { e: '💊🕶️🐇', t: 'The Matrix' },
  { e: '❄️👸⛄', t: 'Frozen' },
  { e: '🚗⏰⚡', t: 'Back to the Future' },
  { e: '🏠🎈🎒', t: 'Up' },
  { e: '🕷️🧑‍🎓🕸️', t: 'Spider-Man' },
  { e: '🦇🃏🌃', t: 'The Dark Knight' },
  { e: '💍🌋🧙', t: 'The Lord of the Rings' },
  { e: '⚡🧙‍♂️🏰', t: 'Harry Potter' },
  { e: '🌪️👠🌈', t: 'The Wizard of Oz' },
  { e: '🦈🏖️🚤', t: 'Jaws' },
  { e: '👽🚲🌕', t: 'E.T.' },
  { e: '🤖❤️🌱', t: 'WALL-E' },
  { e: '🐀👨‍🍳🍲', t: 'Ratatouille' },
  { e: '🎈🤡🕳️', t: 'It' },
  { e: '🧠💭😢😡', t: 'Inside Out' },
  { e: '🐼🥋🍜', t: 'Kung Fu Panda' },
  { e: '🦸‍♂️👨‍👩‍👧‍👦🎭', t: 'The Incredibles' },
  { e: '🚀🌽👨‍🚀', t: 'Interstellar' },
  { e: '🌀🎩💤', t: 'Inception' },
  { e: '🏝️🏐✉️', t: 'Cast Away' },
  { e: '🍫🎫🏭', t: 'Charlie and the Chocolate Factory' },
  { e: '👻🚫🔫', t: 'Ghostbusters' },
  { e: '🦍🏙️✈️', t: 'King Kong' },
  { e: '🐷🕷️🕸️', t: "Charlotte's Web" },
  { e: '🧜‍♀️🐚🔱', t: 'The Little Mermaid' },
  { e: '🐘🎪👂', t: 'Dumbo' },
  { e: '🦌❄️🌲', t: 'Bambi' },
  { e: '🍎😴👸', t: 'Snow White' },
  { e: '👠🎃🕛', t: 'Cinderella' },
  { e: '🧞‍♂️🪔🐒', t: 'Aladdin' },
  { e: '🌹🥀🏰', t: 'Beauty and the Beast' },
  { e: '🐻🍯🌳', t: 'Winnie the Pooh' },
  { e: '💙🌍🏹', t: 'Avatar' },
  { e: '🦸‍♀️🦸‍♂️🌌', t: 'The Avengers' },
  { e: '⚔️🛡️🏛️', t: 'Gladiator' },
  { e: '🏴‍☠️💀🧭', t: 'Pirates of the Caribbean' },
  { e: '🕵️‍♂️🎯🍸', t: 'James Bond' },
  { e: '🎤⭐🎶', t: 'A Star Is Born' },
  { e: '💃🕺🌃', t: 'La La Land' },
  { e: '🏠🧑‍🤝‍🧑🪜', t: 'Parasite' },
  { e: '🃏🎭🪜', t: 'Joker' },
  { e: '💗👠🚗', t: 'Barbie' },
  { e: '💣🧪🏜️', t: 'Oppenheimer' },
  { e: '🐝🎬🍿', t: 'Bee Movie' },
  { e: '🐧🕺❄️', t: 'Happy Feet' },
  { e: '🐨🎤🎹', t: 'Sing' },
  { e: '🎃💀🎄', t: 'The Nightmare Before Christmas' },
  { e: '🏡👦🥔', t: 'Home Alone' },
  { e: '🎅🦌🎁', t: 'Elf' },
  { e: '👨‍🦱🏃🍫', t: 'Forrest Gump' },
  { e: '🏦🔨🕳️', t: 'The Shawshank Redemption' },
  { e: '🎩🐴💼', t: 'The Godfather' },
  { e: '🕺💼🔫', t: 'Pulp Fiction' },
  { e: '🥊🥩🇺🇸', t: 'Rocky' },
  { e: '🚗🏁⚡', t: 'Cars' },
  { e: '👹🚪👧', t: 'Monsters, Inc.' },
  { e: '🎈🎪🎩', t: 'The Greatest Showman' },
  { e: '🧑‍🚀🔴🥔', t: 'The Martian' },
  { e: '🛁🔪🏨', t: 'Psycho' },
  { e: '🐦☎️🏚️', t: 'The Birds' },
  { e: '👨‍🎤🎹👑', t: 'Bohemian Rhapsody' },
  { e: '🧙‍♂️🗡️🐉', t: 'The Hobbit' },
  { e: '🏹🔥👧', t: 'The Hunger Games' },
  { e: '🧛‍♂️🐺💕', t: 'Twilight' },
  { e: '🚂🎫🎅', t: 'The Polar Express' },
  { e: '🐕🍝🕯️', t: 'Lady and the Tramp' },
  { e: '🐕‍🦺🐾💯', t: '101 Dalmatians' },
  { e: '🦁🚪❄️👑', t: 'The Chronicles of Narnia' },
  { e: '🤖🚗⚔️', t: 'Transformers' },
  { e: '👗👠👛', t: 'The Devil Wears Prada' },
  { e: '💍👰😂', t: 'Bridesmaids' },
  { e: '🎳🥤🤙', t: 'The Big Lebowski' },
  { e: '🍕🐢🥋', t: 'Teenage Mutant Ninja Turtles' },
  { e: '👨‍🚀🌑🚀', t: 'Apollo 13' },
  { e: '🐟🦈🐡', t: 'Shark Tale' },
  { e: '🦕☄️🌋', t: 'The Land Before Time' },
  { e: '🐺🌲👧', t: 'Red Riding Hood' },
  { e: '🧟‍♂️🧟‍♀️🏙️', t: 'World War Z' },
  { e: '🕰️🍊👁️', t: 'A Clockwork Orange' },
  { e: '🐭🎩✨', t: 'Fantasia' },
];

export function rankFor(score) {
  const pct = score / ROUNDS;
  if (pct >= 1) return { label: 'Perfect Score', blurb: 'Every single one. Show-off.' };
  if (pct >= 0.8) return { label: 'Film Buff', blurb: 'You watch a lot of films, clearly.' };
  if (pct >= 0.6) return { label: 'Solid Viewer', blurb: 'Comfortably above average.' };
  if (pct >= 0.4) return { label: 'Casual Watcher', blurb: 'You know the big ones.' };
  if (pct >= 0.2) return { label: 'Popcorn Only', blurb: 'You are here for the snacks.' };
  return { label: 'Never Seen It', blurb: 'Genuinely impressive in its own way.' };
}

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/*
  Decoys come from the Wikidata film list we already generated for Higher or
  Lower, not from the puzzle bank.

  The emoji sequences have to be written by hand — there is no API that maps
  films to emoji — but the WRONG answers do not. Sourcing them from ~500
  well-known Wikidata titles means the multiple choice varies enormously
  without anyone authoring another line, and it stops the decoys giving the
  game away by only ever being other puzzles in the bank.
*/
const decoyPool = (() => {
  try {
    const cat = (generated?.categories || []).find((c) => c.fmtKind === 'year');
    // Top slice = most-linked on Wikipedia = recognisable enough to be a
    // plausible wrong answer rather than obvious filler.
    return (cat?.items || []).slice(0, 300).map((i) => i.n).filter(Boolean);
  } catch {
    return [];
  }
})();

/** ROUNDS puzzles, each with CHOICES options (the answer plus decoys). */
export function buildQuiz() {
  // Dedupe by title defensively: two rounds with the same answer in one run
  // would read as a bug even though it is only a data slip.
  const byTitle = new Map();
  for (const p of shuffle(PUZZLES)) if (!byTitle.has(p.t)) byTitle.set(p.t, p);
  const pool = [...byTitle.values()];
  const ownTitles = pool.map((p) => p.t);

  return shuffle(pool).slice(0, ROUNDS).map((p) => {
    const norm = (s) => s.toLowerCase().replace(/^the\s+/, '').trim();
    // Prefer Wikidata decoys; fall back to the bank if the JSON is unavailable.
    const source = decoyPool.length >= CHOICES * 4 ? decoyPool : ownTitles;
    const decoys = shuffle(source.filter((t) => norm(t) !== norm(p.t))).slice(0, CHOICES - 1);
    const options = shuffle([p.t, ...decoys]);
    return { emoji: p.e, answer: p.t, options, answerIndex: options.indexOf(p.t) };
  });
}
