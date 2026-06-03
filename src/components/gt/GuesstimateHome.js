import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import { useGuesstimate } from '../../hooks/useGuesstimate';
import HowToPlay from './HowToPlay';
import AdSlot from '../AdSlot';

const CANONICAL_URL = 'https://herdgamesonline.com/guesstimate';
const OG_IMAGE = 'https://herdgamesonline.com/og-guesstimate.png';

const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://herdgamesonline.com/#website',
      url: 'https://herdgamesonline.com/',
      name: 'Herd Game',
    },
    {
      '@type': 'Organization',
      '@id': 'https://herdgamesonline.com/#org',
      name: 'Herd Game',
      url: 'https://herdgamesonline.com/',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://herdgamesonline.com/' },
        { '@type': 'ListItem', position: 2, name: 'Guesstimate', item: CANONICAL_URL },
      ],
    },
    {
      '@type': 'VideoGame',
      '@id': `${CANONICAL_URL}#game`,
      name: 'Guesstimate - Online Trivia Betting Game',
      alternateName: ['Guesstimate Online', 'Free Trivia Betting Game', 'Online Wits and Wagers Alternative'],
      url: CANONICAL_URL,
      description:
        'Free online trivia-betting party game. Guess numerical answers, then bet on whose guess is closest without going over. 2-12 players in your browser, no download.',
      image: OG_IMAGE,
      genre: ['Party', 'Trivia', 'Betting', 'Social'],
      gamePlatform: ['Web browser'],
      playMode: 'MultiPlayer',
      numberOfPlayers: { '@type': 'QuantitativeValue', minValue: 2, maxValue: 12 },
      applicationCategory: 'GameApplication',
      operatingSystem: 'Any (Web)',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@id': 'https://herdgamesonline.com/#org' },
    },
    {
      '@type': 'WebApplication',
      name: 'Guesstimate Online',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      applicationCategory: 'GameApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: 'Can you play a Wits and Wagers style game online for free?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. Guesstimate is a free online trivia-betting game inspired by classics like Wits & Wagers. Create a room, share a 4-letter code, and play with 2-12 friends in any browser — no download, no signup.' } },
        { '@type': 'Question', name: 'How do you play Guesstimate?',
          acceptedAnswer: { '@type': 'Answer', text: 'Each round, a trivia question with a numerical answer appears. Every player writes a guess. Guesses are sorted on a chalkboard with payout odds. Players place 2 chips on whichever guess they think is closest without going over. Points are awarded to the author of the winning guess and to anyone who bet on it.' } },
        { '@type': 'Question', name: 'How many players do you need?',
          acceptedAnswer: { '@type': 'Answer', text: 'Minimum 2, maximum 12. Sweet spot is 4-8 players for the best mix of variety and pace.' } },
        { '@type': 'Question', name: 'How long does a game take?',
          acceptedAnswer: { '@type': 'Answer', text: 'A full game is 7 rounds, taking about 20-25 minutes. Highest score after 7 rounds wins.' } },
        { '@type': 'Question', name: 'Is Guesstimate the same as Wits and Wagers?',
          acceptedAnswer: { '@type': 'Answer', text: 'Guesstimate is inspired by trivia-betting party games including Wits & Wagers, but is an original, independently-developed free online version. It is not affiliated with or endorsed by North Star Games. Wits & Wagers is a registered trademark of North Star Games, LLC.' } },
        { '@type': 'Question', name: 'Can I play Guesstimate over Zoom?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. Start a Zoom, Discord, or FaceTime call and have everyone open Guesstimate on their own device. The game runs in any browser on phone, tablet, or laptop.' } },
        { '@type': 'Question', name: 'Is Guesstimate family-friendly?',
          acceptedAnswer: { '@type': 'Answer', text: 'Yes. All questions are family-safe and educational. Great for game nights, classrooms, and family gatherings.' } },
        { '@type': 'Question', name: 'Do I need to download anything?',
          acceptedAnswer: { '@type': 'Answer', text: 'No. Guesstimate runs entirely in your browser. No app store, no installer, no account.' } },
      ],
    },
  ],
};

const FAQ_ITEMS = [
  { q: 'Can I play a Wits and Wagers style game online for free?', a: "Yes — Guesstimate is a free online trivia-betting party game inspired by the genre Wits & Wagers helped popularise. Create a room, share the 4-letter code, and play with 2-12 friends. No download, no signup. Not affiliated with North Star Games." },
  { q: 'How do you play Guesstimate?', a: "Each round, a trivia question with a numerical answer appears. Every player writes a guess. The guesses get sorted low-to-high on a chalkboard, each with a payout multiplier (5x lowest, down to 1x). Then everyone places 2 chips on whichever guess they think will win. Closest WITHOUT going over takes the round." },
  { q: 'How many players?', a: 'Minimum 2, maximum 12. Sweet spot is 4-8.' },
  { q: 'How long is a game?', a: 'Exactly 7 rounds. Usually 20-25 minutes.' },
  { q: 'Can I bet on my own guess?', a: 'Absolutely. If you really trust your number, double down on it for the full 5x payout (if you wrote the lowest answer).' },
  { q: 'What happens if all guesses are too high?', a: 'The lowest guess wins by default. The closest-without-going-over rule (Price is Right style) is what makes the strategic guessing fun.' },
  { q: 'Is it family-friendly?', a: 'Yes — all 200+ questions are family-safe. Great for game nights, classrooms, and multi-generation play.' },
];

function FaqItem({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#FFE8C8] py-3">
      <button onClick={() => setOpen(!open)} className="w-full text-left flex items-center justify-between gap-3">
        <span style={fredokaStyle} className="text-[#2D1810] font-semibold text-base md:text-lg">{q}</span>
        <span className={`text-[#E84A8B] font-bold text-xl shrink-0 transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && <p className="text-[#4A2D1B] mt-2 leading-relaxed">{a}</p>}
    </div>
  );
}

export default function GuesstimateHome() {
  const navigate = useNavigate();
  const { connected, error, createGame, joinGame, state, roomCode, clearError } = useGuesstimate();

  const [tab, setTab] = useState('create');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');

  React.useEffect(() => {
    if (state && roomCode) navigate(`/guesstimate/room/${roomCode}`);
  }, [state, roomCode, navigate]);

  function handleCreate(e) { e.preventDefault(); if (!username.trim()) return; createGame(username); }
  function handleJoin(e) { e.preventDefault(); if (!username.trim() || !code.trim()) return; joinGame(code, username); }

  return (
    <MeadowLayout>
      <Helmet>
        <title>Guesstimate: Free Online Trivia Betting Game, No Download</title>
        <meta name="description" content="Guess the answer, bet on who's closest. Guesstimate is a hilarious trivia party game for 2-12 players — no download, no signup. Play free in your browser →" />
        <link rel="canonical" href={CANONICAL_URL} />
        <meta name="keywords" content="guesstimate game, trivia betting game online, wits and wagers online free, wits and wagers alternative, free online trivia party game, number guessing game, browser party games, free party games with friends, online trivia games, virtual trivia night" />

        <meta property="og:title" content="Guesstimate: Free Online Trivia Betting Game, No Download" />
        <meta property="og:description" content="Guess the answer, bet on who's closest. Hilarious trivia party game for 2-12 players — no download, no signup. Play free in your browser →" />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:url" content={CANONICAL_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Herd Game" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Guesstimate: Free Online Trivia Betting Game, No Download" />
        <meta name="twitter:description" content="Guess the answer, bet on who's closest. Trivia party game for 2-12 players — no download. Play free in your browser →" />
        <meta name="twitter:image" content={OG_IMAGE} />

        <script type="application/ld+json">{JSON.stringify(STRUCTURED_DATA)}</script>
      </Helmet>

      {/* Play UI */}
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🎯</div>
          <h1 style={fredokaStyle} className="text-4xl md:text-5xl font-bold text-[#2D1810] mb-2">
            Play Guesstimate Online
          </h1>
          <p className="text-[#4A2D1B] text-lg">
            Free trivia-betting party game. Guess the answer, bet on the winner.
          </p>
          <p className="text-[#8B6347] text-sm mt-1">A free alternative to Wits &amp; Wagers — 2–12 players, no download.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-[0_18px_40px_-18px_rgba(45,24,16,0.25)] border-4 border-[#FFE8C8] p-6">
          <div className="flex rounded-2xl bg-[#FFF5E8] p-1 mb-6">
            {['create', 'join'].map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); clearError(); }}
                className={`flex-1 py-2 rounded-xl font-semibold text-sm transition-all ${
                  tab === t ? 'bg-white text-[#2D1810] shadow-sm' : 'text-[#8B6347] hover:text-[#2D1810]'
                }`}
                style={tab === t ? fredokaStyle : {}}
              >
                {t === 'create' ? 'Create Game' : 'Join Game'}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
          )}
          {!connected && (
            <div className="mb-4 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm flex items-center gap-2">
              <span className="animate-spin">⟳</span> Connecting to server…
            </div>
          )}

          <form onSubmit={tab === 'create' ? handleCreate : handleJoin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#4A2D1B] mb-1">Your name</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. Alex" maxLength={20}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#3D8B5A] focus:outline-none text-[#2D1810] bg-[#FFFDF8]" />
            </div>
            {tab === 'join' && (
              <div>
                <label className="block text-sm font-semibold text-[#4A2D1B] mb-1">Room code</label>
                <input type="text" value={code} onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                  placeholder="e.g. ABCD" maxLength={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#3D8B5A] focus:outline-none text-[#2D1810] bg-[#FFFDF8] uppercase tracking-widest text-center text-xl font-bold" />
              </div>
            )}
            <button type="submit" disabled={!connected}
              className="w-full py-3 rounded-xl font-bold text-white text-lg transition-all disabled:opacity-50"
              style={{ background: connected ? '#E84A8B' : '#ccc', fontFamily: 'Fredoka, sans-serif' }}>
              {tab === 'create' ? 'Create Room' : 'Join Room'}
            </button>
          </form>
        </div>

        {/* Ad — pre-game */}
        <div className="mt-6 max-h-[280px] overflow-hidden">
          <AdSlot slot="5969633275" />
        </div>

        <div className="mt-8">
          <HowToPlay compact />
        </div>
      </div>

      {/* SEO content sections */}
      <div className="max-w-3xl mx-auto mt-16 space-y-12">

        <section>
          <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#2D1810] mb-3">
            What is Guesstimate?
          </h2>
          <p className="text-[#4A2D1B] text-base md:text-lg leading-relaxed">
            <strong>Guesstimate</strong> is a free online trivia-betting party game inspired by classics like <strong>Wits &amp; Wagers</strong>. Each round, a trivia question with a numerical answer appears — things like <em>"How many bones are in the adult human body?"</em>. Every player writes a guess. The guesses are sorted on a chalkboard with payout odds, and then everyone places 2 betting chips on which guess they think will win.
            The catch (and the fun): closest <strong>WITHOUT going over</strong> wins, Price-is-Right style. So undershooting is safe and overshooting is fatal.
            Built for parties, family game nights, classroom games, remote teams, and Zoom calls. 2–12 players, plays in any browser.
          </p>
        </section>

        <section>
          <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#2D1810] mb-3">
            How to play Guesstimate online
          </h2>
          <ol className="space-y-3 text-[#4A2D1B]">
            <li className="flex gap-3"><span className="font-bold text-[#E84A8B] shrink-0">1.</span><span><strong>A trivia question appears.</strong> All players see it at the same time. Every question has one specific numerical answer.</span></li>
            <li className="flex gap-3"><span className="font-bold text-[#E84A8B] shrink-0">2.</span><span><strong>Everyone writes a guess.</strong> Type a single number. Don't know? Wild guesses are encouraged — being last on the board has the longest odds.</span></li>
            <li className="flex gap-3"><span className="font-bold text-[#E84A8B] shrink-0">3.</span><span><strong>The chalkboard appears.</strong> Guesses are sorted low → high. Lowest guess has the longest odds (5×), highest has the shortest (1×).</span></li>
            <li className="flex gap-3"><span className="font-bold text-[#E84A8B] shrink-0">4.</span><span><strong>Place 2 chips.</strong> On any guess — your own, a friend's, doesn't matter. Double down (both on one) for the full payout, or hedge (split across two) for safety.</span></li>
            <li className="flex gap-3"><span className="font-bold text-[#E84A8B] shrink-0">5.</span><span><strong>Reveal &amp; score.</strong> The actual answer is shown. Closest without going over wins. Author gets +2. Each chip on the winner pays the slot's multiplier.</span></li>
          </ol>
          <p className="text-[#4A2D1B] mt-4">
            <strong>7 rounds. Highest score wins.</strong> Usually 20–25 minutes total.
          </p>
        </section>

        <section>
          <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#2D1810] mb-3">
            Free alternative to Wits &amp; Wagers
          </h2>
          <p className="text-[#4A2D1B] leading-relaxed">
            If you've played Wits &amp; Wagers and loved it, Guesstimate captures the same mechanic: <em>numerical trivia + betting on whose answer is closest</em>. Differences:
          </p>
          <ul className="mt-3 space-y-2 text-[#4A2D1B]">
            <li>✓ <strong>Free</strong> — no purchase, no app, no Steam</li>
            <li>✓ <strong>Plays in any browser</strong> — phone, tablet, or laptop</li>
            <li>✓ <strong>No physical board needed</strong> — share a 4-letter room code instead</li>
            <li>✓ <strong>200+ original trivia questions</strong> — independently written, family-safe</li>
            <li>✓ <strong>2–12 players</strong></li>
          </ul>
          <p className="text-[#8B6347] text-xs mt-4 italic">
            Guesstimate is an independent project and is not affiliated with or endorsed by North Star Games. <em>Wits &amp; Wagers</em> is a registered trademark of North Star Games, LLC.
          </p>
        </section>

        <section className="bg-[#FFF0F7] rounded-3xl border-4 border-[#E84A8B] p-6 md:p-8 text-center">
          <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#2D1810] mb-2">Ready to play?</h2>
          <p className="text-[#4A2D1B] mb-5">Create a room in 5 seconds. Share the code. Start guessing.</p>
          <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-block px-8 py-3 rounded-2xl bg-[#E84A8B] hover:bg-[#C73B73] text-white font-bold text-lg transition-colors"
            style={fredokaStyle}>
            Start a game →
          </a>
        </section>

        <section>
          <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#2D1810] mb-1">Frequently asked questions</h2>
          <div className="bg-white rounded-2xl border-2 border-[#FFE8C8] p-4 md:p-6 mt-3">
            {FAQ_ITEMS.map((item, i) => <FaqItem key={i} q={item.q} a={item.a} defaultOpen={i === 0} />)}
          </div>
        </section>

        {/* Sub-pages */}
        <section>
          <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#2D1810] mb-4 text-center">
            Guesstimate guides
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <li><Link to="/guesstimate/how-to-play-online-trivia-betting-game" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
              <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">📖 How to Play (full rules)</h3>
              <p className="text-sm text-[#8B6347]">Rules, scoring, payout odds, examples.</p>
            </Link></li>
            <li><Link to="/guesstimate/200-trivia-questions-with-numerical-answers" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
              <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">🎯 200 Trivia Questions</h3>
              <p className="text-sm text-[#8B6347]">Free list with numerical answers.</p>
            </Link></li>
            <li><Link to="/guesstimate/free-alternative-to-wits-and-wagers-online" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
              <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">🆓 Free Wits and Wagers Alternative</h3>
              <p className="text-sm text-[#8B6347]">How Guesstimate compares.</p>
            </Link></li>
            <li><Link to="/guesstimate/best-online-trivia-games-for-family-game-night" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
              <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">👨‍👩‍👧 Family Trivia Games</h3>
              <p className="text-sm text-[#8B6347]">Best online options for game night.</p>
            </Link></li>
            <li><Link to="/guesstimate/how-to-host-virtual-trivia-night-on-zoom" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
              <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">💻 Virtual Trivia Night on Zoom</h3>
              <p className="text-sm text-[#8B6347]">Step-by-step setup guide.</p>
            </Link></li>
            <li><Link to="/guesstimate/online-trivia-betting-game-rules-and-scoring" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
              <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">🎲 Scoring &amp; Strategy</h3>
              <p className="text-sm text-[#8B6347]">Payout math, double-down strategy.</p>
            </Link></li>
            <li><Link to="/guesstimate/free-jackbox-alternative-no-download" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
              <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">📦 Free Jackbox Alternative</h3>
              <p className="text-sm text-[#8B6347]">No download, no signup, plays in browser.</p>
            </Link></li>
            <li><Link to="/guesstimate/kahoot-alternative-for-adults" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
              <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">🎓 Kahoot Alternative for Adults</h3>
              <p className="text-sm text-[#8B6347]">Party-night trivia, not a classroom quiz.</p>
            </Link></li>
            <li><Link to="/guesstimate/christmas-and-holiday-trivia-party-games-online" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
              <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">🎄 Holiday Trivia Party Games</h3>
              <p className="text-sm text-[#8B6347]">Christmas, New Year, Halloween, Thanksgiving.</p>
            </Link></li>
            <li><Link to="/guesstimate/price-is-right-style-party-game-online" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
              <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">💰 Price Is Right Style Game</h3>
              <p className="text-sm text-[#8B6347]">Closest-without-going-over guessing fun.</p>
            </Link></li>
            <li><Link to="/guesstimate/trivia-games-for-2-players-online-free" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
              <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">👥 Trivia for 2 Players</h3>
              <p className="text-sm text-[#8B6347]">Works great head-to-head, online and free.</p>
            </Link></li>
            <li><Link to="/guesstimate/virtual-team-building-trivia-game-for-work" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
              <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">🏢 Virtual Team Building Trivia</h3>
              <p className="text-sm text-[#8B6347]">Remote team icebreakers and game nights.</p>
            </Link></li>
            <li><Link to="/guesstimate/online-games-for-long-distance-couples-free" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
              <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">❤️ Games for Long-Distance Couples</h3>
              <p className="text-sm text-[#8B6347]">Play together over FaceTime or Zoom, free.</p>
            </Link></li>
            <li><Link to="/guesstimate/games-to-play-on-facetime-and-video-calls" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
              <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">📱 Games for FaceTime &amp; Video Calls</h3>
              <p className="text-sm text-[#8B6347]">No app — play on any call with friends.</p>
            </Link></li>
            <li><Link to="/guesstimate/classroom-trivia-games-no-materials-for-teachers" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
              <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">🏫 Classroom Games (No Materials)</h3>
              <p className="text-sm text-[#8B6347]">No-prep trivia for teachers &amp; subs.</p>
            </Link></li>
            <li><Link to="/guesstimate/new-years-eve-party-games-for-adults-large-groups" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
              <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">🎉 New Year's Eve Party Games</h3>
              <p className="text-sm text-[#8B6347]">For adults &amp; big groups — countdown trivia.</p>
            </Link></li>
            <li><Link to="/guesstimate/drinking-party-games-online-free-for-adults" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
              <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">🍻 Drinking Party Games</h3>
              <p className="text-sm text-[#8B6347]">Adult trivia drinking game, no app.</p>
            </Link></li>
            <li><Link to="/guesstimate/family-reunion-games-for-adults-large-groups" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
              <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">👨‍👩‍👧‍👦 Family Reunion Games</h3>
              <p className="text-sm text-[#8B6347]">Big multi-generational groups, all ages.</p>
            </Link></li>
          </ul>
        </section>

        <section className="text-center pb-8">
          <h2 style={fredokaStyle} className="text-xl md:text-2xl font-bold text-[#2D1810] mb-3">More free online party games</h2>
          <p className="text-[#4A2D1B]">
            <Link to="/" className="text-[#3D8B5A] hover:text-[#2F6E45] font-semibold underline">Herd Mentality</Link>{' · '}
            <Link to="/say-anything" className="text-[#3D8B5A] hover:text-[#2F6E45] font-semibold underline">Say Anything</Link>
          </p>
        </section>
      </div>
    </MeadowLayout>
  );
}
