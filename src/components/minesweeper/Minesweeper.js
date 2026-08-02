import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FiFlag, FiClock, FiRotateCcw } from 'react-icons/fi';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import { THEME, FREDOKA, QUICKSAND, NUMBER_COLOURS, rankFor } from './mineData';
import { useMinesweeper } from './useMinesweeper';

const CANONICAL = 'https://herdgamesonline.com/minesweeper';
const OG = 'https://herdgamesonline.com/og-image.png';
const LONG_PRESS_MS = 350;

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Minesweeper',
      alternateName: ['Minesweeper online', 'Mine sweeper game'],
      url: CANONICAL,
      description: 'Play Minesweeper free online. Clear the board without hitting a mine, with three board sizes built for phone screens. The first tap is always safe. No signup or download.',
      image: OG,
      genre: ['Puzzle', 'Logic', 'Single player'],
      gamePlatform: ['Web browser'],
      playMode: 'SinglePlayer',
      applicationCategory: 'GameApplication',
      operatingSystem: 'Any (Web)',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@type': 'Organization', name: 'Herd Game' },
    },
  ],
};

const FAQS = [
  { q: 'How do you play Minesweeper?', a: 'Tap a cell to uncover it. A number tells you how many mines touch that cell, counting diagonals. Use those numbers to work out where the mines are, flag them, and uncover everything else to win.' },
  { q: 'Can I lose on the first tap?', a: 'No. The mines are placed after your first tap, avoiding that cell and everything around it, so your opening move is always safe and always opens a pocket.' },
  { q: 'How do I place a flag on a phone?', a: 'Press and hold a cell, or switch on flag mode with the flag button and tap normally. On a desktop you can also right-click.' },
  { q: 'What do the numbers mean?', a: 'A 3 means exactly three of the eight surrounding cells contain a mine. A cell with no number touches no mines at all, which is why uncovering one opens up a whole area at once.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function Minesweeper() {
  const g = useMinesweeper();
  const pressRef = useRef(null);
  const longFired = useRef(false);
  const [, force] = useState(0);

  /*
    Three ways to flag a cell (long press, right click, flag mode) all racing
    for the same tap needs care, and getting it wrong is not cosmetic:

    A right click fires pointerdown -> pointerup -> contextmenu IN THAT ORDER,
    and the down/up pair is far quicker than LONG_PRESS_MS. So a naive handler
    runs endPress first and UNCOVERS the cell — potentially onto a mine, ending
    the game — and only then does contextmenu try to flag a cell that is now
    already revealed. Right click has to be filtered out of the pointer handlers
    entirely and left to contextmenu.

    On mobile the opposite race exists: once the long-press timer has flagged a
    cell, the browser may ALSO emit a native contextmenu for the same gesture.
    That must not toggle the flag straight back off, so contextmenu checks
    `longFired` without consuming it — pointerup is what consumes it.
  */
  const isPrimary = (e) => e.button === undefined || e.button === 0;

  const startPress = (i, e) => {
    if (!isPrimary(e)) return;              // right/middle click: contextmenu's job
    longFired.current = false;
    pressRef.current = setTimeout(() => {
      longFired.current = true;
      g.flag(i);
      force((n) => n + 1);
    }, LONG_PRESS_MS);
  };
  const endPress = (i, e) => {
    if (!isPrimary(e)) return;
    if (pressRef.current) { clearTimeout(pressRef.current); pressRef.current = null; }
    // A long press already flagged this cell — don't also uncover it.
    if (longFired.current) { longFired.current = false; return; }
    g.tap(i);
  };
  const onContext = (i, e) => {
    e.preventDefault();
    if (pressRef.current) { clearTimeout(pressRef.current); pressRef.current = null; }
    // Deliberately does NOT reset longFired: pointerup consumes it. Resetting
    // here would let the following pointerup fall through and reveal the cell.
    if (longFired.current) return;
    g.flag(i);
    force((n) => n + 1);
  };
  const cancelPress = () => {
    if (pressRef.current) { clearTimeout(pressRef.current); pressRef.current = null; }
    longFired.current = false;
  };

  const done = g.status === 'won' || g.status === 'lost';

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>Minesweeper — Play Free Online (No Download)</title>
        <meta name="description" content="Play Minesweeper free online in your browser. Three board sizes built for phone screens, and the first tap is always safe. No signup, no download." />
        <meta name="keywords" content="minesweeper, minesweeper online, play minesweeper free, puzzle game, logic game, free online games no download, single player games" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Minesweeper — Play Free Online" />
        <meta property="og:description" content="Clear the board without hitting a mine. Free, no signup." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <Navigation />

      <div className="mx-auto max-w-md px-4 pb-16 pt-24">
        <div className="text-center">
          <h1 style={FREDOKA} className="text-4xl font-bold leading-tight md:text-5xl">Minesweeper</h1>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {g.levels.map((lv) => (
            <button
              key={lv.id}
              onClick={() => g.changeLevel(lv)}
              style={{
                ...QUICKSAND,
                background: lv.id === g.level.id ? THEME.slate : THEME.bgAlt,
                color: lv.id === g.level.id ? '#FFFFFF' : THEME.mut,
                borderColor: THEME.slate,
              }}
              className="rounded-full border-2 px-4 py-1.5 text-sm font-bold"
            >
              {lv.name}
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between" style={QUICKSAND}>
          <span data-testid="ms-mines" className="text-sm font-bold" style={{ color: THEME.mut }}>
            <FiFlag aria-hidden="true" className="mr-1 inline" />{g.minesLeft}
          </span>
          <button
            onClick={() => g.setFlagMode((f) => !f)}
            data-testid="ms-flagmode"
            aria-pressed={g.flagMode}
            style={{
              ...QUICKSAND,
              background: g.flagMode ? THEME.slate : THEME.bgAlt,
              color: g.flagMode ? '#FFFFFF' : THEME.mut,
              borderColor: THEME.slate,
            }}
            className="rounded-full border-2 px-4 py-1.5 text-sm font-bold"
          >
            <FiFlag aria-hidden="true" className="mr-1 inline" />
            {g.flagMode ? 'Flag mode on' : 'Flag mode'}
          </button>
          <span className="text-sm font-bold" style={{ color: THEME.mut }} role="timer" aria-live="off">
            <FiClock aria-hidden="true" className="mr-1 inline" />{g.seconds}s
          </span>
        </div>

        <div
          data-testid="ms-board"
          className="mt-3 grid gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${g.level.cols}, minmax(0, 1fr))`, touchAction: 'manipulation' }}
        >
          {Array.from({ length: g.level.cols * g.level.rows }).map((_, i) => {
            const isRevealed = g.revealed.has(i);
            const isFlagged = g.flagged.has(i);
            const n = g.counts[i];
            const isMine = g.mines.has(i);
            const showMine = done && isMine;
            return (
              <button
                key={i}
                data-testid="ms-cell"
                data-cell={i}
                data-state={isRevealed ? (isMine ? 'mine' : `n${n}`) : isFlagged ? 'flag' : 'covered'}
                onPointerDown={(e) => startPress(i, e)}
                onPointerUp={(e) => endPress(i, e)}
                onPointerLeave={cancelPress}
                onContextMenu={(e) => onContext(i, e)}
                disabled={done}
                aria-label={isRevealed ? (isMine ? 'Mine' : `${n} adjacent mines`) : isFlagged ? 'Flagged' : 'Covered cell'}
                style={{
                  ...FREDOKA,
                  background: g.hitMine === i ? THEME.red
                    : isRevealed ? THEME.bgAlt
                    : showMine ? THEME.border
                    : THEME.covered,
                  color: NUMBER_COLOURS[n] || THEME.mut,
                  borderColor: THEME.border,
                  userSelect: 'none',
                  WebkitTapHighlightColor: 'transparent',
                }}
                className="aspect-square rounded border text-xs font-bold leading-none md:text-sm"
              >
                {isFlagged && !isRevealed ? (
                  <FiFlag aria-hidden="true" className="mx-auto" style={{ color: THEME.red }} />
                ) : showMine || (isRevealed && isMine) ? (
                  <span style={{ color: THEME.ink }}>●</span>
                ) : isRevealed && n > 0 ? n : ''}
              </button>
            );
          })}
        </div>

        {done && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 text-center">
            <p style={{ ...FREDOKA, color: g.status === 'won' ? THEME.green : THEME.red }} className="text-3xl font-bold">
              {g.status === 'won' ? 'Board cleared!' : 'Boom.'}
            </p>
            {g.status === 'won' && (() => { const r = rankFor(g.seconds, g.level.id); return (
              <>
                <p style={QUICKSAND} className="mt-1 text-lg">{g.seconds} seconds on {g.level.name}</p>
                <p style={FREDOKA} className="mt-3 text-xl font-bold">{r.label}</p>
                <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-1">{r.blurb}</p>
                {g.isNewBest && <p style={{ ...FREDOKA, color: THEME.green }} className="mt-2 font-bold">New best time!</p>}
              </>
            ); })()}
            {g.status === 'lost' && (
              <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-1">
                The mines are all shown above.
              </p>
            )}
            <button
              onClick={g.playAgain}
              style={{ ...FREDOKA, background: THEME.slate }}
              className="mx-auto mt-5 flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-lg font-bold text-white active:scale-[0.98]"
            >
              <FiRotateCcw aria-hidden="true" /> Play again
            </button>
          </motion.div>
        )}

        {!done && (
          <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-4 text-center text-sm">
            Press and hold to flag a mine{g.best > 0 && <> · best {g.best}s on {g.level.name}</>}
          </p>
        )}

        <div className="mt-12"><AdSlot /></div>

        <section className="mt-12" style={QUICKSAND}>
          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">How to play Minesweeper</h2>
          <p style={{ color: THEME.mut }} className="mb-4">
            Tap a cell to uncover it. The number you find tells you how many of the eight surrounding cells
            contain a mine, diagonals included. A cell with no number touches no mines at all, so uncovering
            one opens up its whole neighbourhood in a single move. Use the numbers to deduce where the mines
            are, flag them by pressing and holding, and uncover everything else to clear the board.
          </p>
          <p style={{ color: THEME.mut }} className="mb-6">
            Your first tap is always safe — the mines are laid after it, avoiding that cell and everything
            around it. Nobody should lose on move one to a coin flip. The three board sizes are sized for a
            phone rather than following the desktop tradition, because the classic expert board needs
            pinch-zooming to play on a handset and that is not a difficulty setting.
          </p>

          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">Questions</h2>
          <div className="space-y-4">
            {FAQS.map(({ q, a }) => (
              <div key={q}>
                <h3 style={FREDOKA} className="text-lg font-bold">{q}</h3>
                <p style={{ color: THEME.mut }} className="mt-1">{a}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm" style={{ color: THEME.mut }}>
            More to play: <Link to="/put-in-order" className="font-bold underline" style={{ color: THEME.slate }}>Put in Order</Link>,{' '}
            <Link to="/hangman" className="font-bold underline" style={{ color: THEME.slate }}>Hangman</Link>, or{' '}
            <Link to="/solo-games" className="font-bold underline" style={{ color: THEME.slate }}>all solo games</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
