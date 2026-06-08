import React from 'react';
import { Link } from 'react-router-dom';
import OfficeLayout from './OfficeLayout';

const FAQS = [
  { q: 'What are good Fun Friday games for the office?', a: 'Crowd-pleasers that get the whole team laughing or competing: Say Anything (write the funniest answer, then vote) and Guesstimate (team trivia betting) are the go-to Fun Friday games. They\'re free, browser-based, and work in person or over a Teams/Zoom call.' },
  { q: 'What is Fun Friday at work?', a: 'Fun Friday is a workplace ritual — a short, light team activity at the end of the week to relax, bond, and end on a high. Quick browser games are perfect because they need no setup and include everyone, remote or in-office.' },
  { q: 'What are quick Fun Friday ideas for remote teams?', a: 'A 15-minute round of Say Anything or Guesstimate over the call, or a two-minute Daily Trivia / Huddle everyone races and compares scores on. No download, no signup — just share a link.' },
  { q: 'Are these free?', a: 'Yes — every game is free, with no download and no signup. Nothing to expense, nothing for IT to approve.' },
];

export default function FunFridayPage() {
  return (
    <OfficeLayout
      slug="fun-friday-games-for-work"
      title="Fun Friday Games for Work (Free, No Download)"
      description="Free Fun Friday games for the office and remote teams — quick, funny, and competitive games to end the week. No download, no signup, works on Teams & Zoom."
      h1="Fun Friday Games for Work"
      keywords="fun friday games, fun friday games for work, fun friday activities, fun friday ideas for office, friday team games, end of week team games, virtual fun friday games"
      faqs={FAQS}
    >
      <p>
        <strong>Fun Friday</strong> works best when it’s effortless — no setup, no awkwardness, everyone in. These free browser games deliver exactly that: open a link, share a room code, and the whole team plays from their own laptops, in the office or over a call. Pick one above and you’re running a Fun Friday in under a minute.
      </p>

      <h2>The best Fun Friday games</h2>
      <h3>Say Anything — guaranteed laughs</h3>
      <p>
        Everyone writes a funny answer to a prompt, then votes on the winner. It’s the easiest way to get a remote team laughing together. <Link to="/say-anything">Start a Say Anything room</Link>.
      </p>
      <h3>Guesstimate — friendly competition</h3>
      <p>
        Guess the number to a trivia question and bet on the closest guess. Perfect when your team likes a bit of rivalry — <Link to="/guesstimate">play Guesstimate</Link>.
      </p>
      <h3>Two-minute warm-ups</h3>
      <p>
        Short on time? A daily <Link to="/trivia">Daily Trivia</Link> round, <Link to="/connections">Huddle</Link>, or <Link to="/daily">Daily Herd</Link> — everyone plays and compares scores in the chat. For a team-bonding twist, try the cooperative <Link to="/clover">Clover Clues</Link>.
      </p>

      <h2>Make it a habit</h2>
      <p>
        Rotate the game each week to keep it fresh, and let a different teammate host. Playing remotely? See <Link to="/office-games/games-to-play-on-microsoft-teams">games to play on Microsoft Teams</Link>, kick meetings off with <Link to="/office-games/virtual-icebreaker-games-for-meetings">icebreaker games</Link>, or browse all <Link to="/office-games">office games</Link>.
      </p>
    </OfficeLayout>
  );
}
