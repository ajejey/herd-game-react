/*
  Remote Work Bingo — the "buzzword bingo" you mark live during a video meeting.
  Client-only: cards are built from this trope bank, optionally seeded so a whole
  team can share the SAME card via a link (?c=<seed>).
*/
export const TROPES = [
  "You're on mute",
  'Can everyone see my screen?',
  'Sorry, go ahead',
  "Let's take this offline",
  'Can you hear me?',
  'I think you’re frozen',
  'Dog barking in the background',
  'A kid or pet appears',
  'Sorry, I was on mute',
  'Can we circle back to that?',
  "Let's park that for now",
  "You're cutting out",
  'Someone forgets to unmute',
  "I'll send a follow-up",
  "Let's put a pin in it",
  'Who just joined?',
  'Can you share the link?',
  'My camera isn’t working',
  'Let me share my screen',
  'Next slide, please',
  'We’re losing you',
  'Talking over each other',
  "Let's double-click on that",
  'I have a hard stop at the top of the hour',
  "Let's take it to Slack",
  'There’s an echo on the call',
  'Wrong screen shared',
  'Someone eating on camera',
  'Background noise',
  'Who’s taking notes?',
  'Can you repeat that?',
  'Noticeable lag',
  'Still talking while on mute',
  'Give it a minute for people to join',
  "I'll drop the link in the chat",
  'This could’ve been an email',
  "Let's touch base",
  'Low battery warning',
  'Phone ringing in the background',
  "Let's circle back next week",
  'Are we recording this?',
  'Sorry, I dropped off',
  "Let's align on next steps",
  'Quick question (that isn’t quick)',
  'Construction noise outside',
  'Someone joins 5 minutes late',
];

const FREE = 'FREE — “Let’s get started!”';

// mulberry32 seeded PRNG
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Build a 25-cell card (index 12 = FREE centre) of {text, free} from a seed.
export function buildCard(seed) {
  const rand = mulberry32(seed);
  const pool = [...TROPES];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const picks = pool.slice(0, 24);
  const cells = [];
  for (let i = 0; i < 25; i++) {
    if (i === 12) cells.push({ text: FREE, free: true });
    else cells.push({ text: picks[i < 12 ? i : i - 1], free: false });
  }
  return cells;
}

// Winning lines over a 5x5 grid (rows, cols, 2 diagonals).
export const LINES = (() => {
  const lines = [];
  for (let r = 0; r < 5; r++) lines.push([0, 1, 2, 3, 4].map((c) => r * 5 + c));
  for (let c = 0; c < 5; c++) lines.push([0, 1, 2, 3, 4].map((r) => r * 5 + c));
  lines.push([0, 6, 12, 18, 24]);
  lines.push([4, 8, 12, 16, 20]);
  return lines;
})();

// A short base36 seed for shareable "same card" links.
export function randomSeed() {
  // avoid Math.random in odd envs but it's fine in the browser
  return Math.floor(Math.random() * 0xffffffff);
}
export const seedToCode = (s) => (s >>> 0).toString(36);
export const codeToSeed = (c) => {
  const n = parseInt(c, 36);
  return Number.isFinite(n) ? n >>> 0 : null;
};
