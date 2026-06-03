import React from 'react';
import SubPageLayout from './SubPageLayout';

const FAQS = [
  { q: 'Is there a free online version of So Clover?', a: 'There is no official browser version of So Clover, but Clover Clues is a free online game built on the same cooperative clue-writing idea: write one-word clues for your clover, then rebuild each other\'s clovers as a team. It runs in any browser with a room code — no app, no signup, no download.' },
  { q: 'Can you play So Clover online with friends remotely?', a: 'Yes — play Clover Clues. Each player joins from their own device with a 4-letter code and you talk over a video call. It captures the same co-op "rebuild the clover from clues" experience the physical game is loved for, without needing the box.' },
  { q: 'Is Clover Clues the same as So Clover?', a: 'Clover Clues is an original game inspired by the modern cooperative clue-writing genre that So Clover helped popularise. It is not affiliated with or endorsed by Repos Production, and uses its own words and branding. The core loop — clues, a decoy, and rebuilding clovers as a team — will feel familiar.' },
  { q: 'How many players do you need?', a: '3 to 6. It is fully cooperative, so you share one score and win or lose together.' },
  { q: 'Do I need to download or pay anything?', a: 'No. Clover Clues is free and runs entirely in your browser — no download, no account, no payment.' },
];

export default function SoCloverAlternativePage() {
  return (
    <SubPageLayout
      slug="free-so-clover-alternative-online"
      title="Free So Clover Alternative to Play Online (No Download)"
      description="Want to play So Clover online? Clover Clues is a free browser version of the co-op clue game — write clues, rebuild clovers as a team. 3–6 players, no app. Play free →"
      h1="A Free So Clover Alternative You Can Play Online"
      keywords="so clover online, so clover app, play so clover online free, so clover alternative, online so clover, so clover digital, cooperative word game online"
      faqs={FAQS}
    >
      <p>
        <strong>Looking to play So Clover online?</strong> The beloved <a href="https://en.wikipedia.org/wiki/Cooperative_board_game" target="_blank" rel="noopener noreferrer">cooperative</a> clue-writing game has no official browser version — so <a href="/clover">Clover Clues</a> is the free online game that captures the same magic. Write one-word clues for your "clover," add a decoy, then rebuild everyone's clovers as a team — all in your browser, with no app, no signup, and no download.
      </p>

      <h2>Why Clover Clues is the alternative to reach for</h2>
      <ul>
        <li><strong>Same cooperative heart.</strong> One shared score, everyone solving together — that's the co-op <a href="https://en.wikipedia.org/wiki/Word_game" target="_blank" rel="noopener noreferrer">word-game</a> feeling fans love. See the <a href="/clover/how-to-play-clover-clues">full how-to</a>.</li>
        <li><strong>Nothing to buy or install.</strong> No box, no cards, no app store — just open <a href="/clover">herdgamesonline.com/clover</a> and share a code.</li>
        <li><strong>Built for remote play.</strong> Everyone joins on their own device, so it works around a table or over a <a href="/guesstimate/games-to-play-on-facetime-and-video-calls">video call</a>.</li>
        <li><strong>Original and copyright-safe.</strong> Our own word bank and branding — inspired by the genre, not a copy.</li>
      </ul>

      <h2>How it compares</h2>
      <table>
        <thead><tr><th></th><th>So Clover (physical)</th><th>Clover Clues (online)</th></tr></thead>
        <tbody>
          <tr><td>Cost</td><td>Buy the box</td><td>Free</td></tr>
          <tr><td>Setup</td><td>Cards, boards, markers</td><td>Share a 4-letter code</td></tr>
          <tr><td>Remote play</td><td>No</td><td>Yes — own devices + a call</td></tr>
          <tr><td>Co-op clue + decoy + rebuild</td><td>Yes</td><td>Yes</td></tr>
        </tbody>
      </table>

      <h2>How to play online in 30 seconds</h2>
      <ol>
        <li>Everyone opens <a href="/clover">herdgamesonline.com/clover</a> in a browser.</li>
        <li>One person clicks "Create game" and shares the 4-letter code.</li>
        <li>Friends tap "Join" and enter it (3–6 players).</li>
        <li>Write your clues, then rebuild each other's clovers as a team.</li>
      </ol>
      <p>
        That's the whole setup — which is exactly why it works when the box isn't handy. New to it? Start with the <a href="/clover/how-to-play-clover-clues">how-to-play guide</a>, or browse more <a href="/clover/cooperative-word-games-online">cooperative word games online</a>. Want a different vibe? Try <a href="/guesstimate">Guesstimate</a>, <a href="/say-anything">Say Anything</a>, or the solo <a href="/daily">Daily Herd</a>.
      </p>
    </SubPageLayout>
  );
}
