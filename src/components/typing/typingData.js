/*
  Typing Speed Test — solo, endless.

  Category: skill / reflex. Fully procedural: the word stream is drawn at
  random from a fixed bank of common English words, so it never runs out and
  never needs topping up. No external content source, no licence to honour.

  "typing test" and "words per minute" are among the highest-volume queries in
  this whole lane, and the format is a known quantity — people arrive already
  knowing what to do, which is exactly what we want from a landing page.

  Aesthetic: warm farm palette, teal accent. No dark mode.
*/

export const THEME = {
  bg: '#FFF8E7',
  bgAlt: '#FFFFFF',
  border: '#FFE8C8',
  ink: '#2D1810',
  mut: '#6B5B4A',
  teal: '#1F7A6B',
  green: '#3D8B5A',
  red: '#D0463B',
};

export const FREDOKA = { fontFamily: "'Fredoka', system-ui, sans-serif" };
export const QUICKSAND = { fontFamily: "'Quicksand', system-ui, sans-serif" };

export const DURATION = 60;   // seconds — the standard length people expect

/*
  Words dealt up front, and the point at which more are dealt.

  These are NOT cosmetic. The average word here is 4.2 letters, so with the
  space a typist covers about 5.2 characters per word — meaning a 60 WPM run
  gets through ~58 words and a 100 WPM run through ~96. An earlier version
  dealt exactly 60 and never topped up, so anyone at or above the site's own
  "Sharp" threshold ran off the end of the list mid-test: every word after that
  was compared against an empty string and marked wrong while the display went
  blank. The stream must always outrun the fastest possible typist.
*/
export const LOOKAHEAD = 120;
export const REFILL_AT = 40;   // words remaining before another batch is dealt
export const REFILL_SIZE = 80;

/*
  Common English words only. Deliberately no punctuation, no capitals and
  nothing longer than eight letters: a typing test measures steady typing, and
  a stray semicolon on a phone keyboard turns it into a menu-hunting test.
*/
const WORDS = [
  'the', 'of', 'and', 'to', 'in', 'is', 'you', 'that', 'it', 'he', 'was', 'for',
  'on', 'are', 'as', 'with', 'his', 'they', 'at', 'be', 'this', 'have', 'from',
  'or', 'one', 'had', 'by', 'word', 'but', 'not', 'what', 'all', 'were', 'we',
  'when', 'your', 'can', 'said', 'there', 'use', 'each', 'which', 'she', 'do',
  'how', 'their', 'if', 'will', 'up', 'other', 'about', 'out', 'many', 'then',
  'them', 'these', 'so', 'some', 'her', 'would', 'make', 'like', 'him', 'into',
  'time', 'has', 'look', 'two', 'more', 'write', 'go', 'see', 'number', 'no',
  'way', 'could', 'people', 'my', 'than', 'first', 'water', 'been', 'call',
  'who', 'oil', 'its', 'now', 'find', 'long', 'down', 'day', 'did', 'get',
  'come', 'made', 'may', 'part', 'over', 'new', 'sound', 'take', 'only',
  'little', 'work', 'know', 'place', 'year', 'live', 'me', 'back', 'give',
  'most', 'very', 'after', 'thing', 'our', 'just', 'name', 'good', 'sentence',
  'man', 'think', 'say', 'great', 'where', 'help', 'through', 'much', 'before',
  'line', 'right', 'too', 'mean', 'old', 'any', 'same', 'tell', 'boy',
  'follow', 'came', 'want', 'show', 'also', 'around', 'form', 'three', 'small',
  'set', 'put', 'end', 'does', 'another', 'well', 'large', 'must', 'big',
  'even', 'such', 'because', 'turn', 'here', 'why', 'ask', 'went', 'men',
  'read', 'need', 'land', 'different', 'home', 'move', 'try', 'kind', 'hand',
  'picture', 'again', 'change', 'off', 'play', 'spell', 'air', 'away',
  'animal', 'house', 'point', 'page', 'letter', 'mother', 'answer', 'found',
  'study', 'still', 'learn', 'should', 'world', 'high', 'every', 'near',
  'add', 'food', 'between', 'own', 'below', 'country', 'plant', 'last',
  'school', 'father', 'keep', 'tree', 'never', 'start', 'city', 'earth',
  'eye', 'light', 'thought', 'head', 'under', 'story', 'saw', 'left', 'few',
  'while', 'along', 'might', 'close', 'something', 'seem', 'next', 'hard',
  'open', 'example', 'begin', 'life', 'always', 'those', 'both', 'paper',
  'together', 'got', 'group', 'often', 'run', 'important', 'until', 'children',
  'side', 'feet', 'car', 'mile', 'night', 'walk', 'white', 'sea', 'began',
  'grow', 'took', 'river', 'four', 'carry', 'state', 'once', 'book', 'hear',
  'stop', 'without', 'second', 'later', 'miss', 'idea', 'enough', 'eat',
  'face', 'watch', 'far', 'real', 'almost', 'let', 'above', 'girl',
  'sometimes', 'mountain', 'cut', 'young', 'talk', 'soon', 'list', 'song',
  'being', 'leave', 'family', 'music', 'friend', 'money', 'story', 'happy',
];

/** A fresh random stream. Words may repeat — that is true of every typing test. */
export function dealWords(n = LOOKAHEAD) {
  const out = [];
  for (let i = 0; i < n; i++) out.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  return out;
}

/*
  Net WPM, the figure every other typing test reports: one "word" is five
  characters, and only correctly typed words count. Using raw keystrokes
  instead would let someone score 120 by mashing one key, which is the classic
  way these tests get gamed.
*/
export function wpmFrom(correctChars, elapsedSec) {
  if (elapsedSec <= 0) return 0;
  return Math.round((correctChars / 5) / (elapsedSec / 60));
}

export function accuracyFrom(correctChars, typedChars) {
  if (typedChars <= 0) return 100;
  return Math.round((correctChars / typedChars) * 100);
}

export function rankFor(wpm) {
  if (wpm >= 100) return { label: 'Genuinely Fast', blurb: 'Professional-transcriptionist territory.' };
  if (wpm >= 80) return { label: 'Very Quick', blurb: 'Well above almost everyone you know.' };
  if (wpm >= 60) return { label: 'Sharp', blurb: 'Comfortably above the average of about 40.' };
  if (wpm >= 40) return { label: 'Average', blurb: 'Right where most adults land.' };
  if (wpm >= 25) return { label: 'Steady', blurb: 'Accuracy first — speed follows on its own.' };
  return { label: 'Warming Up', blurb: 'Try not to look at the keyboard. It really does help.' };
}
