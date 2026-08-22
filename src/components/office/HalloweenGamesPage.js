import React from 'react';
import { Link } from 'react-router-dom';
import OfficeLayout from './OfficeLayout';

/*
  Seasonal SEO, tighter deadline than Christmas: Halloween searches spike from
  late September, so this needs to be indexed and aging by then. Refreshed on
  the same URL each year so the authority compounds.
*/
const FAQS = [
  { q: 'What are good Halloween games for a virtual team?', a: 'Games that need no costume, no download and no signup work best, because not everyone wants to dress up on camera. A Halloween trivia round is the safest crowd-pleaser, followed by quick browser games everyone joins from their own phone like Taboo, Scattergories or Would You Rather with spooky answers.' },
  { q: 'How do you run a Halloween party on Zoom or Teams?', a: 'Keep the video call for the chat and reactions, then open a browser game and paste the room code into the chat. Everyone plays on their own device. Thirty to forty five minutes is plenty, with two or three short games.' },
  { q: 'Are these Halloween games free?', a: 'Yes, all completely free in the browser with no download, no signup and no cost per player. Nothing needs approving by IT.' },
  { q: 'What if people do not want to dress up?', a: 'Then skip costumes entirely. Every game here works without them. If you do want a costume element, make it optional and low effort, like a spooky video background or a single accessory.' },
  { q: 'Are these office-appropriate?', a: 'Yes. The questions and content are workplace-safe — spooky rather than gory — so they suit a team social as well as a party with friends.' },
];

const PICKS = [
  { to: '/halloween-trivia', emoji: '🎃', name: 'Halloween Trivia', best: 'Best all-rounder',
    body: 'Horror films, monster folklore and the genuinely strange history behind the traditions. Nobody needs to be a horror fan to score, which keeps the whole team in it.' },
  { to: '/taboo', emoji: '🚫', name: 'Taboo', best: 'Best for laughs',
    body: 'Describe the word without saying the five forbidden ones while the other team waits to buzz you. Agree a spooky theme first and it fits the season perfectly.' },
  { to: '/chameleon', emoji: '🦎', name: 'Chameleon', best: 'Best for a spooky twist',
    body: 'Everyone knows the secret word except one hidden imposter, who has to bluff their way through. Social deduction suits Halloween better than any other night of the year.' },
  { to: '/scattergories', emoji: '🅰️', name: 'Scattergories', best: 'Best quick round',
    body: 'A random letter, a list of categories, a ticking clock — and you only score for answers nobody else wrote. Fast, competitive and easy to theme.' },
  { to: '/team-trivia', emoji: '🧠', name: 'Team Trivia (live)', best: 'Best for big groups',
    body: 'You host, everyone joins from their own phone, live leaderboard. Scales to a full all-hands without anyone sitting out.' },
];

export default function HalloweenGamesPage() {
  return (
    <OfficeLayout
      slug="halloween-games-for-virtual-teams"
      title="Halloween Games for Virtual Teams (Free, No Download)"
      description="Free Halloween games for remote teams and virtual parties — Halloween trivia, spooky team games and quick icebreakers for Zoom or Microsoft Teams. No costumes needed, no download, no signup."
      h1="Halloween Games for Virtual Teams"
      keywords="halloween games for virtual teams, virtual halloween party games, halloween games for work, zoom halloween games, online halloween party games, spooky team games"
      faqs={FAQS}
    >
      <p>
        <strong>The hard part of a virtual Halloween party is that half the team will not dress up.</strong>{' '}
        Costume-based activities quietly exclude them, and screen-shared quizzes put one person in charge
        of clicking while everyone else watches. The games below avoid both problems: no costume required,
        and everyone plays from their own phone with a room code you paste into the Teams or Zoom chat.
        Free, no signup, nothing to install.
      </p>

      <h2>The best Halloween games for remote teams</h2>
      {PICKS.map((p, i) => (
        <div key={p.to}>
          <h3>{i + 1}. {p.emoji} {p.name} <em>— {p.best}</em></h3>
          <p>{p.body} <Link to={p.to}>Play {p.name.split(' (')[0]} →</Link></p>
        </div>
      ))}

      <h2>A 40-minute Halloween party plan</h2>
      <ol>
        <li><strong>0–10 min: warm up.</strong> Open with <Link to="/would-you-rather">Would You Rather</Link> while people arrive — spooky dilemmas set the tone with zero explaining.</li>
        <li><strong>10–25 min: the quiz.</strong> Run <Link to="/halloween-trivia">Halloween Trivia</Link>, or host a live <Link to="/team-trivia">Team Trivia</Link> round for a bigger group.</li>
        <li><strong>25–40 min: the loud one.</strong> <Link to="/chameleon">Chameleon</Link> for suspicion and accusations, or <Link to="/caveman-clues">Caveman Clues</Link>, <Link to="/hue-match">Hue Match</Link>, <Link to="/taboo">Taboo</Link> for shouting. End on a high.</li>
      </ol>

      <h2>Making it feel spooky without the effort</h2>
      <ul>
        <li><strong>Optional costumes only</strong> — or just a hat, or a themed video background. Never mandatory.</li>
        <li><strong>Theme the answers, not the game.</strong> Agree that Scattergories or Taboo answers should be spooky where possible; it costs nothing and transforms the mood.</li>
        <li><strong>Lights off, lamp on</strong> for anyone who wants to lean in. It reads brilliantly on camera.</li>
        <li><strong>Keep it spooky, not gory.</strong> This is still work — atmosphere beats horror.</li>
      </ul>

      <h2>More games for teams</h2>
      <p>
        Planning ahead for December? See{' '}
        <Link to="/office-games/virtual-holiday-party-games-for-work">virtual holiday party games for work</Link>.
        Year round, try <Link to="/best-team-trivia-games">the best team trivia games</Link>,{' '}
        <Link to="/office-games/games-to-play-on-microsoft-teams">games to play on Microsoft Teams</Link>, or the full{' '}
        <Link to="/office-games">office games</Link> list.
      </p>
    </OfficeLayout>
  );
}
