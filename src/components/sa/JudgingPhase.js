import React from 'react';
import { fredokaStyle } from '../MeadowLayout';

export default function JudgingPhase({ game }) {
  const { state, isJudge, judge, sendAction } = game;
  const { round } = state;

  if (isJudge) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border-2 border-[#FFE8C8] p-5 mb-5 text-center">
          <p className="text-xs text-[#8B6347] uppercase tracking-widest mb-1">The question</p>
          <p style={fredokaStyle} className="text-xl text-[#2D1810] font-bold">{round.question}</p>
        </div>

        <h2 style={fredokaStyle} className="text-xl font-bold text-[#2D1810] mb-1">Pick your favourite</h2>
        <p className="text-[#8B6347] text-sm mb-4">Only you can see which answer you pick.</p>

        <div className="space-y-3">
          {round.answers.map(a => (
            <button
              key={a.id}
              onClick={() => sendAction('judge_pick', { answerId: a.id })}
              className="w-full text-left px-5 py-4 rounded-2xl bg-white border-2 border-[#FFE8C8] hover:border-[#E84A8B] hover:bg-[#FFF0F7] transition-all"
            >
              <p className="text-[#2D1810] font-semibold">{a.text}</p>
              <p className="text-xs text-[#8B6347] mt-1">{a.username}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl border-2 border-[#FFE8C8] p-5 mb-5 text-center">
        <p className="text-xs text-[#8B6347] uppercase tracking-widest mb-1">The question</p>
        <p style={fredokaStyle} className="text-xl text-[#2D1810] font-bold">{round.question}</p>
      </div>

      <div className="text-center py-8">
        <div className="text-5xl mb-4">🤫</div>
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-2">
          {judge?.username} is choosing…
        </h2>
        <p className="text-[#8B6347]">The answers are in. Who will they pick?</p>
      </div>

      {/* Show all answers but greyed-out since no one knows the pick yet */}
      <div className="space-y-2">
        {round.answers.map(a => (
          <div key={a.id} className="px-5 py-3 rounded-2xl bg-white border-2 border-[#FFE8C8]">
            <p className="text-[#2D1810] font-semibold">{a.text}</p>
            <p className="text-xs text-[#8B6347] mt-0.5">{a.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
