#!/usr/bin/env node
/*
  Word Scramble — word list integrity check.

  Words are bucketed by length, and the game uses the bucket to ramp difficulty
  and to lay out the letter tiles. A word in the wrong bucket therefore breaks
  both. This caught five of them (PLOUGH and CHEESE filed as 5-letter, HARVEST
  as 6, ELEPHANT and MOUNTAIN as 7) on the first run.

  Also asserts scramble() never returns the original word, which would show the
  answer and read as a bug.

  Run: node scripts/scramble-check.js
*/
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'components', 'scramble', 'scrambleData.js'), 'utf8',
);

let failures = 0;
const fail = (m) => { console.log('  FAIL  ' + m); failures++; };

const buckets = [...src.matchAll(/\n  (\d): \[([^\]]+)\]/g)].map((m) => ({
  len: Number(m[1]),
  words: m[2].split(',').map((w) => w.trim().replace(/'/g, '')).filter(Boolean),
}));

let total = 0;
const seen = new Set();
for (const b of buckets) {
  total += b.words.length;
  if (b.words.length < 15) fail(`${b.len}-letter bucket has only ${b.words.length} words`);
  for (const w of b.words) {
    if (w.length !== b.len) fail(`"${w}" is ${w.length} letters but sits in the ${b.len}-letter bucket`);
    if (!/^[A-Z]+$/.test(w)) fail(`"${w}" must be uppercase A-Z only`);
    if (seen.has(w)) fail(`"${w}" appears twice`);
    seen.add(w);
  }
}

// scramble() must never hand back the original.
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function scramble(word) {
  const letters = word.split('');
  if (new Set(letters).size === 1) return letters;
  for (let i = 0; i < 30; i++) { const out = shuffle(letters); if (out.join('') !== word) return out; }
  return [...letters.slice(1), letters[0]];
}
let same = 0;
for (const b of buckets) for (const w of b.words) {
  for (let i = 0; i < 25; i++) if (scramble(w).join('') === w) same++;
}
if (same) fail(`scramble() returned the original word ${same} time(s) — the answer would be visible`);

console.log(`${buckets.length} buckets, ${total} words, ${seen.size} unique`);
console.log(failures ? `\n${failures} FAILURE(S)` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
