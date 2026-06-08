import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import AdSlot from '../AdSlot';
import { getTopic, TOPICS } from './topics';
import { getQuestionsByCategory, categoryCount } from './questions';

const GREEN = '#3D8B5A';
const RED = '#D0463B';

export default function TopicTrivia({ slug }) {
  const topic = getTopic(slug);
  const total = topic ? Math.min(10, categoryCount(topic.categories)) : 0;

  const [quiz, setQuiz] = useState(() => (topic ? getQuestionsByCategory(topic.categories, 10) : []));
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [marks, setMarks] = useState([]);
  const [done, setDone] = useState(false);

  if (!topic) return <MeadowLayout><p className="text-center">Topic not found. <Link to="/trivia" className="underline text-[#E84A8B]">Play Daily Trivia →</Link></p></MeadowLayout>;

  const canonical = `https://herdgamesonline.com/${topic.slug}`;
  const count = categoryCount(topic.categories);
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
  function playAgain() {
    setQuiz(getQuestionsByCategory(topic.categories, 10));
    setIdx(0); setSelected(null); setAnswered(false); setMarks([]); setDone(false);
  }

  const related = TOPICS.filter((t) => t.slug !== topic.slug);

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
            <h2 style={fredokaStyle} className="text-3xl font-bold text-[#2D1810]">{score}/{quiz.length}</h2>
            <p className="text-[#4A2D1B] mt-1">{score === quiz.length ? 'Perfect! 🏆' : score >= quiz.length * 0.7 ? 'Great score!' : score >= quiz.length / 2 ? 'Not bad!' : 'Try again!'}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button onClick={playAgain} style={{ background: '#E84A8B', fontFamily: 'Fredoka, sans-serif' }} className="px-7 py-3 rounded-2xl text-white font-bold">Play again</button>
              <Link to="/trivia" className="px-5 py-3 rounded-2xl border-2 border-[#FFE8C8] text-[#2D1810] font-semibold hover:border-[#E84A8B]">Daily Trivia →</Link>
            </div>
          </div>
        )}

        <div className="mt-8 max-h-[300px] overflow-hidden"><AdSlot slot="5698170537" /></div>
      </div>

      {/* SEO content + internal links */}
      <div className="max-w-xl mx-auto mt-10 text-[#4A2D1B] leading-relaxed">
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-2">Free {topic.h1.toLowerCase()} questions</h2>
        <p className="mb-3">
          This free {topic.h1.toLowerCase()} quiz has <strong>{count}+ {topic.name.toLowerCase()} trivia questions</strong>, and every play gives you a fresh shuffled set — so you can keep going for new questions. No signup, no download: just hit play. Want a new challenge daily? Try the <Link to="/trivia" className="text-[#E84A8B] font-semibold underline">Daily Trivia</Link>, or gather the group for live <Link to="/team-trivia" className="text-[#E84A8B] font-semibold underline">Team Trivia</Link>.
        </p>

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">More trivia topics</h2>
        <ul className="grid grid-cols-2 gap-2">
          {related.map((t) => (
            <li key={t.slug}>
              <Link to={`/${t.slug}`} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#FFE8C8] text-[#2D1810] font-semibold transition-colors">
                <span className="text-xl">{t.emoji}</span><span className="text-sm">{t.h1}</span>
              </Link>
            </li>
          ))}
        </ul>

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
