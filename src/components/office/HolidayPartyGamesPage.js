import React from 'react';
import { Link } from 'react-router-dom';
import OfficeLayout from './OfficeLayout';

/*
  Seasonal SEO. "Virtual holiday party games for work" spikes hard Oct-Dec and
  the SERP is owned by team-building listicles that get refreshed every year.
  Published months early so it can age into the rankings before the season, and
  intended to be refreshed on THIS SAME URL each year so authority compounds
  annually rather than starting from zero.

  Our unfair advantage over those listicles: they link out to bookings and
  quotes; we link to games you can play in one click, free.
*/
const FAQS = [
  { q: 'What are the best virtual holiday party games for work?', a: 'The ones that need no download and no signup, so nobody drops out in the first five minutes. A live Christmas trivia round is the easiest to run for any group size, followed by quick games where everyone plays from their own phone, like Scattergories, Taboo or Would You Rather with festive answers.' },
  { q: 'How do you run a virtual holiday party on Zoom or Teams?', a: 'Keep the video call running for the conversation and reactions, then open a browser game and drop the room code into the chat. Everyone joins from their own device. Plan about 45 to 60 minutes total, with two or three short games rather than one long one.' },
  { q: 'What games work for a large company holiday party?', a: 'Host-led games scale best, because one person controls the pace while everyone answers on their own screen. Team Trivia works for 50 people as smoothly as 5. Avoid games that need everyone to speak in turn, which stall in big groups.' },
  { q: 'Are these Christmas party games free?', a: 'Yes. Every game linked here is completely free, runs in the browser, and needs no download, no signup and no per-player cost. There is nothing for IT to approve.' },
  { q: 'How long should a virtual holiday party be?', a: 'About an hour is the sweet spot. Screen fatigue is real, so two or three games of 10 to 15 minutes each, with time to chat in between, beats a long structured agenda.' },
];

const PICKS = [
  { to: '/christmas-trivia', emoji: '🎄', name: 'Christmas Trivia', best: 'Best all-rounder',
    body: 'Carols, films, traditions and reindeer. Everyone from the newest hire to the CEO can score, which is exactly what you want from the first game of the party. Play it solo as a warm-up, or read the questions aloud on the call.' },
  { to: '/team-trivia', emoji: '🧠', name: 'Team Trivia (live, host-led)', best: 'Best for big groups',
    body: 'You host, everyone joins from their own phone with a 4-letter code, and a live leaderboard crowns a winner. The host controls the pace, so it scales from a small team to a full all-hands without anyone being left out.' },
  { to: '/taboo', emoji: '🚫', name: 'Taboo', best: 'Best for laughs',
    body: 'Describe the word without saying the five forbidden ones while the other team waits to buzz you. Loud, funny and instantly understood — good for the middle of the party when energy needs a lift.' },
  { to: '/scattergories', emoji: '🅰️', name: 'Scattergories', best: 'Best quick round',
    body: 'A random letter, a list of categories and a timer. You only score for answers nobody else wrote, so it gets competitive fast. Add festive categories by agreeing a theme before you start.' },
  { to: '/would-you-rather', emoji: '🤔', name: 'Would You Rather', best: 'Best icebreaker',
    body: 'Everyone votes A or B, then the split reveals and the arguing starts. Takes seconds to learn, which makes it the ideal opener while latecomers are still joining the call.' },
  { to: '/fishbowl', emoji: '🎣', name: 'Fishbowl', best: 'Best for a close team',
    body: 'Everyone adds words to a bowl, then you play the same words three ways — describe, act, then a single word. By the third round the whole group is in on the jokes.' },
];

export default function HolidayPartyGamesPage() {
  return (
    <OfficeLayout
      slug="virtual-holiday-party-games-for-work"
      title="Virtual Holiday Party Games for Work (Free, No Download)"
      description="The best free virtual holiday party games for work — Christmas trivia, team games and quick icebreakers your remote team can play on Zoom or Microsoft Teams. No download, no signup."
      h1="Virtual Holiday Party Games for Work"
      keywords="virtual holiday party games, virtual christmas party games for work, online christmas games for remote teams, work holiday party games, zoom christmas party games, festive team games"
      faqs={FAQS}
    >
      <p>
        <strong>A virtual holiday party lives or dies in the first five minutes.</strong> If getting into
        the game means downloading something, making an account, or waiting while someone screen-shares
        a spreadsheet of questions, half the team quietly checks their email and never comes back. The
        games below all work the same simple way: one person opens a room, drops the code into the Teams
        or Zoom chat, and everyone plays from their own phone. Free, no signup, nothing for IT to approve.
      </p>

      <h2>The best virtual holiday party games</h2>
      {PICKS.map((p, i) => (
        <div key={p.to}>
          <h3>{i + 1}. {p.emoji} {p.name} <em>— {p.best}</em></h3>
          <p>{p.body} <Link to={p.to}>Play {p.name.split(' (')[0]} →</Link></p>
        </div>
      ))}

      <h2>How to run the party (a 60-minute plan that works)</h2>
      <ol>
        <li><strong>0–10 min: let people arrive.</strong> Open with <Link to="/would-you-rather">Would You Rather</Link> — it needs no explanation, so latecomers can join mid-flow without missing anything.</li>
        <li><strong>10–30 min: the main event.</strong> Run <Link to="/christmas-trivia">Christmas Trivia</Link> or host a live <Link to="/team-trivia">Team Trivia</Link> round. This is where the competition and the group chat really kick in.</li>
        <li><strong>30–45 min: something loud.</strong> <Link to="/caveman-clues">Caveman Clues</Link>, <Link to="/taboo">Taboo</Link> or <Link to="/scattergories">Scattergories</Link> to lift the energy after a quieter quiz.</li>
        <li><strong>45–60 min: wind down.</strong> Stop while people still want another round, and leave the call open for anyone who wants to keep chatting.</li>
      </ol>

      <h2>Tips that actually matter</h2>
      <ul>
        <li><strong>Make it optional.</strong> "Optional, low stakes" gets far better turnout than mandatory fun, every time.</li>
        <li><strong>Pin the room code</strong> in the chat so people arriving late can still join.</li>
        <li><strong>Let the host narrate the reveals.</strong> Reading answers out with a bit of theatre is what turns a quiet round into a laughing one.</li>
        <li><strong>Prizes can be tiny.</strong> Bragging rights, a silly title, or a £5 voucher all work. The competition matters more than the reward.</li>
        <li><strong>Keep games short.</strong> Two or three 10-minute games beat one 40-minute marathon on a video call.</li>
      </ul>

      <h2>Hybrid and in-person parties</h2>
      <p>
        These all work when some people are in a room together and others are remote, which is usually the
        hardest case to cater for. Because everyone answers on their own phone, the people in the office
        do not get an advantage and the remote folks are not left watching. Put the call on the big screen
        and let everyone play on their own device.
      </p>

      <h2>More games for teams</h2>
      <p>
        Outside the festive season, see <Link to="/best-team-trivia-games">the best team trivia games</Link>,{' '}
        <Link to="/office-games/games-to-play-on-microsoft-teams">games to play on Microsoft Teams</Link>,{' '}
        <Link to="/office-games/fun-friday-games-for-work">Fun Friday games</Link>, and{' '}
        <Link to="/office-games/virtual-icebreaker-games-for-meetings">virtual icebreakers for meetings</Link>,
        or browse the full <Link to="/office-games">office games</Link> list. Doing something for Halloween
        too? See <Link to="/office-games/halloween-games-for-virtual-teams">Halloween games for virtual teams</Link>.
      </p>
    </OfficeLayout>
  );
}
