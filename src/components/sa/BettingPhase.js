import React from 'react';
import { fredokaStyle } from '../MeadowLayout';
import BetTokenTracker from './BetTokenTracker';
import { TokenIcon, ScaleIcon, ClockIcon } from './icons/Icons';

export default function BettingPhase({ game }) {
  const { state, myId, isJudge, isHost, sendAction } = game;
  const { round } = state;

  const myBets = round.bets.filter(b => b.playerId === myId);
  const myBetCount = (answerId) => myBets.filter(b => b.answerId === answerId).length;

  const eligibleCount = state.players.filter(
    p => p.connected && p.id !== state.players[state.judgeIndex]?.id
  ).length;
  const playerBetCounts = round.bets.reduce((acc, b) => {
    acc[b.playerId] = (acc[b.playerId] ?? 0) + 1;
    return acc;
  }, {});
  const bettedCount = Object.values(playerBetCounts).filter(c => c === 2).length;

  // Build the "placedAnswers" array for the tracker (preserves order of placement)
  const placedAnswers = myBets.map(b => {
    const ans = round.answers.find(a => a.id === b.answerId);
    return { answerId: b.answerId, authorName: ans?.username ?? '?' };
  });

  // ── Judge view (waiting for others) ────────────────────────────────────────
  if (isJudge) {
    return (
      <div className="max-w-lg mx-auto text-center py-8">
        <div className="flex justify-center mb-4">
          <ScaleIcon size={72} />
        </div>
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-2">
          Everyone's placing bets
        </h2>
        <p className="text-[#6B4226] flex items-center justify-center gap-2">
          <ClockIcon size={20} />
          <span><span className="font-bold text-[#E84A8B]">{bettedCount}</span> of {eligibleCount} done</span>
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

  const allTokensPlaced = myBets.length === 2;

  // ── Non-judge view ─────────────────────────────────────────────────────────
  return (
    <div className="max-w-lg mx-auto">
      {/* Question card */}
      <div className="bg-white rounded-2xl border-2 border-[#FFE8C8] p-4 md:p-5 mb-4 text-center">
        <p className="text-xs text-[#8B6347] uppercase tracking-widest mb-1">The question</p>
        <p style={fredokaStyle} className="text-lg md:text-xl text-[#2D1810] font-bold">{round.question}</p>
      </div>

      {/* Status display (passive — not clickable) */}
      <BetTokenTracker placedAnswers={placedAnswers} />

      {/* Directional cue — the real CTA is below */}
      {!allTokensPlaced && (
        <p className="text-center text-sm font-bold text-[#E84A8B] mb-2 flex items-center justify-center gap-1.5 animate-[arrowBob_1.2s_ease-in-out_infinite]">
          <span style={fredokaStyle}>Tap an answer to place a token</span>
          <span className="text-lg">↓</span>
        </p>
      )}

      {/* Answer cards — the actual CTAs */}
      <div className={`space-y-3 ${!allTokensPlaced ? 'sa-answer-glow' : ''}`}>
        {round.answers.map(a => {
          const count = myBetCount(a.id);
          const isLocked = allTokensPlaced;
          return (
            <button
              key={a.id}
              disabled={isLocked}
              onClick={() => sendAction('submit_bet', { answerId: a.id })}
              className={`w-full text-left px-4 md:px-5 py-4 md:py-5 rounded-2xl border-2 transition-all ${
                count > 0
                  ? 'bg-[#E84A8B] border-[#C73B73] text-white shadow-md'
                  : isLocked
                  ? 'bg-white border-[#FFE8C8] opacity-50 cursor-not-allowed'
                  : 'bg-white border-[#FFE8C8] hover:border-[#E84A8B] hover:bg-[#FFF0F7] active:scale-[0.98] shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold break-words">{a.text}</p>
                  <p className={`text-xs mt-1 ${count > 0 ? 'text-pink-100' : 'text-[#8B6347]'}`}>by {a.username}</p>
                </div>
                {count > 0 && (
                  <div className="flex gap-1 shrink-0">
                    {Array.from({ length: count }).map((_, i) => (
                      <TokenIcon key={i} size={28} />
                    ))}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Waiting line — ONLY when I've placed both tokens */}
      {allTokensPlaced && (
        <div className="mt-5 px-4 py-3 bg-[#F0FFF4] border-2 border-[#3D8B5A] rounded-xl flex items-center justify-center gap-2">
          <ClockIcon size={20} />
          <p className="text-[#2F6E45] font-semibold text-sm">
            Bets locked in — waiting for {Math.max(0, eligibleCount - bettedCount)} more…
          </p>
        </div>
      )}

      <style>{`
        @keyframes arrowBob {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(3px); }
        }
        .sa-answer-glow > button:not(:disabled):not(:hover) {
          animation: answerGlow 2.4s ease-in-out infinite;
        }
        @keyframes answerGlow {
          0%, 100% { box-shadow: 0 1px 3px rgba(45,24,16,0.08); }
          50%      { box-shadow: 0 4px 16px -4px rgba(232,74,139,0.35); }
        }
      `}</style>
    </div>
  );
}
