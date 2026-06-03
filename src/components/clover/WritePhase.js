import React, { useState } from 'react';
import { fredokaStyle } from '../MeadowLayout';
import CloverBoard from './CloverBoard';

export default function WritePhase({ game }) {
  const { state, isHost, sendAction } = game;
  const mine = state.myClover;
  const [clues, setClues] = useState(['', '', '', '']);

  const status = state.cloverStatus || {};
  const players = state.players || [];
  const submittedCount = players.filter((p) => status[p.id]).length;

  if (!mine) {
    return <p className="text-center text-[#8B6347] py-10">Setting up your clover…</p>;
  }

  // Already submitted → waiting room
  if (mine.submitted) {
    return (
      <div className="max-w-md mx-auto text-center">
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810]">Clues sent! 🌱</h2>
        <p className="text-[#4A2D1B] mt-2">Waiting for everyone to finish writing their clues…</p>
        <p className="text-[#8B6347] mt-3 font-semibold">{submittedCount} of {players.length} done</p>
        <ul className="mt-4 inline-flex flex-col gap-1 text-sm">
          {players.map((p) => (
            <li key={p.id} className="flex items-center gap-2 justify-center">
              <span className={`w-2 h-2 rounded-full ${status[p.id] ? 'bg-green-400' : 'bg-gray-300'}`} />
              <span className="text-[#2D1810]">{p.username}</span>
              <span className="text-[#8B6347]">{status[p.id] ? 'ready' : 'writing…'}</span>
            </li>
          ))}
        </ul>
        {isHost && submittedCount < players.length && (
          <div className="mt-5">
            <button onClick={() => sendAction('force_resolve')}
              className="text-sm underline text-[#3D8B5A] font-semibold">
              Everyone's ready? Skip the wait and start guessing →
            </button>
          </div>
        )}
      </div>
    );
  }

  const k = mine.keywords;
  const pairs = [0, 1, 2, 3].map((i) => [k[i], k[(i + 1) % 4]]);
  const allFilled = clues.every((c) => c.trim());

  function setClue(i, v) {
    setClues((cs) => cs.map((c, idx) => (idx === i ? v : c)));
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-2">
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810]">Write your clues</h2>
        <p className="text-[#4A2D1B] text-sm mt-1">
          These are <strong>your</strong> 4 words. For each connected pair, write a <strong>one-word clue</strong> that links them — your team will use the clues to rebuild your clover later.
        </p>
      </div>

      <CloverBoard leaves={k} clues={clues} mode="static" />

      <div className="space-y-3 mt-4">
        {pairs.map(([a, b], i) => (
          <div key={i}>
            <label className="text-sm font-semibold text-[#2D1810]">
              Clue {i + 1}: link <span className="text-[#3D8B5A]">{a}</span> ↔ <span className="text-[#3D8B5A]">{b}</span>
            </label>
            <input
              value={clues[i]}
              onChange={(e) => setClue(i, e.target.value)}
              maxLength={30}
              placeholder="one word…"
              className="w-full mt-1 px-4 py-2.5 rounded-xl border-2 border-[#FFE8C8] focus:border-[#E84A8B] outline-none text-[#2D1810] bg-white"
            />
          </div>
        ))}
      </div>

      <p className="text-xs text-[#8B6347] mt-2 text-center">One word each. Can't be one of your own words.</p>

      <button
        onClick={() => sendAction('submit_clues', { clues: clues.map((c) => c.trim()) })}
        disabled={!allFilled}
        style={{ background: '#E84A8B', fontFamily: 'Fredoka, sans-serif' }}
        className="w-full mt-4 py-4 rounded-2xl text-white font-bold text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105 transition-all"
      >
        Lock in my clues →
      </button>
    </div>
  );
}
