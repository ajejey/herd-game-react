import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FiShare2, FiCheck, FiDownload, FiRotateCcw } from 'react-icons/fi';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import { THEME, FREDOKA, QUICKSAND, rankFor } from './clickData';
import { useClickSpeed } from './useClickSpeed';
import { buildShareText, buildClickCard } from './share';
import { shareCardOrText, downloadFile } from '../../lib/shareCard';

const CANONICAL = 'https://herdgamesonline.com/click-speed-test';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Click Speed Test',
      alternateName: ['CPS test', 'Clicks per second test', 'Click test'],
      url: CANONICAL,
      description: 'A free 5 second click speed test. Click as fast as you can and get your clicks per second. No signup or download.',
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
  { q: 'What is a good CPS score?', a: 'Most people land between 5 and 7 clicks per second. Above 8 is genuinely quick, and scores past 10 usually mean a technique like butterfly clicking rather than ordinary tapping.' },
  { q: 'How long is the test?', a: 'Five seconds, which is the length other click speed tests use so your score is comparable. The clock starts on your first click and that click counts.' },
  { q: 'Does it work on a phone?', a: 'Yes — tap instead of click. Most people score a little higher on a phone using two thumbs, so compare phone scores with phone scores.' },
  { q: 'What is butterfly clicking?', a: 'Alternating two fingers on the same mouse button to roughly double your rate. It is a real technique, it is not cheating here, and it is where most very high scores come from.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function ClickSpeedTest() {
  const g = useClickSpeed();
  const [copied, setCopied] = useState(false);

  const doShare = async () => {
    const file = await buildClickCard(g.cps, g.clicks, g.isNewBest);
    const res = await shareCardOrText(file, buildShareText(g.cps, g.clicks, g.isNewBest), 'Click Speed Test');
    if (res === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>Click Speed Test — Free 5 Second CPS Test (No Download)</title>
        <meta name="description" content="Free click speed test. Click as fast as you can for 5 seconds and get your clicks per second. Most people manage 5 to 7 CPS. No signup, no download." />
        <meta name="keywords" content="click speed test, cps test, clicks per second, click test, fast clicking game, free online games no download, single player games" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Click Speed Test — Free 5 Second CPS Test" />
        <meta property="og:description" content="Most people manage 5 to 7 clicks per second. What can you do?" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <Navigation />

      <div className="mx-auto max-w-md px-4 pb-16 pt-24">
        {g.status !== 'over' && (
          <div className="text-center">
            <h1 style={FREDOKA} className="text-4xl font-bold leading-tight md:text-5xl">Click Speed Test</h1>
            <p style={QUICKSAND} className="mx-auto mt-3 max-w-md text-base md:text-lg">
              Click as fast as you can for {g.duration} seconds. The clock starts on your first click.
            </p>

            <button
              // pointerdown, not click: it fires once per tap on both mouse and
              // touch and skips the delay a click event waits out on mobile.
              onPointerDown={g.hit}
              data-testid="click-pad"
              aria-label={g.status === 'idle' ? 'Click to start the test' : `Click pad, ${g.clicks} clicks so far`}
              style={{
                ...FREDOKA,
                background: g.status === 'running' ? THEME.orange : THEME.bgAlt,
                color: g.status === 'running' ? '#FFFFFF' : THEME.ink,
                borderColor: THEME.orange,
                // Without these, fast repeat tapping selects text and triggers
                // the browser's double-tap-to-zoom, which ruins the score.
                touchAction: 'manipulation',
                userSelect: 'none',
                WebkitTapHighlightColor: 'transparent',
              }}
              className="mt-8 flex h-72 w-full flex-col items-center justify-center rounded-3xl border-[4px] transition-colors active:scale-[0.99]"
            >
              {g.status === 'idle' ? (
                <>
                  <span className="text-3xl font-bold">Click to start</span>
                  <span style={{ ...QUICKSAND, color: THEME.mut }} className="mt-2 text-base font-bold">
                    {g.duration} seconds
                  </span>
                </>
              ) : (
                <>
                  <span className="text-7xl font-bold">{g.clicks}</span>
                  <span style={QUICKSAND} className="mt-1 text-lg font-bold">clicks</span>
                  <span style={QUICKSAND} className="mt-4 text-3xl font-bold" role="timer" aria-live="off">
                    {g.secondsLeft}s
                  </span>
                </>
              )}
            </button>

            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-4 text-base">
              Most people manage 5 to 7 per second
              {g.best > 0 && <> · your best: <strong style={{ color: THEME.orange }}>{g.best}</strong></>}
            </p>
          </div>
        )}

        {g.status === 'over' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-base uppercase tracking-widest">Your speed</p>
            <p data-testid="cps-value" style={{ ...FREDOKA, color: THEME.orange }} className="my-1 text-7xl font-bold md:text-8xl">{g.cps}</p>
            <p data-testid="cps-result" style={QUICKSAND} className="text-lg">clicks per second</p>
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-2">
              {g.clicks} clicks in {g.duration} seconds
            </p>

            {(() => { const r = rankFor(g.cps); return (
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
                style={{ ...FREDOKA, background: THEME.orange }}
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
              >
                <FiRotateCcw aria-hidden="true" /> Try again
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={doShare}
                  style={{ ...QUICKSAND, borderColor: THEME.orange, color: THEME.orange }}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 font-bold"
                >
                  {copied ? <><FiCheck aria-hidden="true" /> Copied</> : <><FiShare2 aria-hidden="true" /> Share</>}
                </button>
                <button
                  onClick={async () => downloadFile(await buildClickCard(g.cps, g.clicks, g.isNewBest))}
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
          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">How the click speed test works</h2>
          <p style={{ color: THEME.mut }} className="mb-4">
            Click or tap the pad as fast as you can. The clock starts the moment you make the first click —
            and that one counts — then runs for five seconds. Your score is clicks per second, which is simply
            the total divided by five.
          </p>
          <p style={{ color: THEME.mut }} className="mb-6">
            Most people sit between 5 and 7. If you want to go higher, the usual trick is to stop using one
            finger: alternating two fingers on the same button, sometimes called butterfly clicking, roughly
            doubles the rate. On a phone, two thumbs does the same job.
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
            More to play: <Link to="/reaction-time-test" className="font-bold underline" style={{ color: THEME.orange }}>Reaction Time Test</Link>,{' '}
            <Link to="/typing-test" className="font-bold underline" style={{ color: THEME.orange }}>Typing Speed Test</Link>, or{' '}
            <Link to="/solo-games" className="font-bold underline" style={{ color: THEME.orange }}>all solo games</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
