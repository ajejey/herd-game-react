import React from 'react';
import { fredokaStyle } from '../MeadowLayout';
import AdSlot from '../AdSlot';

export default function Scoreboard({ state, myId, onLeave }) {
  const sorted = [...state.players].sort((a, b) => b.score - a.score);
  const winner = state.winner ?? sorted[0];

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="text-6xl mb-3">🏆</div>
      <h1 style={fredokaStyle} className="text-4xl font-bold text-[#2D1810] mb-1">Game Over!</h1>
      <p style={fredokaStyle} className="text-2xl text-[#E84A8B] mb-8">{winner?.username} wins!</p>

      <div className="bg-white rounded-2xl border-2 border-[#FFE8C8] p-5 mb-6">
        <h2 style={fredokaStyle} className="text-xl font-bold text-[#2D1810] mb-4">Final scores</h2>
        {sorted.map((p, i) => (
          <div
            key={p.id}
            className={`flex items-center justify-between py-3 border-b border-[#FFE8C8] last:border-0 ${
              p.id === winner?.id ? 'text-[#E84A8B]' : 'text-[#2D1810]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl w-7 text-center">
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`}
              </span>
              <span style={i === 0 ? fredokaStyle : {}} className="font-semibold">
                {p.username} {p.id === myId ? '(you)' : ''}
              </span>
            </div>
            <span style={fredokaStyle} className="text-2xl font-bold">{p.score}</span>
          </div>
        ))}
      </div>

      {/* Ad — game-over scoreboard, high attention */}
      <div className="mb-4 max-h-[300px] overflow-hidden">
        <AdSlot slot="9390003532" />
      </div>

      <button
        onClick={onLeave}
        className="w-full py-4 rounded-2xl font-bold text-white text-xl"
        style={{ background: '#E84A8B', fontFamily: 'Fredoka, sans-serif' }}
      >
        Play again
      </button>
    </div>
  );
}
