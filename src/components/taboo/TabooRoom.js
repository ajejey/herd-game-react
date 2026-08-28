import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Confetti from 'react-confetti';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import LobbyInvite from '../common/LobbyInvite';
import { useTaboo } from '../../hooks/useTaboo';
import PlayAgain from '../common/PlayAgain';

const PINK = '#E84A8B';
const GREEN = '#3D8B5A';
const BLUE = '#4A90D9';
const RED = '#D0463B';

/*
  Design note — the giver's screen is the whole problem here. They are talking
  fast, against a clock, glancing at a phone. So: the target word is oversized
  and alone at the top of a card, and the five forbidden words sit directly
  beneath it in red, laid out like the physical Taboo card people already
  recognise. Nothing else competes for attention.

  The opposing team gets that same card plus a full-width BUZZ button, because
  in real Taboo the other team holds the card — that is the only way catching a
  slip is possible. Show them the button without the card and the buzz is a
  guess, which is exactly the complaint we got. The giver's own team never sees
  it: they are guessing, and the card is the answer.
*/

/* The physical Taboo card: target word on top, forbidden words below in red.
   The giver performs from it, the opposing team scans it for slips — same
   object, two jobs, so they share a layout and the watcher's is just tighter
   to leave room for the buzz button on a phone. */
function TabooCard({ card, compact = false }) {
  if (!card) return null;
  return (
    // The testid is what the role-visibility matrix asserts on: exactly which
    // seats this card reaches is the one thing about Taboo a smoke test can
    // never check, and it shipped wrong once already.
    <div data-testid="taboo-card" className={`rounded-3xl border-4 border-[#2D1810] overflow-hidden mx-auto shadow-[0_14px_30px_-14px_rgba(45,24,16,0.5)] ${compact ? 'max-w-xs' : 'max-w-sm'}`}>
      <div className={`bg-[#2D1810] px-3 ${compact ? 'py-2.5' : 'py-4'}`}>
        <p data-testid="taboo-word" style={fredokaStyle} className={`font-bold text-white leading-tight break-words ${compact ? 'text-xl' : 'text-3xl md:text-4xl'}`}>{card.word}</p>
      </div>
      <div className={`bg-[#FFF8EE] px-3 ${compact ? 'py-2' : 'py-3'}`}>
        <p className="text-sm font-bold tracking-widest uppercase mb-1.5" style={{ color: RED }}>Don’t say</p>
        <ul className={compact ? 'space-y-0.5' : 'space-y-1'}>
          {(card.forbidden || []).map((f, i) => (
            <li key={i} style={fredokaStyle} className={`font-bold leading-tight ${compact ? 'text-base' : 'text-lg'}`}>
              <span style={{ color: RED }}>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function TabooRoom() {
  const { roomCode: codeParam } = useParams();
  const game = useTaboo();
  const { connected, state, myId, error, kicked, roomNotFound, isHost, joinGame, startGame, sendAction, playAgain, leaveGame } = game;
  const [name, setName] = useState('');
  const [now, setNow] = useState(Date.now());
  const [win, setWin] = useState({ w: 1024, h: 768 });
  const [buzzFlash, setBuzzFlash] = useState(false);

  useEffect(() => {
    const on = () => setWin({ w: window.innerWidth, h: window.innerHeight });
    on(); window.addEventListener('resize', on);
    const t = setInterval(() => setNow(Date.now()), 400);
    return () => { window.removeEventListener('resize', on); clearInterval(t); };
  }, []);

  const turn = state?.turn;
  const secondsLeft = turn?.deadline ? Math.max(0, Math.ceil((turn.deadline - now) / 1000)) : null;
  const amGiver = turn && turn.giverId === myId;
  const code = state?.roomCode || codeParam;

  // Giver auto-ends the turn when the clock runs out (no server timers).
  useEffect(() => {
    if (amGiver && secondsLeft === 0) sendAction('end_turn');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, amGiver]);

  // Flash the screen when a buzz lands, so everyone feels it.
  const buzzed = turn?.buzzed ?? 0;
  useEffect(() => {
    if (buzzed > 0) { setBuzzFlash(true); const t = setTimeout(() => setBuzzFlash(false), 600); return () => clearTimeout(t); }
  }, [buzzed]);

  if (kicked) {
    return <MeadowLayout maxWidth="max-w-md"><div className="text-center bg-white rounded-3xl border-4 border-[#FFE8C8] p-8">
      <h1 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810]">{error || 'You left the room.'}</h1>
      <Link to="/taboo" className="text-[#E84A8B] font-semibold underline mt-3 inline-block">Back to Taboo</Link>
    </div></MeadowLayout>;
  }

  if (!state) {
    return (
      <MeadowLayout maxWidth="max-w-md">
        <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-6 text-center">
          <h1 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-1">Join Taboo</h1>
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
  const nameById = (id) => players.find((p) => p.id === id)?.username || '—';

  // ── Lobby ──
  if (state.status === 'lobby') {
    return (
      <MeadowLayout maxWidth="max-w-lg">
        <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-6 text-center">
          <h1 style={fredokaStyle} className="text-3xl font-bold text-[#2D1810] mb-4">Taboo 🚫</h1>

          <LobbyInvite gamePath="taboo" roomCode={code} gameName="Taboo"
            playerCount={connectedCount} minPlayers={3} />

          <div className="mt-5 text-left">
            <p className="text-base font-semibold text-[#8B6347] mb-1">Players ({connectedCount})</p>
            <div className="flex flex-wrap gap-2">
              {players.map((p) => (
                <span key={p.id} className={`px-3 py-1 rounded-full text-base font-semibold ${p.connected ? 'bg-[#FFE8C8] text-[#2D1810]' : 'bg-gray-100 text-gray-400'}`}>{p.username}{p.isHost ? ' 👑' : ''}</span>
              ))}
            </div>
          </div>
          {error && <p className="text-red-600 text-base mt-3">{error}</p>}
          {isHost ? (
            <>
              <p className="text-sm text-[#8B6347] mt-3">
                {connectedCount < 3 ? 'You need 3 players to start.'
                  : connectedCount === 3 ? 'With 3 you’ll play co-op — one shared score, no buzzing. Add a 4th for two teams.'
                    : 'You’ll be split into two teams — each team sees the other’s card and can buzz them.'}
              </p>
              <button onClick={startGame} disabled={connectedCount < 3} style={{ background: GREEN, fontFamily: 'Fredoka, sans-serif' }}
                className="mt-2 w-full py-3 rounded-xl text-white font-bold text-lg disabled:opacity-40">Start game 🚫</button>
            </>
          ) : <p className="text-[#4A2D1B] mt-4">Waiting for the host to start…</p>}
          <button onClick={leaveGame} className="mt-3 text-base text-[#8B6347] hover:text-[#2D1810]">Leave room</button>
        </div>
      </MeadowLayout>
    );
  }

  const finished = state.status === 'finished';
  const scores = state.teamScores || { A: 0, B: 0 };
  const myTeam = state.teams?.A?.includes(myId) ? 'A' : state.teams?.B?.includes(myId) ? 'B' : null;
  const iWon = finished && (state.coop || state.winner === myTeam);
  const onGiversTeam = myTeam && myTeam === state.currentTeam;
  // Only the opposing team can buzz — they're the ones holding the card. Co-op
  // has no opposing team (everyone else is guessing), so there's nobody to police.
  const canBuzz = !!turn && !amGiver && !state.coop && !!myTeam && !onGiversTeam;

  const TeamPill = ({ team, color }) => (
    <div className="flex-1 rounded-2xl p-3 text-center text-white" style={{ background: color, opacity: state.currentTeam === team && !finished ? 1 : 0.7 }}>
      <div className="text-sm font-semibold">Team {team}{state.currentTeam === team && !finished ? ' • now' : ''}</div>
      <div style={fredokaStyle} className="text-3xl font-bold leading-none">{scores[team]}</div>
      <div className="text-[13px] mt-1 opacity-90">{state.teams?.[team]?.map(nameById).join(', ')}</div>
    </div>
  );

  return (
    <MeadowLayout maxWidth="max-w-xl">
      {iWon && <Confetti width={win.w} height={win.h} numberOfPieces={180} recycle={false} gravity={0.25} />}
      <div className={`bg-white rounded-3xl border-4 p-5 md:p-7 transition-colors ${buzzFlash ? 'border-[#D0463B]' : 'border-[#FFE8C8]'}`}>
        <div className="flex justify-between items-center text-base text-[#8B6347] mb-3">
          <span>Round {Math.min(state.turnsTaken?.[state.currentTeam] + 1 || 1, state.totalRounds)} / {state.totalRounds}</span>
          <span className="font-semibold">{state.coop ? 'Co-op' : `Team ${state.currentTeam}’s turn`}</span>
        </div>

        {/* Score */}
        {state.coop ? (
          <div className="rounded-2xl p-4 mb-5 text-center text-white" style={{ background: BLUE }}>
            <div className="text-sm font-semibold">Team score</div>
            <div style={fredokaStyle} className="text-4xl font-bold leading-none">{scores.A}</div>
          </div>
        ) : (
          <div className="flex gap-3 mb-5">
            <TeamPill team="A" color={BLUE} />
            <TeamPill team="B" color={PINK} />
          </div>
        )}

        {finished ? (
          <div className="text-center">
            <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810]">
              {state.coop ? `🎉 You got ${scores.A} together!` : state.winner ? `🏆 Team ${state.winner} wins!` : "It’s a tie! 🤝"}
            </h2>
            {!state.coop && <p className="text-[#4A2D1B] mt-1">Team A {scores.A} — {scores.B} Team B</p>}
            <PlayAgain players={players} hostId={state.hostId} isHost={isHost}
                  onPlayAgain={playAgain} onLeave={leaveGame} backTo="/taboo" />
          </div>
        ) : turn ? (
          amGiver ? (
            /* ── THE GIVER: the card. Target word huge, forbidden words red. ── */
            <div className="text-center">
              <div className={`inline-block px-4 py-1 rounded-full font-bold mb-3 ${secondsLeft <= 10 ? 'bg-[#FFE1E1] text-[#D0463B]' : 'bg-[#FFF0F5] text-[#E84A8B]'}`}>⏱ {secondsLeft}s</div>

              <TabooCard card={state.card} />

              <div className="flex gap-2 justify-center mt-4">
                <button onClick={() => sendAction('got_word')} style={{ background: GREEN, fontFamily: 'Fredoka, sans-serif' }}
                  className="flex-1 max-w-[180px] px-6 py-4 rounded-2xl text-white font-bold text-lg">Got it! ✓</button>
                <button onClick={() => sendAction('skip_word')}
                  className="px-5 py-4 rounded-2xl border-2 border-[#FFE8C8] text-[#2D1810] font-semibold">Skip</button>
              </div>
              <button onClick={() => sendAction('end_turn')} className="mt-3 text-base text-[#8B6347] underline">End turn</button>
              <p className="text-sm text-[#8B6347] mt-2">✓ {turn.got} · skipped {turn.skipped} · buzzed {turn.buzzed}</p>
            </div>
          ) : (
            /* ── EVERYONE ELSE: guess, or catch them out. ── */
            <div className="text-center py-2">
              <p style={fredokaStyle} className="text-xl font-bold text-[#2D1810]">{nameById(turn.giverId)} is describing…</p>
              <p className="text-[#8B6347] mt-1">⏱ {secondsLeft}s · ✓ {turn.got} so far</p>

              {canBuzz ? (
                <>
                  {/* You hold their card — that is what makes the buzz real. */}
                  <p className="text-base text-[#4A2D1B] mt-4 mb-2">Their card is below. Hear a forbidden word? Catch them out.</p>
                  <TabooCard card={state.card} compact />
                  <button onClick={() => sendAction('buzz')} style={{ background: RED, fontFamily: 'Fredoka, sans-serif' }}
                    className="w-full max-w-sm mx-auto mt-4 py-5 rounded-2xl text-white font-bold text-2xl shadow-[0_10px_24px_-10px_rgba(208,70,59,0.9)] active:scale-95 transition-transform">
                    BUZZ! 🚫
                  </button>
                  <p className="text-sm text-[#8B6347] mt-2">−1 point to their team</p>
                </>
              ) : (
                <p className="text-[#4A2D1B] mt-4">Shout your guesses! 📣</p>
              )}
            </div>
          )
        ) : (
          <div className="text-center py-4">
            {myId === state.currentGiverId ? (
              <>
                {/* h2, not p: this is the screen's title. Every other game
                    titles its in-game phase; Taboo did not, so a screen reader
                    announced nothing and there was no orienting heading. */}
                <h2 style={fredokaStyle} className="text-xl font-bold text-[#2D1810]">You’re describing{state.coop ? '!' : `, Team ${state.currentTeam}!`}</h2>
                <p className="text-[#4A2D1B] mt-1 mb-4">Get your team to say the word — without saying any of the forbidden ones.</p>
                <button onClick={() => sendAction('start_turn')} style={{ background: PINK, fontFamily: 'Fredoka, sans-serif' }}
                  className="px-8 py-3 rounded-2xl text-white font-bold text-lg">Start my turn →</button>
              </>
            ) : (
              <>
                <h2 style={fredokaStyle} className="text-xl font-bold text-[#2D1810] mb-1">
                  {nameById(state.currentGiverId)} is up
                </h2>
                <p className="text-[#4A2D1B]">Waiting for <strong>{nameById(state.currentGiverId)}</strong> to start their turn…</p>
                {state.lastTurn && <p className="text-[#8B6347] text-base mt-2">Last turn: {nameById(state.lastTurn.giverId)} got {state.lastTurn.got}{state.lastTurn.buzzed ? `, buzzed ${state.lastTurn.buzzed}×` : ''}.</p>}
              </>
            )}
          </div>
        )}
      </div>

      <p className="text-center mt-4"><Link to="/office-games" className="text-[#8B6347] text-base hover:text-[#2D1810] underline">More party &amp; team games</Link></p>
    </MeadowLayout>
  );
}
