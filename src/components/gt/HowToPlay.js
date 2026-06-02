import React from 'react';
import { fredokaStyle } from '../MeadowLayout';

export default function HowToPlay({ onClose, compact = false }) {
  const Wrap = compact
    ? ({ children }) => <div className="bg-white rounded-2xl border-2 border-[#FFE8C8] p-5">{children}</div>
    : ({ children }) => (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
          <div onClick={e => e.stopPropagation()} className="bg-white rounded-3xl border-4 border-[#FFE8C8] max-w-md w-full max-h-[85vh] overflow-y-auto p-6 relative shadow-2xl">
            <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#FFE8C8] hover:bg-[#FFD56B] flex items-center justify-center text-[#2D1810] font-bold">×</button>
            {children}
          </div>
        </div>
      );

  return (
    <Wrap>
      <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-1">How to Play Guesstimate</h2>
      <p className="text-[#8B6347] text-sm mb-4">A trivia-betting party game. Quick read — you'll get it in one round.</p>

      <ol className="space-y-3 text-[#2D1810] text-sm mb-5">
        <li className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-[#FFE8C8] flex items-center justify-center font-bold text-[#2D1810]">1</span>
          <div>
            <p className="font-semibold">A trivia question appears</p>
            <p className="text-[#8B6347] text-xs">Every question has a numerical answer. E.g. "How many bones in the human body?"</p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-[#FFE8C8] flex items-center justify-center font-bold text-[#2D1810]">2</span>
          <div>
            <p className="font-semibold">Everyone writes a guess</p>
            <p className="text-[#8B6347] text-xs">No partial credit. Just one number.</p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-[#FFE8C8] flex items-center justify-center font-bold text-[#2D1810]">3</span>
          <div>
            <p className="font-semibold">Guesses go on the chalkboard</p>
            <p className="text-[#8B6347] text-xs">Sorted low → high. The lowest guess has the longest odds (5×), highest has the shortest (1×).</p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-[#FFE8C8] flex items-center justify-center font-bold text-[#2D1810]">4</span>
          <div>
            <p className="font-semibold">Place 2 chips on any guess</p>
            <p className="text-[#8B6347] text-xs">Own or others. Double down (both on one) or hedge (split across two).</p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-[#FFE8C8] flex items-center justify-center font-bold text-[#2D1810]">5</span>
          <div>
            <p className="font-semibold">The real answer is revealed</p>
            <p className="text-[#8B6347] text-xs">Closest WITHOUT going over wins. If all guesses are over, the lowest one wins.</p>
          </div>
        </li>
      </ol>

      <div className="bg-[#FFFBE8] border-2 border-[#FFD56B] rounded-2xl p-4 mb-3">
        <p style={fredokaStyle} className="text-base font-bold text-[#2D1810] mb-1">⭐ Scoring</p>
        <ul className="text-sm text-[#2D1810] space-y-1">
          <li>Writing the winning guess: <span className="font-bold text-[#3D8B5A]">+2 points</span></li>
          <li>Each chip on the winning guess: <span className="font-bold text-[#3D8B5A]">payout × 1 point</span> (so a chip on a 5× slot = 5 points)</li>
        </ul>
      </div>

      <p className="text-center text-[#8B6347] text-xs italic">7 rounds. Highest score wins 🏆</p>
    </Wrap>
  );
}
