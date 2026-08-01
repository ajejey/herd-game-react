/*
  Colour Match — solo, 60 seconds.

  Category: reflex. A Stroop task: the WORD and the INK are often different,
  and you answer about one while the other interferes. Fully procedural, so
  there is no content and it never repeats.

  Accessibility note: this game is inherently colour-dependent, so unlike the
  rest of the hub it cannot be made fully colour-blind safe. The palette below
  is chosen to be as distinguishable as possible, and every answer button is
  also LABELLED with the colour's name, so the choice is always readable as
  text rather than only as a swatch.

  Aesthetic: warm farm palette background, violet accent. No dark mode.
*/

export const THEME = {
  bg: '#FFF8E7',
  bgAlt: '#FFFFFF',
  border: '#FFE8C8',
  ink: '#2D1810',
  mut: '#6B5B4A',
  accent: '#7A3E9D',
  green: '#3D8B5A',
  red: '#D0463B',
};

export const FREDOKA = { fontFamily: "'Fredoka', system-ui, sans-serif" };
export const QUICKSAND = { fontFamily: "'Quicksand', system-ui, sans-serif" };

export const DURATION_S = 60;

/* Four colours. Blue and yellow are safe anchors for the common forms of
   colour blindness, so red and green are never the only two on offer. */
export const COLOURS = [
  { id: 'red', name: 'RED', hex: '#D0463B' },
  { id: 'blue', name: 'BLUE', hex: '#2D6BE0' },
  { id: 'green', name: 'GREEN', hex: '#3D8B5A' },
  { id: 'yellow', name: 'YELLOW', hex: '#D99A00' },
];

/* Two prompt types, so players cannot settle into autopilot. */
export const MODES = [
  { id: 'ink', ask: 'Tap the COLOUR of the word' },
  { id: 'word', ask: 'Tap what the word SAYS' },
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const shuffle = (arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * Build a round. Word and ink disagreeing IS the game, so a matching pair is
 * only occasionally allowed — about one round in five.
 */
export function buildRound() {
  const mode = pick(MODES);
  const word = pick(COLOURS);
  let ink = pick(COLOURS);
  if (ink.id === word.id && Math.random() < 0.8) {
    ink = pick(COLOURS.filter((c) => c.id !== word.id));
  }
  const answer = mode.id === 'ink' ? ink : word;
  return { mode, word, ink, answer, options: shuffle(COLOURS) };
}

export function rankFor(score) {
  if (score >= 45) return { label: 'Unshakeable', blurb: 'The interference does not touch you.' };
  if (score >= 35) return { label: 'Very Quick', blurb: 'Well above average.' };
  if (score >= 26) return { label: 'Sharp', blurb: 'Comfortably good.' };
  if (score >= 17) return { label: 'Solid', blurb: 'Right about where most people land.' };
  if (score >= 9) return { label: 'Getting Tangled', blurb: 'That is the Stroop effect doing its work.' };
  return { label: 'Thoroughly Confused', blurb: 'It is meant to be hard. That is the point.' };
}
