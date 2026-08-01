/*
  Trivia Streak — solo, endless.

  Category: trivia / high-replay. Content is FREE and SELF-GROWING: it reuses
  components/trivia/bank.generated.json, which an existing cron tops up from the
  Open Trivia Database. 1,700+ questions today and more every week, with no
  work from us.

  Licensing: OpenTDB questions are CC BY-SA 4.0, which REQUIRES attribution.
  The page carries it — see ATTRIBUTION below and its use in TriviaStreak.js.
  Do not remove it.

  Difficulty ramps with the streak (easy → medium → hard), which is what makes
  an endless run feel like it is going somewhere rather than just continuing.

  Aesthetic: warm farm palette with a forest green accent. No dark mode.
*/

import bank from '../trivia/bank.generated.json';

export const THEME = {
  bg: '#FFF8E7',
  bgAlt: '#FFFFFF',
  border: '#FFE8C8',
  ink: '#2D1810',
  mut: '#6B5B4A',
  forest: '#2F7A4F',
  green: '#3D8B5A',
  red: '#D0463B',
};

export const FREDOKA = { fontFamily: "'Fredoka', system-ui, sans-serif" };
export const QUICKSAND = { fontFamily: "'Quicksand', system-ui, sans-serif" };

export const LIVES = 3;

export const ATTRIBUTION = bank?.attribution
  || 'Questions from the Open Trivia Database (opentdb.com), CC BY-SA 4.0';

/* In the bank, options[0] is ALWAYS the correct answer — the options are
   presented pre-sorted, not shuffled. Forgetting that would make the first
   button correct every single time, which is the kind of bug that is invisible
   in code review and obvious to a player within about four questions. */
const ALL = (bank?.questions || []).filter(
  (q) => q && typeof q.q === 'string' && Array.isArray(q.options) && q.options.length >= 2,
);

export const QUESTION_COUNT = ALL.length;

export const CATEGORIES = [...new Set(ALL.map((q) => q.category))].filter(Boolean).sort();

/** Difficulty tier for a given streak: 0 easy, 1 medium, 2 hard. */
export function tierForStreak(streak) {
  if (streak < 5) return 0;
  if (streak < 12) return 1;
  return 2;
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
 * Build a question for the current streak.
 * `recent` holds recently used question texts so a run does not repeat itself.
 */
export function buildQuestion(streak, recent = []) {
  const tier = tierForStreak(streak);
  let pool = ALL.filter((q) => q.difficulty === tier && !recent.includes(q.q));
  if (!pool.length) pool = ALL.filter((q) => !recent.includes(q.q));
  if (!pool.length) pool = ALL;

  const q = pool[Math.floor(Math.random() * pool.length)];
  const answer = q.options[0];
  const options = shuffle(q.options);
  return {
    text: q.q,
    category: q.category,
    difficulty: q.difficulty,
    options,
    answer,
    answerIndex: options.indexOf(answer),
  };
}

export const DIFFICULTY_LABEL = ['Easy', 'Medium', 'Hard'];

export function rankFor(score) {
  if (score >= 30) return { label: 'Quizmaster', blurb: 'That is a genuinely rare run.' };
  if (score >= 20) return { label: 'Very Sharp', blurb: 'You know a lot of things.' };
  if (score >= 13) return { label: 'Strong Run', blurb: 'Well past where it gets hard.' };
  if (score >= 7) return { label: 'Solid', blurb: 'Right about where most people land.' };
  if (score >= 3) return { label: 'Warming Up', blurb: 'The early ones are the easy ones.' };
  return { label: 'Unlucky Start', blurb: 'Go again — the questions change every time.' };
}
