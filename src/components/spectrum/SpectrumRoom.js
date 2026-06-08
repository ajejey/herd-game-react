import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Confetti from 'react-confetti';
import { FiShare2, FiCheck } from 'react-icons/fi';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import { useSpectrum } from '../../hooks/useSpectrum';

const PINK = '#E84A8B';
const GREEN = '#3D8B5A';

function Bar({ leftLabel, rightLabel, target, guesses = [], myValue, showMy }) {
  return (
    <div>
      <div className="flex justify-between text-sm font-bold text-[#2D1810] mb-1">
        <span>{leftLabel}</span><span>{rightLabel}</span>
      </div>
      <div className="relative h-12 rounded-full overflow-visible"
        style={{ background: 'linear-gradient(90deg,#4A90D9,#FFF1DC,#E84A8B)' }}>
        {target != null && (
          <div className="absolute top-[-6px] bottom-[-6px] w-1.5 rounded-full bg-[#2D1810]" style={{ left: `${target}%`, transform: 'translateX(-50%)' }} />
        )}
        {showMy && myValue != null && (
          <div className="absolute -top-2 -bottom-2 w-1 rounded-full bg-[#3D8B5A]" style={{ left: `${myValue}%`, transform: 'translateX(-50%)' }} />
        )}
        {guesses.map((g, i) => (
          <div key={i} className="absolute -top-7 text-[10px] font-semibold text-[#2D1810] whitespace-nowrap"
            style={{ left: `${g.value}%`, transform: 'translateX(-50%)' }}>
            <span className="bg-white/90 px-1 rounded">{g.username || ''}{g.points != null ? ` +${g.points}` : ''}</span>
            <div className="w-0.5 h-4 bg-[#2D1810] mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Leaderboard({ players, myId }) {
  const sorted = [...players].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  return (
    <div className="mt-4 space-y-1.5 max-w-sm mx-auto text-left">
      {sorted.map((p, i) => (
        <div key={p.id} className={`flex items-center justify-between px-3 py-2 rounded-xl ${p.id === myId ? 'bg-[#FFE8C8]' : 'bg-[#FFF6E9]'}`}>
          <span className="font-semibold text-[#2D1810]">{i + 1}. {p.username}{p.id === myId ? ' (you)' : ''}{!p.connected ? ' ⚪' : ''}</span>
          <span className="font-bold text-[#3D8B5A]">{p.score ?? 0}</span>
        </div>
      ))}
    </div>
  );
}

export default function SpectrumRoom() {
  const { roomCode: codeParam } = useParams();
  const game = useSpectrum();
  const { connected, state, myId, error, kicked, roomNotFound, isHost, joinGame, startGame, sendAction, leaveGame } = game;
  const [name, setName] = useState('');
  const [clue, setClue] = useState('');
  const [guess, setGuess] = useState(50);
  const [copied, setCopied] = useState(false);
  const [win, setWin] = useState({ w: 1024, h: 768 });

  useEffect(() => {
    const on = () => setWin({ w: window.innerWidth, h: window.innerHeight });
    on(); window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);

  const code = state?.roomCode || codeParam;

  async function shareInvite() {
    const url = `https://herdgamesonline.com/spectrum/room/${code}`;
    try {
      if (navigator.share) { await navigator.share({ title: 'Spectrum', text: `Join my Spectrum game! ${url} (code ${code})`, url }); return; }
      await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch { /* dismissed */ }
  }

  if (kicked) {
    return <MeadowLayout maxWidth="max-w-md"><div className="text-center bg-white rounded-3xl border-4 border-[#FFE8C8] p-8">
      <h1 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810]">{error || 'You left the room.'}</h1>
      <Link to="/spectrum" className="text-[#E84A8B] font-semibold underline mt-3 inline-block">Back to Spectrum</Link>
    </div></MeadowLayout>;
  }

  if (!state) {
    return (
      <MeadowLayout maxWidth="max-w-md">
        <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-6 text-center">
          <h1 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-1">Join Spectrum</h1>
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
  const round = state.round;

  if (state.status === 'lobby') {
    return (
      <MeadowLayout maxWidth="max-w-lg">
        <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-6 text-center">
          <h1 style={fredokaStyle} className="text-3xl font-bold text-[#2D1810]">Spectrum 🎯</h1>
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
              {connectedCount < 3 && <p className="text-sm text-[#8B6347] mt-4">Need at least 3 players — share the code above.</p>}
              <button onClick={startGame} disabled={connectedCount < 3} style={{ background: GREEN, fontFamily: 'Fredoka, sans-serif' }}
                className="mt-3 w-full py-3 rounded-xl text-white font-bold text-lg disabled:opacity-50">Start game 🎯</button>
            </>
          ) : <p className="text-[#4A2D1B] mt-4">Waiting for the host to start…</p>}
          <button onClick={leaveGame} className="mt-3 text-sm text-[#8B6347] hover:text-[#2D1810]">Leave room</button>
        </div>
      </MeadowLayout>
    );
  }

  const phase = state.phase;
  const amGiver = round?.youAreClueGiver;
  const giverName = players.find((p) => p.id === round?.clueGiverId)?.username;
  const myGuessed = round?.guesses?.find((g) => g.playerId === myId);
  const finished = state.status === 'finished';
  const iWon = finished && state.winner?.id === myId;
  const resultGuesses = phase === 'result' ? round.result?.scored?.map((g) => ({ ...g, username: players.find((p) => p.id === g.playerId)?.username })) : [];

  return (
    <MeadowLayout maxWidth="max-w-xl">
      {iWon && <Confetti width={win.w} height={win.h} numberOfPieces={180} recycle={false} gravity={0.25} />}
      <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-5 md:p-7">
        <div className="flex justify-between items-center text-sm text-[#8B6347] mb-4">
          <span>Round {round?.number} / {state.totalRounds}</span>
          <span className="font-semibold">{amGiver ? 'You give the clue' : `${giverName} gives the clue`}</span>
        </div>

        <div className="mb-5 pt-8">
          <Bar leftLabel={round?.leftLabel} rightLabel={round?.rightLabel} target={round?.target}
            guesses={phase === 'result' ? resultGuesses : []}
            myValue={phase === 'guessing' && !amGiver && !myGuessed ? guess : null}
            showMy={phase === 'guessing' && !amGiver && !myGuessed} />
        </div>

        {phase === 'clue' && (
          <div className="text-center">
            {amGiver ? (
              <form onSubmit={(e) => { e.preventDefault(); const c = clue.trim(); if (c) sendAction('submit_clue', { clue: c }); }} className="flex gap-2 max-w-md mx-auto">
                <input value={clue} onChange={(e) => setClue(e.target.value)} placeholder="Your clue for where the target is" maxLength={80}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#3D8B5A] outline-none text-[#2D1810] bg-[#FFFDF8]" />
                <button type="submit" style={{ background: PINK, fontFamily: 'Fredoka, sans-serif' }} className="px-5 rounded-xl text-white font-bold">Give clue</button>
              </form>
            ) : <p className="text-[#4A2D1B]">{giverName} is looking at the target and thinking of a clue…</p>}
          </div>
        )}

        {phase === 'guessing' && (
          <div className="text-center">
            <p className="text-[#8B6347] text-sm">The clue is</p>
            <p style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-4">“{round.clue}”</p>
            {amGiver ? (
              <p className="text-[#4A2D1B]">Waiting for everyone to guess… ({round.guessCount}/{connectedCount - 1})</p>
            ) : myGuessed ? (
              <p className="text-[#3D8B5A] font-semibold">Locked in — waiting for others… ({round.guessCount}/{connectedCount - 1})</p>
            ) : (
              <div className="max-w-md mx-auto">
                <input type="range" min="0" max="100" value={guess} onChange={(e) => setGuess(Number(e.target.value))} className="w-full" />
                <button onClick={() => sendAction('submit_guess', { value: guess })} style={{ background: PINK, fontFamily: 'Fredoka, sans-serif' }}
                  className="mt-3 px-7 py-3 rounded-2xl text-white font-bold">Lock in my guess</button>
              </div>
            )}
            {isHost && <div><button onClick={() => sendAction('force_reveal')} className="mt-3 text-sm text-[#8B6347] underline">Reveal now →</button></div>}
          </div>
        )}

        {phase === 'result' && (
          <div className="text-center">
            <p className="text-[#4A2D1B]">The clue was <strong>“{round.clue}”</strong> — target was at <strong>{round.target}</strong>.</p>
            <Leaderboard players={players} myId={myId} />
            {finished ? (
              <div className="mt-5">
                <h3 style={fredokaStyle} className="text-xl font-bold text-[#2D1810]">🏆 {state.winner?.username} wins!</h3>
                <Link to="/spectrum" onClick={leaveGame} style={{ background: GREEN, fontFamily: 'Fredoka, sans-serif' }}
                  className="mt-3 inline-block px-6 py-3 rounded-2xl text-white font-bold">New game</Link>
              </div>
            ) : isHost ? (
              <button onClick={() => sendAction('next_round')} style={{ background: PINK, fontFamily: 'Fredoka, sans-serif' }}
                className="mt-4 px-7 py-3 rounded-2xl text-white font-bold">Next round →</button>
            ) : <p className="text-[#4A2D1B] mt-3">Waiting for the host…</p>}
          </div>
        )}
      </div>

      <p className="text-center mt-4"><Link to="/office-games" className="text-[#8B6347] text-sm hover:text-[#2D1810] underline">More party &amp; team games</Link></p>
    </MeadowLayout>
  );
}
