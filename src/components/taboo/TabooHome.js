import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import { useTaboo } from '../../hooks/useTaboo';
import JoinCodeHelp from '../JoinCodeHelp';
import useJoinFunnel from '../../hooks/useJoinFunnel';
import { sanitizeCodeInput } from '../../lib/packCode';
import { canResumeRoom } from '../../lib/resumeRoom';
import { codeFromUrl, initialTab } from '../../lib/joinFromUrl';

const CANONICAL = 'https://herdgamesonline.com/taboo';
const OG = 'https://herdgamesonline.com/og-image.png';
const RED = '#D0463B';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Taboo Online',
      alternateName: ['Taboo', 'Taboo Game', 'Forbidden Words Game', 'Taboo with Friends'],
      url: CANONICAL,
      description: 'Free online Taboo: describe the word to your team without saying any of the five forbidden words. The other team can buzz you if you slip. Play with friends in the browser, no download, no signup.',
      image: OG,
      genre: ['Party', 'Word', 'Team'],
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
  '@context': 'https://schema.org', '@type': 'HowTo', name: 'How to play Taboo online',
  step: [
    { '@type': 'HowToStep', name: 'Create a room', text: 'One player creates a room and shares the 4-letter code or link.' },
    { '@type': 'HowToStep', name: 'Describe the word', text: 'On your turn you see a word plus five forbidden words. Get your team to say the word without using any of them.' },
    { '@type': 'HowToStep', name: 'Watch for slips', text: 'The other team watches and can buzz you if you say a forbidden word, costing your team a point.' },
    { '@type': 'HowToStep', name: 'Beat the clock', text: 'Each correct guess is a point. Skip if you are stuck. Most points after the rounds wins.' },
  ],
};
const FAQS = [
  { q: 'Is Taboo online free?', a: 'Yes — completely free, no download and no signup. Create a room, share the code, and everyone plays in their browser on any device.' },
  { q: 'How do you play Taboo?', a: 'One player describes a target word to their team, but cannot say any of the five forbidden words listed on the card. Every word the team guesses is a point. The opposing team watches and can buzz if a forbidden word slips out, which costs a point.' },
  { q: 'How many players do you need?', a: 'Three is enough — with 3 you play co-op, sharing one score. With 4 or more you split into two teams and compete. It works well up to a big group.' },
  { q: 'Can you play Taboo on Zoom or Microsoft Teams?', a: 'Yes. Everyone joins from their own device with the room code while you stay on the call, so it works on Zoom, Microsoft Teams, Google Meet or any video chat. Only the describer sees the card.' },
  { q: 'Do I need the physical Taboo cards?', a: 'No. The cards are built in — the game deals a word and its forbidden words to whoever is describing, and only they can see it. No buzzer or timer needed either.' },
];
const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };

export default function TabooHome() {
  const navigate = useNavigate();
  const { connected, error, createGame, joinGame, state, roomCode, clearError } = useTaboo();
  const funnel = useJoinFunnel({ game: 'taboo', roomCode, error });
  /* ?join=CODE opens straight on the join tab with the code filled in —
     see lib/joinFromUrl.js for why. */
  const [tab, setTab] = useState(initialTab);
  const [username, setUsername] = useState('');
  const [code, setCode] = useState(codeFromUrl);

  useEffect(() => { if (canResumeRoom(state) && roomCode) navigate(`/taboo/room/${roomCode}`); }, [state, roomCode, navigate]);

  function handleCreate(e) { e.preventDefault(); if (username.trim()) { funnel.attemptCreate({ hasPack: false }); createGame(username); } }
  function handleJoin(e) { e.preventDefault(); if (username.trim() && code.trim()) { funnel.attemptJoin(code); joinGame(code, username); } }

  return (
    <MeadowLayout maxWidth="max-w-2xl">
      <Helmet>
        <title>Taboo Online — Free Multiplayer Word Game with Friends (No Download)</title>
        <meta name="description" content="Play Taboo online free: describe the word without saying the five forbidden words, while the other team waits to buzz you. Multiplayer with friends, no download, no signup. Great on Zoom & Teams." />
        <link rel="canonical" href={CANONICAL} />
        <meta name="keywords" content="taboo online, play taboo online, taboo game online free, taboo with friends, forbidden words game, taboo multiplayer, taboo game zoom" />
        <meta property="og:title" content="Taboo Online — Free Multiplayer with Friends" />
        <meta property="og:description" content="Describe the word without saying the forbidden ones. The other team is waiting to buzz you. Free, no download." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Taboo Online — Free Multiplayer" />
        <meta name="twitter:image" content={OG} />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(HOWTO_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <div className="text-center mb-6">
        <h1 style={fredokaStyle} className="text-4xl md:text-5xl font-bold text-[#2D1810]">Taboo Online</h1>
        <p className="text-[#4A2D1B] text-lg mt-1">Describe the word. Just don’t say the forbidden ones — the other team is listening.</p>

        {/* Show a real card: it explains the whole game instantly. */}
        <div className="rounded-3xl border-4 border-[#2D1810] overflow-hidden max-w-[15rem] mx-auto mt-5 shadow-[0_14px_30px_-14px_rgba(45,24,16,0.5)]">
          <div className="bg-[#2D1810] py-3 px-3">
            <p style={fredokaStyle} className="text-3xl font-bold text-white leading-tight">Pizza</p>
          </div>
          <div className="bg-[#FFF8EE] py-2.5 px-3">
            <p className="text-[12px] font-bold tracking-widest uppercase mb-1" style={{ color: RED }}>Don’t say</p>
            {['Cheese', 'Italian', 'Slice', 'Pepperoni', 'Dough'].map((w) => (
              <p key={w} style={{ ...fredokaStyle, color: RED }} className="text-base font-bold leading-tight">{w}</p>
            ))}
          </div>
        </div>
        <p className="text-sm text-[#8B6347] mt-3">3+ players · about 10 minutes · no download, no signup</p>
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
        {error && <p className="text-red-600 text-base mb-3 text-center">{error}</p>}
        {!connected && <p className="text-[#8B6347] text-base mb-3 text-center">Connecting…</p>}
        <form onSubmit={tab === 'create' ? handleCreate : handleJoin} className="space-y-3">
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your name" maxLength={20}
            className="w-full px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#3D8B5A] outline-none text-[#2D1810] bg-[#FFFDF8]" />
          {tab === 'join' && (
            <input value={code} onChange={(e) => setCode(sanitizeCodeInput(e.target.value))} placeholder="Room code (4 letters)" maxLength={32}
              className={`w-full px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#3D8B5A] outline-none text-[#2D1810] bg-[#FFFDF8] font-mono ${code.length > 8 ? 'text-sm' : 'tracking-widest'}`} />
          )}
          {tab === 'join' && (
            <JoinCodeHelp code={code} onUsePack={() => setTab('create')} />
          )}
          <button type="submit" disabled={!connected} style={{ background: '#E84A8B', fontFamily: 'Fredoka, sans-serif' }}
            className="w-full py-3 rounded-xl text-white font-bold text-lg disabled:opacity-50">
            {tab === 'create' ? 'Create game 🚫' : 'Join game →'}
          </button>
        </form>
        <p className="text-sm text-[#8B6347] mt-3 text-center">3+ players · no download · no signup</p>
      </div>

      {/* SEO content */}
      <div className="max-w-2xl mx-auto mt-10 text-[#4A2D1B] leading-relaxed">
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-2">The forbidden-words game, free online</h2>
        <p className="mb-3">
          Taboo is the party classic where the hard part isn’t knowing the word — it’s describing it with one hand tied behind your back. You get a target word and <strong>five forbidden words</strong> you cannot say. Try getting your team to say "Pizza" without <em>cheese</em>, <em>Italian</em>, <em>slice</em>, <em>pepperoni</em> or <em>dough</em>. Meanwhile the other team is listening for a slip, ready to <strong>buzz</strong> you. Free, no download, no signup — just share a room code.
        </p>

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">How to play</h2>
        <ol className="list-decimal pl-5 mb-3 space-y-1">
          <li><strong>Create a room</strong> and share the 4-letter code or link with your friends.</li>
          <li><strong>Describe the word</strong> on your turn — only you can see the card.</li>
          <li><strong>Avoid the five forbidden words.</strong> The other team can buzz you if you say one, costing a point.</li>
          <li><strong>Beat the clock.</strong> Each guess is a point, skip if you’re stuck, most points wins.</li>
        </ol>

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">Great on a video call</h2>
        <p className="mb-3">
          Because only the describer sees the card and everyone joins from their own phone, Taboo works brilliantly on a <Link to="/office-games/games-to-play-on-microsoft-teams">Microsoft Teams</Link>, Zoom or Google Meet call, and it’s a favourite <Link to="/office-games">office game</Link> for team socials. More group games: <Link to="/fishbowl">Fishbowl</Link>, <Link to="/scattergories">Scattergories</Link>, <Link to="/say-anything">Say Anything</Link>, <Link to="/chameleon">Chameleon</Link>, <Link to="/would-you-rather">Would You Rather</Link> and <Link to="/caveman-clues">Caveman Clues</Link>, <Link to="/hue-match">Hue Match</Link>, <Link to="/team-trivia">Team Trivia</Link>.
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
    </MeadowLayout>
  );
}
