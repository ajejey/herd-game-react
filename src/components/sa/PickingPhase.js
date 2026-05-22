import React from 'react';
import { fredokaStyle } from '../MeadowLayout';
import { DiceIcon, ScaleIcon } from './icons/Icons';

export default function PickingPhase({ game }) {
  const { state, isJudge, judge, sendAction } = game;
  const { round } = state;

  if (isJudge) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3"><DiceIcon size={56} /></div>
          <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810]">You're the judge!</h2>
          <p className="text-[#4A2D1B]">Pick a question for everyone to answer.</p>
        </div>
        <div className="space-y-3">
          {round.questionChoices.map((q, i) => (
            <button
              key={i}
              onClick={() => sendAction('pick_question', { question: q })}
              className="w-full text-left px-5 py-4 rounded-2xl bg-white border-2 border-[#FFE8C8] hover:border-[#E84A8B] hover:bg-[#FFF0F7] transition-all text-[#2D1810] font-semibold"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center py-12">
      <div className="flex justify-center mb-4 animate-bounce"><ScaleIcon size={64} /></div>
      <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-2">
        {judge?.username} is picking a question…
      </h2>
      <p className="text-[#8B6347]">Get ready to answer!</p>
    </div>
  );
}
