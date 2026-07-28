import React, { useState } from 'react';
import { FiShare2, FiCheck, FiCopy } from 'react-icons/fi';
import { fredokaStyle } from '../MeadowLayout';

/*
  Shared lobby invite block.

  Why this exists: 29% of all rooms created (244 of 843 in a fortnight) never
  got a second player. The old lobby made the ROOM CODE the hero and the invite
  LINK a small secondary button, while the biggest, most colourful element on
  screen was a DISABLED "Start game". So the eye landed on something that did
  nothing, and the one action that actually fills the room was de-emphasised.

  Principle: while the room cannot start, INVITING IS THE PRIMARY ACTION.
  - Big full-width share button (native share sheet on mobile, clipboard else).
  - A clear "you need N more" instruction above it, not buried below.
  - The code stays available for manual entry, but demoted to a secondary row.
  Once enough players are in, the invite calms down and Start becomes the hero.
*/
export default function LobbyInvite({
  gamePath,          // e.g. 'scattergories' -> /scattergories/room/CODE
  roomCode,
  gameName = 'this game',
  playerCount = 1,
  minPlayers = 2,
  accent = '#E84A8B',
}) {
  const [copied, setCopied] = useState(false);
  const [codeCopied, setCodeCopied] = useState(false);

  const url = `https://herdgamesonline.com/${gamePath}/room/${roomCode}`;
  const needed = Math.max(0, minPlayers - playerCount);
  const ready = needed === 0;

  async function share() {
    const text = `Join my ${gameName} game! ${url}`;
    try {
      if (navigator.share) { await navigator.share({ title: gameName, text, url }); return; }
      await navigator.clipboard.writeText(url);
      setCopied(true); setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      if (err?.name === 'AbortError') return; // user actually dismissed the share sheet
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true); setTimeout(() => setCopied(false), 2200);
      } catch { /* clipboard blocked too */ }
    }
  }

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCodeCopied(true); setTimeout(() => setCodeCopied(false), 2000);
    } catch { /* ignore */ }
  }

  return (
    <div className="mb-4">
      {/* What to do, stated before the action */}
      <p className="text-center font-semibold text-[#2D1810] mb-2" style={fredokaStyle}>
        {ready
          ? `${playerCount} in the room — invite more or start`
          : needed === 1
            ? 'Invite 1 more friend to start'
            : `Invite ${needed} more friends to start`}
      </p>

      {/* PRIMARY action while the room can't start */}
      <button
        onClick={share}
        style={{ background: ready ? '#FFF' : accent, borderColor: accent, fontFamily: 'Fredoka, sans-serif' }}
        className={`w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-lg border-2 transition-transform hover:scale-[1.02] ${
          ready ? 'text-[#2D1810]' : 'text-white shadow-[0_10px_24px_-10px_rgba(232,74,139,0.8)]'
        }`}
      >
        {copied ? <><FiCheck /> Link copied!</> : <><FiShare2 /> Invite friends</>}
      </button>

      {/* Secondary: the code, for anyone typing it in manually */}
      <button
        onClick={copyCode}
        className="w-full mt-2 flex items-center justify-center gap-2 text-sm text-[#8B6347] hover:text-[#2D1810] py-1"
      >
        {codeCopied ? <><FiCheck /> Code copied</> : <><FiCopy /> or share the code <span className="font-mono font-bold tracking-widest text-[#2D1810]">{roomCode}</span></>}
      </button>
    </div>
  );
}
