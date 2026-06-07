import React from 'react';
import { motion } from 'framer-motion';
import { fredokaStyle } from '../MeadowLayout';
import { colorForLevel } from './puzzles';

/*
  Huddle board — solved-group banners on top, then the 4×4 grid of remaining
  tiles, mistake dots, and the Shuffle / Deselect / Submit controls.
*/
export default function HuddleBoard({
  tiles, selected, solved, mistakes, maxMistakes, message, status,
  toggle, deselectAll, shuffle, submit,
}) {
  const playing = status === 'playing';
  return (
    <div>
      {/* solved groups */}
      <div className="space-y-2 mb-2">
        {solved.map((g, i) => (
          <motion.div key={g.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="rounded-2xl px-3 py-2 text-center text-white" style={{ background: colorForLevel(g.level) }}>
            <p style={fredokaStyle} className="font-bold uppercase tracking-wide text-sm md:text-base">{g.name}</p>
            <p className="text-xs md:text-sm opacity-95">{g.words.join(' · ')}</p>
          </motion.div>
        ))}
      </div>

      {/* grid of remaining tiles */}
      {tiles.length > 0 && (
        <div className="grid grid-cols-4 gap-1.5 md:gap-2">
          {tiles.map((t) => {
            const isSel = selected.includes(t.word);
            return (
              <button
                key={t.word}
                onClick={() => toggle(t.word)}
                disabled={!playing}
                style={isSel ? { background: '#2D1810' } : fredokaStyle}
                className={`aspect-[5/4] md:aspect-[3/2] rounded-xl font-bold uppercase leading-none flex items-center justify-center text-center px-1 transition-colors select-none
                  ${isSel ? 'text-white' : 'bg-[#FFF1DC] text-[#2D1810] hover:bg-[#FFE3BC]'}`}
              >
                <span className="text-[11px] sm:text-sm md:text-base break-words">{t.word}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* message + mistakes */}
      <div className="mt-4 flex flex-col items-center gap-3">
        {message && <p className="text-sm font-semibold text-[#8B6347] min-h-[1.25rem]">{message}</p>}

        {playing && (
          <div className="flex items-center gap-2 text-sm text-[#8B6347]">
            <span>Mistakes left:</span>
            <span className="flex gap-1">
              {Array.from({ length: maxMistakes }).map((_, i) => (
                <span key={i} className={`inline-block w-3 h-3 rounded-full ${i < maxMistakes - mistakes ? 'bg-[#E84A8B]' : 'bg-[#E8D9C5]'}`} />
              ))}
            </span>
          </div>
        )}

        {playing && (
          <div className="flex flex-wrap justify-center gap-2">
            <button onClick={shuffle} className="px-5 py-2.5 rounded-full border-2 border-[#2D1810] text-[#2D1810] font-semibold hover:bg-[#FFF1DC]">
              Shuffle
            </button>
            <button onClick={deselectAll} disabled={!selected.length}
              className="px-5 py-2.5 rounded-full border-2 border-[#2D1810] text-[#2D1810] font-semibold hover:bg-[#FFF1DC] disabled:opacity-40">
              Deselect
            </button>
            <button onClick={submit} disabled={selected.length !== 4}
              style={{ background: selected.length === 4 ? '#2D1810' : '#C9B89F', fontFamily: 'Fredoka, sans-serif' }}
              className="px-6 py-2.5 rounded-full text-white font-bold disabled:cursor-not-allowed">
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
