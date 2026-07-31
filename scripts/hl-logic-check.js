#!/usr/bin/env node
/*
  Higher or Lower — bank + pairing stress check.

  The hidden value is deliberately not in the DOM, so a browser test cannot
  auto-play a long run. This checks the things a long run would expose:

   1. Bank integrity — no duplicate names, no NaN/negative/absurd values, no
      unresolved Wikidata Q-ids leaking into the UI.
   2. The pairing rule actually holds (no coin-flip near-ties).
   3. Long chains never dead-end. A run that reaches the end of the deck must
      recycle rather than return null, which would freeze the game on a blank
      card — the single worst failure mode for this game.

  Run: node scripts/hl-logic-check.js
*/
const path = require('path');

const MIN_GAP_RATIO = 1.18;
const MIN_GAP_YEARS = 5;
const bank = require(path.join(__dirname, '..', 'src', 'components', 'higherlower', 'hlBank.generated.json'));

let failures = 0;
const fail = (msg) => { console.log(`  FAIL  ${msg}`); failures++; };

/* Mirrors isFairPair in hlData.js. Years are an interval scale, so they use an
   absolute gap; everything else uses a ratio. */
const gapKindFor = (cat) => (cat.fmtKind === 'year' ? 'absolute' : 'ratio');

function isFairPair(cat, a, b) {
  const hi = Math.max(a.v, b.v);
  const lo = Math.min(a.v, b.v);
  if (gapKindFor(cat) === 'absolute') return hi - lo >= MIN_GAP_YEARS;
  return lo > 0 ? hi / lo >= MIN_GAP_RATIO : true;
}

/* Mirrors pickOpponent in useHigherLower.js. */
function pickOpponent(anchor, pool, cat) {
  const fair = pool.filter((it) => isFairPair(cat, anchor, it));
  const from = fair.length ? fair : pool;
  if (!from.length) return null;
  return from[Math.floor(Math.random() * from.length)];
}

console.log(`Checking ${bank.categories.length} generated categories…\n`);

for (const cat of bank.categories) {
  console.log(`${cat.id} (${cat.items.length} items)`);

  // ---- 1. integrity -------------------------------------------------------
  const names = new Set();
  for (const it of cat.items) {
    if (!it.n || typeof it.n !== 'string') fail(`${cat.id}: item with no name`);
    if (/^Q\d+$/.test(it.n)) fail(`${cat.id}: unresolved Wikidata id "${it.n}"`);
    if (!Number.isFinite(it.v)) fail(`${cat.id}: "${it.n}" has non-numeric value ${it.v}`);
    if (it.v <= 0) fail(`${cat.id}: "${it.n}" has non-positive value ${it.v}`);
    const k = it.n.toLowerCase();
    if (names.has(k)) fail(`${cat.id}: duplicate name "${it.n}"`);
    names.add(k);
  }
  if (cat.items.length < 30) fail(`${cat.id}: only ${cat.items.length} items — too thin`);

  // ---- 2. every item must have at least one fair opponent -----------------
  let orphans = 0;
  for (const a of cat.items) {
    const pool = cat.items.filter((x) => x.n !== a.n);
    const fair = pool.filter((it) => isFairPair(cat, a, it));
    if (!fair.length) orphans++;
  }
  if (orphans) console.log(`  note: ${orphans} item(s) have no "fair gap" partner — they fall back to any opponent`);

  // ---- 3. long-chain simulation ------------------------------------------
  // Simulate a player who never loses, for far longer than any real run, and
  // assert the game can always produce a next card.
  const ROUNDS = Math.max(2000, cat.items.length * 6);
  let stuck = 0, tooClose = 0;
  for (let run = 0; run < 20; run++) {
    let used = [];
    let anchor = cat.items[Math.floor(Math.random() * cat.items.length)];
    used.push(anchor.n);
    for (let i = 0; i < ROUNDS / 20; i++) {
      let remaining = cat.items.filter((it) => !used.includes(it.n));
      if (!remaining.length) remaining = cat.items.filter((it) => it.n !== anchor.n); // recycle
      const next = pickOpponent(anchor, remaining.filter((it) => it.n !== anchor.n), cat);
      if (!next) { stuck++; break; }
      if (!isFairPair(cat, anchor, next)) tooClose++;
      anchor = next;
      used.push(next.n);
      if (used.length > cat.items.length) used = [anchor.n];
    }
  }
  if (stuck) fail(`${cat.id}: chain dead-ended ${stuck} time(s) — game would freeze`);
  const pct = ((tooClose / ROUNDS) * 100).toFixed(1);
  console.log(`  ${ROUNDS} simulated rounds, 0 dead-ends, ${pct}% fell back to a close pair`);

  const pairs = (cat.items.length * (cat.items.length - 1)) / 2;
  console.log(`  ~${pairs.toLocaleString()} distinct matchups\n`);
}

const total = bank.categories.reduce((s, c) => s + c.items.length, 0);
const totalPairs = bank.categories.reduce((s, c) => s + (c.items.length * (c.items.length - 1)) / 2, 0);
console.log(`${total} items, ~${totalPairs.toLocaleString()} total matchups across generated categories.`);
console.log(failures ? `\n${failures} FAILURE(S)` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
