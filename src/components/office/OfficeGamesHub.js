import React from 'react';
import { Link } from 'react-router-dom';
import OfficeLayout from './OfficeLayout';

const FAQS = [
  { q: 'What are good free games to play at work?', a: 'For groups, Say Anything (write the funniest answer, then vote) and Guesstimate (team trivia betting) are the most popular at work. For a quick solo warm-up, Daily Trivia, Huddle and Daily Herd take about two minutes. All are free, browser-based, and need no download or signup — perfect over a Microsoft Teams or Zoom call.' },
  { q: 'Can we play these on a Teams or Zoom meeting?', a: 'Yes. Everyone joins from their own laptop with a short room code while you stay on the call, so they work great in remote and hybrid meetings. See our guide to games to play on Microsoft Teams.' },
  { q: 'Do we need to install anything or sign up?', a: 'No. Every game runs in the browser — open a link, share a code, and play. No app, no account, no cost. Nothing for IT to approve.' },
  { q: 'How long do they take?', a: 'The quick dailies (Daily Trivia, Huddle, Daily Herd) take about two minutes — ideal as a meeting energiser. A full round of Say Anything or Guesstimate runs roughly 10–20 minutes, good for a Fun Friday or team social.' },
];

export default function OfficeGamesHub() {
  return (
    <OfficeLayout
      title="Office Games — Free Games to Play at Work (No Download)"
      description="Free office games to play at work — team building, Fun Friday, icebreakers and meeting games for remote and hybrid teams. No download, no signup, works on Teams & Zoom."
      h1="Office Games to Play at Work"
      keywords="office games, games to play at work, team building games, virtual team building games, games to play with coworkers, work games, online office games, remote team games"
      faqs={FAQS}
    >
      <p>
        <strong>Looking for something the whole team can play — without a download, an app, or anything for IT to approve?</strong> These are free <a href="https://en.wikipedia.org/wiki/Party_game" target="_blank" rel="noopener noreferrer">party games</a> built for the browser: open a link, share a short room code, and everyone joins from their own laptop. They work just as well around a desk as over a <strong>Microsoft Teams</strong> or <strong>Zoom</strong> call, which makes them ideal for remote and hybrid teams.
      </p>

      <h2>The best office games by occasion</h2>
      <ul>
        <li><strong>Team meeting energiser:</strong> a two-minute <Link to="/trivia">Daily Trivia</Link> round or <Link to="/connections">Huddle</Link> to wake the room up before you dive in.</li>
        <li><strong>Fun Friday / team social:</strong> <Link to="/say-anything">Say Anything</Link> for laughs or <Link to="/guesstimate">Guesstimate</Link> for friendly competition — see <Link to="/office-games/fun-friday-games-for-work">Fun Friday games for work</Link>.</li>
        <li><strong>New-starter or all-hands icebreaker:</strong> a quick round that gets everyone talking — see <Link to="/office-games/virtual-icebreaker-games-for-meetings">virtual icebreaker games for meetings</Link>.</li>
        <li><strong>Team building:</strong> the cooperative <Link to="/clover">Clover Clues</Link> rewards communication, not rivalry.</li>
      </ul>

      <h2>Playing remotely on Teams or Zoom</h2>
      <p>
        Because every player uses their own screen, there’s no awkward screen-sharing — each person sees their own cards while you all talk on the call. Start your meeting, drop the room code in the chat, and play. Full walkthrough: <Link to="/office-games/games-to-play-on-microsoft-teams">games to play on Microsoft Teams</Link>.
      </p>

      <h2>Why these work for teams</h2>
      <ul>
        <li><strong>Zero friction:</strong> no installs, logins, or cost — the fastest possible path from “let’s play something” to actually playing.</li>
        <li><strong>Everyone included:</strong> own-device play and cooperative formats keep quieter teammates in, not knocked out early.</li>
        <li><strong>Short by design:</strong> two-minute warm-ups or a 15-minute social — they fit real calendars.</li>
      </ul>

      <p>
        Pick one from the list above and share the link with your team — or browse the deeper guides for <Link to="/office-games/games-to-play-on-microsoft-teams">Teams</Link>, <Link to="/office-games/fun-friday-games-for-work">Fun Friday</Link>, and <Link to="/office-games/virtual-icebreaker-games-for-meetings">meeting icebreakers</Link>.
      </p>
    </OfficeLayout>
  );
}
