import React from 'react';
import SubPageLayout from './SubPageLayout';

const FAQS = [
  { q: 'What games can you play on FaceTime for free?', a: 'Guesstimate is a free, browser-based number-guessing game that plays perfectly over FaceTime — each person opens the link on their own device, one creates a room, shares the 4-letter code, and you play while you talk. No app, no download, no signup. Other free options people play over a call include 20 Questions, Two Truths and a Lie, charades, and trivia.' },
  { q: 'What games can you play over a video call with no app or download?', a: 'Anything browser-based works without an install. Open herdgame.vercel.app/guesstimate, create a room, and share the code — everyone joins from their own phone or laptop while on Zoom, FaceTime, Google Meet, or Discord. Classic verbal games like 20 Questions and Never Have I Ever also need nothing but the call itself.' },
  { q: 'How do you play a game over the phone with friends?', a: 'For a voice-only call, verbal games work best: 20 Questions, the alphabet category game, or Two Truths and a Lie. If everyone also has a screen handy, a browser game like Guesstimate adds a scoreboard and structure — you talk on the call and play on your phones at the same time.' },
  { q: 'What is the best game to play on Zoom or Google Meet?', a: 'For a group, a fast trivia game with its own scoreboard works best because it keeps everyone engaged without one person having to host manually. Guesstimate runs in the browser, handles scoring automatically, and supports 2–12 players — so it scales from a 1-on-1 catch-up to a full virtual party.' },
  { q: 'Are these games good for long-distance friends and family?', a: 'Yes — a shared activity turns a catch-up call into hanging out. Guesstimate works for long-distance friends, family across cities, or couples apart; see our dedicated guide on games for long-distance couples for setup ideas and a weekly-ritual playbook.' },
];

export default function VideoCallGamesPage() {
  return (
    <SubPageLayout
      slug="games-to-play-on-facetime-and-video-calls"
      title="Games to Play on FaceTime That Actually Work (Free, No App)"
      description="Free games to play on FaceTime, Zoom, Google Meet, or a phone call that actually work — no app, no download. 2–12 players from any browser. Start in 30 seconds →"
      h1="Games to Play on FaceTime & Video Calls"
      keywords="games to play on facetime, games to play over the phone, games to play on a video call, games to play on zoom, games to play on google meet, video call games no app, free games to play with friends online"
      faqs={FAQS}
    >
      <p>
        <strong>On a call and want something to actually do together?</strong> Whether it's a <a href="https://en.wikipedia.org/wiki/FaceTime" target="_blank" rel="noopener noreferrer">FaceTime</a> with a friend or a group <a href="https://en.wikipedia.org/wiki/Videotelephony" target="_blank" rel="noopener noreferrer">video call</a>, the best games need zero setup — no app to install, no account to make. <a href="/guesstimate">Guesstimate</a> opens in any browser, you share a 4-letter code, and everyone plays from their own screen while you talk. It works for 2 people or a dozen.
      </p>

      <h2>What makes a game work over a video call</h2>
      <ul>
        <li><strong>No download.</strong> The moment a game needs everyone to install an app, half the group drops out. A <a href="https://en.wikipedia.org/wiki/Browser_game" target="_blank" rel="noopener noreferrer">browser game</a> like <a href="/guesstimate">Guesstimate</a> sidesteps that entirely.</li>
        <li><strong>Own-device play beats screen-share.</strong> Sharing one screen over <a href="https://en.wikipedia.org/wiki/Zoom_(software)" target="_blank" rel="noopener noreferrer">Zoom</a> is laggy and clumsy; games where each player uses their own phone feel smoother and more private.</li>
        <li><strong>It runs in the background of conversation.</strong> The best call games — from <a href="https://en.wikipedia.org/wiki/Twenty_questions" target="_blank" rel="noopener noreferrer">20 Questions</a> to a quick round of <a href="/guesstimate">trivia</a> — leave room to keep chatting.</li>
        <li><strong>Automatic scoring.</strong> Nobody wants to be the human scorekeeper. A game that tracks <a href="/guesstimate/online-trivia-betting-game-rules-and-scoring">points for you</a> keeps the energy up.</li>
      </ul>

      <h2>Best games to play on a video call</h2>

      <h3>Guesstimate — best browser game for any call</h3>
      <p>
        <strong>2–12 players. ~25 min. Free, no app.</strong> A <a href="https://en.wikipedia.org/wiki/Trivia" target="_blank" rel="noopener noreferrer">trivia</a> game where you guess numbers and bet on whose guess is closest, inspired by the <a href="https://en.wikipedia.org/wiki/Wits_%26_Wagers" target="_blank" rel="noopener noreferrer">Wits &amp; Wagers</a> mechanic. Everyone joins with a code and plays on their own device — see the <a href="/guesstimate/how-to-play-online-trivia-betting-game">full how-to-play guide</a> or just <a href="/guesstimate">start a game</a>.
      </p>

      <h3>Say Anything — best for laughs and learning about each other</h3>
      <p>
        <strong>3+ players. Free, browser-based.</strong> One person answers a fun question and everyone else guesses what they picked — a <a href="https://en.wikipedia.org/wiki/Party_game" target="_blank" rel="noopener noreferrer">party game</a> that thrives on a group call. Open <a href="/say-anything">Say Anything</a> and share the room code the same way.
      </p>

      <h3>20 Questions — best for voice-only phone calls</h3>
      <p>
        <strong>2+ players. No equipment.</strong> The classic <a href="https://en.wikipedia.org/wiki/Twenty_questions" target="_blank" rel="noopener noreferrer">20 Questions</a> guessing game needs nothing but talking, which makes it ideal when there's no screen — though pairing it with a browser game like <a href="/guesstimate/trivia-games-for-2-players-online-free">2-player Guesstimate</a> gives a quieter call more structure.
      </p>

      <h3>Two Truths and a Lie — best icebreaker</h3>
      <p>
        <strong>3+ players. No equipment.</strong> Everyone shares three statements and the group guesses the lie — a reliable <a href="https://en.wikipedia.org/wiki/Two_truths_and_a_lie" target="_blank" rel="noopener noreferrer">icebreaker</a> that works on any call, and a great warm-up before a longer game like our <a href="/guesstimate/virtual-team-building-trivia-game-for-work">team-building trivia</a>.
      </p>

      <h3>Charades — best for high-energy groups</h3>
      <p>
        <strong>4+ players.</strong> Acting out words on camera makes <a href="https://en.wikipedia.org/wiki/Charades" target="_blank" rel="noopener noreferrer">charades</a> a natural fit for video calls, though it leans on cameras being on — when you'd rather a lower-key, camera-optional game, a <a href="/guesstimate/free-jackbox-alternative-no-download">browser party game</a> is the easier call.
      </p>

      <h2>Which call apps does this work with?</h2>
      <p>
        Because <a href="/guesstimate">Guesstimate</a> is just a web page, it works alongside any call platform — there's nothing to integrate. Run your conversation on whatever you already use and play in a second tab.
      </p>
      <ul>
        <li><strong><a href="https://en.wikipedia.org/wiki/FaceTime" target="_blank" rel="noopener noreferrer">FaceTime</a></strong> — perfect for 1-on-1 or small groups on Apple devices.</li>
        <li><strong><a href="https://en.wikipedia.org/wiki/Zoom_(software)" target="_blank" rel="noopener noreferrer">Zoom</a></strong> — best for bigger groups; see our <a href="/guesstimate/how-to-host-virtual-trivia-night-on-zoom">virtual trivia night on Zoom</a> guide.</li>
        <li><strong><a href="https://en.wikipedia.org/wiki/Google_Meet" target="_blank" rel="noopener noreferrer">Google Meet</a></strong> — no install for guests, which pairs well with a no-install game.</li>
        <li><strong><a href="https://en.wikipedia.org/wiki/Discord" target="_blank" rel="noopener noreferrer">Discord</a></strong> — great for friend groups already hanging out in a voice channel.</li>
        <li><strong>A plain phone call</strong> — go verbal with <a href="https://en.wikipedia.org/wiki/Twenty_questions" target="_blank" rel="noopener noreferrer">20 Questions</a>, or have everyone pull up their phone for a quick game.</li>
      </ul>

      <h2>How to start a game on your next call</h2>
      <ol>
        <li>Get your call going on FaceTime, Zoom, Discord, or any app you like.</li>
        <li>Everyone opens <a href="/guesstimate">herdgame.vercel.app/guesstimate</a> in a browser.</li>
        <li>One person clicks "Create Game" and reads out the 4-letter code — the same flow as our <a href="/guesstimate/how-to-play-online-trivia-betting-game">how-to-play guide</a>.</li>
        <li>Everyone else clicks "Join Game" and enters it.</li>
        <li>Host clicks "Start Game" — play 7 rounds, highest score wins. See <a href="/guesstimate/online-trivia-betting-game-rules-and-scoring">how scoring works</a>.</li>
      </ol>
      <p>
        That's it. For more ideas by group size and occasion, browse the rest of our <a href="/guesstimate">Guesstimate guides</a> — from <a href="/guesstimate/best-online-trivia-games-for-family-game-night">family game night</a> to <a href="/guesstimate/online-games-for-long-distance-couples-free">long-distance couples</a>.
      </p>
    </SubPageLayout>
  );
}
