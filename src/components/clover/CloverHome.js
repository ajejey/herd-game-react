import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import { useClover } from '../../hooks/useClover';
import AdSlot from '../AdSlot';

const CANONICAL = 'https://herdgamesonline.com/clover';
const OG = 'https://herdgamesonline.com/og-clover.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Clover Clues — Cooperative Word Game',
      alternateName: ['Clover Clues Online', 'Free So Clover Alternative', 'Online Cooperative Word Game'],
      url: CANONICAL,
      description: 'Free online cooperative word game inspired by So Clover. Write one-word clues for your clover, then rebuild each other\'s clovers as a team. 3-6 players, no download.',
      image: OG,
      genre: ['Party', 'Word', 'Cooperative', 'Social'],
      gamePlatform: ['Web browser'],
      playMode: 'CoOp',
      numberOfPlayers: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 6 },
      applicationCategory: 'GameApplication',
      operatingSystem: 'Any (Web)',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
  ],
};

export default function CloverHome() {
  const navigate = useNavigate();
  const { connected, error, createGame, joinGame, state, roomCode, clearError } = useClover();
  const [tab, setTab] = useState('create');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    if (state && roomCode) navigate(`/clover/room/${roomCode}`);
  }, [state, roomCode, navigate]);

  function handleCreate(e) { e.preventDefault(); if (username.trim()) createGame(username); }
  function handleJoin(e) { e.preventDefault(); if (username.trim() && code.trim()) joinGame(code, username); }

  return (
    <MeadowLayout maxWidth="max-w-2xl">
      <Helmet>
        <title>Clover Clues — Free Online Co-op Word Game (So Clover-style)</title>
        <meta name="description" content="Clover Clues is a free online cooperative word game: write one-word clues, then rebuild each other's clovers as a team. 3–6 players, no download, no signup. Play free →" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Clover Clues — Free Online Co-op Word Game" />
        <meta property="og:description" content="Write clues, rebuild clovers, win together. A free cooperative word game for 3–6 players — no download." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Clover Clues — Free Online Co-op Word Game" />
        <meta name="twitter:image" content={OG} />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
      </Helmet>

      <div className="text-center mb-6">
        <h1 style={fredokaStyle} className="text-4xl md:text-5xl font-bold text-[#2D1810]">Clover Clues</h1>
        <p className="text-[#4A2D1B] text-lg mt-1">A free <strong>cooperative</strong> word game. Write clues, rebuild each other's clovers, win as a team.</p>
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
            {tab === 'create' ? 'Create game 🍀' : 'Join game →'}
          </button>
        </form>
        <p className="text-xs text-[#8B6347] mt-3 text-center">3–6 players · no download · no signup</p>
      </div>

      {/* SEO content */}
      <div className="max-w-2xl mx-auto mt-10 gt-prose text-[#4A2D1B]">
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-2">How to play Clover Clues</h2>
        <p>Clover Clues is a free online cooperative word game inspired by party games like <em>So Clover</em>. Everyone gets a "clover" of four words. For each pair of touching words, you write a single-word clue that links them. Then a decoy word is added to your four and everything is shuffled — and the <strong>whole group works together</strong> to rebuild each player's clover using only the clues. You all share one score, so it's pure teamwork.</p>
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-2">Why play online</h2>
        <p>No board, no cards, no app — just open it in any browser, share a 4-letter room code, and play with 3 to 6 friends on their own devices. It works great over a <Link to="/guesstimate/games-to-play-on-facetime-and-video-calls" className="text-[#E84A8B] font-semibold underline">video call</Link>. Looking for more? Try <Link to="/guesstimate" className="text-[#E84A8B] font-semibold underline">Guesstimate</Link>, <Link to="/say-anything" className="text-[#E84A8B] font-semibold underline">Say Anything</Link>, or the solo <Link to="/daily" className="text-[#E84A8B] font-semibold underline">Daily Herd</Link>.</p>
      </div>

      <div className="mt-8 max-h-[300px] overflow-hidden"><AdSlot slot="5698170537" /></div>
    </MeadowLayout>
  );
}
