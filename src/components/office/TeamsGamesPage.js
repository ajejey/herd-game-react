import React from 'react';
import { Link } from 'react-router-dom';
import OfficeLayout from './OfficeLayout';

const FAQS = [
  { q: 'What games can you play on a Microsoft Teams call?', a: 'Browser games that everyone joins from their own device work best on Teams. Team Trivia (a live host-led quiz with a leaderboard), Say Anything (write the funniest answer, then vote) and Guesstimate (trivia betting) are top picks, plus quick dailies like Daily Trivia and Huddle. They\'re free, need no download, and play right alongside your Teams meeting.' },
  { q: 'How do you play a game during a Teams meeting?', a: 'Keep the Teams call running so you can talk. One person opens the game, creates a room, and pastes the room code (or link) into the Teams chat. Everyone clicks it and joins from their own laptop — no app, no install, nothing for IT to approve.' },
  { q: 'Are these games free and safe for work?', a: 'Yes — they run in the browser with no signup, no download, and no cost, so there\'s nothing to install or approve. The content is light and workplace-friendly.' },
  { q: 'How many people can play?', a: 'It varies by game — Team Trivia and Say Anything scale to a big group (everyone on their own screen), Guesstimate works from 2+, Clover Clues suits 3–6. For a large all-hands, Team Trivia is the easiest to run.' },
  { q: 'What is the best game for a large Teams meeting?', a: 'Team Trivia. One person hosts, everyone joins from their own device with a code, and a live leaderboard keeps a big group engaged — the host controls the pace so 50 people play as smoothly as 5.' },
  { q: 'Do these games work on Zoom and Google Meet too?', a: 'Yes. Because everyone plays in their own browser, the exact same games work on Zoom, Google Meet, Webex or Discord — keep the call running and share the room code in the chat.' },
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
        <strong>Want to play something with the team without leaving your <a href="https://en.wikipedia.org/wiki/Microsoft_Teams" target="_blank" rel="noopener noreferrer">Microsoft Teams</a> call?</strong> The trick is to use games where everyone joins from their <em>own</em> screen — no screen-sharing, no installs. You stay on the Teams meeting to talk and react, while each person plays on their own laptop. All the games below are free, browser-based, and need nothing approved by IT — just open one, share the room code in the Teams chat, and play.
      </p>

      <h2>Why play games on a Teams call?</h2>
      <p>
        Remote and hybrid teams miss the small, unstructured moments that build rapport. A quick game on a Teams meeting manufactures one on demand: it flattens the hierarchy (the new hire and the VP answer the same question), it’s genuinely fun rather than a forced icebreaker, and it gives distributed coworkers a shared moment to react to. Ten minutes at the start or end of a call does more for team feeling than another round of "how was your weekend?".
      </p>

      <h2>How to run a game on Teams (30 seconds)</h2>
      <ol>
        <li>Keep your Teams meeting running so everyone can talk.</li>
        <li>One person opens a game — <Link to="/team-trivia">Team Trivia</Link> is the easiest crowd-pleaser for a group — and creates a room.</li>
        <li>Paste the room code (or link) into the <strong>Teams chat</strong>.</li>
        <li>Everyone clicks and joins from their own device. Play, laugh, react on the call.</li>
      </ol>

      <h2>Best games to play on Microsoft Teams</h2>
      <h3>1. Team Trivia — the best game for a Teams meeting</h3>
      <p>
        A live, host-led quiz: one person hosts, everyone joins from their own device, and a live leaderboard crowns a winner. It scales effortlessly from a small team to a big all-hands, and the host controls the pace — the single easiest game to run on a Teams call. <Link to="/team-trivia">Start a Team Trivia game</Link> and drop the code in chat.
      </p>
      <h3>2. Say Anything — the remote-team favourite</h3>
      <p>
        Everyone writes a funny answer to a question, then the group votes on the best. It’s fast, inclusive, and made for a call. <Link to="/say-anything">Start a Say Anything room</Link> and share the code.
      </p>
      <h3>3. Guesstimate — trivia with a betting twist</h3>
      <p>
        Guess the number to a trivia question, then bet on whose guess is closest. Great for competitive teams — <Link to="/guesstimate">play Guesstimate</Link>.
      </p>
      <h3>4. Spectrum — read the room</h3>
      <p>
        One player gives a clue for where a hidden target sits on a scale between two opposites, and everyone else guesses how close they can get. A quick, funny "are we on the same wavelength?" game — <Link to="/spectrum">play Spectrum</Link>.
      </p>
      <h3>5. Chameleon — find the faker</h3>
      <p>
        Everyone knows the secret word except one player — the Chameleon — who has to bluff. A social deduction game that sparks great debate on a call. <Link to="/chameleon">Play Chameleon</Link>.
      </p>
      <h3>6. Quick energisers</h3>
      <p>
        Short on time? A two-minute <Link to="/trivia">Daily Trivia</Link> round or <Link to="/connections">Huddle</Link> warms up the room before the agenda. For team bonding, the cooperative <Link to="/clover">Clover Clues</Link> rewards communication. Want a themed quiz? Browse <Link to="/trivia-games">trivia games by topic</Link>.
      </p>

      <h2>Tips for a smooth Teams game</h2>
      <ul>
        <li><strong>Keep it short and optional.</strong> Tack 10–15 minutes onto an existing call rather than scheduling a separate hour — "optional, low-stakes" gets far better turnout than mandatory fun.</li>
        <li><strong>Let the host narrate.</strong> Reading answers and reveals out loud on the call is what turns a quiet round into a laughing one.</li>
        <li><strong>Pin the room code</strong> in the Teams chat so latecomers can still join.</li>
        <li><strong>End on a high.</strong> Two or three rounds is plenty — stop while people still want one more.</li>
      </ul>

      <h2>More for remote teams</h2>
      <p>
        Building a team-social habit? See <Link to="/office-games/fun-friday-games-for-work">Fun Friday games for work</Link> and <Link to="/office-games/virtual-icebreaker-games-for-meetings">virtual icebreaker games for meetings</Link>, or the full <Link to="/office-games">office games</Link> list. Because everyone plays in their own browser, all of these work on <strong>Zoom, Google Meet, Webex and Discord</strong> too.
      </p>
    </OfficeLayout>
  );
}
