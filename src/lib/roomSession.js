/*
  Is the room this browser remembers the room it is actually looking at?

  WHAT THIS FIXES, and it is the worst one found so far.

  Every game hook auto-rejoins the saved room the moment its socket connects.
  That is essential — mobile browsers reload backgrounded tabs constantly, and a
  player who comes back has to land in their game, not at a create form.

  It ignored the URL completely. So a player sitting in room YUJA who opens a
  friend's link to room TRUZ was silently put back into YUJA: the address bar
  said TRUZ, the screen showed YUJA, there was no join form and no error. They
  waited in the wrong game while everyone else waited for them.

  That is the site's entire distribution model — one person sends a link to five
  friends — and it broke for anyone who had played once already in the last two
  hours, which is every repeat visitor. Rooms live two hours past their last
  activity, so "just try again later" was not a workaround either.

  Found by a Playwright probe that made two rooms and opened the second link in
  a browser that was already in the first. Nothing in the unit tests could see
  it: the hook is correct, the room screen is correct, and the bug lives only in
  the fact that neither of them looks at the address bar.

  THE RULE. Resume only when the saved room IS the room being viewed, or when
  no particular room is being viewed (a game's home page — where resuming is
  exactly right).
*/

/** The room code in the current URL, or null on a page that names no room. */
export function roomCodeInUrl(pathname) {
  const path = typeof pathname === 'string'
    ? pathname
    : (typeof window !== 'undefined' ? window.location.pathname : '');
  const m = /\/room\/([A-Za-z0-9-]+)/.exec(path || '');
  return m ? m[1].toUpperCase() : null;
}

/**
 * Should the socket rejoin `session` on connect?
 *
 * Deliberately permissive when there is no room in the URL: that is a home
 * page, and being carried back into a game in progress is the behaviour this
 * whole mechanism exists for. Whether a FINISHED room is worth resuming is a
 * separate question, answered by lib/resumeRoom.js.
 */
export function shouldRejoinSession(session, pathname) {
  if (!session || !session.rejoinToken || !session.roomCode) return false;
  const inUrl = roomCodeInUrl(pathname);
  if (!inUrl) return true;
  return String(session.roomCode).toUpperCase() === inUrl;
}


/**
 * Is this `state_update` about the room this client is actually in?
 *
 * THE OTHER HALF OF THE FIX ABOVE. Checking the URL before rejoining stops a
 * link to room B putting you in room A, but the socket can still legitimately
 * end up a player in two rooms: rejoin the remembered room from a home page
 * (correct — no room in the URL), then press Create. The engine addresses
 * updates by socketId and nothing calls socket.leave, so activity in the old
 * room — another player rejoining it as they click "Play again" — is delivered
 * here and would overwrite the new room's state. `myId` then belongs to the
 * other room, so `me` is null, `isHost` is false, and the host's own Start
 * button disappears from the room they just made.
 *
 * Permissive until a room is known: the very first payload after create_game
 * arrives before the client has a room code, and dropping that would leave the
 * hook with nothing at all.
 */
export function isForCurrentRoom(incoming, currentRoomCode) {
  if (!currentRoomCode) return true;
  const code = incoming && incoming.roomCode;
  if (!code) return true;
  return String(code).toUpperCase() === String(currentRoomCode).toUpperCase();
}
