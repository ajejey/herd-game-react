import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FiShare2, FiCheck, FiDownload, FiRotateCcw, FiHeart } from 'react-icons/fi';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import { THEME, FREDOKA, QUICKSAND, rankFor } from './visualData';
import { useVisualMemory } from './useVisualMemory';
import { buildShareText, buildVisualCard } from './share';
import { shareCardOrText, downloadFile } from '../../lib/shareCard';

const CANONICAL = 'https://herdgamesonline.com/visual-memory-test';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Visual Memory Test',
      alternateName: ['Visual memory game', 'Spatial memory test', 'Grid memory test'],
      url: CANONICAL,
      description: 'A free visual memory test. Squares flash on a grid, then vanish — tap the ones that lit up. One more square every level. No signup or download.',
      image: OG,
      genre: ['Memory', 'Test', 'Single player'],
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
  { q: 'What is the visual memory test?', a: 'A pattern of squares lights up on a grid for about a second, then disappears. You tap the squares that lit up, in any order you like. Clear the level and the next one adds another square.' },
  { q: 'What is a good score?', a: 'Most people stop somewhere between levels 4 and 8. Reaching level 9 is sharp, and past 12 is genuinely rare.' },
  { q: 'How is this different from the chimp test?', a: 'Order. The chimp test makes you tap numbers in sequence, so it tests memory for order as well as position. Here only the positions matter, which is a surprisingly different skill.' },
  { q: 'Any tips?', a: 'Look at the shape the squares make rather than the individual squares. Most people who do well describe remembering a single outline rather than a list of positions.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function VisualMemory() {
  const g = useVisualMemory();
  const [copied, setCopied] = useState(false);

  const doShare = async () => {
    const file = await buildVisualCard(g.reached, g.isNewBest);
    const res = await shareCardOrText(file, buildShareText(g.reached, g.isNewBest), 'Visual Memory Test');
    if (res === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const active = ['show', 'recall', 'cleared', 'failed'].includes(g.status);
  // During the flash, and after a mistake, the pattern is shown. While
  // recalling, only the squares already found are lit.
  const revealing = g.status === 'show' || g.status === 'failed' || g.status === 'cleared';

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>Visual Memory Test — Free Grid Memory Game (No Download)</title>
        <meta name="description" content="Free visual memory test. Squares flash on a grid then vanish — tap the ones that lit up. One more square every level. Most people stop around level 6." />
        <meta name="keywords" content="visual memory test, spatial memory test, grid memory game, memory test online, brain game, free online games no download, single player games" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Visual Memory Test — Free Grid Memory Game" />
        <meta property="og:description" content="Most people stop around level 6. How far do you get?" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <Navigation />

      <div className="mx-auto max-w-md px-4 pb-16 pt-24">
        {g.status === 'idle' && (
          <div className="text-center">
            <h1 style={FREDOKA} className="text-4xl font-bold leading-tight md:text-5xl">Visual Memory Test</h1>
            <p style={QUICKSAND} className="mx-auto mt-4 max-w-md text-base md:text-lg">
              Squares light up, then vanish. Tap the ones that lit up — in any order.
              One more square every level.
            </p>
            <button
              onClick={g.start}
              style={{ ...FREDOKA, background: THEME.violet }}
              className="mt-8 rounded-2xl px-10 py-4 text-xl font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Take the test
            </button>
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-4 text-sm">
              Most people stop around level 6
              {g.best > 0 && <> · your best: <strong style={{ color: THEME.violet }}>{g.best}</strong></>}
            </p>
          </div>
        )}

        {active && (
          <div>
            <div className="mb-4 flex items-center justify-between" style={QUICKSAND}>
              <span className="text-sm font-bold" style={{ color: THEME.mut }}>
                Level {g.level}{g.best > 0 && <> · best {g.best}</>}
              </span>
              <span className="flex items-center gap-1" aria-label={`${g.lives} lives left`}>
                {Array.from({ length: g.maxLives }).map((_, i) => (
                  <FiHeart
                    key={i}
                    size={16}
                    aria-hidden="true"
                    style={{ color: i < g.lives ? THEME.red : THEME.border, fill: i < g.lives ? THEME.red : 'transparent' }}
                  />
                ))}
              </span>
            </div>

            <p
              role="status"
              aria-live="polite"
              style={{ ...FREDOKA, color: g.status === 'failed' ? THEME.red : g.status === 'cleared' ? THEME.green : THEME.ink }}
              className="mb-3 text-center text-lg font-bold"
            >
              {g.status === 'show' && `Memorise ${g.squares} squares`}
              {g.status === 'recall' && `Tap them — ${g.pattern.length - g.found.length} to go`}
              {g.status === 'cleared' && 'Cleared!'}
              {g.status === 'failed' && 'Not that one'}
            </p>

            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${g.grid}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: g.grid * g.grid }).map((_, cell) => {
                const inPattern = g.pattern.includes(cell);
                const isFound = g.found.includes(cell);
                const isMissed = g.missed.includes(cell);
                const lit = isFound || (revealing && inPattern);
                return (
                  <button
                    key={cell}
                    data-testid="vm-tile"
                    data-cell={cell}
                    data-lit={lit ? '1' : '0'}
                    data-in-pattern={inPattern ? '1' : '0'}
                    onClick={() => g.tap(cell)}
                    disabled={g.status !== 'recall'}
                    aria-label={lit ? 'Lit square' : 'Square'}
                    style={{
                      background: isMissed ? THEME.red : lit ? THEME.violet : THEME.bgAlt,
                      borderColor: THEME.border,
                    }}
                    className="aspect-square rounded-xl border-[3px] transition-colors duration-150 active:scale-95 disabled:cursor-default"
                  />
                );
              })}
            </div>
          </div>
        )}

        {g.status === 'over' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-sm uppercase tracking-widest">You reached</p>
            <p style={{ ...FREDOKA, color: THEME.violet }} className="my-1 text-7xl font-bold md:text-8xl">{g.reached}</p>
            <p style={QUICKSAND} className="text-lg">levels</p>

            {(() => { const r = rankFor(g.reached); return (
              <>
                <p style={FREDOKA} className="mt-4 text-2xl font-bold">{r.label}</p>
                <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-1">{r.blurb}</p>
              </>
            ); })()}

            {g.isNewBest && (
              <p style={{ ...FREDOKA, color: THEME.green }} className="mt-3 text-lg font-bold">New personal best!</p>
            )}

            <div className="mx-auto mt-8 grid max-w-sm gap-3">
              <button
                onClick={g.playAgain}
                style={{ ...FREDOKA, background: THEME.violet }}
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
              >
                <FiRotateCcw aria-hidden="true" /> Try again
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={doShare}
                  style={{ ...QUICKSAND, borderColor: THEME.violet, color: THEME.violet }}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 font-bold"
                >
                  {copied ? <><FiCheck aria-hidden="true" /> Copied</> : <><FiShare2 aria-hidden="true" /> Share</>}
                </button>
                <button
                  onClick={async () => downloadFile(await buildVisualCard(g.reached, g.isNewBest))}
                  style={{ ...QUICKSAND, borderColor: THEME.border, color: THEME.mut }}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 font-bold"
                >
                  <FiDownload aria-hidden="true" /> Image
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="mt-12"><AdSlot /></div>

        <section className="mt-12" style={QUICKSAND}>
          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">How the visual memory test works</h2>
          <p style={{ color: THEME.mut }} className="mb-4">
            A pattern of squares lights up on the grid for about a second, then disappears. Tap the squares
            that were lit — the order does not matter. Clear the level and the next one adds another square,
            with the grid itself growing every few levels.
          </p>
          <p style={{ color: THEME.mut }} className="mb-6">
            You get three lives, and a failed level can be retried. Most people stop somewhere between levels
            four and eight. The reliable trick is to stop counting squares and start seeing the shape they
            make: one outline is a single thing to remember, where six positions are six.
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
            More to play: <Link to="/chimp-test" className="font-bold underline" style={{ color: THEME.violet }}>Chimp Test</Link>,{' '}
            <Link to="/number-memory-test" className="font-bold underline" style={{ color: THEME.violet }}>Number Memory Test</Link>, or{' '}
            <Link to="/solo-games" className="font-bold underline" style={{ color: THEME.violet }}>all solo games</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
