import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShare2, FiCheck, FiDownload, FiRotateCcw, FiHeart, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import PlayHint from '../common/PlayHint';
import { THEME, FREDOKA, QUICKSAND, CATEGORIES, rankFor } from './orderData';
import { useInOrder } from './useInOrder';
import { buildShareText, buildOrderCard } from './share';
import { shareCardOrText, downloadFile } from '../../lib/shareCard';

const CANONICAL = 'https://herdgamesonline.com/put-in-order';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Put in Order',
      alternateName: ['Ranking game', 'Put in order game', 'Order it game'],
      url: CANONICAL,
      description: 'A free ordering game. Arrange four countries, cities, mountains, rivers or films into the right order by size, height, length or date. Three lives, endless, no signup or download.',
      image: OG,
      genre: ['Puzzle', 'Trivia', 'Single player'],
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
  { q: 'How do you play Put in Order?', a: 'You get four things — countries, cities, mountains, rivers or films — and you arrange them into the right order. Tap one item then tap another to swap them. Submit when you are happy. Get it right and your streak grows; get it wrong and you lose one of three lives.' },
  { q: 'Do I have to drag things around?', a: 'No. You tap one item and then tap the one you want to swap it with. Dragging is fiddly on a phone, so the whole game works with taps.' },
  { q: 'Is it free?', a: 'Yes, completely free. No signup, no download and no app. Your best score is saved on your device.' },
  { q: 'Where do the facts come from?', a: 'Populations, heights, lengths and release dates come from Wikidata, which is free and open. Rounds are assembled so the four items are clearly different in size, rather than being a coin flip between two near-identical values.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function InOrder() {
  const g = useInOrder();
  const [copied, setCopied] = useState(false);

  const doShare = async () => {
    const file = await buildOrderCard(g.score, g.isNewBest);
    const res = await shareCardOrText(file, buildShareText(g.score, g.isNewBest), 'Put in Order');
    if (res === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const playing = g.status === 'playing' || g.status === 'reveal';

  const rowStyle = (item, i) => {
    if (g.status === 'reveal') {
      const rightSpot = g.round.answer[i] === item.n;
      return rightSpot
        ? { background: '#EAF6EF', borderColor: THEME.green }
        : { background: '#FCECEA', borderColor: THEME.red };
    }
    return g.selected === i
      ? { background: '#F6ECF4', borderColor: THEME.plum }
      : { background: THEME.bgAlt, borderColor: THEME.border };
  };

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>Put in Order — Free Ranking &amp; Ordering Game (No Download)</title>
        <meta name="description" content="Play Put in Order free online. Arrange four countries, cities, mountains, rivers or films into the right order by size, height, length or date. Endless, no signup, no download." />
        <meta name="keywords" content="put in order game, ranking game, ordering game, sort the list game, free online games no download, single player games, games to play alone" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Put in Order — Free Ranking Game" />
        <meta property="og:description" content="Four things. One right order. How long can you keep it going?" />
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
            <h1 style={FREDOKA} className="text-4xl font-bold leading-tight md:text-6xl">Put in Order</h1>
            <p style={QUICKSAND} className="mx-auto mt-4 max-w-md text-base md:text-lg">
              Four things, one correct order. Biggest, tallest, longest, oldest —
              it depends on the round. Tap two items to swap them.
            </p>
            <button
              onClick={g.start}
              style={{ ...FREDOKA, background: THEME.plum }}
              className="mt-8 rounded-2xl px-10 py-4 text-xl font-bold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Start playing
            </button>
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-4 text-base">
              {CATEGORIES.length} kinds of round · endless
              {g.best > 0 && <> · your best: <strong style={{ color: THEME.plum }}>{g.best}</strong></>}
            </p>
          </div>
        )}

        {playing && g.round && (
          <div>
            <div className="mb-4 flex items-center justify-between" style={QUICKSAND}>
              <span className="text-base font-bold" style={{ color: THEME.mut }}>
                Streak <strong style={{ color: THEME.plum }}>{g.score}</strong>
                {g.best > 0 && <> · best {g.best}</>}
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

            <p style={FREDOKA} className="mb-1 text-center text-xl font-bold md:text-2xl">{g.round.ask}</p>
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mb-4 flex items-center justify-center gap-2 text-base">
              <FiArrowUp size={13} aria-hidden="true" /> {g.round.low}
              <span aria-hidden="true">·</span>
              {g.round.high} <FiArrowDown size={13} aria-hidden="true" />
            </p>

            <div className="grid gap-2">
              {g.order.map((item, i) => (
                <button
                  key={item.n}
                  data-testid="order-row"
                  onClick={() => g.tap(i)}
                  disabled={g.status !== 'playing'}
                  style={{ ...QUICKSAND, ...rowStyle(item, i) }}
                  className="flex items-center gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-all disabled:cursor-default"
                >
                  <span
                    aria-hidden="true"
                    style={{ ...FREDOKA, color: THEME.mut }}
                    className="w-5 shrink-0 text-base font-bold"
                  >
                    {i + 1}
                  </span>
                  <span style={FREDOKA} className="min-w-0 flex-1 text-base font-bold md:text-lg">{item.n}</span>
                  {g.status === 'reveal' && (
                    <span style={{ color: THEME.mut }} className="shrink-0 text-base font-bold">
                      {g.round.fmt(item.v)}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {g.status === 'playing' && (
              <>
                <PlayHint accent={THEME.plum} ink={THEME.ink} live className="mt-3">
                  {g.selected === null ? 'Tap an item, then tap another to swap them' : 'Now tap the one to swap it with'}
                </PlayHint>
                <button
                  onClick={g.submit}
                  style={{ ...FREDOKA, background: THEME.plum }}
                  className="mt-4 w-full rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
                >
                  Lock in this order
                </button>
              </>
            )}

            <AnimatePresence>
              {g.status === 'reveal' && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-center"
                  role="status"
                  aria-live="polite"
                >
                  <p style={{ ...FREDOKA, color: g.wasCorrect ? THEME.green : THEME.red }} className="text-2xl font-bold">
                    {g.wasCorrect ? 'Exactly right!' : 'Not quite'}
                  </p>
                  {!g.wasCorrect && (
                    <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-1 text-base">
                      Correct order: {g.round.answer.join(' → ')}
                    </p>
                  )}
                  <button
                    onClick={g.next}
                    style={{ ...FREDOKA, background: THEME.plum }}
                    className="mt-4 w-full rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
                  >
                    {g.lives <= 0 ? 'See your score' : 'Next round'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {g.status === 'over' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-base uppercase tracking-widest">You got</p>
            <p style={{ ...FREDOKA, color: THEME.plum }} className="my-1 text-7xl font-bold md:text-8xl">{g.score}</p>
            <p style={QUICKSAND} className="text-lg">in a row</p>

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
                style={{ ...FREDOKA, background: THEME.plum }}
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
              >
                <FiRotateCcw aria-hidden="true" /> Play again
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={doShare}
                  style={{ ...QUICKSAND, borderColor: THEME.plum, color: THEME.plum }}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 font-bold"
                >
                  {copied ? <><FiCheck aria-hidden="true" /> Copied</> : <><FiShare2 aria-hidden="true" /> Share</>}
                </button>
                <button
                  onClick={async () => downloadFile(await buildOrderCard(g.score, g.isNewBest))}
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
          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">How to play Put in Order</h2>
          <p style={{ color: THEME.mut }} className="mb-4">
            Each round gives you four things and asks you to arrange them — countries by population, mountains
            by height, rivers by length, films by release date. Tap one item and then tap another to swap the
            two, then lock in your order. Every item has to be in the right place; close does not count.
          </p>
          <p style={{ color: THEME.mut }} className="mb-6">
            Rounds are built so the four values are clearly different from one another, so it is a test of what
            you know rather than a coin flip between two near-identical numbers. You have three lives, and
            after every round you see the real figures — so a wrong answer still teaches you something.
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
            More to play: <Link to="/higher-or-lower" className="font-bold underline" style={{ color: THEME.plum }}>Higher or Lower</Link>,{' '}
            <Link to="/odd-one-out" className="font-bold underline" style={{ color: THEME.plum }}>Odd One Out</Link>, or{' '}
            <Link to="/solo-games" className="font-bold underline" style={{ color: THEME.plum }}>all solo games</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
