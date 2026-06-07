import React from 'react';
import SubPageLayout from './SubPageLayout';

const FAQS = [
  { q: 'What word games are good for family game night?', a: 'Clover Clues is a great family pick — a free cooperative word game where everyone works together to rebuild each other\'s "clovers" from one-word clues. Because it\'s co-op, older and younger players help each other instead of competing. It runs in any browser with no download.' },
  { q: 'What age can play?', a: 'Anyone comfortable reading and writing single words — roughly 8 and up — can join in, and younger kids can pair up with an adult. The cooperative format means no one gets left behind.' },
  { q: 'Is it free and easy to set up?', a: 'Yes. Open Clover Clues, create a room, and share the 4-letter code. Family members join from their own phones or tablets — no app, no signup, no cost.' },
  { q: 'Can relatives join from another house?', a: 'Absolutely. Everyone joins from their own device, so it works around one table or across the country on a video call — perfect for family who live apart.' },
];

export default function FamilyGameNightPage() {
  return (
    <SubPageLayout
      slug="word-games-for-family-game-night"
      title="Word Games for Family Game Night (Free, No Download)"
      description="Free word games for family game night that all ages can play together — cooperative, no download, no signup. Clover Clues works around the table or over a video call →"
      h1="Word Games for Family Game Night"
      keywords="word games for family, family word games online, family game night ideas, word games for kids and adults, free family games online, games for family no download"
      faqs={FAQS}
    >
      <p>
        <strong>The trouble with family game night?</strong> Finding something the 10-year-old and the grandparents both enjoy — without anyone storming off after losing. Cooperative <a href="https://en.wikipedia.org/wiki/Word_game" target="_blank" rel="noopener noreferrer">word games</a> solve that, because everyone's on the same team. <a href="/clover">Clover Clues</a> is a free one that plays in any browser: write one-word clues for your little "clover," then rebuild each other's clovers together for a shared score. No download, no signup, no losers.
      </p>

      <h2>Why it works for mixed ages</h2>
      <ul>
        <li><strong>Everyone helps everyone.</strong> A shared score means the grown-ups and the kids are pulling the same direction.</li>
        <li><strong>Simple to grasp, fun to puzzle.</strong> Single-word clues are easy to write but satisfying to crack.</li>
        <li><strong>No one is eliminated.</strong> Nobody sits out sulking — the whole point is solving it as a family.</li>
        <li><strong>Pairs welcome.</strong> Little ones can team up with an adult on one device.</li>
      </ul>

      <h2>How to set up in two minutes</h2>
      <ol>
        <li>Open <a href="/clover">Clover Clues</a> and create a room.</li>
        <li>Share the 4-letter code — family members join from their own phones or tablets.</li>
        <li>Everyone writes their clues, then you rebuild each clover together, out loud.</li>
      </ol>
      <p>Want the full rules to explain to the table? See <a href="/clover/how-to-play-clover-clues">how to play Clover Clues</a>.</p>

      <h2>For family who live apart</h2>
      <p>
        Because every player joins from their own screen, Clover Clues is just as good when relatives are in different homes — start a call and <a href="/clover/word-games-to-play-on-zoom-and-video-call">play over Zoom or FaceTime</a>. It's an easy way to keep a far-flung family connected on a Sunday.
      </p>

      <h2>More free games for the family</h2>
      <p>
        Build a whole night out of it: the original <a href="/">Herd Mentality</a> rewards thinking like the group, <a href="/guesstimate">Guesstimate</a> turns trivia into friendly betting, and <a href="/say-anything">Say Anything</a> brings the laughs. There's also a quick solo <a href="/daily">Daily Herd</a> for when it's just you. Clover Clues fits right in among the best <a href="/clover/cooperative-word-games-online">cooperative word games online</a>.
      </p>

      <p>
        Gather everyone, <a href="/clover">open Clover Clues</a>, and solve your first clover together — family game night, sorted.
      </p>
    </SubPageLayout>
  );
}
