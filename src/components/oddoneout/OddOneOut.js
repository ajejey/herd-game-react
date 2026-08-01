import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShare2, FiCheck, FiDownload, FiRotateCcw, FiHeart } from 'react-icons/fi';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import { THEME, FREDOKA, QUICKSAND, rankFor, GROUPS } from './oddData';
import { useOddOneOut } from './useOddOneOut';
import { buildShareText, buildOddCard } from './share';
import { shareCardOrText, downloadFile } from '../../lib/shareCard';

const CANONICAL = 'https://herdgamesonline.com/odd-one-out';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Odd One Out',
      alternateName: ['Odd one out game', 'Spot the odd one out', 'Find the odd one'],
      url: CANONICAL,
      description: 'A free odd one out game. Four words, three belong together and one does not. Spot the impostor, keep your streak alive, three lives. Single player, endless, no signup or download.',
      image: OG,
      genre: ['Puzzle', 'Quiz', 'Single player'],
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
  { q: 'How do you play odd one out?', a: 'You get four words. Three of them belong to the same group and one does not. Tap the one that does not belong. Every correct answer extends your streak, and you have three lives.' },
  { q: 'Is it free?', a: 'Yes, completely free. No signup, no download and no app. It runs in your browser on a phone or a laptop, and your best score is saved on your device.' },
  { q: 'Do the puzzles repeat?', a: 'Each round is built fresh from a large set of categories rather than pulled from a fixed list of puzzles, so you can play for a long time without seeing the same four words twice.' },
  { q: 'What counts as a good score?', a: 'Most people get somewhere between 7 and 12 in a run. Getting past 18 is a genuinely long streak.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function OddOneOut() {
  const g = useOddOneOut();
  const [copied, setCopied] = useState(false);

  const doShare = async () => {
    const file = await buildOddCard(g.score, g.isNewBest);
    const res = await shareCardOrText(file, buildShareText(g.score, g.isNewBest), 'Odd One Out');
    if (res === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const playing = g.status === 'playing' || g.status === 'reveal';

  /* Colour for an option during the reveal: green for the correct answer, red
     for the wrong one the player actually chose, neutral otherwise. */
  const optionStyle = (i) => {
    if (g.status !== 'reveal') return { background: THEME.bgAlt, borderColor: THEME.border, color: THEME.ink };
    if (i === g.round.oddIndex) return { background: '#EAF6EF', borderColor: THEME.green, color: THEME.green };
    if (i === g.picked) return { background: '#FCECEA', borderColor: THEME.red, color: THEME.red };
    return { background: THEME.bgAlt, borderColor: THEME.border, color: THEME.mut };
  };

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>Odd One Out — Free Online Word Game (No Download)</title>
        <meta name="description" content="Play Odd One Out free online. Four words, three belong together and one does not. Spot the impostor and keep your streak going. Endless, single player, no signup or download." />
        <meta name="keywords" content="odd one out game, spot the odd one out, word game, free online games no download, single player games, games to play alone, brain game" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Odd One Out — Free Online Word Game" />
        <meta property="og:description" content="Three belong together. One does not. Can you spot it?" />
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
            <h1 style={FREDOKA} className="text-4xl font-bold leading-tight md:text-6xl">Odd One Out</h1>
            <p style={QUICKSAND} className="mx-auto mt-4 max-w-md text-base md:text-lg">
              Four words. Three belong together, one does not. Tap the impostor.
              Three lives, and the streak is yours to lose.
            </p>
            <button
              onClick={g.start}
              style={{ ...FREDOKA, background: THEME.teal }}
              className="mt-8 rounded-2xl px-10 py-4 text-xl font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Start playing
            </button>
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-4 text-sm">
              {GROUPS.length} categories · endless
              {g.best > 0 && <> · your best: <strong style={{ color: THEME.teal }}>{g.best}</strong></>}
            </p>
          </div>
        )}

        {/* ---------------- PLAYING ---------------- */}
        {playing && g.round && (
          <div>
            <div className="mb-5 flex items-center justify-between" style={QUICKSAND}>
              <span className="text-sm font-bold" style={{ color: THEME.mut }}>
                Streak <strong style={{ color: THEME.teal }}>{g.score}</strong>
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

            <p style={FREDOKA} className="mb-4 text-center text-xl font-bold md:text-2xl">
              Which one does not belong?
            </p>

            <div className="grid gap-3">
              {g.round.options.map((opt, i) => (
                <button
                  key={opt.text + i}
                  data-testid="ooo-option"
                  onClick={() => g.pick(i)}
                  disabled={g.status !== 'playing'}
                  style={{ ...FREDOKA, ...optionStyle(i) }}
                  className="rounded-2xl border-2 px-5 py-4 text-lg font-bold transition-all disabled:cursor-default md:text-xl"
                >
                  {opt.text}
                </button>
              ))}
            </div>

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
                    {g.wasCorrect ? 'Correct!' : 'Not quite'}
                  </p>
                  <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-1">
                    The other three were all <strong style={{ color: THEME.ink }}>{g.round.groupLabel}</strong>.
                    {' '}<strong style={{ color: THEME.ink }}>{g.round.options[g.round.oddIndex].text}</strong> is
                    one of the <strong style={{ color: THEME.ink }}>{g.round.oddLabel}</strong>.
                  </p>
                  <button
                    onClick={g.next}
                    style={{ ...FREDOKA, background: THEME.teal }}
                    className="mt-5 w-full rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
                  >
                    {g.lives <= 0 ? 'See your score' : 'Next one'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ---------------- OVER ---------------- */}
        {g.status === 'over' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-sm uppercase tracking-widest">You got</p>
            <p style={{ ...FREDOKA, color: THEME.teal }} className="my-1 text-7xl font-bold md:text-8xl">{g.score}</p>
            <p style={QUICKSAND} className="text-lg">correct in a row</p>

            {(() => { const r = rankFor(g.score); return (
              <>
                <p style={FREDOKA} className="mt-4 text-2xl font-bold">{r.label}</p>
                <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-1">{r.blurb}</p>
              </>
            ); })()}

            {g.isNewBest && (
              <p style={{ ...FREDOKA, color: THEME.green }} className="mt-3 text-lg font-bold">New personal best!</p>
            )}
            {!g.isNewBest && g.best > g.score && (
              <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-2">Your best is {g.best} — go again?</p>
            )}

            <div className="mx-auto mt-8 grid max-w-sm gap-3">
              <button
                onClick={g.playAgain}
                style={{ ...FREDOKA, background: THEME.teal }}
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
              >
                <FiRotateCcw aria-hidden="true" /> Play again
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={doShare}
                  style={{ ...QUICKSAND, borderColor: THEME.teal, color: THEME.teal }}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 font-bold"
                >
                  {copied ? <><FiCheck aria-hidden="true" /> Copied</> : <><FiShare2 aria-hidden="true" /> Share</>}
                </button>
                <button
                  onClick={async () => downloadFile(await buildOddCard(g.score, g.isNewBest))}
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
          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">How to play Odd One Out</h2>
          <p style={{ color: THEME.mut }} className="mb-4">
            Each round gives you four words. Three of them belong to the same category — birds, metals,
            capital cities, dances — and the fourth is from somewhere else entirely. Tap the one that does not
            belong. Get it right and your streak grows; get it wrong and you lose one of your three lives.
          </p>
          <p style={{ color: THEME.mut }} className="mb-6">
            Rounds are built fresh from {GROUPS.length} categories rather than drawn from a fixed list of
            puzzles, so you can play for a long time without repeating yourself. After every answer you are
            told which category the other three shared, so a wrong guess still teaches you something.
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
            More to play: <Link to="/memory-game" className="font-bold underline" style={{ color: THEME.teal }}>Herd Memory</Link>,{' '}
            <Link to="/guess-the-year" className="font-bold underline" style={{ color: THEME.teal }}>Guess the Year</Link>, or{' '}
            <Link to="/solo-games" className="font-bold underline" style={{ color: THEME.teal }}>all solo games</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
