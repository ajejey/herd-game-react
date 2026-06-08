import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Confetti from 'react-confetti';
import { FiShare2, FiCheck } from 'react-icons/fi';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import { useTeamTrivia } from '../../hooks/useTeamTrivia';

const PINK = '#E84A8B';
const GREEN = '#3D8B5A';
const RED = '#D0463B';
const LETTERS = ['A', 'B', 'C', 'D'];

function Leaderboard({ players, myId }) {
  const sorted = [...players].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  return (
    <div className="mt-4 space-y-1.5 max-w-sm mx-auto text-left">
      {sorted.map((p, i) => (
        <div key={p.id} className={`flex items-center justify-between px-3 py-2 rounded-xl ${p.id === myId ? 'bg-[#FFE8C8]' : 'bg-[#FFF6E9]'}`}>
          <span className="font-semibold text-[#2D1810]">
            {i + 1}. {p.username}{p.id === myId ? ' (you)' : ''}{!p.connected ? ' ⚪' : ''}
          </span>
          <span className="font-bold text-[#3D8B5A]">{p.score ?? 0}</span>
        </div>
      ))}
    </div>
  );
}

export default function TeamTriviaRoom() {
  const { roomCode: codeParam } = useParams();
  const game = useTeamTrivia();
  const { connected, state, myId, error, kicked, roomNotFound, isHost, joinGame, startGame, sendAction, leaveGame } = game;
  const [name, setName] = useState('');
  const [copied, setCopied] = useState(false);
  const [w, setW] = useState({ w: 1024, h: 768 });

  useEffect(() => {
    const on = () => setW({ w: window.innerWidth, h: window.innerHeight });
    on(); window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);

  const code = state?.roomCode || codeParam;

  async function shareInvite() {
    const url = `https://herdgamesonline.com/team-trivia/room/${code}`;
    const text = `Join my Team Trivia game! ${url} (or use code ${code})`;
    try {
      if (navigator.share) { await navigator.share({ title: 'Team Trivia', text, url }); return; }
      await navigator.clipboard.writeText(text);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch { /* dismissed */ }
  }

  if (kicked) {
    return <MeadowLayout maxWidth="max-w-md"><div className="text-center bg-white rounded-3xl border-4 border-[#FFE8C8] p-8">
      <h1 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810]">{error || 'You left the room.'}</h1>
      <Link to="/team-trivia" className="text-[#E84A8B] font-semibold underline mt-3 inline-block">Back to Team Trivia</Link>
    </div></MeadowLayout>;
  }

  // Fresh visitor on a shared link, not yet joined → ask for a name.
  if (!state) {
    return (
      <MeadowLayout maxWidth="max-w-md">
        <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-6 text-center">
          <h1 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-1">Join Team Trivia</h1>
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

  // ── Lobby ──
  if (state.status === 'lobby') {
    return (
      <MeadowLayout maxWidth="max-w-lg">
        <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-6 text-center">
          <h1 style={fredokaStyle} className="text-3xl font-bold text-[#2D1810]">Team Trivia</h1>
          <p className="text-[#4A2D1B] mt-1">Room code</p>
          <p style={fredokaStyle} className="text-4xl font-bold tracking-[0.3em] text-[#E84A8B] my-2">{code}</p>
          <button onClick={shareInvite} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#2D1810] text-white font-semibold">
            {copied ? <><FiCheck /> Copied!</> : <><FiShare2 /> Copy invite link</>}
          </button>

          <div className="mt-5 text-left">
            <p className="text-sm font-semibold text-[#8B6347] mb-1">Players ({connectedCount})</p>
            <div className="flex flex-wrap gap-2">
              {players.map((p) => (
                <span key={p.id} className={`px-3 py-1 rounded-full text-sm font-semibold ${p.connected ? 'bg-[#FFE8C8] text-[#2D1810]' : 'bg-gray-100 text-gray-400'}`}>
                  {p.username}{p.isHost ? ' 👑' : ''}
                </span>
              ))}
            </div>
          </div>

          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
          {isHost ? (
            <>
              {connectedCount < 2 && <p className="text-sm text-[#8B6347] mt-4">Need at least 2 players — share the code above.</p>}
              <button onClick={startGame} disabled={connectedCount < 2} style={{ background: GREEN, fontFamily: 'Fredoka, sans-serif' }}
                className="mt-3 w-full py-3 rounded-xl text-white font-bold text-lg disabled:opacity-50">Start trivia 🧠</button>
            </>
          ) : (
            <p className="text-[#4A2D1B] mt-4">Waiting for the host to start…</p>
          )}
          <button onClick={leaveGame} className="mt-3 text-sm text-[#8B6347] hover:text-[#2D1810]">Leave room</button>
        </div>
      </MeadowLayout>
    );
  }

  // ── In-game ──
  const isReveal = state.phase === 'reveal';
  const myAnswer = round?.answers?.find((a) => a.playerId === myId);
  const answered = !!myAnswer || isReveal;
  const results = round?.results;
  const iWasCorrect = results && results.correctPlayerIds?.includes(myId);
  const finished = state.status === 'finished';

  return (
    <MeadowLayout maxWidth="max-w-xl">
      {finished && state.winner && state.winner.id === myId && <Confetti width={w.w} height={w.h} numberOfPieces={180} recycle={false} gravity={0.25} />}
      <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-5 md:p-7">
        <div className="flex justify-between items-center text-sm text-[#8B6347] mb-3">
          <span>Round {round?.number} / {state.totalRounds}</span>
          <span className="font-semibold">{round?.category}</span>
        </div>

        {!finished && (
          <>
            <h2 style={fredokaStyle} className="text-xl md:text-2xl font-bold text-[#2D1810] text-center mb-5">{round?.question}</h2>
            <div className="grid grid-cols-1 gap-2.5">
              {round?.options?.map((opt, i) => {
                let bg = '#FFF1DC', color = '#2D1810', border = '#FFE8C8';
                if (isReveal) {
                  if (i === results?.answerIndex) { bg = GREEN; color = '#fff'; border = GREEN; }
                  else if (myAnswer?.optionIndex === i) { bg = RED; color = '#fff'; border = RED; }
                } else if (myAnswer?.optionIndex === i) { bg = '#2D1810'; color = '#fff'; border = '#2D1810'; }
                return (
                  <button key={i} onClick={() => !answered && sendAction('submit_answer', { optionIndex: i })} disabled={answered}
                    style={{ background: bg, color, borderColor: border }}
                    className="w-full text-left px-4 py-3 rounded-2xl border-2 font-semibold transition-colors disabled:cursor-default flex items-center justify-between">
                    <span><span className="opacity-60 mr-2">{LETTERS[i]}</span>{opt}</span>
                    {isReveal && <span className="text-sm opacity-90">{results?.tally?.[i] ?? 0}</span>}
                  </button>
                );
              })}
            </div>

            {!isReveal && (
              <div className="mt-4 text-center">
                {answered ? <p className="text-[#3D8B5A] font-semibold">Locked in — waiting for others…</p>
                  : <p className="text-[#8B6347] text-sm">Tap your answer.</p>}
                <p className="text-xs text-[#8B6347] mt-1">{round?.answeredCount ?? 0}/{connectedCount} answered</p>
                {isHost && <button onClick={() => sendAction('force_reveal')} className="mt-2 px-5 py-2 rounded-full border-2 border-[#2D1810] text-[#2D1810] font-semibold hover:bg-[#FFF1DC]">Reveal answers →</button>}
              </div>
            )}

            {isReveal && (
              <div className="mt-4 text-center">
                <p style={fredokaStyle} className={`text-xl font-bold ${iWasCorrect ? 'text-[#3D8B5A]' : 'text-[#D0463B]'}`}>
                  {iWasCorrect ? 'Correct! +1' : 'Not this time'}
                </p>
                <Leaderboard players={players} myId={myId} />
                {isHost ? (
                  <button onClick={() => sendAction('next_round')} style={{ background: PINK, fontFamily: 'Fredoka, sans-serif' }}
                    className="mt-4 px-7 py-3 rounded-2xl text-white font-bold">Next question →</button>
                ) : <p className="text-[#4A2D1B] mt-3">Waiting for the host…</p>}
              </div>
            )}
          </>
        )}

        {finished && (
          <div className="text-center">
            <h2 style={fredokaStyle} className="text-3xl font-bold text-[#2D1810]">🏆 {state.winner?.username} wins!</h2>
            <p className="text-[#4A2D1B] mt-1">Final scores</p>
            <Leaderboard players={players} myId={myId} />
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Link to="/team-trivia" onClick={leaveGame} style={{ background: GREEN, fontFamily: 'Fredoka, sans-serif' }}
                className="px-6 py-3 rounded-2xl text-white font-bold">New game</Link>
            </div>
          </div>
        )}
      </div>

      <p className="text-center mt-4">
        <Link to="/office-games" className="text-[#8B6347] text-sm hover:text-[#2D1810] underline">More office &amp; team games</Link>
      </p>
    </MeadowLayout>
  );
}
