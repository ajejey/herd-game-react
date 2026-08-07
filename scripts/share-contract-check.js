/**
 * Guards the one rule that makes web sharing work.
 *
 *   node scripts/share-contract-check.js
 *
 * navigator.share() only succeeds while the click's transient user activation is
 * still live. Any `await` before the call spends it and Chrome throws
 * NotAllowedError — which is invisible in code review, invisible in a desktop
 * browser (where the clipboard fallback quietly takes over), and only shows up
 * as "the share button does nothing on my phone".
 *
 * That is exactly the bug that shipped: the daily card awaited
 * document.fonts.ready and a 1080x1080 canvas render before sharing.
 *
 * A unit test cannot catch it — the code is correct, just late. So this asserts
 * the SHAPE of the code instead:
 *   1. the exported share() must not be `async`
 *   2. no `await` may appear before a navigator.share call inside it
 *   3. navigator.share must still be preferred over the clipboard on web
 */
const fs = require('fs');
const path = require('path');

const FILE = path.join(__dirname, '..', 'src', 'lib', 'shareSheet.js');
const src = fs.readFileSync(FILE, 'utf8');

const problems = [];

// 1. share() must be synchronous up to the navigator.share call.
const decl = src.match(/export\s+(async\s+)?function\s+share\s*\(/);
if (!decl) {
  problems.push('could not find `export function share(` in shareSheet.js');
} else if (decl[1]) {
  problems.push(
    'share() is declared `async`. An async function resumes in a later microtask, ' +
    'which spends the user activation before navigator.share() is reached.'
  );
}

// 2. no await between the start of share() and its navigator.share calls
if (decl) {
  const start = src.indexOf(decl[0]);
  // crude but adequate: the body runs to the next top-level `function ` decl
  const rest = src.slice(start);
  const end = rest.indexOf('\nfunction ', 1);
  const body = end === -1 ? rest : rest.slice(0, end);

  const shareIdx = body.indexOf('navigator.share');
  if (shareIdx === -1) {
    problems.push('share() no longer calls navigator.share — web sharing would be dead.');
  } else {
    const before = body.slice(0, shareIdx);
    // `await` inside the native branch is fine: that branch returns before
    // reaching the web code, and Android has no activation requirement.
    const webBefore = before.split('// ---- web:')[1] ?? before;
    if (/\bawait\b/.test(webBefore)) {
      problems.push(
        'an `await` appears before navigator.share() on the web path. ' +
        'This is the exact defect that broke sharing on mobile — build anything ' +
        'expensive (like the share image) BEFORE the click and pass it in.'
      );
    }
  }
}

// 3. clipboard must remain a fallback, never the first choice on web.
const webBlock = src.split('// ---- web:')[1] || '';
const firstShare = webBlock.indexOf('navigator.share');
const firstCopy = webBlock.indexOf('copyFallback');
if (firstShare !== -1 && firstCopy !== -1 && firstCopy < firstShare) {
  problems.push(
    'the clipboard fallback is reached before navigator.share on the web path. ' +
    'Sharing must always be tried first; copying is for browsers without it.'
  );
}

if (problems.length) {
  console.error('share contract violated:\n');
  problems.forEach((p, i) => console.error(`  ${i + 1}. ${p}\n`));
  process.exit(1);
}

console.log('share contract ok:');
console.log('  - share() is synchronous up to navigator.share()');
console.log('  - no await precedes the web share call');
console.log('  - navigator.share is preferred; clipboard remains the fallback');
