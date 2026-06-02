import React from 'react';
import { fredokaStyle } from '../MeadowLayout';
import { ChipIcon } from './icons/Icons';

/*
  The signature visual — a wooden-framed chalkboard listing the betting board.
  Each row: position (1st through Nth), the number, who wrote it, the payout multiplier.

  Props:
    board: [{ number, authors: [{playerId,username}], payout }]
    selectedIndices: array of indices the current player has placed chips on (with duplicates allowed for double-down)
    onSelect(index): clicked
    winningIndex: number | null — used in reveal phase to highlight
    actualAnswer: number | null — shown only in reveal phase
    interactive: boolean — when false (reveal), no click handlers
*/

export default function Chalkboard({ board, selectedIndices = [], onSelect, winningIndex = null, actualAnswer = null, interactive = true, maxChipsReached = false }) {
  return (
    <div className="relative rounded-2xl p-1.5 md:p-2 mb-4" style={{
      background: 'linear-gradient(135deg, #8B5A2B 0%, #6B4226 50%, #8B5A2B 100%)',
      boxShadow: '0 6px 18px -6px rgba(0,0,0,0.35), inset 0 1px 2px rgba(255,255,255,0.2)',
    }}>
      <div
        className="rounded-xl p-3 md:p-4"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, #3D7050 0%, #244A30 100%)',
          boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.4)',
        }}
      >
        {/* Header row */}
        <div className="flex items-center justify-between mb-2 pb-2 border-b-2 border-dashed border-white/30">
          <span style={fredokaStyle} className="text-white/90 text-xs md:text-sm tracking-wider uppercase font-bold">
            The Board
          </span>
          {actualAnswer != null && (
            <span style={fredokaStyle} className="text-[#FFD56B] text-xs md:text-sm font-bold">
              Actual: {actualAnswer}
            </span>
          )}
        </div>

        {/* Rows */}
        <div className="space-y-1.5 md:space-y-2">
          {board.map((slot, i) => {
            const myCount = selectedIndices.filter(idx => idx === i).length;
            const isWinning = winningIndex === i;
            const disabled = !interactive || (maxChipsReached && myCount === 0);
            const Row = interactive ? 'button' : 'div';
            const baseCls = `w-full flex items-center justify-between gap-2 px-2.5 md:px-3 py-2 md:py-2.5 rounded-lg transition-all text-left`;
            const colorCls = isWinning
              ? 'bg-[#FFD56B] text-[#2D1810] border-2 border-[#FBC02D]'
              : myCount > 0
              ? 'bg-[#E84A8B]/90 text-white border-2 border-[#C73B73]'
              : interactive
              ? 'bg-white/10 hover:bg-white/20 text-white border-2 border-white/20 hover:border-white/40 active:scale-[0.99]'
              : 'bg-white/10 text-white border-2 border-white/20';
            const disabledCls = disabled && !isWinning && myCount === 0 ? 'opacity-50 cursor-not-allowed' : '';

            return (
              <Row
                key={i}
                {...(interactive ? { onClick: () => !disabled && onSelect?.(i), disabled } : {})}
                className={`${baseCls} ${colorCls} ${disabledCls}`}
              >
                {/* Left: position + payout */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                    isWinning ? 'bg-[#FBC02D] text-white' : 'bg-white/20 text-white/90'
                  }`}>
                    {slot.payout}×
                  </span>
                </div>
                {/* Middle: the guess */}
                <div className="flex-1 min-w-0 text-center">
                  <span style={fredokaStyle} className={`block text-base md:text-lg font-bold ${isWinning ? 'text-[#2D1810]' : myCount > 0 ? 'text-white' : 'text-white'}`}>
                    {slot.number}
                  </span>
                  <span className={`block text-[10px] md:text-xs truncate ${isWinning ? 'text-[#8B6347]' : 'text-white/70'}`}>
                    {slot.authors.map(a => a.username).join(', ')}
                  </span>
                </div>
                {/* Right: my chips */}
                <div className="flex gap-0.5 shrink-0 min-w-[40px] justify-end">
                  {myCount > 0 && Array.from({ length: myCount }).map((_, ci) => (
                    <ChipIcon key={ci} size={22} />
                  ))}
                </div>
              </Row>
            );
          })}
        </div>
      </div>
    </div>
  );
}
