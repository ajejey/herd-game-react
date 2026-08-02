import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FiRotateCcw, FiX, FiCircle } from 'react-icons/fi';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import { THEME, FREDOKA, QUICKSAND, HUMAN } from './tttData';
import { useTicTacToe } from './useTicTacToe';

const CANONICAL = 'https://herdgamesonline.com/tic-tac-toe';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Tic Tac Toe',
      alternateName: ['Noughts and Crosses', 'Tic tac toe vs computer', 'XOXO game'],
      url: CANONICAL,
      description: 'Play tic tac toe against the computer, free and online. Three difficulties including a genuinely unbeatable one. No signup or download.',
      image: OG,
      genre: ['Strategy', 'Classic', 'Single player'],
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
  { q: 'Can you beat the computer on Impossible?', a: 'No, and that is not marketing. It plays perfect minimax, so the best result available to you is a draw. We ran 400 games against it without a single loss on its side.' },
  { q: 'How do I force a draw against perfect play?', a: 'Take the centre if it is free. If the computer opens in the centre, take a corner. From there, always block a line of two before building your own and the game ends level.' },
  { q: 'Is there an easier mode?', a: 'Yes. Easy plays completely at random and Medium plays perfectly about half the time, so both are genuinely winnable.' },
  { q: 'Do I always go first?', a: 'Yes — you are X and you always open, which is the side with the advantage. Even so, perfect play still holds you to a draw.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

const Mark = ({ mark }) => {
  if (!mark) return null;
  const isHuman = mark === HUMAN;
  const Icon = isHuman ? FiX : FiCircle;
  return <Icon aria-hidden="true" size={44} style={{ color: isHuman ? THEME.plum : THEME.green }} strokeWidth={3} />;
};

export default function TicTacToe() {
  const g = useTicTacToe();

  const message = {
    won: 'You win!',
    lost: 'Computer wins',
    draw: 'A draw',
    thinking: 'Computer is thinking…',
    playing: 'Your turn',
  }[g.status];

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>Tic Tac Toe — Play Free vs Computer (No Download)</title>
        <meta name="description" content="Play tic tac toe against the computer, free online. Three difficulties, including a genuinely unbeatable one — the best you can do is draw. No signup, no download." />
        <meta name="keywords" content="tic tac toe, noughts and crosses, tic tac toe vs computer, play tic tac toe online, unbeatable tic tac toe, free online games no download, single player games" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Tic Tac Toe — Play Free vs Computer" />
        <meta property="og:description" content="Three difficulties, one of them genuinely unbeatable." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <Navigation />

      <div className="mx-auto max-w-md px-4 pb-16 pt-24">
        <div className="text-center">
          <h1 style={FREDOKA} className="text-4xl font-bold leading-tight md:text-5xl">Tic Tac Toe</h1>
          <p style={QUICKSAND} className="mx-auto mt-2 max-w-md text-base">You are X, and you always go first.</p>
        </div>

        <div className="mt-4 flex justify-center gap-2">
          {g.levels.map((lv) => (
            <button
              key={lv.id}
              onClick={() => g.changeLevel(lv)}
              style={{
                ...QUICKSAND,
                background: lv.id === g.level.id ? THEME.plum : THEME.bgAlt,
                color: lv.id === g.level.id ? '#FFFFFF' : THEME.mut,
                borderColor: THEME.plum,
              }}
              className="rounded-full border-2 px-4 py-1.5 text-sm font-bold"
            >
              {lv.name}
            </button>
          ))}
        </div>
        <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-2 text-center text-sm">{g.level.blurb}</p>

        <p
          data-testid="ttt-status"
          role="status"
          aria-live="polite"
          style={{
            ...FREDOKA,
            color: g.status === 'won' ? THEME.green : g.status === 'lost' ? THEME.red : THEME.ink,
          }}
          className="mt-5 text-center text-2xl font-bold"
        >
          {message}
        </p>

        <div data-testid="ttt-board" className="mx-auto mt-3 grid max-w-xs grid-cols-3 gap-2">
          {g.board.map((mark, i) => {
            const inLine = g.line?.includes(i);
            return (
              <button
                key={i}
                data-testid="ttt-cell"
                data-cell={i}
                data-mark={mark || ''}
                onClick={() => g.play(i)}
                disabled={!!mark || g.status !== 'playing'}
                aria-label={mark ? `Cell ${i + 1}, ${mark === HUMAN ? 'yours' : 'computer'}` : `Play cell ${i + 1}`}
                style={{
                  background: inLine ? '#EAF5EE' : THEME.bgAlt,
                  borderColor: inLine ? THEME.green : THEME.border,
                  touchAction: 'manipulation',
                }}
                className="flex aspect-square items-center justify-center rounded-2xl border-[3px] transition-colors disabled:cursor-default"
              >
                <Mark mark={mark} />
              </button>
            );
          })}
        </div>

        {g.done && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-5 text-center">
            <button
              onClick={g.playAgain}
              style={{ ...FREDOKA, background: THEME.plum }}
              className="mx-auto flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-lg font-bold text-white active:scale-[0.98]"
            >
              <FiRotateCcw aria-hidden="true" /> Play again
            </button>
          </motion.div>
        )}

        <div
          data-testid="ttt-record"
          style={{ ...QUICKSAND, borderColor: THEME.border }}
          className="mx-auto mt-6 flex max-w-xs items-center justify-around rounded-2xl border-2 py-3 text-center"
        >
          <span><strong style={{ color: THEME.green }}>{g.record.won}</strong><br /><span className="text-xs" style={{ color: THEME.mut }}>won</span></span>
          <span><strong style={{ color: THEME.mut }}>{g.record.drawn}</strong><br /><span className="text-xs" style={{ color: THEME.mut }}>drawn</span></span>
          <span><strong style={{ color: THEME.red }}>{g.record.lost}</strong><br /><span className="text-xs" style={{ color: THEME.mut }}>lost</span></span>
        </div>
        <div className="mt-2 text-center">
          <button onClick={g.clearRecord} style={{ ...QUICKSAND, color: THEME.mut }} className="text-xs underline">
            Reset record
          </button>
        </div>

        <div className="mt-12"><AdSlot /></div>

        <section className="mt-12" style={QUICKSAND}>
          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">Tic tac toe against the computer</h2>
          <p style={{ color: THEME.mut }} className="mb-4">
            You are X and you always open, which is the side with the advantage. Get three in a row across,
            down or diagonally before the computer does. Easy plays at random, Medium plays well about half
            the time, and Impossible plays perfectly.
          </p>
          <p style={{ color: THEME.mut }} className="mb-6">
            Impossible really is unbeatable — it searches the whole game to the end rather than following
            rules of thumb, so the best result available to you is a draw. If you want one: take the centre
            when it is free, take a corner when it is not, and always block a line of two before building
            your own.
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
            More to play: <Link to="/minesweeper" className="font-bold underline" style={{ color: THEME.plum }}>Minesweeper</Link>,{' '}
            <Link to="/hangman" className="font-bold underline" style={{ color: THEME.plum }}>Hangman</Link>, or{' '}
            <Link to="/solo-games" className="font-bold underline" style={{ color: THEME.plum }}>all solo games</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
