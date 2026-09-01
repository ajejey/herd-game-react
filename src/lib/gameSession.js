/*
  The legacy Herd room's saved session, and how long it is worth trusting.

  `gameSession` is what puts a player back into /game/CODE after a refresh, and
  mobile browsers reload backgrounded tabs constantly, so it has to survive a
  while. It used to be deleted the moment a game reached `completed` — correct
  when that was the end of the room's life.

  Play again changed that: the same room reopens on the same code with the same
  people, and every client had already thrown away the thing it reconnects
  with. A player who refreshed during game two was bounced to /?join=CODE to
  retype their name and get back into a room they had never left. So the delete
  went.

  Removing it left nothing bounding the session at all, which is its own bug and
  a worse-behaved one. "Back to all games" is a plain <Link> and does not clear
  it; closing the tab does not clear it; only tapping "Leave room" does. Home
  then showed "Rejoin previous game?" on the join funnel indefinitely — and
  reconnect_game has no status guard, while cleanupOldGames only removes games
  older than seven days AND only runs at server start. So inside that window
  Rejoin SUCCEEDS: it drops someone into last week's final scoreboard, where a
  returning host is still offered Play again on a room whose players left days
  ago.

  An age stamp is the smallest thing that fixes both. Long enough to cover a
  whole evening of rematches, short enough that tomorrow morning the banner is
  gone.
*/

const KEY = 'gameSession';

/*
  Twelve hours. A game night with several rematches fits comfortably; a session
  from yesterday does not. Deliberately shorter than the seven-day window in
  which reconnect_game would still happily succeed.
*/
export const SESSION_MAX_AGE_MS = 12 * 60 * 60 * 1000;

export function saveGameSession(session) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ ...session, savedAt: Date.now() }));
  } catch { /* private mode — the room still works, it just will not resume */ }
}

export function clearGameSession() {
  try { localStorage.removeItem(KEY); } catch { /* private mode */ }
}

/**
 * The saved session, or null if there isn't one or it has gone stale.
 *
 * Sessions written before `savedAt` existed have no timestamp. They are treated
 * as stale rather than trusted forever — that is the same conservative choice
 * the age limit exists to make, and it self-corrects the moment the player
 * joins anything.
 */
export function readGameSession(now = Date.now()) {
  let parsed = null;
  try { parsed = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
  if (!parsed || !parsed.roomCode) return null;
  if (typeof parsed.savedAt !== 'number') return null;
  if (now - parsed.savedAt > SESSION_MAX_AGE_MS) return null;
  return parsed;
}
