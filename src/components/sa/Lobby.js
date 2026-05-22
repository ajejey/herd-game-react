import React, { useState } from 'react';
import { fredokaStyle } from '../MeadowLayout';
import HowToPlay from './HowToPlay';
import AdSlot from '../AdSlot';

export default function Lobby({ game }) {
  const { state, myId, isHost, roomCode, startGame, kickPlayer } = game;
  const { players } = state;
  const connected = players.filter(p => p.connected);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="max-w-md mx-auto">
      {/* Room code */}
      <div className="text-center mb-6">
        <p className="text-[#8B6347] text-sm mb-1">Share this code</p>
        <div className="inline-block bg-[#FFE8C8] rounded-2xl px-8 py-4">
          <span style={fredokaStyle} className="text-5xl font-bold text-[#2D1810] tracking-widest">
            {roomCode}
          </span>
        </div>
        <p className="text-[#8B6347] text-xs mt-2">
          Friends go to <span className="font-semibold">herdgame.vercel.app/say-anything</span>
        </p>
        <button
          onClick={() => setShowHelp(true)}
          className="mt-3 text-[#3D8B5A] hover:text-[#2F6E45] font-semibold text-sm underline"
        >How to play →</button>
      </div>
      {showHelp && <HowToPlay onClose={() => setShowHelp(false)} />}

      {/* Players */}
      <div className="bg-white rounded-2xl border-2 border-[#FFE8C8] p-4 mb-4">
        <h3 style={fredokaStyle} className="text-lg font-bold text-[#2D1810] mb-3">
          Players ({connected.length})
        </h3>
        <ul className="space-y-2">
          {players.map(p => (
            <li key={p.id} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${p.connected ? 'bg-green-400' : 'bg-gray-300'}`} />
                <span className={`font-semibold text-[#2D1810] ${!p.connected ? 'opacity-50' : ''}`}>
                  {p.username}
                </span>
                {p.isHost && <span className="text-xs bg-[#FFD56B] text-[#2D1810] px-2 py-0.5 rounded-full font-bold">Host</span>}
                {p.id === myId && <span className="text-xs text-[#8B6347]">(you)</span>}
              </div>
              {isHost && p.id !== myId && (
                <button
                  onClick={() => kickPlayer(p.id)}
                  className="text-xs text-red-400 hover:text-red-600 font-semibold"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Start */}
      {isHost ? (
        <div className="space-y-2">
          {connected.length < 3 && (
            <p className="text-center text-[#8B6347] text-sm">Need at least 3 players to start</p>
          )}
          <button
            onClick={startGame}
            disabled={connected.length < 3}
            className="w-full py-4 rounded-2xl font-bold text-white text-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: '#E84A8B', fontFamily: 'Fredoka, sans-serif' }}
          >
            Start Game 🎉
          </button>
        </div>
      ) : (
        <p className="text-center text-[#8B6347] text-sm py-2">Waiting for the host to start…</p>
      )}

      {/* Ad — lobby is the longest waiting moment */}
      <div className="mt-6 max-h-[300px] overflow-hidden">
        <AdSlot slot="5969633275" />
      </div>
    </div>
  );
}
