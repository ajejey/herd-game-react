import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import AdSlot from '../AdSlot';
import TopicGrid from './TopicGrid';
import { TOPICS } from './topics';

const CANONICAL = 'https://herdgamesonline.com/trivia-games';
const OG = 'https://herdgamesonline.com/og-daily.png';

const FAQS = [
  { q: 'Are these trivia games free?', a: 'Yes — every quiz is completely free, with no signup and no download. Pick a topic and start playing instantly.' },
  { q: 'How do I play?', a: 'Choose a topic, answer 10 multiple-choice questions, and get your score. Each play shuffles a fresh set, so you can keep going for new questions.' },
  { q: 'Can I play trivia with friends?', a: 'These topic quizzes are quick solo games. For a group, try Team Trivia — a live multiplayer quiz where everyone joins from their own device, or Daily Trivia for a shared daily challenge to compare scores.' },
  { q: 'Is there a new quiz every day?', a: 'Yes — Daily Trivia drops a brand-new 10-question quiz every day so you can build a streak, on top of the by-topic quizzes you can replay any time.' },
];

const ITEMLIST_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Free Trivia Games by Topic',
  description: 'A collection of free online trivia quizzes by topic — music, movies, geography, science, Harry Potter and more.',
  url: CANONICAL,
  numberOfItems: TOPICS.length + 1,
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Daily Trivia', url: 'https://herdgamesonline.com/trivia' },
    ...TOPICS.map((t, i) => ({ '@type': 'ListItem', position: i + 2, name: t.h1, url: `https://herdgamesonline.com/${t.slug}` })),
  ],
};

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function TopicsHub() {
  return (
    <MeadowLayout maxWidth="max-w-2xl">
      <Helmet>
        <title>Free Trivia Games — Play Quiz Questions by Topic Online</title>
        <meta name="description" content="Play free online trivia games by topic: music, movies, geography, science, history, sport, Harry Potter and more. No signup, no download — pick a topic and start the quiz." />
        <link rel="canonical" href={CANONICAL} />
        <meta name="keywords" content="free trivia games, trivia games online, trivia quiz, trivia by topic, quiz games, trivia questions and answers" />
        <meta property="og:title" content="Free Trivia Games — Play Quiz Questions by Topic" />
        <meta property="og:description" content="Pick a topic and play a free trivia quiz instantly — music, movies, geography, science, Harry Potter and more. No signup." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Trivia Games — Play by Topic" />
        <meta name="twitter:image" content={OG} />
        <script type="application/ld+json">{JSON.stringify(ITEMLIST_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <div className="text-center mb-6">
        <h1 style={fredokaStyle} className="text-4xl md:text-5xl font-bold text-[#2D1810]">🧠 Free Trivia Games</h1>
        <p className="text-[#4A2D1B] mt-2">Pick a topic and play a quick quiz — instant, free, no signup.</p>
      </div>

      {/* Daily Trivia — the headline call to action */}
      <Link to="/trivia"
        className="block rounded-3xl border-4 border-[#FFE8C8] bg-white/80 p-5 md:p-6 mb-6 shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)] transition-transform hover:-translate-y-0.5">
        <div className="flex items-center gap-4">
          <span className="text-4xl" aria-hidden="true">🔥</span>
          <div>
            <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810]">Daily Trivia</h2>
            <p className="text-[#4A2D1B] text-sm">A new 10-question quiz every day. Build your streak and share your score →</p>
          </div>
        </div>
      </Link>

      <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-3">Or pick a topic</h2>
      <TopicGrid />

      <div className="mt-8 max-h-[300px] overflow-hidden"><AdSlot slot="5698170537" /></div>

      <div className="max-w-2xl mx-auto mt-10 text-[#4A2D1B] leading-relaxed">
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-2">Free trivia quizzes for every kind of player</h2>
        <p className="mb-3">
          Whether you live for film trivia, want to test your geography, or you're a die-hard Harry Potter fan, there's a quiz here for you. Every game is free, runs in your browser, and needs <strong>no signup and no download</strong> — just pick a topic, answer ten multiple-choice questions, and see how you score. Each play shuffles a fresh set, so you can replay any topic as many times as you like.
        </p>
        <p className="mb-3">
          Want a new challenge every day? <Link to="/trivia" className="text-[#E84A8B] font-semibold underline">Daily Trivia</Link> drops a fresh 10-question quiz daily so you can build a streak and compare scores with friends. Playing with a group? Gather everyone for live <Link to="/team-trivia" className="text-[#E84A8B] font-semibold underline">Team Trivia</Link>, where each person joins from their own phone.
        </p>

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
