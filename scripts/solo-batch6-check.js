#!/usr/bin/env node
/*
  Hangman / Minesweeper — logic integrity check.

  Minesweeper is the most rule-heavy game in the hub and almost all of its
  rules fail SILENTLY — a board that is subtly wrong still looks like a board:

    - First tap must never be a mine, and must never even touch one, or the
      opening move is a coin flip the player cannot influence.
    - Adjacency counts must match the mines actually laid, or the numbers are
      lies and the game is unsolvable by deduction.
    - The flood fill must open every connected zero exactly once and stop at
      numbered cells — an over-eager fill reveals the whole board, a lazy one
      leaves the player tapping hundreds of cells.
    - The win condition must be "all non-mine cells revealed", not "all cells".

  Hangman's trap is quieter: any word containing a character the keyboard does
  not offer can never be completed, so the game would hang forever.

  Run: node scripts/solo-batch6-check.js
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

/* -------------------------------- HANGMAN -------------------------------- */
console.log('\n=== Hangman ===');
{
  const h = load('hangman', 'hangmanData.js');
  const all = h.CATEGORIES.flatMap((c) => c.words);

  const bad = all.filter((w) => !/^[A-Z]+$/.test(w));
  // A word with a space, hyphen or accent could never be completed, because
  // the on-screen keyboard only offers A-Z. The game would simply never end.
  if (bad.length) fail(`words containing non A-Z characters (unwinnable): ${bad.join(', ')}`);
  else ok(`all ${all.length} words are A-Z only, so every word is completable`);

  const dupes = all.filter((w, i) => all.indexOf(w) !== i);
  if (dupes.length) fail(`duplicate words: ${[...new Set(dupes)].join(', ')}`);
  else ok('no duplicate words across categories');

  const short = all.filter((w) => w.length < 4);
  if (short.length) fail(`words shorter than 4 letters are trivial: ${short.join(', ')}`);
  else ok('every word is at least 4 letters');

  for (const c of h.CATEGORIES) {
    if (c.words.length < 15) fail(`category "${c.name}" has only ${c.words.length} words`);
  }
  ok(`${h.CATEGORIES.length} categories, ${h.WORD_COUNT} words, none thin`);

  // Solving must be reachable: guessing every distinct letter always solves.
  let unsolvable = 0;
  for (const w of all) {
    const distinct = [...new Set(w.split(''))];
    if (!h.isSolved(w, distinct)) unsolvable++;
    if (h.isSolved(w, distinct.slice(0, -1)) && distinct.length > 1) unsolvable++;
  }
  if (unsolvable) fail(`${unsolvable} words mis-report solved state`);
  else ok('isSolved is exact: complete on all distinct letters, not before');

  const m = h.maskWord('BADGER', ['B', 'E']);
  if (JSON.stringify(m) !== JSON.stringify(['B', null, null, null, 'E', null])) fail(`maskWord wrong: ${JSON.stringify(m)}`);
  else ok('maskWord reveals only guessed letters');
}

/* ------------------------------ MINESWEEPER ------------------------------ */
console.log('\n=== Minesweeper ===');
{
  const m = load('minesweeper', 'mineData.js');

  for (const lv of m.LEVELS) {
    const total = lv.cols * lv.rows;
    if (lv.mines >= total * 0.35) fail(`${lv.name}: ${lv.mines}/${total} is too dense to be solvable`);
    if (lv.cols > 12) fail(`${lv.name}: ${lv.cols} columns will not fit a phone screen`);
  }
  ok(`${m.LEVELS.length} levels, all phone-width and sanely dense`);

  // The core guarantee, checked exhaustively: for EVERY opening cell on every
  // board, that cell and all its neighbours must be mine-free.
  let unsafe = 0;
  let miscount = 0;
  for (const lv of m.LEVELS) {
    const total = lv.cols * lv.rows;
    for (let safe = 0; safe < total; safe++) {
      const laid = m.layMines(lv, safe);
      if (laid.mines.has(safe)) { unsafe++; break; }
      for (const n of m.neighbours(safe, lv.cols, lv.rows)) {
        if (laid.mines.has(n)) { unsafe++; break; }
      }
      // Counts must equal the mines actually laid, or the numbers lie.
      for (let i = 0; i < total; i++) {
        if (laid.mines.has(i)) { if (laid.counts[i] !== -1) miscount++; continue; }
        const real = m.neighbours(i, lv.cols, lv.rows).filter((n) => laid.mines.has(n)).length;
        if (laid.counts[i] !== real) { miscount++; break; }
      }
    }
  }
  if (unsafe) fail(`${unsafe} opening cells were laid on or beside a mine`);
  else ok('every opening cell on every board is safe AND opens a pocket (exhaustive)');
  if (miscount) fail(`${miscount} cells report the wrong adjacent-mine count`);
  else ok('every adjacency number matches the mines actually laid');

  // Flood fill: from a zero it must open all connected zeros and their border,
  // stop at numbers, and never cross a flag.
  const lv = m.LEVELS[0];
  const total = lv.cols * lv.rows;
  let floodBad = 0;
  for (let t = 0; t < 300; t++) {
    const safe = Math.floor(Math.random() * total);
    const laid = m.layMines(lv, safe);
    const opened = m.floodReveal(safe, laid.counts, new Set(), new Set(), lv.cols, lv.rows);
    if (![...opened].every((i) => !laid.mines.has(i))) { floodBad++; break; }        // never opens a mine
    if (!opened.has(safe)) { floodBad++; break; }                                     // always opens the tap
    // Every opened ZERO must have opened all of its neighbours.
    for (const i of opened) {
      if (laid.counts[i] !== 0) continue;
      if (!m.neighbours(i, lv.cols, lv.rows).every((n) => opened.has(n))) { floodBad++; break; }
    }
  }
  if (floodBad) fail('flood fill opened a mine, skipped the tapped cell, or stopped short of a zero border');
  else ok('300 floods: never opens a mine, always completes every zero region');

  // A flag must block the fill — otherwise a flagged mine gets auto-revealed.
  const laid = m.layMines(lv, 0);
  const flag = new Set([1, lv.cols]);
  const opened = m.floodReveal(0, laid.counts, new Set(), flag, lv.cols, lv.rows);
  if ([...flag].some((f) => opened.has(f))) fail('flood fill opened a flagged cell');
  else ok('flood fill never opens a flagged cell');

  // Win condition: all non-mine cells, NOT all cells.
  const allNonMine = new Set();
  for (let i = 0; i < total; i++) if (!laid.mines.has(i)) allNonMine.add(i);
  if (!m.hasWon(allNonMine, laid.mines, total)) fail('clearing every safe cell did not register as a win');
  else ok('clearing every safe cell wins (mines need not be uncovered)');
  const oneShort = new Set([...allNonMine].slice(0, -1));
  if (m.hasWon(oneShort, laid.mines, total)) fail('a board one cell short registered as won');
  else ok('one cell short is not a win');

  for (const l of m.LEVELS) for (const s of [1, 30, 120, 600]) if (!m.rankFor(s, l.id)?.label) fail(`no rank for ${s}s on ${l.id}`);
  ok('every level and time has a rank');
}

console.log(failures ? `\n${failures} FAILURE(S)\n` : '\nAll checks passed.\n');
process.exit(failures ? 1 : 0);
