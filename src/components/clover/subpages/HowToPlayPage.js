import React from 'react';
import { Helmet } from 'react-helmet';
import SubPageLayout from './SubPageLayout';

const HOWTO_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Play Clover Clues',
  description: 'Clover Clues is a free cooperative word game: write one-word clues linking your four words, then rebuild each player\'s clover as a team.',
  estimatedCost: { '@type': 'MonetaryAmount', currency: 'USD', value: '0' },
  supply: [{ '@type': 'HowToSupply', name: 'One phone, tablet, or laptop per player (3–6 players)' }],
  step: [
    { '@type': 'HowToStep', name: 'Create or join a room', text: 'Everyone opens herdgamesonline.com/clover in a browser. One player creates a game and shares the 4-letter room code; 2–5 friends join with it.' },
    { '@type': 'HowToStep', name: 'Get your four words', text: 'Each player is dealt their own clover of 4 keyword cards arranged in a ring, with four "clue zones" between each pair of neighbouring words.' },
    { '@type': 'HowToStep', name: 'Write a one-word clue for each pair', text: 'For each of the 4 zones, write a single word that links the two neighbouring keywords. The clue cannot be one of those two words.' },
    { '@type': 'HowToStep', name: 'Decoy and shuffle', text: 'A fifth decoy word is secretly added to your four, and all five are shuffled, so your team will not know which four were really yours.' },
    { '@type': 'HowToStep', name: 'Rebuild each clover together', text: 'One clover at a time, the whole team (everyone except its silent author) uses the four clues to place the correct 4 of 5 cards back into the right leaves.' },
    { '@type': 'HowToStep', name: 'Score as a team', text: 'You score 1 point for each correctly placed card and a 2-point bonus for a perfect clover. Add up every clover for one shared team score.' },
  ],
};

const FAQS = [
  { q: 'How do you play Clover Clues?', a: 'Each player gets 4 keyword cards in a clover and writes a single-word clue linking each neighbouring pair. A decoy card is added and shuffled. Then the team works together to rebuild each player\'s clover from the clues, placing 4 of the 5 cards in the right leaves. Score 1 point per correct card, +2 for a perfect clover — it\'s a cooperative game with one shared score.' },
  { q: 'What makes a good clue?', a: 'A good clue is a single word that clearly bridges the two neighbouring keywords without being too obvious or too obscure. Compound words, proper nouns, numbers and onomatopoeia are fine. You cannot use either of the two keywords (or an obvious variant) as the clue.' },
  { q: 'How many players do you need?', a: 'Clover Clues is for 3–6 players. It is cooperative, so you need at least 3: one author whose clover is being rebuilt stays silent while the others discuss and place the cards.' },
  { q: 'What is the decoy card for?', a: 'After you write your clues, a fifth "decoy" word is shuffled in with your four. During resolution your team has 5 cards but only 4 leaves — they have to figure out which card is the decoy and leave it out, which makes the puzzle harder.' },
  { q: 'How do you win?', a: 'You all win (or lose) together. Add up the points from every rebuilt clover for a single team score, then try to beat it next time. A perfect game is every clover rebuilt exactly right.' },
];

export default function HowToPlayPage() {
  return (
    <SubPageLayout
      slug="how-to-play-clover-clues"
      title="How to Play Clover Clues — Full Rules (Free Online)"
      description="Learn how to play Clover Clues, a free online co-op word game: write one-word clues, add a decoy, then rebuild each player's clover as a team. Full rules + examples →"
      h1="How to Play Clover Clues"
      keywords="how to play clover clues, clover clues rules, how to play so clover online, cooperative word game rules, clover word game how to play"
      faqs={FAQS}
    >
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(HOWTO_SCHEMA)}</script>
      </Helmet>

      <p>
        <strong><a href="/clover">Clover Clues</a></strong> is a free online <a href="https://en.wikipedia.org/wiki/Cooperative_board_game" target="_blank" rel="noopener noreferrer">cooperative</a> <a href="https://en.wikipedia.org/wiki/Word_game" target="_blank" rel="noopener noreferrer">word game</a> for 3–6 players, inspired by the modern co-op clue-writing genre. Everyone writes clues for their own "clover" of words, then the whole group works together to rebuild each clover from those clues. There is one shared score, so you win or lose as a team. This guide covers every step, plus what makes a good clue.
      </p>

      <h2>What you need</h2>
      <ul>
        <li>3 to 6 players (4–5 is the sweet spot).</li>
        <li>One device each — phone, tablet, or laptop with any modern browser.</li>
        <li>No board, no cards, no app: it all runs at <a href="/clover">herdgamesonline.com/clover</a>.</li>
        <li>A shared <a href="/guesstimate/games-to-play-on-facetime-and-video-calls">video call</a> helps the discussion, but isn't required.</li>
      </ul>

      <h2>Setup</h2>
      <p>
        One player creates a room and shares the 4-letter code; everyone else joins. When the host starts, each player is privately dealt a <strong>clover of 4 keyword cards</strong> arranged in a ring. Between each pair of neighbouring cards sits a <strong>clue zone</strong> — so there are four zones, one for each adjacent pair.
      </p>

      <h2>Step 1 — Write your clues</h2>
      <p>
        Look at your four words. For each of the four zones, write a <strong>single-word clue</strong> that links the two neighbouring keywords. For example, if two neighbours are <em>moon</em> and <em>coffee</em>, a clue like "morning" or "crescent" might bridge them. Everyone writes their clues at the same time, so there's no waiting around.
      </p>
      <h3>Clue do's and don'ts</h3>
      <ul>
        <li><strong>One word only.</strong> Compound words, proper nouns, acronyms, numbers and onomatopoeia all count as one word.</li>
        <li><strong>Don't use the keywords.</strong> You can't use either of the two words you're linking (or an obvious variant of them).</li>
        <li><strong>Aim for the sweet spot.</strong> Too obvious and the decoy won't fool anyone; too obscure and your team can't rebuild it. A clue that "clicks" once you see both words is perfect.</li>
      </ul>

      <h2>Step 2 — The decoy</h2>
      <p>
        Once you lock in your clues, the game secretly adds a <strong>fifth decoy word</strong> to your four and shuffles all five. Your team will see five cards but only four leaves — part of the challenge is spotting which card doesn't belong. This is the twist that turns simple word-matching into a real <a href="https://en.wikipedia.org/wiki/Party_game" target="_blank" rel="noopener noreferrer">party-game</a> puzzle.
      </p>

      <h2>Step 3 — Rebuild each clover (together)</h2>
      <p>
        Now the team rebuilds the clovers one at a time. When it's your clover's turn, <strong>you stay completely silent</strong> — no hints, no reactions. Everyone else looks at your four clues and the five shuffled cards and discusses where each card should go, then places <strong>4 of the 5</strong> into the right leaves, leaving the decoy out. On our online version you just tap a word, then tap a leaf to place it.
      </p>

      <h2>Step 4 — Score as a team</h2>
      <p>
        When the team confirms a clover, it's revealed: you earn <strong>1 point for each card in the correct leaf</strong>, plus a <strong>2-point bonus</strong> if all four are right. Add up every player's clover for one shared score — see the full breakdown on our <a href="/clover">game page</a>, then try to beat your team's record next time.
      </p>

      <h2>Tips for a higher score</h2>
      <ul>
        <li><strong>Think about the pair, not the single word.</strong> Your clue should only make sense for those two neighbours together.</li>
        <li><strong>Talk it out.</strong> The whole game is the discussion — say why a card fits a clue before placing it.</li>
        <li><strong>Use the decoy against itself.</strong> If a card matches none of the clues well, it's probably the decoy.</li>
        <li>Pair it with other group games like <a href="/say-anything">Say Anything</a> or <a href="/guesstimate">Guesstimate</a> for a full game night.</li>
      </ul>
    </SubPageLayout>
  );
}
