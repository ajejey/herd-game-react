import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { FiShare2, FiCheck, FiDownload, FiRotateCcw } from 'react-icons/fi';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import { THEME, FREDOKA, QUICKSAND, ALPHABET, WORD_COUNT, CATEGORIES, maskWord, rankFor } from './hangmanData';
import { useHangman } from './useHangman';
import Gallows from './Gallows';
import { buildShareText, buildHangmanCard } from './share';
import { shareCardOrText, downloadFile } from '../../lib/shareCard';

const CANONICAL = 'https://herdgamesonline.com/hangman';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Hangman',
      alternateName: ['Hangman game', 'Word guessing game'],
      url: CANONICAL,
      description: 'Play hangman free online. Guess the hidden word one letter at a time with a category as your clue. Six wrong guesses and the run ends. No signup or download.',
      image: OG,
      genre: ['Word', 'Puzzle', 'Single player'],
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
  { q: 'How do you play hangman?', a: 'A word is hidden and you guess one letter at a time. Every letter that appears in the word is revealed; every letter that does not costs you one of six lives. Solve the word to keep your streak going.' },
  { q: 'Do I get a clue?', a: `Yes — every word comes with its category, one of ${CATEGORIES.length}: ${CATEGORIES.map((c) => c.name).join(', ')}. Without a category, hangman is really a guessing game about letter frequency rather than a word game.` },
  { q: 'What letters should I start with?', a: 'Vowels are the usual opening, and E is the most common letter in English by a wide margin. After that, R, S, T, L and N appear in a great many words.' },
  { q: 'Does it repeat words?', a: `There are ${WORD_COUNT} words across the categories and each round draws at random, so repeats happen eventually but not often within a run.` },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function Hangman() {
  const g = useHangman();
  const [copied, setCopied] = useState(false);

  // A physical keyboard should just work — this is a typing game at heart.
  useEffect(() => {
    const onKey = (e) => {
      const ch = e.key.toUpperCase();
      if (ch.length === 1 && ch >= 'A' && ch <= 'Z') g.guess(ch);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [g]);

  const doShare = async () => {
    const file = await buildHangmanCard(g.streak, g.isNewBest);
    const res = await shareCardOrText(file, buildShareText(g.streak, g.isNewBest), 'Hangman');
    if (res === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  // On a loss the whole word is shown, so the player learns the answer.
  const revealAll = g.status === 'lost';
  const letters = maskWord(g.word, revealAll ? g.word.split('') : g.guessed);

  return (
    <div style={{ background: THEME.bg, color: THEME.ink, minHeight: '100vh' }}>
      <Helmet>
        <title>Hangman — Play Free Online Word Game (No Download)</title>
        <meta name="description" content="Play hangman free online. Guess the hidden word one letter at a time, with a category as your clue. Six wrong guesses and the run ends. No signup, no download." />
        <meta name="keywords" content="hangman, hangman game, play hangman online, word game, free online games no download, single player games, word guessing game" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Hangman — Play Free Online Word Game" />
        <meta property="og:description" content="Guess the word, keep the streak. Free, no signup." />
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
              <h1 style={FREDOKA} className="text-4xl font-bold leading-tight md:text-5xl">Hangman</h1>
            </div>

            <div className="mt-4 flex items-center justify-between" style={QUICKSAND}>
              <span className="text-base font-bold" style={{ color: THEME.mut }}>
                Streak {g.streak}{g.best > 0 && <> · best {g.best}</>}
              </span>
              <span data-testid="hm-lives" className="text-base font-bold" style={{ color: g.livesLeft <= 2 ? THEME.red : THEME.mut }}>
                {g.livesLeft} left
              </span>
            </div>

            <Gallows wrong={g.wrong} />

            <p style={{ ...QUICKSAND, color: THEME.mut }} className="mt-1 text-center text-base font-bold uppercase tracking-widest">
              {g.category}
            </p>

            <div data-testid="hm-word" className="mt-4 flex flex-wrap justify-center gap-1.5">
              {letters.map((ch, i) => (
                <span
                  key={i}
                  style={{
                    ...FREDOKA,
                    borderColor: THEME.mut,
                    color: revealAll && !g.guessed.includes(g.word[i]) ? THEME.red : THEME.ink,
                  }}
                  className="w-7 border-b-[3px] text-center text-2xl font-bold md:w-8 md:text-3xl"
                >
                  {ch || ' '}
                </span>
              ))}
            </div>

            <p
              data-testid="hm-status"
              role="status"
              aria-live="polite"
              style={{ ...FREDOKA, color: g.status === 'won' ? THEME.green : THEME.red }}
              className="mt-4 h-7 text-center text-lg font-bold"
            >
              {g.status === 'won' && 'Got it!'}
              {g.status === 'lost' && `It was ${g.word}`}
            </p>

            <div className="mt-2 grid grid-cols-7 gap-1.5">
              {ALPHABET.map((ch) => {
                const used = g.guessed.includes(ch);
                const hit = used && g.word.includes(ch);
                return (
                  <button
                    key={ch}
                    data-testid="hm-key"
                    data-letter={ch}
                    onClick={() => g.guess(ch)}
                    disabled={used || g.status !== 'playing'}
                    aria-label={`Guess ${ch}`}
                    style={{
                      ...FREDOKA,
                      background: !used ? THEME.bgAlt : hit ? THEME.forest : THEME.border,
                      color: !used ? THEME.ink : hit ? '#FFFFFF' : THEME.mut,
                      borderColor: THEME.border,
                      touchAction: 'manipulation',
                    }}
                    className="aspect-square rounded-lg border-2 text-base font-bold disabled:cursor-default md:text-base"
                  >
                    {ch}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {g.status === 'over' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p style={{ ...QUICKSAND, color: THEME.mut }} className="text-base uppercase tracking-widest">Your streak</p>
            <p style={{ ...FREDOKA, color: THEME.forest }} className="my-1 text-7xl font-bold md:text-8xl">{g.streak}</p>
            <p style={QUICKSAND} className="text-lg">words in a row</p>

            {(() => { const r = rankFor(g.streak); return (
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
                style={{ ...FREDOKA, background: THEME.forest }}
                className="flex items-center justify-center gap-2 rounded-2xl py-4 text-lg font-bold text-white active:scale-[0.98]"
              >
                <FiRotateCcw aria-hidden="true" /> Play again
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={doShare}
                  style={{ ...QUICKSAND, borderColor: THEME.forest, color: THEME.forest }}
                  className="flex items-center justify-center gap-2 rounded-2xl border-2 py-3 font-bold"
                >
                  {copied ? <><FiCheck aria-hidden="true" /> Copied</> : <><FiShare2 aria-hidden="true" /> Share</>}
                </button>
                <button
                  onClick={async () => downloadFile(await buildHangmanCard(g.streak, g.isNewBest))}
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
          <h2 style={FREDOKA} className="mb-3 text-2xl font-bold">How to play hangman</h2>
          <p style={{ color: THEME.mut }} className="mb-4">
            A word is hidden and you guess one letter at a time. Every letter that appears in the word is
            revealed wherever it occurs; every letter that does not costs one of your six lives. Solve the
            word and a new one appears with your streak intact. Six wrong guesses and the run is over.
          </p>
          <p style={{ color: THEME.mut }} className="mb-6">
            Every word comes with its category, which is the single biggest clue you get. Vowels are the
            traditional opening, and E is by some distance the most common letter in English — after that,
            R, S, T, L and N turn up in a great many words. You can tap the letters or just type them.
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
            More to play: <Link to="/word-scramble" className="font-bold underline" style={{ color: THEME.forest }}>Word Scramble</Link>,{' '}
            <Link to="/odd-one-out" className="font-bold underline" style={{ color: THEME.forest }}>Odd One Out</Link>, or{' '}
            <Link to="/solo-games" className="font-bold underline" style={{ color: THEME.forest }}>all solo games</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
