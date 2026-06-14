import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Confetti from 'react-confetti';
import { FiVolume2, FiVolumeX, FiShare2, FiCheck, FiDownload } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import AdSlot from '../AdSlot';
import { sfx, isMuted, setMuted } from '../daily/sfx';
import { getDayNumber, ATTRIBUTION } from './questions';
import TopicGrid from './TopicGrid';
import { buildGridCard, shareCardOrText, downloadFile } from '../../lib/shareCard';
import { useTrivia } from './useTrivia';
import { buildShareText } from './share';

const CANONICAL = 'https://herdgamesonline.com/trivia';
const OG = 'https://herdgamesonline.com/og-daily.png';
const GREEN = '#3D8B5A';
const RED = '#D0463B';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Daily Trivia',
      alternateName: ['Daily Trivia Quiz', 'Free Trivia Game', 'Trivia game online', 'Daily quiz'],
      url: CANONICAL,
      description: 'A free daily trivia quiz: 10 multiple-choice questions across every topic, a new quiz each day. Solo, no signup, no download. Keep your streak.',
      image: OG,
      genre: ['Trivia', 'Quiz', 'Daily'],
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
  name: 'How to play Daily Trivia',
  description: 'Answer 10 multiple-choice trivia questions, one per day.',
  step: [
    { '@type': 'HowToStep', name: 'Read the question', text: 'Each day you get 10 multiple-choice questions across mixed topics.' },
    { '@type': 'HowToStep', name: 'Pick an answer', text: 'Tap one of the four options. You instantly see if it was right.' },
    { '@type': 'HowToStep', name: 'Score and share', text: 'Get your score out of 10, share your spoiler-free result grid, and keep your daily streak.' },
  ],
};

const FAQS = [
  { q: 'Is Daily Trivia free?', a: 'Yes — completely free, no signup and no download. A new 10-question quiz drops every day.' },
  { q: 'How many questions are there each day?', a: 'Ten multiple-choice questions across mixed topics — geography, science, history, sport, entertainment, food and more. It takes about two to three minutes.' },
  { q: 'Can I play yesterday’s quiz?', a: 'Yes. After finishing today’s quiz you can replay past days, so you can play more than one quiz whenever you like.' },
  { q: 'Do I need an account?', a: 'No. Your streak is saved on your device. Just open it and play.' },
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

export default function Trivia() {
  const navigate = useNavigate();
  const { dayNumber: param } = useParams();
  const today = getDayNumber();
  const parsed = Number(param);
  const isArchive = param != null && Number.isInteger(parsed) && parsed >= 1 && parsed < today;
  const day = isArchive ? parsed : today;
  useEffect(() => {
    if (param != null && !(Number.isInteger(parsed) && parsed >= 1 && parsed <= today)) navigate('/trivia', { replace: true });
  }, [param, parsed, today, navigate]);

  return (
    <MeadowLayout maxWidth="max-w-xl">
      <Helmet>
        <title>Daily Trivia — Free Online Quiz Game, 10 Questions a Day</title>
        <meta name="description" content="Play Daily Trivia free: 10 multiple-choice questions across every topic, a new quiz every day. No signup, no download — test your knowledge and keep your streak." />
        <link rel="canonical" href={CANONICAL} />
        {isArchive && <meta name="robots" content="noindex,follow" />}
        <meta property="og:title" content="Daily Trivia — Free Online Quiz Game" />
        <meta property="og:description" content="10 trivia questions a day across every topic. Free, no signup. Test your knowledge and keep your streak." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Daily Trivia — Free Online Quiz Game" />
        <meta name="twitter:image" content={OG} />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(HOWTO_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <TriviaGame key={day} day={day} today={today} isArchive={isArchive} />

      <div className="max-w-xl mx-auto mt-10 text-[#4A2D1B] leading-relaxed">
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-2">A new free trivia quiz every day</h2>
        <p className="mb-3">
          Daily Trivia is a free online quiz game: <strong>10 multiple-choice questions</strong> across mixed topics — geography, science, history, sport, entertainment, food and general knowledge. A brand-new quiz drops every day, it takes two to three minutes, and there's <strong>no signup and no download</strong>. Answer each question, see instantly if you were right, get your score out of 10, and share your spoiler-free result.
        </p>
        <p className="mb-3">
          Come back daily to build your <strong>streak</strong>, and replay past days any time you want more than one quiz. Like quick daily brain games? Pair it with the solo <Link to="/daily" className="text-[#E84A8B] font-semibold underline">Daily Herd</Link> and <Link to="/connections" className="text-[#E84A8B] font-semibold underline">Huddle</Link>, or play with friends in <Link to="/guesstimate" className="text-[#E84A8B] font-semibold underline">Guesstimate</Link>, <Link to="/say-anything" className="text-[#E84A8B] font-semibold underline">Say Anything</Link>, and <Link to="/clover" className="text-[#E84A8B] font-semibold underline">Clover Clues</Link>.
        </p>

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">Trivia by topic</h2>
        <p className="mb-3">Prefer a specific subject? Play a quick quiz on any of these — fresh questions every time, or browse the <Link to="/trivia-games" className="text-[#E84A8B] font-semibold underline">full list of trivia games</Link>:</p>
        <div className="mb-4"><TopicGrid /></div>

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">Frequently asked questions</h2>
        <div className="space-y-3">
          {FAQS.map(({ q, a }, i) => (
            <div key={i}>
              <h3 style={fredokaStyle} className="text-lg font-bold text-[#2D1810]">{q}</h3>
              <p className="mt-1">{a}</p>
            </div>
          ))}
        </div>

        {ATTRIBUTION && <p className="text-[#8B6347] text-xs italic mt-8 text-center">{ATTRIBUTION}</p>}
      </div>
    </MeadowLayout>
  );
}

function TriviaGame({ day, today, isArchive }) {
  const navigate = useNavigate();
  const game = useTrivia(day);
  const { idx, current, selected, answered, marks, status, score, total, streak, alreadyPlayed, answer, next } = game;
  const done = status === 'done';
  const { w, h } = useWindowSize();
  const [copied, setCopied] = useState(false);

  // sound on each answer (skip restored state)
  const lastAnswered = useRef(answered);
  useEffect(() => {
    if (alreadyPlayed) { lastAnswered.current = answered; return; }
    if (answered && !lastAnswered.current) {
      marks[marks.length - 1] ? sfx.match() : sfx.miss();
    }
    lastAnswered.current = answered;
  }, [answered, alreadyPlayed]); // eslint-disable-line
  useEffect(() => { if (done && !alreadyPlayed && score >= Math.ceil(total * 0.7)) sfx.win(); }, [done]); // eslint-disable-line

  function buildCard() {
    // 10 marks → two rows of 5 coloured squares
    const cells = marks.map((m) => (m ? '#3D8B5A' : '#D0463B'));
    const rows = [cells.slice(0, 5), cells.slice(5)];
    return buildGridCard({
      heading: `Daily Trivia #${day}`,
      big: `${score}/${total}`,
      sub: streak > 0 ? `${streak}-day streak` : '',
      rows,
      footerLines: ['How well do you know?', 'herdgamesonline.com/trivia'],
      accent: '#3D8B5A',
      fileName: `daily-trivia-${day}.png`,
    });
  }

  async function share() {
    const text = buildShareText(day, marks, score, streak);
    const file = await buildCard();
    const r = await shareCardOrText(file, text, 'Daily Trivia');
    if (r === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  }

  async function saveImage() { downloadFile(await buildCard()); }

  function playRandomPast() {
    if (today <= 1) return;
    navigate(`/trivia/${1 + Math.floor(Math.random() * (today - 1))}`);
  }

  return (
    <div className="relative bg-white/80 rounded-3xl border-4 border-[#FFE8C8] shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)] p-5 md:p-7">
      <MuteButton />

      <div className="text-center mb-4">
        <h1 style={fredokaStyle} className="text-4xl md:text-5xl font-bold text-[#2D1810]">Daily Trivia</h1>
        <p className="text-[#4A2D1B] mt-1">10 questions a day. {isArchive ? `Quiz #${day}.` : 'A new quiz every day.'}</p>
        {isArchive && <Link to="/trivia" className="text-[#E84A8B] font-semibold text-sm underline">← Back to today's quiz</Link>}
      </div>

      {/* progress marks */}
      <div className="flex justify-center gap-1 mb-4 flex-wrap">
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} className="text-base">
            {i < marks.length ? (marks[i] ? '🟩' : '🟥') : (i === idx && !done ? '⬜' : '·')}
          </span>
        ))}
      </div>

      {!done && current && (
        <div>
          <p className="text-center text-xs font-semibold text-[#8B6347] uppercase tracking-wide">
            Question {idx + 1} of {total} · {current.category}
          </p>
          <h2 style={fredokaStyle} className="text-xl md:text-2xl font-bold text-[#2D1810] text-center mt-2 mb-5">{current.q}</h2>
          <div className="grid grid-cols-1 gap-2.5">
            {current.options.map((opt, i) => {
              let bg = '#FFF1DC', color = '#2D1810', border = '#FFE8C8';
              if (answered) {
                if (i === current.answerIndex) { bg = GREEN; color = '#fff'; border = GREEN; }
                else if (i === selected) { bg = RED; color = '#fff'; border = RED; }
              }
              return (
                <button key={i} onClick={() => answer(i)} disabled={answered}
                  style={{ background: bg, color, borderColor: border }}
                  className="w-full text-left px-4 py-3 rounded-2xl border-2 font-semibold transition-colors disabled:cursor-default hover:brightness-95">
                  {opt}
                </button>
              );
            })}
          </div>
          {answered && (
            <div className="mt-5 text-center">
              <button onClick={next} style={{ background: '#2D1810', fontFamily: 'Fredoka, sans-serif' }}
                className="px-8 py-3 rounded-2xl text-white font-bold">
                {idx < total - 1 ? 'Next →' : 'See result'}
              </button>
            </div>
          )}
        </div>
      )}

      {done && (
        <div className="mt-2 text-center">
          {score >= Math.ceil(total * 0.7) && <Confetti width={w} height={h} numberOfPieces={160} recycle={false} gravity={0.25} />}
          <h2 style={fredokaStyle} className="text-3xl font-bold text-[#2D1810]">{score}/{total}</h2>
          <p className="text-[#4A2D1B] mt-1">
            {score === total ? 'Flawless! 🐑' : score >= Math.ceil(total * 0.7) ? 'Sharp herd brain!' : score >= total / 2 ? 'Solid effort.' : 'The herd will get you tomorrow!'}
          </p>

          <div className="mt-3 inline-block bg-[#FFF8E7] rounded-xl px-4 py-3 text-xl tracking-widest">
            {marks.map((m) => (m ? '🟩' : '🟥')).join('')}
          </div>

          <p className="text-[#8B6347] text-sm mt-3 max-w-xs mx-auto">
            {score === total ? 'Nobody will believe this — make them try.'
              : score >= Math.ceil(total * 0.7) ? 'Flex it — dare a friend to beat your score.'
              : score >= total / 2 ? 'Send it to a friend and see who scores higher.'
              : 'Misery loves company — challenge a friend to do worse.'}
          </p>

          <div className="mt-3 flex flex-wrap justify-center gap-2">
            <button onClick={share} style={{ background: '#E84A8B', fontFamily: 'Fredoka, sans-serif' }}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-white font-bold text-lg hover:scale-105 transition-transform">
              {copied ? <><FiCheck /> Copied!</> : <><FiShare2 /> Challenge a friend</>}
            </button>
            <button onClick={saveImage}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-[#FFE8C8] text-[#2D1810] font-semibold hover:border-[#E84A8B]">
              <FiDownload /> Save image
            </button>
            {today > 1 && (
              <button onClick={playRandomPast}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-[#FFE8C8] text-[#2D1810] font-semibold hover:border-[#E84A8B]">
                Play another quiz →
              </button>
            )}
          </div>

          <div className="mt-4 inline-flex items-center gap-2 text-[#E84A8B] font-semibold">
            <FaFire /> {streak}-day streak
          </div>
          {!isArchive && <p className="text-[#4A2D1B] mt-1">A new quiz drops tomorrow — keep your streak going.</p>}

          {/* Want more now? Send them into a topic quiz they can replay instantly. */}
          <div className="mt-8 pt-6 border-t-2 border-[#FFE8C8] text-left">
            <h2 style={fredokaStyle} className="text-xl font-bold text-[#2D1810] mb-1 text-center">Want more? Pick a topic</h2>
            <p className="text-[#8B6347] text-sm mb-3 text-center">Fresh questions every time — play as many as you like.</p>
            <TopicGrid compact />
            <div className="text-center mt-3">
              <Link to="/trivia-games" className="text-[#E84A8B] font-semibold underline text-sm">See all trivia games →</Link>
            </div>
          </div>

          <div className="mt-8 max-h-[300px] overflow-hidden"><AdSlot slot="5698170537" /></div>

          <div className="mt-8 pt-6 border-t-2 border-[#FFE8C8]">
            <h2 style={fredokaStyle} className="text-xl font-bold text-[#2D1810] mb-3">More daily games</h2>
            <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
              <Link to="/daily" className="underline text-[#3D8B5A] hover:text-[#2F6E45]">Daily Herd</Link>
              <Link to="/connections" className="underline text-[#3D8B5A] hover:text-[#2F6E45]">Huddle</Link>
              <Link to="/guesstimate" className="underline text-[#3D8B5A] hover:text-[#2F6E45]">Guesstimate</Link>
              <Link to="/say-anything" className="underline text-[#3D8B5A] hover:text-[#2F6E45]">Say Anything</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
