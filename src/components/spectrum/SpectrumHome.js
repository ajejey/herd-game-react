import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import { useSpectrum } from '../../hooks/useSpectrum';
import AdSlot from '../AdSlot';

const CANONICAL = 'https://herdgamesonline.com/spectrum';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Spectrum — Guess the Scale',
      alternateName: ['Spectrum', 'Wavelength game', 'Guess the spectrum', 'Scale guessing game'],
      url: CANONICAL,
      description: 'Free online Wavelength-style party game: one player gives a clue for where a hidden target sits on a spectrum between two opposites, and everyone else guesses how close they can get. 3+ players, no download.',
      image: OG,
      genre: ['Party', 'Guessing', 'Social'],
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
  name: 'How to play Spectrum',
  step: [
    { '@type': 'HowToStep', name: 'See the spectrum', text: 'Each round shows a scale between two opposites (e.g. Cold ↔ Hot). A hidden target sits somewhere on it.' },
    { '@type': 'HowToStep', name: 'Give a clue', text: 'One player (the clue-giver) sees the target and gives a clue that points to where it is on the scale.' },
    { '@type': 'HowToStep', name: 'Slide to guess', text: 'Everyone else slides to where they think the target is. The closer you land, the more points you score.' },
  ],
};
const FAQS = [
  { q: 'Is Spectrum free?', a: 'Yes — free, no download, no signup. Create a room, share the 4-letter code, and play in the browser.' },
  { q: 'Is this like Wavelength?', a: 'It’s the same kind of "read the room" guessing game: a clue-giver hints where a hidden target sits on a scale between two opposites, and everyone else guesses. Original wording, free to play online.' },
  { q: 'How many players?', a: 'At least 3 — one gives the clue and the others guess. It’s great with 4 to 10.' },
  { q: 'Can we play on a video call?', a: 'Yes. Everyone joins from their own device, so it works perfectly on Zoom or Microsoft Teams.' },
];
const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function SpectrumHome() {
  const navigate = useNavigate();
  const { connected, error, createGame, joinGame, state, roomCode, clearError } = useSpectrum();
  const [tab, setTab] = useState('create');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => { if (state && roomCode) navigate(`/spectrum/room/${roomCode}`); }, [state, roomCode, navigate]);

  function handleCreate(e) { e.preventDefault(); if (username.trim()) createGame(username); }
  function handleJoin(e) { e.preventDefault(); if (username.trim() && code.trim()) joinGame(code, username); }

  return (
    <MeadowLayout maxWidth="max-w-2xl">
      <Helmet>
        <title>Spectrum — Free Online Wavelength-style Party Game (No Download)</title>
        <meta name="description" content="Play Spectrum free online: one player clues where a hidden target sits on a scale between two opposites, everyone else guesses how close they can get. 3+ players, no download, no signup." />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Spectrum — Free Online Wavelength-style Game" />
        <meta property="og:description" content="Read the clue, guess where the hidden target sits on the scale. Free party game, no download." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Spectrum — Free Online Wavelength-style Game" />
        <meta name="twitter:image" content={OG} />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(HOWTO_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <div className="text-center mb-6">
        <h1 style={fredokaStyle} className="text-4xl md:text-5xl font-bold text-[#2D1810]">Spectrum</h1>
        <p className="text-[#4A2D1B] text-lg mt-1">One clue. A hidden point on a scale. How close can the team guess?</p>
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
            {tab === 'create' ? 'Create game 🎯' : 'Join game →'}
          </button>
        </form>
        <p className="text-xs text-[#8B6347] mt-3 text-center">3+ players · no download · no signup</p>
      </div>

      <div className="max-w-2xl mx-auto mt-10 text-[#4A2D1B] leading-relaxed">
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-2">A free "read the room" guessing game</h2>
        <p className="mb-3">
          Spectrum is a free online party game in the spirit of <strong>Wavelength</strong>. Each round shows a scale between two opposites — say <em>Cold ↔ Hot</em> or <em>Overrated ↔ Underrated</em> — with a hidden target somewhere on it. One player (the clue-giver) can see the target and gives a single clue; everyone else slides to where they think it lands. The closer you guess, the more points you score, and the clue-giver is rewarded for a clue that gets the team close.
        </p>
        <p className="mb-3">
          It’s a perfect <Link to="/office-games">team game</Link> — quick, funny, and everyone joins from their own device, so it works on a <Link to="/office-games/games-to-play-on-microsoft-teams">Teams</Link> or Zoom call. More group games: <Link to="/chameleon">Chameleon</Link>, <Link to="/say-anything">Say Anything</Link>, <Link to="/team-trivia">Team Trivia</Link>, and <Link to="/guesstimate">Guesstimate</Link>.
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
