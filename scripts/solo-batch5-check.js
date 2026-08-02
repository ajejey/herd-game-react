#!/usr/bin/env node
/*
  Visual Memory / Aim Trainer / Verbal Memory — logic integrity check.

  Each of these has one property that is easy to get wrong and impossible to
  see on screen:

    - Visual Memory: a pattern must never ask for more squares than the board
      has, and must never be so dense that the GAPS become the pattern.
    - Aim Trainer:   LOWER is better, so the "is this a new best" comparison is
      inverted relative to every other game in the hub. Written the usual way
      round it would record your worst run and never update again.
    - Verbal Memory: the seen/new draw must stay near 50/50, or the test can be
      beaten by mashing one button forever. It must also terminate once the
      word bank is exhausted rather than hunting for an unseen word that no
      longer exists.

  Run: node scripts/solo-batch5-check.js
*/
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function load(dir, file) {
  const src = fs.readFileSync(path.join(__dirname, '..', 'src', 'components', dir, file), 'utf8');
  const ctx = { module: {}, exports: {} };
  vm.createContext(ctx);
  vm.runInContext(src.replace(/^export const /gm, 'globalThis.').replace(/^export /gm, ''), ctx);
  return ctx;
}

let failures = 0;
const fail = (m) => { console.log('  FAIL  ' + m); failures++; };
const ok = (m) => console.log('  ok    ' + m);

/* ----------------------------- VISUAL MEMORY ----------------------------- */
console.log('\n=== Visual Memory Test ===');
{
  const v = load('visualmemory', 'visualData.js');
  let bad = 0;
  for (let lv = 1; lv <= 40; lv++) {
    const g = v.gridFor(lv);
    const n = v.countFor(lv);
    if (n > g * g) { fail(`level ${lv}: ${n} squares on a ${g}x${g} board`); bad++; break; }
    if (n > g * g - 2) { fail(`level ${lv}: ${n}/${g * g} leaves too few gaps`); bad++; break; }
    if (n < 3) { fail(`level ${lv}: only ${n} squares`); bad++; break; }
    const p = v.buildPattern(lv);
    if (p.length !== n) { fail(`level ${lv}: pattern has ${p.length}, expected ${n}`); bad++; break; }
    if (new Set(p).size !== p.length) { fail(`level ${lv}: pattern repeats a cell`); bad++; break; }
    if (p.some((c) => c < 0 || c >= g * g)) { fail(`level ${lv}: cell outside the board`); bad++; break; }
  }
  if (!bad) ok('levels 1-40: pattern fits the board, no repeats, always some gaps');

  // Difficulty must never go backwards.
  let mono = true;
  for (let lv = 1; lv < 40; lv++) if (v.countFor(lv + 1) < v.countFor(lv)) mono = false;
  if (!mono) fail('square count must never decrease as levels rise');
  else ok(`square count rises monotonically (L1=${v.countFor(1)}, L10=${v.countFor(10)}, L20=${v.countFor(20)})`);

  if (v.gridFor(1) !== 3) fail(`opening board is ${v.gridFor(1)}x, expected 3x3`);
  else ok('opens on a 3x3 board');
  for (let lv = 0; lv <= 60; lv++) if (!v.rankFor(lv)?.label) fail(`no rank for level ${lv}`);
  ok('every level 0-60 has a rank');
}

/* ------------------------------ AIM TRAINER ------------------------------ */
console.log('\n=== Aim Trainer ===');
{
  const a = load('aim', 'aimData.js');

  if (a.averageMs(30000, 30) !== 1000) fail(`averageMs(30000,30) = ${a.averageMs(30000, 30)}, expected 1000`);
  else ok('30s across 30 targets = 1000ms each');
  if (a.averageMs(1000, 0) !== 0) fail('zero hits must not divide by zero');
  else ok('zero hits does not divide by zero');

  // Targets must always sit fully inside the board, or one is unhittable and
  // the run can never end.
  const half = a.TARGET_PCT / 2;
  let out = 0;
  for (let i = 0; i < 20000; i++) {
    const s = a.randomSpot();
    if (s.x < half - 1e-9 || s.x > 100 - half + 1e-9 || s.y < half - 1e-9 || s.y > 100 - half + 1e-9) out++;
  }
  if (out) fail(`${out} of 20000 targets fell outside the board`);
  else ok('20,000 targets all sit fully inside the board (never clipped, always hittable)');

  // LOWER IS BETTER — the ranks must improve as the number falls.
  const ladder = [300, 450, 550, 700, 900, 1500].map((ms) => a.rankFor(ms).label);
  if (new Set(ladder).size !== ladder.length) fail(`rank ladder is not distinct across speeds: ${ladder.join(' / ')}`);
  else ok(`faster times rank better: ${ladder.join(' > ')}`);
  if (a.rankFor(300).label === a.rankFor(1500).label) fail('a 300ms run must not rank the same as a 1500ms run');
  else ok('a fast run and a slow run do not share a rank');
  for (let ms = 100; ms <= 3000; ms += 50) if (!a.rankFor(ms)?.label) fail(`no rank for ${ms}ms`);
  ok('every time from 100ms to 3000ms has a rank');
}

/* ----------------------------- VERBAL MEMORY ----------------------------- */
console.log('\n=== Verbal Memory Test ===');
{
  const b = load('verbal', 'verbalData.js');

  if (b.WORD_COUNT < 150) fail(`only ${b.WORD_COUNT} words — the bank is too small`);
  else ok(`${b.WORD_COUNT} words in the bank`);

  // Simulate a long run and check the seen/new split stays near even. A split
  // far from 50/50 means one button is nearly always right.
  let seen = [];
  let seenCount = 0;
  const N = 4000;
  for (let i = 0; i < N; i++) {
    const { word, isSeen } = b.nextWord(seen);
    if (typeof word !== 'string' || !word) { fail(`nextWord returned no word at step ${i}`); break; }
    if (isSeen && !seen.includes(word)) { fail(`"${word}" reported as SEEN but is not in the seen list`); break; }
    if (!isSeen && seen.includes(word)) { fail(`"${word}" reported as NEW but was already seen`); break; }
    if (isSeen) seenCount++;
    else seen = [...seen, word];
    if (seen.length > b.WORD_COUNT) { fail('seen list grew past the size of the bank'); break; }
  }
  const pct = Math.round((seenCount / N) * 100);
  ok(`over ${N} draws the truth flag never once contradicted the seen list (SEEN ${pct}%)`);

  /*
    The 4000-draw share above is NOT the number that matters: past ~282 draws
    the bank is exhausted and every draw is forced to be a repeat, which drags
    it towards 100%. Real runs end between 15 and 50, so measure the split
    where players actually are, and check that blind-mashing one button is not
    a viable strategy there.
  */
  let mashWins = 0;
  const RUNS = 2000;
  const LEN = 50;
  for (let r = 0; r < RUNS; r++) {
    let s = [];
    for (let i = 0; i < LEN; i++) {
      const x = b.nextWord(s);
      if (!x.isSeen) { mashWins++; s = [...s, x.word]; }
    }
  }
  const mashPct = Math.round((mashWins / (RUNS * LEN)) * 100);
  // Always answering NEW must not be close to always right. At ~58% a masher
  // loses three lives within about eight answers, which is the point.
  if (mashPct > 75) fail(`answering NEW every time is right ${mashPct}% of the time in the first ${LEN} — too easy to game`);
  else ok(`in the first ${LEN} draws, blind-mashing NEW is right only ${mashPct}% of the time`);

  // The exhausted-bank case: with every word already seen, it must still return
  // a word rather than loop forever hunting for an unseen one.
  const all = [];
  let s2 = [];
  for (let i = 0; i < b.WORD_COUNT * 3; i++) {
    const r = b.nextWord(s2);
    if (!r.isSeen) s2 = [...s2, r.word];
    all.push(r.word);
  }
  if (all.some((w) => !w)) fail('nextWord returned an empty word once the bank was exhausted');
  else ok('still returns a word after the whole bank has been seen (no infinite hunt)');

  const words = all.filter(Boolean);
  if (words.some((w) => !/^[a-z]+$/.test(w))) fail('words must be lowercase a-z only');
  else ok('every word is lowercase letters only');

  for (let s = 0; s <= 200; s++) if (!b.rankFor(s)?.label) fail(`no rank for score ${s}`);
  ok('every score 0-200 has a rank');
}

console.log(failures ? `\n${failures} FAILURE(S)\n` : '\nAll checks passed.\n');
process.exit(failures ? 1 : 0);
