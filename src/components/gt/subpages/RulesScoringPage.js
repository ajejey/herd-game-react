import React from 'react';
import SubPageLayout from './SubPageLayout';

const FAQS = [
  { q: 'How does scoring work in an online trivia betting game?', a: 'In Guesstimate: writing the winning answer gives you +2 points, and each chip you placed on the winning answer pays the payout multiplier (5×, 4×, 3×, 2×, or 1× depending on where it sits on the board). The lowest guess has the longest odds.' },
  { q: 'Why is the lowest guess paid 5x and the highest paid 1x?', a: 'Because the "closest without going over" rule favors guesses that stay under the actual answer. The lowest guess is the safest from overshooting, so it pays the most when it wins. The highest guess is most likely to be exact OR overshot, so it pays the least.' },
  { q: 'What\'s the difference between doubling-down and hedging?', a: 'Double-down = both chips on one guess. If that guess wins, you get 2× the payout. Hedging = one chip each on two different guesses. Lower max upside but you can only "lose half" instead of all.' },
  { q: 'Can you bet on your own answer?', a: 'Yes. If you wrote the lowest guess and believe in it, doubling-down on yourself can score 10 points (5x payout × 2 chips). It\'s the highest single-round score possible.' },
];

export default function RulesScoringPage() {
  return (
    <SubPageLayout
      slug="online-trivia-betting-game-rules-and-scoring"
      title="Trivia Betting Game Rules and Scoring (Win More)"
      description="Master online trivia betting game rules and scoring: payout odds, double-down strategy, the closest-without-going-over rule, and worked examples. Learn to win, then play free →"
      h1="Online Trivia Betting Game Rules and Scoring Explained"
      keywords="online trivia betting game rules, guesstimate scoring, wits and wagers scoring, trivia betting payout odds, closest without going over rule"
      faqs={FAQS}
    >
      <p>
        <strong>Want to master scoring in an online trivia betting game?</strong> This deep-dive covers everything: the payout odds on every position, when to double-down vs. hedge, how the "closest without going over" rule works, and concrete scoring examples. This guide uses <a href="/guesstimate">Guesstimate</a>'s rules but the math applies to any <a href="https://en.wikipedia.org/wiki/Wits_%26_Wagers" target="_blank" rel="noopener noreferrer">Wits &amp; Wagers</a>-style game.
      </p>

      <h2>The core mechanic in one sentence</h2>
      <p>
        Every round: <strong>everyone writes a number, the numbers go on a board with payout odds, everyone bets 2 chips on which number is closest to the actual answer without going over, the closest-not-over wins, points are awarded.</strong> It blends <a href="https://en.wikipedia.org/wiki/Trivia" target="_blank" rel="noopener noreferrer">trivia</a> knowledge with wagering, the same loop that drives our <a href="/guesstimate/how-to-play-online-trivia-betting-game">how-to-play guide</a>.
      </p>

      <h2>The board explained</h2>
      <p>
        After everyone submits a guess, the unique guesses are sorted low → high on a chalkboard. Each position has a payout multiplier, a structure borrowed from <a href="https://en.wikipedia.org/wiki/Parimutuel_betting" target="_blank" rel="noopener noreferrer">parimutuel betting</a>:
      </p>
      <table>
        <thead>
          <tr><th>Board position</th><th>Payout</th><th>Logic</th></tr>
        </thead>
        <tbody>
          <tr><td>1st (lowest guess)</td><td><strong>5×</strong></td><td>Safest from overshooting, but unlikely to be exact — high risk, high reward</td></tr>
          <tr><td>2nd</td><td>4×</td><td>Slightly higher, still safe</td></tr>
          <tr><td>3rd</td><td>3×</td><td>Middle of the board</td></tr>
          <tr><td>4th</td><td>2×</td><td>Often the median guess — moderately likely to win</td></tr>
          <tr><td>5th and beyond</td><td>1×</td><td>Higher guesses risk overshooting the actual answer</td></tr>
        </tbody>
      </table>
      <p>
        If two players guess the same number, they share a row (both names appear). Their guess gets one payout slot — a quirk worth knowing if you play <a href="/guesstimate/trivia-games-for-2-players-online-free">head-to-head with just two players</a>.
      </p>

      <h2>The closest-without-going-over rule</h2>
      <p>
        When the actual answer is revealed, the game uses a scoring twist made famous by <a href="https://en.wikipedia.org/wiki/The_Price_Is_Right" target="_blank" rel="noopener noreferrer">The Price Is Right</a>:
      </p>
      <ul>
        <li>Find the highest guess on the board that is <strong>still ≤ actual answer</strong></li>
        <li>That guess wins</li>
        <li>If <strong>every</strong> guess is higher than the actual answer, the lowest guess wins by default</li>
      </ul>
      <p>
        This <a href="/guesstimate/price-is-right-style-party-game-online">Price-is-Right-style rule</a> is the strategic heart of the game. Undershooting is safe. Overshooting eliminates you.
      </p>

      <h2>How points are scored</h2>
      <ul>
        <li><strong>Writing the winning answer:</strong> +2 points (split if multiple players wrote the same winning number)</li>
        <li><strong>Each chip on the winning row:</strong> payout × 1 point, settled like a <a href="https://en.wikipedia.org/wiki/Parimutuel_betting" target="_blank" rel="noopener noreferrer">parimutuel pool</a></li>
      </ul>
      <p>
        That's it. No other point sources — a deliberately simple scoring model that makes <a href="/guesstimate/best-online-trivia-games-for-family-game-night">family game nights</a> easy to teach.
      </p>

      <h2>Worked examples</h2>

      <h3>Example 1 — The clean win</h3>
      <p>
        Question: <em>"How many bones in the adult human body?"</em><br />
        Actual answer: <strong>206</strong> — the kind of prompt you'll find in our <a href="/guesstimate/200-trivia-questions-with-numerical-answers">numerical trivia question bank</a>.
      </p>
      <p>Board (sorted, payouts in parentheses), laid out the same way as in the <a href="/guesstimate">Guesstimate game</a>:</p>
      <table>
        <thead><tr><th>#</th><th>Guess</th><th>Payout</th><th>Author</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>150</td><td>5×</td><td>Sam</td></tr>
          <tr><td>2</td><td>200</td><td>4×</td><td>Alex</td></tr>
          <tr><td>3</td><td>210</td><td>3×</td><td>Jess</td></tr>
          <tr><td>4</td><td>300</td><td>2×</td><td>You</td></tr>
        </tbody>
      </table>
      <p>
        Closest without going over: <strong>200 (Alex)</strong>. 210, 300 are all over — disqualified.
        <br />Alex scores +2 (winning author).
        <br />Anyone who bet on Alex scores 4 per chip. A double-down on Alex = 8 points, the sort of swing that makes this a great <a href="/guesstimate/virtual-team-building-trivia-game-for-work">team-building game for work</a>.
      </p>

      <h3>Example 2 — All guesses are over</h3>
      <p>
        Question: <em>"How many time zones does Russia span?"</em><br />
        Actual answer: <strong>11</strong> — surprising answers like this land well when you <a href="/guesstimate/how-to-host-virtual-trivia-night-on-zoom">host a virtual trivia night on Zoom</a>.
      </p>
      <p>Board, scored just like in a live <a href="/guesstimate/games-to-play-on-facetime-and-video-calls">FaceTime or video-call session</a>:</p>
      <table>
        <thead><tr><th>#</th><th>Guess</th><th>Payout</th><th>Author</th></tr></thead>
        <tbody>
          <tr><td>1</td><td>15</td><td>5×</td><td>Sam</td></tr>
          <tr><td>2</td><td>20</td><td>4×</td><td>Alex</td></tr>
          <tr><td>3</td><td>24</td><td>3×</td><td>Jess</td></tr>
        </tbody>
      </table>
      <p>
        Every guess is over 11. By the rule, the lowest guess (15, Sam) wins by default — the exact payoff structure that powers our <a href="/guesstimate/free-alternative-to-wits-and-wagers-online">free Wits &amp; Wagers alternative</a>.
        <br />Sam scores +2.
        <br />Anyone who bet on Sam scores 5 per chip. A double-down on Sam = 10 points. <strong>This is why low guesses are paid 5×.</strong>
      </p>

      <h3>Example 3 — Doubling-down on yourself</h3>
      <p>
        You wrote the lowest guess. You're confident the answer is below the other guesses. You double-down on yourself — the boldest move in any <a href="https://en.wikipedia.org/wiki/Party_game" target="_blank" rel="noopener noreferrer">party game</a> of this type.
      </p>
      <ul>
        <li>If you win: +2 (author) + (5 × 2) (chips) = <strong>+12 points</strong></li>
        <li>If you lose: +0 points, both chips gone</li>
      </ul>
      <p>
        12 points in a single round is enough to swing most games. This is the big bet to make occasionally — and it plays beautifully in <a href="/guesstimate/online-games-for-long-distance-couples-free">long-distance couple games</a> where momentum matters.
      </p>

      <h2>Strategy by phase</h2>

      <h3>When writing your guess</h3>
      <ul>
        <li><strong>Bias low.</strong> Overshooting is fatal. Better to be slightly low than slightly high.</li>
        <li><strong>Avoid the median.</strong> If you write what you think is the obvious answer, others will too — you'll share the row and split points.</li>
        <li><strong>Lock in a wild low guess once a game.</strong> 5× payout if it wins — a tactic that shines as a <a href="/guesstimate/kahoot-alternative-for-adults">Kahoot alternative for adults</a>.</li>
      </ul>

      <h3>When betting chips</h3>
      <ul>
        <li><strong>Default to safe.</strong> Hedging (split chips on two adjacent answers) is statistically sound and easy to coordinate over <a href="/guesstimate/games-to-play-on-facetime-and-video-calls">video calls</a>.</li>
        <li><strong>Double-down when you're confident.</strong> If the actual answer is clearly low or high, commit.</li>
        <li><strong>Bet on the long-shot if you wrote a high number.</strong> You can't bet on yourself if you're confident you overshot, so vote for whoever you think will be closest — read more in our <a href="/guesstimate/how-to-play-online-trivia-betting-game">betting-game walkthrough</a>.</li>
      </ul>

      <h2>End-game scoring</h2>
      <p>
        A full <a href="/guesstimate">Guesstimate</a> game is 7 rounds. Highest cumulative score wins. There's no minimum score to win — even if everyone scores 0 in a round, the next round still happens.
      </p>
      <p>
        Tiebreaker: in a tie at the end, whoever wrote more winning answers across the game wins — a clean finish that works whether you play with friends or use it as a <a href="/guesstimate/free-jackbox-alternative-no-download">free Jackbox alternative with no download</a>.
      </p>

      <h2>Why this scoring works</h2>
      <ul>
        <li><strong>Even players who don't know the answer can win.</strong> Smart betting on others' guesses scores points, which is why it travels well to <a href="/guesstimate/best-online-trivia-games-for-family-game-night">mixed-age family game nights</a>.</li>
        <li><strong>Knowledge is rewarded but not required.</strong> Knowing the exact answer scores +2 for authoring, but the betting payouts are usually the bigger source of points.</li>
        <li><strong>Comebacks are possible.</strong> A single double-down on a 5× slot can swing 10+ points in one round — the same drama you'll find in <a href="/say-anything">Say Anything</a> and our other party titles.</li>
        <li><strong>The closest-not-over rule punishes show-offs.</strong> Writing a precise high number rewards confidence but punishes overshoots.</li>
      </ul>
    </SubPageLayout>
  );
}
