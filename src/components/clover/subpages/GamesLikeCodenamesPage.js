import React from 'react';
import SubPageLayout from './SubPageLayout';

const FAQS = [
  { q: 'What games are like Codenames but cooperative?', a: 'If you love the clue-giving in Codenames but want everyone on the same team, Clover Clues is a great fit. Instead of one spymaster against the room, every player writes clues for their own "clover," then the whole group rebuilds them together for a shared score. It\'s free and runs in the browser.' },
  { q: 'Is there a free online game like Codenames with no download?', a: 'Yes. Clover Clues plays in any browser — create a room, share a 4-letter code, and 3–6 players join from their own devices. No app, no signup. It scratches the same word-clue itch as Codenames in a cooperative format.' },
  { q: 'How is Clover Clues different from Codenames?', a: 'Codenames is competitive team-vs-team deduction from single-word clues. Clover Clues is fully cooperative: you write clues linking pairs of your own words, a decoy is added, and the group reconstructs each clover together. Same love of clever one-word clues, different shape.' },
  { q: 'How many players do you need?', a: 'Clover Clues is built for 3–6. Codenames-style games also shine with small-to-medium groups who enjoy talking through clues.' },
];

export default function GamesLikeCodenamesPage() {
  return (
    <SubPageLayout
      slug="games-like-codenames-online"
      title="Games Like Codenames to Play Online Free (Co-op Clue Games)"
      description="Love the clue-giving in Codenames? Play games like it online free. Clover Clues is a cooperative word-clue game — 3–6 players, browser-based, no download, no signup →"
      h1="Games Like Codenames to Play Online"
      keywords="games like codenames, codenames alternative free, online clue games, word clue games online, cooperative codenames, games like codenames online free, word deduction games"
      faqs={FAQS}
    >
      <p>
        <strong>If your favourite part of <a href="https://en.wikipedia.org/wiki/Codenames_(board_game)" target="_blank" rel="noopener noreferrer">Codenames</a> is the one-word clue</strong> — that little spark of "how do I link these with a single word?" — you'll feel right at home with <a href="/clover">Clover Clues</a>. It's a free, browser-based clue game that takes the same word-association joy and makes it <em>cooperative</em>: everyone writes clues, and the whole table solves together for one shared score. No download, no signup, just a room code.
      </p>

      <h2>What clue-game fans get from Clover Clues</h2>
      <ul>
        <li><strong>The clue-writing craft.</strong> Each clue is a single word linking two of yours — economical, clever, occasionally evil.</li>
        <li><strong>Group deduction.</strong> Rebuilding a clover from four clues plus a decoy is a satisfying puzzle to crack out loud.</li>
        <li><strong>Cooperative tension.</strong> You're all on one team, so a near-miss is a shared groan, not a gotcha.</li>
      </ul>

      <h2>Codenames vs Clover Clues, quickly</h2>
      <table>
        <thead><tr><th>&nbsp;</th><th>Codenames</th><th>Clover Clues</th></tr></thead>
        <tbody>
          <tr><td>Mode</td><td>Team vs team</td><td>Fully cooperative</td></tr>
          <tr><td>Clue</td><td>One word → several words</td><td>One word → a pair of words</td></tr>
          <tr><td>Online, free, no download</td><td>Varies</td><td>Yes</td></tr>
          <tr><td>Best with</td><td>4+</td><td>3–6</td></tr>
        </tbody>
      </table>

      <h2>How to play online in a minute</h2>
      <ol>
        <li>Open <a href="/clover">Clover Clues</a> and create a room.</li>
        <li>Share the 4-letter code; friends join from their own devices.</li>
        <li>Write your clues, then rebuild each clover together. Full rules: <a href="/clover/how-to-play-clover-clues">how to play</a>.</li>
      </ol>

      <h2>More word and party games to try</h2>
      <p>
        If your group likes clever words, also try the best <a href="/clover/cooperative-word-games-online">cooperative word games online</a>, or branch out to <a href="/guesstimate">Guesstimate</a> and <a href="/say-anything">Say Anything</a>. It all works <a href="/clover/word-games-to-play-on-zoom-and-video-call">over a video call</a>, and there's a solo <a href="/daily">Daily Herd</a> for quiet days. Coming from So Clover? Here's the <a href="/clover/free-so-clover-alternative-online">free So Clover alternative</a>.
      </p>

      <p>
        Ready for clues without the rivalry? <a href="/clover">Open Clover Clues</a> and solve your first clover as a team.
      </p>
    </SubPageLayout>
  );
}
