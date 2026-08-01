import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShare2, FiCheck, FiDownload, FiRotateCcw, FiHeart } from 'react-icons/fi';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import {
  THEME, FREDOKA, QUICKSAND, ATTRIBUTION, QUESTION_COUNT, CATEGORIES,
  DIFFICULTY_LABEL, rankFor,
} from './streakData';
import { useTriviaStreak } from './useTriviaStreak';
import { buildShareText, buildStreakCard } from './share';
import { shareCardOrText, downloadFile } from '../../lib/shareCard';

const CANONICAL = 'https://herdgamesonline.com/trivia-streak';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Trivia Streak',
      alternateName: ['Endless trivia', 'Trivia streak game', 'Unlimited trivia quiz'],
      url: CANONICAL,
      description: 'A free endless trivia game. Keep answering to build your streak, with questions getting harder as you go. Three lives, over 1,700 questions, no signup or download.',
      image: OG,
      genre: ['Trivia', 'Quiz', 'Single player'],
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
  { q: 'How does Trivia Streak work?', a: 'You answer trivia questions one after another to build a streak. Every correct answer keeps you going and the questions get harder as your streak grows. You have three lives, so three wrong answers end the run.' },
  { q: 'How many questions are there?', a: `Over ${QUESTION_COUNT.toLocaleString()} across ${CATEGORIES.length} categories, and the bank grows regularly. Questions are picked to avoid repeats within a run, so a long streak stays fresh.` },
  { q: 'Is it different from the Daily Trivia?', a: 'Yes. Daily Trivia gives you one fixed set of questions per day and everyone gets the same ones. Trivia Streak is endless and random, so you can play as many times as you like.' },
  { q: 'Is it free?', a: 'Yes, completely free. No signup, no download and no app. Your best streak is saved on your device.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function TriviaStreak() {
  const g = useTriviaStreak();
  const [copied, setCopied] = useState(false);

  const doShare = async () => {
    const file = await buildStreakCard(g.score, g.isNewBest);
    const res = await shareCardOrText(file, buildShareText(g.score, g.isNewBest), 'Trivia Streak');
    if (res === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const optionStyle = (i) => {
    if (g.status !== 'reveal') return { background: THEME.bgAlt, borderColor: THEME.border, color: THEME.ink };
    if (i === g.question.answerIndex) return { background: '#EAF6EF', borderColor: THEME.green, color: THEME.green };
    if (i === g.picked) return { background: '#FCECEA', borderColor: THEME.red, color: THEME.red };
    return { background: THEME.bgAlt, borderColor: THEME.border, color: THEME.mut };
  };

  const playing = g.status === 'playing' || g.status === 'reveal';

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>Trivia Streak — Free Endless Trivia Game (No Download)</title>
        <meta name="description" content={`Play free endless trivia. Keep your streak alive through ${QUESTION_COUNT.toLocaleString()}+ questions that get harder as you go. Three lives, no signup, no download, works on phone.`} />
        <meta name="keywords" content="trivia streak, endless trivia, unlimited trivia game, free trivia game online, quiz game, single player games, games to play alone, free online games no download" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Trivia Streak — Free Endless Trivia Game" />
        <meta property="og:description" content="How long can you keep the streak alive?" />
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
            <h1 style={FREDOKA} className="text-4xl font-bold leading-tight md:text-6xl">Trivia Streak</h1>
            <p style={QUICKSAND} className="mx-auto mt-4 max-w-md text-base md:text-lg">
              Keep answering to keep the streak alive. The questions get harder the further you get,
              and you only have three lives.
            </p>
            <button
              onClick={g.start}
              style={{ ...FREDOKA, background: THEME.forest }}
              className="mt-8 rounded-2xl px-10 py-4 text-xl font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Start the streak
            </button>
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-4 text-sm">
              {QUESTION_COUNT.toLocaleString()} questions · {CATEGORIES.length} categories
              {g.best > 0 && <> · your best: <strong style={{ color: THEME.forest }}>{g.best}</strong></>}
            </p>
          </div>
        )}

        {playing && g.question && (
          <div>
            <div className="mb-4 flex items-center justify-between" style={QUICKSAND}>
              <span className="text-sm font-bold" style={{ color: THEME.mut }}>
                Streak <strong style={{ color: THEME.forest }}>{g.score}</strong>
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

            <div
              className="rounded-3xl border-2 p-5"
              style={{ background: THEME.bgAlt, borderColor: THEME.border }}
            >
              <p style={{ ...QUICKSAND, color: THEME.mut }} className="mb-2 text-center text-xs font-bold uppercase tracking-widest">
                {g.question.category} · {DIFFICULTY_LABEL[g.question.difficulty] || 'Mixed'}
              </p>
              <h2 style={FREDOKA} className="mb-5 text-center text-xl font-bold leading-snug md:text-2xl">
                {g.question.text}
              </h2>

              <div className="grid gap-2.5">
                {g.question.options.map((opt, i) => (
                  <button
                    key={opt + i}
                    data-testid="streak-option"
                    onClick={() => g.pick(i)}
                    disabled={g.status !== 'playing'}
                    style={{ ...QUICKSAND, ...optionStyle(i) }}
                    className="rounded-2xl border-2 px-4 py-3 text-left text-base font-bold transition-all disabled:cursor-default"
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
                    className="mt-5 text-center"
                    role="status"
                    aria-live="polite"
                  >
                    <p style={{ ...FREDOKA, color: g.wasCorrect ? THEME.green : THEME.red }} className="text-2xl font-bold">
                      {g.wasCorrect ? 'Correct!' : `It was ${g.question.answer}`}
                    </p>
                    <button
                      onClick={g.next}
                      style={{ ...FREDOKA, background: THEME.forest }}
                      className="mt-4 w-full rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
                    >
                      {g.lives <= 0 ? 'See your score' : 'Next question'}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {g.status === 'over' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-sm uppercase tracking-widest">Your streak</p>
            <p style={{ ...FREDOKA, color: THEME.forest }} className="my-1 text-7xl font-bold md:text-8xl">{g.score}</p>
            <p style={QUICKSAND} className="text-lg">{g.score === 1 ? 'question' : 'questions'}</p>

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
                style={{ ...FREDOKA, background: THEME.forest }}
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
              >
                <FiRotateCcw aria-hidden="true" /> Play again
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={doShare}
                  style={{ ...QUICKSAND, borderColor: THEME.forest, color: THEME.forest }}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 font-bold"
                >
                  {copied ? <><FiCheck aria-hidden="true" /> Copied</> : <><FiShare2 aria-hidden="true" /> Share</>}
                </button>
                <button
                  onClick={async () => downloadFile(await buildStreakCard(g.score, g.isNewBest))}
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
          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">How Trivia Streak works</h2>
          <p style={{ color: THEME.mut }} className="mb-4">
            Answer questions one after another for as long as you can. Every correct answer adds one to your
            streak, and the difficulty steps up as you climb — easy questions to start, medium after five, hard
            after twelve. Three wrong answers ends the run.
          </p>
          <p style={{ color: THEME.mut }} className="mb-6">
            There are {QUESTION_COUNT.toLocaleString()} questions across {CATEGORIES.length} categories
            ({CATEGORIES.slice(0, 6).join(', ')} and more), and a run avoids repeating itself, so even a long
            streak stays fresh. Unlike the <Link to="/trivia" className="font-bold underline" style={{ color: THEME.forest }}>Daily Trivia</Link>,
            there is no daily limit — play as often as you like.
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

          {/* CC BY-SA 4.0 requires this. Do not remove. */}
          <p className="mt-8 text-xs" style={{ color: THEME.mut }}>{ATTRIBUTION}</p>

          <p className="mt-4 text-sm" style={{ color: THEME.mut }}>
            More to play: <Link to="/odd-one-out" className="font-bold underline" style={{ color: THEME.forest }}>Odd One Out</Link>,{' '}
            <Link to="/guess-the-year" className="font-bold underline" style={{ color: THEME.forest }}>Guess the Year</Link>, or{' '}
            <Link to="/solo-games" className="font-bold underline" style={{ color: THEME.forest }}>all solo games</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
