/*
  Shared data for the Office Games hub + spokes — the game roster (framed for
  work/meetings) and the list of spoke pages for cross-linking.
*/
export const GAMES = [
  {
    name: 'Say Anything',
    to: '/say-anything',
    blurb: 'Write the funniest answer to a question, then everyone votes. The remote-team favourite — works great in a Teams or Zoom call.',
    players: '3–12 players',
    accent: '#E84A8B',
  },
  {
    name: 'Guesstimate',
    to: '/guesstimate',
    blurb: 'Guess the number to a trivia question, then bet on whose guess is closest. Team trivia with a twist.',
    players: '2+ players',
    accent: '#FB8C00',
  },
  {
    name: 'Clover Clues',
    to: '/clover',
    blurb: 'A cooperative word game — write clues and rebuild each other’s “clovers” as a team. Pure collaboration.',
    players: '3–6 players',
    accent: '#3D8B5A',
  },
  {
    name: 'Remote Work Bingo',
    to: '/remote-work-bingo',
    blurb: 'Mark the meeting clichés as they happen — “you’re on mute”, “let’s take this offline”. Play it live during any call.',
    players: 'Solo or team',
    accent: '#D7263D',
  },
  {
    name: 'Daily Trivia',
    to: '/trivia',
    blurb: '10 quick trivia questions a day. A perfect 2-minute warm-up to kick off a meeting or a Fun Friday.',
    players: 'Solo · daily',
    accent: '#3D8B5A',
  },
  {
    name: 'Huddle',
    to: '/connections',
    blurb: 'Sort 16 words into 4 hidden groups — a fast brain teaser to energise the room.',
    players: 'Solo · daily',
    accent: '#4A90D9',
  },
  {
    name: 'Daily Herd',
    to: '/daily',
    blurb: 'Guess what most people will say and match the crowd. A 2-minute daily everyone can compare scores on.',
    players: 'Solo · daily',
    accent: '#7C4DFF',
  },
];

export const SPOKES = [
  { slug: 'games-to-play-on-microsoft-teams', title: 'Games to Play on Microsoft Teams', emoji: '💬' },
  { slug: 'fun-friday-games-for-work', title: 'Fun Friday Games for Work', emoji: '🎉' },
  { slug: 'virtual-icebreaker-games-for-meetings', title: 'Virtual Icebreaker Games for Meetings', emoji: '🧊' },
];
