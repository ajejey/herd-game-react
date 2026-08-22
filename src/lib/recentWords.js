/*
  What this browser has already been dealt.

  THE PROBLEM. Every card game here shuffles its whole bank at kickoff and deals
  from the top, which makes repeats impossible WITHIN a game and does nothing at
  all ACROSS games. Caveman Clues had 328 words and burns about 16 a game, so
  two games back to back repeated 0.78 cards on average and there was a 56%
  chance the second game showed a word from the first. (The bank is 820 now,
  which divides those numbers by 2.5 and does not remove the problem.)

  A one-off visitor never notices. The host who runs it every Friday — the
  only person whose opinion moves the numbers — notices immediately, and "we
  already had that one" is the sound of a game getting old.

  THE FIX, and why it lives in the browser. The obvious place for a seen-list is
  the server, and the server has nowhere to put it: rooms are in memory, "play
  again" makes a NEW room with a new code, and there are no accounts, so there
  is no key to hang it on. The browser has one and it is exactly the right one —
  it belongs to the person doing the hosting, it survives closing the tab, and
  it costs no storage and no lookup anywhere else.

  The host sends this list at create time, the server deals the words it has not
  seen FIRST and the rest after, so the deck is never short and a long-running
  host simply walks the bank before anything comes round again.

  Deliberately generic: keyed by game id, so Fishbowl, Taboo and anything else
  with a bank can adopt it by passing `exclude` the same way.
*/

const KEY = 'hg_recent_words';

/*
  Big enough to cover many sittings, small enough that it stays well under
  localStorage's ~5MB and that the deck always has fresh cards left over. 200
  words of the 820-word bank leaves 620 unseen, around 38 games before anything
  can come round again. Raise it if the bank grows; the server honours up to
  400, a ceiling asserted against this exact number in caveman-logic-check.js.
*/
const CAP = 200;

function readAll() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    return raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  } catch {
    /* Private mode, a full quota, or a value someone else wrote. None of those
       are worth breaking a game over — a missing seen-list just means repeats,
       which is where we started. */
    return {};
  }
}

function writeAll(all) {
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* see above */ }
}

/*
  Every read goes through here, and it returns STRINGS or nothing.

  Array.isArray was not enough. localStorage is shared with every other tab,
  every past version of this site and anything a person pastes into a console,
  so `{"cavemanclues": [1,2,3]}` is a shape that can genuinely arrive — and
  `x.toLowerCase()` on it threw inside a render effect, unmounting the reveal
  screen mid-game. The SERVER half of this feature is explicitly tested against
  [1,2,3] and [null, undefined]; the browser half was trusting its own storage.
*/
function readList(game) {
  const list = readAll()[game];
  if (!Array.isArray(list)) return [];
  return list.filter((w) => typeof w === 'string' && w.length > 0);
}

/** Words this browser has already been dealt in `game`, newest last. */
export function recentWords(game) {
  return readList(game);
}

/**
 * Record a word as seen. Safe to call on every render of a reveal screen —
 * it de-duplicates and only writes when something actually changed.
 */
export function rememberWord(game, word) {
  const w = String(word || '').trim();
  if (!w) return;
  const all = readAll();
  const list = readList(game);
  /* Move-to-end rather than skip, so a word seen again is the newest thing in
     the list and is therefore the LAST to come back round. */
  const next = list.filter((x) => x.toLowerCase() !== w.toLowerCase());
  next.push(w);
  all[game] = next.slice(-CAP);
  writeAll(all);
}

/** For a "shuffle everything again" control, and for tests. */
export function forgetWords(game) {
  const all = readAll();
  delete all[game];
  writeAll(all);
}
