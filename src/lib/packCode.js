/*
  One definition of what a pack code looks like, shared by everything that
  accepts one.

  It used to live in two places — the pack page's lookup and usePackFromUrl —
  and both did `.toUpperCase().replace(/[^A-Z0-9]/g, '')`, which strips hyphens.
  Codes are now built from the pack's name ("CISS-DIVISION-LETTER-S-K7X"), so
  either copy left un-updated would silently make every named pack unfindable,
  and the host would get "no pack with that code" for a code we issued them.

  Must stay in step with `clean()` in backend/src/packs.js. The round trip is
  asserted by backend/scripts/pack-code-check.js.

  Forgiving on purpose, because these arrive by every messy route there is: a
  phone that capitalised, an email client that appended a full stop, a paste
  that brought spaces, a line break that doubled a hyphen.
*/
export function cleanPackCode(raw) {
  return String(raw == null ? '' : raw)
    .slice(0, 48)
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/*
  Room codes and pack codes are different things and people mix them up — in
  both directions. Someone pasted a six-character pack code into a four-letter
  room box and it was silently truncated; someone else typed a four-letter room
  code where six were expected. Neither got told what was wrong.

  Returns a plain-English explanation, or null when the input is a plausible
  room code and should just be tried.
*/
export function describeRoomCodeMistake(raw, expectedLength) {
  const code = String(raw || '').trim().toUpperCase();
  if (!code) return null;

  if (code.includes('-') || code.length > 6) {
    return 'That looks like a pack code, not a room code. Pack codes open your own questions — start a game with your pack first, and the room code for your players appears once the game exists.';
  }
  if (code.length > expectedLength) {
    return `Room codes for this game are ${expectedLength} letters. A ${code.length}-character code is either a pack code or from a different game.`;
  }
  if (code.length < expectedLength) {
    return `Room codes for this game are ${expectedLength} letters — that one is ${code.length}.`;
  }
  return null;
}
