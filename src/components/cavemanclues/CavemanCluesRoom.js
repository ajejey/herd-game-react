import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Confetti from 'react-confetti';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import LobbyInvite from '../common/LobbyInvite';
import { useCavemanClues } from '../../hooks/useCavemanClues';
import { tokenizeClue, illegalWords } from '../../lib/syllables';
import { rememberWord } from '../../lib/recentWords';

const PINK = '#E84A8B';
const GREEN = '#3D8B5A';
const AMBER = '#F0C070';

function Scores({ players, scores, myId }) {
  const sorted = [...players].sort((a, b) => (scores?.[b.id] ?? 0) - (scores?.[a.id] ?? 0));
  return (
    <div className="mt-4 space-y-1.5 max-w-sm mx-auto text-left">
      {sorted.map((p, i) => (
        <div key={p.id} className={`flex items-center justify-between px-3 py-2 rounded-xl ${p.id === myId ? 'bg-[#FFE8C8]' : 'bg-[#FFF6E9]'}`}>
          <span className="font-semibold text-[#2D1810]">
            {i + 1}. {p.username}{p.id === myId ? ' (you)' : ''}{!p.connected ? ' ⚪' : ''}
          </span>
          <span className="font-bold text-[#3D8B5A]">{scores?.[p.id] ?? 0}</span>
        </div>
      ))}
    </div>
  );
}

/*
  Colour each word as it is typed, so a slip is visible BEFORE it is sent rather
  than only after it has cost a point. The same rule runs on the server and is
  authoritative — this is a warning light, not a gate, and it must never stop
  someone sending a clue. A client that silently blocked input would disagree
  with the server sooner or later and the player would be stuck with no idea why.
*/
function ClueMeter({ text }) {
  /*
    Judged by the SAME functions the server uses, on the same tokens.

    This used to split on whitespace while the server split on [^A-Za-z']+, so
    "red-hot" was painted red here and charged nothing there. Re-splitting the
    clue a second way is how a warning light comes to disagree with the referee
    — so it does not split at all any more, it asks.
  */
  const bad = illegalWords(text);
  if (!text.trim()) {
    return <p className="text-sm text-[#8B6347] mt-1 min-h-[1.25rem]">Short words only. Long ones cost a point.</p>;
  }
  const offending = new Set(bad.map((w) => w.toLowerCase()));
  return (
    <div className="mt-1 min-h-[1.25rem]">
      <p className="text-base leading-snug">
        {tokenizeClue(text).map((t, i) => {
          if (!t.isWord) return <span key={i}>{t.text}</span>;
          const isBad = offending.has(t.text.toLowerCase());
          return (
            <span key={i} style={{ color: isBad ? '#B03A30' : '#2D6E45', fontWeight: isBad ? 800 : 600 }}>
              {t.text}
            </span>
          );
        })}
      </p>
      {bad.length > 0 && (
        <p className="text-sm font-bold mt-0.5" style={{ color: '#B03A30' }}>
          Too long: {bad.join(', ')} — sending this costs a point
        </p>
      )}
    </div>
  );
}

export default function CavemanCluesRoom() {
  const { roomCode: codeParam } = useParams();
  const game = useCavemanClues();
  const { connected, state, myId, error, kicked, roomNotFound, isHost, joinGame, startGame, sendAction, leaveGame } = game;

  const [name, setName] = useState('');
  const [clue, setClue] = useState('');
  const [guess, setGuess] = useState('');
  const [now, setNow] = useState(Date.now());
  const [win, setWin] = useState({ w: 1024, h: 768 });
  const lastSendRef = useRef({});
  const feedRef = useRef(null);

  useEffect(() => {
    const on = () => setWin({ w: window.innerWidth, h: window.innerHeight });
    on(); window.addEventListener('resize', on);
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => { window.removeEventListener('resize', on); clearInterval(t); };
  }, []);

  /*
    A deliberate test seam. e2e/caveman-clues.spec.js asserts what the SERVER
    sent this browser, not merely what this browser chose to render — hiding a
    secret with CSS is not hiding it (TESTING.md §5.3), and the Android app
    ships a frozen front end that cannot be trusted to hide anything.

    Safe to ship: it can never hold more than this client already received and
    already has in React state, which React DevTools would show anyway. It adds
    no data to the payload; it only makes the payload inspectable.
  */
  useEffect(() => { window.__ccState = state ?? null; }, [state]);

  /*
    Remember every word this browser has been shown, so the next game this
    person hosts deals the ones they have not had. Recorded at the REVEAL,
    which is the moment the word becomes public — recording it any earlier
    would write the answer into localStorage while a guesser could still read
    it out of their own dev tools.
  */
  useEffect(() => {
    if (state?.phase === 'reveal' && state.word) rememberWord('cavemanclues', state.word);
  }, [state?.phase, state?.word]);

  const phase = state?.phase;
  const turn = state?.turn;
  const isGiver = !!state?.isGiver;

  // Keep the newest clue or guess in view without yanking the page around.
  useEffect(() => {
    if (feedRef.current) feedRef.current.scrollTop = feedRef.current.scrollHeight;
  }, [turn?.clues?.length, turn?.guesses?.length]);

  // Clear the boxes when a new round begins, not on every state update, or a
  // guess is wiped out from under someone mid-type by another player's guess.
  useEffect(() => { setClue(''); setGuess(''); }, [turn?.giverId, phase]);

  const deadline = turn?.startedAt ? turn.startedAt + (state?.turnSec ?? 90) * 1000 : 0;
  const secondsLeft = deadline ? Math.max(0, Math.ceil((deadline - now) / 1000)) : 0;

  /*
    Throttled PER ACTION, and it reports whether it actually sent.

    Two problems with the single shared timestamp it replaces. Unrelated actions
    cancelled each other — sending a clue swallowed a guess 300ms later — and
    the callers cleared their input box regardless, so a dropped send erased
    what the player had typed and left them believing it had gone. In a game
    scored by who answers first, that costs them the round.
  */
  function send(action, payload) {
    const t = Date.now();
    const last = lastSendRef.current[action] || 0;
    if (t - last < 400) return false;
    lastSendRef.current[action] = t;
    sendAction(action, payload);
    return true;
  }

  /*
    Time is up. Anyone may end it, so a giver who walked away cannot freeze the
    room — the server allows it only once the clock is genuinely spent.

    Re-armed on an interval rather than fired once on the transition to zero.
    It used to run on [secondsLeft, phase], and secondsLeft then stays at 0
    forever, so the effect never ran again: one send swallowed by the throttle,
    or rejected because this client's clock ran a second ahead of the server's,
    left the whole room parked on 0s with nothing to press.
  */
  useEffect(() => {
    if (phase !== 'clue' || secondsLeft !== 0 || !deadline) return undefined;
    const t = setInterval(() => send('end_turn', {}), 1500);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, phase, deadline]);

  const code = state?.roomCode || codeParam;

  if (kicked) {
    return <MeadowLayout maxWidth="max-w-md"><div className="text-center bg-white rounded-3xl border-4 border-[#FFE8C8] p-8">
      <h1 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810]">{error || 'You left the room.'}</h1>
      <Link to="/caveman-clues" className="text-[#E84A8B] font-semibold underline mt-3 inline-block">Back to Caveman Clues</Link>
    </div></MeadowLayout>;
  }

  if (!state) {
    return (
      <MeadowLayout maxWidth="max-w-md">
        <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-6 text-center">
          <h1 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-1">Join Caveman Clues</h1>
          <p className="text-[#4A2D1B] mb-4">Room <span className="font-mono font-bold">{codeParam}</span></p>
          {error && <p className="text-red-600 text-base mb-2">{error}</p>}
          {roomNotFound && <p className="text-[#8B6347] text-base mb-2">That room wasn’t found — check the code.</p>}
          <form onSubmit={(e) => { e.preventDefault(); if (name.trim()) joinGame(codeParam, name); }} className="space-y-3">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={20}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#3D8B5A] outline-none text-[#2D1810] bg-[#FFFDF8]" />
            <button type="submit" disabled={!connected} style={{ background: PINK, fontFamily: 'Fredoka, sans-serif' }}
              className="w-full py-3 rounded-xl text-white font-bold disabled:opacity-50">{connected ? 'Join game →' : 'Connecting…'}</button>
          </form>
        </div>
      </MeadowLayout>
    );
  }

  const players = state.players || [];
  const connectedCount = players.filter((p) => p.connected).length;
  const nameById = (id) => players.find((p) => p.id === id)?.username || 'someone';

  if (state.status === 'lobby') {
    return (
      <MeadowLayout maxWidth="max-w-lg">
        <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-6 text-center">
          <h1 style={fredokaStyle} className="text-3xl font-bold text-[#2D1810] mb-4">Caveman Clues</h1>
          <LobbyInvite gamePath="caveman-clues" roomCode={code} gameName="Caveman Clues"
            playerCount={connectedCount} minPlayers={3} />
          <div className="mt-5 text-left">
            <p className="text-base font-semibold text-[#8B6347] mb-1">Players ({connectedCount})</p>
            <div className="flex flex-wrap gap-2">
              {players.map((p) => (
                <span key={p.id} className={`px-3 py-1 rounded-full text-base font-semibold ${p.connected ? 'bg-[#FFE8C8] text-[#2D1810]' : 'bg-gray-100 text-gray-400'}`}>
                  {p.username}{p.isHost ? ' 👑' : ''}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-4 rounded-2xl border-2 p-3 text-left" style={{ background: '#FFF6E9', borderColor: AMBER, color: '#6B4226' }}>
            <p className="font-bold">How it works</p>
            <p className="text-base mt-1">
              One of you gets a word. You describe it using <strong>only one-syllable words</strong> —
              everyone else races to guess. Long words still send, they just cost you a point.
            </p>
          </div>
          {error && <p className="text-red-600 text-base mt-3">{error}</p>}
          {isHost ? (
            <button onClick={startGame} disabled={connectedCount < 3} style={{ background: GREEN, fontFamily: 'Fredoka, sans-serif' }}
              className="mt-4 w-full py-3 rounded-xl text-white font-bold text-lg disabled:opacity-40">
              {connectedCount < 3 ? `Need ${3 - connectedCount} more` : 'Start game'}
            </button>
          ) : <p className="text-[#4A2D1B] mt-4">Waiting for the host to start…</p>}
          <button onClick={leaveGame} className="mt-3 text-base text-[#8B6347] hover:text-[#2D1810]">Leave room</button>
        </div>
      </MeadowLayout>
    );
  }

  /* ── Finished ──────────────────────────────────────────────────────────── */
  if (phase === 'finished') {
    const iWon = state.winner === myId;
    const tie = Array.isArray(state.tiedWinners) && state.tiedWinners.length > 1;
    return (
      <MeadowLayout maxWidth="max-w-lg">
        {iWon && <Confetti width={win.w} height={win.h} numberOfPieces={220} recycle={false} />}
        <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-6 text-center">
          <h1 style={fredokaStyle} className="text-3xl font-bold text-[#2D1810]">
            {tie ? 'It’s a tie!' : iWon ? 'You win!' : `${nameById(state.winner)} wins`}
          </h1>
          {tie && <p className="text-[#4A2D1B] mt-1">{state.tiedWinners.map(nameById).join(' and ')} finished level.</p>}
          <Scores players={players} scores={state.scores} myId={myId} />
          <Link to="/caveman-clues" className="mt-5 inline-block font-bold underline" style={{ color: PINK }}>Play again</Link>
          <button onClick={leaveGame} className="mt-3 block mx-auto text-base text-[#8B6347]">Leave room</button>
        </div>
      </MeadowLayout>
    );
  }

  /* ── Reveal ────────────────────────────────────────────────────────────── */
  if (phase === 'reveal') {
    const last = state.lastTurn || {};
    const solved = !!last.solvedBy;
    return (
      <MeadowLayout maxWidth="max-w-lg">
        <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-6 text-center">
          <p className="text-sm font-semibold text-[#8B6347]">Round {state.turnNumber} of {state.totalTurns}</p>
          <p className="text-base font-semibold text-[#8B6347] mt-1">The word was</p>
          <h1 style={fredokaStyle} className="text-4xl font-bold text-[#2D1810] my-1 break-words">{last.word}</h1>
          <p className="text-[#4A2D1B] mt-2">
            {solved
              ? <><strong>{nameById(last.solvedBy)}</strong> got it. +{last.guesserGain} — and +{last.giverGain} to {nameById(last.giverId)}.</>
              : <>Nobody got it this time.</>}
          </p>
          {last.slips > 0 && (
            <p className="text-base mt-1" style={{ color: '#B03A30' }}>
              {nameById(last.giverId)} slipped {last.slips} time{last.slips === 1 ? '' : 's'}.
            </p>
          )}
          <Scores players={players} scores={state.scores} myId={myId} />
          <button onClick={() => send('next_round', {})} style={{ background: GREEN, fontFamily: 'Fredoka, sans-serif' }}
            className="mt-5 w-full py-3 rounded-xl text-white font-bold text-lg">
            {state.turnNumber >= state.totalTurns ? 'See the final scores →' : 'Next round →'}
          </button>
          <p className="text-sm text-[#8B6347] mt-2">Anyone can move it on.</p>
        </div>
      </MeadowLayout>
    );
  }

  /* ── Clue phase ────────────────────────────────────────────────────────── */
  const giverGone = !!turn && !players.find((p) => p.id === turn.giverId && p.connected);
  const clues = turn?.clues || [];
  const guesses = turn?.guesses || [];
  const rejected = turn?.rejected;

  return (
    <MeadowLayout maxWidth="max-w-lg">
      <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-5">
        {/* A party game with no visible end is one people drift away from —
            nobody stays for "one more" if they cannot see how many are left. */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-[#8B6347]">
            Round {state.turnNumber} of {state.totalTurns}
          </span>
          <span className="font-mono font-bold text-lg" style={{ color: secondsLeft <= 10 ? '#B03A30' : '#2D6E45' }}>
            {secondsLeft}s
          </span>
        </div>
        <div className="mb-3">
          <span className="text-base font-semibold text-[#2D1810]">
            {isGiver ? 'You are giving the clues' : `${nameById(turn?.giverId)} is giving clues`}
          </span>
        </div>

        {isGiver ? (
          <div className="rounded-2xl border-2 p-4 text-center" style={{ background: '#EAF6EE', borderColor: GREEN }}>
            <p className="text-base font-semibold text-[#2D6E45]">Your word</p>
            <p style={fredokaStyle} className="text-3xl font-bold text-[#2D1810] break-words">{state.word}</p>
          </div>
        ) : (
          <div className="rounded-2xl border-2 p-4 text-center" style={{ background: '#FFF6E9', borderColor: AMBER }}>
            <p className="text-base font-semibold text-[#6B4226]">Guess the word from the clues</p>
          </div>
        )}

        {/* The shared feed — clues and guesses as they land */}
        <div ref={feedRef} className="mt-3 max-h-56 overflow-y-auto space-y-1.5 pr-1">
          {clues.length === 0 && guesses.length === 0 && (
            <p className="text-base text-[#8B6347] text-center py-4">
              {isGiver ? 'Type your first clue below.' : 'Waiting for the first clue…'}
            </p>
          )}
          {[...clues.map((c) => ({ ...c, kind: 'clue' })), ...guesses.map((g) => ({ ...g, kind: 'guess' }))]
            .sort((a, b) => a.at - b.at)
            .map((item, i) => (
              <div key={i} className={`px-3 py-2 rounded-xl text-left ${item.kind === 'clue' ? 'bg-[#EAF6EE]' : 'bg-[#FFF6E9]'}`}>
                <span className="text-sm font-semibold text-[#8B6347]">
                  {item.kind === 'clue' ? 'clue' : nameById(item.by)}
                </span>
                <span className="ml-2 text-[#2D1810] break-words">{item.text}</span>
                {item.kind === 'clue' && item.bad?.length > 0 && (
                  <span className="ml-2 text-sm font-bold" style={{ color: '#B03A30' }}>
                    ugh! {item.bad.join(', ')}
                  </span>
                )}
                {item.kind === 'guess' && item.right && (
                  <span className="ml-2 text-sm font-bold" style={{ color: '#2D6E45' }}>correct!</span>
                )}
              </div>
            ))}
        </div>

        {isGiver ? (
          <form
            className="mt-3"
            onSubmit={(e) => { e.preventDefault(); if (clue.trim() && send('clue', { text: clue.trim() })) setClue(''); }}
          >
            <input value={clue} onChange={(e) => setClue(e.target.value)} maxLength={120}
              placeholder="Say it in short words…" autoComplete="off"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#3D8B5A] outline-none text-[#2D1810] bg-[#FFFDF8]" />
            <ClueMeter text={clue} />
            {rejected?.reason === 'answer' && (
              <p className="text-base font-bold mt-1" style={{ color: '#B03A30' }}>
                You can’t say the word itself — nobody saw that one.
              </p>
            )}
            <div className="flex gap-2 mt-2">
              <button type="submit" disabled={!clue.trim()} style={{ background: PINK, fontFamily: 'Fredoka, sans-serif' }}
                className="flex-1 py-3 rounded-xl text-white font-bold disabled:opacity-40">Send clue</button>
              <button type="button" onClick={() => send('skip', {})}
                className="px-4 py-3 rounded-xl font-bold border-2" style={{ borderColor: AMBER, color: '#6B4226' }}>Skip</button>
            </div>
            <button type="button" onClick={() => send('end_turn', {})}
              className="mt-2 w-full text-base text-[#8B6347] hover:text-[#2D1810]">Give up on this word</button>
          </form>
        ) : (
          <form
            className="mt-3"
            onSubmit={(e) => { e.preventDefault(); if (guess.trim() && send('guess', { text: guess.trim() })) setGuess(''); }}
          >
            {/* The giver has gone. The server lets anyone move it on in that
                case, so say so rather than leaving the room staring at a clue
                box nobody can fill until the clock runs out. */}
            {giverGone && (
              <div className="mb-2 rounded-2xl border-2 px-3 py-2 text-left"
                style={{ background: '#FFF6E9', borderColor: AMBER, color: '#6B4226' }}>
                <p className="text-base font-semibold">
                  {nameById(turn?.giverId)} dropped out mid-clue.
                </p>
                <button type="button" onClick={() => send('end_turn', {})}
                  className="mt-2 w-full rounded-xl border-2 bg-white py-2 font-bold"
                  style={{ borderColor: PINK, color: PINK, fontFamily: 'Fredoka, sans-serif' }}>
                  Skip this word →
                </button>
              </div>
            )}
            <input value={guess} onChange={(e) => setGuess(e.target.value)} maxLength={40}
              placeholder="Your guess…" autoComplete="off"
              className="w-full px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#3D8B5A] outline-none text-[#2D1810] bg-[#FFFDF8]" />
            <button type="submit" disabled={!guess.trim()} style={{ background: PINK, fontFamily: 'Fredoka, sans-serif' }}
              className="mt-2 w-full py-3 rounded-xl text-white font-bold disabled:opacity-40">Guess</button>
          </form>
        )}

        <Scores players={players} scores={state.scores} myId={myId} />
        <button onClick={leaveGame} className="mt-3 block mx-auto text-base text-[#8B6347]">Leave room</button>
      </div>
    </MeadowLayout>
  );
}
