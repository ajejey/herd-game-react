import React from 'react';
import { fredokaStyle } from '../MeadowLayout';

export default function RevealPhase({ game }) {
  const { state, myId, isHost, judge, sendAction } = game;
  const { round, winner } = state;

  const winningAnswer = round.answers.find(a => a.id === round.judgePickId);

  return (
    <div className="max-w-lg mx-auto">
      {/* Question */}
      <div className="bg-white rounded-2xl border-2 border-[#FFE8C8] p-5 mb-5 text-center">
        <p className="text-xs text-[#8B6347] uppercase tracking-widest mb-1">The question</p>
        <p style={fredokaStyle} className="text-xl text-[#2D1810] font-bold">{round.question}</p>
      </div>

      {/* Judge's pick */}
      <div className="text-center mb-6">
        <p className="text-[#8B6347] text-sm mb-2">{judge?.username} chose…</p>
        <div className="inline-block bg-[#FFF0F7] border-4 border-[#E84A8B] rounded-2xl px-8 py-5">
          <p style={fredokaStyle} className="text-2xl text-[#2D1810] font-bold">
            {winningAnswer?.text ?? '—'}
          </p>
          <p className="text-sm text-[#8B6347] mt-1">by {winningAnswer?.username}</p>
        </div>
      </div>

      {/* All answers + who bet on what */}
      <div className="space-y-3 mb-6">
        {round.answers.map(a => {
          const isWinner = a.id === round.judgePickId;
          // group bets by player so doubles show as "Alex 🪙🪙"
          const betCounts = round.bets
            .filter(b => b.answerId === a.id)
            .reduce((acc, b) => { acc[b.playerId] = (acc[b.playerId] ?? 0) + 1; return acc; }, {});
          const bettors = Object.entries(betCounts).map(([pid, count]) => {
            const p = state.players.find(pl => pl.id === pid);
            return p ? `${p.username}${count === 2 ? ' 🪙🪙' : ''}` : null;
          }).filter(Boolean);

          return (
            <div
              key={a.id}
              className={`px-5 py-4 rounded-2xl border-2 ${
                isWinner ? 'bg-[#FFF0F7] border-[#E84A8B]' : 'bg-white border-[#FFE8C8]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-[#2D1810]">{a.text}</p>
                  <p className="text-xs text-[#8B6347] mt-0.5">by {a.username}</p>
                  {bettors.length > 0 && (
                    <p className="text-xs text-[#3D8B5A] mt-1">Bets: {bettors.join(', ')}</p>
                  )}
                </div>
                {isWinner && <span className="text-2xl">⭐</span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Round scores */}
      <div className="bg-[#FFFBE8] rounded-2xl border-2 border-[#FFD56B] p-4 mb-6">
        <h3 style={fredokaStyle} className="font-bold text-[#2D1810] mb-2">This round</h3>
        {state.players.map(p => {
          const delta = round.scores?.[p.id] ?? 0;
          return (
            <div key={p.id} className="flex justify-between text-sm py-1">
              <span className={`font-semibold ${p.id === myId ? 'text-[#E84A8B]' : 'text-[#2D1810]'}`}>
                {p.username} {p.id === myId ? '(you)' : ''}
              </span>
              <span className={`font-bold ${delta > 0 ? 'text-[#3D8B5A]' : 'text-[#8B6347]'}`}>
                {delta > 0 ? `+${delta}` : '—'} → {p.score}
              </span>
            </div>
          );
        })}
      </div>

      {winner ? (
        <div className="text-center">
          <div className="text-5xl mb-2">🏆</div>
          <p style={fredokaStyle} className="text-3xl font-bold text-[#2D1810]">
            {winner.username} wins!
          </p>
          <p className="text-[#8B6347] mt-1">Game over</p>
        </div>
      ) : isHost ? (
        <button
          onClick={() => sendAction('next_round')}
          className="w-full py-4 rounded-2xl font-bold text-white text-xl"
          style={{ background: '#E84A8B', fontFamily: 'Fredoka, sans-serif' }}
        >
          Next round →
        </button>
      ) : (
        <p className="text-center text-[#8B6347] text-sm py-2">Waiting for host to start next round…</p>
      )}
    </div>
  );
}
