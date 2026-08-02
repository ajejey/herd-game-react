/*
  Which Game Should You Play? — solo, shareable, and a router into the hub.

  Two pieces of evidence drove this one:

   1. The farm-animal personality quiz is one of only two solo games that
      picked up real plays in its first days. The format works here.
   2. Homepage visitors were barely reaching the games at all — 137 users
      produced 9 visits to the solo hub. A catalogue of nearly forty games
      needs a "just tell me what to play" door, not only a longer list.

  So the RESULT of this quiz is a real game with a real link. Recommendations
  are looked up in the game registry by id at render time rather than being
  written out here, which means this quiz can never recommend a game that has
  been renamed, re-slugged or removed — it would be caught by the check script
  instead of shipping a dead link.

  Aesthetic: warm farm palette, marigold accent. No dark mode.
*/

export const THEME = {
  bg: '#FFF8E7',
  bgAlt: '#FFFFFF',
  border: '#FFE8C8',
  ink: '#2D1810',
  mut: '#6B5B4A',
  gold: '#A8620A',
  green: '#3D8B5A',
};

export const FREDOKA = { fontFamily: "'Fredoka', system-ui, sans-serif" };
export const QUICKSAND = { fontFamily: "'Quicksand', system-ui, sans-serif" };

/*
  Each option adds weight to game ids from the registry. Weights are small
  integers; the highest total wins and ties break by question order, so the
  earliest-scored game wins a tie — which keeps results stable rather than
  random-feeling on a re-take with the same answers.
*/
export const QUESTIONS = [
  {
    q: 'Who is playing?',
    options: [
      { label: 'Just me', w: { 'higher-or-lower': 3, 'minesweeper': 2, 'trivia-streak': 2, 'tic-tac-toe': 2 } },
      { label: 'Me and one other person', w: { 'tic-tac-toe': 3, 'would-you-rather': 2, 'two-truths': 2 } },
      { label: 'A few friends', w: { 'chameleon': 3, 'say-anything': 2, 'scattergories': 2 } },
      { label: 'The whole office', w: { 'team-trivia': 3, 'scattergories': 2, 'guesstimate': 2 } },
    ],
  },
  {
    q: 'How long have you got?',
    options: [
      { label: 'A minute, tops', w: { 'reaction-time': 3, 'click-speed-test': 3, 'typing-test': 2, 'tic-tac-toe': 2 } },
      { label: 'Five minutes', w: { 'higher-or-lower': 2, 'chimp-test': 2, 'word-scramble': 2, 'minesweeper': 2 } },
      { label: 'A proper session', w: { 'trivia-streak': 3, 'minesweeper': 2, 'hangman': 2, 'chameleon': 2 } },
    ],
  },
  {
    q: 'What sounds better right now?',
    options: [
      { label: 'Something to think about', w: { 'minesweeper': 3, 'put-in-order': 2, 'huddle': 2, 'odd-one-out': 2 } },
      { label: 'Something fast and twitchy', w: { 'aim-trainer': 3, 'reaction-time': 2, 'colour-match': 2, 'click-speed-test': 2 } },
      { label: 'Something with words', w: { 'hangman': 3, 'word-scramble': 2, 'odd-one-out': 2 } },
      { label: 'Something silly', w: { 'what-farm-animal-are-you': 3, 'daily-aura': 2, 'say-anything': 2 } },
    ],
  },
  {
    q: 'Do you want to be tested, or entertained?',
    options: [
      { label: 'Test me. I want a number.', w: { 'typing-test': 3, 'number-memory-test': 2, 'visual-memory-test': 2, 'aim-trainer': 2 } },
      { label: 'Entertain me. No homework.', w: { 'what-farm-animal-are-you': 3, 'emoji-movie-quiz': 2, 'daily-hot-takes': 2 } },
      { label: 'A bit of both', w: { 'trivia-streak': 3, 'guess-the-year': 2, 'higher-or-lower': 2 } },
    ],
  },
  {
    q: 'How do you feel about losing?',
    options: [
      { label: 'One life is fine. Keeps it tense.', w: { 'higher-or-lower': 3, 'minesweeper': 2, 'trivia-streak': 2 } },
      { label: 'Give me a few goes.', w: { 'hangman': 3, 'chimp-test': 2, 'odd-one-out': 2, 'verbal-memory-test': 2 } },
      { label: 'I would rather not lose at all.', w: { 'what-farm-animal-are-you': 3, 'daily-aura': 2, 'emoji-movie-quiz': 2 } },
    ],
  },
  {
    q: 'Last one. Pick a mood.',
    options: [
      { label: 'Competitive', w: { 'tic-tac-toe': 3, 'aim-trainer': 2, 'typing-test': 2, 'team-trivia': 2 } },
      { label: 'Curious', w: { 'guess-the-year': 3, 'put-in-order': 2, 'trivia-streak': 2 } },
      { label: 'Calm', w: { 'minesweeper': 3, 'word-scramble': 2, 'huddle': 2 } },
      { label: 'Chaotic', w: { 'say-anything': 3, 'daily-hot-takes': 2, 'chameleon': 2, 'colour-match': 2 } },
    ],
  },
];

/** Every game id this quiz can recommend — used by the check script. */
export function referencedIds() {
  const out = new Set();
  for (const q of QUESTIONS) for (const o of q.options) for (const id of Object.keys(o.w)) out.add(id);
  return [...out];
}

/**
 * Score the answers and return game ids best-first.
 * `answers` is an array of option indexes, one per question.
 */
export function scoreAnswers(answers) {
  const totals = new Map();
  const firstSeen = new Map();
  answers.forEach((choice, qi) => {
    const opt = QUESTIONS[qi]?.options[choice];
    if (!opt) return;
    for (const [id, w] of Object.entries(opt.w)) {
      totals.set(id, (totals.get(id) || 0) + w);
      if (!firstSeen.has(id)) firstSeen.set(id, qi);
    }
  });
  // Highest score wins; ties break on which game was scored first, so the same
  // answers always give the same result rather than shuffling on a re-take.
  return [...totals.entries()]
    .sort((a, b) => (b[1] - a[1]) || (firstSeen.get(a[0]) - firstSeen.get(b[0])))
    .map(([id]) => id);
}
