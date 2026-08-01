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
  FiShuffle, FiMessageSquare, FiSlash, FiUsers, FiBriefcase, FiClock,
  FiAward, FiCheckSquare, FiLayers,
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

export const byMode = (mode) => GAMES.filter((g) => g.mode === mode);
export const featuredByMode = (mode, n = 6) => byMode(mode).filter((g) => g.featured).slice(0, n);
export const gameBySlug = (slug) => GAMES.find((g) => g.slug === slug);
export const newGames = () => GAMES.filter((g) => g.isNew);

/** Every game route — feeds the sitemap and the prerender list. */
export const allGameRoutes = () => GAMES.map((g) => g.slug);

/** Rough "how many games" claim used in copy, so it can never go stale. */
export const GAME_COUNT = GAMES.length;
