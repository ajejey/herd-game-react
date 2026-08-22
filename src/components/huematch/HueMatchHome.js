import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import { useHueMatch } from '../../hooks/useHueMatch';
import AdSlot from '../AdSlot';
import HueArt from './HueArt';
import JoinCodeHelp from '../JoinCodeHelp';
import useJoinFunnel from '../../hooks/useJoinFunnel';
import { sanitizeCodeInput } from '../../lib/packCode';
import { canResumeRoom } from '../../lib/resumeRoom';

const CANONICAL = 'https://herdgamesonline.com/hue-match';
const OG = 'https://herdgamesonline.com/og-hue-match.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Hue Match',
      alternateName: ['Hue Match Online', 'Color Guessing Game', 'Color Clue Game', 'Hues and Cues Online'],
      url: CANONICAL,
      description: 'Free online color guessing party game. One player sees a secret color and gives a one-word cue; everyone else taps where they think it is on a board of 126 colors. Play in the browser, no download, no signup.',
      image: OG,
      genre: ['Party', 'Family', 'Casual'],
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
  name: 'How to play Hue Match online',
  step: [
    { '@type': 'HowToStep', name: 'Create a room', text: 'One player creates a room and shares the 4-letter code with friends.' },
    { '@type': 'HowToStep', name: 'One player gets a color', text: 'Each round one player secretly sees one square on the color board.' },
    { '@type': 'HowToStep', name: 'Give a one-word cue', text: 'They type a single word that the color reminds them of. No color names and no board positions.' },
    { '@type': 'HowToStep', name: 'Everyone taps a square', text: 'Each player taps the color they think it is. Tap again to move it, then lock it in.' },
    { '@type': 'HowToStep', name: 'A two-word cue, then reveal', text: 'The cue giver adds a two-word cue and everyone guesses again. Closer squares score more.' },
  ],
};
const FAQS = [
  { q: 'What is Hue Match?', a: 'A free online color guessing party game. One player secretly sees a single color on a board of 126 and has to describe it in one word — not a color name, just what it reminds them of. Everyone else taps where they think it is. Then a two-word cue and a second guess.' },
  { q: 'Is it free?', a: 'Completely free, with no download and no signup. Create a room, share the four-letter code, and play. Everyone uses their own phone.' },
  { q: 'How does scoring work?', a: 'You score 3 for the exact square, 2 for any square touching it, and 1 for the ring after that. Two guesses per round, so 6 is a perfect round. The cue giver scores a point for every close guess they cause, capped so a big room does not hand them the game.' },
  { q: 'Why can I not say "blue"?', a: 'Because it is the answer, not a cue. The game refuses color names and board positions before anyone sees them, so nobody loses a round to it. Everything else is fair game — "rust", "coffee", "jade" and "seasick" all work, and the good cues are usually the strange ones.' },
  { q: 'How many people can play?', a: 'Three at minimum, since someone has to give the cues while at least two guess, and up to twenty. It plays well with big groups because everyone guesses at the same time — nobody waits their turn.' },
  { q: 'Can you play it on Zoom or Teams?', a: 'Yes. Everyone joins from their own device with the room code while you stay on the call, so it works on Zoom, Microsoft Teams, Google Meet or any video chat.' },
  { q: 'Is this Hues and Cues?', a: 'It is our own free browser version of that kind of color-cue game. Nothing to buy, nothing to print, and the board is on everyone’s own phone rather than passed around a table.' },
];
const BREADCRUMB_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Herd Games', item: 'https://herdgamesonline.com/' },
    { '@type': 'ListItem', position: 2, name: 'Party games', item: 'https://herdgamesonline.com/all-games' },
    { '@type': 'ListItem', position: 3, name: 'Hue Match', item: CANONICAL },
  ],
};
const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };

export default function HueMatchHome() {
  const navigate = useNavigate();
  const { connected, error, createGame, joinGame, state, roomCode, clearError } = useHueMatch();
  const funnel = useJoinFunnel({ game: 'huematch', roomCode, error });
  const [tab, setTab] = useState('create');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => { if (canResumeRoom(state) && roomCode) navigate(`/hue-match/room/${roomCode}`); }, [state, roomCode, navigate]);

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
        <title>Hue Match — Free Online Color Guessing Party Game</title>
        <meta name="description" content="Free online color guessing game. One player sees a secret color and gives a one-word cue — everyone else taps where they think it is. No download, no signup." />
        <link rel="canonical" href={CANONICAL} />
        <meta name="keywords" content="hue match, color guessing game online, color party game, hues and cues online free, guess the color game, party games with friends online" />
        <meta property="og:title" content="Hue Match — Free Online Color Guessing Game" />
        <meta property="og:description" content="Describe a color in one word. Everyone taps where they think it is. Free, no download, play with friends in the browser." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hue Match — Free Online Color Guessing Game" />
        <meta name="twitter:image" content={OG} />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(HOWTO_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(BREADCRUMB_SCHEMA)}</script>
      </Helmet>

      {/* The board is the hero — kept short so the Create button clears the
          fold on a phone, the same lesson CavemanArt paid for. */}
      <div className="text-center mb-6">
        <HueArt className="mx-auto mb-3 max-w-[260px] sm:max-w-[320px]" />
        <h1 style={fredokaStyle} className="text-4xl md:text-5xl font-bold text-[#2D1810]">Hue Match</h1>
        <p className="text-[#4A2D1B] text-lg mt-1">
          Describe a color in one word. Everyone taps where they think it is.
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
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-2">The color guessing game where you can’t name the color</h2>
        <p className="mb-3">
          One player secretly sees a single square on a board of 126 colors and has to describe it in <strong>one word</strong>. Not "blue" — that is the answer. <strong>Seasick</strong>. <strong>Rust</strong>. <strong>Grandma</strong>. Everyone else taps the square they think it is. Then a <strong>two-word</strong> cue, a second guess, and the reveal shows exactly how close everybody got.
        </p>
        <p className="mb-3">
          It is a game about the words people reach for when the obvious word is gone, and the arguments afterwards — "how is <em>that</em> ‘coffee’?" — are the point.
        </p>

        {/* Mid-copy. Automatic placement yields one ad at the page foot here. */}
        <AdSlot className="my-8" />

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">How to play</h2>
        <ol className="list-decimal pl-5 mb-3 space-y-1">
          <li><strong>Create a room</strong> and share the 4-letter code with your friends.</li>
          <li><strong>One player gets a color</strong> and types a one-word cue.</li>
          <li><strong>Everyone taps a square.</strong> Tap again to move it — nothing counts until you lock it in.</li>
          <li><strong>A two-word cue</strong> follows, then everyone guesses once more.</li>
          <li><strong>Score:</strong> 3 for the exact square, 2 for touching it, 1 for the next ring. The cue giver scores for every close guess they caused.</li>
        </ol>

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">Why a phone board beats a cardboard one</h2>
        <p className="mb-3">
          Around a table everyone leans over the same board, which means everyone sees where the first person put their marker — and half the room quietly copies. Here nobody sees anyone else’s guess until the reveal, so every guess is genuinely yours. The board is also on your own screen at arm’s length rather than upside down across a table, which matters a lot when two squares are one shade apart.
        </p>

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">Great for game nights and remote teams</h2>
        <p className="mb-3">
          Everyone guesses at the same time, so it scales from three friends to a big group without anyone waiting their turn — which makes it one of the better <Link to="/office-games/games-to-play-on-microsoft-teams">Microsoft Teams</Link>, Zoom or Google Meet games. Want more? Try <Link to="/caveman-clues">Caveman Clues</Link>, <Link to="/spectrum">Spectrum</Link>, <Link to="/chameleon">Chameleon</Link>, <Link to="/taboo">Taboo</Link> and <Link to="/say-anything">Say Anything</Link>, or a quick solo round of <Link to="/trivia">Daily Trivia</Link>.
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
