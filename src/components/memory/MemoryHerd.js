import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FiShare2, FiCheck, FiDownload, FiRotateCcw, FiVolume2, FiVolumeX } from 'react-icons/fi';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import { isMuted, setMuted } from '../daily/sfx';
import { THEME, FREDOKA, QUICKSAND, rankFor } from './memoryData';
import { useMemoryHerd } from './useMemoryHerd';
import { buildShareText, buildMemoryCard } from './share';
import { shareCardOrText, downloadFile } from '../../lib/shareCard';

const CANONICAL = 'https://herdgamesonline.com/memory-game';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Herd Memory',
      alternateName: ['Memory game', 'Simon game online', 'Sequence memory game', 'Free memory game'],
      url: CANONICAL,
      description: 'A free online memory game. Watch the sequence of colours light up, then repeat it back. Every round adds one more. Single player, endless, no signup or download.',
      image: OG,
      genre: ['Memory', 'Puzzle', 'Single player'],
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
  { q: 'How do you play the memory game?', a: 'Watch the tiles light up in order, then tap them back in the same order. Each round adds one more tile to the sequence, so round 5 is five tiles long. One wrong tap ends the run.' },
  { q: 'Is it free?', a: 'Yes, completely free. No signup, no download and no app. It runs in your browser on a phone or a laptop, and your best score is saved on your device.' },
  { q: 'What is a good score?', a: 'Most people land somewhere between 5 and 7 rounds. Getting past 10 is genuinely difficult, and 15 or more is unusual.' },
  { q: 'Does it have sound?', a: 'Yes. Each tile has its own note, which makes a sequence much easier to remember. You can mute it with the speaker button, and the setting is shared with the other games on the site.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function MemoryHerd() {
  const g = useMemoryHerd();
  const [copied, setCopied] = useState(false);
  const [muted, setMutedState] = useState(isMuted);

  const toggleMute = () => { const v = !muted; setMuted(v); setMutedState(v); };

  const doShare = async () => {
    const file = await buildMemoryCard(g.score, g.isNewBest);
    const res = await shareCardOrText(file, buildShareText(g.score, g.isNewBest), 'Herd Memory');
    if (res === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const playing = g.status === 'showing' || g.status === 'input';

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>Memory Game — Free Online Sequence Memory Game (No Download)</title>
        <meta name="description" content="Play a free online memory game. Watch the colours light up, then repeat the sequence back. Each round adds one more. Endless, single player, no signup or download." />
        <meta name="keywords" content="memory game, free memory game online, simon game, sequence memory game, brain game, single player games, games to play alone, free online games no download" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Memory Game — Free Online Sequence Memory Game" />
        <meta property="og:description" content="Watch, remember, repeat. How many rounds can you survive?" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <Navigation />

      <div className="mx-auto max-w-lg px-4 pb-16 pt-24">
        {/* ---------------- IDLE ---------------- */}
        {g.status === 'idle' && (
          <div className="text-center">
            <h1 style={FREDOKA} className="text-4xl font-bold leading-tight md:text-6xl">Herd Memory</h1>
            <p style={QUICKSAND} className="mx-auto mt-4 max-w-md text-base md:text-lg">
              Watch the pasture light up, then tap it back in the same order.
              Every round adds one more. One wrong tap and the run is over.
            </p>
            <button
              onClick={g.start}
              style={{ ...FREDOKA, background: THEME.green }}
              className="mt-8 rounded-2xl px-10 py-4 text-xl font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Start remembering
            </button>
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-4 text-sm">
              Endless · no signup
              {g.best > 0 && <> · your best: <strong style={{ color: THEME.green }}>{g.best} rounds</strong></>}
            </p>
          </div>
        )}

        {/* ---------------- PLAYING ---------------- */}
        {playing && (
          <div>
            <div className="mb-4 flex items-center justify-between" style={QUICKSAND}>
              <span className="text-sm font-bold" style={{ color: THEME.mut }}>
                Round {g.round}{g.best > 0 && <> · best {g.best}</>}
              </span>
              <button
                onClick={toggleMute}
                aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
                style={{ color: THEME.mut }}
                className="p-1"
              >
                {muted ? <FiVolumeX aria-hidden="true" /> : <FiVolume2 aria-hidden="true" />}
              </button>
            </div>

            {/* Status line is a live region so the state is announced, not just
                implied by colour — the tiles alone are not accessible. */}
            <p
              role="status"
              aria-live="polite"
              style={{ ...FREDOKA, color: g.status === 'showing' ? THEME.mut : THEME.green }}
              className="mb-4 text-center text-xl font-bold"
            >
              {g.status === 'showing' ? 'Watch…' : `Your turn — ${g.inputIndex}/${g.sequence.length}`}
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {g.tiles.map((t) => {
                const isLit = g.lit === t.id;
                return (
                  <button
                    key={t.id}
                    data-testid="memory-tile"
                    data-tile={t.id}
                    onClick={() => g.tap(t.id)}
                    disabled={g.status !== 'input'}
                    aria-label={t.name}
                    style={{
                      background: isLit ? t.lit : t.color,
                      boxShadow: isLit ? `0 0 0 6px ${t.lit}55` : 'none',
                      transform: isLit ? 'scale(1.04)' : 'scale(1)',
                    }}
                    className="aspect-square rounded-3xl transition-all duration-150 disabled:cursor-default active:scale-95"
                  />
                );
              })}
            </div>

            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-4 text-center text-sm">
              {g.status === 'showing'
                ? 'Memorise the order'
                : 'Tap the tiles in the order they lit up'}
            </p>
          </div>
        )}

        {/* ---------------- OVER ---------------- */}
        {g.status === 'over' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-sm uppercase tracking-widest">
              You survived
            </p>
            <p style={{ ...FREDOKA, color: THEME.green }} className="my-1 text-7xl font-bold md:text-8xl">
              {g.score}
            </p>
            <p style={QUICKSAND} className="text-lg">{g.score === 1 ? 'round' : 'rounds'}</p>

            {(() => { const r = rankFor(g.score); return (
              <>
                <p style={FREDOKA} className="mt-4 text-2xl font-bold">{r.label}</p>
                <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-1">{r.blurb}</p>
              </>
            ); })()}

            {g.isNewBest && (
              <p style={{ ...FREDOKA, color: THEME.pink }} className="mt-3 text-lg font-bold">New personal best!</p>
            )}
            {!g.isNewBest && g.best > g.score && (
              <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-2">Your best is {g.best} — go again?</p>
            )}

            <div className="mx-auto mt-8 grid max-w-sm gap-3">
              <button
                onClick={g.playAgain}
                style={{ ...FREDOKA, background: THEME.green }}
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
              >
                <FiRotateCcw aria-hidden="true" /> Play again
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={doShare}
                  style={{ ...QUICKSAND, borderColor: THEME.green, color: THEME.green }}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 font-bold"
                >
                  {copied ? <><FiCheck aria-hidden="true" /> Copied</> : <><FiShare2 aria-hidden="true" /> Share</>}
                </button>
                <button
                  onClick={async () => downloadFile(await buildMemoryCard(g.score, g.isNewBest))}
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
          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">How to play the memory game</h2>
          <p style={{ color: THEME.mut }} className="mb-4">
            Six pasture tiles light up one at a time. Watch the order, then tap them back exactly as they
            appeared. Each round adds one more tile, so round five is a five-tile sequence and round ten is
            ten. A single wrong tap ends the run, and your score is the number of rounds you got through.
          </p>
          <p style={{ color: THEME.mut }} className="mb-6">
            Every tile has its own musical note, which makes long sequences much easier to hold on to — most
            people find they remember the tune before they remember the colours. There is no daily limit, so
            you can go again straight away, and your best score is saved on your device.
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
            More to play: <Link to="/guess-the-year" className="font-bold underline" style={{ color: THEME.green }}>Guess the Year</Link>,{' '}
            <Link to="/higher-or-lower" className="font-bold underline" style={{ color: THEME.green }}>Higher or Lower</Link>, or{' '}
            <Link to="/solo-games" className="font-bold underline" style={{ color: THEME.green }}>all solo games</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
