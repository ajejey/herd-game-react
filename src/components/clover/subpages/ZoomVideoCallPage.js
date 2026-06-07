import React from 'react';
import SubPageLayout from './SubPageLayout';

const FAQS = [
  { q: 'What word games can you play over Zoom or a video call?', a: 'Clover Clues is a great pick — a free co-op word game where everyone joins from their own device with a 4-letter code while you stay on the call. Other call-friendly options on this site include Guesstimate and Say Anything. All run in the browser with no download.' },
  { q: 'How do you play Clover Clues on a video call?', a: 'Start your FaceTime, Zoom, Google Meet, or Discord call first so you can talk. Then one person opens Clover Clues, creates a room, and shares the 4-letter code in the chat. Everyone joins on their own phone or laptop and you play while talking it through.' },
  { q: 'Do all players need the link, or just the host?', a: 'Every player needs to join the room with the code, but only one person hosts. Paste the code (or the link) into the call chat so everyone can hop in. No accounts, no installs.' },
  { q: 'How many people can play remotely?', a: 'Clover Clues is built for 3–6 players. The cooperative discussion is the fun, so a small group on a call is ideal.' },
];

export default function ZoomVideoCallPage() {
  return (
    <SubPageLayout
      slug="word-games-to-play-on-zoom-and-video-call"
      title="Word Games to Play on Zoom & Video Calls (Free, No Download)"
      description="The best free word games to play on Zoom, FaceTime, or any video call — everyone joins from their own device, no download. Clover Clues leads for remote groups →"
      h1="Word Games to Play on Zoom & Video Calls"
      keywords="word games on zoom, zoom word games, word games to play on video call, online word games with friends remotely, virtual word games, games to play on zoom with friends"
      faqs={FAQS}
    >
      <p>
        <strong>On a call and want something to actually play?</strong> The best <a href="https://en.wikipedia.org/wiki/Word_game" target="_blank" rel="noopener noreferrer">word games</a> for <a href="https://en.wikipedia.org/wiki/Videotelephony" target="_blank" rel="noopener noreferrer">video calls</a> are the ones where everyone joins from their own screen and you talk it through together. <a href="/clover">Clover Clues</a> is built exactly for that: a free, co-op clue-writing game where 3–6 players share a 4-letter code and solve each other's "clovers" while staying on Zoom, FaceTime, or Discord.
      </p>

      <h2>How to play a word game on your next call</h2>
      <ol>
        <li><strong>Start the call first</strong> — Zoom, FaceTime, Google Meet, Discord, whatever your group uses. You'll want to talk as you play.</li>
        <li><strong>Open <a href="/clover">Clover Clues</a></strong> and create a room. Drop the 4-letter code into the call chat.</li>
        <li><strong>Everyone joins</strong> on their own phone or laptop — no download, no signup.</li>
        <li><strong>Play and talk.</strong> Write your clues, then rebuild each clover together out loud. The discussion <em>is</em> the game.</li>
      </ol>

      <h2>Why Clover Clues works so well remotely</h2>
      <ul>
        <li><strong>Own-device by design.</strong> No screen-sharing gymnastics — each player sees their own clover.</li>
        <li><strong>Cooperative.</strong> One shared score means no one sits out; perfect when you can't read the room as easily on a call.</li>
        <li><strong>Zero setup.</strong> A browser and a code. See the quick <a href="/clover/how-to-play-clover-clues">how to play</a> if it's your first time.</li>
      </ul>

      <h2>More call-friendly games</h2>
      <p>
        Want variety on the same call? <a href="/guesstimate">Guesstimate</a> turns trivia into a betting game, and <a href="/say-anything">Say Anything</a> is built for laughs — both work over video. For even more options, see our list of <a href="/guesstimate/games-to-play-on-facetime-and-video-calls">games to play on FaceTime and video calls</a> and the best <a href="/clover/cooperative-word-games-online">cooperative word games online</a>.
      </p>

      <h2>Remote teams and long-distance friends</h2>
      <p>
        Because it's cooperative and needs no install, Clover Clues doubles as a <a href="/clover/virtual-team-building-word-games">virtual team-building word game</a> for remote coworkers, and an easy way to stay close with <a href="/guesstimate/online-games-for-long-distance-couples-free">long-distance friends and partners</a>. Solo today? Try the <a href="/daily">Daily Herd</a>.
      </p>

      <p>
        Get everyone on the call, then <a href="/clover">open Clover Clues</a> and share the code — your next video hangout just got a game.
      </p>
    </SubPageLayout>
  );
}
