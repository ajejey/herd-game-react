import React from 'react';
import SubPageLayout from './SubPageLayout';

const FAQS = [
  { q: 'How do you host a virtual trivia night on Zoom?', a: 'Start a Zoom call with your group, then have everyone open a browser-based trivia game like Guesstimate. The host creates a room and shares the 4-letter code in Zoom chat. Players join from their own devices and play while the Zoom call provides video and audio.' },
  { q: 'What is the best free online trivia game for Zoom?', a: 'For free, browser-based trivia on Zoom calls, Guesstimate (number-guessing + betting) is purpose-built for the format. Kahoot also works but requires more setup. Both are free and need no downloads.' },
  { q: 'Do I need to screen share to play trivia on Zoom?', a: "No — that's the advantage of browser-based games. Everyone opens the game on their own device, so the Zoom call just provides video and audio. No screen-share lag, no host bottleneck." },
  { q: 'How long should a virtual trivia night last?', a: 'For online format with Zoom fatigue in mind, 30-60 minutes is the sweet spot. Guesstimate runs about 25 minutes per game. Two games + chat fills an hour comfortably.' },
];

export default function VirtualTriviaPage() {
  return (
    <SubPageLayout
      slug="how-to-host-virtual-trivia-night-on-zoom"
      title="How to Host a Virtual Trivia Night on Zoom (Free)"
      description="Host a virtual trivia night on Zoom with free browser-based games. No downloads, no screen sharing. Step-by-step setup guide and the best free trivia games for video calls."
      h1="How to Host a Virtual Trivia Night on Zoom"
      keywords="virtual trivia night zoom, how to host trivia on zoom, online trivia night zoom, trivia games zoom, virtual trivia free, remote trivia night"
      faqs={FAQS}
    >
      <p>
        <strong>Hosting a virtual trivia night on Zoom?</strong> The good news: it's easier than ever. Skip the screen-sharing and PowerPoint trivia decks — modern browser-based games like <a href="/guesstimate">Guesstimate</a> let everyone join from their own device while the Zoom call handles the social side. This guide walks through the setup, the best free trivia games for video calls, and tips for keeping everyone engaged.
      </p>

      <h2>The simple 5-step setup</h2>
      <ol>
        <li><strong>Schedule a Zoom call</strong> (or Discord, Google Meet, FaceTime — same approach works).</li>
        <li><strong>Pick a browser-based trivia game.</strong> <a href="/guesstimate">Guesstimate</a> for number-betting trivia, Kahoot for multiple-choice, or a custom Google Form for personalized questions.</li>
        <li><strong>One person creates a game room</strong> on the game site and gets a 4-letter code.</li>
        <li><strong>Share the code in Zoom chat.</strong> Players open the game on their own phone, tablet, or laptop and join the room.</li>
        <li><strong>Start playing.</strong> Keep Zoom open for video/audio. The game runs independently for each player.</li>
      </ol>
      <p>
        That's it. No screen sharing, no host bottleneck, no app downloads, no accounts.
      </p>

      <h2>Why browser games beat traditional Zoom trivia</h2>
      <ul>
        <li><strong>No screen-share latency.</strong> Everyone sees the question on their own screen instantly.</li>
        <li><strong>Private answers.</strong> Players can guess without revealing their answer to others until reveal — impossible with screen-shared PowerPoint trivia.</li>
        <li><strong>Auto-scoring.</strong> No spreadsheet, no host counting points.</li>
        <li><strong>Mobile-friendly.</strong> Anyone can play from a phone — important for cross-device families.</li>
        <li><strong>No prep.</strong> Question bank is built in.</li>
      </ul>

      <h2>Best free trivia games for Zoom calls</h2>

      <h3>Guesstimate — best for casual mixed groups</h3>
      <p>
        <strong>2–12 players. 20–25 minutes per game.</strong> Number-answer trivia + 2-chip betting. Even players who don't know the answer can win by betting wisely on others. Free, no downloads. <a href="/guesstimate">Play here</a>.
      </p>

      <h3>Kahoot — best for competitive multi-rounds</h3>
      <p>
        <strong>2–100 players. 10–30 minutes.</strong> Multiple-choice with speed bonuses. Great for big groups and corporate events but requires someone to curate or pick a quiz beforehand.
      </p>

      <h3>Trivia Crack (online version) — best for casual</h3>
      <p>
        Free trivia app with web version. Less Zoom-friendly than the others because it's designed for async play, but works for casual rotations.
      </p>

      <h3>Custom Google Form trivia — best for special events</h3>
      <p>
        Write your own questions about the people on the call (birthdays, anniversaries, family history). Slowest to set up but creates the most memorable moments.
      </p>

      <h2>Tips for a great virtual trivia night</h2>

      <h3>Before the call</h3>
      <ul>
        <li>Send a calendar invite with the Zoom link + game link</li>
        <li>Ask everyone to test their video/audio in advance if it's a big group</li>
        <li>Pick a host who can keep energy up between rounds</li>
        <li>Have snacks/drinks ready — virtual or in person</li>
      </ul>

      <h3>During the game</h3>
      <ul>
        <li><strong>Keep videos on.</strong> Reactions are half the fun.</li>
        <li><strong>Mute when not your turn / not talking.</strong> Background noise compounds in larger groups.</li>
        <li><strong>Use Zoom's gallery view</strong> to see everyone's reactions at reveal moments.</li>
        <li><strong>Read questions out loud</strong> if there are younger players or grandparents who prefer audio.</li>
        <li><strong>Cheer the reveal moments.</strong> "Who guessed lowest?" "Who doubled-down??"</li>
      </ul>

      <h3>After</h3>
      <ul>
        <li><strong>End on a high note.</strong> Don't drag past Zoom fatigue (~60-90 min total).</li>
        <li><strong>Screenshot the final scoreboard</strong> for the group chat.</li>
        <li><strong>Schedule the next one</strong> while everyone's still on the call.</li>
      </ul>

      <h2>Other video call platforms — same approach</h2>
      <ul>
        <li><strong>Discord</strong> — drop the link in voice chat. Works great for gaming groups.</li>
        <li><strong>FaceTime</strong> — share via iMessage or just say the code aloud.</li>
        <li><strong>Google Meet</strong> — drop link in chat. Great for work team-building events.</li>
        <li><strong>Microsoft Teams</strong> — same as Meet. Popular for remote office happy hours.</li>
        <li><strong>WhatsApp video call</strong> — share link via text first.</li>
      </ul>

      <h2>Common Zoom trivia mistakes</h2>
      <ul>
        <li><strong>Screen-sharing PowerPoint trivia.</strong> Latency ruins the experience. Use a browser-based game where each player has their own screen.</li>
        <li><strong>Requiring app downloads.</strong> Loses 2–3 people every time. Browser games solve this.</li>
        <li><strong>Playing too long.</strong> Cap at 90 minutes — Zoom fatigue is real.</li>
        <li><strong>Big groups without structure.</strong> 10+ players need turn rotation. Stick to 4–8 for the best pacing.</li>
        <li><strong>Not testing the link first.</strong> The host should create the game room before the call starts.</li>
      </ul>
    </SubPageLayout>
  );
}
