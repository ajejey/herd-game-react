import React from 'react';
import { fredokaStyle } from '../MeadowLayout';

export default function HowToPlay({ onClose, compact = false }) {
  // compact = inline (on home page).  !compact = modal overlay (in-game)
  const Wrap = compact
    ? ({ children }) => <div className="bg-white rounded-2xl border-2 border-[#FFE8C8] p-5">{children}</div>
    : ({ children }) => (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-3xl border-4 border-[#FFE8C8] max-w-md w-full max-h-[85vh] overflow-y-auto p-6 relative shadow-2xl"
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#FFE8C8] hover:bg-[#FFD56B] flex items-center justify-center text-[#2D1810] font-bold"
            >×</button>
            {children}
          </div>
        </div>
      );

  return (
    <Wrap>
      <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-1">How to Play</h2>
      <p className="text-[#8B6347] text-sm mb-4">A quick read — you'll get it in one round.</p>

      {/* The flow */}
      <ol className="space-y-3 text-[#2D1810] text-sm mb-5">
        <li className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-[#FFE8C8] flex items-center justify-center font-bold text-[#2D1810]">1</span>
          <div>
            <p className="font-semibold">The judge picks a question</p>
            <p className="text-[#8B6347] text-xs">Each round, one player is the judge. They choose from 3 questions.</p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-[#FFE8C8] flex items-center justify-center font-bold text-[#2D1810]">2</span>
          <div>
            <p className="font-semibold">Everyone else writes an answer</p>
            <p className="text-[#8B6347] text-xs">Be funny, be honest, be weird — there are no wrong answers.</p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-[#FFE8C8] flex items-center justify-center font-bold text-[#2D1810]">3</span>
          <div>
            <p className="font-semibold">The judge secretly picks a favourite</p>
            <p className="text-[#8B6347] text-xs">Nobody knows their choice yet 🤫</p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-[#FFE8C8] flex items-center justify-center font-bold text-[#2D1810]">4</span>
          <div>
            <p className="font-semibold">Everyone places 2 bets 🪙🪙</p>
            <p className="text-[#8B6347] text-xs">Guess which answer the judge picked. Two tokens to spend, your call.</p>
          </div>
        </li>
        <li className="flex gap-3">
          <span className="shrink-0 w-7 h-7 rounded-full bg-[#FFE8C8] flex items-center justify-center font-bold text-[#2D1810]">5</span>
          <div>
            <p className="font-semibold">Reveal &amp; score</p>
            <p className="text-[#8B6347] text-xs">The pick is shown. Points awarded. Next judge takes over.</p>
          </div>
        </li>
      </ol>

      {/* Betting strategy */}
      <div className="bg-[#FFF0F7] border-2 border-[#E84A8B] rounded-2xl p-4 mb-4">
        <p style={fredokaStyle} className="text-base font-bold text-[#2D1810] mb-1">🎲 Your 2 tokens — the choice</p>
        <ul className="text-sm text-[#2D1810] space-y-1">
          <li><span className="font-bold">Double-down 🔥</span> — both on one answer. <span className="text-[#3D8B5A]">2 points if right</span>, nothing if wrong.</li>
          <li><span className="font-bold">Hedge 🛡️</span> — one on each of two answers. Safer, max 1 point.</li>
        </ul>
      </div>

      {/* Scoring */}
      <div className="bg-[#FFFBE8] border-2 border-[#FFD56B] rounded-2xl p-4 mb-2">
        <p style={fredokaStyle} className="text-base font-bold text-[#2D1810] mb-1">⭐ Points</p>
        <ul className="text-sm text-[#2D1810] space-y-1">
          <li>📝 Your answer gets picked → <span className="font-bold text-[#3D8B5A]">+1</span></li>
          <li>🎯 Your token lands on the picked answer → <span className="font-bold text-[#3D8B5A]">+1 each</span></li>
          <li>⚖️ Judge gets <span className="font-bold text-[#3D8B5A]">+1 per correct token</span> placed by others</li>
        </ul>
      </div>

      <p className="text-center text-[#8B6347] text-xs italic">First to 7 points wins 🏆</p>
    </Wrap>
  );
}
