/*
  Should this browser be sent back into the room it remembers?

  WHAT THIS FIXES. Every game's home page auto-navigates you into your saved
  room, which is right and important: mobile browsers reload tabs constantly,
  and a player who taps the logo mid-game has to land back in the game rather
  than at a create form.

  It was also the reason "Play again" did nothing on all thirteen games. That
  link goes to the game's home page; the hook reconnects, rejoins the FINISHED
  room off the saved token, and the home page dutifully sends you straight back
  to the final-scores screen you were trying to leave. The button appeared to be
  broken, and the only way out was the much less obvious "Leave room" underneath
  it. Rooms live for two hours after the last activity, so this was every repeat
  game for two hours — exactly the visitor worth keeping.

  Found by a Playwright probe that finished a real game and clicked the real
  link. No unit test could have: each half is correct on its own, and the bug
  only exists in the seam between them.

  A finished room is still REACHABLE — reload the room URL and the final scores
  are there. It just stops being somewhere you get dragged back to.
*/

/**
 * True when the remembered room is one the player should be returned to.
 * Pass the derived client state; `roomCode` is checked by the caller.
 */
export function canResumeRoom(state) {
  if (!state) return false;
  /* `status` is the engine's, `phase` is each game's own. Both are checked
     because the older games set one and not always the other, and a resume
     guard that silently stops matching is a fix that turns itself off. */
  if (state.status === 'finished') return false;
  if (state.phase === 'finished') return false;
  return true;
}
