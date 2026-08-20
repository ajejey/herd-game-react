import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cleanPackCode, describeRoomCodeMistake, PACK_GAMES, packPlayPath } from '../lib/packCode';

/*
  The signpost at the join box.

  A Community Coordinator built five question packs for a work event and could
  not use any of them, because a pack ID and a room code are both "a code" and
  nothing on screen said which box wanted which. Pressing Join with a pack ID
  returned "no game with that code" — technically true, and a dead end.

  This says what went wrong WHILE they type, before the failed attempt, and
  then does the one thing that actually helps: looks the pack up and offers to
  take them to the game it was written for. That last part matters because a
  pack belongs to ONE game, and seven of the twelve join boxes belong to games
  that cannot use a pack at all — so "start a game here with it" would be a
  promise the page could not keep.

  Deliberately never blocks a join. It renders next to the field and the form
  still submits exactly as it did — a wrong guess here costs a line of text,
  where a wrong guess in a guard would lock someone out of a working room.
*/

const BACKEND_URL =
  process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

const CARD = { background: '#FFF6E9', borderColor: '#F0C070', color: '#6B4226' };

export default function JoinCodeHelp({ code, expectedLength = 4, onUsePack }) {
  const navigate = useNavigate();
  const [pack, setPack] = useState(null);   // null = unknown, false = not found

  const hint = describeRoomCodeMistake(code, expectedLength, { typing: true });
  const packCode = hint && hint.packId ? cleanPackCode(code) : '';

  /*
    Debounced: this fires from a field someone is typing into, and a lookup per
    keystroke would be both wasteful and racy — an early reply can land after a
    later one and show the wrong pack.
  */
  useEffect(() => {
    if (!packCode) { setPack(null); return undefined; }
    let live = true;
    setPack(null);
    const t = setTimeout(() => {
      fetch(`${BACKEND_URL}/api/packs/${encodeURIComponent(packCode)}`)
        .then((r) => r.json())
        .then((d) => { if (live) setPack(d && d.ok ? d : false); })
        .catch(() => { if (live) setPack(false); });
    }, 450);
    return () => { live = false; clearTimeout(t); };
  }, [packCode]);

  if (!hint) return null;

  const dest = pack && PACK_GAMES[pack.game];

  const go = () => {
    if (onUsePack) onUsePack();
    navigate(packPlayPath(pack));
  };

  return (
    <div data-testid="join-code-help" className="rounded-2xl border-2 px-4 py-3 text-left" style={CARD}>
      <p className="text-base font-semibold">{hint.message}</p>

      {dest && (
        <>
          <p className="mt-2 text-base">
            Found it{pack.title ? ` — “${pack.title}”` : ''}: {pack.count} question
            {pack.count === 1 ? '' : 's'} for <strong>{dest.name}</strong>.
          </p>
          {/* type="button" matters: this sits inside the join form, and a bare
              button would submit it. Outlined rather than filled so it does not
              compete with the form's own primary action. */}
          <button
            type="button"
            onClick={go}
            data-testid="join-code-help-go"
            className="mt-2 w-full rounded-xl border-2 bg-white py-2 font-bold"
            style={{ borderColor: '#E84A8B', color: '#E84A8B', fontFamily: 'Fredoka, sans-serif' }}
          >
            Start {dest.name} with it →
          </button>
        </>
      )}

      {pack === false && (
        <p className="mt-2 text-base">
          We could not find a pack with that ID either — check it with whoever made
          the pack. It is the ID they got when they saved it.
        </p>
      )}
    </div>
  );
}
