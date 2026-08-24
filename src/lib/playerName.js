/*
  The name of a player, when the player may no longer be there.

  Every engine game names people by id and resolves the id at render time. The
  round remembers "the Chameleon was <id>"; the screen looks that id up in
  `players` when it draws the reveal. If the id is not in the array, the lookup
  returns undefined and the sentence built around it falls apart — at the
  reveal, which is the moment the whole round was played for:

      "The Chameleon was . The word was Compass."     a hole in a sentence
      "undefined gives the clue"                      a template literal, so
                                                      the six characters
                                                      `undefined`, on screen
      "'s statements"                                 a possessive with no owner

  ── How exposed is this today ────────────────────────────────────────────────
  Not very, and that is worth writing down honestly rather than dressing it up.
  A player only leaves `state.players` through the `kick_player` handler, and
  today no game shows a Remove button outside its lobby, where no round exists
  yet. A plain disconnect sets `connected: false` and keeps the row, so the
  name survives that. Mid-game fresh joins are refused. So as the code stands,
  the lookup should not miss.

  It is guarded anyway, for two reasons. The server already supports kicking
  mid-round and explicitly guards one case of it ("cannot kick the current
  judge"), so the handler is written for a button that does not exist yet —
  and the day someone adds it, four screens across three games break at their
  most important moment, in a way that reads as a rendering glitch rather than
  as a missing person. And scripts/player-name-check.js proves with the real
  game modules that the round genuinely keeps naming a removed id: the hazard
  is in the data model, not hypothetical.

  Herd Mentality never had the exposure at all, and the reason is worth
  copying: it stores the username *on the answer*, so nothing has to be looked
  up and a departed player still shows correctly. Where a game cannot manage
  that, it comes through here instead, and a missing person gets said out loud
  rather than leaving a gap.
*/

export const DEPARTED = 'Someone who left';

/**
 * @param {Array<{id: string, username: string}>} players  the room's players
 * @param {string|null|undefined} id                       who to name
 * @param {string} [fallback]                              what to say instead
 * @returns {string} always a non-empty string, never undefined
 */
export function nameOf(players, id, fallback = DEPARTED) {
  if (!id) return fallback;
  const found = (players || []).find((p) => String(p?.id) === String(id));
  return found?.username || fallback;
}
