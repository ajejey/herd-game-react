import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FiShare2, FiCheck, FiDownload, FiRotateCcw } from 'react-icons/fi';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import { THEME, FREDOKA, QUICKSAND, TARGET_PCT, rankFor } from './aimData';
import { useAimTrainer } from './useAimTrainer';
import { buildShareText, buildAimCard } from './share';
import { shareCardOrText, downloadFile } from '../../lib/shareCard';

const CANONICAL = 'https://herdgamesonline.com/aim-trainer';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Aim Trainer',
      alternateName: ['Aim test', 'Click accuracy test', 'Target practice game'],
      url: CANONICAL,
      description: 'A free aim trainer. Hit 30 targets as fast as you can and get your average time per target. No signup or download.',
      image: OG,
      genre: ['Reflex', 'Test', 'Single player'],
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
  { q: 'How does the aim trainer work?', a: 'Thirty targets appear one at a time, each in a random spot. Hit one and the next appears immediately. Your score is the average time per target, so lower is better.' },
  { q: 'What is a good average?', a: 'Most people land between 650 and 800 milliseconds. Under 500 is very quick, and under 400 is competitive-shooter territory.' },
  { q: 'Does the first click count?', a: 'It starts the clock but is not counted, so however long you spend reading this page does not end up in your score.' },
  { q: 'Is a mouse better than a phone?', a: 'Usually, yes — a mouse and a larger screen both help. Compare phone scores with phone scores if you want a fair fight.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function AimTrainer() {
  const g = useAimTrainer();
  const [copied, setCopied] = useState(false);

  const doShare = async () => {
    const file = await buildAimCard(g.avg, g.isNewBest);
    const res = await shareCardOrText(file, buildShareText(g.avg, g.isNewBest), 'Aim Trainer');
    if (res === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>Aim Trainer — Free Online Click Accuracy Test (No Download)</title>
        <meta name="description" content="Free aim trainer. Hit 30 targets as fast as you can and get your average time per target. Most people manage 650 to 800ms. No signup, no download." />
        <meta name="keywords" content="aim trainer, aim test, click accuracy test, target practice game, reflex game, free online games no download, single player games" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Aim Trainer — Free Online Click Accuracy Test" />
        <meta property="og:description" content="30 targets. Most people average 650-800ms. How fast are you?" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <Navigation />

      <div className="mx-auto max-w-md px-4 pb-16 pt-24">
        {g.status !== 'over' && (
          <div>
            <div className="text-center">
              <h1 style={FREDOKA} className="text-4xl font-bold leading-tight md:text-5xl">Aim Trainer</h1>
              <p style={QUICKSAND} className="mx-auto mt-3 max-w-md text-base md:text-lg">
                Hit {g.total} targets as fast as you can. Lower is better.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between" style={QUICKSAND}>
              <span className="text-lg font-bold" style={{ color: THEME.rose }}>
                {g.status === 'running' ? `${g.remaining} left` : `${g.total} targets`}
              </span>
              <span className="text-base font-bold" style={{ color: THEME.mut }}>
                {/* "lower is better" is already in the subtitle — repeating it
                    here just spends a line saying nothing new. */}
                {g.best > 0 ? <>best {g.best}ms</> : <>no best yet</>}
              </span>
            </div>

            <div
              data-testid="aim-board"
              style={{
                background: THEME.bgAlt,
                borderColor: THEME.border,
                touchAction: 'manipulation',
                userSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
              className="relative mt-3 aspect-square w-full overflow-hidden rounded-3xl border-[3px]"
            >
              {g.status === 'idle' && (
                <p
                  style={{ ...QUICKSAND, color: THEME.ink }}
                  className="pointer-events-none absolute inset-x-0 top-6 text-center text-lg font-bold"
                >
                  Hit the first target to start
                </p>
              )}
              <button
                data-testid="aim-target"
                onPointerDown={g.hit}
                aria-label={g.status === 'idle' ? 'Start — hit the target' : `Target, ${g.remaining} left`}
                style={{
                  position: 'absolute',
                  left: `${g.spot.x}%`,
                  top: `${g.spot.y}%`,
                  width: `${TARGET_PCT}%`,
                  height: `${TARGET_PCT}%`,
                  transform: 'translate(-50%, -50%)',
                  background: THEME.rose,
                  touchAction: 'manipulation',
                }}
                className="rounded-full ring-4 ring-white/60 transition-transform active:scale-90"
              />
            </div>

            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-4 text-center text-base">
              Most people average 650–800ms per target
            </p>
          </div>
        )}

        {g.status === 'over' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-base uppercase tracking-widest">Average per target</p>
            <p data-testid="aim-avg" style={{ ...FREDOKA, color: THEME.rose }} className="my-1 text-7xl font-bold md:text-8xl">{g.avg}</p>
            <p data-testid="aim-result" style={QUICKSAND} className="text-lg">milliseconds</p>
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-2">across {g.total} targets</p>

            {(() => { const r = rankFor(g.avg); return (
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
                style={{ ...FREDOKA, background: THEME.rose }}
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
              >
                <FiRotateCcw aria-hidden="true" /> Try again
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={doShare}
                  style={{ ...QUICKSAND, borderColor: THEME.rose, color: THEME.rose }}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 font-bold"
                >
                  {copied ? <><FiCheck aria-hidden="true" /> Copied</> : <><FiShare2 aria-hidden="true" /> Share</>}
                </button>
                <button
                  onClick={async () => downloadFile(await buildAimCard(g.avg, g.isNewBest))}
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
          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">How the aim trainer works</h2>
          <p style={{ color: THEME.mut }} className="mb-4">
            Thirty targets appear one after another, each in a random spot inside the board. Hit one and the
            next appears immediately. Your score is the average time per target, so unlike almost every other
            test here, a <strong>lower</strong> number is a better one.
          </p>
          <p style={{ color: THEME.mut }} className="mb-6">
            The first hit only starts the clock and is not counted, so reading this page costs you nothing.
            Most people average somewhere between 650 and 800 milliseconds. The usual advice is to start
            moving towards the next target before you have finished thinking about it — hesitation costs far
            more than imprecision.
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
            More to play: <Link to="/reaction-time-test" className="font-bold underline" style={{ color: THEME.rose }}>Reaction Time Test</Link>,{' '}
            <Link to="/click-speed-test" className="font-bold underline" style={{ color: THEME.rose }}>Click Speed Test</Link>, or{' '}
            <Link to="/solo-games" className="font-bold underline" style={{ color: THEME.rose }}>all solo games</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
