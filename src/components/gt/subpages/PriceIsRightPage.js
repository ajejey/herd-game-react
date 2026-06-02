import React from 'react';
import SubPageLayout from './SubPageLayout';

const FAQS = [
  { q: 'What is a Price is Right-style party game?', a: 'A party game using the "closest without going over" rule popularised by The Price is Right TV show. Players guess a number; whoever guesses closest WITHOUT exceeding the actual answer wins. Guesstimate uses this rule for trivia: guess a number for a trivia question, then bet on whose guess is closest-not-over.' },
  { q: 'How does the "closest without going over" rule work in a party game?', a: 'When the actual answer is revealed, find the highest guess that is still ≤ the actual answer — that guess wins. If every guess is too high, the lowest guess wins by default. This rule punishes overshooting and rewards staying conservative — the strategic core of the game.' },
  { q: 'Can I play a Price is Right-style game with friends online?', a: 'Yes. Guesstimate is a free in-browser party game that uses the closest-without-going-over mechanic with trivia questions instead of retail prices. 2-12 players, no download. Plays in any browser.' },
  { q: 'What\'s the strategy in a closest-without-going-over game?', a: 'Bias your guesses low — overshooting eliminates you entirely. When in doubt, undershoot. Once a game, take a wild low guess for the 5× payout slot — if you happen to be right when everyone else overshoots, you swing the scoreboard.' },
];

export default function PriceIsRightPage() {
  return (
    <SubPageLayout
      slug="price-is-right-style-party-game-online"
      title="Price is Right Style Party Game Online (Free Trivia Betting)"
      description="Play a Price is Right style party game online free. Guesstimate uses the closest-without-going-over rule with trivia questions. 2-12 players, browser-based, no download."
      h1="Price is Right Style Party Game Online"
      keywords="price is right party game, closest without going over game, price is right style trivia, price is right game online, guess the number party game, closest guess wins game"
      faqs={FAQS}
    >
      <p>
        <strong>Love The Price is Right's "closest without going over" rule?</strong> That rule — guess a number, win if you're closest <em>without</em> exceeding the actual answer — is one of the smartest game-show mechanics ever invented. It rewards strategic thinking, punishes show-offs, and creates dramatic reveal moments. <a href="/guesstimate">Guesstimate</a> is a free online party game built on this exact mechanic, but applied to trivia instead of retail prices.
      </p>

      <h2>The closest-without-going-over rule explained</h2>
      <p>
        Popularised by the iconic Showcase Showdown on The Price is Right (since 1972), the rule is simple:
      </p>
      <ol>
        <li>An actual numerical answer exists (a price, a fact, anything)</li>
        <li>Players each guess a number</li>
        <li>The closest guess <strong>that is still ≤ the actual answer</strong> wins</li>
        <li>If every guess is too high, the lowest guess wins by default</li>
      </ol>
      <p>
        It's deceptively simple. The "without going over" twist transforms the math from "guess as close as possible" to "stay under but as close as possible" — a strategic problem where overshooting has catastrophic consequences.
      </p>

      <h2>Why this mechanic is perfect for a party game</h2>
      <ul>
        <li><strong>No one is "out".</strong> Even the worst guesser has a chance (everyone else might overshoot).</li>
        <li><strong>Risk vs reward.</strong> Lower guesses are safer; higher guesses are riskier but closer to the real answer if you're confident.</li>
        <li><strong>Dramatic reveals.</strong> "Will the actual answer be high enough to save my guess?" creates real tension.</li>
        <li><strong>Strategic depth.</strong> Knowing trivia helps, but reading the room and betting wisely matters more.</li>
        <li><strong>Easy to teach.</strong> If your group knows The Price is Right, they get the rule in 10 seconds.</li>
      </ul>

      <h2>How Guesstimate applies the closest-without-going-over rule</h2>
      <p>
        Guesstimate is a trivia-betting party game that uses this rule end-to-end:
      </p>
      <ol>
        <li>A trivia question with a numerical answer appears (e.g. "How many bones in the human body?")</li>
        <li>Every player writes their guess</li>
        <li>Guesses sort onto a "betting board" low → high, each with a payout multiplier (5×, 4×, 3×, 2×, 1×)</li>
        <li>Players place 2 chips on any guess (their own or another player's)</li>
        <li>The actual answer is revealed</li>
        <li><strong>Closest guess WITHOUT going over wins.</strong> If all guesses are over, the lowest wins.</li>
        <li>Authors and bettors get points. After 7 rounds, highest score wins.</li>
      </ol>

      <h2>Strategy in closest-without-going-over games</h2>

      <h3>Bias your guesses low</h3>
      <p>
        Overshooting eliminates you entirely. A guess that's slightly low can still win if everyone else overshoots — even if the actual answer is much higher. A guess that's slightly high beats every higher guess but gets beaten by every lower guess that's still under. <strong>Low has both safety AND upside.</strong>
      </p>

      <h3>The lowest guess gets the highest payout odds</h3>
      <p>
        In Guesstimate, the lowest number on the board pays 5× per chip. That's because the lowest guess is statistically safe (won't overshoot) but unlikely to be the closest if the answer is mid-range. The combination creates a perfect "long-shot, high reward" slot — and the same logic applies to any closest-without-going-over scoring system.
      </p>

      <h3>Take a wild low guess once a game</h3>
      <p>
        Once per game, write a deliberately low guess on a question where you're uncertain. If everyone else overshoots, you win by default for the 5× payout. This is the swing move that flips scoreboards.
      </p>

      <h3>Don't bet on guesses that are way too high</h3>
      <p>
        Even if a high guess feels close to your gut estimate, the chance of it being under the actual answer is statistically the same as any other guess — but the consequence of being even slightly over is "you lose". When in doubt on the board, bet middle or low.
      </p>

      <h2>Examples of the rule in action</h2>

      <h3>Example 1 — Clean win</h3>
      <p>Question: "How many countries are in Africa?"</p>
      <p>Actual answer: <strong>54</strong></p>
      <p>Guesses: 30, 45, 55, 70, 100</p>
      <ul>
        <li>30 ✓ (under)</li>
        <li>45 ✓ (under, closer than 30)</li>
        <li><strong>55 ✗ (over! disqualified)</strong></li>
        <li>70 ✗ (over)</li>
        <li>100 ✗ (over)</li>
      </ul>
      <p><strong>Winner: 45</strong> — closest without going over.</p>

      <h3>Example 2 — All overshot</h3>
      <p>Question: "How many time zones does Russia span?"</p>
      <p>Actual answer: <strong>11</strong></p>
      <p>Guesses: 15, 18, 20, 24, 30</p>
      <ul>
        <li>All five are over 11</li>
        <li>By the rule, the LOWEST guess (15) wins by default</li>
      </ul>
      <p><strong>Winner: 15</strong> — closest by elimination.</p>

      <h2>Other closest-without-going-over games</h2>
      <ul>
        <li><strong>The Price is Right</strong> — Showcase Showdown, contestants bid on retail prices, closest without going over wins.</li>
        <li><strong>Wits &amp; Wagers</strong> — physical board game with trivia + betting. Same rule.</li>
        <li><strong>Guesstimate</strong> — free online version of the Wits &amp; Wagers mechanic. Same rule.</li>
        <li><strong>Various drinking games</strong> — closest-without-going-over numeric games are a common informal party staple.</li>
      </ul>

      <h2>How to play a Price is Right style party game online</h2>
      <ol>
        <li>Open <a href="/guesstimate">herdgame.vercel.app/guesstimate</a> in any browser</li>
        <li>Click "Create Game", type your name</li>
        <li>Share the 4-letter room code in your group chat</li>
        <li>Friends join from their own phones or laptops</li>
        <li>Start the game when 2+ players are in. Each round uses the closest-without-going-over rule.</li>
      </ol>
      <p>
        From "let's play" to first question on screen — under 30 seconds. Free, no signup, no download.
      </p>
    </SubPageLayout>
  );
}
