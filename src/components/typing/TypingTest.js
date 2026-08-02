import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FiShare2, FiCheck, FiDownload, FiRotateCcw, FiClock } from 'react-icons/fi';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import { THEME, FREDOKA, QUICKSAND, rankFor } from './typingData';
import { useTypingTest } from './useTypingTest';
import { buildShareText, buildTypingCard } from './share';
import { shareCardOrText, downloadFile } from '../../lib/shareCard';

const CANONICAL = 'https://herdgamesonline.com/typing-test';
const OG = 'https://herdgamesonline.com/og-image.png';

const WINDOW = 18; // upcoming words kept on screen

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Typing Speed Test',
      alternateName: ['Typing test', 'WPM test', 'Words per minute test'],
      url: CANONICAL,
      description: 'A free one-minute typing speed test. Type the words as they appear and get your words per minute and accuracy. No signup or download.',
      image: OG,
      genre: ['Typing', 'Test', 'Single player'],
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
  { q: 'What is a good typing speed?', a: 'The average adult types around 40 words per minute. Sixty is comfortably quick, 80 is very fast, and anything past 100 is professional-transcriptionist territory.' },
  { q: 'How is WPM calculated?', a: 'One word counts as five characters, and only words you typed correctly count towards the total. That is the standard net WPM figure, and it means you cannot inflate your score by mashing keys.' },
  { q: 'When does the timer start?', a: 'On your first keystroke, not when the page loads. Take as long as you like to get comfortable before you begin.' },
  { q: 'Can I take the typing test on a phone?', a: 'Yes. It works with a phone keyboard, though almost everyone scores higher on a physical keyboard, so compare phone scores with phone scores.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function TypingTest() {
  const g = useTypingTest();
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  // Keep focus in the field for the whole run: a stray tap on the page would
  // otherwise close the phone keyboard mid-test with the clock still running.
  useEffect(() => {
    if (g.status !== 'over') inputRef.current?.focus();
  }, [g.status]);

  const doShare = async () => {
    const file = await buildTypingCard(g.wpm, g.accuracy, g.isNewBest);
    const res = await shareCardOrText(file, buildShareText(g.wpm, g.accuracy, g.isNewBest), 'Typing Test');
    if (res === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const upcoming = g.words.slice(g.wordIdx, g.wordIdx + WINDOW);
  const target = g.words[g.wordIdx] || '';
  const wrongSoFar = !target.startsWith(g.typed);

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>Typing Speed Test — Free 1 Minute WPM Test (No Signup)</title>
        <meta name="description" content="Free typing speed test. Type the words for one minute and get your words per minute and accuracy instantly. No signup, no download. The average adult types about 40 WPM." />
        <meta name="keywords" content="typing test, typing speed test, wpm test, words per minute, free typing test online, keyboard test, single player games, free online games no download" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Typing Speed Test — Free 1 Minute WPM Test" />
        <meta property="og:description" content="Most people type about 40 WPM. What do you get?" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <Navigation />

      <div className="mx-auto max-w-2xl px-4 pb-16 pt-24">
        {g.status !== 'over' && (
          <div>
            <div className="text-center">
              <h1 style={FREDOKA} className="text-4xl font-bold leading-tight md:text-5xl">Typing Speed Test</h1>
              <p style={QUICKSAND} className="mx-auto mt-3 max-w-lg text-base md:text-lg">
                Type the words below. The clock starts when you do.
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between" style={QUICKSAND}>
              <span
                className="flex items-center gap-2 text-lg font-bold"
                style={{ color: g.timeLeft <= 10 && g.status === 'running' ? THEME.red : THEME.teal }}
                role="timer"
                aria-live="off"
              >
                <FiClock aria-hidden="true" />
                {g.status === 'idle' ? `${g.duration}s` : `${g.timeLeft}s`}
              </span>
              <span data-testid="typing-stat" className="text-sm font-bold" style={{ color: THEME.mut }}>
                {g.status === 'running' && g.liveWpm !== null ? <>{g.liveWpm} WPM</> : <>net WPM</>}
                {g.best > 0 && <> · best {g.best}</>}
              </span>
            </div>

            <div
              onClick={() => inputRef.current?.focus()}
              style={{ background: THEME.bgAlt, borderColor: THEME.border }}
              className="mt-3 min-h-[7.5rem] rounded-2xl border-[3px] p-4 leading-relaxed"
            >
              <p style={{ ...QUICKSAND, fontSize: '1.25rem' }} className="flex flex-wrap gap-x-2 gap-y-1">
                {upcoming.map((w, i) => (
                  <span
                    key={`${g.wordIdx}-${i}`}
                    data-testid={i === 0 ? 'current-word' : undefined}
                    style={{
                      fontWeight: i === 0 ? 700 : 500,
                      color: i === 0 ? THEME.ink : THEME.mut,
                      borderBottom: i === 0 ? `3px solid ${wrongSoFar ? THEME.red : THEME.teal}` : 'none',
                      // Floor at 0.6, not lower: below that, grey-on-cream
                      // drops under the AA contrast line and the last row of
                      // upcoming words becomes genuinely hard to read.
                      opacity: i === 0 ? 1 : Math.max(0.6, 1 - i * 0.05),
                    }}
                  >
                    {w}
                  </span>
                ))}
              </p>
            </div>

            <input
              ref={inputRef}
              type="text"
              value={g.typed}
              onChange={(e) => g.onType(e.target.value)}
              disabled={g.status === 'over'}
              data-testid="typing-input"
              aria-label="Type the highlighted word here"
              placeholder="Start typing…"
              // Without these a phone keyboard capitalises the first word and
              // autocorrects the rest, which would mark almost everything wrong.
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              style={{
                ...QUICKSAND,
                background: THEME.bgAlt,
                borderColor: wrongSoFar && g.typed ? THEME.red : THEME.teal,
                color: THEME.ink,
              }}
              className="mt-3 w-full rounded-2xl border-[3px] px-4 py-4 text-xl font-bold outline-none"
            />

            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-3 text-center text-sm">
              Press space after each word. Only correct words count.
            </p>
          </div>
        )}

        {g.status === 'over' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-sm uppercase tracking-widest">You typed</p>
            <p style={{ ...FREDOKA, color: THEME.teal }} className="my-1 text-7xl font-bold md:text-8xl">{g.wpm}</p>
            <p style={QUICKSAND} className="text-lg">words per minute</p>
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-2">
              {g.accuracy}% accuracy · {g.correctWords} words correct
            </p>

            {(() => { const r = rankFor(g.wpm); return (
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
                  onClick={async () => downloadFile(await buildTypingCard(g.wpm, g.accuracy, g.isNewBest))}
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
          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">How the typing test works</h2>
          <p style={{ color: THEME.mut }} className="mb-4">
            Words appear one after another. Type each one and press space to move on. The clock starts on your
            first keystroke and runs for one minute, so there is no rush to begin — get comfortable first.
          </p>
          <p style={{ color: THEME.mut }} className="mb-6">
            Your score is net words per minute: one word counts as five characters, and only words you typed
            correctly count. The average adult manages about 40. If you are chasing a higher number, the
            reliable route is accuracy rather than speed — every mistyped word costs you far more than the
            second you saved rushing it.
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
            More to play: <Link to="/reaction-time-test" className="font-bold underline" style={{ color: THEME.teal }}>Reaction Time Test</Link>,{' '}
            <Link to="/word-scramble" className="font-bold underline" style={{ color: THEME.teal }}>Word Scramble</Link>, or{' '}
            <Link to="/solo-games" className="font-bold underline" style={{ color: THEME.teal }}>all solo games</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
