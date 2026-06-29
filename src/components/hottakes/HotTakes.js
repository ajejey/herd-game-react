import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShare2, FiCheck, FiDownload } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import AdSlot from '../AdSlot';
import DailyChecklist from '../DailyChecklist';
import { useHotTakes } from './useHotTakes';
import { ARCHETYPES, spiceLabel, THEME, HEAVY, BODY } from './hotTakeData';
import { buildShareText, buildHotTakeCard } from './share';
import { shareCardOrText, downloadFile } from '../../lib/shareCard';

const CANONICAL = 'https://herdgamesonline.com/hot-takes';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Daily Hot Takes',
      alternateName: ['Hot Takes quiz', 'This or that game', 'Would you rather daily', 'Daily opinion quiz'],
      url: CANONICAL,
      description: 'A free daily this-or-that opinion game. Answer a few spicy hot takes, reveal your opinion archetype, and see how the crowd actually split. New takes every day, no signup.',
      image: OG, genre: ['Personality', 'Quiz', 'Daily'], gamePlatform: ['Web browser'], playMode: 'SinglePlayer',
      applicationCategory: 'GameApplication', operatingSystem: 'Any (Web)',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, publisher: { '@type': 'Organization', name: 'Herd Game' },
    },
  ],
};
const FAQS = [
  { q: 'What is Daily Hot Takes?', a: 'A free daily this-or-that game: answer a handful of spicy opinion questions, reveal your opinion archetype, and see how the rest of the crowd answered each one. A new set drops every day.' },
  { q: 'Is it free?', a: 'Yes, completely free. No signup, no download. Your streak is saved on your device.' },
  { q: 'What does the “spice” score mean?', a: 'It counts how many of your takes put you in the minority. The more often you disagree with the crowd, the spicier your score.' },
  { q: 'Do new questions come every day?', a: 'Yes. A fresh set of takes drops daily, and the crowd split updates live as people answer.' },
];
const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };

export default function HotTakes() {
  const game = useHotTakes();
  const { status, dayNumber, questions, result, streak, error, start, submit } = game;

  return (
    <div className="min-h-screen relative" style={{ ...BODY, background: THEME.paper, color: THEME.ink }}>
      <Helmet>
        <title>Daily Hot Takes — Free This-or-That Opinion Game</title>
        <meta name="description" content="Daily Hot Takes: a free this-or-that opinion game. Answer a few spicy takes, reveal your opinion archetype, and see how the crowd split. New takes every day, no signup." />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Daily Hot Takes — Free This-or-That Opinion Game" />
        <meta property="og:description" content="Answer a few spicy takes, get your opinion archetype, and see how the crowd split. New every day, free, no signup." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Daily Hot Takes — Free This-or-That Opinion Game" />
        <meta name="twitter:image" content={OG} />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <div className="px-5 pt-5"><Link to="/" className="text-sm font-semibold" style={{ color: THEME.mut }}>← Herd Games</Link></div>

      <div className="container mx-auto px-4 pt-6 pb-16 max-w-lg">
        {(status === 'loading' || status === 'intro' || status === 'error') && (
          <Intro dayNumber={dayNumber} streak={streak} onStart={start}
            loadState={status === 'error' ? 'error' : status === 'loading' ? 'loading' : 'ready'} error={error} />
        )}
        {(status === 'playing' || status === 'submitting') && (
          <Playing questions={questions} onDone={submit} busy={status === 'submitting'} error={error} />
        )}
        {status === 'result' && result && <Reveal day={dayNumber} result={result} streak={streak} />}

        {/* SEO copy */}
        <div className="mt-14 leading-relaxed" style={{ color: '#5C534C' }}>
          <h2 style={HEAVY} className="text-2xl mb-2" >A free daily opinion game</h2>
          <p className="mb-3">Daily Hot Takes is a free <strong>this-or-that opinion game</strong>. Each day you get a fresh set of spicy takes, like big party or small gathering, call or text, plan it out or go with the flow. Pick a side on each, reveal your <strong>opinion archetype</strong> (Maximalist, Minimalist, Romantic, Pragmatist, Rebel or Connector), and see the <strong>crowd split</strong> on every question, so you know whether you are with the majority or the spicy minority. No signup, no download, and a new set drops every day.</p>
          <p className="mb-3">The more often your takes go against the crowd, the spicier your score. Come back daily to keep your <strong>streak</strong> and share your archetype. Like quick daily games? Pair it with <Link to="/aura" className="font-semibold underline" style={{ color: THEME.hot }}>Daily Aura</Link>, <Link to="/daily" className="font-semibold underline" style={{ color: THEME.hot }}>Daily Herd</Link> and <Link to="/trivia" className="font-semibold underline" style={{ color: THEME.hot }}>Daily Trivia</Link>.</p>

          <h2 style={HEAVY} className="text-2xl mt-6 mb-3">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <div key={i}><h3 style={HEAVY} className="text-lg">{q}</h3><p className="mt-1">{a}</p></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Intro({ dayNumber, streak, onStart, loadState, error }) {
  return (
    <div className="text-center pt-8">
      <p style={{ color: THEME.hot }} className="font-bold tracking-widest uppercase text-sm">🌶️ Daily</p>
      <h1 style={HEAVY} className="text-5xl md:text-6xl mt-1">Hot Takes</h1>
      <p className="text-lg mt-3" style={{ color: THEME.mut }}>A few this-or-that opinions. Find your archetype. See where the crowd lands.</p>
      <div className="flex items-center justify-center gap-3 mt-4 text-sm" style={{ color: THEME.mut }}>
        {dayNumber != null && <span>Takes #{dayNumber}</span>}
        {streak > 0 && <span className="inline-flex items-center gap-1 font-semibold" style={{ color: THEME.hot }}><FaFire /> {streak}-day streak</span>}
      </div>
      {loadState === 'error' ? (
        <>
          <button onClick={() => window.location.reload()} style={{ ...HEAVY, background: THEME.ink }} className="mt-7 px-10 py-4 rounded-full text-white text-lg">Couldn’t load — retry</button>
          {error && <p className="text-sm mt-2" style={{ color: THEME.mut }}>{error}</p>}
        </>
      ) : (
        <button onClick={onStart} disabled={loadState !== 'ready'} style={{ ...HEAVY, background: THEME.hot }}
          className="mt-7 px-10 py-4 rounded-full text-white text-lg transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-wait">
          {loadState === 'ready' ? 'Give me the takes →' : 'Loading…'}
        </button>
      )}
    </div>
  );
}

function Playing({ questions, onDone, busy, error }) {
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState([]);
  const [awaiting, setAwaiting] = useState(false); // all picked; submitting or retryable
  const q = questions[idx];
  const last = idx === questions.length - 1;

  function pick(optIdx) {
    if (busy || awaiting) return;
    const next = [...picks, { questionId: q.id, optIdx }];
    setPicks(next);
    if (last) { setAwaiting(true); onDone(next); }
    else setIdx((i) => i + 1);
  }

  // Final submit failed — let them retry without re-answering (no extra picks).
  if (awaiting) {
    return (
      <div className="text-center pt-16">
        {busy ? (
          <p style={HEAVY} className="text-2xl" >Counting the crowd…</p>
        ) : (
          <>
            <p className="text-lg mb-4" style={{ color: THEME.hot }}>{error || 'Something went wrong.'}</p>
            <button onClick={() => onDone(picks)} style={{ ...HEAVY, background: THEME.ink }} className="px-8 py-3 rounded-full text-white">Try again</button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="pt-6">
      <div className="flex items-center justify-between text-sm mb-3" style={{ color: THEME.mut }}>
        <span className="font-semibold">Take {idx + 1} of {questions.length}</span>
        <span>Pick a side</span>
      </div>
      <div className="h-1.5 rounded-full mb-7" style={{ background: '#EFE4DA' }}>
        <motion.div className="h-full rounded-full" style={{ background: THEME.hot }} animate={{ width: `${(idx / questions.length) * 100}%` }} transition={{ duration: 0.3 }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.22 }}>
          <h2 style={HEAVY} className="text-3xl md:text-4xl text-center mb-7">{q.prompt}</h2>
          <div className="grid gap-3">
            {q.options.map((label, i) => (
              <button key={i} onClick={() => pick(i)} style={{ ...HEAVY, borderColor: i === 0 ? THEME.hot : THEME.cool, color: THEME.ink }}
                className="w-full px-5 py-6 rounded-2xl bg-white border-2 text-xl shadow-[0_8px_22px_-16px_rgba(0,0,0,0.5)] hover:-translate-y-0.5 transition-all"
                onMouseEnter={(e) => { e.currentTarget.style.background = (i === 0 ? THEME.hot : THEME.cool); e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = THEME.ink; }}>
                {label}
              </button>
            ))}
          </div>
          <p className="text-center text-xs mt-3" style={{ color: THEME.mut }}>No wrong answers. Just yours.</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function Reveal({ day, result, streak }) {
  const a = ARCHETYPES[result.archetype];
  const s = spiceLabel(result.spice, result.total);
  const [copied, setCopied] = useState(false);

  async function share() {
    const text = buildShareText(day, result);
    const file = await buildHotTakeCard(day, result, streak);
    const r = await shareCardOrText(file, text, 'Daily Hot Takes');
    if (r === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  }
  async function saveImage() { downloadFile(await buildHotTakeCard(day, result, streak)); }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center pt-4">
      <p className="text-sm" style={{ color: THEME.mut }}>Your opinion archetype</p>
      <motion.h1 initial={{ scale: 0.9 }} animate={{ scale: 1 }} style={{ ...HEAVY, color: a.color }} className="text-5xl md:text-6xl leading-tight mt-1">{a.name}</motion.h1>
      <div className="text-6xl mt-2" aria-hidden="true">{a.swatch}</div>
      <div className="mt-2 flex flex-wrap justify-center gap-2">
        {a.traits.map((t) => (
          <span key={t} className="px-3 py-1 rounded-full bg-white border text-sm font-semibold capitalize" style={{ color: a.color, borderColor: a.color + '55' }}>{t}</span>
        ))}
      </div>
      <p className="mt-4 max-w-sm mx-auto text-lg" style={{ color: '#5C534C' }}>{a.line}</p>

      {/* spice */}
      <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border" style={{ borderColor: '#EADBCF' }}>
        <span className="font-bold" style={{ color: THEME.ink }}>{s.label}</span>
        <span aria-hidden="true">{s.chili}</span>
        <span className="text-sm" style={{ color: THEME.mut }}>· {result.spice}/{result.total} against the crowd</span>
      </div>

      {/* crowd split per take */}
      <div className="mt-7 text-left space-y-3">
        <p className="text-sm font-semibold text-center" style={{ color: THEME.mut }}>How the crowd split{result.responders > 1 ? ` · ${result.responders} played` : ''}</p>
        {result.perQuestion.map((pq, i) => {
          const minority = pq.yourPct < 50;
          return (
            <div key={i} className="bg-white rounded-2xl border p-4" style={{ borderColor: '#EFE4DA' }}>
              <p className="font-semibold text-sm" style={{ color: THEME.ink }}>{pq.prompt}</p>
              {/* label sits ABOVE the bar so text never overlaps the fill */}
              <div className="mt-2 flex items-baseline justify-between gap-2 text-sm">
                <span className="font-semibold" style={{ color: THEME.ink }}>You: {pq.yourLabel}</span>
                <span className="font-bold shrink-0" style={{ color: minority ? THEME.hot : THEME.cool }}>
                  {pq.yourPct}% agree{minority ? ' · spicy 🌶️' : ''}
                </span>
              </div>
              <div className="mt-2 h-3 rounded-full overflow-hidden" style={{ background: '#F3EAE2' }}>
                <motion.div className="h-full rounded-full" style={{ background: minority ? THEME.hot : THEME.cool }}
                  initial={{ width: 0 }} animate={{ width: `${pq.yourPct}%` }} transition={{ duration: 0.5 }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <button onClick={share} style={{ ...HEAVY, background: a.color }} className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-white text-lg hover:scale-105 transition-transform">
          {copied ? <><FiCheck /> Copied!</> : <><FiShare2 /> Share my takes</>}
        </button>
        <button onClick={saveImage} className="inline-flex items-center gap-2 px-4 py-3 rounded-full bg-white border font-semibold" style={{ borderColor: '#EADBCF', color: THEME.ink }}>
          <FiDownload /> Save image
        </button>
      </div>

      <div className="mt-5 inline-flex items-center gap-2 font-semibold" style={{ color: THEME.hot }}><FaFire /> {streak}-day streak</div>
      <p className="mt-1" style={{ color: THEME.mut }}>Fresh takes drop tomorrow — keep your streak going.</p>

      <div className="mt-6 text-left max-w-sm mx-auto"><DailyChecklist exclude="daily-hot-takes" /></div>

      <div className="mt-8 max-h-[300px] overflow-hidden"><AdSlot slot="5698170537" /></div>

      <div className="mt-8 pt-6 border-t" style={{ borderColor: '#EFE4DA' }}>
        <h2 style={HEAVY} className="text-xl mb-3">More daily games</h2>
        <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
          <Link to="/aura" className="underline" style={{ color: THEME.hot }}>Daily Aura</Link>
          <Link to="/daily" className="underline" style={{ color: THEME.hot }}>Daily Herd</Link>
          <Link to="/trivia" className="underline" style={{ color: THEME.hot }}>Daily Trivia</Link>
        </div>
      </div>
    </motion.div>
  );
}
