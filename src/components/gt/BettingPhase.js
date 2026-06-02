import React from 'react';
import { fredokaStyle } from '../MeadowLayout';
import Chalkboard from './Chalkboard';
import ChipTracker from './ChipTracker';
import { ClockIcon } from './icons/Icons';
import AdSlot from '../AdSlot';

export default function BettingPhase({ game }) {
  const { state, isHost, sendAction } = game;
  const { round } = state;

  const myBetIndices = round.bets.map(b => b.boardIndex);
  const placedNumbers = myBetIndices.map(idx => round.board[idx]?.number).filter(n => n != null);
  const allTokensPlaced = myBetIndices.length === 2;

  function handleSelect(boardIndex) {
    sendAction('submit_bet', { boardIndex });
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl border-2 border-[#FFE8C8] p-4 mb-4 text-center">
        <p className="text-xs uppercase tracking-widest text-[#8B6347] mb-1">The question</p>
        <p style={fredokaStyle} className="text-lg md:text-xl text-[#2D1810] font-bold">{round.question}</p>
      </div>

      <ChipTracker placedNumbers={placedNumbers} />

      {!allTokensPlaced && (
        <p className="text-center text-sm font-bold text-[#E84A8B] mb-2 flex items-center justify-center gap-1.5 animate-[gtArrow_1.2s_ease-in-out_infinite]">
          <span style={fredokaStyle}>Tap a row to place a chip</span>
          <span className="text-lg">↓</span>
        </p>
      )}

      <Chalkboard
        board={round.board}
        selectedIndices={myBetIndices}
        onSelect={handleSelect}
        interactive={!allTokensPlaced}
        maxChipsReached={allTokensPlaced}
      />

      {allTokensPlaced && (
        <div className="mt-2 px-4 py-3 bg-[#F0FFF4] border-2 border-[#3D8B5A] rounded-xl flex items-center justify-center gap-2 mb-4">
          <ClockIcon size={20} />
          <p className="text-[#2F6E45] font-semibold text-sm">Chips locked in — waiting for others…</p>
        </div>
      )}

      {/* Ad — betting / waiting */}
      <div className="mb-4 max-h-[280px] overflow-hidden">
        <AdSlot slot="5698170537" />
      </div>

      {isHost && (
        <div className="flex justify-center gap-2 flex-wrap">
          <button
            onClick={() => sendAction('force_reveal')}
            className="px-5 py-2 rounded-xl border-2 border-[#8B6347] text-[#8B6347] text-sm font-semibold hover:bg-[#FFF5E8]"
          >
            Reveal now →
          </button>
          <button
            onClick={() => sendAction('cancel_round')}
            className="px-4 py-2 rounded-lg border-2 border-red-300 text-red-500 text-xs font-semibold hover:bg-red-50"
          >
            Cancel round
          </button>
        </div>
      )}

      <style>{`
        @keyframes gtArrow {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(3px); }
        }
      `}</style>
    </div>
  );
}
