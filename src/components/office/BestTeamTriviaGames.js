import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import AdSlot from '../AdSlot';
import WaitlistCTA from './WaitlistCTA';

const CANONICAL = 'https://herdgamesonline.com/best-team-trivia-games';
const OG = 'https://herdgamesonline.com/og-image.png';

// The picks — ours lead (they're genuinely the easiest free way to run team
// trivia), described honestly. Each funnels to a real game on the hub.
const PICKS = [
  { to: '/team-trivia', emoji: '🧠', name: 'Team Trivia (live, host-led)', best: 'Best overall for a meeting',
    body: 'A live quiz you host in the browser: everyone joins from their own device with a 4-letter code, answers each question on their phone, and a live leaderboard crowns a winner. No download, no signup, no app for IT to approve. Scales from a team of 5 to a 50-person all-hands, and the host controls the pace. This is the fastest way to run team trivia on a Zoom or Microsoft Teams call.' },
  { to: '/trivia', emoji: '📅', name: 'Daily Trivia (shared daily challenge)', best: 'Best for an async team ritual',
    body: 'A fresh 10-question quiz every day. Drop it in your team channel each morning and everyone plays on their own time, then compares scores and streaks. Zero hosting effort — a low-friction daily bonding ritual for distributed teams.' },
  { to: '/trivia-games', emoji: '🎯', name: 'Trivia by topic (themed rounds)', best: 'Best for a themed warm-up',
    body: 'Pick a category — music, movies, geography, science, Harry Potter and more — for a quick themed round before the main event. Handy when your team has a shared interest, or as a two-minute energiser to open a call.' },
];

const FAQS = [
  { q: 'What is the best free team trivia game?', a: 'For a live meeting, a host-led browser quiz where everyone answers from their own device — like Team Trivia on herdgamesonline.com — is the easiest: no download, no signup, and a live leaderboard. For an async ritual, a shared Daily Trivia everyone plays on their own time works well.' },
  { q: 'How do you host trivia for a remote team?', a: 'Keep your video call running so people can talk, then open a browser-based trivia game and share the room code or link in the chat. Everyone joins on their own laptop or phone, answers each question on their screen, and the host reads out the reveals. No installs, nothing to approve.' },
  { q: 'Are these team trivia games really free?', a: 'Yes — the games featured here are completely free, browser-based, with no signup, no download and no per-player cost. You just share a link.' },
  { q: 'How many people can play team trivia?', a: 'From a handful up to a large all-hands. Because everyone answers on their own device, big groups work fine — the host controls the pace so 50 players run as smoothly as 5.' },
  { q: 'Do team trivia games work on Microsoft Teams and Zoom?', a: 'Yes. Browser games where each person joins from their own device work on any video platform — Microsoft Teams, Zoom, Google Meet, Webex or Discord. Keep the call for conversation and share the room code in the chat.' },
];

const ITEMLIST_SCHEMA = {
  '@context': 'https://schema.org', '@type': 'ItemList',
  name: 'Best Free Team Trivia Games for Work', url: CANONICAL,
  itemListElement: PICKS.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name, url: `https://herdgamesonline.com${p.to}` })),
};
const FAQ_SCHEMA = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) };

export default function BestTeamTriviaGames() {
  return (
    <MeadowLayout maxWidth="max-w-2xl">
      <Helmet>
        <title>Best Free Team Trivia Games for Work &amp; Remote Teams (2026)</title>
        <meta name="description" content="The best free team trivia games for work — live host-led quizzes, daily challenges and themed rounds your remote team can play on Zoom or Microsoft Teams. No download, no signup." />
        <link rel="canonical" href={CANONICAL} />
        <meta name="keywords" content="team trivia games, best team trivia games, free trivia games for work, virtual trivia games for teams, online trivia for work teams, trivia games for team building, team quiz game" />
        <meta property="og:title" content="Best Free Team Trivia Games for Work & Remote Teams" />
        <meta property="og:description" content="Live host-led quizzes, daily challenges and themed rounds — free team trivia for Zoom & Microsoft Teams. No download, no signup." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Best Free Team Trivia Games for Work" />
        <meta name="twitter:image" content={OG} />
        <script type="application/ld+json">{JSON.stringify(ITEMLIST_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <div className="text-center mb-6">
        <h1 style={fredokaStyle} className="text-3xl md:text-5xl font-bold text-[#2D1810]">Best Free Team Trivia Games for Work</h1>
        <p className="text-[#4A2D1B] text-lg mt-2">Live quizzes, daily challenges and themed rounds your remote team can play on Zoom or Microsoft Teams — no download, no signup.</p>
      </div>

      {/* Primary CTA */}
      <div className="text-center mb-8">
        <Link to="/team-trivia" style={{ background: '#E84A8B', fontFamily: 'Fredoka, sans-serif' }}
          className="inline-block px-8 py-4 rounded-2xl text-white font-bold text-lg shadow-[0_10px_24px_-10px_rgba(232,74,139,0.8)] hover:scale-[1.02] transition-transform">
          Start a Team Trivia game →
        </Link>
        <p className="text-xs text-[#8B6347] mt-2">Free · everyone joins from their own device · no signup</p>
      </div>

      <div className="max-w-2xl mx-auto text-[#4A2D1B] leading-relaxed">
        <p className="mb-5">
          Team trivia is the most reliable 15-minute team-building activity there is: it flattens the hierarchy (the new hire and the VP answer the same question), it's genuinely fun rather than a forced icebreaker, and it gives distributed coworkers a shared moment to react to. The trick is picking a game that needs <strong>no download and no signup</strong>, so nobody drops out in the first five minutes and IT has nothing to approve. Here are the best free ways to run it.
        </p>

        {PICKS.map((p, i) => (
          <div key={p.to} className="mb-5 rounded-2xl border-2 border-[#FFE8C8] bg-white/70 p-5">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl" aria-hidden="true">{p.emoji}</span>
              <div>
                <h2 style={fredokaStyle} className="text-xl font-bold text-[#2D1810] leading-tight">{i + 1}. {p.name}</h2>
                <span className="text-xs font-semibold text-[#3D8B5A]">{p.best}</span>
              </div>
            </div>
            <p className="mt-2">{p.body}</p>
            <Link to={p.to} className="inline-block mt-3 text-[#E84A8B] font-semibold underline">Play {p.name.split(' (')[0]} →</Link>
          </div>
        ))}

        {/* Corporate willingness-to-pay probe */}
        <div className="mt-8"><WaitlistCTA source="best-team-trivia-listicle" /></div>

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-8 mb-3">How to run team trivia in 15 minutes</h2>
        <ol className="list-decimal pl-5 mb-4 space-y-1">
          <li><strong>Keep it short and optional.</strong> Tack 10–15 minutes onto an existing call — "optional, low-stakes" gets far better turnout than mandatory fun.</li>
          <li><strong>Open the game and share the code.</strong> Create a <Link to="/team-trivia" className="text-[#E84A8B] underline">Team Trivia</Link> room and drop the 4-letter code (or link) into your Microsoft Teams, Slack or Zoom chat.</li>
          <li><strong>Everyone joins from their own device.</strong> No app, no signup — just type the code.</li>
          <li><strong>Let the host narrate the reveals.</strong> Reading answers out loud with a little theatre is what turns a quiet round into a laughing one.</li>
          <li><strong>End on a high.</strong> Two or three rounds is plenty — stop while people still want one more.</li>
        </ol>

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-8 mb-3">What makes a good team trivia game?</h2>
        <p className="mb-3">
          Three things: <strong>zero friction</strong> (browser-based, no install or signup, so a 30-person team is all in within a minute), <strong>everyone-on-their-own-device</strong> (so it scales and nobody's left out), and <strong>a host who controls the pace</strong> (so it fits the meeting instead of dragging). A live leaderboard adds the friendly competition that makes people lean in. Anything that needs a download, an account per player, or a paid seat fails the first test — which is why a free browser game usually beats the "enterprise" options for a quick team round.
        </p>

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-8 mb-3">More free games for teams</h2>
        <p className="mb-3">
          Trivia isn't the only option. For a change of pace, your team can also play <Link to="/say-anything" className="text-[#E84A8B] underline">Say Anything</Link> (write the funniest answer), <Link to="/spectrum" className="text-[#E84A8B] underline">Spectrum</Link> (a Wavelength-style guessing game), <Link to="/scattergories" className="text-[#E84A8B] underline">Scattergories</Link> (fast word game), <Link to="/chameleon" className="text-[#E84A8B] underline">Chameleon</Link> (social deduction), or <Link to="/guesstimate" className="text-[#E84A8B] underline">Guesstimate</Link> — all free, all in the browser. See the full <Link to="/office-games" className="text-[#E84A8B] underline">office games</Link> list, or the specifics for <Link to="/office-games/games-to-play-on-microsoft-teams" className="text-[#E84A8B] underline">games to play on Microsoft Teams</Link>.
        </p>

        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mt-8 mb-3">Frequently asked questions</h2>
        <div className="space-y-3">
          {FAQS.map(({ q, a }, i) => (
            <div key={i}><h3 style={fredokaStyle} className="text-lg font-bold text-[#2D1810]">{q}</h3><p className="mt-1">{a}</p></div>
          ))}
        </div>
      </div>

      <div className="mt-8 max-h-[300px] overflow-hidden"><AdSlot slot="5698170537" /></div>
    </MeadowLayout>
  );
}
