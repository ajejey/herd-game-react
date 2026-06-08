import React from 'react';
import { Link } from 'react-router-dom';
import OfficeLayout from './OfficeLayout';

const FAQS = [
  { q: 'What games can you play on a Microsoft Teams call?', a: 'Browser games that everyone joins from their own device work best on Teams. Say Anything (write the funniest answer, then vote) and Guesstimate (team trivia betting) are top picks, plus quick dailies like Daily Trivia and Huddle. They\'re free, need no download, and play right alongside your Teams meeting.' },
  { q: 'How do you play a game during a Teams meeting?', a: 'Keep the Teams call running so you can talk. One person opens the game, creates a room, and pastes the room code (or link) into the Teams chat. Everyone clicks it and joins from their own laptop — no app, no install, nothing for IT to approve.' },
  { q: 'Are these games free and safe for work?', a: 'Yes — they run in the browser with no signup, no download, and no cost, so there\'s nothing to install or approve. The content is light and workplace-friendly.' },
  { q: 'How many people can play?', a: 'It varies by game — Say Anything handles 3–12, Guesstimate 2+, Clover Clues 3–6. The quick dailies are solo but everyone can compare scores in the chat.' },
];

export default function TeamsGamesPage() {
  return (
    <OfficeLayout
      slug="games-to-play-on-microsoft-teams"
      title="Games to Play on Microsoft Teams (Free, No Download)"
      description="The best free games to play on a Microsoft Teams call — everyone joins from their own laptop, no download, no signup. Say Anything, team trivia and quick icebreakers."
      h1="Games to Play on Microsoft Teams"
      keywords="games to play on microsoft teams, teams games, microsoft teams games, games for teams meetings, virtual games for work teams, games to play on a teams call"
      faqs={FAQS}
    >
      <p>
        <strong>Want to play something with the team without leaving your <a href="https://en.wikipedia.org/wiki/Microsoft_Teams" target="_blank" rel="noopener noreferrer">Microsoft Teams</a> call?</strong> The trick is to use games where everyone joins from their <em>own</em> screen — no screen-sharing, no installs. You stay on the Teams meeting to talk and react, while each person plays on their own laptop. All the games above are free, browser-based, and need nothing approved by IT.
      </p>

      <h2>How to run a game on Teams (30 seconds)</h2>
      <ol>
        <li>Keep your Teams meeting running so everyone can talk.</li>
        <li>One person opens a game — <Link to="/say-anything">Say Anything</Link> is the easiest crowd-pleaser — and creates a room.</li>
        <li>Paste the room code (or link) into the <strong>Teams chat</strong>.</li>
        <li>Everyone clicks and joins from their own device. Play, laugh, react on the call.</li>
      </ol>

      <h2>Best games for a Teams meeting</h2>
      <h3>Say Anything — the remote-team favourite</h3>
      <p>
        Everyone writes a funny answer to a question, then the group votes on the best. It’s fast, inclusive, and made for a call. <Link to="/say-anything">Start a Say Anything room</Link> and drop the code in chat.
      </p>
      <h3>Guesstimate — team trivia with a twist</h3>
      <p>
        Guess the number to a trivia question, then bet on whose guess is closest. Great for competitive teams — <Link to="/guesstimate">play Guesstimate</Link>.
      </p>
      <h3>Quick energisers</h3>
      <p>
        Short on time? A two-minute <Link to="/trivia">Daily Trivia</Link> round or <Link to="/connections">Huddle</Link> warms up the room before the agenda. For team bonding, the cooperative <Link to="/clover">Clover Clues</Link> rewards communication.
      </p>

      <h2>More for remote teams</h2>
      <p>
        Building a team-social habit? See <Link to="/office-games/fun-friday-games-for-work">Fun Friday games for work</Link> and <Link to="/office-games/virtual-icebreaker-games-for-meetings">virtual icebreaker games for meetings</Link>, or the full <Link to="/office-games">office games</Link> list. It all works on Zoom and Google Meet too.
      </p>
    </OfficeLayout>
  );
}
