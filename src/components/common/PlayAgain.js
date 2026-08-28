import React from 'react';
import { Link } from 'react-router-dom';
import { fredokaStyle } from '../MeadowLayout';

/*
  The end of a game, for a group that wants another one.

  Reported from a finished Scattergories room on 28 Aug 2026: "Cannot force
  start a new game." They were right, and it was true of all fourteen games.
  Every finished screen offered "Play again" / "New game" as a LINK that called
  leaveGame() and dropped the presser back on the hub to create a fresh room
  with a fresh code — while everyone else sat on the final scoreboard in a room
  whose host had just walked out. A group that had just enjoyed themselves had
  to re-form and redistribute a code to keep going, at the exact moment they
  were most willing to keep going.

  So this is one component rather than fourteen variations: the same words, the
  same order, and the same answer to "what happens now" in every game. Leaving
  is still offered, underneath, because sometimes that is what people want —
  but it is no longer the only thing on offer.

  `canStart` is deliberately not just isHost. A host who closes the tab on the
  results screen is a normal way for a game to end, and gating the rematch on
  them alone would leave the room unable to do the one thing it is now for. The
  server applies the identical rule, so a client that shows the button when it
  should not still gets refused.
*/

export default function PlayAgain({
  players = [],
  hostId = null,
  isHost = false,
  onPlayAgain,
  onLeave,
  backTo = '/',
  backLabel = 'Leave room',
  className = '',
}) {
  const host = players.find((p) => String(p?.id) === String(hostId));
  const hostGone = !host || host.connected === false;
  const canStart = !!isHost || hostGone;

  return (
    <div className={`mt-5 ${className}`}>
      {canStart ? (
        <button
          type="button"
          onClick={onPlayAgain}
          style={{ background: '#3D8B5A', ...fredokaStyle }}
          className="w-full sm:w-auto px-7 py-3 rounded-2xl text-white font-bold text-lg hover:brightness-105 transition"
        >
          Play again &rarr;
        </button>
      ) : (
        /*
          Said out loud rather than left blank. The whole reason this screen was
          a dead end is that people were not told what happens next, and a
          non-host staring at a bare "Leave room" link learns nothing about the
          rematch their host is about to start.
        */
        <p className="text-base font-semibold" style={{ color: '#6B4226' }}>
          Waiting for the host to start another game&hellip;
        </p>
      )}

      <div className="mt-3">
        <Link
          to={backTo}
          onClick={onLeave}
          className="text-base underline"
          style={{ color: '#8B6347' }}
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
