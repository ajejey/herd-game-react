import React from 'react';
import { Link } from 'react-router-dom';
import { FaFire } from 'react-icons/fa';
import { FiCheck } from 'react-icons/fi';
import { fredokaStyle } from './MeadowLayout';
import { DAILY_GAMES, getDailyProgress } from '../lib/dailyProgress';

/*
  Unified "today's daily games" checklist + streak. The retention hook: it shows
  how many of the day's games you've completed, your cross-game streak, and one-
  tap links to the ones you haven't played — turning a single-game visit into a
  habit across all the dailies. Drop it on any daily-game result screen.

  `exclude` hides the game you're currently on (it's already done/here).
*/
export default function DailyChecklist({ exclude, className = '' }) {
  const { played, streak } = getDailyProgress();
  const doneCount = DAILY_GAMES.filter((g) => played.has(g.game)).length;

  return (
    <div className={`bg-[#FFF8E7] rounded-2xl border-2 border-[#FFE8C8] p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 style={fredokaStyle} className="text-base font-bold text-[#2D1810]">
          Today’s daily games · {doneCount}/{DAILY_GAMES.length}
        </h3>
        {streak >= 1 && (
          <span className="inline-flex items-center gap-1 text-[#E84A8B] font-bold text-sm">
            <FaFire /> {streak}-day streak
          </span>
        )}
      </div>

      <ul className="grid grid-cols-1 gap-2">
        {DAILY_GAMES.filter((g) => g.game !== exclude).map((g) => {
          const done = played.has(g.game);
          return (
            <li key={g.game}>
              <Link
                to={g.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl border-2 transition-colors ${
                  done
                    ? 'border-[#CDEBD6] bg-[#F4FBF6]'
                    : 'border-[#FFE8C8] bg-white hover:border-[#E84A8B]'
                }`}
              >
                <span className="text-xl" aria-hidden="true">{g.emoji}</span>
                <span style={fredokaStyle} className="text-sm font-bold text-[#2D1810] flex-1 text-left">{g.label}</span>
                {done ? (
                  <span className="inline-flex items-center gap-1 text-[#3D8B5A] text-xs font-bold"><FiCheck /> Done</span>
                ) : (
                  <span className="text-[#E84A8B] text-xs font-bold">Play →</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>

      {doneCount >= DAILY_GAMES.length && (
        <p className="text-center text-[#3D8B5A] font-semibold text-sm mt-3">All done today — come back tomorrow! 🎉</p>
      )}
    </div>
  );
}
