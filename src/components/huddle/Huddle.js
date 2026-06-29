import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Confetti from 'react-confetti';
import { FiVolume2, FiVolumeX, FiShare2, FiCheck, FiDownload } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import AdSlot from '../AdSlot';
import DailyChecklist from '../DailyChecklist';
import { sfx, isMuted, setMuted } from '../daily/sfx';
import { getDayNumber, getPuzzleForDay, emojiForLevel, colorForLevel } from './puzzles';
import { buildGridCard, shareCardOrText, downloadFile } from '../../lib/shareCard';
import { useHuddle } from './useHuddle';
import { buildShareText } from './share';
import HuddleBoard from './HuddleBoard';

const CANONICAL = 'https://herdgamesonline.com/connections';
const OG = 'https://herdgamesonline.com/og-daily.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Huddle — Daily Word Grouping Game',
      alternateName: ['Huddle', 'Connections game', 'Free Connections', 'Connections unlimited', 'Word grouping puzzle'],
      url: CANONICAL,
      description: 'Huddle is a free daily word-grouping puzzle, like Connections: sort 16 words into 4 hidden groups of 4. No signup, no download, plus unlimited past puzzles.',
      image: OG,
      genre: ['Word', 'Puzzle', 'Daily'],
      gamePlatform: ['Web browser'],
      playMode: 'SinglePlayer',
      applicationCategory: 'GameApplication',
      operatingSystem: 'Any (Web)',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@type': 'Organization', name: 'Herd Game' },
    },
  ],
};

const HOWTO_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to play Huddle',
  description: 'Sort 16 words into the 4 hidden groups of 4. You get four mistakes.',
  step: [
    { '@type': 'HowToStep', name: 'Find a group', text: 'Look at the 16 words and find four that share a hidden connection.' },
    { '@type': 'HowToStep', name: 'Select four', text: 'Tap four words you think belong together, then press Submit.' },
    { '@type': 'HowToStep', name: 'Watch your mistakes', text: 'A correct group locks in with its colour. You can make four mistakes before the game ends.' },
    { '@type': 'HowToStep', name: 'Solve all four', text: 'Clear all four groups to win, then share your colour grid and keep your streak.' },
  ],
};

const FAQS = [
  { q: 'Is Huddle free?', a: 'Yes — Huddle is completely free, with no signup and no download. A new puzzle drops every day, and you can also play past puzzles unlimited.' },
  { q: 'Is Huddle like Connections?', a: 'It is the same kind of word-grouping puzzle: sort 16 words into 4 hidden groups of 4, with four mistakes allowed. Huddle has its own daily puzzles and, unlike the New York Times Connections, lets you replay past days unlimited and free.' },
  { q: 'How many guesses do I get?', a: 'You can make four mistakes before the game ends. A "one away" hint tells you when three of your four picks belong together.' },
  { q: 'Can I play more than one puzzle a day?', a: 'Yes. After today\'s puzzle you can play earlier days — that\'s the unlimited mode. A brand-new puzzle is added every day.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

function useWindowSize() {
  const [s, setS] = useState({ w: 1024, h: 768 });
  useEffect(() => {
    const on = () => setS({ w: window.innerWidth, h: window.innerHeight });
    on();
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return s;
}

function MuteButton() {
  const [muted, set] = useState(isMuted());
  return (
    <button onClick={() => { setMuted(!muted); set(!muted); }} aria-label={muted ? 'Unmute' : 'Mute'}
      className="absolute top-4 right-4 text-[#8B6347] hover:text-[#2D1810]">
      {muted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
    </button>
  );
}

export default function Huddle() {
  const navigate = useNavigate();
  const { dayNumber: param } = useParams();
  const today = getDayNumber();
  const parsed = Number(param);
  const isArchive = param != null && Number.isInteger(parsed) && parsed >= 1 && parsed < today;
  const day = isArchive ? parsed : today;
  // Garbage or future param → bounce to today.
  useEffect(() => {
    if (param != null && !(Number.isInteger(parsed) && parsed >= 1 && parsed <= today)) navigate('/connections', { replace: true });
  }, [param, parsed, today, navigate]);

  return (
    <MeadowLayout maxWidth="max-w-xl">
      <Helmet>
        <title>Huddle — Free Connections Game, Unlimited & No Login</title>
        <meta name="description" content="Huddle is a free daily word-grouping puzzle like Connections: sort 16 words into 4 hidden groups. Play today free — no signup, no download — plus unlimited past puzzles." />
        <link rel="canonical" href={CANONICAL} />
        {isArchive && <meta name="robots" content="noindex,follow" />}
        <meta property="og:title" content="Huddle — Free Connections-style Word Game" />
        <meta property="og:description" content="Sort 16 words into 4 hidden groups. A new puzzle daily, plus unlimited past puzzles. Free, no signup." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Huddle — Free Connections-style Word Game" />
        <meta name="twitter:image" content={OG} />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(HOWTO_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      {/* keyed by day so all game state resets when switching puzzles */}
      <HuddleGame key={day} day={day} today={today} isArchive={isArchive} />

      {/* SEO / explainer content — always rendered (prerenderable, present for crawlers) */}
      <div className="max-w-xl mx-auto mt-10 text-[#4A2D1B] leading-relaxed">
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-2">How to play Huddle</h2>
        <p className="mb-3">
          Huddle is a free daily word-grouping puzzle in the same family as <strong>Connections</strong>. You're shown <strong>16 words</strong>, and your job is to sort them into the <strong>4 hidden groups of 4</strong>. Tap four words that share a connection and hit Submit — a correct group locks in with a colour, from straightforward (yellow) to devious (purple). You can make <strong>four mistakes</strong> before the game ends, and a "one away" hint warns you when three of your four picks belong together.
        </p>
        <p className="mb-3">
          The twist is that some words look like they fit more than one group — spotting the trap is the fun. Solve all four groups to win, then share your spoiler-free colour grid and keep your daily streak alive.
        </p>

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-2">Free, unlimited, no login</h2>
        <p className="mb-3">
          A brand-new Huddle drops every day, and unlike the New York Times Connections you can also replay <strong>past puzzles unlimited</strong> — no subscription, no signup, no download. Missed a day? After finishing, hit <em>Play another puzzle</em> to get a random earlier one.
        </p>

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-2">More daily &amp; party games</h2>
        <p className="mb-4">
          Like quick daily brain games? Try the solo <Link to="/daily" className="text-[#E84A8B] font-semibold underline">Daily Herd</Link>, or play with friends in <Link to="/guesstimate" className="text-[#E84A8B] font-semibold underline">Guesstimate</Link>, <Link to="/say-anything" className="text-[#E84A8B] font-semibold underline">Say Anything</Link>, and <Link to="/clover" className="text-[#E84A8B] font-semibold underline">Clover Clues</Link> — all free, no download.
        </p>

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">Frequently asked questions</h2>
        <div className="space-y-3">
          {FAQS.map(({ q, a }, i) => (
            <div key={i}>
              <h3 style={fredokaStyle} className="text-lg font-bold text-[#2D1810]">{q}</h3>
              <p className="mt-1">{a}</p>
            </div>
          ))}
        </div>
      </div>
    </MeadowLayout>
  );
}

function HuddleGame({ day, today, isArchive }) {
  const navigate = useNavigate();
  const puzzle = getPuzzleForDay(day);
  const game = useHuddle(puzzle, day);
  const { status, solved, mistakes, rows, streak, alreadyPlayed } = game;
  const done = status !== 'playing';
  const { w, h } = useWindowSize();
  const [copied, setCopied] = useState(false);

  // sounds — fire on changes, skip the restored/initial state
  const prev = useRef({ solved: solved.length, mistakes, status });
  useEffect(() => {
    if (alreadyPlayed) { prev.current = { solved: solved.length, mistakes, status }; return; }
    if (solved.length > prev.current.solved && status === 'playing') sfx.match();
    if (mistakes > prev.current.mistakes) sfx.miss();
    if (status === 'won' && prev.current.status === 'playing') sfx.win();
    prev.current = { solved: solved.length, mistakes, status };
  }, [solved.length, mistakes, status, alreadyPlayed]);

  function buildCard() {
    return buildGridCard({
      heading: `Huddle #${day}`,
      big: `${solved.length}/4`,
      sub: status === 'won' ? `solved in ${rows.length} tries` : 'better luck tomorrow',
      rows: rows.map((r) => r.map((lvl) => colorForLevel(lvl))),
      footerLines: ['Can you huddle the herd?', 'herdgamesonline.com/connections'],
      accent: '#4A90D9',
      fileName: `huddle-${day}.png`,
    });
  }

  async function share() {
    const text = buildShareText(day, rows, status === 'won');
    const file = await buildCard();
    const r = await shareCardOrText(file, text, 'Huddle');
    if (r === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  }

  async function saveImage() { downloadFile(await buildCard()); }

  function playRandomPast() {
    if (today <= 1) return;
    const n = 1 + Math.floor(Math.random() * (today - 1));
    navigate(`/connections/${n}`);
  }

  return (
      <div className="relative bg-white/80 rounded-3xl border-4 border-[#FFE8C8] shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)] p-5 md:p-7">
        <MuteButton />

        <div className="text-center mb-5">
          <h1 style={fredokaStyle} className="text-4xl md:text-5xl font-bold text-[#2D1810]">Huddle</h1>
          <p className="text-[#4A2D1B] mt-1">Sort 16 words into 4 hidden groups. {isArchive ? `Puzzle #${day}.` : 'A new puzzle every day.'}</p>
          {isArchive && <Link to="/connections" className="text-[#E84A8B] font-semibold text-sm underline">← Back to today's puzzle</Link>}
        </div>

        <HuddleBoard {...game} />

        {done && (
          <div className="mt-6 text-center">
            {status === 'won' && <Confetti width={w} height={h} numberOfPieces={160} recycle={false} gravity={0.25} />}
            <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810]">
              {status === 'won' ? 'Solved it! 🐑' : 'Out of guesses'}
            </h2>
            <p className="text-[#4A2D1B] mt-1">
              {status === 'won' ? `Nice huddling — in ${rows.length} ${rows.length === 1 ? 'try' : 'tries'}.` : 'The groups are revealed above. Try again tomorrow!'}
            </p>

            {/* emoji grid preview */}
            <div className="mt-3 inline-block bg-[#FFF8E7] rounded-xl px-4 py-3">
              {rows.map((r, i) => (
                <div key={i} className="text-xl leading-7 tracking-widest">{r.map(emojiForLevel).join('')}</div>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button onClick={share} style={{ background: '#E84A8B', fontFamily: 'Fredoka, sans-serif' }}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-white font-bold text-lg hover:scale-105 transition-transform">
                {copied ? <><FiCheck /> Copied!</> : <><FiShare2 /> Share result</>}
              </button>
              <button onClick={saveImage}
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-[#FFE8C8] text-[#2D1810] font-semibold hover:border-[#E84A8B]">
                <FiDownload /> Save image
              </button>
              {today > 1 && (
                <button onClick={playRandomPast}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-[#FFE8C8] text-[#2D1810] font-semibold hover:border-[#E84A8B]">
                  Play another puzzle →
                </button>
              )}
            </div>

            {status === 'won' && (
              <div className="mt-4 inline-flex items-center gap-2 text-[#E84A8B] font-semibold">
                <FaFire /> {streak}-day streak
              </div>
            )}
            {!isArchive && <p className="text-[#4A2D1B] mt-1">A new Huddle drops tomorrow — keep your streak going.</p>}

            <div className="mt-6 text-left max-w-sm mx-auto"><DailyChecklist exclude="huddle" /></div>

            <div className="mt-8 max-h-[300px] overflow-hidden"><AdSlot slot="5698170537" /></div>

            {/* cross-promotion — the hub "play one, try another" loop */}
            <div className="mt-8 pt-6 border-t-2 border-[#FFE8C8]">
              <h2 style={fredokaStyle} className="text-xl font-bold text-[#2D1810] mb-3">More quick games</h2>
              <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
                <Link to="/daily" className="underline text-[#3D8B5A] hover:text-[#2F6E45]">Daily Herd (solo)</Link>
                <Link to="/guesstimate" className="underline text-[#3D8B5A] hover:text-[#2F6E45]">Guesstimate</Link>
                <Link to="/say-anything" className="underline text-[#3D8B5A] hover:text-[#2F6E45]">Say Anything</Link>
                <Link to="/clover" className="underline text-[#3D8B5A] hover:text-[#2F6E45]">Clover Clues</Link>
              </div>
            </div>
          </div>
        )}
      </div>
  );
}
