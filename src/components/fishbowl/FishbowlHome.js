import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import { useFishbowl } from '../../hooks/useFishbowl';
import AdSlot from '../AdSlot';

const CANONICAL = 'https://herdgamesonline.com/fishbowl';
const OG = 'https://herdgamesonline.com/og-image.png';

const SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'WebSite', '@id': 'https://herdgamesonline.com/#website', url: 'https://herdgamesonline.com/', name: 'Herd Game' },
    {
      '@type': 'VideoGame',
      name: 'Fishbowl',
      alternateName: ['Fishbowl Game', 'Salad Bowl', 'Fishbowl Online', 'Charades Fishbowl'],
      url: CANONICAL,
      description: 'Free online Fishbowl (aka Salad Bowl): everyone adds words to the bowl, then two teams play three rounds — describe it, act it out, then one word only. Play with friends over a video call, no download, no signup.',
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
  '@context': 'https://schema.org', '@type': 'HowTo', name: 'How to play Fishbowl online',
  step: [
    { '@type': 'HowToStep', name: 'Add words to the bowl', text: 'Everyone secretly submits a few words or phrases into the shared bowl.' },
    { '@type': 'HowToStep', name: 'Round 1 — Describe', text: 'Teams take turns; the active player describes each word without saying it while their team guesses.' },
    { '@type': 'HowToStep', name: 'Round 2 — Act', text: 'Same words, but now you act them out — charades, no talking.' },
    { '@type': 'HowToStep', name: 'Round 3 — One word', text: 'Same words again, but you can only say a single word as the clue. Most points wins.' },
  ],
};
const FAQS = [
  { q: 'Is Fishbowl online free?', a: 'Yes — completely free, no download and no signup. One person creates a room, everyone joins with the code, and you play in the browser on any device.' },
  { q: 'What is the Fishbowl game (Salad Bowl)?', a: 'Fishbowl is a team word game in three rounds using the same set of words each time: round 1 you describe the word, round 2 you act it out (charades), round 3 you can say only one word. Everyone adds the words at the start, so it is personal and hilarious.' },
  { q: 'Can you play Fishbowl over Zoom or Teams?', a: 'Yes — it is made for video calls. Everyone joins from their own device and plays alongside the Zoom, Microsoft Teams or Google Meet call, which is where the describing, acting and laughing happen.' },
  { q: 'How many people do you need?', a: 'Three is enough — with 3 you play co-op, sharing one score. With 4 or more you split into two teams and compete. It gets better with more; 6 to 12 is a great range for a party or team social.' },
  { q: 'How long does a game take?', a: 'About 10 minutes. Everyone adds 2 words to the bowl, and you play through that same bowl three times — describing, then acting, then a single-word clue.' },
  { q: 'Do I need the physical game or paper?', a: 'No. This runs the whole bowl for you — collecting words, splitting teams, tracking the three rounds and scoring — all in the browser.' },
];
const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };

export default function FishbowlHome() {
  const navigate = useNavigate();
  const { connected, error, createGame, joinGame, state, roomCode, clearError } = useFishbowl();
  const [tab, setTab] = useState('create');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => { if (state && roomCode) navigate(`/fishbowl/room/${roomCode}`); }, [state, roomCode, navigate]);

  function handleCreate(e) { e.preventDefault(); if (username.trim()) createGame(username); }
  function handleJoin(e) { e.preventDefault(); if (username.trim() && code.trim()) joinGame(code, username); }

  return (
    <MeadowLayout maxWidth="max-w-2xl">
      <Helmet>
        <title>Fishbowl Game Online — Free Salad Bowl with Friends (No Download)</title>
        <meta name="description" content="Play Fishbowl (Salad Bowl) online free: everyone adds words, then two teams play three rounds — describe, act, one word. Multiplayer with friends over Zoom or Teams. No download, no signup." />
        <link rel="canonical" href={CANONICAL} />
        <meta name="keywords" content="fishbowl game, fishbowl game online, salad bowl game, fishbowl online free, charades online with friends, fishbowl game zoom, team word game online" />
        <meta property="og:title" content="Fishbowl Game Online — Free Salad Bowl with Friends" />
        <meta property="og:description" content="Everyone adds words, then two teams describe, act and one-word their way to victory. Free, no download — play over any video call." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Fishbowl Game Online — Free Salad Bowl" />
        <meta name="twitter:image" content={OG} />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(HOWTO_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <div className="text-center mb-6">
        <h1 style={fredokaStyle} className="text-4xl md:text-5xl font-bold text-[#2D1810]">Fishbowl</h1>
        <p className="text-[#4A2D1B] text-lg mt-1">The Salad Bowl party game — describe it, act it out, one word. The same words three ways, and it gets funnier every round.</p>

        {/* The 3 rounds, shown not told — this is the hook, and it was buried
            in prose below the fold on the worst-converting page on the site. */}
        <div className="flex gap-2 justify-center mt-4 max-w-md mx-auto">
          {[
            { n: '1', t: 'Describe', s: 'say anything but the word' },
            { n: '2', t: 'Act', s: 'charades, no talking' },
            { n: '3', t: 'One word', s: 'a single clue' },
          ].map((r) => (
            <div key={r.n} className="flex-1 rounded-2xl border-2 border-[#FFE8C8] bg-white/70 p-2.5">
              <div style={fredokaStyle} className="text-[#E84A8B] font-bold text-base">Round {r.n}</div>
              <div style={fredokaStyle} className="font-bold text-[#2D1810] leading-tight">{r.t}</div>
              <div className="text-[13px] text-[#8B6347] leading-tight mt-0.5">{r.s}</div>
            </div>
          ))}
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
            <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Room code" maxLength={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#3D8B5A] outline-none text-[#2D1810] bg-[#FFFDF8] tracking-widest font-mono" />
          )}
          <button type="submit" disabled={!connected} style={{ background: '#E84A8B', fontFamily: 'Fredoka, sans-serif' }}
            className="w-full py-3 rounded-xl text-white font-bold text-lg disabled:opacity-50">
            {tab === 'create' ? 'Create game 🎣' : 'Join game →'}
          </button>
        </form>
        <p className="text-sm text-[#8B6347] mt-3 text-center">3+ players · no download · no signup</p>
      </div>

      {/* SEO content */}
      <div className="max-w-2xl mx-auto mt-10 text-[#4A2D1B] leading-relaxed">
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-2">Fishbowl, aka Salad Bowl — the best group party game, online</h2>
        <p className="mb-3">
          Fishbowl is a team word game that gets funnier every round because you play the <strong>same words three ways</strong>. First everyone secretly adds a few words or names to the bowl. Then two teams take turns racing the clock: <strong>round 1 you describe</strong> the word, <strong>round 2 you act it out</strong> (charades), and <strong>round 3 you can only say one word</strong>. By round three the whole group knows the words, so a single perfect clue brings the house down. It runs the whole bowl for you — no paper, no download, no signup.
        </p>

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">How to play</h2>
        <ol className="list-decimal pl-5 mb-3 space-y-1">
          <li><strong>Add words to the bowl.</strong> Everyone submits a few words or phrases at the start.</li>
          <li><strong>Round 1 — Describe.</strong> Teams take turns; the active player describes each word (without saying it) while their team guesses against the timer.</li>
          <li><strong>Round 2 — Act.</strong> Same words, now charades — no talking.</li>
          <li><strong>Round 3 — One word.</strong> Same words again, but a single-word clue only. Most points across the rounds wins.</li>
        </ol>

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-6 mb-3">Perfect for video calls and team socials</h2>
        <p className="mb-3">
          Because everyone plays from their own device while the describing and acting happen on camera, Fishbowl is a brilliant <Link to="/office-games">team game</Link> for a <Link to="/office-games/games-to-play-on-microsoft-teams">Microsoft Teams</Link>, Zoom or Google Meet call — and a party favourite in person too. More group games: <Link to="/taboo">Taboo</Link> (the closest cousin — describe without the forbidden words), <Link to="/team-trivia">Team Trivia</Link>, <Link to="/say-anything">Say Anything</Link>, <Link to="/scattergories">Scattergories</Link>, <Link to="/would-you-rather">Would You Rather</Link>, <Link to="/spectrum">Spectrum</Link> and <Link to="/chameleon">Chameleon</Link>.
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
