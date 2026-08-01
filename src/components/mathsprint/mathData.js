/*
  Mental Maths Sprint — solo, 60 seconds.

  Category: quick reflex / skill. Fully procedural: every question is generated,
  so there is no bank, nothing to refresh, and it is impossible to exhaust.

  Answers are entered on an on-screen keypad rather than a text input, because
  a numeric <input> on a phone pops the OS keyboard, shoves the layout around
  and can autocorrect — all of which ruin a timed game.

  Aesthetic: warm farm palette with a deep blue accent. No dark mode.
*/

export const THEME = {
  bg: '#FFF8E7',
  bgAlt: '#FFFFFF',
  border: '#FFE8C8',
  ink: '#2D1810',
  mut: '#6B5B4A',
  blue: '#2D6BE0',
  green: '#3D8B5A',
  red: '#D0463B',
};

export const FREDOKA = { fontFamily: "'Fredoka', system-ui, sans-serif" };
export const QUICKSAND = { fontFamily: "'Quicksand', system-ui, sans-serif" };

export const DURATION_S = 60;

/*
  Difficulty ramps with the number you have already answered, so the first
  questions are gentle and a strong player still gets stretched. Every question
  has a non-negative whole-number answer: negatives and fractions are a
  different (and much less fun) game on a keypad.
*/
const rnd = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

export function buildQuestion(solved = 0) {
  const tier = Math.min(4, Math.floor(solved / 5));   // 0..4

  const kinds = ['+', '-', '×'];
  if (tier >= 2) kinds.push('×');                      // multiplication weighted up
  if (tier >= 3) kinds.push('÷');
  const op = kinds[Math.floor(Math.random() * kinds.length)];

  if (op === '+') {
    const a = rnd(2 + tier * 6, 12 + tier * 22);
    const b = rnd(2 + tier * 6, 12 + tier * 22);
    return { text: `${a} + ${b}`, answer: a + b };
  }
  if (op === '-') {
    const a = rnd(6 + tier * 10, 20 + tier * 26);
    const b = rnd(1, a - 1);                           // never negative
    return { text: `${a} − ${b}`, answer: a - b };
  }
  if (op === '×') {
    const a = rnd(2, 6 + tier * 3);
    const b = rnd(2, 6 + tier * 2);
    return { text: `${a} × ${b}`, answer: a * b };
  }
  // Division is built from its answer so it always divides exactly.
  const b = rnd(2, 6 + tier);
  const answer = rnd(2, 8 + tier * 2);
  return { text: `${b * answer} ÷ ${b}`, answer };
}

export function rankFor(score) {
  if (score >= 40) return { label: 'Human Calculator', blurb: 'That is genuinely rare.' };
  if (score >= 30) return { label: 'Very Quick', blurb: 'Well above average.' };
  if (score >= 22) return { label: 'Sharp', blurb: 'Comfortably good.' };
  if (score >= 14) return { label: 'Solid', blurb: 'Right about where most people land.' };
  if (score >= 7) return { label: 'Warming Up', blurb: 'The first few are always the slowest.' };
  return { label: 'Taking It Steady', blurb: 'No shame in checking your work.' };
}
