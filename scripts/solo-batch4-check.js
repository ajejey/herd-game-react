#!/usr/bin/env node
/*
  Typing Test / Click Speed / Number Memory — scoring integrity check.

  These three games are pure maths with no content bank, so the thing that can
  quietly go wrong is not bad data but a wrong formula: a WPM figure that can be
  gamed, a CPS that does not divide by the real duration, or a digit-span number
  that is off by one. All three would look perfectly plausible on screen.

  The data modules are ES modules; rather than add a build step just for a check
  script, the `export ` keywords are stripped and the body is evaluated.

  Run: node scripts/solo-batch4-check.js
*/
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function load(dir, file) {
  const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', dir, file), 'utf8');
  const ctx = { module: {}, exports: {} };
  vm.createContext(ctx);
  // `export function f` -> a plain declaration, which lands on the context.
  // `export const X` must become an assignment: a top-level `const` is lexical
  // and would NOT appear on the context object, so every constant would read as
  // undefined and any loop bounded by one would silently run zero times —
  // which is exactly what the first version of this script did.
  vm.runInContext(
    src.replace(/^export const /gm, 'globalThis.').replace(/^export /gm, ''),
    ctx,
  );
  return ctx;
}

let failures = 0;
const fail = (m) => { console.log('  FAIL  ' + m); failures++; };
const ok = (m) => console.log('  ok    ' + m);

/* ------------------------------ TYPING TEST ------------------------------ */
console.log('\n=== Typing Speed Test ===');
{
  const t = load('typing', 'typingData.js');

  // Net WPM: 5 chars = 1 word. 300 correct chars in 60s must be exactly 60.
  if (t.wpmFrom(300, 60) !== 60) fail(`wpmFrom(300,60) = ${t.wpmFrom(300, 60)}, expected 60`);
  else ok('300 correct chars in 60s = 60 WPM');

  if (t.wpmFrom(0, 60) !== 0) fail('an empty run must score 0, not NaN');
  else ok('empty run scores 0');

  if (t.wpmFrom(100, 0) !== 0) fail('a zero-length run must not divide by zero');
  else ok('zero elapsed does not divide by zero');

  // The anti-gaming property: correct chars drive the score, so typing rubbish
  // (which never lands in correctChars) cannot raise WPM at all.
  if (t.wpmFrom(0, 60) >= t.wpmFrom(300, 60)) fail('typing nothing correct must not beat a real run');
  else ok('WPM cannot be gamed by incorrect keystrokes');

  if (t.accuracyFrom(0, 0) !== 100) fail('accuracy with no input should read 100, not NaN');
  else ok('accuracy with no input is 100');
  if (t.accuracyFrom(50, 100) !== 50) fail('accuracyFrom(50,100) should be 50');
  else ok('accuracy is a straight percentage');

  const words = t.dealWords(500);
  if (words.length !== 500) fail(`dealWords(500) returned ${words.length}`);
  else ok('dealWords returns the requested count');
  const bad = words.filter((w) => !/^[a-z]+$/.test(w));
  if (bad.length) fail(`words must be lowercase a-z only: ${[...new Set(bad)].slice(0, 5).join(', ')}`);
  else ok('every word is lowercase letters only (no capitals for a phone keyboard to fight)');
  const long = words.filter((w) => w.length > 9);
  if (long.length) fail(`words longer than 9 letters: ${[...new Set(long)].join(', ')}`);
  else ok('no word is awkwardly long');
  if (new Set(words).size < 50) fail('the bank is too small — the stream would feel repetitive');
  else ok(`bank has ${new Set(words).size} distinct words in a 500-word stream`);

  // Rank ladder must be continuous: every WPM 0..200 gets a label.
  for (let w = 0; w <= 200; w++) if (!t.rankFor(w)?.label) fail(`no rank for ${w} WPM`);
  ok('every WPM from 0 to 200 has a rank');
}

/* ---------------------------- CLICK SPEED TEST ---------------------------- */
console.log('\n=== Click Speed Test ===');
{
  const c = load('clickspeed', 'clickData.js');

  if (c.DURATION_MS !== 5000) fail(`duration is ${c.DURATION_MS}ms — 5000 is what other CPS tests use`);
  else ok('5 second duration matches the standard');

  const secs = c.DURATION_MS / 1000;
  if (c.cpsFrom(0) !== 0) fail('zero clicks must be 0 CPS');
  else ok('zero clicks is 0 CPS');
  if (c.cpsFrom(35) !== 7) fail(`cpsFrom(35) = ${c.cpsFrom(35)}, expected 7`);
  else ok('35 clicks in 5s = 7.00 CPS');
  if (c.cpsFrom(secs) !== 1) fail('one click per second must read 1');
  else ok('one click per second reads 1');

  // Monotonic: more clicks can never score lower.
  for (let n = 1; n <= 100; n++) {
    if (c.cpsFrom(n) < c.cpsFrom(n - 1)) { fail(`CPS went down from ${n - 1} to ${n} clicks`); break; }
  }
  ok('CPS rises monotonically with clicks');

  // Two decimal places, never a float artefact like 6.800000000000001.
  const messy = [];
  for (let n = 0; n <= 100; n++) {
    const s = String(c.cpsFrom(n));
    if ((s.split('.')[1] || '').length > 2) messy.push(`${n} -> ${s}`);
  }
  if (messy.length) fail(`float artefacts in CPS: ${messy.slice(0, 3).join(', ')}`);
  else ok('no floating-point artefacts in any score from 0 to 100 clicks');

  for (let v = 0; v <= 25; v += 0.5) if (!c.rankFor(v)?.label) fail(`no rank for ${v} CPS`);
  ok('every CPS from 0 to 25 has a rank');
}

/* --------------------------- NUMBER MEMORY TEST --------------------------- */
console.log('\n=== Number Memory Test ===');
{
  const n = load('numbermemory', 'numberData.js');

  for (let d = n.START_DIGITS; d <= 24; d++) {
    for (let i = 0; i < 200; i++) {
      const s = n.buildNumber(d);
      if (s.length !== d) { fail(`buildNumber(${d}) returned ${s.length} digits`); d = 99; break; }
      if (!/^[0-9]+$/.test(s)) { fail(`buildNumber(${d}) returned non-digits: ${s}`); d = 99; break; }
      // A leading zero is easy to drop when reading back and is not a memory
      // failure — it would just look like the game marked a correct answer wrong.
      if (s[0] === '0') { fail(`buildNumber(${d}) produced a leading zero: ${s}`); d = 99; break; }
    }
  }
  if (!failures) ok('4,400 generated numbers: right length, digits only, never a leading zero');

  // Display time must grow with length, or past ~7 digits it becomes a reading
  // speed test rather than a memory test.
  let mono = true;
  for (let d = n.START_DIGITS; d < 24; d++) if (n.showMsFor(d + 1) <= n.showMsFor(d)) mono = false;
  if (!mono) fail('display time must increase with digit count');
  else ok(`display time grows with length (${n.showMsFor(3)}ms at 3 digits, ${n.showMsFor(12)}ms at 12)`);

  if (n.showMsFor(n.START_DIGITS) < 1000) fail('the first number flashes too briefly to read');
  else ok('the opening number is on screen long enough to read');

  for (let d = 0; d <= 30; d++) if (!n.rankFor(d)?.label) fail(`no rank for ${d} digits`);
  ok('every digit count from 0 to 30 has a rank');
}

console.log(failures ? `\n${failures} FAILURE(S)\n` : '\nAll checks passed.\n');
process.exit(failures ? 1 : 0);
