import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FiShare2, FiCheck, FiDownload, FiRotateCcw } from 'react-icons/fi';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import { THEME, FREDOKA, QUICKSAND, ROUNDS, rankFor } from './reactionData';
import { useReactionTime } from './useReactionTime';
import { buildShareText, buildReactionCard } from './share';
import { shareCardOrText, downloadFile } from '../../lib/shareCard';

const CANONICAL = 'https://herdgamesonline.com/reaction-time-test';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Reaction Time Test',
      alternateName: ['Reaction time test', 'Reflex test', 'Click speed reaction game'],
      url: CANONICAL,
      description: 'A free reaction time test. Wait for the pasture to turn green, then tap as fast as you can. Five rounds gives your average reaction time in milliseconds. No signup or download.',
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
  { q: 'What is a good reaction time?', a: 'For a visual signal like this, most adults land between 200 and 300 milliseconds. Under 200ms is genuinely quick, and under 150ms usually means you guessed rather than reacted.' },
  { q: 'How does the test work?', a: 'The pad holds on "wait" for a random length of time, then turns green. You tap as soon as it does, and the gap is your reaction time. The random hold is what stops you timing it by rhythm. Five rounds are averaged.' },
  { q: 'Why did it say I was too early?', a: 'You tapped before the pad turned green, so there was nothing to react to. That round does not count and you can retry it — it is not a penalty.' },
  { q: 'Does the device affect my score?', a: 'A little. Touchscreens and high refresh rate screens generally measure slightly faster than a trackpad. Compare your times on the same device rather than against someone else on a different one.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

/* Pad colour + copy per state. The words carry the meaning, not just the
   colour — important for red/green colour blindness. */
const PAD = {
  waiting: { bg: THEME.wait, title: 'Wait…', sub: 'Tap the moment it turns green' },
  go: { bg: THEME.go, title: 'TAP!', sub: '' },
  early: { bg: THEME.early, title: 'Too early', sub: 'Tap to try that round again' },
  result: { bg: THEME.bgAlt, title: '', sub: '' },
};

export default function ReactionTime() {
  const g = useReactionTime();
  const [copied, setCopied] = useState(false);

  const doShare = async () => {
    const file = await buildReactionCard(g.average, g.isNewBest);
    const res = await shareCardOrText(file, buildShareText(g.average, g.isNewBest), 'Reaction Time Test');
    if (res === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const padState = PAD[g.status];
  const active = ['waiting', 'go', 'early', 'result'].includes(g.status);

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>Reaction Time Test — Free Online Reflex Test (No Download)</title>
        <meta name="description" content="Test your reaction time free online. Wait for green, then tap as fast as you can. Five rounds gives your average reaction time in milliseconds. No signup, no download, works on phone." />
        <meta name="keywords" content="reaction time test, reflex test, reaction speed test, how fast are your reflexes, free online games no download, single player games" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Reaction Time Test — Free Online Reflex Test" />
        <meta property="og:description" content="Wait for green. Tap fast. How quick are you really?" />
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
            <h1 style={FREDOKA} className="text-4xl font-bold leading-tight md:text-6xl">Reaction Time Test</h1>
            <p style={QUICKSAND} className="mx-auto mt-4 max-w-md text-base md:text-lg">
              The pasture holds, then turns green. Tap the instant it does.
              Five rounds, and you get your average in milliseconds.
            </p>
            <button
              onClick={g.start}
              style={{ ...FREDOKA, background: THEME.go }}
              className="mt-8 rounded-2xl px-10 py-4 text-xl font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Start the test
            </button>
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-4 text-sm">
              {ROUNDS} rounds · about 30 seconds
              {g.best > 0 && <> · your best average: <strong style={{ color: THEME.go }}>{g.best}ms</strong></>}
            </p>
          </div>
        )}

        {active && (
          <div>
            <div className="mb-4 flex items-center justify-between" style={QUICKSAND}>
              <span className="text-sm font-bold" style={{ color: THEME.mut }}>
                Round {Math.min(g.round + 1, g.roundsTotal)} of {g.roundsTotal}
              </span>
              {g.average > 0 && (
                <span className="text-sm font-bold" style={{ color: THEME.go }}>avg {g.average}ms</span>
              )}
            </div>

            {/* One big pad. Deliberately the whole interactive surface — on a
                phone you should not have to aim. */}
            <button
              onClick={g.tap}
              data-testid="reaction-pad"
              data-state={g.status}
              aria-live="polite"
              style={{ background: g.status === 'result' ? THEME.bgAlt : padState.bg, borderColor: THEME.border }}
              className="flex min-h-[46vh] w-full flex-col items-center justify-center rounded-3xl border-2 px-6 text-center transition-colors duration-100"
            >
              {g.status === 'result' ? (
                <>
                  <span style={{ ...QUICKSAND, color: THEME.mut }} className="text-sm uppercase tracking-widest">
                    That one took
                  </span>
                  <span style={{ ...FREDOKA, color: THEME.go }} className="text-6xl font-bold md:text-7xl">
                    {g.last}<span className="text-3xl">ms</span>
                  </span>
                  <span style={{ ...FREDOKA, color: THEME.ink }} className="mt-4 text-lg font-bold">
                    {g.round >= g.roundsTotal ? 'Tap for your result' : 'Tap for the next round'}
                  </span>
                </>
              ) : (
                <>
                  <span style={{ ...FREDOKA, color: '#FFFFFF' }} className="text-5xl font-bold md:text-6xl">
                    {padState.title}
                  </span>
                  {padState.sub && (
                    <span style={{ ...QUICKSAND, color: '#FFFFFF' }} className="mt-3 text-base opacity-90">
                      {padState.sub}
                    </span>
                  )}
                </>
              )}
            </button>

            {g.times.length > 0 && (
              <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-4 text-center text-sm">
                {g.times.map((t) => `${t}ms`).join(' · ')}
              </p>
            )}
          </div>
        )}

        {g.status === 'over' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-sm uppercase tracking-widest">
              Your average
            </p>
            <p style={{ ...FREDOKA, color: THEME.go }} className="my-1 text-7xl font-bold md:text-8xl">
              {g.average}<span className="text-4xl">ms</span>
            </p>

            {(() => { const r = rankFor(g.average); return (
              <>
                <p style={FREDOKA} className="mt-3 text-2xl font-bold">{r.label}</p>
                <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-1">{r.blurb}</p>
              </>
            ); })()}

            {g.isNewBest && (
              <p style={{ ...FREDOKA, color: THEME.pink }} className="mt-3 text-lg font-bold">New personal best!</p>
            )}
            {!g.isNewBest && g.best > 0 && (
              <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-2">Your best average is {g.best}ms.</p>
            )}

            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-4 text-sm">
              {g.times.map((t) => `${t}ms`).join(' · ')}
            </p>

            <div className="mx-auto mt-8 grid max-w-sm gap-3">
              <button
                onClick={g.playAgain}
                style={{ ...FREDOKA, background: THEME.go }}
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
              >
                <FiRotateCcw aria-hidden="true" /> Test again
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={doShare}
                  style={{ ...QUICKSAND, borderColor: THEME.go, color: THEME.go }}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 font-bold"
                >
                  {copied ? <><FiCheck aria-hidden="true" /> Copied</> : <><FiShare2 aria-hidden="true" /> Share</>}
                </button>
                <button
                  onClick={async () => downloadFile(await buildReactionCard(g.average, g.isNewBest))}
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
          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">How the reaction time test works</h2>
          <p style={{ color: THEME.mut }} className="mb-4">
            The pad holds on “wait” for a random length of time between roughly one and four seconds, then
            turns green. The moment it does, tap. The gap between the colour changing and your tap is your
            reaction time, measured in milliseconds. The hold is random on purpose — if it were a fixed
            delay you could learn the rhythm and anticipate it, which would measure your timing rather than
            your reflexes.
          </p>
          <p style={{ color: THEME.mut }} className="mb-6">
            Five rounds are averaged, because a single attempt is noisy. If you tap before the pad turns
            green that round simply does not count and you can retry it. Most adults average between 200 and
            300 milliseconds on a test like this.
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
            More to play: <Link to="/memory-game" className="font-bold underline" style={{ color: THEME.go }}>Herd Memory</Link>,{' '}
            <Link to="/odd-one-out" className="font-bold underline" style={{ color: THEME.go }}>Odd One Out</Link>, or{' '}
            <Link to="/solo-games" className="font-bold underline" style={{ color: THEME.go }}>all solo games</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
