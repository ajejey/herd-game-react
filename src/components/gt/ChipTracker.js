import React from 'react';
import { fredokaStyle } from '../MeadowLayout';
import { ChipIcon, ChipSlotIcon, FireIcon, ShieldIcon } from './icons/Icons';

/*
  Status display — small chip inventory, intentionally NOT button-like.
  CTA is the chalkboard rows below.

  Props:
    placedNumbers: array of length 0..2 — the guessed numbers I've bet on (for display)
*/

export default function ChipTracker({ placedNumbers = [] }) {
  const allPlaced = placedNumbers.length === 2;
  const isDoubledDown = allPlaced && placedNumbers[0] === placedNumbers[1];
  const isHedged = allPlaced && placedNumbers[0] !== placedNumbers[1];

  return (
    <div className="bg-[#FFFBE8] border-2 border-[#FFE8C8] rounded-2xl px-4 py-3 mb-2">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span style={fredokaStyle} className="text-sm font-bold text-[#2D1810] shrink-0">
            Your chips:
          </span>
          <div className="flex items-center gap-1.5">
            {[0, 1].map(i => {
              const num = placedNumbers[i];
              return num != null ? (
                <div key={i} className="flex items-center gap-1 bg-white rounded-full pl-0.5 pr-2 py-0.5 border-2 border-[#A86F2F]">
                  <ChipIcon size={22} />
                  <span className="text-xs font-bold text-[#2D1810]">{num}</span>
                </div>
              ) : (
                <ChipSlotIcon key={i} size={26} />
              );
            })}
          </div>
        </div>
        <span className="text-xs font-bold text-[#8B6347] shrink-0">
          {placedNumbers.length}/2
        </span>
      </div>

      {!allPlaced && (
        <p className="text-xs text-[#8B6347] mt-1.5">
          {placedNumbers.length === 0
            ? 'Tap any row on the board below to place a chip. Both on one = double-down.'
            : 'One chip left — tap a row to place it.'}
        </p>
      )}
      {isDoubledDown && (
        <div className="mt-1.5 flex items-center gap-1.5 text-[#D84315] font-bold text-xs">
          <FireIcon size={16} />
          <span style={fredokaStyle}>Doubled-down on {placedNumbers[0]} — bold!</span>
        </div>
      )}
      {isHedged && (
        <div className="mt-1.5 flex items-center gap-1.5 text-[#2D6FA0] font-bold text-xs">
          <ShieldIcon size={16} />
          <span style={fredokaStyle}>Hedged — playing it safe.</span>
        </div>
      )}
    </div>
  );
}
