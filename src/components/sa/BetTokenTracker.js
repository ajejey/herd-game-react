import React from 'react';
import { fredokaStyle } from '../MeadowLayout';
import { TokenIcon, TokenSlotIcon, FireIcon, ShieldIcon } from './icons/Icons';

/*
  Passive status display showing how many tokens the player has placed.
  Looks like inventory/stash, NOT a button. The CTA is the answer list below.

  Props:
    placedAnswers: array of {answerId, authorName} length 0–2 — which answers I bet on
*/

export default function BetTokenTracker({ placedAnswers = [] }) {
  const isDoubledDown =
    placedAnswers.length === 2 &&
    placedAnswers[0].answerId === placedAnswers[1].answerId;
  const isHedged =
    placedAnswers.length === 2 &&
    placedAnswers[0].answerId !== placedAnswers[1].answerId;
  const allPlaced = placedAnswers.length === 2;

  return (
    <div className="bg-[#FFFBE8] border-2 border-[#FFE8C8] rounded-2xl px-4 py-3 mb-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span style={fredokaStyle} className="text-sm font-bold text-[#2D1810] shrink-0">
            Your tokens:
          </span>
          {/* Two small horizontal chips */}
          <div className="flex items-center gap-1.5">
            {[0, 1].map(i => {
              const placed = placedAnswers[i];
              return placed ? (
                <div key={i} className="flex items-center gap-1 bg-white rounded-full pl-0.5 pr-2 py-0.5 border-2 border-[#FBC02D]">
                  <TokenIcon size={22} />
                  <span className="text-xs font-bold text-[#2D1810] truncate max-w-[80px]">{placed.authorName}</span>
                </div>
              ) : (
                <TokenSlotIcon key={i} size={26} />
              );
            })}
          </div>
        </div>
        <span className="text-xs font-bold text-[#8B6347] shrink-0">
          {placedAnswers.length}/2
        </span>
      </div>

      {/* Status sub-line */}
      {!allPlaced && (
        <p className="text-xs text-[#8B6347] mt-1.5">
          {placedAnswers.length === 0
            ? 'Tap any answer below to place a token. Both on one = double-down.'
            : 'One token left — tap any answer to place it.'}
        </p>
      )}
      {isDoubledDown && (
        <div className="mt-1.5 flex items-center gap-1.5 text-[#D84315] font-bold text-xs">
          <FireIcon size={16} />
          <span style={fredokaStyle}>Doubled-down on {placedAnswers[0].authorName} — bold!</span>
        </div>
      )}
      {isHedged && (
        <div className="mt-1.5 flex items-center gap-1.5 text-[#2D6FA0] font-bold text-xs">
          <ShieldIcon size={16} />
          <span style={fredokaStyle}>Hedged across two — playing it safe.</span>
        </div>
      )}
    </div>
  );
}
