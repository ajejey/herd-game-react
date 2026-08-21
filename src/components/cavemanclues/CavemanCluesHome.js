import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import { useCavemanClues } from '../../hooks/useCavemanClues';
import AdSlot from '../AdSlot';
import CavemanArt from './CavemanArt';
import JoinCodeHelp from '../JoinCodeHelp';
import useJoinFunnel from '../../hooks/useJoinFunnel';
import { sanitizeCodeInput } from '../../lib/packCode';

const CANONICAL = 'https://herdgamesonline.com/caveman-clues';
const OG = 'https://herdgamesonline.com/og-caveman-clues.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Caveman Clues',
      alternateName: ['Caveman Clues Online', 'One Syllable Game', 'Short Word Guessing Game', 'Caveman Words'],
      url: CANONICAL,
      description: 'Free online party game: describe the secret word using only one-syllable words while everyone else races to guess it. Play with friends in the browser, no download, no signup.',
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
  name: 'How to play Caveman Clues online',
  step: [
    { '@type': 'HowToStep', name: 'Create a room', text: 'One player creates a room and shares the 4-letter code with friends.' },
    { '@type': 'HowToStep', name: 'One player gets the word', text: 'Each round, one player secretly sees a word like Volcano or Dinosaur.' },
    { '@type': 'HowToStep', name: 'Describe it in short words', text: 'They type clues using only one-syllable words. Longer words are allowed through but cost a point.' },
    { '@type': 'HowToStep', name: 'Race to guess', text: 'Everyone else types guesses. The first correct guess scores two points, the clue giver scores one.' },
  ],
};
const FAQS = [
  { q: 'What is Caveman Clues?', a: 'A free online party game where one player has to describe a secret word using only one-syllable words — no "elephant", no "enormous", no "animal". Everyone else races to type the answer. It is played in the browser with a room code, so everyone uses their own phone.' },
  { q: 'Is it free?', a: 'Completely free, with no download and no signup. Create a room, share the four-letter code, and play.' },
  { q: 'How does it know if a word is one syllable?', a: 'The game checks every clue as you type and marks anything longer. It is deliberately generous — if a word is genuinely arguable, like "fire" or "hour", it lets you have it. You are never penalised for a word a reasonable person would call one syllable.' },
  { q: 'What happens if I use a long word by accident?', a: 'The clue still goes through and everyone sees your slip, exactly like saying it out loud at a table. You just lose a point for it. Saying the actual answer is different — that gets blocked before anyone sees it.' },
  { q: 'How many people can play?', a: 'Three at minimum, since someone has to give clues while at least two race to guess, and up to twenty. Everyone plays on their own device, so big groups work fine.' },
  { q: 'Can you play it on Zoom or Teams?', a: 'Yes. Everyone joins from their own device with the room code while you stay on the call, so it works on Zoom, Microsoft Teams, Google Meet or any video chat.' },
];
const BREADCRUMB_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Herd Games', item: 'https://herdgamesonline.com/' },
    { '@type': 'ListItem', position: 2, name: 'Party games', item: 'https://herdgamesonline.com/all-games' },
    { '@type': 'ListItem', position: 3, name: 'Caveman Clues', item: CANONICAL },
  ],
};
const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };

export default function CavemanCluesHome() {
  const navigate = useNavigate();
  const { connected, error, createGame, joinGame, state, roomCode, clearError } = useCavemanClues();
  const funnel = useJoinFunnel({ game: 'cavemanclues', roomCode, error });
  const [tab, setTab] = useState('create');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => { if (state && roomCode) navigate(`/caveman-clues/room/${roomCode}`); }, [state, roomCode, navigate]);

  function handleCreate(e) {
    e.preventDefault();
    if (username.trim()) { funnel.attemptCreate({ hasPack: false }); createGame(username); }
  }
  function handleJoin(e) {
    e.preventDefault();
    if (username.trim() && code.trim()) { funnel.attemptJoin(code); joinGame(code, username); }
  }

  return (
    <MeadowLayout maxWidth="max-w-2xl">
      <Helmet>
        <title>Caveman Clues — Free Online Party Game, One Syllable Only</title>
        <meta name="description" content="Describe the word using only one-syllable words while your friends race to guess. Free online party game, multiplayer in the browser, no download and no signup." />
        <link rel="canonical" href={CANONICAL} />
        <meta name="keywords" content="caveman clues, one syllable game, short word game online, party word game, guessing game online free, party games with friends online" />
        <meta property="og:title" content="Caveman Clues — Free Online Party Game" />
        <meta property="og:description" content="Say it in short words. One player describes, everyone else guesses. Free, no download, play with friends in the browser." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Caveman Clues — Free Online Party Game" />
        <meta name="twitter:image" content={OG} />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(HOWTO_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(BREADCRUMB_SCHEMA)}</script>
      </Helmet>

      {/*
        A mascot, not a hero. He is 1.5x as tall as he is wide, so every pixel
        of width costs one and a half of height — at 310px he pushed the Create
        button to the very bottom of a laptop screen and off a phone entirely.
        Kept small enough that the whole form clears the fold on both, because
        a picture that hides the button it exists to sell is a worse picture.
        TESTING.md's first-60-seconds check is what this answers to.
      */}
      <div className="text-center mb-6">
        <CavemanArt className="mx-auto mb-1 max-w-[160px] sm:max-w-[175px] md:max-w-[190px]" />
        <h1 style={fredokaStyle} className="text-4xl md:text-5xl font-bold text-[#2D1810]">Caveman Clues</h1>
        <p className="text-[#4A2D1B] text-lg mt-1">
          Say it in short words. One big word and you lose a point — free, no download.
        </p>
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
            {tab === 'create' ? 'Create game' : 'Join game →'}
          </button>
        </form>
        <p className="text-sm text-[#8B6347] mt-3 text-center">3+ players · no download · no signup</p>
      </div>

      {/* SEO content */}
      <div className="max-w-2xl mx-auto mt-10 text-[#4A2D1B] leading-relaxed">
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-2">The party game where big words are banned</h2>
        <p className="mb-3">
          One player sees a secret word — <strong>Volcano</strong>, <strong>Dinosaur</strong>, <strong>Sunglasses</strong> — and has to describe it to everyone else using <strong>only one-syllable words</strong>. No "mountain". No "enormous". No "animal". Everyone else races to type the answer. It is much harder than it sounds, and watching someone try to say "helicopter" with words like "big", "loud" and "sky" is the entire point.
        </p>

        {/* Mid-copy. The other hint sits near the bottom, which almost nobody
            scrolls to. Automatic placement yields one ad at the page foot here. */}
        <AdSlot className="my-8" />

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">How to play</h2>
        <ol className="list-decimal pl-5 mb-3 space-y-1">
          <li><strong>Create a room</strong> and share the 4-letter code with your friends.</li>
          <li><strong>One player gets the word</strong> and starts typing clues. Long words are marked as you type.</li>
          <li><strong>Everyone else guesses</strong> — first correct answer takes it.</li>
          <li><strong>Score:</strong> two points to the guesser, one to the clue giver, minus one for every slip. Then it passes to the next player.</li>
        </ol>

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">Why the computer is a better referee</h2>
        <p className="mb-3">
          Around a table, someone has to catch the slips as they happen, and people are bad at it — half the arguments in this kind of game are about whether "fire" is one syllable or two. Here the game checks every word as you type. It is also deliberately generous: genuinely arguable words like <em>fire</em>, <em>hour</em> and <em>real</em> are allowed, so you are never penalised for something a reasonable person would let through.
        </p>

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">Great for game nights and remote teams</h2>
        <p className="mb-3">
          Everyone plays on their own phone, so it works on a <Link to="/office-games/games-to-play-on-microsoft-teams">Microsoft Teams</Link>, Zoom or Google Meet call and scales from three friends to a big group. Want more? Try <Link to="/taboo">Taboo</Link>, <Link to="/scattergories">Scattergories</Link>, <Link to="/say-anything">Say Anything</Link>, <Link to="/chameleon">Chameleon</Link> and <Link to="/spectrum">Spectrum</Link>, or a quick solo round of <Link to="/trivia">Daily Trivia</Link>.
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

      <div className="mt-8"><AdSlot /></div>
    </MeadowLayout>
  );
}
