import React from 'react';
import { fredokaStyle } from '../MeadowLayout';

export default function BettingPhase({ game }) {
  const { state, myId, isJudge, judge, isHost, sendAction } = game;
  const { round } = state;

  const myBets = round.bets.filter(b => b.playerId === myId);
  // count how many of MY bets are on each answer (0, 1, or 2)
  const myBetCount = (answerId) => myBets.filter(b => b.answerId === answerId).length;

  const eligibleCount = state.players.filter(
    p => p.connected && p.id !== state.players[state.judgeIndex]?.id
  ).length;
  // count players who placed BOTH bets
  const playerBetCounts = round.bets.reduce((acc, b) => {
    acc[b.playerId] = (acc[b.playerId] ?? 0) + 1;
    return acc;
  }, {});
  const bettedCount = Object.values(playerBetCounts).filter(c => c === 2).length;

  if (isJudge) {
    return (
      <div className="max-w-lg mx-auto text-center py-10">
        <div className="text-5xl mb-4">🎲</div>
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-2">
          Everyone is betting…
        </h2>
        <p className="text-[#8B6347]">
          <span className="font-bold text-[#E84A8B]">{bettedCount}</span> of {eligibleCount} placed their bet
        </p>
        {isHost && bettedCount > 0 && (
          <button
            onClick={() => sendAction('force_reveal')}
            className="mt-6 px-5 py-2 rounded-xl border-2 border-[#8B6347] text-[#8B6347] text-sm font-semibold hover:bg-[#FFF5E8]"
          >
            Reveal now →
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl border-2 border-[#FFE8C8] p-5 mb-5 text-center">
        <p className="text-xs text-[#8B6347] uppercase tracking-widest mb-1">The question</p>
        <p style={fredokaStyle} className="text-xl text-[#2D1810] font-bold">{round.question}</p>
      </div>

      <h2 style={fredokaStyle} className="text-xl font-bold text-[#2D1810] mb-1">
        Place your 2 bets 🎲
      </h2>
      <p className="text-[#4A2D1B] text-sm mb-1">
        Which answer did <span className="font-bold">{judge?.username}</span> secretly pick?
      </p>
      <p className="text-[#8B6347] text-xs mb-4">
        💡 <span className="font-semibold">Double-down</span> (both on one) for 2 points if right, or <span className="font-semibold">hedge</span> (split across two) to play safe.
        {' '}<span className="font-bold text-[#E84A8B]">{2 - myBets.length} left.</span>
      </p>

      <div className="space-y-3">
        {round.answers.map(a => {
          const count = myBetCount(a.id);
          const isMaxed = myBets.length >= 2 && count === 0;
          const isAllInHere = count === 2;
          return (
            <button
              key={a.id}
              disabled={isMaxed || myBets.length >= 2}
              onClick={() => sendAction('submit_bet', { answerId: a.id })}
              className={`w-full text-left px-5 py-4 rounded-2xl border-2 transition-all ${
                count > 0
                  ? 'bg-[#E84A8B] border-[#C73B73] text-white'
                  : isMaxed
                  ? 'bg-white border-[#FFE8C8] opacity-40 cursor-not-allowed'
                  : 'bg-white border-[#FFE8C8] hover:border-[#E84A8B] hover:bg-[#FFF0F7]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <p className="font-semibold">{a.text}</p>
                  <p className={`text-xs mt-0.5 ${count > 0 ? 'text-pink-200' : 'text-[#8B6347]'}`}>{a.username}</p>
                </div>
                {count > 0 && (
                  <div className="flex gap-1 mt-0.5 shrink-0">
                    {Array.from({ length: count }).map((_, i) => (
                      <span key={i} className="text-xl leading-none">🪙</span>
                    ))}
                  </div>
                )}
              </div>
              {isAllInHere && <span className="text-xs mt-1 block font-bold">🔥 Doubled-down!</span>}
            </button>
          );
        })}
      </div>

      {myBets.length > 0 && (
        <p className="text-center text-[#8B6347] text-sm mt-4">
          {bettedCount} of {eligibleCount} have bet · waiting…
        </p>
      )}
    </div>
  );
}
