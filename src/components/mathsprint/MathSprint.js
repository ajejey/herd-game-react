import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FiShare2, FiCheck, FiDownload, FiRotateCcw, FiDelete } from 'react-icons/fi';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import { THEME, FREDOKA, QUICKSAND, DURATION_S, rankFor } from './mathData';
import { useMathSprint } from './useMathSprint';
import { buildShareText, buildMathCard } from './share';
import { shareCardOrText, downloadFile } from '../../lib/shareCard';

const CANONICAL = 'https://herdgamesonline.com/math-game';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Mental Maths Sprint',
      alternateName: ['Math game', 'Mental math game', 'Quick maths game', 'Arithmetic game'],
      url: CANONICAL,
      description: 'A free mental maths game. Answer as many arithmetic questions as you can in sixty seconds. Questions get harder as you go. Single player, no signup or download.',
      image: OG,
      genre: ['Puzzle', 'Educational', 'Single player'],
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
  { q: 'How does the maths game work?', a: 'You get sixty seconds and as many arithmetic questions as you can answer. Type your answer on the keypad and press the tick. Every correct answer scores a point, and the questions get harder the further you get.' },
  { q: 'Is it free?', a: 'Yes, completely free. No signup, no download and no app. Your best score is saved on your device.' },
  { q: 'Is it good for practising times tables?', a: 'Yes. Addition and subtraction come first, then multiplication, then division, and everything divides exactly so there are no fractions or negative numbers to worry about.' },
  { q: 'What is a good score?', a: 'Most people land between 14 and 22 in a minute. Over 30 is quick, and over 40 is genuinely rare.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'ok'];

export default function MathSprint() {
  const g = useMathSprint();
  const [copied, setCopied] = useState(false);

  const doShare = async () => {
    const file = await buildMathCard(g.score, g.isNewBest);
    const res = await shareCardOrText(file, buildShareText(g.score, g.isNewBest), 'Mental Maths Sprint');
    if (res === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const entryColour = g.flash === 'ok' ? THEME.green : g.flash === 'no' ? THEME.red : THEME.ink;
  const pct = Math.max(0, Math.min(100, (g.remaining / g.duration) * 100));

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>Maths Game — Free 60 Second Mental Maths Sprint (No Download)</title>
        <meta name="description" content="Play a free mental maths game. Answer as many arithmetic questions as you can in sixty seconds, with questions that get harder as you go. No signup, no download, works on phone." />
        <meta name="keywords" content="math game, mental math game, maths game, arithmetic game, times tables game, brain game, free online games no download, single player games" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Mental Maths Sprint — Free 60 Second Maths Game" />
        <meta property="og:description" content="Sixty seconds. How many can you get?" />
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
            <h1 style={FREDOKA} className="text-4xl font-bold leading-tight md:text-6xl">Mental Maths Sprint</h1>
            <p style={QUICKSAND} className="mx-auto mt-4 max-w-md text-base md:text-lg">
              Sixty seconds. As many as you can. The questions get harder the further you get.
            </p>
            <button
              onClick={g.start}
              style={{ ...FREDOKA, background: THEME.blue }}
              className="mt-8 rounded-2xl px-10 py-4 text-xl font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Start the sprint
            </button>
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-4 text-base">
              {DURATION_S} seconds · no negatives, no fractions
              {g.best > 0 && <> · your best: <strong style={{ color: THEME.blue }}>{g.best}</strong></>}
            </p>
          </div>
        )}

        {g.status === 'playing' && g.question && (
          <div>
            <div className="mb-2 flex items-center justify-between" style={QUICKSAND}>
              <span className="text-base font-bold" style={{ color: THEME.mut }}>
                Score <strong style={{ color: THEME.blue }}>{g.score}</strong>
              </span>
              <span
                className="text-base font-bold"
                style={{ color: g.remaining <= 10 ? THEME.red : THEME.mut }}
                role="timer"
                aria-live="off"
              >
                {g.remaining}s
              </span>
            </div>
            <div className="mb-5 h-2 w-full overflow-hidden rounded-full" style={{ background: THEME.border }}>
              <div
                className="h-full rounded-full transition-[width] duration-100 ease-linear"
                style={{ width: `${pct}%`, background: g.remaining <= 10 ? THEME.red : THEME.blue }}
              />
            </div>

            <div
              className="rounded-3xl border-2 p-6 text-center"
              style={{ background: THEME.bgAlt, borderColor: THEME.border }}
            >
              <p style={FREDOKA} className="text-5xl font-bold md:text-6xl" data-testid="math-question">
                {g.question.text}
              </p>
              <p
                style={{ ...FREDOKA, color: entryColour }}
                className="mt-4 min-h-[3rem] text-4xl font-bold"
                data-testid="math-entry"
              >
                {g.entry || <span style={{ color: THEME.border }}>?</span>}
              </p>
            </div>

            {/* On-screen keypad: a real numeric input would summon the OS
                keyboard and shove the layout around mid-sprint. */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              {KEYS.map((k) => (
                <button
                  key={k}
                  data-testid={`key-${k}`}
                  onClick={() => g.press(k)}
                  aria-label={k === 'ok' ? 'Submit answer' : k === 'del' ? 'Delete' : k}
                  style={{
                    ...FREDOKA,
                    background: k === 'ok' ? THEME.blue : THEME.bgAlt,
                    color: k === 'ok' ? '#FFFFFF' : THEME.ink,
                    borderColor: THEME.border,
                  }}
                  className="flex items-center justify-center rounded-2xl border-2 py-5 text-2xl font-bold active:scale-95"
                >
                  {k === 'del' ? <FiDelete aria-hidden="true" /> : k === 'ok' ? <FiCheck aria-hidden="true" /> : k}
                </button>
              ))}
            </div>
          </div>
        )}

        {g.status === 'over' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-base uppercase tracking-widest">You answered</p>
            <p style={{ ...FREDOKA, color: THEME.blue }} className="my-1 text-7xl font-bold md:text-8xl">{g.score}</p>
            <p style={QUICKSAND} className="text-lg">in {DURATION_S} seconds</p>

            {(() => { const r = rankFor(g.score); return (
              <>
                <p style={FREDOKA} className="mt-4 text-2xl font-bold">{r.label}</p>
                <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-1">{r.blurb}</p>
              </>
            ); })()}

            {g.wrong > 0 && (
              <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-3 text-base">
                {g.wrong} wrong {g.wrong === 1 ? 'answer' : 'answers'} along the way
              </p>
            )}
            {g.isNewBest && (
              <p style={{ ...FREDOKA, color: THEME.green }} className="mt-3 text-lg font-bold">New personal best!</p>
            )}

            <div className="mx-auto mt-8 grid max-w-sm gap-3">
              <button
                onClick={g.playAgain}
                style={{ ...FREDOKA, background: THEME.blue }}
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
              >
                <FiRotateCcw aria-hidden="true" /> Go again
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={doShare}
                  style={{ ...QUICKSAND, borderColor: THEME.blue, color: THEME.blue }}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 font-bold"
                >
                  {copied ? <><FiCheck aria-hidden="true" /> Copied</> : <><FiShare2 aria-hidden="true" /> Share</>}
                </button>
                <button
                  onClick={async () => downloadFile(await buildMathCard(g.score, g.isNewBest))}
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
          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">How the maths sprint works</h2>
          <p style={{ color: THEME.mut }} className="mb-4">
            You have {DURATION_S} seconds and an endless supply of questions. Tap your answer on the keypad and
            press the tick. Correct answers score a point and bring up the next question immediately; a wrong
            answer costs you nothing but the time it took.
          </p>
          <p style={{ color: THEME.mut }} className="mb-6">
            The questions start with easy addition and subtraction and get harder as your score climbs, moving
            through multiplication and then division. Every answer is a whole positive number — no fractions
            and no negatives — so you never have to fight the keypad.
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
            More to play: <Link to="/reaction-time-test" className="font-bold underline" style={{ color: THEME.blue }}>Reaction Time Test</Link>,{' '}
            <Link to="/memory-game" className="font-bold underline" style={{ color: THEME.blue }}>Herd Memory</Link>, or{' '}
            <Link to="/solo-games" className="font-bold underline" style={{ color: THEME.blue }}>all solo games</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
