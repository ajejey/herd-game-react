import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Confetti from 'react-confetti';
import { FiShare2, FiCheck } from 'react-icons/fi';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import { useChameleon } from '../../hooks/useChameleon';

const PINK = '#E84A8B';
const GREEN = '#3D8B5A';
const RED = '#D0463B';

function Grid({ words, secretIndex, guessIndex, clickable, onPick }) {
  return (
    <div className="grid grid-cols-4 gap-1.5 md:gap-2 max-w-md mx-auto">
      {words.map((w, i) => {
        const isSecret = secretIndex != null && i === secretIndex;
        const isWrongGuess = guessIndex != null && i === guessIndex && i !== secretIndex;
        let style = { borderColor: '#FFE8C8', background: '#FFF8EE', color: '#2D1810' };
        if (isSecret) style = { borderColor: GREEN, background: GREEN, color: '#fff' };
        else if (isWrongGuess) style = { borderColor: RED, background: RED, color: '#fff' };
        return (
          <button key={i} disabled={!clickable} onClick={() => clickable && onPick(i)}
            style={style}
            className={`aspect-[5/4] rounded-xl border-2 px-1 flex items-center justify-center text-center leading-tight ${clickable ? 'hover:brightness-95 cursor-pointer' : 'cursor-default'}`}>
            <span className="text-[10px] sm:text-xs md:text-sm font-semibold break-words">{w}</span>
          </button>
        );
      })}
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

export default function ChameleonRoom() {
  const { roomCode: codeParam } = useParams();
  const game = useChameleon();
  const { connected, state, myId, error, kicked, roomNotFound, isHost, joinGame, startGame, sendAction, leaveGame } = game;
  const [name, setName] = useState('');
  const [clue, setClue] = useState('');
  const [copied, setCopied] = useState(false);
  const [win, setWin] = useState({ w: 1024, h: 768 });

  useEffect(() => {
    const on = () => setWin({ w: window.innerWidth, h: window.innerHeight });
    on(); window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);

  const code = state?.roomCode || codeParam;

  async function shareInvite() {
    const url = `https://herdgamesonline.com/chameleon/room/${code}`;
    try {
      if (navigator.share) { await navigator.share({ title: 'Chameleon', text: `Join my Chameleon game! ${url} (code ${code})`, url }); return; }
      await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch { /* dismissed */ }
  }

  if (kicked) {
    return <MeadowLayout maxWidth="max-w-md"><div className="text-center bg-white rounded-3xl border-4 border-[#FFE8C8] p-8">
      <h1 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810]">{error || 'You left the room.'}</h1>
      <Link to="/chameleon" className="text-[#E84A8B] font-semibold underline mt-3 inline-block">Back to Chameleon</Link>
    </div></MeadowLayout>;
  }

  if (!state) {
    return (
      <MeadowLayout maxWidth="max-w-md">
        <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-6 text-center">
          <h1 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-1">Join Chameleon</h1>
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
          <h1 style={fredokaStyle} className="text-3xl font-bold text-[#2D1810]">Chameleon 🦎</h1>
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
                className="mt-3 w-full py-3 rounded-xl text-white font-bold text-lg disabled:opacity-50">Start game 🦎</button>
            </>
          ) : <p className="text-[#4A2D1B] mt-4">Waiting for the host to start…</p>}
          <button onClick={leaveGame} className="mt-3 text-sm text-[#8B6347] hover:text-[#2D1810]">Leave room</button>
        </div>
      </MeadowLayout>
    );
  }

  // ── In game ──
  const amChameleon = round?.youAreChameleon;
  const phase = state.phase;
  const finished = state.status === 'finished';
  const myClue = round?.clues?.find((c) => c.playerId === myId);
  const myVote = round?.votes?.find((v) => v.voterId === myId);
  const result = round?.result;
  const chameleonName = round?.chameleonId ? players.find((p) => p.id === round.chameleonId)?.username : null;
  const iWon = finished && state.winner?.id === myId;

  return (
    <MeadowLayout maxWidth="max-w-xl">
      {iWon && <Confetti width={win.w} height={win.h} numberOfPieces={180} recycle={false} gravity={0.25} />}
      <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-5 md:p-7">
        <div className="flex justify-between items-center text-sm text-[#8B6347] mb-3">
          <span>Round {round?.number} / {state.totalRounds}</span>
          <span className="font-semibold uppercase tracking-wide">{round?.category}</span>
        </div>

        {amChameleon && phase !== 'result' && (
          <div className="mb-3 rounded-xl bg-[#2D1810] text-white text-center py-2 px-3 font-bold">🦎 You are the Chameleon — you don’t know the secret word. Blend in!</div>
        )}

        <Grid
          words={round?.words || []}
          secretIndex={round?.secretIndex}
          guessIndex={phase === 'result' ? result?.guessIndex : null}
          clickable={phase === 'guessing' && amChameleon}
          onPick={(i) => sendAction('chameleon_guess', { wordIndex: i })}
        />

        {/* CLUE */}
        {phase === 'clue' && (
          <div className="mt-5 text-center">
            {myClue ? (
              <p className="text-[#3D8B5A] font-semibold">Your clue “{myClue.word}” is in — waiting for others… ({round.clueCount}/{connectedCount})</p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); const w = clue.trim(); if (w) { sendAction('submit_clue', { word: w }); setClue(''); } }} className="flex gap-2 max-w-sm mx-auto">
                <input value={clue} onChange={(e) => setClue(e.target.value)} placeholder="Your one-word clue" maxLength={24}
                  className="flex-1 px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#3D8B5A] outline-none text-[#2D1810] bg-[#FFFDF8]" />
                <button type="submit" style={{ background: PINK, fontFamily: 'Fredoka, sans-serif' }} className="px-5 rounded-xl text-white font-bold">Send</button>
              </form>
            )}
            {isHost && <button onClick={() => sendAction('force_voting')} className="mt-3 text-sm text-[#8B6347] underline">Skip to voting →</button>}
          </div>
        )}

        {/* VOTING */}
        {phase === 'voting' && (
          <div className="mt-5">
            <h3 style={fredokaStyle} className="text-center text-lg font-bold text-[#2D1810] mb-2">The clues</h3>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {round.clues.map((c) => (
                <span key={c.playerId} className="px-3 py-1.5 rounded-full bg-[#FFF1DC] text-[#2D1810] text-sm"><strong>{c.username}:</strong> {c.word}</span>
              ))}
            </div>
            <p className="text-center text-sm font-semibold text-[#8B6347] mb-2">Who is the Chameleon? {myVote ? '(voted)' : `(${round.voteCount}/${connectedCount} voted)`}</p>
            <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
              {players.filter((p) => p.id !== myId).map((p) => (
                <button key={p.id} disabled={!!myVote} onClick={() => sendAction('submit_vote', { suspectId: p.id })}
                  style={{ background: myVote?.suspectId === p.id ? '#2D1810' : '#FFF1DC', color: myVote?.suspectId === p.id ? '#fff' : '#2D1810' }}
                  className="px-3 py-2 rounded-xl border-2 border-[#FFE8C8] font-semibold disabled:opacity-70">{p.username}</button>
              ))}
            </div>
            {isHost && <div className="text-center"><button onClick={() => sendAction('force_votes')} className="mt-3 text-sm text-[#8B6347] underline">Tally votes now →</button></div>}
          </div>
        )}

        {/* GUESSING */}
        {phase === 'guessing' && (
          <div className="mt-5 text-center">
            <p style={fredokaStyle} className="text-lg font-bold text-[#2D1810]">Caught! <strong>{chameleonName}</strong> was the Chameleon 🦎</p>
            {amChameleon ? <p className="text-[#4A2D1B] mt-1">Tap your guess at the secret word above to steal the win.</p>
              : <p className="text-[#4A2D1B] mt-1">The Chameleon is guessing the secret word…</p>}
          </div>
        )}

        {/* RESULT */}
        {phase === 'result' && (
          <div className="mt-5 text-center">
            <h2 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810]">
              {result?.reason === 'escaped' && `🦎 The Chameleon escaped!`}
              {result?.reason === 'caught-but-guessed' && `🦎 Caught — but guessed the word!`}
              {result?.reason === 'caught' && `🎉 The players win!`}
            </h2>
            <p className="text-[#4A2D1B] mt-1">
              The Chameleon was <strong>{chameleonName}</strong>. The word was <strong>{round.words[round.secretIndex]}</strong>.
            </p>
            <Leaderboard players={players} myId={myId} />
            {finished ? (
              <div className="mt-5">
                <h3 style={fredokaStyle} className="text-xl font-bold text-[#2D1810]">🏆 {state.winner?.username} wins!</h3>
                <Link to="/chameleon" onClick={leaveGame} style={{ background: GREEN, fontFamily: 'Fredoka, sans-serif' }}
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
