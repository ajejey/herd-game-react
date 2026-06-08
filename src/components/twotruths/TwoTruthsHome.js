import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import { useTwoTruths } from '../../hooks/useTwoTruths';
import AdSlot from '../AdSlot';

const CANONICAL = 'https://herdgamesonline.com/two-truths-and-a-lie';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Two Truths and a Lie',
      alternateName: ['Two Truths and a Lie', 'Two Truths and a Lie online', '2 Truths and a Lie game'],
      url: CANONICAL,
      description: 'Play Two Truths and a Lie free online: everyone writes two true statements and one lie, then takes turns while the group guesses the lie. A great icebreaker. 3+ players, no download, no signup.',
      image: OG,
      genre: ['Party', 'Icebreaker', 'Social'],
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
  name: 'How to play Two Truths and a Lie',
  step: [
    { '@type': 'HowToStep', name: 'Write your statements', text: 'Everyone writes three statements about themselves — two true, one a lie — and marks which is the lie.' },
    { '@type': 'HowToStep', name: 'Guess the lie', text: 'One player at a time, their three statements are shown shuffled and everyone else guesses which one is the lie.' },
    { '@type': 'HowToStep', name: 'Score', text: 'Spot the lie to score a point; if you fool people with your lie, you score for each person you fooled.' },
  ],
};
const FAQS = [
  { q: 'Is Two Truths and a Lie free to play online?', a: 'Yes — completely free, no download and no signup. Create a room, share the 4-letter code, and play in the browser.' },
  { q: 'How many people can play?', a: 'At least 3, and it scales well to large groups. Everyone writes their statements, then you take turns guessing.' },
  { q: 'Is it a good icebreaker for work?', a: 'It’s one of the best — quick, personal, and inclusive. Everyone joins from their own device, so it works on a Microsoft Teams or Zoom call.' },
  { q: 'What are good Two Truths and a Lie ideas?', a: 'Mix something surprising but believable with one fact people might doubt. Travel, hidden talents, odd jobs and childhood stories make great statements.' },
];
const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function TwoTruthsHome() {
  const navigate = useNavigate();
  const { connected, error, createGame, joinGame, state, roomCode, clearError } = useTwoTruths();
  const [tab, setTab] = useState('create');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => { if (state && roomCode) navigate(`/two-truths-and-a-lie/room/${roomCode}`); }, [state, roomCode, navigate]);

  function handleCreate(e) { e.preventDefault(); if (username.trim()) createGame(username); }
  function handleJoin(e) { e.preventDefault(); if (username.trim() && code.trim()) joinGame(code, username); }

  return (
    <MeadowLayout maxWidth="max-w-2xl">
      <Helmet>
        <title>Two Truths and a Lie — Free Online Game (No Download)</title>
        <meta name="description" content="Play Two Truths and a Lie free online with friends or coworkers: write two truths and one lie, then guess each other’s lies. A perfect icebreaker — 3+ players, no download, no signup." />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Two Truths and a Lie — Free Online Game" />
        <meta property="og:description" content="Write two truths and a lie, then guess everyone else’s. The classic icebreaker, free online." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Two Truths and a Lie — Free Online Game" />
        <meta name="twitter:image" content={OG} />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(HOWTO_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <div className="text-center mb-6">
        <h1 style={fredokaStyle} className="text-4xl md:text-5xl font-bold text-[#2D1810]">Two Truths and a Lie</h1>
        <p className="text-[#4A2D1B] text-lg mt-1">Write two truths and one lie. Can the group spot your lie?</p>
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
            {tab === 'create' ? 'Create game 🤥' : 'Join game →'}
          </button>
        </form>
        <p className="text-xs text-[#8B6347] mt-3 text-center">3+ players · no download · no signup</p>
      </div>

      <div className="max-w-2xl mx-auto mt-10 text-[#4A2D1B] leading-relaxed">
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-2">The classic icebreaker, free online</h2>
        <p className="mb-3">
          Two Truths and a Lie is the timeless get-to-know-you game. Everyone writes <strong>three statements</strong> about themselves — two true and one a lie — then, one person at a time, the group tries to <strong>guess the lie</strong>. Spot someone’s lie to score, and earn points for every person your own lie fools. It runs entirely in the browser: no download, no signup, just a 4-letter room code.
        </p>
        <p className="mb-3">
          It’s a brilliant <Link to="/office-games/virtual-icebreaker-games-for-meetings">icebreaker for meetings</Link> and a fun party game — everyone joins from their own device, so it’s great on a <Link to="/office-games/games-to-play-on-microsoft-teams">Teams</Link> or Zoom call. More group games: <Link to="/chameleon">Chameleon</Link>, <Link to="/spectrum">Spectrum</Link>, <Link to="/say-anything">Say Anything</Link>, and <Link to="/team-trivia">Team Trivia</Link>.
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
