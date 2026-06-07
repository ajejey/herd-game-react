import React from 'react';
import SubPageLayout from './SubPageLayout';

const FAQS = [
  { q: 'What are good virtual team-building word games?', a: 'Clover Clues is a strong choice — a free cooperative word game where the team writes clues and rebuilds each other\'s "clovers" together for one shared score. Because it\'s collaborative, not competitive, it builds communication rather than rivalry. It runs in any browser with no download, so remote teams can play in minutes.' },
  { q: 'How long does a game take? We have a short meeting slot.', a: 'A round of Clover Clues is quick — roughly 10–20 minutes depending on group size and how much you debate the clues. It fits neatly into a stand-up, a Friday wind-down, or the start of an offsite.' },
  { q: 'Is it free, and does anyone need to install software?', a: 'Yes, it\'s free, and no one installs anything. The host creates a room and shares a 4-letter code; teammates join from their own laptop or phone in the browser. No accounts to provision.' },
  { q: 'How many teammates can play?', a: 'Three to six per room works best, since the value is the discussion. Larger teams can split into rooms and compare scores, or rotate so everyone gets a turn.' },
];

export default function TeamBuildingPage() {
  return (
    <SubPageLayout
      slug="virtual-team-building-word-games"
      title="Virtual Team-Building Word Games (Free, No Download)"
      description="Free virtual team-building word games for remote teams — cooperative, quick, and no install. Clover Clues builds communication in 15 minutes on any video call →"
      h1="Virtual Team-Building Word Games"
      keywords="virtual team building games, team building word games, remote team games, online team building games free, work icebreaker games, virtual icebreakers for teams"
      faqs={FAQS}
    >
      <p>
        <strong>Want a team-building game that actually builds the team?</strong> The best <a href="https://en.wikipedia.org/wiki/Team_building" target="_blank" rel="noopener noreferrer">virtual team-building</a> activities are cooperative — they reward communication, not competition. <a href="/clover">Clover Clues</a> fits perfectly: a free, browser-based <a href="https://en.wikipedia.org/wiki/Word_game" target="_blank" rel="noopener noreferrer">word game</a> where your team writes one-word clues and rebuilds each other's "clovers" together for a single shared score. No download, no accounts — just a room code on your next call.
      </p>

      <h2>Why a co-op word game beats trivia for team-building</h2>
      <ul>
        <li><strong>It forces collaboration.</strong> You can't win alone — the team has to discuss which clue points to which word.</li>
        <li><strong>No one is eliminated.</strong> A shared score keeps quieter teammates engaged instead of knocked out early.</li>
        <li><strong>It surfaces how people think.</strong> Everyone's clue style is different, and decoding each other is the bonding part.</li>
        <li><strong>Zero friction.</strong> No installs to clear with IT — it runs in the browser.</li>
      </ul>

      <h2>How to run it in a meeting</h2>
      <ol>
        <li>Start your Zoom, Meet, or Teams call as usual.</li>
        <li>Open <a href="/clover">Clover Clues</a>, create a room, and paste the 4-letter code in the chat.</li>
        <li>Everyone joins from their own screen and writes their clues.</li>
        <li>Rebuild each clover together out loud — the conversation is the team-building.</li>
      </ol>
      <p>First time? Skim the <a href="/clover/how-to-play-clover-clues">how to play</a> guide so you can explain it in 30 seconds.</p>

      <h2>Great for</h2>
      <ul>
        <li><strong>Remote stand-ups & Friday wind-downs</strong> — a quick, low-pressure reset.</li>
        <li><strong>Onboarding & offsites</strong> — an easy icebreaker that gets people talking.</li>
        <li><strong>Distributed teams</strong> — built for <a href="/clover/word-games-to-play-on-zoom-and-video-call">play over a video call</a>.</li>
      </ul>

      <h2>Mix in more free games</h2>
      <p>
        Rotate to keep it fresh: <a href="/guesstimate">Guesstimate</a> (collaborative trivia-betting) and <a href="/say-anything">Say Anything</a> (light and funny) are both free and call-friendly, and Clover Clues sits alongside the best <a href="/clover/cooperative-word-games-online">cooperative word games online</a>. For an async option, point the team at the daily <a href="/daily">Daily Herd</a>.
      </p>

      <p>
        Next team call, skip the awkward small talk — <a href="/clover">open Clover Clues</a>, share the code, and solve a clover together.
      </p>
    </SubPageLayout>
  );
}
