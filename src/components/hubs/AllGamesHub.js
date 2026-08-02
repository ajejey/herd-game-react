import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import { GameSection } from '../common/GameCard';
import { byMode, MODES } from '../../data/games';

/*
  /all-games — the full catalogue.

  This is the page that makes the site read as a HUB rather than one game with
  extras. Everything renders from the registry, so it can never fall out of
  date when a game is added.
*/

const CANONICAL = 'https://herdgamesonline.com/all-games';
const OG = 'https://herdgamesonline.com/og-image.png';
const fredoka = { fontFamily: "'Fredoka', system-ui, sans-serif" };
const quicksand = { fontFamily: "'Quicksand', system-ui, sans-serif" };

const FAQS = [
  { q: 'How many games are there?', a: 'The hub covers solo play, daily puzzles, party games for a group, and team building games for work. We add new ones regularly.' },
  { q: 'Are all the games free?', a: 'Yes, every game is completely free. There is no download, no signup and no paid tier. Multiplayer games just need one person to create a room and share the code.' },
  { q: 'How do the multiplayer games work?', a: 'One person opens the game and creates a room, then shares the short room code or link. Everyone else joins from their own phone or laptop, so nobody has to share a screen. That makes them work over Zoom, Microsoft Teams or around a table.' },
  { q: 'Can I play on my phone?', a: 'Yes. Every game is built mobile first, because most people play on a phone. Nothing needs installing.' },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'All Games',
  url: CANONICAL,
  description: `Every free browser game on Herd Game — solo games, daily puzzles, party games and team building games. No download, no signup.`,
};

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function AllGamesHub() {
  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      <Helmet>
        <title>All Games — Free Browser Party & Solo Games (No Download)</title>
        <meta name="description" content={`Every free game on Herd Game: solo games, daily puzzles, party games for groups and team building games for work. No download, no signup, play in your browser.`} />
        <meta name="keywords" content="free online games, party games no download, browser games, games to play with friends online, free games hub" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="All Games — Free Browser Party & Solo Games" />
        <meta property="og:description" content="Every free game in the hub. No download, no signup." />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:image" content={OG} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Helmet>

      <Navigation />

      <div className="mx-auto max-w-5xl px-4 pb-16 pt-24">
        <header className="mb-10 text-center">
          <h1 style={fredoka} className="text-3xl font-bold leading-tight text-[#2D1810] md:text-5xl">
            All games
          </h1>
          <p style={quicksand} className="mx-auto mt-3 max-w-2xl text-base text-[#6B5B4A] md:text-lg">
            Free games, all in the browser. Nothing to download, no account to make.
            Play on your own, with friends, or with the team at work.
          </p>
        </header>

        <GameSection eyebrow="Solo" accent="#E84A8B" title={MODES.solo.label} tagline={MODES.solo.tagline} games={byMode('solo')} moreHref="/solo-games" moreLabel="solo games" />
        <GameSection eyebrow="Daily" accent="#3D8B5A" title={MODES.daily.label} tagline={MODES.daily.tagline} games={byMode('daily')} />
        <GameSection eyebrow="Party" accent="#8E5CF7" title={MODES.party.label} tagline={MODES.party.tagline} games={byMode('party')} />
        <GameSection eyebrow="For teams" accent="#1F7A8C" title={MODES.work.label} tagline={MODES.work.tagline} games={byMode('work')} moreHref="/office-games" moreLabel="work guides" />

        <AdSlot />

        <section style={quicksand} className="mt-12 text-[#6B5B4A]">
          <h2 style={fredoka} className="mb-3 text-2xl font-bold text-[#2D1810]">Questions</h2>
          <div className="space-y-4">
            {FAQS.map(({ q, a }) => (
              <div key={q}>
                <h3 style={fredoka} className="text-lg font-bold text-[#2D1810]">{q}</h3>
                <p className="mt-1">{a}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-sm">
            New here? Try <Link to="/daily" className="font-bold text-[#3D8B5A] underline">Daily Herd</Link> for a
            two minute solo round, or <Link to="/say-anything" className="font-bold text-[#3D8B5A] underline">Say Anything</Link> if
            you have a group.
          </p>
        </section>
      </div>
    </div>
  );
}
