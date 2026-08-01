import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShare2, FiCheck, FiDownload, FiRotateCcw, FiMinus, FiPlus } from 'react-icons/fi';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import { THEME, FREDOKA, QUICKSAND, ROUNDS, MAX_ROUND_SCORE, verdictFor, rankFor, FILMS } from './gtyData';
import { useGuessTheYear } from './useGuessTheYear';
import { buildShareText, buildYearCard } from './share';
import { shareCardOrText, downloadFile } from '../../lib/shareCard';

const CANONICAL = 'https://herdgamesonline.com/guess-the-year';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Guess the Year',
      alternateName: ['Guess the year game', 'Movie year quiz', 'Guess the movie year'],
      url: CANONICAL,
      description: 'A free guess the year game. You get a famous film, you slide to the year you think it came out, and you score on how close you are. Five rounds, single player, no signup or download.',
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
  { q: 'What is Guess the Year?', a: 'You are shown a famous film and you guess the year it was released by sliding along a timeline. The closer you are, the more points you score. A run is five films, out of 500 points.' },
  { q: 'How is it scored?', a: 'Each round is worth up to 100 points. An exact answer scores the full 100, and you lose 10 points for every year you are out, down to zero. So being three years off still scores 70.' },
  { q: 'Is it free?', a: 'Yes, completely free. No signup, no download, no app. It works in your browser on a phone or a laptop, and your best score is saved on your device.' },
  { q: 'Can I play more than once a day?', a: 'Yes, as many times as you like. The films are drawn at random from hundreds each run, so no two games are the same.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function GuessTheYear() {
  const g = useGuessTheYear();
  const [copied, setCopied] = useState(false);

  const doShare = async () => {
    const file = await buildYearCard(g.results, g.total, g.isNewBest);
    const res = await shareCardOrText(file, buildShareText(g.results, g.total), 'Guess the Year');
    if (res === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const nudge = (delta) => g.setGuess((y) => Math.min(g.maxYear, Math.max(g.minYear, y + delta)));

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>Guess the Year — Free Movie Year Guessing Game (No Download)</title>
        <meta name="description" content="Play Guess the Year free online. You get a famous film, you slide to the year you think it was released, and you score on how close you are. Five rounds, no signup, no download." />
        <meta name="keywords" content="guess the year game, movie year quiz, guess the movie year, film trivia game, single player games, games to play alone, free online games no download" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Guess the Year — Free Movie Year Guessing Game" />
        <meta property="og:description" content="Five films. How close can you get?" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <Navigation />

      <div className="mx-auto max-w-2xl px-4 pb-16 pt-24">
        {/* ---------------- INTRO ---------------- */}
        {g.status === 'intro' && (
          <div className="text-center">
            <h1 style={FREDOKA} className="text-4xl font-bold leading-tight md:text-6xl">Guess the Year</h1>
            <p style={QUICKSAND} className="mx-auto mt-4 max-w-lg text-base md:text-lg">
              Five famous films. Slide to the year you think each one came out. The closer you land,
              the more you score.
            </p>
            <button
              onClick={g.start}
              style={{ ...FREDOKA, background: THEME.amberDeep }}
              className="mt-8 rounded-2xl px-10 py-4 text-xl font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Start playing
            </button>
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-4 text-sm">
              {ROUNDS} rounds · {FILMS.length} films in the deck
              {g.best > 0 && <> · your best: <strong style={{ color: THEME.amberDeep }}>{g.best}</strong></>}
            </p>
          </div>
        )}

        {/* ---------------- GUESSING / REVEAL ---------------- */}
        {(g.status === 'guessing' || g.status === 'reveal') && g.film && (
          <div>
            <div className="mb-5 flex items-center justify-between" style={QUICKSAND}>
              <span className="text-sm font-bold" style={{ color: THEME.mut }}>
                Round {g.round + 1} of {g.roundsTotal}
              </span>
              <span className="text-sm font-bold" style={{ color: THEME.amberDeep }}>{g.total} pts</span>
            </div>

            <div
              className="rounded-3xl border-2 p-6 text-center"
              style={{ background: THEME.bgAlt, borderColor: THEME.border }}
            >
              <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-sm uppercase tracking-widest">
                What year did this come out?
              </p>
              <h2 style={FREDOKA} className="mt-2 text-3xl font-bold leading-tight md:text-4xl">
                {g.film.n}
              </h2>

              <AnimatePresence mode="wait">
                {g.status === 'guessing' ? (
                  <motion.div key="guess" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <p style={{ ...FREDOKA, color: THEME.amberDeep }} className="mt-6 text-6xl font-bold md:text-7xl">
                      {g.guess}
                    </p>

                    {/* Slider is the hero control: one thumb, works on a phone. */}
                    <div className="mt-5 flex items-center gap-3">
                      <button
                        onClick={() => nudge(-1)}
                        aria-label="One year earlier"
                        style={{ borderColor: THEME.border, color: THEME.mut }}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2"
                      >
                        <FiMinus aria-hidden="true" />
                      </button>
                      <input
                        type="range"
                        min={g.minYear}
                        max={g.maxYear}
                        value={g.guess}
                        onChange={(e) => g.setGuess(Number(e.target.value))}
                        aria-label="Pick a year"
                        className="h-2 w-full cursor-pointer appearance-none rounded-full"
                        style={{ accentColor: THEME.amber, background: THEME.border }}
                      />
                      <button
                        onClick={() => nudge(1)}
                        aria-label="One year later"
                        style={{ borderColor: THEME.border, color: THEME.mut }}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2"
                      >
                        <FiPlus aria-hidden="true" />
                      </button>
                    </div>
                    <div style={{ ...QUICKSAND, color: THEME.mut }} className="mt-1 flex justify-between text-xs font-bold">
                      <span>{g.minYear}</span><span>{g.maxYear}</span>
                    </div>

                    <button
                      onClick={g.lockIn}
                      style={{ ...FREDOKA, background: THEME.amberDeep }}
                      className="mt-6 w-full rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
                    >
                      Lock it in
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="reveal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                    {(() => {
                      const r = g.lastResult;
                      if (!r) return null;
                      const v = verdictFor(r.diff);
                      return (
                        <>
                          <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-6 text-sm">It came out in</p>
                          <p style={{ ...FREDOKA, color: v.color }} className="text-6xl font-bold md:text-7xl">{r.actual}</p>
                          <p style={{ ...FREDOKA, color: v.color }} className="mt-2 text-2xl font-bold">{v.label}</p>
                          <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-1">
                            You said {r.guess}
                            {r.diff > 0 && <> — {r.diff} year{r.diff === 1 ? '' : 's'} off</>}
                          </p>
                          <p style={{ ...FREDOKA, color: THEME.ink }} className="mt-3 text-3xl font-bold">
                            +{r.points}
                          </p>
                          <button
                            onClick={g.next}
                            style={{ ...FREDOKA, background: THEME.amberDeep }}
                            className="mt-6 w-full rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
                          >
                            {g.round + 1 >= g.roundsTotal ? 'See your score' : 'Next film'}
                          </button>
                        </>
                      );
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* ---------------- OVER ---------------- */}
        {g.status === 'over' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-sm uppercase tracking-widest">You scored</p>
            <p style={{ ...FREDOKA, color: THEME.amberDeep }} className="my-1 text-7xl font-bold md:text-8xl">{g.total}</p>
            <p style={QUICKSAND} className="text-lg">out of {g.roundsTotal * MAX_ROUND_SCORE}</p>
            {(() => { const r = rankFor(g.total); return (
              <>
                <p style={FREDOKA} className="mt-4 text-2xl font-bold">{r.label}</p>
                <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-1">{r.blurb}</p>
              </>
            ); })()}
            {g.isNewBest && (
              <p style={{ ...FREDOKA, color: THEME.green }} className="mt-3 text-lg font-bold">New personal best!</p>
            )}

            {/* Per-round breakdown — the "what did I miss" moment that makes you replay. */}
            <div className="mx-auto mt-6 max-w-md space-y-2 text-left">
              {g.results.map((r, i) => {
                const v = verdictFor(r.diff);
                return (
                  <div
                    key={r.film.n + i}
                    data-testid="gty-row"
                    className="flex items-center justify-between gap-3 rounded-2xl border-2 px-4 py-3"
                    style={{ background: THEME.bgAlt, borderColor: THEME.border }}
                  >
                    <span style={QUICKSAND} className="min-w-0 flex-1 truncate text-sm font-bold">{r.film.n}</span>
                    <span style={{ ...QUICKSAND, color: THEME.mut }} className="shrink-0 text-sm">
                      {r.guess} → <strong style={{ color: v.color }}>{r.actual}</strong>
                    </span>
                    <span style={{ ...FREDOKA, color: v.color }} className="w-12 shrink-0 text-right text-sm font-bold">
                      +{r.points}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mx-auto mt-8 grid max-w-sm gap-3">
              <button
                onClick={g.playAgain}
                style={{ ...FREDOKA, background: THEME.amberDeep }}
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
              >
                <FiRotateCcw aria-hidden="true" /> Play again
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={doShare}
                  style={{ ...QUICKSAND, borderColor: THEME.amberDeep, color: THEME.amberDeepDeep }}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 font-bold"
                >
                  {copied ? <><FiCheck aria-hidden="true" /> Copied</> : <><FiShare2 aria-hidden="true" /> Share</>}
                </button>
                <button
                  onClick={async () => downloadFile(await buildYearCard(g.results, g.total, g.isNewBest))}
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
          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">How to play Guess the Year</h2>
          <p style={{ color: THEME.mut }} className="mb-4">
            Each round shows a famous film. Slide along the timeline to the year you think it was released
            and lock it in. An exact answer scores the full {MAX_ROUND_SCORE} points, and you drop 10 points
            for every year you are out — so being a couple of years off still scores well. After {ROUNDS} films
            you get a total out of {ROUNDS * MAX_ROUND_SCORE}, plus a breakdown of every film you missed.
          </p>
          <p style={{ color: THEME.mut }} className="mb-6">
            There is no daily limit. Films are drawn at random from {FILMS.length} in the deck, so every run
            is a different set, and your best score is saved on your device.
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
            More to play: <Link to="/higher-or-lower" className="font-bold underline" style={{ color: THEME.green }}>Higher or Lower</Link>,{' '}
            <Link to="/solo-games" className="font-bold underline" style={{ color: THEME.green }}>all solo games</Link>, or{' '}
            <Link to="/all-games" className="font-bold underline" style={{ color: THEME.green }}>the full game hub</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
