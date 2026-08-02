import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FiShare2, FiCheck, FiDownload, FiRotateCcw, FiHeart } from 'react-icons/fi';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import { THEME, FREDOKA, QUICKSAND, WORD_COUNT, rankFor } from './verbalData';
import { useVerbalMemory } from './useVerbalMemory';
import { buildShareText, buildVerbalCard } from './share';
import { shareCardOrText, downloadFile } from '../../lib/shareCard';

const CANONICAL = 'https://herdgamesonline.com/verbal-memory-test';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Verbal Memory Test',
      alternateName: ['Word memory test', 'Verbal recognition test'],
      url: CANONICAL,
      description: 'A free verbal memory test. Words appear one at a time — say whether you have seen each one already or it is new. The list keeps growing. No signup or download.',
      image: OG,
      genre: ['Memory', 'Word', 'Single player'],
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
  { q: 'How does the verbal memory test work?', a: 'A word appears. Say SEEN if it has already come up in this run, or NEW if it has not. Every word you are shown joins the list, so the list you are holding in your head keeps growing.' },
  { q: 'What is a good score?', a: 'Most runs end somewhere between 15 and 30. Fifty is sharp, and getting near a hundred is genuinely rare.' },
  { q: 'How is this different from the number memory test?', a: 'Number memory asks you to recall something exactly. This asks you to recognise it, which is a different and much longer-lasting kind of memory — and the difficulty comes from the list growing, not the words getting harder.' },
  { q: 'Any tips?', a: 'Do not try to hold a list. Most people who do well say they get a feeling of familiarity from a word and trust it, which is faster and more reliable than searching your memory each time.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function VerbalMemory() {
  const g = useVerbalMemory();
  const [copied, setCopied] = useState(false);

  const doShare = async () => {
    const file = await buildVerbalCard(g.score, g.isNewBest);
    const res = await shareCardOrText(file, buildShareText(g.score, g.isNewBest), 'Verbal Memory Test');
    if (res === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>Verbal Memory Test — Free Word Memory Game (No Download)</title>
        <meta name="description" content="Free verbal memory test. Words appear one at a time — say whether you have seen each one already or it is new. The list keeps growing. Most runs end around 25." />
        <meta name="keywords" content="verbal memory test, word memory test, memory test online, recognition memory, brain game, free online games no download, single player games" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Verbal Memory Test — Free Word Memory Game" />
        <meta property="og:description" content="Seen it before, or new? The list keeps growing." />
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
            <h1 style={FREDOKA} className="text-4xl font-bold leading-tight md:text-5xl">Verbal Memory Test</h1>
            <p style={QUICKSAND} className="mx-auto mt-4 max-w-md text-base md:text-lg">
              A word appears. Have you seen it already in this run, or is it new?
              The list keeps growing.
            </p>
            <button
              onClick={g.start}
              style={{ ...FREDOKA, background: THEME.teal }}
              className="mt-8 rounded-2xl px-10 py-4 text-xl font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Start the test
            </button>
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-4 text-sm">
              Most runs end around 25
              {g.best > 0 && <> · your best: <strong style={{ color: THEME.teal }}>{g.best}</strong></>}
            </p>
          </div>
        )}

        {g.status === 'playing' && g.current && (
          <div>
            <div className="mb-6 flex items-center justify-between" style={QUICKSAND}>
              <span data-testid="vb-score" className="text-sm font-bold" style={{ color: THEME.mut }}>
                Score {g.score}{g.best > 0 && <> · best {g.best}</>}
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
              style={{
                background: THEME.bgAlt,
                borderColor: g.flash === 'right' ? THEME.green : g.flash === 'wrong' ? THEME.red : THEME.border,
              }}
              className="flex min-h-[9rem] items-center justify-center rounded-3xl border-[3px] p-6 transition-colors"
            >
              <p
                data-testid="vb-word"
                style={{ ...FREDOKA, color: THEME.ink }}
                className="break-all text-center text-4xl font-bold md:text-5xl"
              >
                {g.current.word}
              </p>
            </div>

            {/* Both answers get IDENTICAL visual weight. A solid button beside
                an outlined one reads as primary-and-secondary, which is a nudge
                towards one answer — and in a two-way test where the honest
                split is close to even, that nudge is a thumb on the scale. */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => g.answer(true)}
                data-testid="vb-seen"
                style={{ ...FREDOKA, borderColor: THEME.teal, color: THEME.teal, background: THEME.bgAlt }}
                className="rounded-2xl border-[3px] py-5 text-xl font-bold active:scale-[0.98]"
              >
                SEEN
              </button>
              <button
                onClick={() => g.answer(false)}
                data-testid="vb-new"
                style={{ ...FREDOKA, borderColor: THEME.ink, color: THEME.ink, background: THEME.bgAlt }}
                className="rounded-2xl border-[3px] py-5 text-xl font-bold active:scale-[0.98]"
              >
                NEW
              </button>
            </div>

            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-4 text-center text-sm">
              SEEN if it has already come up this run
            </p>
          </div>
        )}

        {g.status === 'over' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-sm uppercase tracking-widest">You got</p>
            <p style={{ ...FREDOKA, color: THEME.teal }} className="my-1 text-7xl font-bold md:text-8xl">{g.score}</p>
            <p style={QUICKSAND} className="text-lg">words</p>

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
                style={{ ...FREDOKA, background: THEME.teal }}
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
              >
                <FiRotateCcw aria-hidden="true" /> Try again
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
                  onClick={async () => downloadFile(await buildVerbalCard(g.score, g.isNewBest))}
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
          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">How the verbal memory test works</h2>
          <p style={{ color: THEME.mut }} className="mb-4">
            One word appears at a time, drawn from a bank of {WORD_COUNT}. Answer SEEN if that word has
            already come up during this run, or NEW if it has not. Every word you are shown joins the list,
            so what you are holding in your head keeps getting longer. Three wrong answers end the run.
          </p>
          <p style={{ color: THEME.mut }} className="mb-6">
            This is recognition memory rather than recall — you are not asked to produce anything, only to
            know whether you have met a word before. Most runs end somewhere between 15 and 30. People who do
            well tend to describe trusting a feeling of familiarity rather than searching a list, which is
            both faster and, oddly, more accurate.
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
            More to play: <Link to="/number-memory-test" className="font-bold underline" style={{ color: THEME.teal }}>Number Memory Test</Link>,{' '}
            <Link to="/visual-memory-test" className="font-bold underline" style={{ color: THEME.teal }}>Visual Memory Test</Link>, or{' '}
            <Link to="/solo-games" className="font-bold underline" style={{ color: THEME.teal }}>all solo games</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
