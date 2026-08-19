/**
 * Guards the contract between our DOM and Mediavine's ad script.
 *
 *   node scripts/mediavine-selector-check.js          # checks build/ output
 *   node scripts/mediavine-selector-check.js --live   # checks herdgamesonline.com
 *
 * Mediavine only ever places an in-content ad inside the single element that
 * matches the `content_selector` stored on THEIR side. That value lives in a
 * vendor database we cannot edit and is not exposed anywhere in the publisher
 * dashboard — so it is an invariant spanning two systems with no owner in
 * either. Nothing in this repo referenced it, no test asserted it, and no error
 * is raised when it stops matching.
 *
 * That is exactly what happened. The selector was ".max-w-3xl.mx-auto.mt-16" —
 * three Tailwind utilities, i.e. a styling decision — and it matched nothing on
 * any route. From the ad tag going live on 11 Aug 2026 until this was found on
 * 18 Aug, the script loaded on every pageview, found no container, and served
 * nothing: 0 sessions and $0.00 page RPM on Mediavine's side, $1.92 earned
 * against roughly 62,000 pageviews. The site looked completely healthy
 * throughout. Someone nudging `mt-16` to `mt-12` for visual balance would have
 * done the same damage.
 *
 * The general statement that would have caught it, and which this asserts:
 *
 *   Every route meant to carry ads must give Mediavine somewhere to put one —
 *   either an element matching their configured content_selector, or at least
 *   one content_hint div of our own.
 *
 * Stated that way it survives Mediavine changing the selector, us restyling the
 * layout, and any individual page switching between automatic and hinted
 * placement. It also covers games that do not exist yet.
 */
const fs = require('fs');
const path = require('path');

const WRAPPER =
  'https://scripts.scriptwrapper.com/tags/5cfb4e63-a18f-450b-889c-733e3f6bd378.js';
const ORIGIN = 'https://herdgamesonline.com';

// Last known value, used only when the wrapper cannot be fetched (offline CI).
// If this drifts from what Mediavine actually serves, the --live run says so.
const PINNED_SELECTOR = '.max-w-3xl.mx-auto.mt-16';

// The stable, style-free hook we want Mediavine to repoint at. It must carry no
// CSS anywhere, which is the whole reason it cannot be broken by a restyle.
const STABLE_HOOK = 'mv-content';

/*
  Routes that must be monetisable. Deliberately not "all 116": these are the
  pages search traffic actually lands on plus the daily games, which is where
  the pageviews are. A route missing from this list is not exempt from the
  container check, it just is not a hard failure on its own.
*/
const MONETIZED = [
  '/', '/daily', '/trivia', '/scattergories', '/hot-takes', '/connections',
  '/aura', '/guess-the-year', '/team-trivia', '/office-games', '/faq',
  '/which-game-should-i-play', '/blog'
];

const problems = [];
const notes = [];
const live = process.argv.includes('--live');

const classSets = (html) =>
  [...html.matchAll(/class="([^"]*)"/g)].map((m) => new Set(m[1].trim().split(/\s+/)));

async function readSelector() {
  try {
    const res = await fetch(WRAPPER);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    const js = await res.text();
    const m = js.match(/"content_selector":"([^"]*)"/);
    if (!m) throw new Error('content_selector absent from the wrapper config');
    if (m[1] !== PINNED_SELECTOR) {
      notes.push(
        `Mediavine now serves content_selector "${m[1]}" but PINNED_SELECTOR in ` +
        `this script still says "${PINNED_SELECTOR}". Update the constant.`
      );
    }
    return { selector: m[1], source: 'live wrapper config' };
  } catch (err) {
    notes.push(`could not read the live wrapper config (${err.message}); using the pinned value`);
    return { selector: PINNED_SELECTOR, source: 'pinned constant' };
  }
}

function fromBuild(route) {
  const rel = route === '/' ? 'index.html' : path.join(route.slice(1), 'index.html');
  const file = path.join(__dirname, '..', 'build', rel);
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
}

async function fromLive(route) {
  const res = await fetch(ORIGIN + route);
  return res.ok ? res.text() : null;
}

(async () => {
  const { selector, source } = await readSelector();
  const needed = selector.replace(/^\./, '').split('.').filter(Boolean);

  /*
    Guard against the check passing vacuously. `needed.every(...)` returns true
    for EVERY element when `needed` is empty, so an empty or non-class selector
    (Mediavine switching to "#main", or to "") would make every route look
    healthy while nothing actually matched. That would make this check worse
    than no check at all, because it would assert the very thing that broke.
  */
  if (!needed.length) {
    console.error(
      `mediavine placement contract cannot be evaluated:\n\n` +
      `  content_selector is "${selector}" (${source}), which is not a class ` +
      `selector this check knows how to test.\n  Teach it the new shape rather ` +
      `than deleting the check — this selector is exactly what silently broke.\n`
    );
    process.exit(1);
  }

  const buildDir = path.join(__dirname, '..', 'build');
  const useBuild = !live && fs.existsSync(buildDir);
  if (!useBuild && !live) {
    notes.push('no build/ directory — checked the live site instead. Run `npm run build` first for an offline check.');
  }

  let containerMatches = 0;
  let hintTotal = 0;

  for (const route of MONETIZED) {
    const html = useBuild ? fromBuild(route) : await fromLive(route);
    if (html == null) {
      problems.push(`${route} — could not be read, so its ad placement is unverified`);
      continue;
    }

    const sets = classSets(html);
    const container = sets.filter((s) => needed.every((c) => s.has(c))).length;
    const hints = (html.match(/content_(?:desktop_|mobile_)?hint/g) || []).length;
    const hook = sets.some((s) => s.has(STABLE_HOOK));

    if (container) containerMatches += 1;
    hintTotal += hints;

    if (!container && !hints) {
      problems.push(
        `${route} — nowhere for Mediavine to place an ad: no element matches ` +
        `${selector} and there is no content_hint. This route earns $0.`
      );
    }
    // Only worth saying when the route genuinely depends on the selector. A
    // hinted page ignores content_selector entirely, so the hook would change
    // nothing there and the note would just be noise.
    if (!hook && !hints) {
      notes.push(`${route} — no "${STABLE_HOOK}" hook and no hint: this route depends entirely on the fragile selector`);
    }
    // A hint disables automatic placement for the whole page, so a lot of them
    // on one route is a Coalition for Better Ads risk (30% ads / 70% content).
    if (hints > 3) {
      notes.push(`${route} — ${hints} content hints; more than one per screen view risks the 30/70 CBA limit`);
    }
  }

  if (containerMatches === 0 && hintTotal === 0) {
    problems.unshift(
      `NOTHING is monetisable: the configured selector (${selector}, from the ${source}) ` +
      `matches no element on any checked route, and no content hints exist either. ` +
      `This is the 11 Aug 2026 failure recurring — ads will earn $0.`
    );
  }

  if (notes.length) {
    console.log('mediavine selector notes:');
    notes.forEach((n) => console.log(`  - ${n}`));
    console.log('');
  }

  if (problems.length) {
    console.error('mediavine placement contract violated:\n');
    problems.forEach((p, i) => console.error(`  ${i + 1}. ${p}\n`));
    process.exit(1);
  }

  console.log('mediavine placement contract ok:');
  console.log(`  - selector in force: ${selector} (${source})`);
  console.log(`  - checked ${MONETIZED.length} monetised routes via ${useBuild ? 'build/' : 'the live site'}`);
  console.log(`  - ${containerMatches} match the content container; ${hintTotal} content hints in total`);
  console.log(`  - every monetised route has somewhere for an ad to land`);
})();
