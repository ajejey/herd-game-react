import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import { useTeamTrivia } from '../../hooks/useTeamTrivia';
import AdSlot from '../AdSlot';

const CANONICAL = 'https://herdgamesonline.com/team-trivia';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Team Trivia',
      alternateName: ['Team Trivia', 'Office Trivia', 'Trivia for Work', 'Virtual Team Trivia', 'Live Trivia Game'],
      url: CANONICAL,
      description: 'Free live multiplayer trivia for teams: the host runs a quiz, everyone answers from their own device, and a live leaderboard crowns a winner. No download, no signup — perfect for work calls on Microsoft Teams or Zoom.',
      image: OG,
      genre: ['Trivia', 'Quiz', 'Party'],
      gamePlatform: ['Web browser'],
      playMode: 'MultiPlayer',
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
  name: 'How to play Team Trivia',
  step: [
    { '@type': 'HowToStep', name: 'Create a room', text: 'One person creates a room and shares the 4-letter code (or link) with the team.' },
    { '@type': 'HowToStep', name: 'Everyone joins', text: 'Teammates join from their own phone or laptop — no download, no signup.' },
    { '@type': 'HowToStep', name: 'Answer & climb the leaderboard', text: 'The host starts the quiz; everyone answers each multiple-choice question and the live leaderboard updates. Most correct after the final round wins.' },
  ],
};
const FAQS = [
  { q: 'Is Team Trivia free?', a: 'Yes — completely free, no download and no signup. Create a room, share the code, and play right in the browser.' },
  { q: 'Can we play on a Microsoft Teams or Zoom call?', a: 'Absolutely. Everyone joins from their own device while you stay on the call, so it’s ideal for remote and hybrid team meetings. Drop the room code in the chat.' },
  { q: 'How many people can play?', a: 'From 2 up to a large group — everyone answers on their own screen, so big teams work fine. The host controls the pace.' },
  { q: 'How does scoring work?', a: 'You get a point for each correct answer. After the final round, the highest score on the live leaderboard wins.' },
];
const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function TeamTriviaHome() {
  const navigate = useNavigate();
  const { connected, error, createGame, joinGame, state, roomCode, clearError } = useTeamTrivia();
  const [tab, setTab] = useState('create');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    if (state && roomCode) navigate(`/team-trivia/room/${roomCode}`);
  }, [state, roomCode, navigate]);

  function handleCreate(e) { e.preventDefault(); if (username.trim()) createGame(username); }
  function handleJoin(e) { e.preventDefault(); if (username.trim() && code.trim()) joinGame(code, username); }

  return (
    <MeadowLayout maxWidth="max-w-2xl">
      <Helmet>
        <title>Team Trivia — Free Live Trivia Game for Work &amp; Teams (No Download)</title>
        <meta name="description" content="Free live multiplayer Team Trivia: host a quiz, everyone answers from their own device, live leaderboard. No download, no signup — great for office, Teams & Zoom meetings." />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Team Trivia — Free Live Trivia for Work & Teams" />
        <meta property="og:description" content="Host a live trivia quiz for your team — everyone joins from their own screen, live leaderboard. Free, no download." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Team Trivia — Free Live Trivia for Work & Teams" />
        <meta name="twitter:image" content={OG} />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(HOWTO_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <div className="text-center mb-6">
        <h1 style={fredokaStyle} className="text-4xl md:text-5xl font-bold text-[#2D1810]">Team Trivia</h1>
        <p className="text-[#4A2D1B] text-lg mt-1">Host a live quiz. Everyone answers from their own screen. Live leaderboard.</p>
      </div>

      <div className="max-w-sm mx-auto bg-white rounded-3xl border-4 border-[#FFE8C8] p-5 shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)]">
        <div className="flex gap-2 mb-4">
          {['create', 'join'].map((t) => (
            <button key={t} onClick={() => { setTab(t); clearError(); }} style={fredokaStyle}
              className={`flex-1 py-2 rounded-xl font-bold ${tab === t ? 'bg-[#E84A8B] text-white' : 'bg-[#FFF6E9] text-[#2D1810]'}`}>
              {t === 'create' ? 'Create' : 'Join'}
            </button>
          ))}
        </div>

        {error && <p className="text-red-600 text-sm mb-3 text-center">{error}</p>}
        {!connected && <p className="text-[#8B6347] text-sm mb-3 text-center">Connecting…</p>}

        <form onSubmit={tab === 'create' ? handleCreate : handleJoin} className="space-y-3">
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your name" maxLength={20}
            className="w-full px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#3D8B5A] outline-none text-[#2D1810] bg-[#FFFDF8]" />
          {tab === 'join' && (
            <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Room code" maxLength={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#3D8B5A] outline-none text-[#2D1810] bg-[#FFFDF8] tracking-widest font-mono" />
          )}
          <button type="submit" disabled={!connected} style={{ background: '#E84A8B', fontFamily: 'Fredoka, sans-serif' }}
            className="w-full py-3 rounded-xl text-white font-bold text-lg disabled:opacity-50">
            {tab === 'create' ? 'Create game 🧠' : 'Join game →'}
          </button>
        </form>
        <p className="text-xs text-[#8B6347] mt-3 text-center">2+ players · no download · no signup</p>
      </div>

      {/* SEO content */}
      <div className="max-w-2xl mx-auto mt-10 text-[#4A2D1B] leading-relaxed">
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-2">Live trivia for work &amp; teams</h2>
        <p className="mb-3">
          Team Trivia is a free, live multiplayer quiz built for groups. One person hosts, everyone joins from their own phone or laptop with a 4-letter code, and you race through multiple-choice questions across mixed topics while a <strong>live leaderboard</strong> tracks the scores. There’s <strong>no download and no signup</strong> — perfect for an <Link to="/office-games">office</Link> social, a <Link to="/office-games/fun-friday-games-for-work">Fun Friday</Link>, or a quick round on a <Link to="/office-games/games-to-play-on-microsoft-teams">Microsoft Teams</Link> or Zoom call.
        </p>
        <p className="mb-3">
          Because everyone answers on their own screen, it scales from a handful of teammates to a big all-hands. Want a quick solo version instead? Play the daily <Link to="/trivia">Daily Trivia</Link>. Looking for more group games? Try <Link to="/say-anything">Say Anything</Link>, <Link to="/guesstimate">Guesstimate</Link>, or <Link to="/clover">Clover Clues</Link>.
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

      <div className="mt-8 max-h-[300px] overflow-hidden"><AdSlot slot="5969633275" /></div>
    </MeadowLayout>
  );
}
