import React, { useState, useEffect } from 'react';
import usePackFromUrl from '../../lib/usePackFromUrl';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import { useWouldYouRather } from '../../hooks/useWouldYouRather';
import AdSlot from '../AdSlot';
import JoinCodeHelp from '../JoinCodeHelp';
import useJoinFunnel from '../../hooks/useJoinFunnel';
import { sanitizeCodeInput } from '../../lib/packCode';
import { canResumeRoom } from '../../lib/resumeRoom';

const CANONICAL = 'https://herdgamesonline.com/would-you-rather';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Would You Rather',
      alternateName: ['Would You Rather Online', 'This or That', 'Would You Rather Game', 'Would You Rather with Friends'],
      url: CANONICAL,
      description: 'Free live multiplayer Would You Rather: everyone votes on two options from their own device, then watch the split reveal. Score a point for siding with the majority. No download, no signup — great for friends and team icebreakers.',
      image: OG,
      genre: ['Party', 'Social', 'Icebreaker'],
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
  '@context': 'https://schema.org', '@type': 'HowTo', name: 'How to play Would You Rather online',
  step: [
    { '@type': 'HowToStep', name: 'Create a room', text: 'One player creates a room and shares the 4-letter code or link.' },
    { '@type': 'HowToStep', name: 'Everyone votes', text: 'Each round shows two options — everyone taps A or B on their own device.' },
    { '@type': 'HowToStep', name: 'See the split', text: 'The votes reveal as a split. Score a point for siding with the majority — the herd.' },
    { '@type': 'HowToStep', name: 'Argue about it', text: 'The reveal is where the fun is — debate the wild choices, then play the next round.' },
  ],
};
const FAQS = [
  { q: 'Is Would You Rather online free?', a: 'Yes — completely free, no download and no signup. Create a room, share the code, and everyone plays in their browser on any device.' },
  { q: 'How do you play Would You Rather with friends online?', a: 'One person creates a room and shares the 4-letter code or link. Each round shows two options; everyone taps A or B on their own phone or laptop, then the votes reveal as a split so you can see how the group is divided — and argue about it.' },
  { q: 'Is it good for team icebreakers on Zoom or Teams?', a: 'Very. Would You Rather is one of the most popular virtual-meeting icebreakers — it takes seconds to learn, everyone participates from their own device, and the split reveal naturally sparks discussion. Works on Zoom, Microsoft Teams, Google Meet or any call.' },
  { q: 'How many people can play?', a: 'From 2 up to a big group. Everyone votes on their own screen, so large teams work fine — the host controls the pace and how many rounds you play.' },
  { q: 'How do you win?', a: 'You score a point each round for siding with the majority — the "herd". Highest total after all the rounds wins. But honestly, the real fun is the debate over the close ones.' },
];
const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };

export default function WouldYouRatherHome() {
  const navigate = useNavigate();
  const { connected, error, createGame, joinGame, state, roomCode, clearError } = useWouldYouRather();
  const funnel = useJoinFunnel({ game: 'wyr', roomCode, error });
  const { packCode, packInfo } = usePackFromUrl();
  const [tab, setTab] = useState('create');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => { if (canResumeRoom(state) && roomCode) navigate(`/would-you-rather/room/${roomCode}`); }, [state, roomCode, navigate]);

  function handleCreate(e) { e.preventDefault(); if (username.trim()) { funnel.attemptCreate({ hasPack: !!packCode }); createGame(username, packCode ? { packCode } : {}); } }
  function handleJoin(e) { e.preventDefault(); if (username.trim() && code.trim()) { funnel.attemptJoin(code); joinGame(code, username); } }

  return (
    <MeadowLayout maxWidth="max-w-2xl">
      <Helmet>
        <title>Would You Rather — Free Online Multiplayer Game with Friends</title>
        <meta name="description" content="Play Would You Rather online free: everyone votes on two options from their own device, then watch the split reveal. Multiplayer with friends, no download, no signup. Great on Zoom & Teams." />
        <link rel="canonical" href={CANONICAL} />
        <meta name="keywords" content="would you rather, would you rather online, would you rather game, would you rather with friends, this or that game, would you rather multiplayer, icebreaker game online" />
        <meta property="og:title" content="Would You Rather — Free Online Multiplayer" />
        <meta property="og:description" content="Everyone votes A or B, then watch the split. Score for siding with the herd. Free, no download — play with friends in the browser." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Would You Rather — Free Online Multiplayer" />
        <meta name="twitter:image" content={OG} />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(HOWTO_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <div className="text-center mb-6">
        <h1 style={fredokaStyle} className="text-4xl md:text-5xl font-bold text-[#2D1810]">Would You Rather</h1>
        <p className="text-[#4A2D1B] text-lg mt-1">Everyone votes A or B, then watch the split. Score for siding with the herd. Free, no download.</p>
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
        {tab === 'create' && packInfo && !packInfo.error && (
          <div data-testid="pack-banner" className="mb-3 rounded-2xl border-2 border-[#3D8B5A] bg-[#EAF6EE] p-3 text-center">
            <p className="font-bold text-[#2D6E45]">
              Using your questions{packInfo.title ? ` — “${packInfo.title}”` : ''}
            </p>
            <p className="text-base text-[#3D8B5A]">{packInfo.count} custom · pack ID {packInfo.packCode}</p>
          </div>
        )}
        {tab === 'create' && packInfo && packInfo.error && (
          <div data-testid="pack-banner-error" className="mb-3 rounded-2xl border-2 border-[#D0463B] bg-[#FDECEA] p-3 text-center">
            <p className="text-base font-bold text-[#B03A30]">
              We couldn’t find that pack ID — this game will use our built-in questions.
            </p>
          </div>
        )}
        {tab === 'create' && !packInfo && (
          <p className="mb-3 text-center text-base text-[#6B4226]">
            Playing with a class, family or team?{' '}
            <Link to="/custom-questions" className="font-bold text-[#E84A8B] underline">Use your own questions</Link>
          </p>
        )}

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
            {tab === 'create' ? 'Create game 🤔' : 'Join game →'}
          </button>
        </form>
        <p className="text-sm text-[#8B6347] mt-3 text-center">2+ players · no download · no signup</p>
      </div>

      {/* SEO content */}
      <div className="max-w-2xl mx-auto mt-10 text-[#4A2D1B] leading-relaxed">
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-2">The classic "this or that" game, live online</h2>
        <p className="mb-3">
          Would You Rather is the simplest fun there is: two options, one impossible choice. This is a <strong>live multiplayer</strong> version — instead of one person reading questions aloud, everyone votes A or B on their own device, and then the <strong>split reveals</strong> so you can see exactly how divided the group is. Score a point each round for siding with the majority (the herd), but the real fun is arguing about the close ones. Free, no download, no signup — just share a room code.
        </p>

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">How to play</h2>
        <ol className="list-decimal pl-5 mb-3 space-y-1">
          <li><strong>Create a room</strong> and share the 4-letter code or link with friends.</li>
          <li><strong>Everyone votes</strong> A or B on their own phone or laptop each round.</li>
          <li><strong>The split reveals</strong> — see how the group divided and who's in the herd.</li>
          <li><strong>Debate, then continue.</strong> Highest score after all the rounds wins.</li>
        </ol>

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">A perfect icebreaker for teams</h2>
        <p className="mb-3">
          Would You Rather is one of the most popular <Link to="/office-games/virtual-icebreaker-games-for-meetings">virtual meeting icebreakers</Link> — it takes seconds to learn, everyone plays from their own device, and the split reveal naturally sparks conversation. It works on a <Link to="/office-games/games-to-play-on-microsoft-teams">Microsoft Teams</Link>, Zoom or Google Meet call and scales from 2 people to a big all-hands. More group games: <Link to="/hot-takes">Daily Hot Takes</Link>, <Link to="/caveman-clues">Caveman Clues</Link>, <Link to="/hue-match">Hue Match</Link>, <Link to="/team-trivia">Team Trivia</Link>, <Link to="/say-anything">Say Anything</Link>, <Link to="/taboo">Taboo</Link>, <Link to="/spectrum">Spectrum</Link> and <Link to="/scattergories">Scattergories</Link>.
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

      <div className="mt-8"><AdSlot slot="5969633275" /></div>
    </MeadowLayout>
  );
}
