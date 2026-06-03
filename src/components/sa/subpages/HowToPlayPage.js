import React from 'react';
import { Helmet } from 'react-helmet';
import SubPageLayout from './SubPageLayout';

const HOWTO_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Play Say Anything Online',
  description: 'Play Say Anything, a free online party game: the judge asks a question, everyone answers, then players bet on which answer the judge will secretly pick.',
  estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
  supply: [{ '@type': 'HowToSupply', name: 'One phone, tablet, or laptop per player (3+ players)' }],
  step: [
    { '@type': 'HowToStep', name: 'Create or join a room', text: 'Everyone opens herdgamesonline.com/say-anything in a browser. One player creates a game and shares the 4-letter room code; 2 or more friends join with it.' },
    { '@type': 'HowToStep', name: 'The judge asks a question', text: 'Each round one player is the judge and picks a free-text question for the group to answer.' },
    { '@type': 'HowToStep', name: 'Everyone writes an answer', text: 'All players except the judge write an answer to the question.' },
    { '@type': 'HowToStep', name: 'The judge picks a secret favorite', text: 'The judge secretly chooses their favorite answer.' },
    { '@type': 'HowToStep', name: 'Place your bets', text: 'Each player places 2 betting tokens on the answer they think the judge secretly chose.' },
    { '@type': 'HowToStep', name: 'Reveal and score', text: 'The pick is revealed. The author of the chosen answer scores, correct bets score, and the judge scores per correct bet. The judge role rotates. First to 7 points wins.' },
  ],
};

const FAQS = [
  { q: 'How do you play Say Anything board game online?', a: 'Open herdgamesonline.com/say-anything, create a room, and share the 4-letter code with 2 or more friends. Each round one player is the judge — they pick a question, everyone else writes an answer, the judge secretly picks a favorite, and the rest bet on which one. First to 7 points wins.' },
  { q: 'What are the official Say Anything rules?', a: 'The judge asks a free-text question. Players (except the judge) write answers. The judge secretly chooses one favorite. Other players each place 2 betting tokens on which answer they think the judge picked. The answer is revealed: the author gets 1 point, each correct token = 1 point, and the judge gets 1 point per correct token from others. Play passes to the next judge.' },
  { q: 'How do you win at Say Anything?', a: "First player to 7 points wins the game. Points come from three sources: writing the answer the judge picks, betting correctly on the judge's pick, and (if you're the judge) having others bet correctly on your choice." },
  { q: 'Can you play Say Anything without the physical board game?', a: 'Yes. Our free online version replaces the cards, board, and tokens with a browser interface. The rules are identical to the official North Star Games version — you just play with a room code instead of a physical board.' },
];

export default function HowToPlayPage() {
  return (
    <SubPageLayout
      slug="how-to-play-say-anything-board-game-online"
      title="How to Play Say Anything Online — Full Rules in 2 Min"
      description="Say Anything rules made simple: judge asks, everyone answers, then bet on the judge's secret pick. Learn to play free in your browser, 3–12 players, no download →"
      h1="How to Play Say Anything Board Game Online"
      keywords="how to play say anything, say anything rules, say anything board game online, say anything game rules, say anything online"
      faqs={FAQS}
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(HOWTO_SCHEMA)}</script>
      </Helmet>
      <p>
        <strong>Wondering how to play the Say Anything board game online?</strong> This guide walks through the full rules of Say Anything — the party game from North Star Games — and shows you how to play it free in your browser with 3 to 12 friends, no download or signup required. You'll learn the judge rotation, the betting mechanic, and how scoring works.
      </p>

      <p>
        Say Anything was created by Dominic Crapuchettes in 2008 and has been a party-game staple ever since. The physical board game uses dry-erase boards, cards, and chips, but online you just need a room code. Below is everything you need to know to host or join a game.
      </p>

      <h2>What you need to play Say Anything online</h2>
      <ul>
        <li><strong>3 to 12 players</strong> (4–8 is the sweet spot)</li>
        <li>Any device with a modern browser — phone, tablet, or laptop</li>
        <li>An internet connection</li>
        <li>Optional: a video call (Zoom, Discord, FaceTime) for hearing the laughs</li>
      </ul>

      <h2>How a Say Anything round works</h2>
      <p>
        Each round of Say Anything follows the same five steps. The "judge" role rotates so every player takes turns asking and picking.
      </p>

      <h3>Step 1 — The judge picks a question</h3>
      <p>
        At the start of the round, one player is the judge. They're dealt 3 random questions and choose one to ask everyone — things like <em>"What's the best pizza topping?"</em> or <em>"What's the most overrated movie of all time?"</em>. There are no right answers.
      </p>

      <h3>Step 2 — Everyone else writes an answer</h3>
      <p>
        All non-judge players type their answer into the answer box. Answers can be sincere, funny, weird, or absurd. Once everyone has submitted, the round automatically advances — or the host can skip slow players.
      </p>

      <h3>Step 3 — The judge secretly picks their favorite</h3>
      <p>
        The judge sees all submitted answers and picks the one they like best. Their choice stays hidden until the reveal. While the judge decides, the rest of the table can see the answers but not the pick — and the speculation begins.
      </p>

      <h3>Step 4 — Everyone places 2 betting tokens</h3>
      <p>
        Each non-judge player places <strong>2 tokens</strong> on which answer they think the judge picked. You have a strategic choice:
      </p>
      <ul>
        <li><strong>Double down</strong> — put both tokens on the same answer. If you're right, that's 2 points. If wrong, zero.</li>
        <li><strong>Hedge</strong> — split your tokens across two answers. Lower upside but safer.</li>
      </ul>

      <h3>Step 5 — Reveal and score</h3>
      <p>
        The judge's pick is revealed and points are awarded:
      </p>
      <ul>
        <li><strong>+1</strong> to the author of the picked answer</li>
        <li><strong>+1 per correct token</strong> to each player who bet correctly (so a successful double-down = +2)</li>
        <li><strong>+1 to the judge</strong> for every correct token placed by other players</li>
      </ul>

      <h2>How to win at Say Anything</h2>
      <p>
        The first player to reach <strong>7 points</strong> wins the game. Most games last 20–30 minutes — usually 12 to 15 rounds depending on group size and how decisively people bet. The judge can't win on their own round, but they can lock up points by being a fair, predictable picker (so others bet correctly).
      </p>

      <h2>Strategy tips for Say Anything</h2>
      <ul>
        <li><strong>Know your judge.</strong> Each player picks favorites for different reasons — some love clever, some love absurd. Bet based on the judge, not the answer you'd pick.</li>
        <li><strong>Don't always double down.</strong> Going all-in on every round is fun but volatile. Hedging once you have 4–5 points keeps you in contention.</li>
        <li><strong>Sometimes the obvious answer wins.</strong> If a question is "best ice cream flavor", the boring answer ("chocolate") often gets picked because the judge wants to play fair.</li>
        <li><strong>Write for the judge, not the room.</strong> The audience doesn't pick — only the judge does.</li>
      </ul>

      <h2>Differences between the board game and the online version</h2>
      <p>
        The free online version of Say Anything matches the official rules with a few quality-of-life improvements:
      </p>
      <ul>
        <li>No physical chips or boards — everything happens in your browser</li>
        <li>Questions are shuffled automatically; no dealer needed</li>
        <li>The 2-token betting mechanic is faithfully preserved (you can double-down or split)</li>
        <li>Host can skip slow players or cancel a round if the judge disconnects</li>
        <li>Free, no signup — just share a 4-letter room code</li>
      </ul>

      <h2>Common mistakes new players make</h2>
      <ul>
        <li><strong>Voting for your own answer.</strong> You can't — only the judge picks, and you place tokens on others' answers.</li>
        <li><strong>Forgetting both tokens are required.</strong> The game doesn't advance until everyone places 2 — you can put them on the same answer if you want.</li>
        <li><strong>Trying to be too clever.</strong> Judges often pick the funniest, not the most galaxy-brained. Read the room.</li>
      </ul>
    </SubPageLayout>
  );
}
