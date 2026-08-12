import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FiShare2, FiCheck, FiDownload, FiRotateCcw } from 'react-icons/fi';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import { THEME, FREDOKA, QUICKSAND, DURATION_S, rankFor } from './colourData';
import { useColourMatch } from './useColourMatch';
import { buildShareText, buildColourCard } from './share';
import { shareCardOrText, downloadFile } from '../../lib/shareCard';

const CANONICAL = 'https://herdgamesonline.com/colour-match';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Colour Match',
      alternateName: ['Stroop test', 'Stroop effect game', 'Colour word game'],
      url: CANONICAL,
      description: 'A free Stroop test. The word and the ink disagree, and you answer about one while the other interferes. Sixty seconds, as many as you can. No signup or download.',
      image: OG,
      genre: ['Reflex', 'Brain', 'Single player'],
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
  { q: 'What is the Stroop effect?', a: 'When the word "RED" is printed in blue ink, your brain reads the word faster than it sees the colour, and the two answers fight. That interference is the Stroop effect, and this game is built on it.' },
  { q: 'How do you play?', a: 'Read the instruction at the top — sometimes it asks for the colour of the ink, sometimes for what the word says. It swaps between the two, so you cannot settle into a rhythm. Sixty seconds, as many as you can.' },
  { q: 'What happens if I get one wrong?', a: 'You lose a second and a half off the clock rather than the run. It costs you, but a single slip does not end a sixty second game.' },
  { q: 'I am colour blind — can I play?', a: 'Partly. The game is colour-dependent by nature, but every answer button is labelled with the colour name as well as the swatch, so the choices are always readable as text.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function ColourMatch() {
  const g = useColourMatch();
  const [copied, setCopied] = useState(false);

  const doShare = async () => {
    const file = await buildColourCard(g.score, g.isNewBest);
    const res = await shareCardOrText(file, buildShareText(g.score, g.isNewBest), 'Colour Match');
    if (res === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const pct = Math.max(0, Math.min(100, (g.remaining / g.duration) * 100));
  const cardBorder = g.flash === 'ok' ? THEME.green : g.flash === 'no' ? THEME.red : THEME.border;

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>Colour Match — Free Stroop Test Game (No Download)</title>
        <meta name="description" content="Play the free Stroop test. The word and the ink disagree and you answer about one while the other interferes. Sixty seconds, as many as you can. No signup, no download." />
        <meta name="keywords" content="stroop test, stroop effect game, colour match game, brain game, concentration game, free online games no download, single player games" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Colour Match — Free Stroop Test" />
        <meta property="og:description" content="The word says one thing. The ink says another. Sixty seconds." />
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
            <h1 style={FREDOKA} className="text-4xl font-bold leading-tight md:text-6xl">Colour Match</h1>
            <p style={QUICKSAND} className="mx-auto mt-4 max-w-md text-base md:text-lg">
              The word and the ink usually disagree. Sometimes you answer about the ink,
              sometimes about the word. Read the instruction each time — that is the hard part.
            </p>
            <p className="my-6 text-4xl font-bold" style={{ ...FREDOKA, color: '#2D6BE0' }}>RED</p>
            <button
              onClick={g.start}
              style={{ ...FREDOKA, background: THEME.accent }}
              className="rounded-2xl px-10 py-4 text-xl font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Start the test
            </button>
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-4 text-base">
              {DURATION_S} seconds · wrong answers cost {g.penaltySeconds}s
              {g.best > 0 && <> · your best: <strong style={{ color: THEME.accent }}>{g.best}</strong></>}
            </p>
          </div>
        )}

        {g.status === 'playing' && g.round && (
          <div>
            <div className="mb-2 flex items-center justify-between" style={QUICKSAND}>
              <span className="text-base font-bold" style={{ color: THEME.mut }}>
                Score <strong style={{ color: THEME.accent }}>{g.score}</strong>
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
                style={{ width: `${pct}%`, background: g.remaining <= 10 ? THEME.red : THEME.accent }}
              />
            </div>

            <div
              className="rounded-3xl border-2 p-8 text-center transition-colors duration-150"
              style={{ background: THEME.bgAlt, borderColor: cardBorder }}
            >
              {/* This line is not decoration, it is the entire game: it flips
                  between "the colour" and "what it says" round to round, and a
                  player who reads it once and then stops reading it is now
                  answering a different question from the one being asked. It
                  was set in muted small caps — the exact styling the eye learns
                  to treat as a heading and skip. */}
              <p
                style={{ ...QUICKSAND, color: THEME.accent }}
                className="mb-4 text-lg font-bold uppercase tracking-widest md:text-xl"
                data-testid="cm-ask"
                role="status"
                aria-live="polite"
              >
                {g.round.mode.ask}
              </p>
              <p
                style={{ ...FREDOKA, color: g.round.ink.hex }}
                className="text-6xl font-bold md:text-7xl"
                data-testid="cm-word"
                data-word={g.round.word.id}
                data-ink={g.round.ink.id}
              >
                {g.round.word.name}
              </p>
            </div>

            {/* Both swatch and NAME on every button, so the choice is readable
                as text and not only as colour. */}
            <div className="mt-5 grid grid-cols-2 gap-3">
              {g.round.options.map((c) => (
                <button
                  key={c.id}
                  data-testid="cm-option"
                  data-colour={c.id}
                  onClick={() => g.answer(c.id)}
                  style={{ ...FREDOKA, background: c.hex }}
                  className="flex items-center justify-center gap-2 rounded-2xl py-5 text-lg font-bold text-white active:scale-95"
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {g.status === 'over' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-base uppercase tracking-widest">You got</p>
            <p style={{ ...FREDOKA, color: THEME.accent }} className="my-1 text-7xl font-bold md:text-8xl">{g.score}</p>
            <p style={QUICKSAND} className="text-lg">in {DURATION_S} seconds</p>

            {(() => { const r = rankFor(g.score); return (
              <>
                <p style={FREDOKA} className="mt-4 text-2xl font-bold">{r.label}</p>
                <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-1">{r.blurb}</p>
              </>
            ); })()}

            {g.wrong > 0 && (
              <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-3 text-base">
                {g.wrong} wrong, costing {(g.wrong * g.penaltySeconds).toFixed(1)}s
              </p>
            )}
            {g.isNewBest && (
              <p style={{ ...FREDOKA, color: THEME.green }} className="mt-3 text-lg font-bold">New personal best!</p>
            )}

            <div className="mx-auto mt-8 grid max-w-sm gap-3">
              <button
                onClick={g.playAgain}
                style={{ ...FREDOKA, background: THEME.accent }}
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
              >
                <FiRotateCcw aria-hidden="true" /> Go again
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={doShare}
                  style={{ ...QUICKSAND, borderColor: THEME.accent, color: THEME.accent }}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 font-bold"
                >
                  {copied ? <><FiCheck aria-hidden="true" /> Copied</> : <><FiShare2 aria-hidden="true" /> Share</>}
                </button>
                <button
                  onClick={async () => downloadFile(await buildColourCard(g.score, g.isNewBest))}
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
          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">How Colour Match works</h2>
          <p style={{ color: THEME.mut }} className="mb-4">
            A colour word appears, printed in a colour that usually is not the one it names. Above it is the
            instruction: sometimes “tap the colour of the word”, sometimes “tap what the word says”. It swaps
            between the two at random, so you cannot get into a rhythm and stop reading.
          </p>
          <p style={{ color: THEME.mut }} className="mb-6">
            This is the Stroop effect: your brain reads the word faster than it registers the ink, so the two
            answers compete and you have to actively override one. A wrong answer costs {g.penaltySeconds}{' '}
            seconds off the clock rather than ending the run, so one slip is survivable.
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
            More to play: <Link to="/reaction-time-test" className="font-bold underline" style={{ color: THEME.accent }}>Reaction Time Test</Link>,{' '}
            <Link to="/chimp-test" className="font-bold underline" style={{ color: THEME.accent }}>Chimp Test</Link>, or{' '}
            <Link to="/solo-games" className="font-bold underline" style={{ color: THEME.accent }}>all solo games</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
