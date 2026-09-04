import React, { useState, useEffect } from 'react';
import usePackFromUrl from '../../lib/usePackFromUrl';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import { useScattergories } from '../../hooks/useScattergories';
import AdSlot from '../AdSlot';
import JoinCodeHelp from '../JoinCodeHelp';
import useJoinFunnel from '../../hooks/useJoinFunnel';
import { sanitizeCodeInput } from '../../lib/packCode';
import { canResumeRoom } from '../../lib/resumeRoom';
import { codeFromUrl, initialTab } from '../../lib/joinFromUrl';

const CANONICAL = 'https://herdgamesonline.com/scattergories';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Scattergories Online',
      alternateName: ['Scattergories', 'Categories Game', 'Scattergories Online Free', 'Scattergories with Friends'],
      url: CANONICAL,
      description: 'Free online Scattergories: a random letter, a list of categories, and a timer — write a unique answer starting with the letter for each. Play with friends in the browser, no download, no signup.',
      image: OG,
      genre: ['Party', 'Word', 'Family'],
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
  name: 'How to play Scattergories online',
  step: [
    { '@type': 'HowToStep', name: 'Create a room', text: 'One player creates a room and shares the 4-letter code or link.' },
    { '@type': 'HowToStep', name: 'Get your letter', text: 'Each round shows a random letter and a list of categories, with a timer.' },
    { '@type': 'HowToStep', name: 'Write unique answers', text: 'Write an answer starting with the letter for each category before time runs out.' },
    { '@type': 'HowToStep', name: 'Score the unique ones', text: 'You score a point for each valid answer no one else wrote. Highest total after the rounds wins.' },
  ],
};
const FAQS = [
  { q: 'Is Scattergories online free?', a: 'Yes — completely free, no download and no signup. Create a room, share the code, and play right in the browser on any device.' },
  { q: 'How do you score in Scattergories?', a: 'Each round has a random letter. You write an answer starting with that letter for each category. You score a point for every valid answer that is unique — if two players write the same answer, it cancels out. Highest total after all rounds wins.' },
  { q: 'Can you play Scattergories on Zoom or Microsoft Teams?', a: 'Yes. Everyone joins from their own device with the room code while you stay on the call, so it works perfectly on Zoom, Microsoft Teams, Google Meet or any video chat — a great remote team icebreaker.' },
  { q: 'How many people can play?', a: 'From 2 players up to a big group — everyone plays on their own screen, so large teams work fine. The host controls the pace and number of rounds.' },
  { q: 'Do I need the board game?', a: 'No. This is a free online version of the classic categories word game — no dice, no timer, no paper. Everything runs in your browser.' },
];
const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };

export default function ScattergoriesHome() {
  const navigate = useNavigate();
  const { connected, error, createGame, joinGame, state, roomCode, clearError } = useScattergories();
  const funnel = useJoinFunnel({ game: 'scattergories', roomCode, error });
  const { packCode, packInfo } = usePackFromUrl();
  /* ?join=CODE opens straight on the join tab with the code filled in —
     see lib/joinFromUrl.js for why. */
  const [tab, setTab] = useState(initialTab);
  const [username, setUsername] = useState('');
  const [code, setCode] = useState(codeFromUrl);

  useEffect(() => { if (canResumeRoom(state) && roomCode) navigate(`/scattergories/room/${roomCode}`); }, [state, roomCode, navigate]);

  function handleCreate(e) { e.preventDefault(); if (username.trim()) { funnel.attemptCreate({ hasPack: !!packCode }); createGame(username, packCode ? { packCode } : {}); } }
  function handleJoin(e) { e.preventDefault(); if (username.trim() && code.trim()) { funnel.attemptJoin(code); joinGame(code, username); } }

  return (
    <MeadowLayout maxWidth="max-w-2xl">
      <Helmet>
        <title>Scattergories Online — Free Multiplayer Game with Friends (No Download)</title>
        <meta name="description" content="Play Scattergories online free: a random letter, a list of categories, a timer — write a unique answer for each. Multiplayer with friends, no download, no signup. Great on Zoom & Teams." />
        <link rel="canonical" href={CANONICAL} />
        <meta name="keywords" content="scattergories online, scattergories online free, play scattergories with friends, scattergories multiplayer, categories game online, scattergories on zoom, word party game online" />
        <meta property="og:title" content="Scattergories Online — Free Multiplayer with Friends" />
        <meta property="og:description" content="A random letter, categories, and a timer. Write a unique answer for each and score. Free, no download — play with friends in the browser." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Scattergories Online — Free Multiplayer" />
        <meta name="twitter:image" content={OG} />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(HOWTO_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <div className="text-center mb-6">
        <h1 style={fredokaStyle} className="text-4xl md:text-5xl font-bold text-[#2D1810]">Scattergories Online</h1>
        <p className="text-[#4A2D1B] text-lg mt-1">A random letter, a list of categories, a ticking clock. Write a unique answer for each — free, no download.</p>
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
            {tab === 'create' ? 'Create game 🅰️' : 'Join game →'}
          </button>
        </form>
        <p className="text-sm text-[#8B6347] mt-3 text-center">2+ players · no download · no signup</p>
      </div>

      {/* SEO content */}
      <div className="max-w-2xl mx-auto mt-10 text-[#4A2D1B] leading-relaxed">
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-2">The classic categories word game, free online</h2>
        <p className="mb-3">
          Scattergories is a fast, funny word game: each round you get a <strong>random letter</strong> and a list of <strong>categories</strong> — "an animal", "a movie", "something in the kitchen" — and a timer. Write an answer starting with the letter for every category before the clock runs out. The twist that makes it hilarious: you only score for answers <strong>no one else wrote</strong>, so you're racing to be both fast <em>and</em> original. It plays in the browser with <strong>no download and no signup</strong> — just share a room code.
        </p>

        {/* Mid-copy. The page's other hint sits at ~90% depth, which almost
            nobody scrolls to. Automatic placement is not a substitute here — it
            yields one ad at the bottom on this site. */}
        <AdSlot className="my-8" />

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">How to play</h2>
        <ol className="list-decimal pl-5 mb-3 space-y-1">
          <li><strong>Create a room</strong> and share the 4-letter code or link with your friends.</li>
          <li><strong>Each round shows a letter</strong> and a set of categories, with a countdown.</li>
          <li><strong>Write a unique answer</strong> starting with the letter for each category before time's up.</li>
          <li><strong>Score the originals</strong> — a point for every valid answer nobody else gave. Highest total after the rounds wins.</li>
        </ol>

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">Great for game nights and remote teams</h2>
        <p className="mb-3">
          Because everyone plays on their own device, Scattergories is a perfect <Link to="/office-games">team game</Link> and remote icebreaker — it works on a <Link to="/office-games/games-to-play-on-microsoft-teams">Microsoft Teams</Link>, Zoom or Google Meet call, and scales from 2 friends to a big all-hands. Want more group games? Try <Link to="/team-trivia">Team Trivia</Link>, <Link to="/say-anything">Say Anything</Link>, <Link to="/spectrum">Spectrum</Link>, <Link to="/chameleon">Chameleon</Link>, and <Link to="/caveman-clues">Caveman Clues</Link>, <Link to="/hue-match">Hue Match</Link>, <Link to="/guesstimate">Guesstimate</Link>, or a quick solo round of <Link to="/trivia">Daily Trivia</Link>.
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
