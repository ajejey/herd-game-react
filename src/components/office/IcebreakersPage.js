import React from 'react';
import { Link } from 'react-router-dom';
import OfficeLayout from './OfficeLayout';

const FAQS = [
  { q: 'What are good virtual icebreaker games for meetings?', a: 'Quick games that get everyone talking in the first few minutes. A short Say Anything round (write a funny answer, then vote) breaks the ice fast, and two-minute dailies like Daily Herd, Daily Trivia or Huddle work as low-pressure warm-ups. All free, browser-based, no download.' },
  { q: 'How do you break the ice in a remote meeting?', a: 'Start with a 2–5 minute shared game everyone joins from their own screen, before the agenda. It gets quieter teammates talking and sets a relaxed tone. Share a room code in the chat and play right on the call.' },
  { q: 'What are quick icebreakers for large teams or all-hands?', a: 'Daily Herd (guess what most people will say) and Daily Trivia are great for big groups — everyone plays solo in two minutes and compares results, no coordination needed. For smaller breakout groups, Say Anything is ideal.' },
  { q: 'Are these icebreaker games free?', a: 'Yes — free, no signup, no download. Just open and play.' },
];

export default function IcebreakersPage() {
  return (
    <OfficeLayout
      slug="virtual-icebreaker-games-for-meetings"
      title="Virtual Icebreaker Games for Meetings (Free, No Download)"
      description="Free virtual icebreaker games for meetings — quick 2–5 minute games to get a remote team talking before the agenda. No download, no signup, works on Teams & Zoom."
      h1="Virtual Icebreaker Games for Meetings"
      keywords="virtual icebreaker games, icebreaker games for meetings, meeting icebreakers, virtual icebreakers for work, online icebreaker games, team meeting icebreakers, remote icebreakers"
      faqs={FAQS}
    >
      <p>
        <strong>The fastest way to warm up a meeting</strong> is a short shared game before the agenda — it gets quieter teammates talking and sets a relaxed tone. A good virtual <a href="https://en.wikipedia.org/wiki/Icebreaker_(facilitation)" target="_blank" rel="noopener noreferrer">icebreaker</a> is quick, inclusive, and needs zero setup. These all run in the browser, free, with everyone joining from their own screen.
      </p>

      <h2>Quick icebreakers (2–5 minutes)</h2>
      <h3>Say Anything — get everyone talking fast</h3>
      <p>
        One funny question, everyone writes an answer, the group votes. It surfaces personalities immediately and always gets a laugh. <Link to="/say-anything">Start a round</Link> and share the code.
      </p>
      <h3>Daily Herd — great for big groups & all-hands</h3>
      <p>
        Guess what most people will say and match the crowd — everyone plays solo in two minutes, then compares "what they are." No coordination needed, so it scales to large teams. <Link to="/daily">Play Daily Herd</Link>.
      </p>
      <h3>Daily Trivia & Huddle — low-pressure warm-ups</h3>
      <p>
        A 10-question <Link to="/trivia">Daily Trivia</Link> or a quick <Link to="/connections">Huddle</Link> word puzzle gets brains going before you start. Everyone races and shares their score.
      </p>

      <h2>Run it well</h2>
      <ul>
        <li><strong>Keep it under 5 minutes</strong> so it energises rather than derails the meeting.</li>
        <li><strong>Let everyone join from their own device</strong> — no screen-sharing, no one left out.</li>
        <li><strong>Rotate who hosts</strong> to keep it fresh.</li>
      </ul>

      <p>
        Playing on a call? See <Link to="/office-games/games-to-play-on-microsoft-teams">games to play on Microsoft Teams</Link>, build a weekly ritual with <Link to="/office-games/fun-friday-games-for-work">Fun Friday games</Link>, or browse all <Link to="/office-games">office games</Link>.
      </p>
    </OfficeLayout>
  );
}
