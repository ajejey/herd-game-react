/*
  THE GAME REGISTRY — single source of truth for every game in the hub.

  Adding a game = adding ONE entry here. It then appears automatically on the
  homepage row for its mode, in the nav dropdown, in the /all-games and
  /solo-games hubs, and in the sitemap/prerender route list. Nothing else to
  touch. This is what makes a hub with dozens of games maintainable — before
  this, each card was ~26 lines of hand-written JSX inside Home.js.

  mode:
    'daily' — one puzzle a day, streak-based, single player
    'solo'  — endless single player, replay as much as you like
    'party' — needs a room + other people (real-time)
    'work'  — the corporate/team-building lane (guides + hubs)

  Icons are react-icons components (no emoji chrome — see design prefs).
*/
import {
  FiTrendingUp, FiSun, FiHelpCircle, FiGrid, FiFeather, FiZap,
  FiEdit3, FiTarget, FiHexagon, FiEyeOff, FiSliders, FiType,
  FiShuffle, FiMessageSquare, FiSlash, FiUsers, FiBriefcase, FiClock, FiFilm,
  FiAward, FiCheckSquare, FiLayers, FiKey, FiMousePointer, FiHash,
  FiSquare, FiCrosshair, FiBookOpen, FiFlag, FiAlignLeft, FiCpu, FiCompass, FiDroplet,
} from 'react-icons/fi';

export const MODES = {
  solo:  { id: 'solo',  label: 'Play alone',      tagline: 'Endless — play as many times as you like', href: '/solo-games' },
  daily: { id: 'daily', label: "Today's dailies", tagline: 'A fresh puzzle every day. Keep your streak', href: '/all-games' },
  party: { id: 'party', label: 'With friends',    tagline: 'Share a room code — everyone plays on their own phone', href: '/all-games' },
  work:  { id: 'work',  label: 'For work',        tagline: 'Team building that needs no download or signup', href: '/office-games' },
};

export const GAMES = [
  /* ---------------------------- SOLO (endless) ---------------------------- */
  {
    id: 'higher-or-lower', name: 'Higher or Lower', slug: '/higher-or-lower', mode: 'solo',
    blurb: 'Which is bigger? One life, endless streak.',
    players: '1', minutes: '2+', accent: '#E84A8B', Icon: FiTrendingUp,
    isNew: true, featured: true,
    tags: ['guessing', 'streak', 'endless'],
  },

  {
    id: 'what-farm-animal-are-you', name: 'What Farm Animal Are You?', slug: '/what-farm-animal-are-you', mode: 'solo',
    blurb: 'Eight questions. Are you the Cow, the Goat or the Sheepdog?',
    players: '1', minutes: '1', accent: '#8E5CF7', Icon: FiFeather,
    isNew: true, featured: true,
    tags: ['personality', 'quiz', 'shareable'],
  },

  {
    id: 'guess-the-year', name: 'Guess the Year', slug: '/guess-the-year', mode: 'solo',
    blurb: 'Five famous films. Slide to the year you think each came out.',
    players: '1', minutes: '3', accent: '#F0A202', Icon: FiClock,
    isNew: true, featured: true,
    tags: ['trivia', 'movies', 'guessing'],
  },

  {
    id: 'herd-memory', name: 'Herd Memory', slug: '/memory-game', mode: 'solo',
    blurb: 'Watch the pasture light up, then tap it back. One more each round.',
    players: '1', minutes: '2+', accent: '#3D8B5A', Icon: FiGrid,
    isNew: true, featured: true,
    tags: ['memory', 'brain', 'endless'],
  },

  {
    id: 'odd-one-out', name: 'Odd One Out', slug: '/odd-one-out', mode: 'solo',
    blurb: 'Four words, one impostor. Three lives, one long streak.',
    players: '1', minutes: '2+', accent: '#1F7A8C', Icon: FiSlash,
    isNew: true,
    tags: ['word', 'puzzle', 'endless'],
  },
  {
    id: 'reaction-time', name: 'Reaction Time Test', slug: '/reaction-time-test', mode: 'solo',
    blurb: 'Wait for green, then tap. How fast are you really?',
    players: '1', minutes: '1', accent: '#C9762F', Icon: FiZap,
    isNew: true,
    tags: ['reflex', 'test', 'endless'],
  },

  {
    id: 'emoji-movie-quiz', name: 'Emoji Movie Quiz', slug: '/emoji-movie-quiz', mode: 'solo',
    blurb: 'Ten films told entirely in emoji. Name them.',
    players: '1', minutes: '3', accent: '#8E5CF7', Icon: FiFilm,
    isNew: true,
    tags: ['movies', 'quiz', 'emoji'],
  },

  {
    id: 'put-in-order', name: 'Put in Order', slug: '/put-in-order', mode: 'solo',
    blurb: 'Four things, one right order. Biggest, tallest, oldest.',
    players: '1', minutes: '3', accent: '#8E3B7A', Icon: FiLayers,
    isNew: true,
    tags: ['puzzle', 'ranking', 'endless'],
  },
  {
    id: 'math-sprint', name: 'Maths Sprint', slug: '/math-game', mode: 'solo',
    blurb: 'Sixty seconds of mental arithmetic. How many?',
    players: '1', minutes: '1', accent: '#2D6BE0', Icon: FiTarget,
    isNew: true,
    tags: ['maths', 'brain', 'timed'],
  },
  {
    id: 'word-scramble', name: 'Word Scramble', slug: '/word-scramble', mode: 'solo',
    blurb: 'Untangle the letters. No typing, just tapping.',
    players: '1', minutes: '2+', accent: '#B5533A', Icon: FiType,
    isNew: true,
    tags: ['word', 'anagram', 'endless'],
  },

  {
    id: 'trivia-streak', name: 'Trivia Streak', slug: '/trivia-streak', mode: 'solo',
    blurb: '1,700+ questions, three lives. How long can you last?',
    players: '1', minutes: '3+', accent: '#2F7A4F', Icon: FiHelpCircle,
    isNew: true, featured: true,
    tags: ['trivia', 'quiz', 'endless'],
  },
  {
    id: 'chimp-test', name: 'Chimp Test', slug: '/chimp-test', mode: 'solo',
    blurb: 'Numbers vanish the moment you start. Chimps beat most humans.',
    players: '1', minutes: '2', accent: '#4C5BD4', Icon: FiGrid,
    isNew: true,
    tags: ['memory', 'brain', 'test'],
  },
  {
    id: 'colour-match', name: 'Colour Match', slug: '/colour-match', mode: 'solo',
    blurb: 'The word says one thing, the ink says another. 60 seconds.',
    players: '1', minutes: '1', accent: '#7A3E9D', Icon: FiZap,
    isNew: true,
    tags: ['reflex', 'brain', 'stroop'],
  },
  {
    id: 'typing-test', name: 'Typing Speed Test', slug: '/typing-test', mode: 'solo',
    blurb: 'One minute, as many words as you can. Most people manage 40.',
    players: '1', minutes: '1', accent: '#1F7A6B', Icon: FiKey,
    isNew: true,
    tags: ['typing', 'skill', 'test'],
  },
  {
    id: 'click-speed-test', name: 'Click Speed Test', slug: '/click-speed-test', mode: 'solo',
    blurb: 'Five seconds. Click as fast as your finger allows.',
    players: '1', minutes: '1', accent: '#C2410C', Icon: FiMousePointer,
    isNew: true,
    tags: ['reflex', 'test', 'cps'],
  },
  {
    id: 'number-memory-test', name: 'Number Memory Test', slug: '/number-memory-test', mode: 'solo',
    blurb: 'A number flashes, then vanishes. One digit longer each round.',
    players: '1', minutes: '2', accent: '#1D5FA8', Icon: FiHash,
    isNew: true,
    tags: ['memory', 'brain', 'test'],
  },
  {
    id: 'visual-memory-test', name: 'Visual Memory Test', slug: '/visual-memory-test', mode: 'solo',
    blurb: 'Squares flash, then vanish. Tap the ones that lit up.',
    players: '1', minutes: '2', accent: '#6D3BC4', Icon: FiSquare,
    isNew: true,
    tags: ['memory', 'brain', 'test'],
  },
  {
    id: 'aim-trainer', name: 'Aim Trainer', slug: '/aim-trainer', mode: 'solo',
    blurb: 'Thirty targets, one at a time. How fast can you hit them?',
    players: '1', minutes: '1', accent: '#B02E62', Icon: FiCrosshair,
    isNew: true,
    tags: ['reflex', 'test', 'aim'],
  },
  {
    id: 'verbal-memory-test', name: 'Verbal Memory Test', slug: '/verbal-memory-test', mode: 'solo',
    blurb: 'Seen this word already, or is it new? The list keeps growing.',
    players: '1', minutes: '3', accent: '#0F6E7A', Icon: FiBookOpen,
    isNew: true,
    tags: ['memory', 'word', 'test'],
  },
  {
    id: 'hangman', name: 'Hangman', slug: '/hangman', mode: 'solo',
    blurb: 'Guess the word letter by letter. Six lives, endless streak.',
    players: '1', minutes: '3+', accent: '#2F6B4F', Icon: FiAlignLeft,
    isNew: true,
    tags: ['word', 'puzzle', 'endless'],
  },
  {
    id: 'minesweeper', name: 'Minesweeper', slug: '/minesweeper', mode: 'solo',
    blurb: 'Clear the board without hitting a mine. First tap always safe.',
    players: '1', minutes: '5', accent: '#3A5A8C', Icon: FiFlag,
    isNew: true,
    tags: ['puzzle', 'logic', 'classic'],
  },
  {
    id: 'tic-tac-toe', name: 'Tic Tac Toe', slug: '/tic-tac-toe', mode: 'solo',
    blurb: 'Play the computer. One difficulty is genuinely unbeatable.',
    players: '1', minutes: '1', accent: '#7A2E6B', Icon: FiCpu,
    isNew: true,
    tags: ['classic', 'strategy', 'computer'],
  },
  {
    id: 'which-game', name: 'Which Game Should You Play?', slug: '/which-game-should-i-play', mode: 'solo',
    blurb: 'Six questions and we pick one for you, from all of them.',
    players: '1', minutes: '1', accent: '#A8620A', Icon: FiCompass,
    isNew: true,
    tags: ['quiz', 'shareable', 'personality'],
  },

  /* -------------------------------- DAILY -------------------------------- */
  {
    id: 'daily-herd', name: 'Daily Herd', slug: '/daily', mode: 'daily',
    blurb: 'Answer like everyone else. Match the herd to score.',
    players: '1', minutes: '2', accent: '#3D8B5A', Icon: FiSun, featured: true,
    tags: ['herd', 'opinion'],
  },
  {
    id: 'daily-trivia', name: 'Daily Trivia', slug: '/trivia', mode: 'daily',
    blurb: 'Ten fresh questions every day. Build your streak.',
    players: '1', minutes: '3', accent: '#E0992D', Icon: FiHelpCircle, featured: true,
    tags: ['trivia', 'quiz'],
  },
  {
    id: 'huddle', name: 'Huddle', slug: '/connections', mode: 'daily',
    blurb: 'Find the four hidden groups. One puzzle a day.',
    players: '1', minutes: '4', accent: '#2D6BE0', Icon: FiGrid, featured: true,
    tags: ['word', 'puzzle', 'connections'],
  },
  {
    id: 'daily-aura', name: 'Daily Aura', slug: '/aura', mode: 'daily',
    blurb: 'Answer a few vibe questions, reveal today’s aura colour.',
    players: '1', minutes: '2', accent: '#B5479B', Icon: FiFeather,
    tags: ['personality', 'quiz'],
  },
  {
    id: 'daily-hot-takes', name: 'Daily Hot Takes', slug: '/hot-takes', mode: 'daily',
    blurb: 'Pick a side on spicy takes. See how far you are from the crowd.',
    players: '1', minutes: '2', accent: '#FF4D2E', Icon: FiZap,
    tags: ['opinion', 'personality'],
  },
  {
    id: 'trivia-topics', name: 'Trivia Topics', slug: '/trivia-games', mode: 'daily',
    blurb: 'Music, movies, Harry Potter, Marvel and more — pick your topic.',
    players: '1', minutes: '3', accent: '#7A5AF8', Icon: FiLayers,
    tags: ['trivia', 'hub'],
  },

  /* -------------------------------- PARTY -------------------------------- */
  {
    id: 'say-anything', name: 'Say Anything', slug: '/say-anything', mode: 'party',
    blurb: 'Write the funniest answer, then vote for the best.',
    players: '3-12', minutes: '15', accent: '#E84A8B', Icon: FiEdit3, featured: true,
    tags: ['funny', 'writing', 'jackbox'],
  },
  {
    id: 'guesstimate', name: 'Guesstimate', slug: '/guesstimate', mode: 'party',
    blurb: 'Trivia with betting. You don’t need to know — just guess well.',
    players: '3-12', minutes: '15', accent: '#2F9E6B', Icon: FiTarget, featured: true,
    tags: ['trivia', 'betting', 'wits-and-wagers'],
  },
  {
    id: 'taboo', name: 'Taboo', slug: '/taboo', mode: 'party',
    blurb: 'Describe the word without saying the forbidden five.',
    players: '3-12', minutes: '15', accent: '#D0463B', Icon: FiSlash,
    isNew: true, featured: true,
    tags: ['word', 'teams', 'describing'],
  },
  {
    id: 'scattergories', name: 'Scattergories', slug: '/scattergories', mode: 'party',
    blurb: 'One letter, twelve categories, sixty seconds. Be original.',
    players: '2-12', minutes: '10', accent: '#F0A202', Icon: FiType, featured: true,
    tags: ['word', 'categories'],
  },
  {
    id: 'cavemanclues', name: 'Caveman Clues', slug: '/caveman-clues', mode: 'party',
    blurb: 'Describe the word using only short words. One big word costs you.',
    players: '3-20', minutes: '10', accent: '#C2703D', Icon: FiFeather,
    tags: ['word', 'guessing'],
  },
  {
    id: 'huematch', name: 'Hue Match', slug: '/hue-match', mode: 'party',
    blurb: 'Describe a colour in one word. Everyone taps where they think it is.',
    players: '3-20', minutes: '10', accent: '#7B5EA7', Icon: FiDroplet,
    tags: ['colour', 'guessing'],
  },
  {
    id: 'chameleon', name: 'Chameleon', slug: '/chameleon', mode: 'party',
    blurb: 'Everyone knows the secret word. Except one of you.',
    players: '3-12', minutes: '10', accent: '#4C9F70', Icon: FiEyeOff,
    tags: ['bluffing', 'social-deduction'],
  },
  {
    id: 'spectrum', name: 'Spectrum', slug: '/spectrum', mode: 'party',
    blurb: 'Give a clue and get your team to land on the exact spot.',
    players: '2-12', minutes: '10', accent: '#3AA6B9', Icon: FiSliders,
    tags: ['clues', 'wavelength'],
  },
  {
    id: 'would-you-rather', name: 'Would You Rather', slug: '/would-you-rather', mode: 'party',
    blurb: 'Impossible choices. Find out where your group splits.',
    players: '2-16', minutes: '10', accent: '#8E5CF7', Icon: FiShuffle,
    tags: ['opinion', 'icebreaker'],
  },
  {
    id: 'fishbowl', name: 'Fishbowl', slug: '/fishbowl', mode: 'party',
    blurb: 'Three rounds, same words: describe, one word, act it out.',
    players: '3-16', minutes: '20', accent: '#2D8FBF', Icon: FiMessageSquare,
    tags: ['charades', 'teams'],
  },
  {
    id: 'clover', name: 'Clover Clues', slug: '/clover', mode: 'party',
    blurb: 'Co-operative word puzzle — solve it together, nobody loses.',
    players: '2-6', minutes: '15', accent: '#5BA85B', Icon: FiHexagon,
    tags: ['co-op', 'word', 'so-clover'],
  },
  {
    id: 'two-truths', name: 'Two Truths & a Lie', slug: '/two-truths-and-a-lie', mode: 'party',
    blurb: 'Two true, one false. Can they spot your lie?',
    players: '3-16', minutes: '10', accent: '#C9762F', Icon: FiCheckSquare,
    tags: ['icebreaker', 'bluffing'],
  },
  {
    id: 'team-trivia', name: 'Team Trivia', slug: '/team-trivia', mode: 'party',
    blurb: 'Split into teams and battle it out over a quiz.',
    players: '4-30', minutes: '20', accent: '#1F7A8C', Icon: FiUsers, featured: true,
    tags: ['trivia', 'teams', 'work'],
  },

  /* --------------------------------- WORK -------------------------------- */
  {
    id: 'office-games', name: 'Office Games', slug: '/office-games', mode: 'work',
    blurb: 'The full guide to games that work over Teams and Zoom.',
    players: 'any', minutes: '—', accent: '#3D8B5A', Icon: FiBriefcase, featured: true,
    tags: ['guide', 'work'],
  },
  {
    id: 'best-team-trivia', name: 'Team Trivia Games', slug: '/best-team-trivia-games', mode: 'work',
    blurb: 'The best trivia formats for a distributed team.',
    players: 'any', minutes: '—', accent: '#1F7A8C', Icon: FiAward,
    tags: ['guide', 'trivia'],
  },
  {
    id: 'remote-work-bingo', name: 'Remote Work Bingo', slug: '/remote-work-bingo', mode: 'work',
    blurb: '“You’re on mute.” Tick it off. A bingo card for video calls.',
    players: 'any', minutes: '5', accent: '#E0992D', Icon: FiCheckSquare,
    tags: ['bingo', 'meeting'],
  },
];

/* ----------------------------- derived helpers ---------------------------- */

/*
  Solo hub grouping.

  One flat list stopped working at about a dozen games — /solo-games had grown
  to nine phone-screens of identical cards, which is a wall, not a catalogue.
  These groups split it by what the game asks of you.

  Matching is first-group-wins, so ORDER MATTERS: Colour Match is tagged both
  'reflex' and 'brain', and it belongs under reflex, so reflex is checked first.
  Anything matching nothing at all falls into a final catch-all rather than
  vanishing — a game silently missing from the hub would be invisible in review.
*/
export const SOLO_GROUPS = [
  {
    id: 'trivia', eyebrow: 'Trivia & guessing', accent: '#E84A8B',
    title: 'How much do you actually know?',
    tagline: 'Guessing games and quizzes. One wrong answer is rarely the end.',
    match: (t) => ['trivia', 'quiz', 'guessing', 'personality'].some((x) => t.includes(x)),
  },
  {
    id: 'reflex', eyebrow: 'Speed & reflex', accent: '#C2410C',
    title: 'How fast are you?',
    tagline: 'Short, sharp and over in a minute. Built to be replayed.',
    match: (t) => ['reflex', 'typing'].some((x) => t.includes(x)),
  },
  {
    id: 'memory', eyebrow: 'Brain & memory', accent: '#4C5BD4',
    title: 'How much can you hold?',
    tagline: 'Memory and mental arithmetic. Most people plateau around seven.',
    match: (t) => ['memory', 'brain'].some((x) => t.includes(x)),
  },
  {
    id: 'word', eyebrow: 'Words & puzzles', accent: '#1F7A8C',
    title: 'Work it out',
    tagline: 'Letters, order and logic. No clock breathing down your neck.',
    match: (t) => ['word', 'puzzle', 'anagram', 'ranking'].some((x) => t.includes(x)),
  },
];

/** Solo games bucketed into SOLO_GROUPS. Empty groups are dropped; anything
 *  unmatched is returned under a final "More to play" group so it still shows. */
export const soloGrouped = () => {
  const rest = [];
  const buckets = new Map(SOLO_GROUPS.map((g) => [g.id, []]));
  for (const game of byMode('solo')) {
    const group = SOLO_GROUPS.find((g) => g.match(game.tags || []));
    if (group) buckets.get(group.id).push(game);
    else rest.push(game);
  }
  const out = SOLO_GROUPS
    .map((g) => ({ ...g, games: buckets.get(g.id) }))
    .filter((g) => g.games.length);
  if (rest.length) {
    out.push({
      id: 'more', eyebrow: 'More', accent: '#6B5B4A',
      title: 'More to play', tagline: 'Everything else in the solo lane.', games: rest,
    });
  }
  return out;
};

/*
  What people call a game when it is not what we called it.

  Search logs on any games site are dominated by the thing a game is LIKE, not
  its name — nobody types "Guesstimate", they type "wits and wagers" or
  "jackbox". Without this the hub search fails exactly the visitor who already
  knows what they want, which is the visitor most likely to play.

  This is a DATA fix, not an algorithm one, and it is deliberately incomplete.
  `game_search` events record every query that returned nothing; that list is
  the backlog for this map. Add from evidence, not from guessing.

  Rules: lowercase, no punctuation, and never an alias that would sensibly
  belong to a different game on this site.
*/
export const SEARCH_ALIASES = {
  guesstimate:    ['wits and wagers', 'betting trivia', 'price is right'],
  cavemanclues:   ['poetry for neanderthals', 'caveman', 'one syllable', 'short words', 'neanderthal'],
  huematch:       ['hues and cues', 'colour game', 'color game', 'guess the colour', 'guess the color', 'shades'],
  spectrum:       ['wavelength', 'dial', 'slider'],
  chameleon:      ['imposter', 'impostor', 'spyfall', 'who is the spy'],
  clover:         ['so clover', 'clover cards'],
  scattergories:  ['categories', 'boggle categories', 'letter game'],
  taboo:          ['forbidden words', 'describe it'],
  fishbowl:       ['salad bowl', 'celebrity', 'monikers', 'the hat game'],
  'team-trivia':  ['kahoot', 'pub quiz', 'quiz night', 'trivia night'],
  'say-anything': ['quiplash', 'jackbox', 'funniest answer'],
  'two-truths':   ['two truths', 'icebreaker'],
  'would-you-rather': ['would you rather', 'this or that'],
  'daily-herd':   ['herd mentality', 'majority rules', 'family feud', 'feud'],
  'daily-hot-takes': ['hot takes', 'opinions', 'controversial'],
};

/* Flattened once, so the search does not rebuild it on every keystroke. */
export const aliasesFor = (id) => SEARCH_ALIASES[id] || [];

export const byMode = (mode) => GAMES.filter((g) => g.mode === mode);
export const featuredByMode = (mode, n = 6) => byMode(mode).filter((g) => g.featured).slice(0, n);
export const gameBySlug = (slug) => GAMES.find((g) => g.slug === slug);
export const newGames = () => GAMES.filter((g) => g.isNew);

/** Every game route — feeds the sitemap and the prerender list. */
export const allGameRoutes = () => GAMES.map((g) => g.slug);

/** Rough "how many games" claim used in copy, so it can never go stale. */
export const GAME_COUNT = GAMES.length;

