import React from 'react';
import SubPageLayout from './SubPageLayout';

const FAQS = [
  { q: 'How do you play an online trivia betting game?', a: 'Each round a trivia question with a numerical answer appears. Every player writes a number guess. Guesses sort onto a chalkboard with payout odds. Players each place 2 chips on any guess. The actual answer is revealed and the closest guess WITHOUT going over wins. Authors of the winning guess and players who bet correctly score points.' },
  { q: 'How many rounds are in a game?', a: 'A full Guesstimate game is 7 rounds. Highest score after 7 rounds wins.' },
  { q: 'How are payouts calculated?', a: 'The lowest guess on the board pays 5×, second-lowest 4×, third 3×, fourth 2×, everything after pays 1×. Writing the winning guess always scores +2.' },
  { q: 'What if all guesses are too high?', a: 'The lowest guess wins by default. This is the "Price is Right" rule — undershooting is safer than overshooting.' },
];

export default function HowToPlayPage() {
  return (
    <SubPageLayout
      slug="how-to-play-online-trivia-betting-game"
      title="How to Play Online Trivia Betting Game — Full Rules"
      description="Learn how to play an online trivia betting game in 5 minutes. Full rules for Guesstimate — a free Wits & Wagers-style party game with 200+ questions, no download."
      h1="How to Play an Online Trivia Betting Game (Guesstimate)"
      keywords="how to play guesstimate, online trivia betting game rules, how to play wits and wagers style game, free trivia game rules"
      faqs={FAQS}
    >
      <p>
        <strong>Guesstimate</strong> is a free online trivia-betting party game. The mechanic — guess a numerical answer, then bet on whose guess will be closest — is inspired by classic party games like <em>Wits &amp; Wagers</em>. This guide walks through every phase of a round so you can host or join a game with confidence.
      </p>

      <h2>What you need</h2>
      <ul>
        <li>2–12 players (4–8 is the sweet spot)</li>
        <li>One device per player — phone, tablet, or laptop with any modern browser</li>
        <li>A shared video call (Zoom, Discord, FaceTime) helps for remote groups, but isn't required</li>
        <li>No downloads, no accounts</li>
      </ul>

      <h2>The 5 phases of a round</h2>

      <h3>Phase 1 — The trivia question</h3>
      <p>
        Each round a question appears on every player's screen at the same time. Questions always have a single numerical answer — like <em>"How many bones in the adult human body?"</em> (206) or <em>"How tall is the Eiffel Tower in feet?"</em> (1,083). 200+ questions, family-safe, no trick wordplay.
      </p>

      <h3>Phase 2 — Everyone writes a guess</h3>
      <p>
        Type a single number. You can't see anyone else's guess yet. Don't know the answer? <strong>Guess wild.</strong> The lowest guess on the board gets the longest odds, so a wild low guess can pay 5× if you happen to be right.
      </p>

      <h3>Phase 3 — The chalkboard</h3>
      <p>
        Once everyone has submitted, all guesses appear on a wooden-framed chalkboard, sorted low → high. Each row shows:
      </p>
      <ul>
        <li>The payout multiplier (5×, 4×, 3×, 2×, 1×)</li>
        <li>The number itself</li>
        <li>Who wrote it</li>
      </ul>
      <p>
        Identical guesses share a row (so if two players both write "100", that row has both names).
      </p>

      <h3>Phase 4 — Place 2 chips</h3>
      <p>
        Every player gets exactly 2 chips. You must place both. You can:
      </p>
      <ul>
        <li><strong>Double down</strong> — both chips on one guess. Pays double if right.</li>
        <li><strong>Hedge</strong> — split your chips across two guesses.</li>
      </ul>
      <p>
        Yes, you can bet on your own guess. Yes, you can bet on another player's guess. The board doesn't care — only the winning row pays.
      </p>

      <h3>Phase 5 — The reveal</h3>
      <p>
        The actual answer is revealed dramatically. The <strong>closest guess WITHOUT going over</strong> wins. If every guess is too high, the lowest guess wins by default.
      </p>

      <h2>How scoring works</h2>
      <ul>
        <li>Author of the winning row: <strong>+2 points</strong></li>
        <li>Each chip on the winning row: <strong>payout × 1 point</strong> (so a chip on a 5× slot scores 5 points)</li>
      </ul>
      <p>
        That's it. After 7 rounds, the highest cumulative score wins. Tiebreakers go to whoever wrote more winning answers.
      </p>

      <h2>Strategy tips</h2>
      <ul>
        <li><strong>Always undershoot when unsure.</strong> Going over is fatal. Guessing low gives you payout odds AND a chance.</li>
        <li><strong>Bet on the obvious sweet spot.</strong> If one number on the board looks like a smart median guess, that's often where the safe chip goes.</li>
        <li><strong>Double-down on a long-shot once a game.</strong> If you really believe the answer is below the lowest guess (a 5× payout), you can swing the whole game in one round.</li>
        <li><strong>Don't always pick your own answer.</strong> Even if you wrote it. If your number is obviously too high, bet on someone else's.</li>
      </ul>

      <h2>Common mistakes</h2>
      <ul>
        <li><strong>Forgetting both chips are required.</strong> The game won't advance until you place 2. You can put them both on the same row, but you must place both.</li>
        <li><strong>Overshooting on purpose.</strong> "I think the answer is high" doesn't help if you go over. Stay under.</li>
        <li><strong>Never betting on long-odds rows.</strong> A 5× payout once a game can transform the scoreboard. Take the risk occasionally.</li>
      </ul>

      <h2>Hosting tips</h2>
      <ul>
        <li>The host has a "Cancel round" button if someone disconnects mid-question.</li>
        <li>"Skip slow players" advances the round even if not everyone has submitted.</li>
        <li>If you're playing remotely, voice chat dramatically improves the experience — being able to react to reveal moments is half the fun.</li>
      </ul>
    </SubPageLayout>
  );
}
