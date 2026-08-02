import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Navigation from '../Navigation';
import AdSlot from '../AdSlot';
import { GameSection } from '../common/GameCard';
import { byMode, soloGrouped } from '../../data/games';

/*
  /solo-games — the single-player hub.

  Targets "games to play alone", "free single player games no download" and
  friends. It is also the page that Wordle-directory sites (listdle et al) link
  to, so it needs to read as a real catalogue, not a thin index.
*/

const CANONICAL = 'https://herdgamesonline.com/solo-games';
const OG = 'https://herdgamesonline.com/og-image.png';
const fredoka = { fontFamily: "'Fredoka', system-ui, sans-serif" };
const quicksand = { fontFamily: "'Quicksand', system-ui, sans-serif" };

const FAQS = [
  { q: 'What games can I play alone for free?', a: 'All of these. Higher or Lower is endless, so you can keep playing as long as you like. Daily Herd, Daily Trivia, Huddle, Daily Aura and Daily Hot Takes each give you one fresh puzzle a day and track your streak. Everything is free, in the browser, with no signup or download.' },
  { q: 'Do I need to download anything or make an account?', a: 'No. Every game runs in your browser on phone or laptop. There is no app, no account and no cost. Your streaks and best scores are saved on your own device.' },
  { q: 'What is the difference between the daily games and the endless ones?', a: 'Daily games give you one puzzle per day, which is what makes the streak meaningful and gives you a reason to come back tomorrow. Endless games like Higher or Lower have no limit, so you can replay them immediately to beat your best score.' },
  { q: 'Are these good for killing five minutes?', a: 'Yes. Most of the dailies take two to four minutes. Higher or Lower can be a thirty second run or a twenty minute session, depending on how long your streak survives.' },
];

const SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Free Single Player Games',
  url: CANONICAL,
  description: 'A collection of free single player browser games — endless guessing games and daily puzzles. No download, no signup.',
};

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQS.map(({ q, a }) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
};

export default function SoloGamesHub() {
  const groups = soloGrouped();
  const daily = byMode('daily');

  return (
    <div className="min-h-screen bg-[#FFF8E7]">
      <Helmet>
        <title>Free Single Player Games — Games to Play Alone (No Download)</title>
        <meta name="description" content="Free single player games you can play alone in your browser. Endless guessing games and a fresh daily puzzle every day. No download, no signup, works on phone." />
        <meta name="keywords" content="single player games, games to play alone, free online games no download, solo games, daily puzzle games, browser games free" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:title" content="Free Single Player Games — Games to Play Alone" />
        <meta property="og:description" content="Endless guessing games and a fresh daily puzzle. Free, no signup." />
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
            Games to play alone
          </h1>
          <p style={quicksand} className="mx-auto mt-3 max-w-2xl text-base text-[#6B5B4A] md:text-lg">
            No friends needed, no download, no signup. Some are endless so you can keep replaying to beat your
            best score. Others give you one fresh puzzle a day and a streak worth protecting.
          </p>
        </header>

        {/* Grouping alone does not shorten a catalogue — it actually adds a
            little height — so the page also needs a way to skip down it. These
            jump links are what turn ten screens of scrolling into one tap. */}
        <nav aria-label="Jump to a category" className="mb-10 flex flex-wrap justify-center gap-2">
          {groups.map((g) => (
            <a
              key={g.id}
              href={`#${g.id}`}
              style={{ ...quicksand, borderColor: g.accent, color: g.accent }}
              className="rounded-full border-2 bg-white px-4 py-2 text-sm font-bold"
            >
              {g.eyebrow} <span style={{ opacity: 0.7 }}>({g.games.length})</span>
            </a>
          ))}
        </nav>

        {/* Every game is still linked from this page, so nothing changes for
            search — this is purely about not presenting a wall of cards. */}
        {groups.map((g) => (
          <div key={g.id} id={g.id} className="scroll-mt-24">
            <GameSection
              eyebrow={g.eyebrow}
              accent={g.accent}
              title={g.title}
              tagline={g.tagline}
              games={g.games}
            />
          </div>
        ))}

        <GameSection
          eyebrow="Daily"
          accent="#3D8B5A"
          title="One a day"
          tagline="A fresh puzzle every day. Come back tomorrow to keep your streak."
          games={daily}
        />

        <AdSlot />

        <section style={quicksand} className="mt-12 text-[#6B5B4A]">
          <h2 style={fredoka} className="mb-3 text-2xl font-bold text-[#2D1810]">
            Free single player games in your browser
          </h2>
          <p className="mb-4">
            Every game on this page is free and runs straight in your browser, on a phone or a laptop. There is
            nothing to install and no account to create, so you can go from opening the page to playing in a
            couple of seconds. Your streaks and high scores are stored on your own device.
          </p>
          <p className="mb-4">
            If you want something you can play <strong>right now and then immediately play again</strong>, start
            with <Link to="/higher-or-lower" className="font-bold text-[#3D8B5A] underline">Higher or Lower</Link> —
            one wrong guess ends the run, which makes “just one more go” very hard to resist.
          </p>
          <p className="mb-6">
            If you would rather have a small daily ritual, the daily puzzles refresh every morning. Playing one
            each day builds a streak, and most take two to four minutes.
          </p>

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
            Playing with other people instead?{' '}
            <Link to="/all-games" className="font-bold text-[#3D8B5A] underline">See every game in the hub</Link>{' '}
            or browse the <Link to="/office-games" className="font-bold text-[#3D8B5A] underline">games for work</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
