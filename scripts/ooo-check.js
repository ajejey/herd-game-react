#!/usr/bin/env node
/*
  Odd One Out — data integrity check.

  A round is only fair if the odd item cannot plausibly belong to the main
  group. The cheapest way that breaks is an item appearing in two groups (e.g.
  "Cricket" as both an insect and a sport), which this asserts against.

  Run: node scripts/ooo-check.js
*/
const fs = require('fs');
const path = require('path');

const src = fs.readFileSync(
  path.join(__dirname, '..', 'src', 'components', 'oddoneout', 'oddData.js'), 'utf8',
);

const groups = [...src.matchAll(/id: '([a-z]+)',\s+label: '([^']+)',\s+items: \[([^\]]+)\]/g)]
  .map((m) => ({
    id: m[1],
    label: m[2],
    items: m[3].split(',').map((s) => s.trim().replace(/'/g, '')).filter(Boolean),
  }));

let failures = 0;
const fail = (msg) => { console.log('  FAIL  ' + msg); failures++; };

console.log(`${groups.length} groups, ${groups.reduce((s, g) => s + g.items.length, 0)} items\n`);

const seen = new Map();
for (const g of groups) {
  if (g.items.length < 7) fail(`${g.id}: only ${g.items.length} items — needs 7+ for variety`);
  const local = new Set();
  for (const it of g.items) {
    const k = it.toLowerCase();
    if (local.has(k)) fail(`${g.id}: "${it}" listed twice`);
    local.add(k);
    if (seen.has(k)) fail(`"${it}" is in both ${seen.get(k)} and ${g.id} — ambiguous round`);
    else seen.set(k, g.id);
  }
}

const pairs = groups.length * (groups.length - 1);
console.log(`${pairs} group pairings; every pairing yields many distinct rounds.`);
console.log(failures ? `\n${failures} FAILURE(S)` : '\nAll checks passed.');
process.exit(failures ? 1 : 0);
