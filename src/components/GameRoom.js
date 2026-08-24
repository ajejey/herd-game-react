import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import { FiCheck, FiEye, FiSkipForward, FiSliders, FiAlertCircle, FiX } from 'react-icons/fi';
import MeadowLayout, { fredokaStyle } from './MeadowLayout';
import LobbyInvite from './common/LobbyInvite';
import AdSlot from './AdSlot';
import { PinkCowIcon, Rosette, HerdIcon } from './herd/HerdArt';
import { useLiveSocket } from '../context/SocketContext';
import { useGame } from '../context/GameContext';

/*
  ───────────────────────────────────────────────────────────────────────────
  The original Herd Mentality room.

  Two things were wrong with this screen, and they were the same thing wearing
  different clothes: IT NEVER SAID WHAT WAS HAPPENING.

  Room S1DQVW, 21 Aug 2026. Three players filed three reports in twenty-six
  seconds — "Someone d / Isn't answer", "Host is bad", "No work" — while looking
  at the words "Waiting for other players…" and nothing else. No name, no clock,
  no button. Half of every report the site received that week came from this one
  game, and the room could not be rescued by anybody in it.

  The server half of that is fixed in backend/src/index.js (maybeCompleteRound
  and friends). This file is the other half, and the rule it is built on:

    EVERY WAITING SCREEN MUST ANSWER THREE QUESTIONS —
      what are we waiting for, WHO are we waiting for, and what can I do about
      it? A screen that answers fewer than three is a room that dies quietly.

  The second thing: this was the only room on the site with no design. Every
  other game runs inside MeadowLayout — cream, clouds, Fredoka, the cow palette.
  The game the site is NAMED after was grey Tailwind defaults and emoji. It now
  uses the same shell as its thirteen younger siblings.
  ───────────────────────────────────────────────────────────────────────────
*/

const PINK = '#E84A8B';
const GREEN = '#3D8B5A';
const AMBER = '#F0C070';
const INK = '#2D1810';
const MUTED = '#8B6347';

const ROUND_AD_SLOT = '5698170537';
const LOBBY_AD_SLOT = '5969633275';
const GAMEOVER_AD_SLOT = '9390003532';

const WIN_SCORE = 8;

/*
  Quote and list the tied herds properly.

  A three-way tie is not rare enough to fudge — {"coffee":2,"breakfast":2,"eat":2}
  is a real round from the data that motivated the tie fix, so the players most
  likely to read this sentence are exactly the ones a hardcoded "both" gets
  wrong.
*/
function listHerds(herds) {
  const quoted = herds.map((h) => `“${h}”`);
  if (quoted.length <= 1) return quoted.join('');
  return `${quoted.slice(0, -1).join(', ')} and ${quoted[quoted.length - 1]}`;
}

/* "Bea", "Bea and Sam", "Bea, Sam and Ali" — never "2 players". */
function listNames(names) {
  if (!names.length) return '';
  if (names.length === 1) return names[0];
  if (names.length <= 3) return `${names.slice(0, -1).join(', ')} and ${names[names.length - 1]}`;
  return `${names.slice(0, 2).join(', ')} and ${names.length - 2} others`;
}

const card = 'bg-white rounded-3xl border-4 border-[#FFE8C8] p-5 sm:p-6';

/* ── Small pieces ─────────────────────────────────────────────────────────── */

/*
  Errors used to be `alert(message)`.

  A modal alert blocks the whole page, cannot be styled, says "localhost says"
  on some browsers, and — in the Android WebView — can wedge the app entirely.
  It also arrives with no idea which of the fifteen things you just did caused
  it. This says the thing, in the room's own voice, and gets out of the way.
*/
function Toast({ text, tone = 'bad', onClose }) {
  if (!text) return null;
  const bad = tone === 'bad';
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-x-3 bottom-4 z-50 mx-auto max-w-md rounded-2xl border-2 px-4 py-3 shadow-lg flex items-start gap-2"
      style={{
        background: bad ? '#FFF1EF' : '#EAF6EE',
        borderColor: bad ? '#E7A79F' : GREEN,
        color: bad ? '#8A2F26' : '#245C3C',
      }}
    >
      <FiAlertCircle className="mt-0.5 shrink-0" />
      <span className="text-base flex-1">{text}</span>
      <button type="button" onClick={onClose} aria-label="Dismiss" className="p-1 opacity-70 hover:opacity-100">
        <FiX />
      </button>
    </div>
  );
}

/*
  The scoreboard, on every screen.

  It used to be a desktop-only sidebar, so on a phone — which is nearly all of
  this game's traffic — you could play a whole game without ever seeing anyone's
  score, including your own. The target is shown next to it because "first to 8"
  is not written down anywhere else in the room.
*/
function Scores({ players, pinkCowHolder, myId }) {
  const sorted = [...(players || [])].sort((a, b) => (b.score || 0) - (a.score || 0));
  if (!sorted.length) return null;
  return (
    <div className="mt-5">
      <p className="text-sm font-semibold mb-1.5" style={{ color: MUTED }}>
        Scores &mdash; first to {WIN_SCORE} without the cow wins
      </p>
      <div className="space-y-1.5">
        {sorted.map((p, i) => {
          const me = String(p._id) === String(myId);
          const hasCow = String(pinkCowHolder || '') === String(p._id);
          return (
            <div
              key={p._id}
              className={`flex items-center justify-between gap-2 px-3 py-2 rounded-xl ${me ? 'bg-[#FFE8C8]' : 'bg-[#FFF6E9]'}`}
            >
              <span className="flex items-center gap-1.5 min-w-0">
                <span className="text-sm w-4 shrink-0" style={{ color: MUTED }}>{i + 1}.</span>
                <span
                  className={`font-semibold truncate ${p.isConnected === false ? 'opacity-45' : ''}`}
                  style={{ color: INK }}
                >
                  {p.username}{me ? ' (you)' : ''}
                </span>
                {hasCow && <PinkCowIcon size={18} title="Holding the pink cow" />}
                {p.isConnected === false && (
                  <span className="text-sm shrink-0" style={{ color: MUTED }}>away</span>
                )}
              </span>
              <span className="font-bold shrink-0" style={{ color: GREEN }}>{p.score || 0}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* One row of names; tap one to give them the cow, or "Nobody" to take it off
   the table. The server does the authorising and re-runs the win check, because
   moving it off a player on 8 points is what ends the game. */
function CowPicker({ players, pinkCowHolder, onMove }) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {(players || []).map((p) => {
        const holds = String(pinkCowHolder || '') === String(p._id);
        return (
          <button
            key={p._id}
            type="button"
            onClick={() => onMove(p._id)}
            aria-pressed={holds}
            className={`px-3 py-2 rounded-full text-base border-2 font-semibold transition-colors flex items-center gap-1 ${
              holds ? 'bg-[#FFE0E8] border-[#E84A8B] text-[#8A2F55]' : 'bg-white border-[#FFE8C8] text-[#4A2D1B] hover:border-[#E84A8B]'
            }`}
          >
            {holds && <PinkCowIcon size={16} />}
            {p.username}
          </button>
        );
      })}
      <button
        type="button"
        onClick={() => onMove(null)}
        aria-pressed={!pinkCowHolder}
        className={`px-3 py-2 rounded-full text-base border-2 font-semibold transition-colors ${
          !pinkCowHolder ? 'bg-[#FFF6E9] border-[#F0C070] text-[#6B4226]' : 'bg-white border-[#FFE8C8] text-[#4A2D1B] hover:border-[#F0C070]'
        }`}
      >
        Nobody
      </button>
    </div>
  );
}

/* ── The room ─────────────────────────────────────────────────────────────── */

const GameRoom = () => {
  const [answer, setAnswer] = useState('');
  const [myAnswer, setMyAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [slowLoad, setSlowLoad] = useState(false);
  const [showAdjust, setShowAdjust] = useState(false);
  const [toast, setToast] = useState(null);
  const [now, setNow] = useState(Date.now());
  const [win, setWin] = useState({ w: 1024, h: 768 });
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { socket, connected } = useLiveSocket();
  const { gameState, dispatch } = useGame();

  const lastSendRef = useRef({});

  /* A clock for the two deadlines, and a window size for the confetti. */
  useEffect(() => {
    const onResize = () => setWin({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener('resize', onResize);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => { window.removeEventListener('resize', onResize); clearInterval(t); };
  }, []);

  /*
    A deliberate test seam, matching every engine game (TESTING.md §5.3). e2e
    asserts what the SERVER sent this browser rather than what this browser drew
    — the two disagreeing is precisely how the old "2 of 2 answered" screen came
    to sit on top of a round that had already been scored.
  */
  useEffect(() => { window.__herdState = gameState ?? null; }, [gameState]);

  // Handle initial connection and reconnection
  useEffect(() => {
    if (!socket) return;

    if (gameState.gameId) { setIsLoading(false); return; }

    const savedSession = (() => {
      try { return JSON.parse(localStorage.getItem('gameSession') || 'null'); } catch { return null; }
    })();

    if (savedSession && savedSession.roomCode === roomCode) {
      socket.emit('reconnect_game', savedSession);
      return;
    }

    /*
      A stranger opening this URL.

      /game/CODE is the one room URL on the site with no join form behind it, so
      this used to be navigate('/') — a friend who was sent the room link landed
      on the home page with no code, no explanation and no idea they had been
      moved. /?join=CODE is the same home page with the join form open and the
      code already in it.
    */
    navigate(`/?join=${encodeURIComponent(roomCode || '')}`, { replace: true });
  }, [socket, gameState.gameId, roomCode, navigate]);

  /* Never spin forever with nothing to press. */
  useEffect(() => {
    if (!isLoading) return undefined;
    const t = setTimeout(() => setSlowLoad(true), 6000);
    return () => clearTimeout(t);
  }, [isLoading]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return undefined;

    socket.on('game_rejoined', (payload) => {
      dispatch({ type: 'GAME_REJOINED', payload });
      setMyAnswer(payload?.gameState?.myAnswer || '');
      setIsLoading(false);
    });

    socket.on('reconnect_failed', () => {
      // Same reasoning as above: send them somewhere they can actually get back
      // in from, rather than to a home page that has forgotten the room.
      navigate(`/?join=${encodeURIComponent(roomCode || '')}`, { replace: true });
    });

    return () => {
      socket.off('game_rejoined');
      socket.off('reconnect_failed');
    };
  }, [socket, dispatch, navigate, roomCode]);

  useEffect(() => {
    if (!socket) return undefined;

    socket.on('players_updated', ({ players }) => dispatch({ type: 'PLAYERS_UPDATED', payload: { players } }));
    socket.on('game_started', (payload) => dispatch({ type: 'GAME_STARTED', payload }));
    socket.on('player_answered', (payload) => dispatch({ type: 'PLAYER_ANSWERED', payload }));
    socket.on('round_completed', (payload) => {
      dispatch({ type: 'ROUND_COMPLETED', payload });
      setAnswer('');
      setMyAnswer('');
    });
    socket.on('game_completed', ({ winner }) => dispatch({ type: 'GAME_COMPLETED', payload: { winner } }));
    socket.on('next_round', (payload) => {
      dispatch({ type: 'NEXT_ROUND', payload });
      setAnswer('');
      setMyAnswer('');
      if (payload?.skipped) setToast({ text: 'Question skipped — here is a new one.', tone: 'good' });
    });
    socket.on('pink_cow_moved', (payload) => dispatch({ type: 'PINK_COW_MOVED', payload }));

    /*
      The server refusing an answer is usually not the player's fault, and used
      to be reported to them as "Failed to submit answer" — the same words for
      "you already answered this one" as for a real breakage.
    */
    socket.on('answer_rejected', ({ reason }) => {
      dispatch({ type: 'ANSWER_REJECTED', payload: { reason } });
      setToast(reason === 'already-answered'
        ? { text: 'You had already answered this round — your first answer counts.', tone: 'good' }
        : { text: 'That round finished while you were typing. Here come the results.', tone: 'good' });
    });

    socket.on('error', ({ message }) => setToast({ text: message, tone: 'bad' }));

    return () => {
      socket.off('players_updated');
      socket.off('game_started');
      socket.off('player_answered');
      socket.off('round_completed');
      socket.off('game_completed');
      socket.off('next_round');
      socket.off('pink_cow_moved');
      socket.off('answer_rejected');
      socket.off('error');
    };
  }, [socket, dispatch]);

  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(() => setToast(null), 5000);
    return () => clearTimeout(t);
  }, [toast]);

  // Reset the host panel whenever the round changes
  useEffect(() => { setShowAdjust(false); }, [gameState.currentRound, gameState.roundResults]);

  useEffect(() => {
    if (gameState.gameStatus === 'completed') localStorage.removeItem('gameSession');
  }, [gameState.gameStatus]);

  /*
    Swallow a double-tap, and NOTHING else.

    This started life throttling on the event name alone, and that is wrong in a
    way that only shows up in a quick group: when a round resolved fast, the
    next round's answer landed inside 400ms of the previous round's answer, the
    throttle ate it, and the player was left with their text still in the box, a
    button that did nothing and no message at all. e2e/herd-game.spec.js caught
    it on round two of a normal game — a round that had taken 230ms.

    So the key is the whole intent: the action, the round it belongs to and what
    it carries. Two identical taps 400ms apart are one tap; anything else is a
    different thing the player meant to do and goes through.

    Host score edits are exempt: tapping "+" twice to award two points is a real
    thing hosts do, and losing one of those silently is worse than sending one
    twice — which they can see, and undo with the "−" right next to it.
  */
  const UNTHROTTLED = ['adjust_score'];
  const send = (event, payload = {}) => {
    if (!socket) return false;
    if (!UNTHROTTLED.includes(event)) {
      const key = `${event}:${gameState.currentRound}:${JSON.stringify(payload)}`;
      const t = Date.now();
      if (t - (lastSendRef.current[key] || 0) < 400) return false;
      lastSendRef.current[key] = t;
    }
    socket.emit(event, { gameId: gameState.gameId, ...payload });
    return true;
  };

  const handleSubmitAnswer = (e) => {
    if (e) e.preventDefault();
    const text = answer.trim();
    if (!text) return;
    // Only remember it as "mine" if it actually went. Showing someone their
    // answer back when it never left the phone is the worst of both.
    if (send('submit_answer', { answer: text })) setMyAnswer(text);
  };

  const handleLeaveGame = () => {
    try { localStorage.removeItem('gameSession'); } catch { /* private mode */ }
    if (socket) socket.emit('leave_game', { gameId: gameState.gameId });
    dispatch({ type: 'RESET_GAME' });
    navigate('/');
  };

  /* ── Derived facts every screen needs ─────────────────────────────────── */
  const players = gameState.players || [];
  const livePlayers = players.filter((p) => p.isConnected !== false);
  const host = players.find((p) => p.isHost);
  const hostName = host?.username || '';
  /*
    `!host` counts too. The server's mayActAsHost hands the room its own
    authority when there is no host record at all — a removed player, an old
    room — but this read `!!host && ...`, so the client hid every button the
    server would have accepted. That is a stranded room created by the two
    halves disagreeing, which is the same shape as the bug all of this is for.

    The `players.length > 0` guard is the other side of it: an EMPTY list is not
    a missing host, it is a list that has not arrived. A joiner used to be able
    to miss its own players_updated broadcast while still navigating, and would
    then render "<blank> has dropped out" and hand itself the host's buttons.
  */
  const hostGone = players.length > 0 && (!host || host.isConnected === false);
  const myId = gameState.playerId;

  // The host's authority falls to the room when the host is not in it — the
  // same rule the server applies, mirrored here so the buttons match reality.
  const iCanHost = gameState.isHost || hostGone;

  const waitingFor = gameState.waitingFor || [];
  const waitingNames = waitingFor.map((w) => w.username);
  const iAmAwaited = waitingFor.some((w) => String(w.id) === String(myId));
  // For the button label only. A host who has not answered yet was being
  // offered "Reveal without Ann" — Ann being them.
  const othersAwaited = waitingFor
    .filter((w) => String(w.id) !== String(myId))
    .map((w) => w.username);

  const answerWindowPassed = gameState.roundEndsAt ? now >= gameState.roundEndsAt : false;
  const secondsToReveal = gameState.roundEndsAt
    ? Math.max(0, Math.ceil((gameState.roundEndsAt - now) / 1000))
    : 0;
  const unlockAt = gameState.resultsAt ? gameState.resultsAt + (gameState.unlockAfterMs || 60000) : 0;
  const nextRoundUnlocked = unlockAt > 0 && now >= unlockAt;
  const secondsToUnlock = unlockAt > 0 ? Math.max(0, Math.ceil((unlockAt - now) / 1000)) : 0;

  /* ── Loading ───────────────────────────────────────────────────────────── */
  if (isLoading) {
    return (
      <MeadowLayout maxWidth="max-w-md">
        <div className={`${card} text-center`}>
          <div className="flex justify-center mb-3"><HerdIcon size={72} /></div>
          <h1 style={fredokaStyle} className="text-2xl font-bold" >{connected ? 'Finding your game…' : 'Reaching the meadow…'}</h1>
          <p className="mt-2 text-base" style={{ color: '#4A2D1B' }}>
            Room <span className="font-mono font-bold tracking-widest">{roomCode}</span>
          </p>
          {slowLoad && (
            <div className="mt-4 rounded-2xl border-2 p-3" style={{ background: '#FFF6E9', borderColor: AMBER }}>
              <p className="text-base" style={{ color: '#6B4226' }}>
                This is taking longer than it should. Your connection may have dropped.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-2 w-full rounded-xl border-2 bg-white py-2 font-bold"
                style={{ borderColor: PINK, color: PINK, ...fredokaStyle }}
              >
                Try again
              </button>
              <Link to="/" className="mt-2 block text-base underline" style={{ color: MUTED }}>
                or go back to the meadow
              </Link>
            </div>
          )}
        </div>
      </MeadowLayout>
    );
  }

  /* ── Game over ─────────────────────────────────────────────────────────── */
  /*
    Also covers rejoining a game that finished while you were away. That used to
    fall through to the answer box for a round that no longer existed, because
    the only test was `gameState.winner` and a reconnect never carries one.
  */
  const finished = !!gameState.winner || gameState.gameStatus === 'completed';
  if (finished) {
    const ranked = [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
    const champion = gameState.winner || ranked[0] || null;
    const iWon = champion && String(champion._id) === String(myId);

    return (
      <MeadowLayout maxWidth="max-w-lg">
        {iWon && <Confetti width={win.w} height={win.h} numberOfPieces={220} recycle={false} />}
        <div className={`${card} text-center`}>
          <div className="flex justify-center"><Rosette size={80} /></div>
          <h1 style={fredokaStyle} className="text-3xl font-bold mt-2" >
            {iWon ? 'You win!' : champion ? `${champion.username} wins` : 'Game over'}
          </h1>
          {champion && (
            <p className="mt-1 text-lg" style={{ color: '#4A2D1B' }}>
              with <span className="font-bold" style={{ color: GREEN }}>{champion.score}</span> points
            </p>
          )}

          <Scores players={players} pinkCowHolder={gameState.pinkCowHolder} myId={myId} />

          <AdSlot slot={GAMEOVER_AD_SLOT} format="auto" className="my-4" />

          <button
            type="button"
            onClick={handleLeaveGame}
            style={{ background: PINK, ...fredokaStyle }}
            className="mt-2 w-full py-3.5 rounded-2xl text-white font-bold text-lg"
          >
            Play again &rarr;
          </button>
          <Link to="/" className="mt-3 inline-block text-base underline" style={{ color: MUTED }}>
            Back to all games
          </Link>
        </div>
        <Toast {...(toast || {})} onClose={() => setToast(null)} />
      </MeadowLayout>
    );
  }

  /* ── Lobby ─────────────────────────────────────────────────────────────── */
  if (gameState.gameStatus === 'waiting') {
    const enough = livePlayers.length >= 2;
    return (
      <MeadowLayout maxWidth="max-w-lg">
        <div className={card}>
          <h1 style={fredokaStyle} className="text-3xl font-bold text-center mb-1">Herd Mentality</h1>
          <p className="text-center text-base mb-4" style={{ color: MUTED }}>Think like the herd, not like yourself.</p>

          <LobbyInvite
            gamePath="game"
            roomCode={roomCode}
            gameName="Herd Mentality"
            playerCount={livePlayers.length}
            minPlayers={2}
            inviteUrl={`${window.location.origin}/?join=${roomCode}`}
          />

          <div className="mt-4 rounded-2xl border-2 p-3.5" style={{ background: '#FFF6E9', borderColor: AMBER, color: '#6B4226' }}>
            <p className="font-bold" style={fredokaStyle}>How it works</p>
            <p className="text-base mt-1 leading-relaxed">
              Everyone answers the same question. Score a point if your answer matches
              most of the herd. Give the <strong>only</strong> odd answer and you are landed
              with the pink cow &mdash; and you cannot win while you are holding it.
              First to {WIN_SCORE} takes it.
            </p>
          </div>

          <div className="mt-4">
            <p className="text-sm font-semibold mb-1.5" style={{ color: MUTED }}>
              In the room ({livePlayers.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {players.map((p) => (
                <span
                  key={p._id}
                  className={`px-3 py-1.5 rounded-full text-base font-semibold ${
                    p.isConnected === false ? 'bg-gray-100 text-gray-400' : 'bg-[#FFE8C8] text-[#2D1810]'
                  }`}
                >
                  {p.username}{p.isHost ? ' · host' : ''}{String(p._id) === String(myId) ? ' (you)' : ''}
                </span>
              ))}
            </div>
          </div>

          {/*
            Say WHO everyone is waiting for.

            This used to read "Waiting for players..." to every person in the
            room, and only the host was shown a Start button. So four people
            could sit in a lobby indefinitely, each assuming the game was still
            loading, while the one person who could start it had no idea it was
            on them. Room 49HREF had five players stuck in `waiting` at round 0
            when someone wrote in with "No question displayed" — the question
            was never displayed because the game was never started.

            931 of 2,733 rooms in the last 30 days were created and never
            started. This is the cheapest thing that could move that number.
          */}
          <div className="mt-5">
            {hostGone && !gameState.isHost && (
              <p className="mb-2 text-base font-semibold rounded-2xl border-2 px-3 py-2"
                 style={{ background: '#FFF6E9', borderColor: AMBER, color: '#6B4226' }}>
                {hostName || 'The host'} has dropped out &mdash; anyone can start now.
              </p>
            )}
            {iCanHost ? (
              <>
                <p className="text-center font-semibold mb-2" style={{ color: '#4A2D1B' }}>
                  {enough ? 'Everyone in? It is your call to start.' : 'You need one more player to start.'}
                </p>
                <button
                  type="button"
                  onClick={() => send('start_game')}
                  disabled={!enough}
                  style={{ background: GREEN, ...fredokaStyle }}
                  className="w-full py-3.5 rounded-2xl text-white font-bold text-lg disabled:opacity-40"
                >
                  {enough ? 'Start game →' : 'Need 1 more player'}
                </button>
              </>
            ) : (
              <p className="text-center font-semibold" style={{ color: '#4A2D1B' }}>
                {hostName ? `Waiting for ${hostName} to start the game…` : 'Waiting for the host to start the game…'}
              </p>
            )}
          </div>

          <AdSlot slot={LOBBY_AD_SLOT} format="auto" className="my-4" />

          <button type="button" onClick={handleLeaveGame} className="mt-1 block mx-auto text-base" style={{ color: MUTED }}>
            Leave room
          </button>
        </div>
        <Toast {...(toast || {})} onClose={() => setToast(null)} />
      </MeadowLayout>
    );
  }

  /* ── Results ───────────────────────────────────────────────────────────── */
  if (gameState.roundResults) {
    /*
      Who scored is read from `scoringPlayers` — the server's own list of player
      IDs — not by comparing text. The old check compared what the player TYPED
      against the NORMALISED herd answer, so anyone who typed "Chips" when the
      herd answer was "chip" was shown "Unique" and "0" while the server had
      already given them the point.
    */
    const rr = gameState.roundResults;
    /*
      `majorityLabels` is the herd as somebody in this room actually spelled it;
      `majorityAnswers` is the normalised key it is counted under. Printing the
      key put "The herd said cheesesandwich" on the biggest text on the page.
      Fall back through both, because a client can be mid-deploy against a
      server that has not sent labels yet.
    */
    const herds = rr.majorityLabels?.length
      ? rr.majorityLabels
      : (rr.majorityAnswers?.length ? rr.majorityAnswers : (rr.majorityAnswer ? [rr.majorityAnswer] : []));
    const scored = new Set((rr.scoringPlayers || []).map(String));
    const allAnswers = rr.allAnswers || [];
    // Who sat this one out. Their absence from the list below otherwise reads
    // as the game having lost their answer.
    const answeredIds = new Set(allAnswers.map((a) => String(a.playerId)));
    const missed = players.filter((p) => !answeredIds.has(String(p._id)));

    /*
      The game is over except it cannot end.

      You win on 8 points AND not holding the cow, and the cow only moves on a
      round with exactly one odd answer. So a leader who takes the cow at 8 is
      stuck there until such a round happens, which in an agreeable group may be
      never — room RK6J7L played 34 rounds in this state.
    */
    const cowBlocked = gameState.gameStatus === 'in-progress'
      ? players.find((p) => String(p._id) === String(gameState.pinkCowHolder || '') && (p.score || 0) >= WIN_SCORE)
      : null;

    const canAdvance = iCanHost || nextRoundUnlocked;

    return (
      <MeadowLayout maxWidth="max-w-lg">
        <div className={card}>
          <p className="text-sm font-semibold text-center" style={{ color: MUTED }}>Round {gameState.currentRound}</p>
          <p className="text-lg text-center mt-1 leading-snug" style={{ color: '#4A2D1B' }}>
            &ldquo;{gameState.currentQuestion}&rdquo;
          </p>

          {/* A tie between two or more herds is not "no result" — everyone in a
              tied herd scores. Saying "no majority answer" while quietly
              awarding points would be the same confusion from the other side. */}
          <div className="mt-3 rounded-2xl border-2 p-4 text-center"
               style={herds.length
                 ? { background: '#EAF6EE', borderColor: GREEN }
                 : { background: '#FFF6E9', borderColor: AMBER }}>
            {herds.length === 1 ? (
              <>
                <p className="text-base font-semibold" style={{ color: '#2D6E45' }}>The herd said</p>
                <p style={fredokaStyle} className="text-3xl font-bold break-words" >{herds[0]}</p>
              </>
            ) : herds.length > 1 ? (
              <p className="text-lg" style={{ color: '#2D6E45' }}>
                It&rsquo;s a tie &mdash; <span className="font-bold">{listHerds(herds)}</span>{' '}
                {herds.length === 2 ? 'both score' : 'all score'}
              </p>
            ) : allAnswers.length === 0 ? (
              <p className="text-lg font-semibold" style={{ color: '#6B4226' }}>
                Nobody answered this one &mdash; no points.
              </p>
            ) : (
              <p className="text-lg font-semibold" style={{ color: '#6B4226' }}>
                Everyone said something different &mdash; no points this round.
              </p>
            )}
          </div>

          {cowBlocked && (
            <div className="mt-4 rounded-2xl border-2 p-4 space-y-3 text-center"
                 style={{ background: '#FFF1F5', borderColor: PINK }}>
              <div className="flex justify-center"><PinkCowIcon size={40} /></div>
              <p className="text-lg" style={{ color: '#8A2F55' }}>
                <span className="font-bold">{cowBlocked.username}</span> has {cowBlocked.score} points and is
                holding the pink cow, so the game can&rsquo;t end.
              </p>
              {iCanHost ? (
                <>
                  <p className="text-base" style={{ color: '#8A2F55' }}>
                    Pass the cow to someone else and {cowBlocked.username} wins.
                  </p>
                  <CowPicker players={players} pinkCowHolder={gameState.pinkCowHolder}
                             onMove={(id) => send('move_pink_cow', { playerId: id || null })} />
                </>
              ) : (
                <p className="text-base" style={{ color: '#8A2F55' }}>
                  {hostName ? `${hostName} can move the cow to end it` : 'The host can move the cow to end it'},
                  {' '}or keep playing until someone gives the only odd answer.
                </p>
              )}
            </div>
          )}

          <AdSlot key={`round-ad-${gameState.currentRound}`} slot={ROUND_AD_SLOT} format="auto" className="my-4" />

          <div className="mt-4">
            {/* Stacked, not side by side: at 390px the heading wrapped to two
                lines and the host link wrapped to two lines and they collided
                into a four-line tangle. */}
            <div className="mb-2">
              <h2 style={fredokaStyle} className="text-lg font-bold">What everyone said</h2>
              {iCanHost && gameState.gameStatus === 'in-progress' && (
                <button
                  type="button"
                  onClick={() => setShowAdjust((s) => !s)}
                  className="mt-0.5 inline-flex items-center gap-1 text-base hover:underline"
                  style={{ color: MUTED }}
                >
                  <FiSliders size={15} />
                  {showAdjust ? 'Hide host controls' : 'Fix scores or move the cow'}
                </button>
              )}
            </div>

            {showAdjust && iCanHost && gameState.gameStatus === 'in-progress' && (
              <div className="mb-3 space-y-3 rounded-2xl border-2 p-3" style={{ background: '#FFF6E9', borderColor: AMBER }}>
                <p className="text-base" style={{ color: '#6B4226' }}>
                  Tap a player&rsquo;s <span className="font-bold" style={{ color: GREEN }}>+</span> to award a point
                  (a typo of the herd answer) or <span className="font-bold" style={{ color: '#B03A30' }}>&minus;</span> to remove one.
                </p>
                {/* Only one picker on screen. When the game is cow-locked the
                    callout above is already showing this, and two identical rows
                    of names is a question about which one is the real one. */}
                {!cowBlocked && (
                  <>
                    <p className="text-base" style={{ color: '#6B4226' }}>
                      The pink cow moves on its own to whoever gives the only odd answer &mdash; but you can hand it to anyone.
                    </p>
                    <CowPicker players={players} pinkCowHolder={gameState.pinkCowHolder}
                               onMove={(id) => send('move_pink_cow', { playerId: id || null })} />
                  </>
                )}
              </div>
            )}

            <div className="space-y-2">
              {allAnswers.map((a, i) => {
                const player = players.find((p) => String(p._id) === String(a.playerId));
                const inHerd = scored.has(String(a.playerId));
                return (
                  <div key={i} className="rounded-2xl px-3 py-2.5" style={{ background: inHerd ? '#EAF6EE' : '#FFF6E9' }}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="flex items-center gap-1.5 min-w-0">
                        <span className="font-semibold truncate" style={{ color: INK }}>{a.username}</span>
                        {String(gameState.pinkCowHolder) === String(a.playerId) && <PinkCowIcon size={16} />}
                      </span>
                      <span className="flex items-center gap-2 shrink-0">
                        <span
                          className="text-sm px-2 py-0.5 rounded-full font-semibold whitespace-nowrap"
                          style={herds.length
                            ? (inHerd ? { background: '#CFEBDA', color: '#245C3C' } : { background: '#FFE0E8', color: '#8A2F55' })
                            : { background: '#FFE8C8', color: '#6B4226' }}
                        >
                          {herds.length ? (inHerd ? 'In the herd +1' : 'Odd one out') : 'No match'}
                        </span>
                        <span className="text-base font-bold tabular-nums" style={{ color: MUTED }}>
                          {player?.score ?? 0}
                        </span>
                        {showAdjust && iCanHost && gameState.gameStatus === 'in-progress' && (
                          <span className="flex items-center rounded-full overflow-hidden border-2 border-[#FFE8C8] bg-white">
                            <button
                              type="button"
                              onClick={() => send('adjust_score', { playerId: a.playerId, delta: -1 })}
                              className="w-8 h-7 flex items-center justify-center text-lg font-bold leading-none"
                              style={{ color: '#B03A30' }}
                              aria-label={`Remove a point from ${a.username}`}
                            >
                              &minus;
                            </button>
                            <span className="w-px h-5 bg-[#FFE8C8]" />
                            <button
                              type="button"
                              onClick={() => send('adjust_score', { playerId: a.playerId, delta: 1 })}
                              className="w-8 h-7 flex items-center justify-center text-lg font-bold leading-none"
                              style={{ color: GREEN }}
                              aria-label={`Award a point to ${a.username}`}
                            >
                              +
                            </button>
                          </span>
                        )}
                      </span>
                    </div>
                    {/* Not truncated — the answer is the thing people came to
                        this screen to read. It wraps instead. */}
                    <p className="mt-0.5 break-words" style={{ color: '#4A2D1B' }}>&ldquo;{a.answer || ''}&rdquo;</p>
                  </div>
                );
              })}

              {missed.length > 0 && (
                <p className="pt-1 text-base" style={{ color: MUTED }}>
                  {listNames(missed.map((p) => p.username))}
                  {missed.length === 1 ? ' didn’t answer this one.' : ' didn’t answer this one.'}
                </p>
              )}
            </div>
          </div>

          {/*
            Same omission as the lobby: the host got a button and everyone else
            got silence, so "How to go to next round" was a fair question with no
            answer anywhere on the screen. Now everyone gets the button — the
            host at once, the room after a minute — and the people who cannot
            press it yet are told when they will be able to.
          */}
          {gameState.gameStatus === 'in-progress' && (
            <div className="mt-5">
              {canAdvance ? (
                <>
                  <button
                    type="button"
                    onClick={() => send('next_round')}
                    style={{ background: GREEN, ...fredokaStyle }}
                    className="w-full py-3.5 rounded-2xl text-white font-bold text-lg"
                  >
                    Next question &rarr;
                  </button>
                  {!gameState.isHost && (
                    <p className="mt-2 text-center text-sm" style={{ color: MUTED }}>
                      {hostGone
                        ? `${hostName || 'The host'} has dropped out, so anyone can move it on.`
                        : 'Everyone has waited long enough — anyone can move it on.'}
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center">
                  <p className="font-semibold" style={{ color: '#4A2D1B' }}>
                    {hostName ? `Waiting for ${hostName} to start the next round…` : 'Waiting for the host…'}
                  </p>
                  {secondsToUnlock > 0 && (
                    <p className="mt-1 text-sm" style={{ color: MUTED }}>
                      You can start it yourself in {secondsToUnlock}s.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <Scores players={players} pinkCowHolder={gameState.pinkCowHolder} myId={myId} />
          <button type="button" onClick={handleLeaveGame} className="mt-4 block mx-auto text-base" style={{ color: MUTED }}>
            Leave game
          </button>
        </div>
        <Toast {...(toast || {})} onClose={() => setToast(null)} />
      </MeadowLayout>
    );
  }

  /* ── Answering ─────────────────────────────────────────────────────────── */
  /*
    The screen from the incident. Everything below the answer box is new: who we
    are waiting for by name, and a way past them that does not require the
    person we are waiting for to come back.
  */
  const answeredCount = gameState.playersAnswered || 0;
  const totalCount = gameState.totalPlayers || livePlayers.length || 1;
  const canRevealNow = answeredCount > 0 && (iCanHost || answerWindowPassed);
  const canSkip = iCanHost || answerWindowPassed;

  return (
    <MeadowLayout maxWidth="max-w-lg">
      <div className={card}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold" style={{ color: MUTED }}>Round {gameState.currentRound}</span>
          <span className="text-sm font-semibold" style={{ color: MUTED }}>
            {answeredCount} of {totalCount} answered
          </span>
        </div>

        <div className="w-full bg-[#FFE8C8] rounded-full h-2 overflow-hidden">
          <div
            className="h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, (answeredCount / Math.max(1, totalCount)) * 100)}%`, background: GREEN }}
          />
        </div>

        <div className="mt-4 rounded-2xl border-2 p-4 text-center" style={{ background: '#FFF6E9', borderColor: AMBER }}>
          <p className="text-sm font-semibold" style={{ color: MUTED }}>Answer like the herd</p>
          <p style={fredokaStyle} className="text-2xl font-bold mt-1 leading-snug break-words" >
            {gameState.currentQuestion}
          </p>
        </div>

        {!gameState.hasAnswered ? (
          <form onSubmit={handleSubmitAnswer} className="mt-4">
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Your answer…"
              maxLength={80}
              autoComplete="off"
              aria-label="Your answer"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#3D8B5A] outline-none bg-[#FFFDF8]"
              style={{ color: INK }}
            />
            <p className="mt-1 text-sm" style={{ color: MUTED }}>
              A word or two. Everyone&rsquo;s answers stay hidden until the round ends.
            </p>
            <button
              type="submit"
              disabled={!answer.trim()}
              style={{ background: PINK, ...fredokaStyle }}
              className="mt-2 w-full py-3.5 rounded-2xl text-white font-bold text-lg disabled:opacity-40"
            >
              Lock in my answer
            </button>
          </form>
        ) : (
          <div className="mt-4 rounded-2xl border-2 p-4 text-center" style={{ background: '#EAF6EE', borderColor: GREEN }}>
            <p className="inline-flex items-center gap-1.5 text-base font-semibold" style={{ color: '#245C3C' }}>
              <FiCheck /> Your answer is in
            </p>
            {/* Showing it back matters: this used to replace the answer with the
                word "Waiting", so by the time the results came up nobody could
                remember what they had put. */}
            {myAnswer && (
              <p style={fredokaStyle} className="text-2xl font-bold mt-1 break-words" >&ldquo;{myAnswer}&rdquo;</p>
            )}
          </div>
        )}

        {/*
          WHO. The whole point.

          "Waiting for other players…" was the entire previous content of this
          region, and it is what room S1DQVW stared at while three of its players
          wrote in. A name turns a dead screen into something a room can act on:
          somebody shouts across the table, or presses the button below.
        */}
        <div className="mt-4" role="status" aria-live="polite">
          {waitingFor.length === 0 ? (
            // Only true when the last answer really has landed. Saying it while
            // nobody has answered would be a lie told at exactly the moment the
            // player most needs the truth.
            <p className="text-center font-semibold" style={{ color: '#4A2D1B' }}>
              {answeredCount > 0 ? 'That’s everyone — scoring the round…' : 'Getting the round ready…'}
            </p>
          ) : (
            <>
              <p className="text-center font-semibold" style={{ color: '#4A2D1B' }}>
                {iAmAwaited && waitingFor.length === 1
                  ? 'Everyone is waiting for you.'
                  : `Waiting for ${listNames(waitingNames)}…`}
              </p>
              {/*
                The third question — "what can I do about it?" — answered for
                the person who cannot do anything yet. Without this line a
                non-host reads a name, finds no button, and is back to staring
                at a screen that will not change. Now they know who can move it
                and exactly when it stops being only that person's call.
              */}
              {!iAmAwaited && !iCanHost && !answerWindowPassed && secondsToReveal > 0 && (
                <p className="mt-1 text-center text-sm" style={{ color: MUTED }}>
                  {hostName ? `${hostName} can reveal without them` : 'The host can reveal early'}
                  {' '}&mdash; or anyone can in {secondsToReveal}s.
                </p>
              )}
              <div className="mt-2 flex flex-wrap justify-center gap-1.5">
                {livePlayers.map((p) => {
                  const done = !waitingFor.some((w) => String(w.id) === String(p._id));
                  return (
                    <span
                      key={p._id}
                      className="px-2.5 py-1 rounded-full text-sm font-semibold inline-flex items-center gap-1"
                      style={done ? { background: '#CFEBDA', color: '#245C3C' } : { background: '#FFF6E9', color: MUTED }}
                    >
                      {done && <FiCheck size={12} />}
                      {p.username}
                    </span>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/*
          The way out.

          The host can always cut a round short once there is something to show.
          Once the answer window has passed ANYONE can, because the person who
          has wandered off is very often the host — that was literally the second
          of the three reports from room S1DQVW ("Host is bad").
        */}
        {waitingFor.length > 0 && (canRevealNow || canSkip) && (
          <div className="mt-4 rounded-2xl border-2 p-3" style={{ background: '#FFF6E9', borderColor: AMBER }}>
            {!iCanHost && answerWindowPassed && (
              <p className="text-sm mb-2" style={{ color: '#6B4226' }}>
                {hostName ? `${hostName} hasn't moved this on` : 'Nobody has moved this on'} &mdash; so now anyone can.
              </p>
            )}
            {canRevealNow && (
              <button
                type="button"
                onClick={() => send('reveal_now')}
                className="w-full rounded-xl border-2 bg-white py-2.5 font-bold inline-flex items-center justify-center gap-2"
                style={{ borderColor: PINK, color: PINK, ...fredokaStyle }}
              >
                <FiEye />
                {othersAwaited.length ? `Reveal without ${listNames(othersAwaited)}` : 'Reveal the answers now'}
              </button>
            )}
            {canSkip && (
              <button
                type="button"
                onClick={() => send('skip_question')}
                className="mt-2 w-full inline-flex items-center justify-center gap-1.5 text-base"
                style={{ color: MUTED }}
              >
                <FiSkipForward size={15} />
                Skip this question instead
              </button>
            )}
          </div>
        )}

        {hostGone && (
          <p className="mt-3 text-center text-sm" style={{ color: MUTED }}>
            {hostName || 'The host'} has dropped out. You can carry on without them.
          </p>
        )}

        <Scores players={players} pinkCowHolder={gameState.pinkCowHolder} myId={myId} />

        <button type="button" onClick={handleLeaveGame} className="mt-4 block mx-auto text-base" style={{ color: MUTED }}>
          Leave game
        </button>
      </div>
      <Toast {...(toast || {})} onClose={() => setToast(null)} />
    </MeadowLayout>
  );
};

export default GameRoom;
