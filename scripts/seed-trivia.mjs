/*
  Seed / top up the Daily Trivia question bank from the Open Trivia Database.

  Why: the daily game needs a large pool so it never repeats for weeks. Rather
  than hand-adding questions every month, run this to (re)generate
  src/components/trivia/bank.generated.json from OpenTDB (free, CC BY-SA 4.0,
  commercial use allowed WITH attribution — the attribution string is written
  into the file and shown on the page).

  Usage (needs network):
    node scripts/seed-trivia.mjs            # ~470+ questions
    TRIVIA_TARGET=800 node scripts/seed-trivia.mjs

  OpenTDB limits: max 50 questions/request, ~1 request / 5 seconds. The script
  paces itself and dedupes by question text. Re-running reshuffles the draw, so
  repeated runs grow/refresh the bank. Commit the regenerated JSON.
*/
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, '..', 'src', 'components', 'trivia', 'bank.generated.json');
const TARGET = Number(process.env.TRIVIA_TARGET) || 470;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const ENT = {
  '&quot;': '"', '&#039;': "'", '&amp;': '&', '&lt;': '<', '&gt;': '>', '&eacute;': 'é', '&Eacute;': 'É',
  '&egrave;': 'è', '&agrave;': 'à', '&uuml;': 'ü', '&ouml;': 'ö', '&auml;': 'ä', '&ntilde;': 'ñ',
  '&aacute;': 'á', '&iacute;': 'í', '&oacute;': 'ó', '&uacute;': 'ú', '&ccedil;': 'ç', '&hellip;': '…',
  '&rsquo;': "'", '&lsquo;': "'", '&ldquo;': '"', '&rdquo;': '"', '&deg;': '°', '&shy;': '',
  '&euml;': 'ë', '&Euml;': 'Ë', '&ecirc;': 'ê', '&Ecirc;': 'Ê', '&icirc;': 'î', '&ocirc;': 'ô',
  '&ucirc;': 'û', '&acirc;': 'â', '&ndash;': '–', '&mdash;': '—', '&Aacute;': 'Á', '&Uuml;': 'Ü',
  '&times;': '×', '&frac12;': '½', '&frac14;': '¼', '&frac34;': '¾', '&lrm;': '', '&rlm;': '',
  '&oslash;': 'ø', '&aring;': 'å', '&aelig;': 'æ', '&szlig;': 'ß', '&iexcl;': '¡', '&iquest;': '¿',
  '&ograve;': 'ò', '&igrave;': 'ì', '&ugrave;': 'ù', '&yacute;': 'ý', '&copy;': '©', '&reg;': '®', '&trade;': '™',
};
function decode(s) {
  for (const [k, v] of Object.entries(ENT)) s = s.split(k).join(v);
  return s.replace(/&#(\d+);/g, (m, n) => String.fromCharCode(+n));
}
const LEFTOVER = /&[a-zA-Z]+;|&#\d+;/;
function simpCat(c) {
  c = decode(c);
  if (c.includes(':')) c = c.split(':')[1].trim();
  const map = { 'Video Games': 'Games', 'Board Games': 'Games', 'Musicals & Theatres': 'Theatre', 'Japanese Anime & Manga': 'Anime', 'Cartoon & Animations': 'Cartoons', 'Science & Nature': 'Science', Gadgets: 'Science', Computers: 'Science', Mathematics: 'Science', 'General Knowledge': 'General', Sports: 'Sport' };
  return map[c] || c;
}
const dMap = { easy: 0, medium: 1, hard: 2 };

async function main() {
  const seen = new Set();
  const out = [];
  // Merge with the existing bank so each run GROWS it toward OpenTDB's full set,
  // rather than replacing it. (Re-running monthly steadily expands coverage.)
  try {
    const prev = JSON.parse(fs.readFileSync(OUT, 'utf8'));
    for (const q of prev.questions || []) {
      const key = (q.q || '').trim().toLowerCase();
      if (key && !seen.has(key)) { seen.add(key); out.push(q); }
    }
    console.log(`Loaded ${out.length} existing questions; growing from there.`);
  } catch (e) { /* first run — no existing file */ }
  const startCount = out.length;
  // Each run aims to add a batch of new questions (or reach TARGET, whichever is more).
  const effTarget = Math.max(TARGET, startCount + 150);
  await sleep(1000);
  for (let calls = 0; calls < 30 && out.length < effTarget; calls++) {
    let j;
    try {
      const r = await fetch('https://opentdb.com/api.php?amount=50&type=multiple');
      j = await r.json();
    } catch (e) { await sleep(5500); continue; }
    if (j.response_code === 0 && j.results) {
      for (const r of j.results) {
        const q = decode(r.question).trim();
        const correct = decode(r.correct_answer).trim();
        const wrong = (r.incorrect_answers || []).map((x) => decode(x).trim());
        if (wrong.length !== 3) continue;
        const opts = [correct, ...wrong];
        if (q.length > 180 || q.length < 5) continue;
        if (opts.some((o) => !o || o.length > 60)) continue;
        if (new Set(opts.map((o) => o.toLowerCase())).size !== 4) continue;
        if ([q, ...opts].some((s) => LEFTOVER.test(s))) continue;
        const key = q.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ q, options: opts, category: simpCat(r.category), difficulty: dMap[r.difficulty] ?? 1, source: 'opentdb' });
      }
    }
    await sleep(5500);
  }
  const payload = {
    generatedAt: new Date().toISOString().slice(0, 10),
    attribution: 'Questions from the Open Trivia Database (opentdb.com), CC BY-SA 4.0',
    count: out.length,
    questions: out,
  };
  fs.writeFileSync(OUT, JSON.stringify(payload, null, 1));
  console.log(`Wrote ${out.length} questions (+${out.length - startCount} new) to ${OUT}`);
}
main();
