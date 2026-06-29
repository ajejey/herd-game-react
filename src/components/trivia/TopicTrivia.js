import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Confetti from 'react-confetti';
import { FiShare2, FiCheck, FiDownload } from 'react-icons/fi';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import AdSlot from '../AdSlot';
import { getTopic } from './topics';
import TopicGrid from './TopicGrid';
import DailyChecklist from '../DailyChecklist';
import { getQuestionsByCategory, categoryCount, shuffleQuiz } from './questions';
import { buildGridCard, shareCardOrText, downloadFile } from '../../lib/shareCard';

const GREEN = '#3D8B5A';
const RED = '#D0463B';

export default function TopicTrivia({ slug }) {
  const topic = getTopic(slug);
  // Franchise topics (e.g. Harry Potter) carry their own curated `questions`;
  // category topics (e.g. Music) draw from the shared daily pool by category.
  const poolCount = topic ? (topic.questions ? topic.questions.length : categoryCount(topic.categories)) : 0;
  const buildQuiz = () => (topic.questions ? shuffleQuiz(topic.questions, 10) : getQuestionsByCategory(topic.categories, 10));
  const total = Math.min(10, poolCount);

  const [quiz, setQuiz] = useState(() => (topic ? buildQuiz() : []));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [marks, setMarks] = useState([]);
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!topic) return <MeadowLayout><p className="text-center">Topic not found. <Link to="/trivia" className="underline text-[#E84A8B]">Play Daily Trivia →</Link></p></MeadowLayout>;

  const canonical = `https://herdgamesonline.com/${topic.slug}`;
  const count = poolCount;
  const current = quiz[idx];
  const score = marks.filter(Boolean).length;

  const SCHEMA = {
    '@context': 'https://schema.org', '@type': 'VideoGame',
    name: `${topic.h1}`, url: canonical,
    description: `Free ${topic.name} trivia quiz — ${count}+ questions, play instantly, no signup.`,
    genre: ['Trivia', 'Quiz'], gamePlatform: ['Web browser'], playMode: 'SinglePlayer',
    applicationCategory: 'GameApplication', operatingSystem: 'Any (Web)',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
  const FAQS = [
    { q: `Is ${topic.h1} free?`, a: `Yes — it’s completely free, with no signup or download. Just press play and answer.` },
    { q: `How many ${topic.name.toLowerCase()} questions are there?`, a: `There are ${count}+ ${topic.name.toLowerCase()} trivia questions, and each quiz gives you a fresh shuffled set — play again any time for new questions.` },
    { q: `Can I play with my team or friends?`, a: `This is a quick solo quiz, but for groups try Team Trivia — a live multiplayer trivia game where everyone joins from their own device.` },
  ];
  const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };

  function answer(i) {
    if (answered) return;
    setSelected(i); setAnswered(true);
    setMarks((m) => [...m, i === current.answerIndex]);
  }
  function next() {
    if (!answered) return;
    if (idx < quiz.length - 1) { setIdx(idx + 1); setSelected(null); setAnswered(false); }
    else setDone(true);
  }
  // Score tier drives the result card gradient/badge (same look as Daily Trivia).
  const tier =
    score === total ? { c1: '#FFD86B', c2: '#FF8A3D', label: 'Flawless!', icon: '🏆' } :
    score >= Math.ceil(total * 0.7) ? { c1: '#FF8FB1', c2: '#E84A8B', label: 'Sharp!', icon: '🔥' } :
    score >= total / 2 ? { c1: '#8FD3A6', c2: '#3D8B5A', label: 'Solid effort.', icon: '👏' } :
    { c1: '#B7C0CE', c2: '#7A8699', label: 'Try again!', icon: '🐑' };

  // Spoiler-free, score-tailored share text. The shared link is THIS topic page,
  // so friends land on the same quiz (good for virality + SEO).
  function shareText() {
    const grid = marks.map((m) => (m ? '🟩' : '🟥')).join('');
    const pct = total ? score / total : 0;
    let emoji, hook;
    if (score === total) { emoji = '🏆'; hook = 'Bet you can’t match it:'; }
    else if (pct >= 0.7) { emoji = '🔥'; hook = 'Think you can beat me?'; }
    else if (pct >= 0.4) { emoji = '🙂'; hook = 'Bet you can do better:'; }
    else { emoji = '😅'; hook = 'I bombed it — try to beat me:'; }
    return `${topic.h1} — ${score}/${total} ${emoji}\n${grid}\n\n${hook} ${canonical}`;
  }
  function buildCard() {
    const colors = marks.map((m) => (m ? GREEN : RED));
    const rows = [];
    for (let i = 0; i < colors.length; i += 5) rows.push(colors.slice(i, i + 5));
    return buildGridCard({
      heading: topic.h1, big: `${score}/${total}`, sub: 'herdgamesonline.com',
      rows, footerLines: [tier.label, 'Play free — no signup'], accent: '#E84A8B',
      fileName: `${topic.slug}.png`,
    });
  }
  async function share() {
    const file = await buildCard();
    const r = await shareCardOrText(file, shareText(), topic.h1);
    if (r === 'copied') { setCopied(true); setTimeout(() => setCopied(false), 2000); }
  }
  async function saveImage() { downloadFile(await buildCard()); }

  function playAgain() {
    setQuiz(buildQuiz());
    setIdx(0); setSelected(null); setAnswered(false); setMarks([]); setDone(false); setCopied(false);
  }

  return (
    <MeadowLayout maxWidth="max-w-xl">
      <Helmet>
        <title>{topic.title}</title>
        <meta name="description" content={`Play ${topic.h1} free online: ${count}+ ${topic.name.toLowerCase()} trivia questions, instant play, no signup. Test your knowledge and beat your score.`} />
        <link rel="canonical" href={canonical} />
        <meta name="keywords" content={topic.keyword} />
        <meta property="og:title" content={topic.title} />
        <meta property="og:description" content={`${count}+ free ${topic.name.toLowerCase()} trivia questions. Play instantly, no signup.`} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content="https://herdgamesonline.com/og-image.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={topic.title} />
        <meta name="twitter:image" content="https://herdgamesonline.com/og-image.png" />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <div className="text-center mb-5">
        <h1 style={fredokaStyle} className="text-4xl md:text-5xl font-bold text-[#2D1810]">{topic.emoji} {topic.h1}</h1>
        <p className="text-[#4A2D1B] mt-1">{topic.blurb}</p>
      </div>

      <div className="bg-white/80 rounded-3xl border-4 border-[#FFE8C8] shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)] p-5 md:p-7">
        {/* progress */}
        <div className="flex justify-center gap-1 mb-4 flex-wrap">
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} className="text-base">{i < marks.length ? (marks[i] ? '🟩' : '🟥') : (i === idx && !done ? '⬜' : '·')}</span>
          ))}
        </div>

        {!done && current && (
          <div>
            <p className="text-center text-xs font-semibold text-[#8B6347] uppercase tracking-wide">Question {idx + 1} of {quiz.length}</p>
            <h2 style={fredokaStyle} className="text-xl md:text-2xl font-bold text-[#2D1810] text-center mt-2 mb-5">{current.q}</h2>
            <div className="grid grid-cols-1 gap-2.5">
              {current.options.map((opt, i) => {
                let bg = '#FFF1DC', color = '#2D1810', border = '#FFE8C8';
                if (answered) {
                  if (i === current.answerIndex) { bg = GREEN; color = '#fff'; border = GREEN; }
                  else if (i === selected) { bg = RED; color = '#fff'; border = RED; }
                }
                return (
                  <button key={i} onClick={() => answer(i)} disabled={answered} style={{ background: bg, color, borderColor: border }}
                    className="w-full text-left px-4 py-3 rounded-2xl border-2 font-semibold transition-colors disabled:cursor-default hover:brightness-95">
                    {opt}
                  </button>
                );
              })}
            </div>
            {answered && (
              <div className="mt-5 text-center">
                <button onClick={next} style={{ background: '#2D1810', fontFamily: 'Fredoka, sans-serif' }} className="px-8 py-3 rounded-2xl text-white font-bold">
                  {idx < quiz.length - 1 ? 'Next →' : 'See score'}
                </button>
              </div>
            )}
          </div>
        )}

        {done && (
          <div className="text-center">
            {score >= Math.ceil(total * 0.7) && typeof window !== 'undefined' && (
              <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={150} recycle={false} gravity={0.25} />
            )}

            {/* Result hero card */}
            <div
              className="relative mx-auto max-w-sm rounded-[28px] px-6 py-7 text-white overflow-hidden shadow-[0_22px_45px_-18px_rgba(45,24,16,0.45)]"
              style={{ background: `linear-gradient(140deg, ${tier.c1}, ${tier.c2})` }}
            >
              <div className="absolute -top-10 -right-8 w-32 h-32 rounded-full bg-white/20 blur-2xl" aria-hidden="true" />
              <div className="absolute -bottom-12 -left-10 w-36 h-36 rounded-full bg-black/10 blur-2xl" aria-hidden="true" />
              <div className="relative">
                <div className="text-5xl drop-shadow-sm">{tier.icon}</div>
                <div className="flex items-end justify-center gap-1.5 mt-1">
                  <span style={fredokaStyle} className="text-7xl font-bold leading-none drop-shadow-sm">{score}</span>
                  <span style={fredokaStyle} className="text-3xl font-bold leading-none mb-1.5 text-white/75">/ {total}</span>
                </div>
                <p style={fredokaStyle} className="text-lg font-bold mt-1.5">{tier.label}</p>
                <div className="flex justify-center gap-1.5 mt-4 flex-wrap max-w-[220px] mx-auto">
                  {marks.map((m, i) => (
                    <span key={i} className={`w-5 h-5 rounded-md ${m ? 'bg-white shadow-sm' : 'bg-white/25 ring-1 ring-white/30'}`} />
                  ))}
                </div>
              </div>
            </div>

            <p className="text-[#8B6347] text-sm mt-4 max-w-xs mx-auto">
              {score === total ? 'Nobody will believe this — make them try.'
                : score >= Math.ceil(total * 0.7) ? 'Flex it — dare a friend to beat your score.'
                : score >= total / 2 ? 'Send it to a friend and see who scores higher.'
                : 'Misery loves company — challenge a friend.'}
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
            </div>

            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <button onClick={playAgain} style={{ background: '#2D1810', fontFamily: 'Fredoka, sans-serif' }} className="px-7 py-3 rounded-2xl text-white font-bold">Play again</button>
              <Link to="/trivia" className="px-5 py-3 rounded-2xl border-2 border-[#FFE8C8] text-[#2D1810] font-semibold hover:border-[#E84A8B]">Daily Trivia →</Link>
            </div>

            <div className="mt-6 text-left max-w-sm mx-auto"><DailyChecklist /></div>
          </div>
        )}

        <div className="mt-8 max-h-[300px] overflow-hidden"><AdSlot slot="5698170537" /></div>
      </div>

      {/* Unique, substantial per-topic content */}
      <div className="max-w-xl mx-auto mt-10 text-[#4A2D1B] leading-relaxed">
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-2">About {topic.h1.toLowerCase()}</h2>
        <p className="mb-3">{topic.intro}</p>
        <p className="mb-3">
          This free {topic.h1.toLowerCase()} quiz draws from <strong>{count}+ {topic.name.toLowerCase()} questions</strong> and shuffles a fresh set every play, so you can keep going for new questions — no signup, no download. Want a new challenge daily? Try <Link to="/trivia" className="text-[#E84A8B] font-semibold underline">Daily Trivia</Link>, or gather the group for live <Link to="/team-trivia" className="text-[#E84A8B] font-semibold underline">Team Trivia</Link>.
        </p>

        {topic.covers && (
          <>
            <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">What this quiz covers</h2>
            <ul className="list-disc list-inside space-y-1 mb-3">
              {topic.covers.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </>
        )}

        {topic.facts && (
          <>
            <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">{topic.name} trivia: did you know?</h2>
            <ul className="space-y-2 mb-3">
              {topic.facts.map((f, i) => (
                <li key={i} className="flex gap-2"><span aria-hidden="true">•</span><span>{f}</span></li>
              ))}
            </ul>
          </>
        )}

        {topic.tips && (
          <>
            <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">Tips to improve your score</h2>
            <p className="mb-3">{topic.tips}</p>
          </>
        )}

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">More trivia topics</h2>
        <TopicGrid exclude={topic.slug} />
        <div className="mt-3">
          <Link to="/trivia-games" className="text-[#E84A8B] font-semibold underline text-sm">See all trivia games →</Link>
        </div>

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">Frequently asked questions</h2>
        <div className="space-y-3">
          {FAQS.map(({ q, a }, i) => (
            <div key={i}><h3 style={fredokaStyle} className="text-lg font-bold text-[#2D1810]">{q}</h3><p className="mt-1">{a}</p></div>
          ))}
        </div>
      </div>
    </MeadowLayout>
  );
}
