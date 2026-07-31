#!/usr/bin/env node
/*
  Higher or Lower — bank generator.

  Pulls factual quantities from Wikidata (CC0, so there is no licensing problem
  for an ad-supported site) and writes a generated bank JSON that the game
  merges with the hand-curated categories.

  Run:  node scripts/generate-hl-bank.js
  Out:  src/components/higherlower/hlBank.generated.json

  DESIGN NOTE — why we order by sitelinks, not by value:
  A guessing game only works if the player recognises BOTH items. Ordering by
  "tallest" or "most populous" surfaces obscure entries (regional towers, cities
  nobody outside the country has heard of). Ordering by the number of Wikipedia
  language editions that cover the item is a good proxy for fame, so we take the
  most famous N that have the property we need.

  Wikidata asks for a descriptive User-Agent and rate limiting; both below.
*/

const fs = require('fs');
const path = require('path');

const ENDPOINT = 'https://query.wikidata.org/sparql';
const UA = 'HerdGamesBankBuilder/1.0 (https://herdgamesonline.com; contact via site) node-fetch';
const OUT = path.join(__dirname, '..', 'src', 'components', 'higherlower', 'hlBank.generated.json');

const LIMIT = 600; // ask for more than we need; we filter hard afterwards

/* Each spec: the SPARQL, plus how the value should be read and displayed. */
const SPECS = [
  {
    id: 'population',
    label: 'Country population',
    question: 'Which country has MORE people?',
    unit: 'people',
    fmtKind: 'millions',
    glyph: '🌍',
    // Sovereign states with a population, most-covered first.
    sparql: `
      SELECT ?itemLabel ?v ?sl WHERE {
        ?item wdt:P31 wd:Q3624078 ;
              wdt:P1082 ?v ;
              wikibase:sitelinks ?sl .
        FILTER NOT EXISTS { ?item wdt:P31 wd:Q3024240 }
        FILTER (?v > 100000)
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      } ORDER BY DESC(?sl) LIMIT ${LIMIT}`,
    transform: (v) => Math.round((v / 1e6) * 10) / 10, // → millions, 1dp
    min: 0.05,
  },
  {
    id: 'citypop',
    label: 'City population',
    question: 'Which city has MORE people?',
    unit: 'people',
    fmtKind: 'millions',
    glyph: '🏙️',
    sparql: `
      SELECT ?itemLabel ?v ?sl WHERE {
        ?item wdt:P31/wdt:P279* wd:Q515 ;
              wdt:P1082 ?v ;
              wikibase:sitelinks ?sl .
        FILTER (?v > 300000)
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      } ORDER BY DESC(?sl) LIMIT ${LIMIT}`,
    transform: (v) => Math.round((v / 1e6) * 100) / 100,
    min: 0.3,
  },
  {
    id: 'height',
    label: 'Building height',
    question: 'Which is TALLER?',
    unit: 'm',
    fmtKind: 'meters',
    glyph: '🏗️',
    sparql: `
      # No P31/P279* traversal (too slow on WDQS). P2048 is also used for
      # people's height, but the >40m floor excludes every human.
      SELECT ?itemLabel ?v ?sl WHERE {
        VALUES ?cls { wd:Q11303 wd:Q12518 wd:Q41176 wd:Q12280 wd:Q1440476 }
        ?item wdt:P31 ?cls ;
              wdt:P2048 ?v ;
              wikibase:sitelinks ?sl .
        FILTER (?v > 40 && ?v < 1200)
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      } ORDER BY DESC(?sl) LIMIT ${LIMIT}`,
    transform: (v) => Math.round(v),
    min: 40,
  },
  {
    id: 'year',
    label: 'Movie release year',
    question: 'Which came out LATER?',
    unit: 'year',
    fmtKind: 'year',
    glyph: '🎬',
    sparql: `
      SELECT ?itemLabel ?v ?sl WHERE {
        ?item wikibase:sitelinks ?sl .
        FILTER (?sl > 35)
        ?item wdt:P31 wd:Q11424 ;
              wdt:P577 ?date .
        BIND(YEAR(?date) AS ?v)
        FILTER (?v > 1920 && ?v < 2026)
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      } ORDER BY DESC(?sl) LIMIT 4000`,
    transform: (v) => Math.round(v),
    min: 1920,
  },
  {
    id: 'elevation',
    label: 'Mountain height',
    question: 'Which mountain is HIGHER?',
    unit: 'm',
    fmtKind: 'meters',
    glyph: '⛰️',
    sparql: `
      SELECT ?itemLabel ?v ?sl WHERE {
        ?item wikibase:sitelinks ?sl .
        FILTER (?sl > 25)
        ?item wdt:P31 wd:Q8502 ;
              wdt:P2044 ?v .
        FILTER (?v > 300 && ?v < 9000)
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      } ORDER BY DESC(?sl) LIMIT ${LIMIT}`,
    transform: (v) => Math.round(v),
    min: 300,
  },
  {
    id: 'riverlength',
    label: 'River length',
    question: 'Which river is LONGER?',
    unit: 'km',
    fmtKind: 'km',
    glyph: '🌊',
    sparql: `
      SELECT ?itemLabel ?v ?sl WHERE {
        ?item wikibase:sitelinks ?sl .
        FILTER (?sl > 25)
        ?item wdt:P31 wd:Q4022 ;
              wdt:P2043 ?v .
        FILTER (?v > 50 && ?v < 7500)
        SERVICE wikibase:label { bd:serviceParam wikibase:language "en". }
      } ORDER BY DESC(?sl) LIMIT ${LIMIT}`,
    transform: (v) => Math.round(v),
    min: 50,
  },
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function runQuery(sparql, attempts = 3) {
  const url = `${ENDPOINT}?format=json&query=${encodeURIComponent(sparql)}`;
  let lastErr;
  for (let i = 1; i <= attempts; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/sparql-results+json' } });
      if (!res.ok) throw new Error(`SPARQL ${res.status} ${res.statusText}`);
      const json = await res.json();
      return json.results.bindings;
    } catch (e) {
      lastErr = e;
      // WDQS returns 500/502/504 under load; a short backoff usually clears it.
      if (i < attempts) await sleep(4000 * i);
    }
  }
  throw lastErr;
}

/* Reject rows that would make a bad round: unresolved Q-ids, disambiguation
   noise, absurd values, and duplicate names (Wikidata often has several
   population statements per city — we keep the first, which is the newest
   preferred rank in practice). */
function clean(rows, spec) {
  const seen = new Set();
  const out = [];
  for (const r of rows) {
    const n = r.itemLabel?.value?.trim();
    const raw = Number(r.v?.value);
    if (!n || !Number.isFinite(raw)) continue;
    if (/^Q\d+$/.test(n)) continue;            // label service failed
    if (n.length > 42) continue;               // unwieldy on a card
    if (/\(disambiguation\)|\bList of\b/i.test(n)) continue;
    const key = n.toLowerCase();
    if (seen.has(key)) continue;
    const v = spec.transform(raw);
    if (!Number.isFinite(v) || v < spec.min) continue;
    seen.add(key);
    out.push({ n, v });
    if (out.length >= 500) break;
  }
  return out;
}

(async () => {
  const categories = [];
  for (const spec of SPECS) {
    process.stdout.write(`  ${spec.id} … `);
    try {
      const rows = await runQuery(spec.sparql);
      const items = clean(rows, spec);
      if (items.length < 30) {
        console.log(`SKIPPED (only ${items.length} usable rows)`);
        continue;
      }
      categories.push({
        id: spec.id,
        label: spec.label,
        question: spec.question,
        unit: spec.unit,
        fmtKind: spec.fmtKind,
        glyph: spec.glyph,
        items,
      });
      const pairs = (items.length * (items.length - 1)) / 2;
      console.log(`${items.length} items (~${pairs.toLocaleString()} possible matchups)`);
    } catch (e) {
      console.log(`FAILED — ${e.message}`);
    }
    await sleep(1200); // be polite to WDQS
  }

  if (!categories.length) {
    console.error('\nNo categories generated — leaving the existing bank untouched.');
    process.exit(1);
  }

  /* REGRESSION GUARD.

     WDQS returns 500/502/504 under load, and a run where three of six
     categories time out would otherwise overwrite a good bank with a smaller
     one — silently shipping a degraded game with no way back, since the old
     file is gone. So refuse to shrink the bank unless explicitly forced.

     Run with --force to override (e.g. when deliberately removing a category). */
  const newItems = categories.reduce((s, c) => s + c.items.length, 0);
  let prev = null;
  try { prev = JSON.parse(fs.readFileSync(OUT, 'utf8')); } catch { /* no existing bank */ }

  if (prev?.categories?.length && !process.argv.includes('--force')) {
    const prevCats = prev.categories.length;
    const prevItems = prev.categories.reduce((s, c) => s + c.items.length, 0);
    if (categories.length < prevCats || newItems < prevItems * 0.9) {
      console.error(
        `\nREFUSING TO WRITE — this run is worse than the bank on disk.\n` +
        `  on disk: ${prevCats} categories, ${prevItems} items\n` +
        `  this run: ${categories.length} categories, ${newItems} items\n` +
        `Wikidata was probably rate-limiting. Re-run in a few minutes, or pass --force.`,
      );
      process.exit(1);
    }
  }

  fs.writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), categories }, null, 0));
  const total = categories.reduce((s, c) => s + c.items.length, 0);
  console.log(`\nWrote ${categories.length} categories, ${total} items → ${path.relative(process.cwd(), OUT)}`);
})();
