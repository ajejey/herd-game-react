import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShare2, FiCheck, FiDownload, FiRotateCcw, FiHeart, FiRefreshCw } from 'react-icons/fi';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import { THEME, FREDOKA, QUICKSAND, rankFor } from './scrambleData';
import { useScramble } from './useScramble';
import { buildShareText, buildScrambleCard } from './share';
import { shareCardOrText, downloadFile } from '../../lib/shareCard';

const CANONICAL = 'https://herdgamesonline.com/word-scramble';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Word Scramble',
      alternateName: ['Word scramble game', 'Anagram game', 'Unscramble the word'],
      url: CANONICAL,
      description: 'A free word scramble game. Rearrange the jumbled letters into the right word, with words getting longer as your streak grows. Three lives, endless, no signup or download.',
      image: OG,
      genre: ['Word', 'Puzzle', 'Single player'],
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
  { q: 'How do you play word scramble?', a: 'You get a word with its letters jumbled up. Tap the letters in the right order to spell the word, then submit. Tap a letter in your answer to send it back if you change your mind.' },
  { q: 'Do I have to type?', a: 'No. You tap the letter tiles, so the phone keyboard never covers the puzzle and autocorrect cannot interfere. It also means you can only ever use the letters you were given.' },
  { q: 'Does it get harder?', a: 'Yes. You start with four-letter words and they grow to five, six and then seven letters as your streak climbs.' },
  { q: 'Is it free?', a: 'Yes, completely free. No signup, no download and no app. Your best score is saved on your device.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function Scramble() {
  const g = useScramble();
  const [copied, setCopied] = useState(false);

  const doShare = async () => {
    const file = await buildScrambleCard(g.score, g.isNewBest);
    const res = await shareCardOrText(file, buildShareText(g.score, g.isNewBest), 'Word Scramble');
    if (res === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const playing = g.status === 'playing' || g.status === 'reveal';
  const answerColour = g.status === 'reveal' ? (g.wasCorrect ? THEME.green : THEME.red) : THEME.ink;

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>Word Scramble — Free Online Anagram Game (No Download)</title>
        <meta name="description" content="Play word scramble free online. Rearrange the jumbled letters into the right word, with longer words as your streak grows. Tap to play, no typing, no signup, no download." />
        <meta name="keywords" content="word scramble, anagram game, unscramble words, word games online free, free online games no download, single player games, games to play alone" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Word Scramble — Free Online Anagram Game" />
        <meta property="og:description" content="Untangle the letters. How long can you keep the streak?" />
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
            <h1 style={FREDOKA} className="text-4xl font-bold leading-tight md:text-6xl">Word Scramble</h1>
            <p style={QUICKSAND} className="mx-auto mt-4 max-w-md text-base md:text-lg">
              The letters are jumbled. Tap them in the right order to spell the word.
              They get longer the further you get.
            </p>
            <button
              onClick={g.start}
              style={{ ...FREDOKA, background: THEME.rust }}
              className="mt-8 rounded-2xl px-10 py-4 text-xl font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Start playing
            </button>
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-4 text-base">
              No typing · endless
              {g.best > 0 && <> · your best: <strong style={{ color: THEME.rust }}>{g.best}</strong></>}
            </p>
          </div>
        )}

        {playing && g.round && (
          <div>
            <div className="mb-5 flex items-center justify-between" style={QUICKSAND}>
              <span className="text-base font-bold" style={{ color: THEME.mut }}>
                Streak <strong style={{ color: THEME.rust }}>{g.score}</strong>
                {g.best > 0 && <> · best {g.best}</>}
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

            {/* Your answer so far — tap a letter to send it back. */}
            <div
              className="flex min-h-[5rem] flex-wrap items-center justify-center gap-2 rounded-3xl border-2 p-4"
              style={{ background: THEME.bgAlt, borderColor: THEME.border }}
            >
              {/* Sits inside the empty answer box, which is exactly where the eye
                  already is, so it does not need the hint chip — it needs the
                  contrast. Muted grey here read as placeholder decoration. */}
              {g.picked.length === 0 && (
                <span style={{ ...QUICKSAND, color: THEME.ink }} className="text-base font-bold">
                  Tap the letters below to spell the word
                </span>
              )}
              {g.picked.map((tileIdx, slot) => (
                <button
                  key={`${tileIdx}-${slot}`}
                  data-testid="answer-letter"
                  onClick={() => g.unpick(slot)}
                  disabled={g.status !== 'playing'}
                  style={{ ...FREDOKA, color: answerColour, borderColor: THEME.border, background: THEME.bg }}
                  className="h-12 w-10 rounded-xl border-2 text-2xl font-bold disabled:cursor-default"
                >
                  {g.tiles[tileIdx].ch}
                </button>
              ))}
            </div>

            {/* The scrambled pool. */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {g.tiles.map((t, i) => {
                const used = g.picked.includes(i);
                return (
                  <button
                    key={i}
                    data-testid="scramble-tile"
                    onClick={() => g.pickTile(i)}
                    disabled={used || g.status !== 'playing'}
                    style={{
                      ...FREDOKA,
                      background: used ? THEME.border : THEME.rust,
                      color: used ? THEME.border : '#FFFFFF',
                      borderColor: THEME.border,
                    }}
                    className="h-14 w-12 rounded-2xl border-2 text-2xl font-bold transition-all active:scale-95 disabled:cursor-default"
                  >
                    {used ? '' : t.ch}
                  </button>
                );
              })}
            </div>

            {g.status === 'playing' && (
              <div className="mt-5 grid grid-cols-3 gap-2">
                <button
                  onClick={g.clear}
                  style={{ ...QUICKSAND, borderColor: THEME.border, color: THEME.mut }}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 font-bold"
                >
                  <FiRefreshCw size={14} aria-hidden="true" /> Clear
                </button>
                <button
                  onClick={g.submit}
                  disabled={!g.complete}
                  style={{
                    ...FREDOKA,
                    background: g.complete ? THEME.rust : THEME.border,
                    color: g.complete ? '#FFFFFF' : THEME.mut,
                  }}
                  className="col-span-2 rounded-2xl py-3 text-lg font-bold active:scale-[0.98] disabled:cursor-default"
                >
                  Check it
                </button>
              </div>
            )}

            <AnimatePresence>
              {g.status === 'reveal' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-5 text-center"
                  role="status"
                  aria-live="polite"
                >
                  <p style={{ ...FREDOKA, color: g.wasCorrect ? THEME.green : THEME.red }} className="text-2xl font-bold">
                    {g.wasCorrect ? 'Got it!' : `It was ${g.round.word}`}
                  </p>
                  <button
                    onClick={g.next}
                    style={{ ...FREDOKA, background: THEME.rust }}
                    className="mt-4 w-full rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
                  >
                    {g.lives <= 0 ? 'See your score' : 'Next word'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {g.status === 'over' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-base uppercase tracking-widest">You unscrambled</p>
            <p style={{ ...FREDOKA, color: THEME.rust }} className="my-1 text-7xl font-bold md:text-8xl">{g.score}</p>
            <p style={QUICKSAND} className="text-lg">{g.score === 1 ? 'word' : 'words'}</p>

            {(() => { const r = rankFor(g.score); return (
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
                style={{ ...FREDOKA, background: THEME.rust }}
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
              >
                <FiRotateCcw aria-hidden="true" /> Play again
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={doShare}
                  style={{ ...QUICKSAND, borderColor: THEME.rust, color: THEME.rust }}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 font-bold"
                >
                  {copied ? <><FiCheck aria-hidden="true" /> Copied</> : <><FiShare2 aria-hidden="true" /> Share</>}
                </button>
                <button
                  onClick={async () => downloadFile(await buildScrambleCard(g.score, g.isNewBest))}
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
          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">How to play Word Scramble</h2>
          <p style={{ color: THEME.mut }} className="mb-4">
            Each round gives you a word with its letters jumbled. Tap the tiles in the order that spells the
            word, then check it. If you put a letter in the wrong place, tap it in your answer to send it back
            to the pool. There is no typing, so nothing covers the puzzle and autocorrect cannot interfere.
          </p>
          <p style={{ color: THEME.mut }} className="mb-6">
            You start on four-letter words and they grow to five, six and seven letters as your streak climbs.
            Three lives, and every word is a common everyday one — an obscure word is not a harder puzzle,
            just an unfair one.
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

          <p className="mt-8 text-base" style={{ color: THEME.mut }}>
            More to play: <Link to="/odd-one-out" className="font-bold underline" style={{ color: THEME.rust }}>Odd One Out</Link>,{' '}
            <Link to="/math-game" className="font-bold underline" style={{ color: THEME.rust }}>Maths Sprint</Link>, or{' '}
            <Link to="/solo-games" className="font-bold underline" style={{ color: THEME.rust }}>all solo games</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
