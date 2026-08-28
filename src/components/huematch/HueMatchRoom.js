import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Confetti from 'react-confetti';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import LobbyInvite from '../common/LobbyInvite';
import { useHueMatch } from '../../hooks/useHueMatch';
import HueBoard from './HueBoard';
import { colourAt, labelOf } from '../../lib/hueGrid';
import PlayAgain from '../common/PlayAgain';

const PINK = '#E84A8B';
/* Matches GRACE_SEC on the server. A phone whose clock is a second fast must
   not offer a button the server is about to refuse. */
const GRACE_SEC = 3;
const GREEN = '#3D8B5A';
const AMBER = '#F0C070';
const INK = '#2D1810';

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

export default function HueMatchRoom() {
  const { roomCode: codeParam } = useParams();
  const game = useHueMatch();
  const { connected, state, myId, error, kicked, roomNotFound, isHost, joinGame, startGame, sendAction, playAgain, leaveGame } = game;

  const [name, setName] = useState('');
  const [cue, setCue] = useState('');
  const [now, setNow] = useState(Date.now());
  const [win, setWin] = useState({ w: 1024, h: 768 });
  const lastSendRef = useRef({});

  useEffect(() => {
    const on = () => setWin({ w: window.innerWidth, h: window.innerHeight });
    on(); window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);

  /* A deliberate test seam — see CavemanCluesRoom.js. It can never hold more
     than this client already received, and it is what lets the e2e suite assert
     what the SERVER sent rather than what the screen chose to draw. */
  useEffect(() => { window.__hmState = state ?? null; window.__hmMyId = myId ?? null; }, [state, myId]);

  const phase = state?.phase;
  const turn = state?.turn;
  const isGiver = !!state?.isGiver;

  useEffect(() => { setCue(''); }, [phase, turn?.giverId]);

  /*
    Per action, and it reports whether it actually sent — so a caller never
    clears an input for a send that was swallowed.

    'place' gets a much shorter window than the rest, and that is the whole
    point of the table rather than one number. Moving a marker IS the game:
    the board's cells are ~25px, so a player who overshoots taps again
    immediately to correct it, and a 400ms gate silently ate the correction —
    the game ignoring you at the exact moment you are trying to fix its
    smallest target. Found by an e2e run that could tap faster than a person,
    which is what an automated test is for.

    The others keep the long window, where a double-fire is a real cost: two
    cues in a row, a lock you did not mean, a round skipped past the reveal.
  */
  const SEND_GAP = { place: 90 };
  const DEFAULT_GAP = 400;

  function send(action, payload) {
    const t = Date.now();
    if (t - (lastSendRef.current[action] || 0) < (SEND_GAP[action] ?? DEFAULT_GAP)) return false;
    lastSendRef.current[action] = t;
    sendAction(action, payload);
    return true;
  }

  const guessing = phase === 'guess1' || phase === 'guess2';
  const slot = phase === 'guess2' ? 'b' : 'a';
  const mine = turn?.markers?.[myId] || null;
  const myMarker = mine?.[slot] || null;
  const iLocked = !!mine?.locked;

  const deadline = turn?.startedAt && guessing ? turn.startedAt + (state?.guessSec ?? 60) * 1000 : 0;
  const secondsLeft = deadline ? Math.max(0, Math.ceil((deadline - now) / 1000)) : 0;

  /*
    The clock only ticks while there is a clock, and it ticks in ONE place.

    A 500ms setState on this component re-rendered the whole room twice a second
    — including HueBoard's 126 buttons, each with a freshly built inline style
    object — on every screen in the game, lobby and final scores included. The
    only thing that needed it was a single <span>. Now the interval runs during
    guessing and cueing alone, the countdown lives in <Countdown> below, and the
    board is memoised so a tick cannot reach it.
  */

  /*
    Who may push the room forward, mirroring moveOn() on the server. Mirrored
    and not trusted: the server decides, this only decides whether to offer the
    button. Offering it when the server would refuse is the worse failure — a
    control that does nothing reads as the game being broken.
  */
  const cueing = phase === 'clue1' || phase === 'clue2';
  const spent = !!turn?.startedAt
    && now - turn.startedAt > ((state?.guessSec ?? 60) + GRACE_SEC) * 1000;
  const giverGone = !!turn && !(state?.players || []).find((p) => p.id === turn.giverId && p.connected);
  const canMoveOn = cueing
    ? (isGiver || spent || giverGone)
    : (guessing && spent);

  const ticking = guessing || phase === 'clue1' || phase === 'clue2';
  useEffect(() => {
    if (!ticking) return undefined;
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [ticking]);

  /* Out of time: lock whatever is placed. Re-armed on an interval rather than
     fired once, because secondsLeft then stays at 0 and a single swallowed send
     would leave the room parked. */
  useEffect(() => {
    if (!guessing || secondsLeft !== 0 || !deadline || iLocked || !myMarker) return undefined;
    const t = setInterval(() => send('lock', {}), 1200);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, guessing, deadline, iLocked, myMarker]);

  const code = state?.roomCode || codeParam;

  if (kicked) {
    return <MeadowLayout maxWidth="max-w-md"><div className="text-center bg-white rounded-3xl border-4 border-[#FFE8C8] p-8">
      <h1 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810]">{error || 'You left the room.'}</h1>
      <Link to="/hue-match" className="text-[#E84A8B] font-semibold underline mt-3 inline-block">Back to Hue Match</Link>
    </div></MeadowLayout>;
  }

  if (!state) {
    return (
      <MeadowLayout maxWidth="max-w-md">
        <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-6 text-center">
          <h1 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-1">Join Hue Match</h1>
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
          <h1 style={fredokaStyle} className="text-3xl font-bold text-[#2D1810] mb-4">Hue Match</h1>
          <LobbyInvite gamePath="hue-match" roomCode={code} gameName="Hue Match" playerCount={connectedCount} minPlayers={3} />
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
              One of you secretly gets a color and gives a <strong>one-word</strong> cue.
              Everyone taps where they think it is. Then a <strong>two-word</strong> cue and a
              second guess. Closer is worth more.
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
          <PlayAgain players={players} hostId={state.hostId} isHost={isHost}
            onPlayAgain={playAgain} onLeave={leaveGame} backTo="/hue-match" />
        </div>
      </MeadowLayout>
    );
  }

  /* ── Reveal ────────────────────────────────────────────────────────────── */
  if (phase === 'reveal') {
    const last = state.lastTurn || {};
    const shown = [];
    for (const [id, b] of Object.entries(last.breakdown || {})) {
      if (b.a) shown.push({ ...b.a, name: `${nameById(id)} · cue 1` });
      if (b.b) shown.push({ ...b.b, name: `${nameById(id)} · cue 2` });
    }
    return (
      <MeadowLayout maxWidth="max-w-lg">
        <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-5 text-center">
          <p className="text-sm font-semibold text-[#8B6347]">Round {state.turnNumber} of {state.totalTurns}</p>
          <p className="text-base font-semibold text-[#8B6347] mt-1">The color was</p>
          <div className="mx-auto my-2 h-14 w-24 rounded-xl" style={{ background: last.targetHex, boxShadow: `inset 0 0 0 3px ${INK}` }} />
          <p style={fredokaStyle} className="text-2xl font-bold text-[#2D1810]">{last.targetLabel}</p>
          <p className="text-[#4A2D1B] mt-1">
            {nameById(last.giverId)} said “<strong>{last.cue1}</strong>”, then “<strong>{last.cue2}</strong>” — and scored {last.giverPoints}.
          </p>

          <div className="mt-4">
            <HueBoard value={null} disabled target={last.target} markers={shown} showRings onPick={() => {}} />
          </div>

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

  /* ── Cue and guess phases ──────────────────────────────────────────────── */
  const wantWords = phase === 'clue1' ? 1 : 2;
  const typedWords = cue.trim() ? cue.trim().split(/\s+/).length : 0;
  const lockedCount = (turn?.lockedIds || []).length;
  const guesserCount = players.filter((p) => p.connected && p.id !== turn?.giverId).length;

  return (
    <MeadowLayout maxWidth="max-w-lg">
      <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-semibold text-[#8B6347]">Round {state.turnNumber} of {state.totalTurns}</span>
          {guessing && (
            <span className="font-mono font-bold text-lg" style={{ color: secondsLeft <= 10 ? '#B03A30' : '#2D6E45' }}>{secondsLeft}s</span>
          )}
        </div>
        <p className="text-base font-semibold text-[#2D1810] mb-3">
          {isGiver ? 'You are giving the cues' : `${nameById(turn?.giverId)} is giving the cues`}
        </p>

        {/*
          The giver's secret color, laid out sideways rather than stacked.

          Stacked it was ~120px tall and pushed the cue box past the middle of a
          390x844 phone — the one thing this player is here to do, below the
          fold on the screen that asks them to do it.
        */}
        {isGiver && turn?.targetHex && (
          <div className="mb-3 flex items-center gap-3 rounded-2xl border-2 px-3 py-2" style={{ background: '#EAF6EE', borderColor: GREEN }}>
            <div className="h-9 w-14 shrink-0 rounded-lg" style={{ background: turn.targetHex, boxShadow: `inset 0 0 0 3px ${INK}` }} />
            <p className="text-base font-semibold text-[#2D6E45]">Your color — it is marked on the board too</p>
          </div>
        )}

        {/* The cues so far, visible to everyone */}
        {(turn?.cue1 || turn?.cue2) && (
          <div className="mb-3 flex flex-wrap justify-center gap-2">
            {turn.cue1 && <span className="rounded-full bg-[#FFF6E9] px-4 py-1.5 text-lg font-bold text-[#2D1810]">{turn.cue1}</span>}
            {turn.cue2 && <span className="rounded-full bg-[#FFF6E9] px-4 py-1.5 text-lg font-bold text-[#2D1810]">{turn.cue2}</span>}
          </div>
        )}

        <HueBoard
          value={myMarker}
          disabled={!guessing || isGiver || iLocked}
          target={isGiver && turn?.target ? turn.target : null}
          onPick={(col, row) => send('place', { col, row })}
        />

        {/* ── The giver types a cue ─────────────────────────────────────── */}
        {cueing && isGiver && (
          <form
            className="mt-4"
            onSubmit={(e) => { e.preventDefault(); if (cue.trim() && send('cue', { text: cue.trim() })) setCue(''); }}
          >
            <input value={cue} onChange={(e) => setCue(e.target.value)} maxLength={40} autoComplete="off"
              placeholder={wantWords === 1 ? 'One word…' : 'Two words…'}
              className="w-full px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#3D8B5A] outline-none text-[#2D1810] bg-[#FFFDF8]" />
            {/*
              The rule is visible before it refuses you — but "you have 0" on an
              empty box is the game telling someone off for not having started.
              The count only appears once there is something to count.
            */}
            <p className="mt-1 text-sm font-semibold" style={{ color: typedWords === wantWords ? '#2D6E45' : '#8B6347' }}>
              {wantWords === 1 ? 'One word' : 'Two words'}
              {typedWords > 0 && typedWords !== wantWords ? ` — you have ${typedWords}` : ''}
              . No color names, no board positions.
            </p>
            {turn?.rejected && (
              <p className="mt-1 text-base font-bold" style={{ color: '#B03A30' }}>{turn.rejected.message}</p>
            )}
            <button type="submit" disabled={typedWords !== wantWords} style={{ background: PINK, fontFamily: 'Fredoka, sans-serif' }}
              className="mt-2 w-full py-3 rounded-xl text-white font-bold disabled:opacity-40">Send cue</button>
            {/* Stuck for a word is a real thing to be, and holding the room
                hostage while you think of one is not the alternative anyone
                wants. Caveman Clues has the same escape for the same reason. */}
            <button type="button" onClick={() => send('move_on', {})}
              className="mt-2 w-full text-base text-[#8B6347] hover:text-[#2D1810]">
              I can’t think of one — skip this round
            </button>
          </form>
        )}

        {cueing && !isGiver && (
          <div className="mt-4 text-center">
            <p className="text-[#6B4226]">
              Waiting for {nameById(turn?.giverId)} to give {phase === 'clue1' ? 'a one-word' : 'a two-word'} cue…
            </p>
            {/*
              The way out. Every phase here waits on one named person, so every
              phase needs a control that does not belong to them — otherwise a
              giver who shuts their laptop ends the game for everybody, with no
              button anywhere on the screen that can help.
            */}
            {canMoveOn && (
              <button type="button" onClick={() => send('move_on', {})}
                className="mt-3 w-full rounded-xl border-2 py-2.5 font-bold"
                style={{ borderColor: AMBER, color: '#6B4226' }}>
                {giverGone ? `${nameById(turn?.giverId)} has dropped — skip this round` : 'Skip this round'}
              </button>
            )}
          </div>
        )}

        {/* ── Guessers place and lock ───────────────────────────────────── */}
        {guessing && !isGiver && (
          <div className="mt-4">
            {myMarker ? (
              <p className="text-center text-base text-[#6B4226]">
                You picked <strong>{labelOf(myMarker.col, myMarker.row)}</strong>
                <span className="ml-2 inline-block h-4 w-4 translate-y-[3px] rounded-[3px]"
                  style={{ background: colourAt(myMarker.col, myMarker.row), boxShadow: `inset 0 0 0 2px ${INK}` }} />
                {!iLocked && ' — tap again to move it.'}
              </p>
            ) : (
              <p className="text-center text-base text-[#6B4226]">Tap the color you think it is.</p>
            )}
            <button
              type="button"
              onClick={() => send('lock', {})}
              disabled={!myMarker || iLocked}
              style={{ background: GREEN, fontFamily: 'Fredoka, sans-serif' }}
              className="mt-2 w-full py-3 rounded-xl text-white font-bold disabled:opacity-40"
            >
              {iLocked ? 'Locked in' : 'Lock it in'}
            </button>
          </div>
        )}

        {guessing && isGiver && (
          <p className="mt-4 text-center text-[#6B4226]">Everyone is guessing. No hints!</p>
        )}

        {guessing && (
          <p className="mt-2 text-center text-sm text-[#8B6347]">
            {lockedCount} of {guesserCount} locked in
          </p>
        )}

        {/*
          Somebody who never taps the board at all is invisible to the auto-lock
          — that only fires for a player who has PLACED something — so before
          this button existed they held the room open for as long as their tab
          stayed open, and nobody could pass them.
        */}
        {guessing && canMoveOn && (
          <button type="button" onClick={() => send('move_on', {})}
            className="mt-2 w-full rounded-xl border-2 py-2.5 font-bold"
            style={{ borderColor: AMBER, color: '#6B4226' }}>
            Time’s up — move on without them
          </button>
        )}

        <Scores players={players} scores={state.scores} myId={myId} />
        <button onClick={leaveGame} className="mt-3 block mx-auto text-base text-[#8B6347]">Leave room</button>
      </div>
    </MeadowLayout>
  );
}
