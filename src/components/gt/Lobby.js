import React, { useState } from 'react';
import { fredokaStyle } from '../MeadowLayout';
import HowToPlay from './HowToPlay';
import AdSlot from '../AdSlot';

const JOIN_URL = 'herdgame.vercel.app/guesstimate';

export default function Lobby({ game }) {
  const { state, myId, isHost, roomCode, startGame, kickPlayer } = game;
  const { players } = state;
  const connected = players.filter(p => p.connected);
  const [showHelp, setShowHelp] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyInvite = async () => {
    const text = `Join my Guesstimate game! Go to ${JOIN_URL} and enter code ${roomCode}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Guesstimate', text, url: `https://${JOIN_URL}` });
        return;
      }
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* user dismissed share / clipboard blocked — no-op */ }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-6">
        <p className="text-[#8B6347] text-sm mb-1">Share this code with your friends</p>
        <div className="inline-block bg-[#FFE8C8] rounded-2xl px-8 py-4">
          <span style={fredokaStyle} className="text-5xl font-bold text-[#2D1810] tracking-widest">{roomCode}</span>
        </div>
        <button
          onClick={copyInvite}
          className="block mx-auto mt-3 bg-[#3D8B5A] hover:bg-[#2F6E45] text-white font-bold text-sm px-5 py-2 rounded-full transition-colors"
        >
          {copied ? '✓ Invite copied!' : '📋 Copy invite link'}
        </button>
        <button onClick={() => setShowHelp(true)} className="mt-3 text-[#3D8B5A] hover:text-[#2F6E45] font-semibold text-sm underline">
          How to play →
        </button>
      </div>
      {showHelp && <HowToPlay onClose={() => setShowHelp(false)} />}

      {/* How to get everyone in — step-by-step so the host knows exactly what to do */}
      <div className="bg-[#FFF6E9] rounded-2xl border-2 border-[#FFE8C8] p-4 mb-4">
        <h3 style={fredokaStyle} className="text-sm font-bold text-[#2D1810] mb-2">Getting everyone in</h3>
        <ol className="text-sm text-[#4A2D1B] space-y-1.5 list-decimal list-inside">
          <li>Each friend opens <span className="font-semibold">{JOIN_URL}</span> on their own phone or laptop.</li>
          <li>They tap <span className="font-semibold">Join Game</span> and enter code <span className="font-bold tracking-wide">{roomCode}</span>.</li>
          <li>They'll pop up in the player list below as they join.</li>
          <li>{isHost ? 'When everyone\'s in, hit Start Game.' : 'The host starts the game once everyone\'s in.'}</li>
        </ol>
      </div>

      <div className="bg-white rounded-2xl border-2 border-[#FFE8C8] p-4 mb-4">
        <h3 style={fredokaStyle} className="text-lg font-bold text-[#2D1810] mb-3">
          Players ({connected.length})
        </h3>
        <ul className="space-y-2">
          {players.map(p => (
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
          {connected.length < 2 ? (
            <p className="text-center text-[#8B6347] text-sm">
              Waiting for at least 1 more player to join… share the code above to get started.
            </p>
          ) : (
            <p className="text-center text-[#8B6347] text-sm">
              {connected.length} players in — start whenever you're ready, or wait for more.
            </p>
          )}
          <button
            onClick={startGame}
            disabled={connected.length < 2}
            className="w-full py-4 rounded-2xl font-bold text-white text-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#E84A8B', fontFamily: 'Fredoka, sans-serif' }}
          >
            Start Game 🎉
          </button>
        </div>
      ) : (
        <p className="text-center text-[#8B6347] text-sm py-2">You're in! Waiting for the host to start the game…</p>
      )}

      {/* Ad — lobby is the longest wait */}
      <div className="mt-6 max-h-[300px] overflow-hidden">
        <AdSlot slot="5969633275" />
      </div>
    </div>
  );
}
