#!/usr/bin/env node
/*
  Which Game Should You Play? — recommendation integrity check.

  This quiz is the only page that points AT other games by id, so its failure
  mode is unique in the hub: rename or remove a game and the quiz keeps
  running, keeps looking correct, and quietly recommends something that no
  longer exists. Nothing on screen would reveal it until a player tapped
  "Play it now" and hit a 404.

  It also checks the quiz can actually reach a sensible answer for EVERY
  combination of answers, not just the ones a click-through happens to take.

  Run: node scripts/whichgame-check.js
*/
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function load(rel) {
  const src = fs.readFileSync(path.join(__dirname, '..', 'src', rel), 'utf8');
  const ctx = { module: {}, exports: {} };
  vm.createContext(ctx);
  vm.runInContext(src.replace(/^export const /gm, 'globalThis.').replace(/^export /gm, ''), ctx);
  return ctx;
}

let failures = 0;
const fail = (m) => { console.log('  FAIL  ' + m); failures++; };
const ok = (m) => console.log('  ok    ' + m);

const w = load('components/whichgame/whichData.js');
const reg = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'games.js'), 'utf8');
const ids = [...reg.matchAll(/^\s*id: '([^']+)'/gm)].map((m) => m[1]);

console.log('\n=== Which Game Should You Play? ===');

const refs = w.referencedIds();
const missing = refs.filter((r) => !ids.includes(r));
if (missing.length) fail(`recommends games that are NOT in the registry (dead links): ${missing.join(', ')}`);
else ok(`all ${refs.length} recommended ids exist in the registry of ${ids.length}`);

if (w.QUESTIONS.length < 5) fail(`only ${w.QUESTIONS.length} questions — too short to discriminate`);
else ok(`${w.QUESTIONS.length} questions`);

for (const q of w.QUESTIONS) {
  if (q.options.length < 2) fail(`"${q.q}" has fewer than 2 options`);
  for (const o of q.options) {
    if (!Object.keys(o.w).length) fail(`option "${o.label}" votes for nothing`);
  }
}
ok('every question has options and every option votes for at least one game');

/*
  Exhaustive: walk EVERY possible answer combination and check the quiz always
  produces a real, playable recommendation. With 4x3x4x3x3x4 combinations this
  is only a few hundred paths, so there is no reason to sample.
*/
const counts = w.QUESTIONS.map((q) => q.options.length);
const totalPaths = counts.reduce((a, b) => a * b, 1);
let paths = 0;
let empty = 0;
const winners = new Map();

const walk = (qi, acc) => {
  if (qi === w.QUESTIONS.length) {
    paths++;
    const ranked = w.scoreAnswers(acc);
    if (!ranked.length) { empty++; return; }
    const top = ranked[0];
    if (!ids.includes(top)) { fail(`answers ${acc.join('')} recommend "${top}", which is not a real game`); return; }
    winners.set(top, (winners.get(top) || 0) + 1);
    return;
  }
  for (let i = 0; i < counts[qi]; i++) walk(qi + 1, [...acc, i]);
};
walk(0, []);

if (empty) fail(`${empty} answer combinations produced NO recommendation at all`);
else ok(`all ${paths} possible answer combinations produce a real, playable game`);
if (paths !== totalPaths) fail(`walked ${paths} paths, expected ${totalPaths}`);

// Determinism: the same answers must always give the same result, or re-taking
// the quiz with identical answers would look broken.
const sample = counts.map(() => 0);
const a1 = w.scoreAnswers(sample).join(',');
const a2 = w.scoreAnswers(sample).join(',');
if (a1 !== a2) fail('the same answers gave different results — scoring is not deterministic');
else ok('scoring is deterministic for identical answers');

// A quiz that always says the same thing is not a quiz.
const distinct = winners.size;
if (distinct < 5) fail(`only ${distinct} distinct games are ever recommended across every path`);
else ok(`${distinct} different games can win, so the answers genuinely matter`);

const ranked = [...winners.entries()].sort((a, b) => b[1] - a[1]);
const topShare = Math.round((ranked[0][1] / paths) * 100);
if (topShare > 40) fail(`"${ranked[0][0]}" wins ${topShare}% of all paths — the quiz is lopsided`);
else ok(`most common result is "${ranked[0][0]}" at ${topShare}% of paths (not dominant)`);

console.log(failures ? `\n${failures} FAILURE(S)\n` : '\nAll checks passed.\n');
process.exit(failures ? 1 : 0);
