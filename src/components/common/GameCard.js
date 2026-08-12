import React from 'react';
import { Link } from 'react-router-dom';
import { FiUser, FiClock, FiTrendingUp } from 'react-icons/fi';
import { useGameStats, playsLabel } from '../../lib/useGameStats';

/*
  One card for any entry in the game registry (src/data/games.js).

  DESIGN INTENT — this is deliberately NOT the Daily-games card.
  The Daily cards are centred, thick-outlined in their colour, and carry a
  bespoke illustration. These are the *catalogue* cards: a colour band across
  the top, a chunky accent icon, left-aligned copy and a "Play →" that walks on
  hover. Same warm farm family, clearly a different kind of thing — so a
  homepage row of these reads as "a different category of game", not as a
  broken version of the cards above it.

  They also stay cheap to add: colour + icon, no illustration required, which is
  what lets the hub grow to dozens of games.

  Mobile-first: full-width tap target on phones, grid on wider screens.
*/

const fredoka = { fontFamily: "'Fredoka', system-ui, sans-serif" };
const quicksand = { fontFamily: "'Quicksand', system-ui, sans-serif" };

export function GameCard({ game }) {
  const { id, name, slug, blurb, players, minutes, accent, Icon, isNew } = game;
  const stats = useGameStats();
  const plays = playsLabel(stats, id);

  return (
    <Link
      to={slug}
      className="group relative flex flex-col overflow-hidden rounded-[26px] border-2 border-[#FFE8C8] bg-white transition-all duration-200 hover:-translate-y-1 hover:border-[#E8D9B8] hover:shadow-[0_20px_36px_-20px_rgba(45,24,16,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#3D8B5A]"
    >
      {/* Colour band — the per-game signature, and the main thing that sets
          these apart from the outlined Daily cards. */}
      <span aria-hidden="true" className="block h-2.5 w-full" style={{ background: accent }} />

      {isNew && (
        <span
          style={{ ...quicksand, background: accent }}
          className="absolute right-3 top-5 rounded-full px-2.5 py-0.5 text-[13px] font-bold text-white shadow-sm"
        >
          NEW
        </span>
      )}

      <div className="flex flex-1 flex-col p-5">
        <span
          aria-hidden="true"
          style={{ background: `${accent}1F`, color: accent }}
          className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-200 group-hover:-rotate-6 group-hover:scale-110"
        >
          {Icon ? <Icon size={28} strokeWidth={2.2} /> : null}
        </span>

        <h3 style={fredoka} className="text-xl font-bold leading-tight text-[#2D1810]">
          {name}
        </h3>

        <p style={quicksand} className="mt-1.5 flex-1 text-base leading-snug text-[#6B5B4A]">
          {blurb}
        </p>

        <div style={quicksand} className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-semibold text-[#A89A78]">
          <span className="inline-flex items-center gap-1">
            <FiUser size={12} aria-hidden="true" />
            {players === '1' ? 'Solo' : `${players} players`}
          </span>
          {minutes !== '—' && (
            <span className="inline-flex items-center gap-1">
              <FiClock size={12} aria-hidden="true" />
              {minutes} min
            </span>
          )}
          {/* Social proof. Only rendered above a floor — see useGameStats. */}
          {plays && (
            <span className="inline-flex items-center gap-1" style={{ color: accent }}>
              <FiTrendingUp size={12} aria-hidden="true" />
              {plays}
            </span>
          )}
        </div>

        <span
          style={{ ...fredoka, color: accent }}
          className="mt-3 inline-flex items-center gap-1 text-base font-bold"
        >
          Play
          <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}

/*
  A titled row of cards.

  `eyebrow` + `accent` give the section its own identity so it reads as a
  distinct category rather than more of the same list. `tint` drops the whole
  row onto a soft coloured panel, which is what visually separates it from the
  neighbouring homepage sections.
*/
export function GameSection({
  title, tagline, games, moreHref, moreLabel, id, eyebrow, accent = '#3D8B5A', tint, limit,
}) {
  if (!games?.length) return null;

  /* `limit` keeps the homepage from growing a row per new game. The hub page
     shows the full list; here we show a handful and hand off. */
  const shown = limit ? games.slice(0, limit) : games;
  const hidden = games.length - shown.length;

  const inner = (
    <>
      <div className="mb-4">
        {eyebrow && (
          <p
            style={{ ...quicksand, color: accent }}
            className="mb-1 flex items-center gap-1.5 text-sm font-bold uppercase tracking-[0.18em]"
          >
            <span aria-hidden="true" className="inline-block h-2 w-2 rounded-full" style={{ background: accent }} />
            {eyebrow}
          </p>
        )}
        <h2 style={fredoka} className="text-2xl font-bold text-[#2D1810] md:text-3xl">{title}</h2>
        {tagline && <p style={quicksand} className="mt-1 text-base text-[#6B5B4A]">{tagline}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((g) => <GameCard key={g.id} game={g} />)}
      </div>

      {/* One clear way onward, placed AFTER the cards where someone who has
          finished scanning actually is. Replaces the old small top-right link,
          which was easy to miss and duplicated this. */}
      {moreHref && (
        <div className="mt-5 text-center">
          <Link
            to={moreHref}
            style={{ ...fredoka, borderColor: accent, color: accent }}
            className="inline-flex items-center gap-2 rounded-full border-[3px] bg-white px-6 py-3 text-base font-bold transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            {hidden > 0 ? `See all ${games.length} ${moreLabel || 'games'}` : (moreLabel || 'See all')}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </>
  );

  if (tint) {
    return (
      <section id={id} className="mb-12 rounded-[32px] p-5 md:p-7" style={{ background: tint }}>
        {inner}
      </section>
    );
  }
  return <section id={id} className="mb-12">{inner}</section>;
}

export default GameCard;
