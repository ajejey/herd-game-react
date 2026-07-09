import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Confetti from 'react-confetti';
import { FiShare2, FiCheck } from 'react-icons/fi';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import { useFishbowl } from '../../hooks/useFishbowl';

const PINK = '#E84A8B';
const GREEN = '#3D8B5A';
const BLUE = '#4A90D9';

export default function FishbowlRoom() {
  const { roomCode: codeParam } = useParams();
  const game = useFishbowl();
  const { connected, state, myId, error, kicked, roomNotFound, isHost, joinGame, startGame, sendAction, leaveGame } = game;
  const [name, setName] = useState('');
  const [words, setWords] = useState([]);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [win, setWin] = useState({ w: 1024, h: 768 });
  const submittedRef = useRef(false);
  const endedRef = useRef(false);

  useEffect(() => {
    const on = () => setWin({ w: window.innerWidth, h: window.innerHeight });
    on(); window.addEventListener('resize', on);
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => { window.removeEventListener('resize', on); clearInterval(t); };
  }, []);

  const phase = state?.phase;
  const turn = state?.turn;

  useEffect(() => {
    if (phase === 'submitting') { setWords(Array(state.wordsPerPlayer || 3).fill('')); submittedRef.current = !!state.yourWords; }
  }, [phase, state?.wordsPerPlayer, state?.yourWords]);

  // Reset the "already ended" guard each new turn.
  useEffect(() => { endedRef.current = false; }, [turn?.giverId, turn?.deadline]);

  const secondsLeft = turn?.deadline ? Math.max(0, Math.ceil((turn.deadline - now) / 1000)) : null;
  const amGiver = turn && turn.giverId === myId;

  // Giver auto-ends the turn when the timer runs out.
  useEffect(() => {
    if (amGiver && secondsLeft === 0 && !endedRef.current) { endedRef.current = true; sendAction('end_turn'); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, amGiver]);

  const code = state?.roomCode || codeParam;

  async function shareInvite() {
    const url = `https://herdgamesonline.com/fishbowl/room/${code}`;
    try {
      if (navigator.share) { await navigator.share({ title: 'Fishbowl', text: `Join my Fishbowl game! ${url} (code ${code})`, url }); return; }
      await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch { /* dismissed */ }
  }

  if (kicked) {
    return <MeadowLayout maxWidth="max-w-md"><div className="text-center bg-white rounded-3xl border-4 border-[#FFE8C8] p-8">
      <h1 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810]">{error || 'You left the room.'}</h1>
      <Link to="/fishbowl" className="text-[#E84A8B] font-semibold underline mt-3 inline-block">Back to Fishbowl</Link>
    </div></MeadowLayout>;
  }

  if (!state) {
    return (
      <MeadowLayout maxWidth="max-w-md">
        <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-6 text-center">
          <h1 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-1">Join Fishbowl</h1>
          <p className="text-[#4A2D1B] mb-4">Room <span className="font-mono font-bold">{codeParam}</span></p>
          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
          {roomNotFound && <p className="text-[#8B6347] text-sm mb-2">That room wasn’t found — check the code.</p>}
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
          <h1 style={fredokaStyle} className="text-3xl font-bold text-[#2D1810]">Fishbowl 🎣</h1>
          <p className="text-[#4A2D1B] mt-1">Room code</p>
          <p style={fredokaStyle} className="text-4xl font-bold tracking-[0.3em] text-[#E84A8B] my-2">{code}</p>
          <button onClick={shareInvite} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D1810] text-white font-semibold">
            {copied ? <><FiCheck /> Copied!</> : <><FiShare2 /> Copy invite link</>}
          </button>
          <div className="mt-5 text-left">
            <p className="text-sm font-semibold text-[#8B6347] mb-1">Players ({connectedCount})</p>
            <div className="flex flex-wrap gap-2">
              {players.map((p) => (
                <span key={p.id} className={`px-3 py-1 rounded-full text-sm font-semibold ${p.connected ? 'bg-[#FFE8C8] text-[#2D1810]' : 'bg-gray-100 text-gray-400'}`}>{p.username}{p.isHost ? ' 👑' : ''}</span>
              ))}
            </div>
          </div>
          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
          {isHost ? (
            <>
              {connectedCount < 4 && <p className="text-sm text-[#8B6347] mt-4">Need at least 4 players (two teams) — share the code above.</p>}
              <button onClick={startGame} disabled={connectedCount < 4} style={{ background: GREEN, fontFamily: 'Fredoka, sans-serif' }}
                className="mt-3 w-full py-3 rounded-xl text-white font-bold text-lg disabled:opacity-50">Start game 🎣</button>
            </>
          ) : <p className="text-[#4A2D1B] mt-4">Waiting for the host to start…</p>}
          <button onClick={leaveGame} className="mt-3 text-sm text-[#8B6347] hover:text-[#2D1810]">Leave room</button>
        </div>
      </MeadowLayout>
    );
  }

  // ── Submitting words ──
  if (phase === 'submitting') {
    const submitted = !!state.yourWords;
    return (
      <MeadowLayout maxWidth="max-w-md">
        <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-6">
          <h1 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] text-center mb-1">Fill the bowl 🎣</h1>
          <p className="text-[#8B6347] text-sm text-center mb-4">Add {state.wordsPerPlayer} words, names or phrases — anything goes. Others won’t see them until they come up.</p>
          {submitted ? (
            <div className="text-center">
              <p className="text-[#3D8B5A] font-semibold">Added! Waiting for others… ({state.submittedIds?.length || 0}/{connectedCount})</p>
              <div className="mt-3 space-y-1">
                {state.yourWords.map((w, i) => <div key={i} className="px-3 py-1.5 rounded-lg bg-[#FFF6E9] text-[#2D1810] font-semibold text-sm">{w}</div>)}
              </div>
              {isHost && <button onClick={() => sendAction('force_begin')} className="mt-4 text-sm text-[#8B6347] underline">Start rounds now →</button>}
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); const clean = words.map((w) => w.trim()).filter(Boolean); if (clean.length) { submittedRef.current = true; sendAction('submit_words', { words: clean }); } }} className="space-y-2">
              {words.map((w, i) => (
                <input key={i} value={w} onChange={(e) => setWords((a) => { const n = [...a]; n[i] = e.target.value; return n; })} maxLength={40}
                  placeholder={`Word ${i + 1}`} className="w-full px-4 py-2.5 rounded-xl border-2 border-[#FFE8C8] focus:border-[#3D8B5A] outline-none text-[#2D1810] bg-[#FFFDF8]" />
              ))}
              <button type="submit" style={{ background: PINK, fontFamily: 'Fredoka, sans-serif' }} className="w-full py-3 rounded-xl text-white font-bold mt-2">Add to bowl</button>
            </form>
          )}
        </div>
      </MeadowLayout>
    );
  }

  // ── Playing / finished ──
  const finished = state.status === 'finished';
  const scores = state.teamScores || { A: 0, B: 0 };
  const currentGiverId = state.currentGiverId;
  const myTeam = state.teams?.A?.includes(myId) ? 'A' : state.teams?.B?.includes(myId) ? 'B' : null;
  const iWon = finished && state.winner === myTeam;

  const TeamPill = ({ team, color }) => (
    <div className="flex-1 rounded-2xl p-3 text-center text-white" style={{ background: color, opacity: state.currentTeam === team && !finished ? 1 : 0.75 }}>
      <div className="text-xs font-semibold">Team {team}{state.currentTeam === team && !finished ? ' • now' : ''}</div>
      <div style={fredokaStyle} className="text-3xl font-bold leading-none">{scores[team]}</div>
      <div className="text-[11px] mt-1 opacity-90">{state.teams?.[team]?.map(nameById).join(', ')}</div>
    </div>
  );

  return (
    <MeadowLayout maxWidth="max-w-xl">
      {iWon && <Confetti width={win.w} height={win.h} numberOfPieces={180} recycle={false} gravity={0.25} />}
      <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-5 md:p-7">
        <div className="flex justify-between items-center text-sm text-[#8B6347] mb-3">
          <span>Round {state.roundType} / 3</span>
          <span className="font-semibold">{state.roundName}</span>
        </div>

        <div className="flex gap-3 mb-5">
          <TeamPill team="A" color={BLUE} />
          <TeamPill team="B" color={PINK} />
        </div>

        {finished ? (
          <div className="text-center">
            <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810]">
              {state.winner ? `🏆 Team ${state.winner} wins!` : "It's a tie! 🤝"}
            </h2>
            <p className="text-[#4A2D1B] mt-1">Team A {scores.A} — {scores.B} Team B</p>
            <Link to="/fishbowl" onClick={leaveGame} style={{ background: GREEN, fontFamily: 'Fredoka, sans-serif' }}
              className="mt-4 inline-block px-6 py-3 rounded-2xl text-white font-bold">New game</Link>
          </div>
        ) : turn ? (
          amGiver ? (
            <div className="text-center">
              <div className={`inline-block px-4 py-1 rounded-full font-bold mb-3 ${secondsLeft <= 10 ? 'bg-[#FFE1E1] text-[#D0463B]' : 'bg-[#FFF0F5] text-[#E84A8B]'}`}>⏱ {secondsLeft}s</div>
              <p className="text-[#8B6347] text-sm">Your word</p>
              <div style={fredokaStyle} className="text-3xl md:text-4xl font-bold text-[#2D1810] my-2 leading-tight">{state.currentWord || '—'}</div>
              <p className="text-[#8B6347] text-sm mb-4">{state.roundName} · {state.wordsLeft} left</p>
              <div className="flex gap-2 justify-center">
                <button onClick={() => sendAction('got_word')} style={{ background: GREEN, fontFamily: 'Fredoka, sans-serif' }} className="px-7 py-3 rounded-2xl text-white font-bold">Got it! ✓</button>
                <button onClick={() => sendAction('skip_word')} className="px-5 py-3 rounded-2xl border-2 border-[#FFE8C8] text-[#2D1810] font-semibold">Skip</button>
              </div>
              <button onClick={() => sendAction('end_turn')} className="mt-3 text-sm text-[#8B6347] underline block mx-auto">End turn</button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p style={fredokaStyle} className="text-xl font-bold text-[#2D1810]">{nameById(turn.giverId)} is up!</p>
              <p className="text-[#4A2D1B] mt-1">Team {state.currentTeam} — <strong>{state.roundName.toLowerCase()}</strong>.</p>
              <p className="text-[#8B6347] mt-2">Watch the call and shout your guesses! ⏱ {secondsLeft}s · {turn.gotCount} guessed</p>
            </div>
          )
        ) : (
          <div className="text-center py-4">
            {myId === currentGiverId ? (
              <>
                <p style={fredokaStyle} className="text-xl font-bold text-[#2D1810]">You’re up, Team {state.currentTeam}!</p>
                <p className="text-[#4A2D1B] mt-1 mb-4">Round: <strong>{state.roundName}</strong>. Get your team to guess as many as you can before the timer ends.</p>
                <button onClick={() => sendAction('start_turn')} style={{ background: PINK, fontFamily: 'Fredoka, sans-serif' }} className="px-8 py-3 rounded-2xl text-white font-bold text-lg">Start my turn →</button>
              </>
            ) : (
              <>
                <p className="text-[#4A2D1B]">Waiting for <strong>{nameById(currentGiverId)}</strong> (Team {state.currentTeam}) to start their turn…</p>
                {state.lastTurn && <p className="text-[#8B6347] text-sm mt-2">Last turn: {nameById(state.lastTurn.giverId)} got {state.lastTurn.got}.</p>}
              </>
            )}
          </div>
        )}
      </div>

      <p className="text-center mt-4"><Link to="/office-games" className="text-[#8B6347] text-sm hover:text-[#2D1810] underline">More party &amp; team games</Link></p>
    </MeadowLayout>
  );
}
