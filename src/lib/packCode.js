/*
  One definition of what a pack ID looks like, shared by everything that
  accepts one.

  The FILE and the FIELD stay `packCode` on purpose. On screen it is a "pack ID"
  — because the site already has room CODES and two different things sharing
  that word is what sent a real host to our inbox unable to tell them apart. But
  `packCode` is in the database, in every `?pack=` link ever shared, and in the
  API; renaming it would break every ID already issued to buy nothing.

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
  Room codes and pack IDs are different things and people mix them up — in
  both directions. Someone pasted a six-character pack ID into a four-letter
  room box and it was silently truncated; someone else typed a four-letter room
  code where six were expected. Neither got told what was wrong, and the second
  one wrote to us because a work event was about to start.

  Room codes are letters only — the engine's alphabet is A–Z without I or O,
  and legacy Herd codes are A–Z0–9. So a hyphen is proof, not a guess: no room
  code has ever contained one, and every named pack ID does.

  Returns null when the input is a plausible room code and should simply be
  tried against the server. Otherwise returns { message, packId }, where
  `packId` marks the case that has somewhere to go: they are holding their own
  pack and want to HOST with it, not join someone else's room.

  `typing: true` suppresses the "too short" case, because every code in the
  world looks too short halfway through being typed.
*/
export function describeRoomCodeMistake(raw, expectedLength, { typing = false } = {}) {
  const code = cleanPackCode(raw);
  if (!code) return null;

  if (code.includes('-') || code.length > Math.max(expectedLength, 6)) {
    return {
      packId: true,
      message:
        'That looks like a pack ID, not a room code. A pack ID opens your own questions — use it to start a game, and the room code for your players appears once the game exists.',
    };
  }
  if (code.length > expectedLength) {
    return {
      packId: true,
      message: `Room codes for this game are ${expectedLength} letters. A ${code.length}-character one is either a pack ID or a code from a different game.`,
    };
  }
  if (!typing && code.length < expectedLength) {
    return {
      packId: false,
      message: `Room codes for this game are ${expectedLength} letters — that one is ${code.length}.`,
    };
  }
  return null;
}

/*
  What a code field may contain WHILE it is being typed.

  Not cleanPackCode: that collapses and trims hyphens, so typing "ABC" then "-"
  would give back "ABC" and the hyphen could never be entered at all. Pasting
  would work and typing would not, which is a maddening thing to debug from the
  outside. Tidying is for lookup time, not for every keystroke.

  Two games used `.replace(/[^A-Z]/g, '')` here, which silently ate every
  hyphen and digit out of a pasted pack ID — the same defect as the maxLength
  truncation, one layer down.
*/
export function sanitizeCodeInput(raw) {
  return String(raw == null ? '' : raw)
    .slice(0, 48)
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, '');
}

/*
  Which games a custom pack can actually be played in, and where they live.

  A pack is written FOR one game — Herd questions are open-ended, Team Trivia
  questions carry an answer, Would You Rather comes in pairs — so "play this
  pack" only ever has one correct destination. Seven of the twelve join boxes
  belong to games that cannot take a pack at all.

  That is why this is a map and not a guess: a host who pastes a pack ID into
  the Guesstimate join box should be sent to the game their pack was written
  for, not to whichever page they happened to be standing on.

  Must stay in step with GAMES/PLAY_PATHS in components/custom/CustomPack.js —
  which imports from here, so there is only one copy to keep.
*/
export const PACK_GAMES = {
  herd: { name: 'Herd Mentality', path: '/' },
  teamtrivia: { name: 'Team Trivia', path: '/team-trivia' },
  sayanything: { name: 'Say Anything', path: '/say-anything' },
  wyr: { name: 'Would You Rather', path: '/would-you-rather' },
  scattergories: { name: 'Scattergories', path: '/scattergories' },
};

export function packPlayPath(pack) {
  const dest = PACK_GAMES[pack && pack.game];
  return `${dest ? dest.path : '/'}?pack=${encodeURIComponent((pack && pack.packCode) || '')}`;
}
