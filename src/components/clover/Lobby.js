import React, { useState } from 'react';
import { fredokaStyle } from '../MeadowLayout';
import AdSlot from '../AdSlot';

const JOIN_URL = 'herdgamesonline.com/clover';

export default function Lobby({ game }) {
  const { state, myId, isHost, roomCode, startGame, kickPlayer } = game;
  const connected = state.players.filter((p) => p.connected);
  const [copied, setCopied] = useState(false);

  const copyInvite = async () => {
    const text = `Join my Clover Clues game! Go to ${JOIN_URL} and enter code ${roomCode}`;
    try {
      if (navigator.share) { await navigator.share({ title: 'Clover Clues', text, url: `https://${JOIN_URL}` }); return; }
      await navigator.clipboard.writeText(text);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch { /* no-op */ }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <p className="text-[#8B6347] text-sm mb-1">Share this code with your friends</p>
        <div className="inline-block bg-[#FFE8C8] rounded-2xl px-8 py-4">
          <span style={fredokaStyle} className="text-5xl font-bold text-[#2D1810] tracking-widest">{roomCode}</span>
        </div>
        <button onClick={copyInvite}
          className="block mx-auto mt-3 bg-[#3D8B5A] hover:bg-[#2F6E45] text-white font-bold text-sm px-5 py-2 rounded-full transition-colors">
          {copied ? '✓ Invite copied!' : '📋 Copy invite link'}
        </button>
      </div>

      <div className="bg-[#FFF6E9] rounded-2xl border-2 border-[#FFE8C8] p-4 mb-4">
        <h3 style={fredokaStyle} className="text-sm font-bold text-[#2D1810] mb-2">How Clover Clues works</h3>
        <ol className="text-sm text-[#4A2D1B] space-y-1.5 list-decimal list-inside">
          <li>Everyone gets 4 words and writes a <strong>one-word clue</strong> linking each pair.</li>
          <li>Then the group works <strong>together</strong> to rebuild each player's clover from the clues.</li>
          <li>It's <strong>co-op</strong> — you all share one score. Aim for perfect clovers!</li>
        </ol>
      </div>

      <div className="bg-white rounded-2xl border-2 border-[#FFE8C8] p-4 mb-4">
        <h3 style={fredokaStyle} className="text-lg font-bold text-[#2D1810] mb-3">Players ({connected.length})</h3>
        <ul className="space-y-2">
          {state.players.map((p) => (
            <li key={p.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${p.connected ? 'bg-green-400' : 'bg-gray-300'}`} />
                <span className={`font-semibold text-[#2D1810] ${!p.connected ? 'opacity-50' : ''}`}>{p.username}</span>
                {p.isHost && <span className="text-xs bg-[#FFD56B] text-[#2D1810] px-2 py-0.5 rounded-full font-bold">Host</span>}
                {p.id === myId && <span className="text-xs text-[#8B6347]">(you)</span>}
              </div>
              {isHost && p.id !== myId && (
                <button onClick={() => kickPlayer(p.id)} className="text-xs text-red-400 hover:text-red-600 font-semibold">Remove</button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {isHost ? (
        <div className="space-y-2">
          {connected.length < 3 ? (
            <p className="text-center text-[#8B6347] text-sm">
              Need {3 - connected.length} more {3 - connected.length === 1 ? 'player' : 'players'} to start — it's a team game (3+).
            </p>
          ) : (
            <p className="text-center text-[#8B6347] text-sm">{connected.length} players in — start when everyone's ready.</p>
          )}
          <button onClick={startGame} disabled={connected.length < 3}
            className="w-full py-4 rounded-2xl font-bold text-white text-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#E84A8B', fontFamily: 'Fredoka, sans-serif' }}>
            Start Game 🍀
          </button>
        </div>
      ) : (
        <p className="text-center text-[#8B6347] text-sm py-2">You're in! Waiting for the host to start the game…</p>
      )}

      <div className="mt-6 max-h-[300px] overflow-hidden"><AdSlot slot="5969633275" /></div>
    </div>
  );
}
