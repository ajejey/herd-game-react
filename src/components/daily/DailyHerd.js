import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { FiVolume2, FiVolumeX, FiShare2, FiCheck, FiDownload } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import AdSlot from '../AdSlot';
import { Sheep, Wolf } from './HerdCritters';
import { sfx, isMuted, setMuted } from './sfx';
import { getIdentity, buildShareText, buildShareImageFile, recordHistory, readHistory } from './herdIdentity';
import { useDailyHerd } from '../../hooks/useDailyHerd';

const PINK = '#E84A8B';
const GREEN = '#3D8B5A';

const DAILY_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'VideoGame',
  name: 'Daily Herd',
  alternateName: ['Daily Herd Game', 'Daily party game'],
  url: 'https://herdgamesonline.com/daily',
  description: 'A free daily party game: guess what most people will say and match the herd. Five quick questions a day, solo, no signup, no download.',
  image: 'https://herdgamesonline.com/og-daily.png',
  genre: ['Word', 'Trivia', 'Daily', 'Party'],
  gamePlatform: ['Web browser'],
  playMode: 'SinglePlayer',
  applicationCategory: 'GameApplication',
  operatingSystem: 'Any (Web)',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: { '@type': 'Organization', name: 'Herd Game' },
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

// Shown when a shared permalink points to a day that's no longer today.
function ClosedDay({ urlDay, todayDay }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center py-4">
      <div className="flex justify-center gap-1 mb-3">
        {[0, 1, 2].map((i) => <Sheep key={i} size={42} />)}
      </div>
      <h1 style={fredokaStyle} className="text-3xl md:text-4xl font-bold text-[#2D1810]">Herd #{urlDay} has wandered off</h1>
      <p className="text-[#4A2D1B] mt-2">That day's herd has closed — but a fresh one is grazing right now.</p>
      <Link to="/daily" onClick={() => sfx.click()}
        style={{ background: PINK, fontFamily: 'Fredoka, sans-serif' }}
        className="mt-6 inline-block px-10 py-4 rounded-2xl text-white font-bold text-xl hover:scale-105 transition-transform">
        {todayDay != null ? `Play today's herd #${todayDay} →` : "Play today's herd →"}
      </Link>
    </motion.div>
  );
}

// ── Mute toggle ──────────────────────────────────────────────────────────────
function MuteButton() {
  const [muted, setM] = useState(isMuted());
  return (
    <button
      onClick={() => { const v = !muted; setMuted(v); setM(v); if (!v) sfx.click(); }}
      aria-label={muted ? 'Unmute sounds' : 'Mute sounds'}
      className="absolute top-0 right-0 p-2 text-[#8B6347] hover:text-[#2D1810]"
      title={muted ? 'Sound off' : 'Sound on'}
    >
      {muted ? <FiVolumeX size={20} /> : <FiVolume2 size={20} />}
    </button>
  );
}

// ── Intro ────────────────────────────────────────────────────────────────────
function Intro({ dayNumber, streak, onStart, loadState = 'ready' }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center">
      <div className="flex justify-center gap-1 mb-3">
        {[0, 1, 2].map((i) => (
          <motion.span key={i} initial={{ y: 0 }} animate={{ y: [0, -6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.18 }}>
            <Sheep size={44} />
          </motion.span>
        ))}
      </div>
      <h1 style={fredokaStyle} className="text-4xl md:text-5xl font-bold text-[#2D1810]">Daily Herd</h1>
      <p className="text-[#4A2D1B] text-lg mt-1">One herd. Five questions. Can you think like everyone else?</p>

      <div className="bg-[#FFF6E9] rounded-2xl border-2 border-[#FFE8C8] p-5 mt-6 text-left max-w-sm mx-auto">
        <h2 style={fredokaStyle} className="font-bold text-[#2D1810] mb-2">How it works</h2>
        <ol className="text-[#4A2D1B] text-sm space-y-1.5 list-decimal list-inside">
          <li>You'll get <strong>5 quick questions</strong> — the same 5 for everyone today.</li>
          <li>Type the answer you think <strong>most people</strong> will give.</li>
          <li>Match the herd to score. See how the world answered.</li>
          <li>Come back daily to grow your streak.</li>
        </ol>
      </div>

      <div className="flex items-center justify-center gap-3 mt-5 text-sm text-[#8B6347]">
        {dayNumber != null && <span>Herd #{dayNumber}</span>}
        {streak > 0 && (
          <span className="inline-flex items-center gap-1 font-semibold text-[#E84A8B]">
            <FaFire /> {streak}-day streak
          </span>
        )}
      </div>

      {loadState === 'error' ? (
        <>
          <button onClick={() => window.location.reload()}
            style={{ background: PINK, fontFamily: 'Fredoka, sans-serif' }}
            className="mt-6 px-10 py-4 rounded-2xl text-white font-bold text-xl hover:scale-105 transition-transform">
            Couldn't reach the herd — retry
          </button>
          <p className="text-xs text-[#8B6347] mt-2">Check your connection and try again.</p>
        </>
      ) : (
        <button onClick={() => { sfx.click(); onStart(); }} disabled={loadState !== 'ready'}
          style={{ background: PINK, fontFamily: 'Fredoka, sans-serif' }}
          className="mt-6 px-10 py-4 rounded-2xl text-white font-bold text-xl transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-wait">
          {loadState === 'ready' ? "Play today's herd →" : 'Waking the herd…'}
        </button>
      )}
    </motion.div>
  );
}

// ── Playing ──────────────────────────────────────────────────────────────────
function Playing({ questions, onDone, busy, error }) {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState({});
  const [val, setVal] = useState('');
  const inputRef = useRef(null);

  useEffect(() => { setVal(answers[questions[i].id] || ''); inputRef.current?.focus(); }, [i]); // eslint-disable-line

  const q = questions[i];
  const last = i === questions.length - 1;

  function commit() {
    const answer = val.trim();
    if (!answer) return;
    const next = { ...answers, [q.id]: answer };
    setAnswers(next);
    if (last) {
      sfx.next();
      onDone(questions.map((qq) => ({ questionId: qq.id, answer: next[qq.id] })));
    } else {
      sfx.next();
      setI(i + 1);
    }
  }

  return (
    <div>
      {/* progress */}
      <div className="flex items-center justify-between text-sm text-[#8B6347] mb-2">
        <span className="font-semibold">Question {i + 1} of {questions.length}</span>
        <span>Type what MOST people would say</span>
      </div>
      <div className="h-2 bg-[#FFE8C8] rounded-full overflow-hidden mb-6">
        <motion.div className="h-full" style={{ background: GREEN }}
          animate={{ width: `${((i) / questions.length) * 100}%` }} transition={{ duration: 0.3 }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={q.id}
          initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}>
          <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#2D1810] text-center min-h-[4rem] flex items-center justify-center">
            {q.text}
          </h2>

          <input
            ref={inputRef}
            value={val}
            onChange={(e) => setVal(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') commit(); }}
            maxLength={60}
            placeholder="Your answer…"
            className="w-full mt-5 px-5 py-4 rounded-2xl border-2 border-[#FFE8C8] focus:border-[#E84A8B] outline-none text-lg text-center text-[#2D1810] bg-white"
          />
          <p className="text-center text-xs text-[#8B6347] mt-2">Keep it short — one or two words works best.</p>

          <button onClick={commit} disabled={!val.trim() || busy}
            style={{ background: PINK, fontFamily: 'Fredoka, sans-serif' }}
            className="w-full mt-5 py-4 rounded-2xl font-bold text-white text-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-105">
            {busy ? 'Counting the herd…' : last ? 'See how you did →' : 'Next →'}
          </button>
          {error && <p className="text-center text-sm text-red-500 mt-3">{error}</p>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ── Result ───────────────────────────────────────────────────────────────────
function ResultView({ dayNumber, result, streak }) {
  const { w, h } = useWindowSize();
  const [revealed, setRevealed] = useState(0);
  const [copied, setCopied] = useState(false);
  const identity = getIdentity(result.syncPct);
  const done = revealed >= result.perQuestion.length;
  const celebrate = result.syncPct >= 42 || result.syncPct < 8; // very sheep OR very rare wolf
  const history = readHistory();
  const Animal = identity.animal === 'sheep' ? Sheep : Wolf;

  // record today's identity for the weekly trend (once)
  useEffect(() => { recordHistory(dayNumber, identity, result.syncPct); }, []); // eslint-disable-line

  // reveal each question one-by-one with a sound
  useEffect(() => {
    if (revealed >= result.perQuestion.length) { if (celebrate) sfx.win(); return; }
    const q = result.perQuestion[revealed];
    const t = setTimeout(() => {
      q.matched ? sfx.match() : sfx.miss();
      setRevealed((n) => n + 1);
    }, revealed === 0 ? 250 : 750);
    return () => clearTimeout(t);
  }, [revealed]); // eslint-disable-line

  async function share() {
    const text = buildShareText(dayNumber, result, identity);
    try {
      const file = await buildShareImageFile(dayNumber, result, identity);
      if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], text, title: 'Daily Herd' });
        return;
      }
      if (navigator.share) { await navigator.share({ title: 'Daily Herd', text }); return; }
      await navigator.clipboard.writeText(text);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch { /* dismissed */ }
  }

  async function saveImage() {
    const file = await buildShareImageFile(dayNumber, result, identity);
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url; a.download = file.name; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  return (
    <div className="text-center">
      {done && celebrate && <Confetti width={w} height={h} numberOfPieces={180} recycle={false} gravity={0.25} />}

      <p className="text-[#8B6347] text-sm">Daily Herd #{dayNumber}</p>
      {!done && <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-1">Revealing the herd…</h2>}

      {/* per-question reveal — shows YOUR answer's agreement %, even if it's rare */}
      <div className="space-y-3 mt-4 text-left">
        {result.perQuestion.slice(0, revealed).map((q, idx) => {
          const rare = q.yourPct < 10;
          return (
            <motion.div key={idx} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border-2 border-[#FFE8C8] p-4">
              <div className="flex items-start gap-3">
                <span className="shrink-0">{q.matched ? <Sheep size={40} /> : <Wolf size={40} />}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[#2D1810] font-semibold">
                    You said “{q.yourAnswer}” —{' '}
                    <span style={{ color: q.matched ? GREEN : rare ? '#6D4FB0' : '#B06A2C' }}>
                      {q.yourPct}% agreed{q.matched ? ' · top answer!' : rare ? ' · rare!' : ''}
                    </span>
                  </p>
                  <div className="mt-2 space-y-1">
                    {q.topAnswers.map((t, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm">
                        <div className="flex-1 bg-[#FFF1DC] rounded-full h-5 overflow-hidden relative">
                          <motion.div className="h-full" style={{ background: j === 0 ? GREEN : '#FFD56B' }}
                            initial={{ width: 0 }} animate={{ width: `${t.pct}%` }} transition={{ duration: 0.5 }} />
                          <span className="absolute inset-0 flex items-center px-2 text-[#2D1810] font-medium truncate">{t.label}</span>
                        </div>
                        <span className="text-[#8B6347] w-10 text-right">{t.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {done && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {/* THE VERDICT — a daily personality, not a pass/fail score */}
          <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }}
            className="mt-6 rounded-3xl border-4 p-5 bg-white" style={{ borderColor: identity.color + '66' }}>
            <div className="flex justify-center mb-1"><Animal size={72} /></div>
            <p className="text-[#8B6347] text-sm">Today you are a…</p>
            <p style={{ ...fredokaStyle, color: identity.color }} className="text-3xl md:text-4xl font-bold">{identity.name}</p>
            <p style={{ color: identity.color }} className="text-lg font-bold mt-1">{result.syncPct}% in sync with the herd</p>
            <p className="text-sm text-[#8B6347] mt-1">You out-synced {result.beatPct}% of today's herd · {result.responders} played</p>
            <p className="text-[#4A2D1B] mt-2">{identity.tag}</p>
          </motion.div>

          {/* weekly trend */}
          {history.length > 1 && (
            <div className="mt-4">
              <p className="text-xs text-[#8B6347] mb-1">Your recent days</p>
              <div className="flex justify-center items-center gap-1">
                {history.slice(-7).map((e, i) => (
                  <span key={i}>{e.animal === 'sheep' ? <Sheep size={24} /> : <Wolf size={24} />}</span>
                ))}
              </div>
            </div>
          )}

          {/* share */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            <button onClick={share}
              style={{ background: PINK, fontFamily: 'Fredoka, sans-serif' }}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-2xl text-white font-bold text-lg hover:scale-105 transition-transform">
              {copied ? <><FiCheck /> Copied!</> : <><FiShare2 /> Share what you are</>}
            </button>
            <button onClick={saveImage}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl border-2 border-[#FFE8C8] text-[#2D1810] font-semibold hover:border-[#E84A8B]">
              <FiDownload /> Save image
            </button>
          </div>
          <p className="text-xs text-[#8B6347] mt-2">Post it and see what your friends are — sheep or wolf?</p>

          {/* streak */}
          <div className="mt-5 inline-flex items-center gap-2 text-[#E84A8B] font-semibold">
            <FaFire /> {streak}-day streak
          </div>
          <p className="text-[#4A2D1B] mt-1">A new herd drops tomorrow — keep your streak and find out what you'll be.</p>

          <div className="mt-8 max-h-[300px] overflow-hidden"><AdSlot slot="5698170537" /></div>

          <div className="mt-8 pt-6 border-t-2 border-[#FFE8C8]">
            <h2 style={fredokaStyle} className="text-xl font-bold text-[#2D1810] mb-3">Want more? Play with friends</h2>
            <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
              <Link to="/" className="underline text-[#3D8B5A] hover:text-[#2F6E45]">Herd Mentality</Link>
              <Link to="/guesstimate" className="underline text-[#3D8B5A] hover:text-[#2F6E45]">Guesstimate</Link>
              <Link to="/say-anything" className="underline text-[#3D8B5A] hover:text-[#2F6E45]">Say Anything</Link>
              <Link to="/clover" className="underline text-[#3D8B5A] hover:text-[#2F6E45]">Clover Clues</Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function DailyHerd() {
  const game = useDailyHerd();
  const { status, dayNumber, questions, result, streak, error, start, submit } = game;
  const { dayNumber: urlDayParam } = useParams();
  // Only treat an integer param as a specific day; garbage paths just play today.
  const parsed = Number(urlDayParam);
  const urlDay = urlDayParam != null && Number.isInteger(parsed) ? parsed : null;
  // A shared permalink for a day that isn't today → that herd has closed.
  const isClosed = urlDay != null && dayNumber != null && urlDay !== dayNumber;

  return (
    <MeadowLayout maxWidth="max-w-xl">
      <Helmet>
        <title>Daily Herd — Free Daily Party Game (Match the Herd)</title>
        <meta name="description" content="Daily Herd: a free daily game where you guess what most people will say and try to match the herd. 5 quick questions a day, no signup, no download. Play today →" />
        <link rel="canonical" href="https://herdgamesonline.com/daily" />
        <meta property="og:title" content="Daily Herd — Free Daily Party Game" />
        <meta property="og:description" content="Guess what most people will say and match the herd. A new 5-question puzzle every day — free, no signup." />
        <meta property="og:url" content="https://herdgamesonline.com/daily" />
        <meta property="og:image" content="https://herdgamesonline.com/og-daily.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Daily Herd — Free Daily Party Game" />
        <meta name="twitter:image" content="https://herdgamesonline.com/og-daily.png" />
        <script type="application/ld+json">{JSON.stringify(DAILY_SCHEMA)}</script>
      </Helmet>

      <div className="relative bg-white/80 rounded-3xl border-4 border-[#FFE8C8] shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)] p-6 md:p-8">
        <MuteButton />

        {isClosed && <ClosedDay urlDay={urlDay} todayDay={dayNumber} />}
        {!isClosed && <>

        {/* Intro renders for loading/intro/error so the SEO/explainer content is
            always present (prerender can't reach the API) and users are never lost. */}
        {(status === 'loading' || status === 'intro' || status === 'error') && (
          <Intro
            dayNumber={dayNumber}
            streak={streak}
            onStart={start}
            loadState={status === 'error' ? 'error' : status === 'loading' ? 'loading' : 'ready'}
          />
        )}

        {/* Playing stays mounted through 'submitting' so a failed submit keeps
            the user's answers (busy flag drives the button + inline error). */}
        {(status === 'playing' || status === 'submitting') && (
          <Playing questions={questions} onDone={submit} busy={status === 'submitting'} error={error} />
        )}

        {status === 'result' && result && <ResultView dayNumber={dayNumber} result={result} streak={streak} />}

        </>}
      </div>
    </MeadowLayout>
  );
}
