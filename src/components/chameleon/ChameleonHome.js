import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import { useChameleon } from '../../hooks/useChameleon';
import AdSlot from '../AdSlot';

const CANONICAL = 'https://herdgamesonline.com/chameleon';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Chameleon — Imposter Word Game',
      alternateName: ['Chameleon', 'The Chameleon game', 'Imposter word game', 'Social deduction game', 'Find the chameleon'],
      url: CANONICAL,
      description: 'Free online social-deduction word game: everyone gets a clue except the secret Chameleon, who must bluff. Give a one-word clue, then vote out the imposter. 3+ players, no download, no signup.',
      image: OG,
      genre: ['Party', 'Social Deduction', 'Word'],
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
  name: 'How to play Chameleon',
  step: [
    { '@type': 'HowToStep', name: 'See the grid', text: 'Everyone sees a 16-word grid and a category. One word is the secret — everyone knows it except the hidden Chameleon.' },
    { '@type': 'HowToStep', name: 'Give a one-word clue', text: 'Each player gives a single-word clue about the secret word. The Chameleon, who doesn’t know it, must bluff convincingly.' },
    { '@type': 'HowToStep', name: 'Vote out the imposter', text: 'Discuss the clues and vote for who you think the Chameleon is. Catch them and they get one guess at the word — guess wrong and the players win.' },
  ],
};
const FAQS = [
  { q: 'Is Chameleon free?', a: 'Yes — completely free, no download and no signup. Create a room, share the 4-letter code, and play in the browser.' },
  { q: 'How many players do you need?', a: 'At least 3. It’s a social-deduction game, so it’s best with a group — 4 to 8 is the sweet spot.' },
  { q: 'How do you play the Chameleon game?', a: 'Everyone sees a grid of 16 words and a category. All players but one (the Chameleon) know which word is the secret answer. Each player gives a one-word clue; the Chameleon bluffs. Then everyone votes on who the Chameleon is.' },
  { q: 'Can we play it on a video call?', a: 'Yes — everyone joins from their own device, so it’s great over Zoom or Microsoft Teams for remote teams and friends.' },
];
const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function ChameleonHome() {
  const navigate = useNavigate();
  const { connected, error, createGame, joinGame, state, roomCode, clearError } = useChameleon();
  const [tab, setTab] = useState('create');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => { if (state && roomCode) navigate(`/chameleon/room/${roomCode}`); }, [state, roomCode, navigate]);

  function handleCreate(e) { e.preventDefault(); if (username.trim()) createGame(username); }
  function handleJoin(e) { e.preventDefault(); if (username.trim() && code.trim()) joinGame(code, username); }

  return (
    <MeadowLayout maxWidth="max-w-2xl">
      <Helmet>
        <title>Chameleon — Free Online Imposter Word Game (Social Deduction)</title>
        <meta name="description" content="Play Chameleon free online: everyone gets a clue except the secret imposter, who must bluff. Give a one-word clue, then vote out the Chameleon. 3+ players, no download, no signup." />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Chameleon — Free Online Imposter Word Game" />
        <meta property="og:description" content="Spot the bluffer. Everyone gets a clue except the secret Chameleon. Free social-deduction word game, no download." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Chameleon — Free Online Imposter Word Game" />
        <meta name="twitter:image" content={OG} />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(HOWTO_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <div className="text-center mb-6">
        <h1 style={fredokaStyle} className="text-4xl md:text-5xl font-bold text-[#2D1810]">Chameleon</h1>
        <p className="text-[#4A2D1B] text-lg mt-1">Everyone gets a clue — except the secret imposter. Give a one-word clue, then vote out the bluffer.</p>
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
            {tab === 'create' ? 'Create game 🦎' : 'Join game →'}
          </button>
        </form>
        <p className="text-xs text-[#8B6347] mt-3 text-center">3+ players · no download · no signup</p>
      </div>

      <div className="max-w-2xl mx-auto mt-10 text-[#4A2D1B] leading-relaxed">
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-2">A free social-deduction word game</h2>
        <p className="mb-3">
          Chameleon is a free online <a href="https://en.wikipedia.org/wiki/Social_deduction_game" target="_blank" rel="noopener noreferrer">social-deduction</a> word game. Everyone sees a grid of 16 words and a category, and all players but one — the hidden <strong>Chameleon</strong> — know which word is the secret answer. Each player gives a <strong>one-word clue</strong>; the Chameleon has to bluff without knowing the word. Then you all <strong>vote</strong> on who the imposter is. If you fancy yourself a fan of hidden-role games like Among Us or Werewolf, this is the quick browser version — 3+ players, no download.
        </p>
        <p className="mb-3">
          It’s a brilliant <Link to="/office-games">team game</Link> and party game — everyone joins from their own device, so it works around a table or on a <Link to="/office-games/games-to-play-on-microsoft-teams">Teams</Link> or Zoom call. More group games: <Link to="/say-anything">Say Anything</Link>, <Link to="/team-trivia">Team Trivia</Link>, <Link to="/guesstimate">Guesstimate</Link>, and <Link to="/clover">Clover Clues</Link>.
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
