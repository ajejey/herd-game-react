import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShare2, FiCheck, FiDownload, FiArrowUp, FiArrowDown, FiRotateCcw, FiGrid } from 'react-icons/fi';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import { THEME, HEAVY, BODY, rankFor } from './hlData';
import { useHigherLower } from './useHigherLower';
import { buildShareText, buildHigherLowerCard } from './share';
import { shareCardOrText, downloadFile } from '../../lib/shareCard';

const CANONICAL = 'https://herdgamesonline.com/higher-or-lower';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Higher or Lower',
      alternateName: ['Higher lower game', 'Higher or lower quiz', 'Which is bigger game'],
      url: CANONICAL,
      description: 'A free endless Higher or Lower game. Guess whether the next country, animal, building or movie is higher or lower, and build the longest streak you can. Single player, no signup, no download.',
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
  { q: 'What is the Higher or Lower game?', a: 'Higher or Lower is a free guessing game. You see one item with its value revealed and a second item hidden, and you guess whether the hidden one is higher or lower. Every correct guess extends your streak; one wrong guess ends the run.' },
  { q: 'Is it free to play?', a: 'Yes, completely free. No signup, no download, no app. It runs in your browser on phone or laptop, and your best streak is saved on your device.' },
  { q: 'Can I play Higher or Lower alone?', a: 'Yes, it is a single player game you can play as many times as you like. There is no daily limit, so you can keep going until you beat your best streak.' },
  { q: 'What categories can I play?', a: 'Country population, city population, building height, mountain height, river length, movie release year, animal top speed and animal lifespan. Each run stays in one category so every comparison uses the same unit and is always fair.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

/* A single item panel. `reveal` shows the value; otherwise it stays a "?".
   Heights are deliberately tight on mobile: both panels plus the Higher/Lower
   buttons must fit in one phone screen, or the primary action sits below the
   fold (caught in mobile testing). */
function Panel({ item, reveal, label, unitFmt, tone }) {
  if (!item) return null;
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5 py-4 md:py-12 text-center min-h-[22vh] md:min-h-[46vh]">
      {item.e && <div className="text-4xl md:text-7xl mb-2" aria-hidden="true">{item.e}</div>}
      <h2 style={HEAVY} className="text-2xl md:text-4xl leading-tight" >{item.n}</h2>
      <p style={BODY} className="mt-1 text-sm md:text-base" >{label}</p>
      <div className="mt-3 h-[56px] md:h-[80px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {reveal ? (
            <motion.div
              key="val"
              initial={{ opacity: 0, y: 12, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              style={{ ...HEAVY, color: tone }}
              className="text-3xl md:text-5xl"
            >
              {unitFmt(item.v)}
            </motion.div>
          ) : (
            <motion.div key="q" style={{ ...HEAVY, color: THEME.mut }} className="text-4xl md:text-6xl">?</motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function HigherLower() {
  const g = useHigherLower();
  const [copied, setCopied] = useState(false);

  const doShare = async () => {
    const label = g.category?.label || '';
    const file = await buildHigherLowerCard(g.score, label, g.isNewBest);
    const text = buildShareText(g.score, label, g.isNewBest);
    const res = await shareCardOrText(file, text, 'Higher or Lower');
    if (res === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const doDownload = async () => {
    downloadFile(await buildHigherLowerCard(g.score, g.category?.label || '', g.isNewBest));
  };

  const revealChallenger = g.status === 'reveal' || g.status === 'over';
  const tone = g.lastCorrect === null ? THEME.hot : g.lastCorrect ? THEME.win : THEME.lose;

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>Higher or Lower — Free Endless Guessing Game (No Download)</title>
        <meta name="description" content="Play Higher or Lower free online. Guess if the next country, animal, building or movie is higher or lower and build your longest streak. Single player, endless, no signup or download." />
        <meta name="keywords" content="higher or lower game, higher lower, guessing game, single player games, games to play alone, free online games no download, streak game" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Higher or Lower — Free Endless Guessing Game" />
        <meta property="og:description" content="One life, endless streak. How far can you get?" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <Navigation />

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        {/* ---------- MENU ---------- */}
        {g.status === 'menu' && (
          <div className="text-center">
            <h1 style={HEAVY} className="text-4xl md:text-6xl mb-3">Higher or Lower</h1>
            <p style={BODY} className="text-base md:text-lg mb-8" >
              One life. Endless streak. Pick a category and see how far you get.
            </p>
            <div className="grid gap-3 sm:grid-cols-2 max-w-xl mx-auto">
              {g.categories.map((c) => {
                const best = g.allBest[c.id] || 0;
                return (
                  <button
                    key={c.id}
                    onClick={() => g.start(c.id)}
                    style={{ background: THEME.bgAlt, borderColor: THEME.border }}
                    className="rounded-2xl border-2 p-5 text-left transition-transform hover:-translate-y-0.5 hover:border-[#3D8B5A] focus:outline-none focus:ring-2 focus:ring-[#3D8B5A]"
                  >
                    <p style={HEAVY} className="text-xl">{c.label}</p>
                    <p style={{ ...BODY, color: THEME.mut }} className="text-sm mt-1">{c.question}</p>
                    {best > 0 && (
                      <p style={{ ...BODY, color: THEME.hot }} className="text-sm mt-2 font-bold">Best streak: {best}</p>
                    )}
                  </button>
                );
              })}
            </div>
            <p style={{ ...BODY, color: THEME.mut }} className="mt-8 text-sm">
              Free, no signup. Want something with friends?{' '}
              <Link to="/" className="underline" style={{ color: THEME.hot }}>Browse the hub</Link>.
            </p>
          </div>
        )}

        {/* ---------- PLAYING / REVEAL ---------- */}
        {(g.status === 'playing' || g.status === 'reveal') && (
          <>
            <div className="flex items-center justify-between mb-4">
              <button onClick={g.toMenu} style={{ ...BODY, color: THEME.mut }} className="text-sm underline">
                ← Categories
              </button>
              <div className="text-right">
                <p style={{ ...HEAVY, color: THEME.hot }} className="text-2xl leading-none">{g.score}</p>
                <p style={{ ...BODY, color: THEME.mut }} className="text-xs">streak{g.best ? ` · best ${g.best}` : ''}</p>
              </div>
            </div>

            <div
              style={{ background: THEME.bgAlt, borderColor: THEME.border }}
              className="rounded-3xl border-2 overflow-hidden flex flex-col md:flex-row md:items-stretch relative"
            >
              <Panel item={g.anchor} reveal label={g.category.label} unitFmt={g.category.fmt} tone={THEME.hot} />

              <div
                className="md:w-px md:h-auto h-px w-full self-stretch"
                style={{ background: THEME.border }}
                aria-hidden="true"
              />

              <div className="flex-1 flex flex-col">
                <Panel item={g.challenger} reveal={revealChallenger} label={g.category.label} unitFmt={g.category.fmt} tone={tone} />

                {g.status === 'playing' && (
                  <div className="px-5 pb-6 grid grid-cols-2 gap-3">
                    <button
                      onClick={() => g.guess('higher')}
                      style={{ background: THEME.hot, color: '#FFFFFF', ...HEAVY }}
                      className="rounded-2xl py-4 text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                    >
                      <FiArrowUp aria-hidden="true" /> Higher
                    </button>
                    <button
                      onClick={() => g.guess('lower')}
                      style={{ background: 'transparent', color: THEME.hot, borderColor: THEME.hot, ...HEAVY }}
                      className="rounded-2xl py-4 text-lg border-2 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                    >
                      <FiArrowDown aria-hidden="true" /> Lower
                    </button>
                  </div>
                )}

                {g.status === 'reveal' && (
                  <div className="px-5 pb-6 text-center" role="status" aria-live="polite">
                    <p style={{ ...HEAVY, color: tone }} className="text-2xl">
                      {g.lastCorrect ? 'Correct!' : 'Wrong — run over'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <p style={{ ...BODY, color: THEME.mut }} className="text-center text-sm mt-5">
              Is <strong style={{ color: THEME.ink }}>{g.challenger?.n}</strong> higher or lower than{' '}
              <strong style={{ color: THEME.ink }}>{g.anchor?.n}</strong>?
            </p>
          </>
        )}

        {/* ---------- GAME OVER ---------- */}
        {g.status === 'over' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            {(() => { const r = rankFor(g.score); return (
              <>
                <div className="text-6xl mb-2" aria-hidden="true">{r.e}</div>
                <p style={{ ...BODY, color: THEME.mut }} className="text-sm uppercase tracking-widest">Final streak</p>
                <p style={{ ...HEAVY, color: THEME.hot }} className="text-7xl md:text-8xl leading-none my-2">{g.score}</p>
                <p style={HEAVY} className="text-2xl">{r.label}</p>
                {g.isNewBest && (
                  <p style={{ ...HEAVY, color: THEME.win }} className="mt-2 text-lg">New personal best!</p>
                )}
                {!g.isNewBest && g.best > g.score && (
                  <p style={{ ...BODY, color: THEME.mut }} className="mt-2">Your best is {g.best} — go again?</p>
                )}
              </>
            ); })()}

            <div className="mt-8 grid gap-3 max-w-sm mx-auto">
              <button
                onClick={g.playAgain}
                style={{ background: THEME.hot, color: '#FFFFFF', ...HEAVY }}
                className="rounded-2xl py-4 text-lg flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              >
                <FiRotateCcw aria-hidden="true" /> Play again
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={doShare}
                  style={{ color: THEME.hot, borderColor: THEME.hot, ...BODY }}
                  className="rounded-2xl py-3 border-2 font-bold flex items-center justify-center gap-2"
                >
                  {copied ? <><FiCheck aria-hidden="true" /> Copied</> : <><FiShare2 aria-hidden="true" /> Challenge a friend</>}
                </button>
                <button
                  onClick={doDownload}
                  style={{ color: THEME.mut, borderColor: THEME.border, ...BODY }}
                  className="rounded-2xl py-3 border-2 font-bold flex items-center justify-center gap-2"
                >
                  <FiDownload aria-hidden="true" /> Image
                </button>
              </div>
              <button onClick={g.toMenu} style={{ ...BODY, color: THEME.mut }} className="text-sm underline mt-1 flex items-center justify-center gap-2">
                <FiGrid aria-hidden="true" /> Try another category
              </button>
            </div>
          </motion.div>
        )}

        <div className="mt-12"><AdSlot /></div>

        {/* SEO body copy — every game page carries a real answer to the query. */}
        <section className="mt-12" style={BODY}>
          <h2 style={HEAVY} className="text-2xl mb-3">How to play Higher or Lower</h2>
          <p style={{ color: THEME.mut }} className="mb-4">
            You are shown two things side by side. The left one has its value revealed; the right one is hidden.
            Decide whether the hidden value is <strong style={{ color: THEME.ink }}>higher</strong> or{' '}
            <strong style={{ color: THEME.ink }}>lower</strong>. Guess right and it slides across to become the new
            anchor, and your streak grows. Guess wrong and the run ends — so every answer counts.
          </p>
          <p style={{ color: THEME.mut }} className="mb-6">
            There is no daily limit and no signup. Play as many runs as you like, across{' '}
            {g.categories.length} categories, and try to beat your own best streak. It works on phone and laptop,
            and your best score is saved on your device.
          </p>

          <h2 style={HEAVY} className="text-2xl mb-3">Questions</h2>
          <div className="space-y-4">
            {FAQS.map(({ q, a }) => (
              <div key={q}>
                <h3 style={HEAVY} className="text-lg">{q}</h3>
                <p style={{ color: THEME.mut }} className="mt-1">{a}</p>
              </div>
            ))}
          </div>

          <p style={{ color: THEME.mut }} className="mt-8 text-sm">
            More to play: <Link to="/solo-games" className="underline" style={{ color: THEME.hot }}>solo games</Link>,{' '}
            <Link to="/trivia" className="underline" style={{ color: THEME.hot }}>Daily Trivia</Link>, or{' '}
            <Link to="/all-games" className="underline" style={{ color: THEME.hot }}>the full game hub</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
