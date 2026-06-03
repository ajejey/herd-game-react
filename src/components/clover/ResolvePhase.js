import React, { useState } from 'react';
import { fredokaStyle } from '../MeadowLayout';
import CloverBoard from './CloverBoard';

export default function ResolvePhase({ game }) {
  const { state, sendAction } = game;
  const active = state.active;
  const placement = state.placement || [null, null, null, null];
  const [selectedCard, setSelectedCard] = useState(null);

  if (!active) return <p className="text-center text-[#8B6347] py-10">Loading clover…</p>;

  const { authorName, clues, cards = [], isAuthor, revealing, result, solution, decoy } = active;
  const progress = state.progress || { index: 0, total: 1 };

  // ── Reveal ──
  if (revealing && result) {
    const perfect = result.score >= 6 || result.correctMask?.every(Boolean);
    return (
      <div className="max-w-md mx-auto text-center">
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810]">
          {authorName}'s clover — {result.correctMask.filter(Boolean).length}/4 right
        </h2>
        <p className={`mt-1 font-bold ${perfect ? 'text-[#3D8B5A]' : 'text-[#B06A2C]'}`}>
          +{result.score} {perfect ? 'points — perfect clover! 🍀' : 'points'}
        </p>

        <div className="my-5">
          <CloverBoard leaves={solution} clues={clues} mode="reveal" correctMask={result.correctMask} />
        </div>

        <p className="text-sm text-[#8B6347]">The decoy card was <strong className="text-[#2D1810]">{decoy || '—'}</strong>.</p>

        <button onClick={() => sendAction('next_clover')}
          style={{ background: '#E84A8B', fontFamily: 'Fredoka, sans-serif' }}
          className="mt-5 px-8 py-3 rounded-2xl text-white font-bold text-lg hover:scale-105 transition-transform">
          {progress.index + 1 >= progress.total ? 'See final score →' : 'Next clover →'}
        </button>
      </div>
    );
  }

  // ── Author (spectator) view ──
  if (isAuthor) {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="bg-[#FFF6E9] border-2 border-[#FFE8C8] rounded-2xl p-3 mb-4">
          <p style={fredokaStyle} className="font-bold text-[#2D1810]">This is your clover — stay quiet! 🤫</p>
          <p className="text-sm text-[#4A2D1B]">No hints, no faces. Let your team rebuild it from your clues.</p>
        </div>
        <CloverBoard leaves={placement} clues={clues} mode="static" />
        <p className="text-sm text-[#8B6347] mt-4">Your team is placing cards now…</p>
      </div>
    );
  }

  // ── Team guessing view ──
  const allPlaced = placement.every((p) => p);
  function onLeafTap(i) {
    if (selectedCard) {
      sendAction('place_card', { slot: i, card: selectedCard });
      setSelectedCard(null);
    } else if (placement[i]) {
      sendAction('place_card', { slot: i, card: null }); // clear
    }
  }

  return (
    <div className="max-w-md mx-auto text-center">
      <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810]">
        Rebuild {authorName}'s clover
      </h2>
      <p className="text-[#8B6347] text-sm">Clover {progress.index + 1} of {progress.total}</p>
      <p className="text-[#4A2D1B] text-sm mt-1">
        Use the clues to place <strong>4 of the 5</strong> words back in the right leaves. One is a decoy — leave it out.
      </p>

      <div className="my-5">
        <CloverBoard leaves={placement} clues={clues} mode="resolve" onLeafTap={onLeafTap} />
      </div>

      <p className="text-xs text-[#8B6347] mb-2">Tap a word, then tap a leaf. Tap a filled leaf to clear it.</p>

      {/* card tray */}
      <div className="flex flex-wrap justify-center gap-2">
        {cards.map((card) => {
          const placed = placement.includes(card);
          const sel = selectedCard === card;
          return (
            <button key={card} onClick={() => setSelectedCard(sel ? null : card)}
              className={`px-3 py-2 rounded-xl border-2 font-semibold text-sm transition-all ${
                sel ? 'border-[#E84A8B] bg-[#FFE8F1] text-[#2D1810] scale-105'
                  : placed ? 'border-[#C9E3D0] bg-[#EAF6EE] text-[#6B8E76]'
                  : 'border-[#FFE8C8] bg-white text-[#2D1810] hover:border-[#E84A8B]'
              }`}>
              {card}{placed && ' ✓'}
            </button>
          );
        })}
      </div>

      <button onClick={() => sendAction('confirm_placement')} disabled={!allPlaced}
        style={{ background: '#3D8B5A', fontFamily: 'Fredoka, sans-serif' }}
        className="w-full mt-5 py-4 rounded-2xl text-white font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105 transition-all">
        {allPlaced ? 'Confirm placement →' : 'Place all 4 leaves first'}
      </button>
    </div>
  );
}
