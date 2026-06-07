import React from 'react';

/*
  Pre-game expectations notice — shown on each game's create/join screen.

  Why: analytics showed ~60% of created rooms never start. A big cause is a lone
  visitor creating a room, then realising they need several people *right now*.
  Setting the player count + "start a video call first" expectation BEFORE they
  commit reduces that drop-off and serves the FaceTime/Zoom search intent.
*/
export default function RemotePlayNotice({ minPlayers = 3, maxPlayers = 8, accent = '#3D8B5A' }) {
  return (
    <div
      className="mt-4 rounded-2xl border-2 bg-[#FFFDF8] px-4 py-3 text-sm text-[#4A2D1B]"
      style={{ borderColor: '#FFE8C8' }}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className="inline-flex items-center gap-1 rounded-full text-white px-3 py-1 text-xs font-bold"
          style={{ background: accent }}
        >
          👥 Minimum {minPlayers} players
        </span>
        {maxPlayers ? <span className="text-xs text-[#8B6347]">(up to {maxPlayers}) · one device each</span> : <span className="text-xs text-[#8B6347]">one device each</span>}
      </div>
      <p className="mt-2 text-[#6B4A33]">
        🎥 Playing remotely? Hop on a <strong>FaceTime, Zoom or any video call</strong> first, then
        share the room code so everyone joins from their own phone or laptop.
      </p>
    </div>
  );
}
