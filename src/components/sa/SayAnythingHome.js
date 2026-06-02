import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import { useSayAnything } from '../../hooks/useSayAnything';
import HowToPlay from './HowToPlay';
import AdSlot from '../AdSlot';

const CANONICAL_URL = 'https://herdgame.vercel.app/say-anything';
const OG_IMAGE = 'https://herdgame.vercel.app/og-say-anything.png';

// JSON-LD structured data — 6 schemas in one @graph
const STRUCTURED_DATA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://herdgame.vercel.app/#website',
      url: 'https://herdgame.vercel.app/',
      name: 'Herd Game',
    },
    {
      '@type': 'Organization',
      '@id': 'https://herdgame.vercel.app/#org',
      name: 'Herd Game',
      url: 'https://herdgame.vercel.app/',
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://herdgame.vercel.app/' },
        { '@type': 'ListItem', position: 2, name: 'Say Anything', item: CANONICAL_URL },
      ],
    },
    {
      '@type': 'VideoGame',
      '@id': `${CANONICAL_URL}#game`,
      name: 'Say Anything - Online Party Game',
      alternateName: ['Say Anything Online', 'Say Anything Free', 'Say Anything Multiplayer'],
      url: CANONICAL_URL,
      description:
        'Free online multiplayer Say Anything party game. Play with 3-12 friends in your browser. No download, no signup — just share a room link and start the party.',
      image: OG_IMAGE,
      genre: ['Party', 'Trivia', 'Social'],
      gamePlatform: ['Web browser'],
      playMode: 'MultiPlayer',
      numberOfPlayers: { '@type': 'QuantitativeValue', minValue: 3, maxValue: 12 },
      applicationCategory: 'GameApplication',
      operatingSystem: 'Any (Web)',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      publisher: { '@id': 'https://herdgame.vercel.app/#org' },
    },
    {
      '@type': 'WebApplication',
      name: 'Say Anything Online',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      applicationCategory: 'GameApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Can you play Say Anything online for free?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Yes. herdgame.vercel.app/say-anything offers a free online multiplayer version. Create a room, share the 4-letter code with friends, and play in any browser — no download or signup required.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do you play Say Anything?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'One player is the judge each round. They pick a question. Everyone else writes a funny answer. The judge secretly picks their favorite. Other players bet 2 tokens on which answer the judge chose. Points are scored, then the next player becomes judge.',
          },
        },
        {
          '@type': 'Question',
          name: 'How many players do you need for Say Anything?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'You need at least 3 players to play Say Anything. The game scales up to 12 players, with 4-8 being the ideal group size for laughs and pacing.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is there an official Say Anything app?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'No official app exists. Herd Game offers a free fan-made web version that plays in your browser on phone or computer — no download needed.',
          },
        },
        {
          '@type': 'Question',
          name: 'What games are similar to Say Anything?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Say Anything is most similar to Apples to Apples and Quiplash — all involve writing answers and a judge picking favorites. Cards Against Humanity is comparable but uses pre-written cards instead of free-text answers.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can you play Say Anything over Zoom or Discord?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Yes. The free online version works perfectly alongside a Zoom or Discord call — players join from their own devices and play together while video-chatting.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does a Say Anything game take?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'A typical Say Anything game runs 20-30 minutes. First player to 7 points wins, which usually takes 12-15 rounds depending on group size.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Say Anything family-friendly?',
          acceptedAnswer: {
            '@type': 'Answer',
            text:
              'Yes. Say Anything is rated for ages 13+ and the original questions are family-safe. Since players write their own answers, the group sets the tone.',
          },
        },
      ],
    },
  ],
};

const FAQ_ITEMS = [
  {
    q: 'Can you play Say Anything online for free?',
    a:
      'Yes — this page lets you create a room and play with up to 12 friends free, in your browser, no signup or download. Just share the 4-letter room code.',
  },
  {
    q: 'How do you play Say Anything?',
    a:
      'One player is the judge each round. The judge picks a question. Everyone else writes a funny answer. The judge secretly picks their favorite. The other players bet 2 tokens on which answer they think the judge chose. Points are scored — first to 7 wins.',
  },
  {
    q: 'How many players do you need?',
    a:
      'Minimum 3. Maximum 12. Sweet spot is 4–8 players. The more the merrier, but bigger groups make rounds longer.',
  },
  {
    q: 'Is there an official Say Anything app?',
    a:
      "No. North Star Games never released an official digital version — that's why we built this free fan version. It runs in any modern browser on phones, tablets, and laptops.",
  },
  {
    q: 'What games are similar to Say Anything?',
    a:
      'Apples to Apples, Quiplash, and Cards Against Humanity all share the "write/pick funny answers" mechanic. Quiplash is the closest digital cousin — but it requires Jackbox ($30+).',
  },
  {
    q: 'Can you play Say Anything over Zoom or Discord?',
    a:
      "Yes — that's the most popular way to play with remote friends. Start a voice/video call, then everyone opens this page on their device and joins the room. Game stays in sync, you can hear the laughs.",
  },
  {
    q: 'How long does a game take?',
    a: 'Usually 20–30 minutes. First player to 7 points wins, which is about 12–15 rounds.',
  },
  {
    q: 'Is Say Anything family-friendly?',
    a:
      "Yes. The original board game is rated 13+ and the questions are family-safe. Because players write their own answers, the group sets the tone — keep it clean or get cheeky, your call.",
  },
];

function FaqItem({ q, a, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[#FFE8C8] py-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left flex items-center justify-between gap-3 group"
      >
        <span style={fredokaStyle} className="text-[#2D1810] font-semibold text-base md:text-lg">
          {q}
        </span>
        <span className={`text-[#E84A8B] font-bold text-xl shrink-0 transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && <p className="text-[#4A2D1B] mt-2 leading-relaxed">{a}</p>}
    </div>
  );
}

export default function SayAnythingHome() {
  const navigate = useNavigate();
  const { connected, error, createGame, joinGame, state, roomCode, clearError } = useSayAnything();

  const [tab, setTab] = useState('create');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');

  React.useEffect(() => {
    if (state && roomCode) navigate(`/say-anything/room/${roomCode}`);
  }, [state, roomCode, navigate]);

  function handleCreate(e) {
    e.preventDefault();
    if (!username.trim()) return;
    createGame(username);
  }

  function handleJoin(e) {
    e.preventDefault();
    if (!username.trim() || !code.trim()) return;
    joinGame(code, username);
  }

  return (
    <MeadowLayout>
      <Helmet>
        {/* Primary */}
        <title>Say Anything Online: Free Party Game, No Download (3-12)</title>
        <meta
          name="description"
          content="The party game where your opinion wins. Play Say Anything with 3-12 friends — no download, no signup. Share a room link and play free in your browser →"
        />
        <link rel="canonical" href={CANONICAL_URL} />
        <meta name="keywords" content="say anything online, say anything game online, play say anything online free, say anything multiplayer, free party games online, party games no download, browser party games, jackbox alternative free, free games with friends online, virtual party games, online party games for groups, zoom party games" />

        {/* Open Graph */}
        <meta property="og:title" content="Say Anything Online: Free Party Game, No Download (3-12)" />
        <meta property="og:description" content="The party game where your opinion wins. Play with 3-12 friends — no download, no signup. Share a room link and play free in your browser →" />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:url" content={CANONICAL_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Herd Game" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Say Anything Online: Free Party Game, No Download (3-12)" />
        <meta name="twitter:description" content="The party game where your opinion wins. 3-12 friends, no download, no signup. Play free in your browser →" />
        <meta name="twitter:image" content={OG_IMAGE} />

        {/* JSON-LD */}
        <script type="application/ld+json">{JSON.stringify(STRUCTURED_DATA)}</script>
      </Helmet>

      {/* ─── Play UI (above fold) ──────────────────────────────────── */}
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">💬</div>
          <h1 style={fredokaStyle} className="text-4xl md:text-5xl font-bold text-[#2D1810] mb-2">
            Play Say Anything Online
          </h1>
          <p className="text-[#4A2D1B] text-lg">
            Free, no download, no signup. Play with 3–12 friends in any browser.
          </p>
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
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="e.g. Alex"
                maxLength={20}
                className="w-full px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#3D8B5A] focus:outline-none text-[#2D1810] bg-[#FFFDF8]"
              />
            </div>
            {tab === 'join' && (
              <div>
                <label className="block text-sm font-semibold text-[#4A2D1B] mb-1">Room code</label>
                <input
                  type="text"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                  placeholder="e.g. ABCD"
                  maxLength={4}
                  className="w-full px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#3D8B5A] focus:outline-none text-[#2D1810] bg-[#FFFDF8] uppercase tracking-widest text-center text-xl font-bold"
                />
              </div>
            )}
            <button
              type="submit"
              disabled={!connected}
              className="w-full py-3 rounded-xl font-bold text-white text-lg transition-all disabled:opacity-50"
              style={{ background: connected ? '#E84A8B' : '#ccc', fontFamily: 'Fredoka, sans-serif' }}
            >
              {tab === 'create' ? 'Create Room' : 'Join Room'}
            </button>
          </form>
        </div>

        {/* Ad — pre-game browsing */}
        <div className="mt-6 max-h-[280px] overflow-hidden">
          <AdSlot slot="5969633275" />
        </div>

        <div className="mt-8">
          <HowToPlay compact />
        </div>
      </div>

      {/* ─── SEO content sections (below fold) ─────────────────────── */}
      <div className="max-w-3xl mx-auto mt-16 space-y-12">

        {/* Intro — AI Overview gold (first 100 words) */}
        <section>
          <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#2D1810] mb-3">
            What is Say Anything?
          </h2>
          <p className="text-[#4A2D1B] text-base md:text-lg leading-relaxed">
            <strong>Say Anything</strong> is a free-form party game where one player — the judge — asks a fun open-ended question, everyone else writes a creative answer, and the judge secretly picks their favorite.
            The twist: the rest of the group then <em>bets</em> on which answer they think the judge chose. Points go to the chosen author, correct bettors, and the judge for every right bet.
            It's fast, hilarious, and unlike trivia games there are no wrong answers — only unpopular ones.
            Created by Dominic Crapuchettes (North Star Games, 2008), Say Anything has been a party-game staple for 15+ years. Now you can play it free online with friends, no download or signup.
          </p>
        </section>

        {/* How to play */}
        <section>
          <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#2D1810] mb-3">
            How to play Say Anything online
          </h2>
          <p className="text-[#4A2D1B] mb-4 leading-relaxed">
            Each round follows the same five steps. The judge role rotates so everyone takes turns asking and picking.
          </p>
          <ol className="space-y-3 text-[#4A2D1B]">
            <li className="flex gap-3"><span className="font-bold text-[#E84A8B] shrink-0">1.</span><span><strong>The judge picks a question</strong> — they choose from 3 random prompts dealt to them.</span></li>
            <li className="flex gap-3"><span className="font-bold text-[#E84A8B] shrink-0">2.</span><span><strong>Everyone writes an answer</strong> — be funny, sincere, weird, whatever. There are no wrong answers.</span></li>
            <li className="flex gap-3"><span className="font-bold text-[#E84A8B] shrink-0">3.</span><span><strong>The judge secretly picks their favorite</strong> — nobody sees their choice yet.</span></li>
            <li className="flex gap-3"><span className="font-bold text-[#E84A8B] shrink-0">4.</span><span><strong>Everyone bets</strong> — each non-judge places 2 tokens on which answer they think the judge picked. You can double-down on one answer (2 tokens on one) or split (1 token on each of two).</span></li>
            <li className="flex gap-3"><span className="font-bold text-[#E84A8B] shrink-0">5.</span><span><strong>Reveal and score</strong> — the answer is revealed. Author gets 1 point. Each correct token = 1 point. Judge gets 1 point per correct token from others. Next judge takes over.</span></li>
          </ol>
          <p className="text-[#4A2D1B] mt-4 leading-relaxed">
            <strong>First player to 7 points wins.</strong> A full game typically runs 20–30 minutes — about 12–15 rounds depending on group size.
          </p>
        </section>

        {/* Player count */}
        <section>
          <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#2D1810] mb-3">
            How many players do you need?
          </h2>
          <p className="text-[#4A2D1B] leading-relaxed">
            You need <strong>at least 3 players</strong> and the game supports up to <strong>12</strong>. The sweet spot is 4–8 players — enough variety in answers to keep judging interesting, not so many that rounds drag.
            For large groups (10+), expect longer reveals as more answers get bet on.
          </p>
        </section>

        {/* Remote / Zoom */}
        <section>
          <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#2D1810] mb-3">
            Play Say Anything over Zoom, Discord, or FaceTime
          </h2>
          <p className="text-[#4A2D1B] leading-relaxed">
            This game shines on a video call. Start a Zoom, Discord, or FaceTime call with your group, then everyone opens this page on their own device and joins the room with the 4-letter code.
            The game runs in any browser — phone, tablet, or laptop — so people can play wherever they are. Hearing real reactions to bad answers is half the fun.
          </p>
          <p className="text-[#4A2D1B] mt-3 leading-relaxed">
            Popular for: <strong>virtual game nights</strong>, <strong>remote team building</strong>, <strong>long-distance friend hangouts</strong>, <strong>holiday parties</strong>, <strong>college dorm</strong> across rooms, and <strong>quarantine catch-ups</strong>.
          </p>
        </section>

        {/* Comparison table */}
        <section>
          <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#2D1810] mb-3">
            Say Anything vs Jackbox vs Cards Against Humanity
          </h2>
          <p className="text-[#4A2D1B] mb-4 leading-relaxed">
            Looking for a free alternative to Jackbox or Cards Against Humanity? Here's how Say Anything compares.
          </p>
          <div className="overflow-x-auto bg-white rounded-2xl border-2 border-[#FFE8C8]">
            <table className="w-full text-sm md:text-base text-left">
              <thead className="bg-[#FFF5E8]">
                <tr>
                  <th className="p-3 font-bold text-[#2D1810]"></th>
                  <th className="p-3 font-bold text-[#3D8B5A]">Say Anything Online</th>
                  <th className="p-3 font-bold text-[#2D1810]">Jackbox Quiplash</th>
                  <th className="p-3 font-bold text-[#2D1810]">Cards Against Humanity</th>
                </tr>
              </thead>
              <tbody className="text-[#4A2D1B]">
                <tr className="border-t border-[#FFE8C8]"><td className="p-3 font-semibold">Price</td><td className="p-3 text-[#3D8B5A] font-bold">Free</td><td className="p-3">$10–15</td><td className="p-3">Free*</td></tr>
                <tr className="border-t border-[#FFE8C8]"><td className="p-3 font-semibold">Download required</td><td className="p-3 text-[#3D8B5A] font-bold">No</td><td className="p-3">Yes (Steam/console)</td><td className="p-3">No</td></tr>
                <tr className="border-t border-[#FFE8C8]"><td className="p-3 font-semibold">Signup required</td><td className="p-3 text-[#3D8B5A] font-bold">No</td><td className="p-3">Depends</td><td className="p-3">No</td></tr>
                <tr className="border-t border-[#FFE8C8]"><td className="p-3 font-semibold">Players</td><td className="p-3">3–12</td><td className="p-3">3–8</td><td className="p-3">4–20</td></tr>
                <tr className="border-t border-[#FFE8C8]"><td className="p-3 font-semibold">Answer style</td><td className="p-3">Free-text + betting</td><td className="p-3">Free-text + voting</td><td className="p-3">Pre-written cards</td></tr>
                <tr className="border-t border-[#FFE8C8]"><td className="p-3 font-semibold">Family-friendly</td><td className="p-3 text-[#3D8B5A] font-bold">Yes (group sets tone)</td><td className="p-3">Mostly</td><td className="p-3">No</td></tr>
                <tr className="border-t border-[#FFE8C8]"><td className="p-3 font-semibold">Works in any browser</td><td className="p-3 text-[#3D8B5A] font-bold">Yes</td><td className="p-3">No</td><td className="p-3">Yes</td></tr>
              </tbody>
            </table>
            <p className="text-xs text-[#8B6347] p-3">*Free online clones exist; the official boxed game is $25.</p>
          </div>
        </section>

        {/* Family-friendly mode */}
        <section>
          <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#2D1810] mb-3">
            Is Say Anything family-friendly?
          </h2>
          <p className="text-[#4A2D1B] leading-relaxed">
            Yes. The original North Star Games version is rated <strong>13+</strong> and the question prompts are family-safe (think "What's the best pizza topping?" rather than anything risqué).
            Because every answer is written by your group, you set the tone — keep it wholesome with kids, or get unhinged with the adult crowd. We use the family-safe question pool by default.
          </p>
        </section>

        {/* Bottom CTA */}
        <section className="bg-[#FFF0F7] rounded-3xl border-4 border-[#E84A8B] p-6 md:p-8 text-center">
          <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#2D1810] mb-2">
            Ready to play?
          </h2>
          <p className="text-[#4A2D1B] mb-5">Create a room in 5 seconds and share the code with your friends.</p>
          <a
            href="#top"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-block px-8 py-3 rounded-2xl bg-[#E84A8B] hover:bg-[#C73B73] text-white font-bold text-lg transition-colors"
            style={fredokaStyle}
          >
            Start a game →
          </a>
        </section>

        {/* FAQ */}
        <section>
          <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#2D1810] mb-1">
            Frequently asked questions
          </h2>
          <p className="text-[#8B6347] text-sm mb-4">Everything you might wonder before starting a game.</p>
          <div className="bg-white rounded-2xl border-2 border-[#FFE8C8] p-4 md:p-6">
            {FAQ_ITEMS.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} defaultOpen={i === 0} />
            ))}
          </div>
        </section>

        {/* Related guides — internal linking + SEO cluster */}
        <section>
          <h2 style={fredokaStyle} className="text-2xl md:text-3xl font-bold text-[#2D1810] mb-4 text-center">
            Say Anything guides &amp; deep-dives
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <li>
              <Link to="/say-anything/how-to-play-say-anything-board-game-online" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
                <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">📖 How to Play Say Anything Online</h3>
                <p className="text-sm text-[#8B6347]">Full rules, scoring, judge rotation, betting explained.</p>
              </Link>
            </li>
            <li>
              <Link to="/say-anything/100-funny-say-anything-game-questions" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
                <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">🎯 100 Funny Question Prompts</h3>
                <p className="text-sm text-[#8B6347]">Free list of family-safe Say Anything questions.</p>
              </Link>
            </li>
            <li>
              <Link to="/say-anything/can-you-play-say-anything-with-2-players" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
                <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">👥 Can You Play With 2 Players?</h3>
                <p className="text-sm text-[#8B6347]">Why 3 is the minimum + a couple's variant.</p>
              </Link>
            </li>
            <li>
              <Link to="/say-anything/free-alternative-to-jackbox-party-pack" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
                <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">🆓 Free Jackbox Alternative</h3>
                <p className="text-sm text-[#8B6347]">Free in-browser games like Quiplash, no Steam.</p>
              </Link>
            </li>
            <li>
              <Link to="/say-anything/how-to-play-party-games-on-zoom-with-friends" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
                <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">💻 Play Party Games on Zoom</h3>
                <p className="text-sm text-[#8B6347]">Step-by-step setup for video-call game nights.</p>
              </Link>
            </li>
            <li>
              <Link to="/say-anything/family-friendly-party-games-to-play-online" className="block bg-white rounded-2xl border-2 border-[#FFE8C8] hover:border-[#E84A8B] p-4 transition-colors">
                <h3 style={fredokaStyle} className="text-[#2D1810] font-bold">👨‍👩‍👧 Family-Friendly Party Games</h3>
                <p className="text-sm text-[#8B6347]">Best free online games for kids, parents, grandparents.</p>
              </Link>
            </li>
          </ul>
        </section>

        {/* More games */}
        <section className="text-center pb-8">
          <h2 style={fredokaStyle} className="text-xl md:text-2xl font-bold text-[#2D1810] mb-3">
            More free online party games
          </h2>
          <p className="text-[#4A2D1B] mb-4">
            <Link to="/" className="text-[#3D8B5A] hover:text-[#2F6E45] font-semibold underline">Herd Mentality</Link> — think like the group, dodge the pink cow.{' '}
            <span className="text-[#8B6347]">More games coming soon.</span>
          </p>
        </section>

      </div>
    </MeadowLayout>
  );
}
