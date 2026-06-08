import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Confetti from 'react-confetti';
import { FiShare2, FiCheck } from 'react-icons/fi';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import { useTwoTruths } from '../../hooks/useTwoTruths';

const PINK = '#E84A8B';
const GREEN = '#3D8B5A';
const RED = '#D0463B';

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

export default function TwoTruthsRoom() {
  const { roomCode: codeParam } = useParams();
  const game = useTwoTruths();
  const { connected, state, myId, error, kicked, roomNotFound, isHost, joinGame, startGame, sendAction, leaveGame } = game;
  const [name, setName] = useState('');
  const [stmts, setStmts] = useState(['', '', '']);
  const [lie, setLie] = useState(0);
  const [copied, setCopied] = useState(false);
  const [winSz, setWinSz] = useState({ w: 1024, h: 768 });

  useEffect(() => {
    const on = () => setWinSz({ w: window.innerWidth, h: window.innerHeight });
    on(); window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);

  const code = state?.roomCode || codeParam;

  async function shareInvite() {
    const url = `https://herdgamesonline.com/two-truths-and-a-lie/room/${code}`;
    try {
      if (navigator.share) { await navigator.share({ title: 'Two Truths and a Lie', text: `Join my game! ${url} (code ${code})`, url }); return; }
      await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch { /* dismissed */ }
  }

  if (kicked) {
    return <MeadowLayout maxWidth="max-w-md"><div className="text-center bg-white rounded-3xl border-4 border-[#FFE8C8] p-8">
      <h1 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810]">{error || 'You left the room.'}</h1>
      <Link to="/two-truths-and-a-lie" className="text-[#E84A8B] font-semibold underline mt-3 inline-block">Back</Link>
    </div></MeadowLayout>;
  }

  if (!state) {
    return (
      <MeadowLayout maxWidth="max-w-md">
        <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-6 text-center">
          <h1 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-1">Join the game</h1>
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

  if (state.status === 'lobby') {
    return (
      <MeadowLayout maxWidth="max-w-lg">
        <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-6 text-center">
          <h1 style={fredokaStyle} className="text-3xl font-bold text-[#2D1810]">Two Truths and a Lie 🤥</h1>
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
                className="mt-3 w-full py-3 rounded-xl text-white font-bold text-lg disabled:opacity-50">Start game 🤥</button>
            </>
          ) : <p className="text-[#4A2D1B] mt-4">Waiting for the host to start…</p>}
          <button onClick={leaveGame} className="mt-3 text-sm text-[#8B6347] hover:text-[#2D1810]">Leave room</button>
        </div>
      </MeadowLayout>
    );
  }

  const phase = state.phase;
  const finished = state.status === 'finished';
  const current = state.current;
  const subjectName = current ? players.find((p) => p.id === current.subjectId)?.username : null;
  const amSubject = current?.youAreSubject;
  const myGuess = current?.guesses?.find((g) => g.voterId === myId);
  const iWon = finished && state.winner?.id === myId;

  // ── Writing ──
  if (phase === 'writing') {
    return (
      <MeadowLayout maxWidth="max-w-xl">
        <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-5 md:p-7">
          <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] text-center mb-1">Write your statements</h2>
          <p className="text-center text-[#4A2D1B] mb-4">Two truths and one lie about yourself. Tap the radio next to your lie.</p>
          {state.iSubmitted ? (
            <p className="text-center text-[#3D8B5A] font-semibold">Locked in! Waiting for everyone… ({state.submittedCount}/{connectedCount})</p>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); if (stmts.every((s) => s.trim())) sendAction('submit_statements', { statements: stmts, lieIndex: lie }); }} className="space-y-3">
              {stmts.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-sm text-[#8B6347]">
                    <input type="radio" name="lie" checked={lie === i} onChange={() => setLie(i)} /> lie
                  </label>
                  <input value={s} onChange={(e) => { const n = [...stmts]; n[i] = e.target.value; setStmts(n); }}
                    placeholder={`Statement ${i + 1}`} maxLength={120}
                    className="flex-1 px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#3D8B5A] outline-none text-[#2D1810] bg-[#FFFDF8]" />
                </div>
              ))}
              <button type="submit" disabled={!stmts.every((s) => s.trim())} style={{ background: PINK, fontFamily: 'Fredoka, sans-serif' }}
                className="w-full py-3 rounded-xl text-white font-bold disabled:opacity-50">Submit my statements</button>
            </form>
          )}
          {isHost && <div className="text-center"><button onClick={() => sendAction('force_start')} className="mt-3 text-sm text-[#8B6347] underline">Start with who’s ready →</button></div>}
        </div>
      </MeadowLayout>
    );
  }

  // ── Finished ──
  if (finished) {
    return (
      <MeadowLayout maxWidth="max-w-lg">
        {iWon && <Confetti width={winSz.w} height={winSz.h} numberOfPieces={180} recycle={false} gravity={0.25} />}
        <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-6 text-center">
          <h2 style={fredokaStyle} className="text-3xl font-bold text-[#2D1810]">🏆 {state.winner?.username} wins!</h2>
          <p className="text-[#4A2D1B] mt-1">Final scores</p>
          <Leaderboard players={players} myId={myId} />
          <Link to="/two-truths-and-a-lie" onClick={leaveGame} style={{ background: GREEN, fontFamily: 'Fredoka, sans-serif' }}
            className="mt-5 inline-block px-6 py-3 rounded-2xl text-white font-bold">New game</Link>
        </div>
      </MeadowLayout>
    );
  }

  // ── Guessing / Reveal for the current subject ──
  const result = current?.result;
  return (
    <MeadowLayout maxWidth="max-w-xl">
      <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-5 md:p-7">
        <p className="text-center text-sm text-[#8B6347] mb-1">Player {state.subjectIndex + 1} of {state.subjects.length}</p>
        <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] text-center mb-1">{subjectName}’s statements</h2>
        <p className="text-center text-[#4A2D1B] mb-4">
          {phase === 'reveal' ? 'Here’s the lie…' : amSubject ? 'The group is guessing your lie…' : 'Which one is the lie?'}
        </p>

        <div className="space-y-2.5">
          {current.statements.map((s, i) => {
            const isLie = phase === 'reveal' && i === result?.liePosition;
            const isTruth = phase === 'reveal' && i !== result?.liePosition;
            const picked = myGuess?.position === i;
            const votes = phase === 'reveal' ? result.guesses.filter((g) => g.position === i).length : 0;
            let style = { borderColor: '#FFE8C8', background: '#FFF8EE', color: '#2D1810' };
            if (isLie) style = { borderColor: RED, background: RED, color: '#fff' };
            else if (isTruth) style = { borderColor: GREEN, background: '#EAF6EE', color: '#2D1810' };
            else if (picked) style = { borderColor: '#2D1810', background: '#2D1810', color: '#fff' };
            return (
              <button key={i}
                disabled={phase !== 'guessing' || amSubject || !!myGuess}
                onClick={() => sendAction('submit_guess', { position: i })}
                style={style}
                className="w-full text-left px-4 py-3 rounded-2xl border-2 font-semibold flex items-center justify-between disabled:cursor-default">
                <span>{s}</span>
                {phase === 'reveal' && <span className="text-xs opacity-90">{isLie ? 'THE LIE' : ''} {votes ? `· ${votes} guessed` : ''}</span>}
              </button>
            );
          })}
        </div>

        {phase === 'guessing' && (
          <div className="text-center mt-4">
            {amSubject ? <p className="text-[#4A2D1B]">Sit tight — they’re trying to spot your lie. ({current.guessCount}/{connectedCount - 1})</p>
              : myGuess ? <p className="text-[#3D8B5A] font-semibold">Locked in — waiting… ({current.guessCount}/{connectedCount - 1})</p>
                : <p className="text-[#8B6347] text-sm">Tap the statement you think is the lie.</p>}
            {isHost && <button onClick={() => sendAction('force_reveal')} className="mt-2 block mx-auto text-sm text-[#8B6347] underline">Reveal now →</button>}
          </div>
        )}

        {phase === 'reveal' && (
          <div className="text-center mt-4">
            <Leaderboard players={players} myId={myId} />
            {isHost ? (
              <button onClick={() => sendAction('next')} style={{ background: PINK, fontFamily: 'Fredoka, sans-serif' }}
                className="mt-4 px-7 py-3 rounded-2xl text-white font-bold">Next →</button>
            ) : <p className="text-[#4A2D1B] mt-3">Waiting for the host…</p>}
          </div>
        )}
      </div>
      <p className="text-center mt-4"><Link to="/office-games" className="text-[#8B6347] text-sm hover:text-[#2D1810] underline">More party &amp; team games</Link></p>
    </MeadowLayout>
  );
}
