import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShare2, FiCheck, FiDownload, FiRotateCcw } from 'react-icons/fi';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import { THEME, FREDOKA, QUICKSAND, ROUNDS, PUZZLES, rankFor } from './emojiData';
import { useEmojiQuiz } from './useEmojiQuiz';
import { buildShareText, buildEmojiCard } from './share';
import { shareCardOrText, downloadFile } from '../../lib/shareCard';

const CANONICAL = 'https://herdgamesonline.com/emoji-movie-quiz';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Emoji Movie Quiz',
      alternateName: ['Emoji quiz', 'Guess the movie from emoji', 'Emoji film quiz'],
      url: CANONICAL,
      description: 'A free emoji movie quiz. Each round shows a film described in emoji and you pick the title from four options. Ten rounds, single player, no signup or download.',
      image: OG,
      genre: ['Quiz', 'Puzzle', 'Single player'],
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
  { q: 'How does the emoji movie quiz work?', a: 'Each round shows a film described entirely in emoji. You pick the title from four options. There are ten rounds, and you get a score out of ten plus a breakdown of the ones you missed.' },
  { q: 'Is it free?', a: 'Yes, completely free. No signup, no download and no app. It works in your browser on a phone or a laptop, and your best score is saved on your device.' },
  { q: 'How many puzzles are there?', a: `There are ${PUZZLES.length} emoji puzzles and ten are drawn at random each run, so you can play several times before you start seeing repeats.` },
  { q: 'Can I play it with friends?', a: 'It is single player, but the result card shows which ones you got right without revealing the answers, so you can send it to someone and compare. For a group game, try the party games in the hub.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function EmojiQuiz() {
  const g = useEmojiQuiz();
  const [copied, setCopied] = useState(false);

  const doShare = async () => {
    const file = await buildEmojiCard(g.results, g.score, g.isNewBest);
    const res = await shareCardOrText(file, buildShareText(g.results, g.score, g.isNewBest), 'Emoji Movie Quiz');
    if (res === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const optionStyle = (i) => {
    if (g.status !== 'reveal') return { background: THEME.bgAlt, borderColor: THEME.border, color: THEME.ink };
    if (i === g.current.answerIndex) return { background: '#EAF6EF', borderColor: THEME.green, color: THEME.green };
    if (i === g.picked) return { background: '#FCECEA', borderColor: THEME.red, color: THEME.red };
    return { background: THEME.bgAlt, borderColor: THEME.border, color: THEME.mut };
  };

  const playing = g.status === 'playing' || g.status === 'reveal';

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>Emoji Movie Quiz — Guess the Film from Emoji (Free)</title>
        <meta name="description" content="Play the free emoji movie quiz. Each round shows a film in emoji and you pick the title from four options. Ten rounds, no signup, no download, works on phone." />
        <meta name="keywords" content="emoji movie quiz, emoji quiz, guess the movie from emoji, emoji film quiz, free online games no download, single player games, games to play alone" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Emoji Movie Quiz — Guess the Film from Emoji" />
        <meta property="og:description" content="🦁👑 — too easy? There are nine more." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <Navigation />

      <div className="mx-auto max-w-lg px-4 pb-16 pt-24">
        {g.status === 'idle' && (
          <div className="text-center">
            <h1 style={FREDOKA} className="text-4xl font-bold leading-tight md:text-6xl">Emoji Movie Quiz</h1>
            <p style={QUICKSAND} className="mx-auto mt-4 max-w-md text-base md:text-lg">
              Ten films, described entirely in emoji. Pick the right title.
            </p>
            <p className="my-6 text-5xl" aria-hidden="true">🦁👑</p>
            <button
              onClick={g.start}
              style={{ ...FREDOKA, background: THEME.purple }}
              className="rounded-2xl px-10 py-4 text-xl font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Start the quiz
            </button>
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-4 text-base">
              {ROUNDS} rounds · {PUZZLES.length} puzzles in the deck
              {g.best > 0 && <> · your best: <strong style={{ color: THEME.purple }}>{g.best}/{ROUNDS}</strong></>}
            </p>
          </div>
        )}

        {playing && g.current && (
          <div>
            <div className="mb-5 flex items-center justify-between" style={QUICKSAND}>
              <span className="text-base font-bold" style={{ color: THEME.mut }}>
                Round {g.round + 1} of {g.roundsTotal}
              </span>
              <span className="text-base font-bold" style={{ color: THEME.purple }}>{g.score} correct</span>
            </div>

            <div
              className="rounded-3xl border-2 p-6 text-center"
              style={{ background: THEME.bgAlt, borderColor: THEME.border }}
            >
              <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-base uppercase tracking-widest">
                Which film is this?
              </p>
              <p className="my-5 text-6xl leading-tight md:text-7xl" aria-label={`Emoji clue: ${g.current.emoji}`}>
                {g.current.emoji}
              </p>

              <div className="grid gap-3">
                {g.current.options.map((opt, i) => (
                  <button
                    key={opt + i}
                    data-testid="emoji-option"
                    onClick={() => g.pick(i)}
                    disabled={g.status !== 'playing'}
                    style={{ ...FREDOKA, ...optionStyle(i) }}
                    className="rounded-2xl border-2 px-4 py-3 text-base font-bold transition-all disabled:cursor-default md:text-lg"
                  >
                    {opt}
                  </button>
                ))}
              </div>

              <AnimatePresence>
                {g.status === 'reveal' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5"
                    role="status"
                    aria-live="polite"
                  >
                    <p style={{ ...FREDOKA, color: g.wasCorrect ? THEME.green : THEME.red }} className="text-2xl font-bold">
                      {g.wasCorrect ? 'Correct!' : `It was ${g.current.answer}`}
                    </p>
                    <button
                      onClick={g.next}
                      style={{ ...FREDOKA, background: THEME.purple }}
                      className="mt-4 w-full rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
                    >
                      {g.round + 1 >= g.roundsTotal ? 'See your score' : 'Next film'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {g.status === 'over' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-base uppercase tracking-widest">You scored</p>
            <p style={{ ...FREDOKA, color: THEME.purple }} className="my-1 text-7xl font-bold md:text-8xl">
              {g.score}<span className="text-4xl">/{g.roundsTotal}</span>
            </p>

            {(() => { const r = rankFor(g.score); return (
              <>
                <p style={FREDOKA} className="mt-3 text-2xl font-bold">{r.label}</p>
                <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-1">{r.blurb}</p>
              </>
            ); })()}

            {g.isNewBest && (
              <p style={{ ...FREDOKA, color: THEME.green }} className="mt-3 text-lg font-bold">New personal best!</p>
            )}

            <div className="mx-auto mt-6 max-w-md space-y-2 text-left">
              {g.results.map((r, i) => (
                <div
                  key={r.answer + i}
                  className="flex items-center gap-3 rounded-2xl border-2 px-4 py-2.5"
                  style={{ background: THEME.bgAlt, borderColor: THEME.border }}
                >
                  <span className="text-xl" aria-hidden="true">{r.emoji}</span>
                  <span style={QUICKSAND} className="min-w-0 flex-1 truncate text-base font-bold">{r.answer}</span>
                  <span aria-hidden="true" style={{ color: r.correct ? THEME.green : THEME.red }} className="font-bold">
                    {r.correct ? '✓' : '✗'}
                  </span>
                </div>
              ))}
            </div>

            <div className="mx-auto mt-8 grid max-w-sm gap-3">
              <button
                onClick={g.playAgain}
                style={{ ...FREDOKA, background: THEME.purple }}
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
              >
                <FiRotateCcw aria-hidden="true" /> Play again
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={doShare}
                  style={{ ...QUICKSAND, borderColor: THEME.purple, color: THEME.purple }}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 font-bold"
                >
                  {copied ? <><FiCheck aria-hidden="true" /> Copied</> : <><FiShare2 aria-hidden="true" /> Share</>}
                </button>
                <button
                  onClick={async () => downloadFile(await buildEmojiCard(g.results, g.score, g.isNewBest))}
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
          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">How to play the emoji movie quiz</h2>
          <p style={{ color: THEME.mut }} className="mb-4">
            Every round shows a film told entirely in emoji — 🦁👑 for The Lion King, 🚢🧊💔 for Titanic — and
            you pick the title from four options. Ten rounds gives you a score out of ten, plus a list of every
            film you saw so you can see which ones caught you out.
          </p>
          <p style={{ color: THEME.mut }} className="mb-6">
            There are {PUZZLES.length} puzzles in the deck and ten are drawn at random each time, so you can
            play several runs before repeats appear. Your best score is saved on your device.
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
            More to play: <Link to="/guess-the-year" className="font-bold underline" style={{ color: THEME.purple }}>Guess the Year</Link>,{' '}
            <Link to="/odd-one-out" className="font-bold underline" style={{ color: THEME.purple }}>Odd One Out</Link>, or{' '}
            <Link to="/solo-games" className="font-bold underline" style={{ color: THEME.purple }}>all solo games</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
