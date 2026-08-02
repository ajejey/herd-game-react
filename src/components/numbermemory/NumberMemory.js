import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FiShare2, FiCheck, FiDownload, FiRotateCcw, FiHeart } from 'react-icons/fi';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import { THEME, FREDOKA, QUICKSAND, rankFor, showMsFor } from './numberData';
import { useNumberMemory } from './useNumberMemory';
import { buildShareText, buildNumberCard } from './share';
import { shareCardOrText, downloadFile } from '../../lib/shareCard';

const CANONICAL = 'https://herdgamesonline.com/number-memory-test';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Number Memory Test',
      alternateName: ['Digit span test', 'Number memory game', 'Memory span test'],
      url: CANONICAL,
      description: 'A free number memory test. A number flashes on screen, then you type it back from memory. One more digit every round. Most people stop around seven. No signup or download.',
      image: OG,
      genre: ['Memory', 'Test', 'Single player'],
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
  { q: 'What is the number memory test?', a: 'A number appears for a few seconds, then disappears and you type it back. Get it right and the next number is one digit longer. You get three lives, and a failed round can be retried.' },
  { q: 'How many digits can most people remember?', a: 'About seven. That figure comes from a well-known 1956 paper by George Miller on the span of short-term memory, and it is roughly why phone numbers ended up the length they are.' },
  { q: 'How do I get a higher score?', a: 'Chunking. Nobody holds twelve separate digits, but "four-nine-two" as one lump is a single thing to remember. Saying the digits out loud as they appear also helps most people.' },
  { q: 'How is this different from the chimp test?', a: 'This is verbal memory — what the digits were. The chimp test is spatial memory — where they were. People are often much better at one than the other.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function NumberMemory() {
  const g = useNumberMemory();
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (g.status === 'recall') inputRef.current?.focus();
  }, [g.status]);

  const doShare = async () => {
    const file = await buildNumberCard(g.reached, g.isNewBest);
    const res = await shareCardOrText(file, buildShareText(g.reached, g.isNewBest), 'Number Memory Test');
    if (res === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const active = ['show', 'recall', 'right', 'wrong'].includes(g.status);

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>Number Memory Test — Free Digit Span Test (No Download)</title>
        <meta name="description" content="Free number memory test. A number flashes on screen, then you type it back from memory — one more digit every round. Most people stop around seven. No signup or download." />
        <meta name="keywords" content="number memory test, digit span test, memory test online, short term memory test, brain game, free online games no download, single player games" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Number Memory Test — Free Digit Span Test" />
        <meta property="og:description" content="Most people stop at seven digits. How far do you get?" />
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
            <h1 style={FREDOKA} className="text-4xl font-bold leading-tight md:text-5xl">Number Memory Test</h1>
            <p style={QUICKSAND} className="mx-auto mt-4 max-w-md text-base md:text-lg">
              A number appears, then vanishes. Type it back from memory.
              One more digit every round.
            </p>
            <button
              onClick={g.start}
              style={{ ...FREDOKA, background: THEME.blue }}
              className="mt-8 rounded-2xl px-10 py-4 text-xl font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Take the test
            </button>
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-4 text-sm">
              Most people stop around 7
              {g.best > 0 && <> · your best: <strong style={{ color: THEME.blue }}>{g.best}</strong></>}
            </p>
          </div>
        )}

        {active && (
          <div>
            <div className="mb-6 flex items-center justify-between" style={QUICKSAND}>
              <span className="text-sm font-bold" style={{ color: THEME.mut }}>
                {g.digits} digits{g.best > 0 && <> · best {g.best}</>}
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
              style={{ background: THEME.bgAlt, borderColor: THEME.border }}
              className="flex min-h-[10rem] flex-col items-center justify-center rounded-3xl border-[3px] p-6"
            >
              {g.status === 'show' && (
                <>
                  <p
                    data-testid="the-number"
                    style={{ ...FREDOKA, color: THEME.blue, letterSpacing: '0.08em' }}
                    className="break-all text-center text-5xl font-bold md:text-6xl"
                  >
                    {g.number}
                  </p>
                  <div style={{ background: THEME.border }} className="mt-5 h-2 w-full overflow-hidden rounded-full">
                    <motion.div
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: showMsFor(g.digits) / 1000, ease: 'linear' }}
                      style={{ background: THEME.blue }}
                      className="h-full"
                    />
                  </div>
                </>
              )}

              {g.status === 'recall' && (
                <>
                  <p style={{ ...QUICKSAND, color: THEME.mut }} className="mb-3 text-sm font-bold uppercase tracking-widest">
                    What was the number?
                  </p>
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={g.entry}
                    onChange={(e) => g.onEntry(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') g.submit(); }}
                    data-testid="number-input"
                    aria-label="Type the number you saw"
                    autoComplete="off"
                    style={{
                      ...FREDOKA,
                      background: THEME.bg,
                      borderColor: THEME.blue,
                      color: THEME.ink,
                      letterSpacing: '0.08em',
                    }}
                    className="w-full rounded-2xl border-[3px] px-4 py-3 text-center text-3xl font-bold outline-none"
                  />
                </>
              )}

              {g.status === 'right' && (
                <p role="status" style={{ ...FREDOKA, color: THEME.green }} className="text-3xl font-bold">Correct!</p>
              )}

              {g.status === 'wrong' && (
                <div role="status" className="text-center">
                  <p style={{ ...FREDOKA, color: THEME.red }} className="text-2xl font-bold">Not quite</p>
                  <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-3 text-sm">It was</p>
                  <p style={{ ...FREDOKA, color: THEME.ink, letterSpacing: '0.08em' }} className="break-all text-2xl font-bold">
                    {g.number}
                  </p>
                  <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-2 text-sm">
                    you typed {g.entry || '—'}
                  </p>
                </div>
              )}
            </div>

            {g.status === 'recall' && (
              <button
                onClick={g.submit}
                disabled={!g.entry}
                style={{ ...FREDOKA, background: g.entry ? THEME.blue : THEME.border, color: g.entry ? '#FFFFFF' : THEME.mut }}
                className="mt-4 w-full rounded-2xl py-4 text-lg font-bold active:scale-[0.98] disabled:cursor-not-allowed"
              >
                Submit
              </button>
            )}
          </div>
        )}

        {g.status === 'over' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-sm uppercase tracking-widest">You reached</p>
            <p style={{ ...FREDOKA, color: THEME.blue }} className="my-1 text-7xl font-bold md:text-8xl">{g.reached}</p>
            <p style={QUICKSAND} className="text-lg">digits</p>

            {(() => { const r = rankFor(g.reached); return (
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
                style={{ ...FREDOKA, background: THEME.blue }}
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
              >
                <FiRotateCcw aria-hidden="true" /> Try again
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
                  onClick={async () => downloadFile(await buildNumberCard(g.reached, g.isNewBest))}
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
          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">How the number memory test works</h2>
          <p style={{ color: THEME.mut }} className="mb-4">
            A number appears on screen for a few seconds, then disappears, and you type it back. Get it right
            and the next number gains a digit. Longer numbers stay on screen longer, so what is being measured
            stays memory rather than reading speed.
          </p>
          <p style={{ color: THEME.mut }} className="mb-6">
            Most people manage around seven digits. That number comes from George Miller's 1956 paper on the
            span of short-term memory, and it is roughly why phone numbers settled at the length they did.
            Getting past it is usually about chunking: nobody holds twelve separate digits, but a handful of
            three-digit lumps is a different matter.
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
            More to play: <Link to="/chimp-test" className="font-bold underline" style={{ color: THEME.blue }}>Chimp Test</Link>,{' '}
            <Link to="/memory-game" className="font-bold underline" style={{ color: THEME.blue }}>Herd Memory</Link>, or{' '}
            <Link to="/solo-games" className="font-bold underline" style={{ color: THEME.blue }}>all solo games</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
