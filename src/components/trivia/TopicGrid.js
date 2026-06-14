import React from 'react';
import { Link } from 'react-router-dom';
import { fredokaStyle } from '../MeadowLayout';
import { TOPICS } from './topics';

// Soft alternating card tints so the grid feels playful, not like a link list.
const TINTS = [
  { bg: '#FFF1F4', border: '#FFD6E0' },
  { bg: '#F2F9FF', border: '#CFE6FF' },
  { bg: '#F4FBF6', border: '#CDEBD6' },
  { bg: '#FFF8E7', border: '#FFE8C8' },
];

/*
  Attractive, reusable topic chooser. `exclude` hides the current topic's own
  card; `compact` renders smaller cards (used inside the result screen).
*/
export default function TopicGrid({ exclude, compact = false }) {
  const topics = TOPICS.filter((t) => t.slug !== exclude);
  return (
    <ul className={`grid grid-cols-2 ${compact ? 'sm:grid-cols-3' : 'sm:grid-cols-3'} gap-2.5`}>
      {topics.map((t, i) => {
        const tint = TINTS[i % TINTS.length];
        return (
          <li key={t.slug}>
            <Link
              to={`/${t.slug}`}
              style={{ background: tint.bg, borderColor: tint.border }}
              className={`flex items-center gap-2 ${compact ? 'px-3 py-2.5' : 'px-3.5 py-3'} rounded-2xl border-2 text-[#2D1810] font-bold shadow-[0_6px_14px_-10px_rgba(45,24,16,0.5)] transition-transform hover:-translate-y-0.5 hover:shadow-[0_10px_20px_-10px_rgba(45,24,16,0.55)]`}
            >
              <span className={compact ? 'text-xl' : 'text-2xl'} aria-hidden="true">{t.emoji}</span>
              <span style={fredokaStyle} className={compact ? 'text-sm leading-tight' : 'text-sm md:text-base leading-tight'}>{t.name}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
