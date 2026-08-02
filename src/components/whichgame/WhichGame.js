import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FiRotateCcw, FiArrowRight } from 'react-icons/fi';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import { THEME, FREDOKA, QUICKSAND, QUESTIONS, scoreAnswers } from './whichData';
import { GAMES } from '../../data/games';

const CANONICAL = 'https://herdgamesonline.com/which-game-should-i-play';
const OG = 'https://herdgamesonline.com/og-image.png';

const byId = (id) => GAMES.find((g) => g.id === id);

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Which Game Should You Play?',
  url: CANONICAL,
  description: 'A short quiz that recommends a free browser game to play right now, based on who you are with, how long you have and what you are in the mood for.',
};

const FAQS = [
  { q: 'How does it decide?', a: 'Six questions about who is playing, how long you have and what you are in the mood for. Each answer votes for games that fit, and the game with the most votes wins.' },
  { q: 'Are the results real games?', a: `Yes — every recommendation is a real game on this site that you can play immediately, drawn from the games on this site. Nothing is a placeholder.` },
  { q: 'Can I take it more than once?', a: 'As many times as you like. The same answers always give the same result, so change an answer or two to see what else fits.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function WhichGame() {
  const [answers, setAnswers] = useState([]);
  const step = answers.length;
  const done = step >= QUESTIONS.length;

  // Only games that still exist in the registry can be shown. If one is ever
  // renamed or removed, it drops out silently rather than rendering a dead card.
  const ranked = done ? scoreAnswers(answers).map(byId).filter(Boolean) : [];
  const [top, ...rest] = ranked;

  const choose = (i) => setAnswers((a) => (a.length >= QUESTIONS.length ? a : [...a, i]));
  const restart = () => setAnswers([]);

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>Which Game Should You Play? — Free Quiz (No Download)</title>
        <meta name="description" content="Six questions and we will tell you which free browser game to play right now — solo, with a friend or with the whole office. No signup, no download." />
        <meta name="keywords" content="which game should i play, what game to play, game picker quiz, free online games no download, party game quiz, single player games" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Which Game Should You Play?" />
        <meta property="og:description" content="Six questions. One game to play right now." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <Navigation />

      <div className="mx-auto max-w-md px-4 pb-16 pt-24">
        {!done && (
          <div>
            <div className="text-center">
              <h1 style={FREDOKA} className="text-3xl font-bold leading-tight md:text-4xl">
                Which game should you play?
              </h1>
              <p style={QUICKSAND} className="mx-auto mt-3 max-w-md text-base">
                Six quick questions and we will pick one for you.
              </p>
            </div>

            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-6 text-center text-sm font-bold uppercase tracking-widest">
              Question {step + 1} of {QUESTIONS.length}
            </p>

            <div style={{ background: THEME.border }} className="mx-auto mt-2 h-2 w-full overflow-hidden rounded-full">
              <div
                style={{ background: THEME.gold, width: `${(step / QUESTIONS.length) * 100}%` }}
                className="h-full transition-all duration-300"
              />
            </div>

            <h2 data-testid="wg-question" style={FREDOKA} className="mt-6 text-center text-2xl font-bold">
              {QUESTIONS[step].q}
            </h2>

            <div className="mt-5 grid gap-3">
              {QUESTIONS[step].options.map((o, i) => (
                <button
                  key={o.label}
                  data-testid="wg-option"
                  onClick={() => choose(i)}
                  style={{ ...QUICKSAND, background: THEME.bgAlt, borderColor: THEME.border, color: THEME.ink }}
                  className="rounded-2xl border-[3px] px-5 py-4 text-left text-lg font-bold transition-transform active:scale-[0.99]"
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {done && top && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-center text-sm uppercase tracking-widest">
              You should play
            </p>
            <h1 data-testid="wg-result" style={{ ...FREDOKA, color: top.accent }} className="mt-1 text-center text-4xl font-bold md:text-5xl">
              {top.name}
            </h1>
            <p style={QUICKSAND} className="mx-auto mt-3 max-w-sm text-center text-lg">{top.blurb}</p>
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-2 text-center text-sm">
              {top.players} player{top.players === '1' ? '' : 's'} · about {top.minutes} min
            </p>

            <Link
              to={top.slug}
              data-testid="wg-play"
              style={{ ...FREDOKA, background: top.accent }}
              className="mx-auto mt-6 flex max-w-xs items-center justify-center gap-2 rounded-2xl py-4 text-xl font-bold text-white active:scale-[0.98]"
            >
              Play it now <FiArrowRight aria-hidden="true" />
            </Link>

            {rest.length > 0 && (
              <div className="mt-8">
                <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-center text-sm font-bold uppercase tracking-widest">
                  Also a good fit
                </p>
                <div className="mt-3 grid gap-2">
                  {rest.slice(0, 3).map((g) => (
                    <Link
                      key={g.id}
                      to={g.slug}
                      data-testid="wg-runner-up"
                      style={{ ...QUICKSAND, background: THEME.bgAlt, borderColor: THEME.border }}
                      className="flex items-center justify-between rounded-2xl border-2 px-4 py-3 font-bold"
                    >
                      <span>{g.name}</span>
                      <span style={{ color: g.accent }} aria-hidden="true">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={restart}
              style={{ ...QUICKSAND, borderColor: THEME.border, color: THEME.mut }}
              className="mx-auto mt-6 flex items-center gap-2 rounded-2xl border-2 px-6 py-3 font-bold"
            >
              <FiRotateCcw aria-hidden="true" /> Take it again
            </button>
          </motion.div>
        )}

        <div className="mt-12"><AdSlot /></div>

        <section className="mt-12" style={QUICKSAND}>
          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">Not sure what to play?</h2>
          <p style={{ color: THEME.mut }} className="mb-4">
            There are a lot of games here, which is wonderful right up until you just want to play
            something and cannot decide. Six questions — who is with you, how long you have, what you are in
            the mood for — and you get one game to open right now, plus a few that also fit.
          </p>
          <p style={{ color: THEME.mut }} className="mb-6">
            Everything it can recommend is free, runs in the browser and needs no signup or download. Some
            are single player, some need a room code and some friends, and the quiz takes that into account
            from the first question.
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
            Or just browse: <Link to="/solo-games" className="font-bold underline" style={{ color: THEME.gold }}>games to play alone</Link>,{' '}
            <Link to="/all-games" className="font-bold underline" style={{ color: THEME.gold }}>every game in the hub</Link>, or{' '}
            <Link to="/office-games" className="font-bold underline" style={{ color: THEME.gold }}>games for work</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
