import React, { useState } from 'react';
import { fredokaStyle } from '../MeadowLayout';
import { ChalkIcon, ClockIcon } from './icons/Icons';
import AdSlot from '../AdSlot';

export default function AnsweringPhase({ game }) {
  const { state, myId, isHost, sendAction } = game;
  const { round } = state;
  const [text, setText] = useState('');

  const myAnswer = round.answers.find(a => a.playerId === myId);
  const answeredCount = round.answers.length;
  const eligibleCount = state.players.filter(p => p.connected).length;

  function handleSubmit(e) {
    e.preventDefault();
    const cleaned = text.replace(/[^0-9.-]/g, '');
    if (!cleaned || !Number.isFinite(parseFloat(cleaned))) return;
    sendAction('submit_answer', { number: parseFloat(cleaned) });
    setText('');
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Question card */}
      <div className="bg-white rounded-2xl border-2 border-[#FFE8C8] p-5 mb-4 text-center">
        <p className="text-xs uppercase tracking-widest text-[#8B6347] mb-2">Round {state.currentRound} of {state.totalRounds}</p>
        <p style={fredokaStyle} className="text-xl md:text-2xl text-[#2D1810] font-bold">{round.question}</p>
      </div>

      {myAnswer ? (
        <div className="text-center py-4">
          <div className="inline-block bg-[#F0FFF4] border-2 border-[#3D8B5A] rounded-2xl px-6 py-4 mb-3">
            <p className="text-[#2D1810] font-semibold text-sm">Your guess:</p>
            <p style={fredokaStyle} className="text-3xl text-[#3D8B5A] font-bold">{myAnswer.number}</p>
          </div>
          <p className="text-[#8B6347] text-sm flex items-center justify-center gap-2">
            <ClockIcon size={18} />
            {answeredCount} of {eligibleCount} answered — waiting for others…
          </p>

          {/* Ad — player is waiting */}
          <div className="mt-6 max-h-[280px] overflow-hidden">
            <AdSlot slot="5698170537" />
          </div>

          {isHost && answeredCount > 0 && answeredCount < eligibleCount && (
            <button
              onClick={() => sendAction('force_betting')}
              className="mt-4 px-5 py-2 rounded-xl border-2 border-[#8B6347] text-[#8B6347] text-sm font-semibold hover:bg-[#FFF5E8]"
            >
              Skip slow players →
            </button>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-center">
            <span className="flex justify-center mb-2"><ChalkIcon size={48} /></span>
            <span style={fredokaStyle} className="block text-[#2D1810] font-bold text-lg mb-2">Your guess (a number)</span>
            <input
              type="text"
              inputMode="decimal"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="e.g. 206"
              maxLength={15}
              className="w-full px-4 py-4 rounded-xl border-2 border-[#FFE8C8] focus:border-[#3D8B5A] focus:outline-none text-[#2D1810] bg-[#FFFDF8] text-2xl text-center font-bold"
              autoFocus
            />
          </label>
          <button
            type="submit"
            disabled={!text.trim()}
            className="w-full py-3 rounded-xl font-bold text-white text-lg disabled:opacity-40"
            style={{ background: '#E84A8B', fontFamily: 'Fredoka, sans-serif' }}
          >
            Lock in my guess
          </button>
          <p className="text-center text-xs text-[#8B6347]">
            Closest WITHOUT going over wins. Wild guesses welcome.
          </p>
        </form>
      )}

      {isHost && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => sendAction('cancel_round')}
            className="px-4 py-1.5 rounded-lg border-2 border-red-300 text-red-500 text-xs font-semibold hover:bg-red-50"
          >
            Cancel round
          </button>
        </div>
      )}
    </div>
  );
}
