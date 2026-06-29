import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShare2, FiCheck, FiDownload } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import AdSlot from '../AdSlot';
import DailyChecklist from '../DailyChecklist';
import AuraBlob from './AuraBlob';
import { AURA_COLORS, getDayNumber } from './auraData';
import { useAura } from './useAura';
import { buildShareText, buildAuraCard, readHistory } from './share';
import { shareCardOrText, downloadFile } from '../../lib/shareCard';

const CANONICAL = 'https://herdgamesonline.com/aura';
const OG = 'https://herdgamesonline.com/og-image.png';
const soft = { fontFamily: "'Quicksand', system-ui, sans-serif" };

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Daily Aura',
      alternateName: ['Aura Color Test', 'What is my aura', 'Daily aura quiz', 'Aura quiz'],
      url: CANONICAL,
      description: 'A free daily aura quiz: answer a few vibe questions and reveal your aura color of the day, with its meaning. A new aura every day. Solo, no signup, no download.',
      image: OG,
      genre: ['Personality', 'Quiz', 'Daily'],
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
  { q: 'What is a Daily Aura?', a: 'Daily Aura is a free daily quiz: answer a handful of quick vibe questions and reveal your aura color of the day, like Rose, Sage, Lilac or Indigo, each with its own meaning. A new aura drops every day.' },
  { q: 'Is the aura quiz free?', a: 'Yes, completely free. No signup, no download. Your streak is saved on your device.' },
  { q: 'What do the aura colors mean?', a: 'Each aura color reflects an energy: Gold is confident and radiant, Sage is calm and grounded, Rose is warm and loving, Indigo is intuitive and deep, and so on. Your answers gently point to one each day.' },
  { q: 'Can my aura change each day?', a: 'Yes, that is the point. The questions refresh daily and your mood shifts, so your aura can change. Come back to see today’s color and keep your streak.' },
];

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function Aura() {
  const navigate = useNavigate();
  const { dayNumber: param } = useParams();
  const today = getDayNumber();
  const parsed = Number(param);
  const isArchive = param != null && Number.isInteger(parsed) && parsed >= 1 && parsed < today;
  const day = isArchive ? parsed : today;
  useEffect(() => {
    if (param != null && !(Number.isInteger(parsed) && parsed >= 1 && parsed <= today)) navigate('/aura', { replace: true });
  }, [param, parsed, today, navigate]);

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{
        ...soft,
        background:
          'radial-gradient(60% 50% at 18% 12%, #F3E9FF 0%, transparent 60%),' +
          'radial-gradient(55% 45% at 85% 8%, #FFE9F3 0%, transparent 55%),' +
          'radial-gradient(60% 55% at 80% 92%, #E6F7F1 0%, transparent 55%),' +
          '#FBF8FF',
      }}
    >
      <Helmet>
        <title>Daily Aura — What's Your Aura Color Today? Free Aura Quiz</title>
        <meta name="description" content="Reveal your aura color of the day with a free daily aura quiz. Answer a few vibe questions and find out if you're Rose, Gold, Sage, Lilac, Indigo and more. No signup, no download." />
        <link rel="canonical" href={CANONICAL} />
        {isArchive && <meta name="robots" content="noindex,follow" />}
        <meta property="og:title" content="Daily Aura — What's Your Aura Color Today?" />
        <meta property="og:description" content="Answer a few vibe questions and reveal your aura color of the day. A new aura every day — free, no signup." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Daily Aura — What's Your Aura Color Today?" />
        <meta name="twitter:image" content={OG} />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      {/* slim top bar back to the hub */}
      <div className="relative z-10 px-5 pt-5">
        <Link to="/" style={soft} className="text-sm font-semibold text-[#7A6E8C] hover:text-[#4A3FB0]">← Herd Games</Link>
      </div>

      <div className="relative z-10 container mx-auto px-4 pt-6 pb-16 max-w-lg">
        <AuraGame key={day} day={day} isArchive={isArchive} />

        {/* SEO copy */}
        <div className="mt-14 text-[#5C5470] leading-relaxed">
          <h2 style={soft} className="text-2xl font-bold text-[#3A3350] mb-2">What's your aura color today?</h2>
          <p className="mb-3">
            Daily Aura is a free daily aura quiz. Answer a few quick vibe questions, like which sky, drink or flower you'd pick, and reveal your <strong>aura color of the day</strong>: Rose, Coral, Gold, Sage, Aqua, Sky, Lilac or Indigo. Each color carries a meaning, from warm and magnetic to calm and grounded to intuitive and deep. It takes about a minute, there's <strong>no signup and no download</strong>, and a brand-new aura drops every day.
          </p>
          <p className="mb-3">
            Your aura can shift with your mood, so come back daily to see today's color and grow your <strong>streak</strong>. Share your aura card and find out what your friends are. Love quick daily games? Pair it with <Link to="/daily" className="text-[#7A4FB5] font-semibold underline">Daily Herd</Link>, <Link to="/trivia" className="text-[#7A4FB5] font-semibold underline">Daily Trivia</Link> and <Link to="/connections" className="text-[#7A4FB5] font-semibold underline">Huddle</Link>.
          </p>

          <h2 style={soft} className="text-2xl font-bold text-[#3A3350] mt-6 mb-3">Aura colors and their meanings</h2>
          <ul className="grid grid-cols-1 gap-2 mb-4">
            {Object.values(AURA_COLORS).map((c) => (
              <li key={c.id} className="flex items-center gap-3">
                <span className="inline-block w-6 h-6 rounded-full shrink-0" style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }} />
                <span><strong className="text-[#3A3350]">{c.name}</strong> — {c.traits.join(', ')}. {c.line}</span>
              </li>
            ))}
          </ul>

          <h2 style={soft} className="text-2xl font-bold text-[#3A3350] mt-6 mb-3">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <div key={i}>
                <h3 style={soft} className="text-lg font-bold text-[#3A3350]">{q}</h3>
                <p className="mt-1">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AuraGame({ day, isArchive }) {
  const game = useAura(day);
  const { idx, current, total, status, result, streak, alreadyPlayed, start, choose } = game;

  if (status === 'intro') {
    return <Intro day={day} isArchive={isArchive} streak={streak} onStart={start} />;
  }

  if (status === 'playing' && current) {
    return (
      <div className="text-center pt-6">
        <AuraBlob from="#EAD9FF" to="#B6D9F5" size={160} className="mb-6 opacity-80" />
        <p className="text-xs font-semibold text-[#9A93A8] uppercase tracking-widest">Question {idx + 1} of {total}</p>
        <AnimatePresence mode="wait">
          <motion.div key={idx}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.25 }}>
            <h2 style={soft} className="text-2xl md:text-3xl font-bold text-[#3A3350] mt-2 mb-6">{current.q}</h2>
            <div className="grid grid-cols-1 gap-3 max-w-sm mx-auto">
              {current.options.map((opt, i) => (
                <button key={i} onClick={() => choose(i)}
                  style={soft}
                  className="w-full px-5 py-4 rounded-3xl bg-white/70 backdrop-blur border border-white text-[#3A3350] font-semibold shadow-[0_8px_24px_-14px_rgba(90,70,120,0.5)] hover:bg-white hover:-translate-y-0.5 transition-all">
                  {opt.label}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (status === 'done' && result) {
    return <Reveal day={day} isArchive={isArchive} colorId={result.colorId} streak={streak} alreadyPlayed={alreadyPlayed} />;
  }
  return null;
}

function Intro({ day, isArchive, streak, onStart }) {
  return (
    <div className="text-center pt-8">
      <AuraBlob from="#FBD3E9" to="#C9AEFF" size={220} className="mb-6" />
      <h1 style={soft} className="text-4xl md:text-5xl font-bold text-[#3A3350]">Daily Aura</h1>
      <p className="text-[#6B6478] text-lg mt-2">Answer a few vibe questions. Reveal your aura color of the day.</p>
      <div className="flex items-center justify-center gap-3 mt-4 text-sm text-[#9A93A8]">
        <span>Aura #{day}{isArchive ? ' (archive)' : ''}</span>
        {streak > 0 && <span className="inline-flex items-center gap-1 font-semibold text-[#C77DAE]"><FaFire /> {streak}-day streak</span>}
      </div>
      <button onClick={onStart}
        style={{ ...soft, background: 'linear-gradient(135deg, #C77DAE, #9B7DD6)' }}
        className="mt-7 px-10 py-4 rounded-full text-white font-bold text-lg shadow-[0_14px_30px_-12px_rgba(150,110,200,0.7)] hover:scale-105 transition-transform">
        Reveal my aura →
      </button>
    </div>
  );
}

function Reveal({ day, isArchive, colorId, streak, alreadyPlayed }) {
  const c = AURA_COLORS[colorId];
  const [copied, setCopied] = useState(false);
  const history = readHistory();

  async function share() {
    const text = buildShareText(day, colorId);
    const file = await buildAuraCard(day, colorId, streak);
    const r = await shareCardOrText(file, text, 'Daily Aura');
    if (r === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  }
  async function saveImage() { downloadFile(await buildAuraCard(day, colorId, streak)); }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center pt-4">
      <motion.div initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
        <AuraBlob from={c.from} to={c.to} size={260} className="mb-5" />
      </motion.div>

      <p className="text-[#9A93A8] text-sm">{alreadyPlayed ? 'Your aura today' : 'Today you are…'}</p>
      <h1 style={{ ...soft, color: c.ink }} className="text-5xl md:text-6xl font-bold leading-tight">{c.name}</h1>
      <div className="mt-3 flex flex-wrap justify-center gap-2">
        {c.traits.map((t) => (
          <span key={t} style={{ color: c.ink, borderColor: c.to }}
            className="px-3 py-1 rounded-full bg-white/70 border text-sm font-semibold capitalize">{t}</span>
        ))}
      </div>
      <p className="text-[#5C5470] mt-4 max-w-sm mx-auto text-lg">{c.line}</p>

      {history.length > 1 && (
        <div className="mt-6">
          <p className="text-xs text-[#9A93A8] mb-1">Your recent auras</p>
          <div className="flex justify-center items-center gap-1.5">
            {history.slice(-7).map((e) => {
              const h = AURA_COLORS[e.colorId];
              return <span key={e.day} title={`#${e.day} ${h.name}`} className="w-5 h-5 rounded-full" style={{ background: `linear-gradient(135deg, ${h.from}, ${h.to})` }} />;
            })}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button onClick={share} style={{ ...soft, background: c.ink }}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-white font-bold text-lg hover:scale-105 transition-transform">
          {copied ? <><FiCheck /> Copied!</> : <><FiShare2 /> Share my aura</>}
        </button>
        <button onClick={saveImage}
          className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-white/70 border border-white text-[#3A3350] font-semibold hover:bg-white">
          <FiDownload /> Save image
        </button>
      </div>

      <div className="mt-5 inline-flex items-center gap-2 font-semibold" style={{ color: c.ink }}>
        <FaFire /> {streak}-day streak
      </div>
      {!isArchive && <p className="text-[#6B6478] mt-1">A fresh aura drops tomorrow — keep your streak going.</p>}

      <div className="mt-6 text-left max-w-sm mx-auto"><DailyChecklist exclude="daily-aura" /></div>

      <div className="mt-8 max-h-[300px] overflow-hidden"><AdSlot slot="5698170537" /></div>

      <div className="mt-8 pt-6 border-t border-[#EADFF5]">
        <h2 style={soft} className="text-xl font-bold text-[#3A3350] mb-3">More daily games</h2>
        <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
          <Link to="/daily" className="underline text-[#7A4FB5] hover:text-[#5C3A92]">Daily Herd</Link>
          <Link to="/trivia" className="underline text-[#7A4FB5] hover:text-[#5C3A92]">Daily Trivia</Link>
          <Link to="/connections" className="underline text-[#7A4FB5] hover:text-[#5C3A92]">Huddle</Link>
        </div>
      </div>
    </motion.div>
  );
}
