import React from 'react';
import { fredokaStyle } from '../MeadowLayout';
import { ThinkIcon, ChalkIcon, ChipIcon, BoardIcon, TrophyIcon } from './icons/Icons';

const PHASES = {
  question:  { Icon: ThinkIcon,  title: 'Here comes the question…',           sub: 'Read it carefully. You\'ll write a number guess in a second.' },
  answering: { Icon: ChalkIcon,  title: 'Write your number',                  sub: 'Closest WITHOUT going over wins. Wild guesses welcome.' },
  betting:   { Icon: ChipIcon,   title: 'Place BOTH your chips',              sub: 'Bet on any guess — your own or someone else\'s. Double-down or split.' },
  reveal:    { Icon: BoardIcon,  title: 'Drumroll… the actual answer',        sub: 'Closest without going over takes the round.' },
  finished:  { Icon: TrophyIcon, title: 'And the winner is…',                 sub: 'Final scoreboard below.' },
};

export default function PhaseBanner({ phase }) {
  const meta = PHASES[phase];
  if (!meta) return null;
  const { Icon, title, sub } = meta;

  return (
    <div className="mb-4 bg-gradient-to-r from-[#FFF0F7] to-[#FFFBE8] border-2 border-[#FFE8C8] rounded-2xl px-4 py-3 flex items-center gap-3 shadow-sm">
      <div className="shrink-0"><Icon size={36} /></div>
      <div className="min-w-0">
        <p style={fredokaStyle} className="text-[#2D1810] font-bold text-sm md:text-base leading-tight">{title}</p>
        <p className="text-[#6B4226] text-xs md:text-sm leading-snug">{sub}</p>
      </div>
    </div>
  );
}
