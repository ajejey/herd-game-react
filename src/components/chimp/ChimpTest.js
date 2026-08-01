import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FiShare2, FiCheck, FiDownload, FiRotateCcw, FiHeart } from 'react-icons/fi';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import { THEME, FREDOKA, QUICKSAND, GRID, rankFor } from './chimpData';
import { useChimpTest } from './useChimpTest';
import { buildShareText, buildChimpCard } from './share';
import { shareCardOrText, downloadFile } from '../../lib/shareCard';

const CANONICAL = 'https://herdgamesonline.com/chimp-test';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Chimp Test',
      alternateName: ['Chimp memory test', 'Working memory test', 'Number memory game'],
      url: CANONICAL,
      description: 'A free chimp test. Numbers appear on a grid, then vanish the moment you tap the first one — tap the rest in order from memory. One more number each level. No signup or download.',
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
  { q: 'What is the chimp test?', a: 'Numbers appear scattered on a grid. The moment you tap number one, the rest are hidden, and you have to tap them in order from memory. Each level adds one more number.' },
  { q: 'Why is it called that?', a: 'It comes from working-memory experiments at Kyoto University, where young chimpanzees did better at this exact task than human adults. Most people stop somewhere around seven to nine.' },
  { q: 'What is a good score?', a: 'Getting to 9 is sharp, 11 is remarkable and 14 or more is genuinely exceptional. If you are stuck around 7, that is where most adults land.' },
  { q: 'Any tips?', a: 'Most people do better by remembering the shape the numbers make rather than reading them one at a time. You get three lives, and a failed level can be retried.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function ChimpTest() {
  const g = useChimpTest();
  const [copied, setCopied] = useState(false);

  const doShare = async () => {
    const file = await buildChimpCard(g.reached, g.isNewBest);
    const res = await shareCardOrText(file, buildShareText(g.reached, g.isNewBest), 'Chimp Test');
    if (res === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const active = ['memorise', 'recall', 'cleared', 'failed'].includes(g.status);
  const byCell = new Map(g.tiles.map((t) => [t.cell, t]));

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>Chimp Test — Free Working Memory Test (No Download)</title>
        <meta name="description" content="Take the free chimp test. Numbers appear then vanish the moment you tap the first — tap the rest in order from memory. One more each level. Most adults stop around seven." />
        <meta name="keywords" content="chimp test, working memory test, number memory game, memory test online, brain game, free online games no download, single player games" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Chimp Test — Free Working Memory Test" />
        <meta property="og:description" content="Chimps beat humans at this. How far do you get?" />
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
            <h1 style={FREDOKA} className="text-4xl font-bold leading-tight md:text-6xl">Chimp Test</h1>
            <p style={QUICKSAND} className="mx-auto mt-4 max-w-md text-base md:text-lg">
              Numbers appear on the grid. The moment you tap number one, the rest vanish —
              tap them in order from memory. One more number every level.
            </p>
            <button
              onClick={g.start}
              style={{ ...FREDOKA, background: THEME.indigo }}
              className="mt-8 rounded-2xl px-10 py-4 text-xl font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Take the test
            </button>
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-4 text-sm">
              Most adults stop around 7
              {g.best > 0 && <> · your best: <strong style={{ color: THEME.indigo }}>{g.best}</strong></>}
            </p>
          </div>
        )}

        {active && (
          <div>
            <div className="mb-4 flex items-center justify-between" style={QUICKSAND}>
              <span className="text-sm font-bold" style={{ color: THEME.mut }}>
                {g.count} numbers{g.best > 0 && <> · best {g.best}</>}
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
              {g.status === 'memorise' && 'Memorise, then tap 1'}
              {g.status === 'recall' && `Tap ${g.nextNum}`}
              {g.status === 'cleared' && 'Cleared!'}
              {g.status === 'failed' && 'Wrong one — try again'}
            </p>

            <div
              className="grid gap-2"
              style={{ gridTemplateColumns: `repeat(${GRID}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: GRID * GRID }).map((_, cell) => {
                const tile = byCell.get(cell);
                if (!tile) return <div key={cell} className="aspect-square" />;
                const done = tile.num < g.nextNum;
                // Numbers are visible while memorising; after the first tap only
                // the blanks remain. That hiding IS the test.
                const showNumber = g.status === 'memorise' || g.status === 'failed';
                return (
                  <button
                    key={cell}
                    data-testid="chimp-tile"
                    data-num={tile.num}
                    onClick={() => g.tap(tile.num)}
                    disabled={done || g.status === 'cleared' || g.status === 'failed'}
                    aria-label={showNumber ? `Number ${tile.num}` : 'Hidden number'}
                    style={{
                      background: done ? THEME.border : THEME.indigo,
                      color: '#FFFFFF',
                      opacity: done ? 0.35 : 1,
                      ...FREDOKA,
                    }}
                    className="aspect-square rounded-xl text-xl font-bold transition-all active:scale-95 disabled:cursor-default md:text-2xl"
                  >
                    {showNumber ? tile.num : ''}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {g.status === 'over' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-sm uppercase tracking-widest">You reached</p>
            <p style={{ ...FREDOKA, color: THEME.indigo }} className="my-1 text-7xl font-bold md:text-8xl">{g.reached}</p>
            <p style={QUICKSAND} className="text-lg">numbers</p>

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
                style={{ ...FREDOKA, background: THEME.indigo }}
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
              >
                <FiRotateCcw aria-hidden="true" /> Try again
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={doShare}
                  style={{ ...QUICKSAND, borderColor: THEME.indigo, color: THEME.indigo }}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 font-bold"
                >
                  {copied ? <><FiCheck aria-hidden="true" /> Copied</> : <><FiShare2 aria-hidden="true" /> Share</>}
                </button>
                <button
                  onClick={async () => downloadFile(await buildChimpCard(g.reached, g.isNewBest))}
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
          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">How the chimp test works</h2>
          <p style={{ color: THEME.mut }} className="mb-4">
            A set of numbers appears scattered across the grid. Take as long as you like to look at them — the
            clock is not running. The moment you tap number one, every other number is hidden, and you have to
            tap the rest in order from memory. Clear a level and the next one adds another number.
          </p>
          <p style={{ color: THEME.mut }} className="mb-6">
            It is named after working-memory experiments at Kyoto University, where young chimpanzees
            outperformed human adults at this exact task. Most people stop somewhere between seven and nine.
            Most who do well say they remember the <em>shape</em> the numbers make rather than reading them
            one by one.
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
            More to play: <Link to="/memory-game" className="font-bold underline" style={{ color: THEME.indigo }}>Herd Memory</Link>,{' '}
            <Link to="/reaction-time-test" className="font-bold underline" style={{ color: THEME.indigo }}>Reaction Time Test</Link>, or{' '}
            <Link to="/solo-games" className="font-bold underline" style={{ color: THEME.indigo }}>all solo games</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
