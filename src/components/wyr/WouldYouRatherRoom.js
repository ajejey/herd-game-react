import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Confetti from 'react-confetti';
import { FiShare2, FiCheck } from 'react-icons/fi';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import { useWouldYouRather } from '../../hooks/useWouldYouRather';

const PINK = '#E84A8B';
const GREEN = '#3D8B5A';
const BLUE = '#4A90D9';

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

export default function WouldYouRatherRoom() {
  const { roomCode: codeParam } = useParams();
  const game = useWouldYouRather();
  const { connected, state, myId, error, kicked, roomNotFound, isHost, joinGame, startGame, sendAction, leaveGame } = game;
  const [name, setName] = useState('');
  const [copied, setCopied] = useState(false);
  const [win, setWin] = useState({ w: 1024, h: 768 });

  useEffect(() => {
    const on = () => setWin({ w: window.innerWidth, h: window.innerHeight });
    on(); window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);

  const code = state?.roomCode || codeParam;

  async function shareInvite() {
    const url = `https://herdgamesonline.com/would-you-rather/room/${code}`;
    try {
      if (navigator.share) { await navigator.share({ title: 'Would You Rather', text: `Join my Would You Rather game! ${url} (code ${code})`, url }); return; }
      await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch { /* dismissed */ }
  }

  if (kicked) {
    return <MeadowLayout maxWidth="max-w-md"><div className="text-center bg-white rounded-3xl border-4 border-[#FFE8C8] p-8">
      <h1 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810]">{error || 'You left the room.'}</h1>
      <Link to="/would-you-rather" className="text-[#E84A8B] font-semibold underline mt-3 inline-block">Back to Would You Rather</Link>
    </div></MeadowLayout>;
  }

  if (!state) {
    return (
      <MeadowLayout maxWidth="max-w-md">
        <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-6 text-center">
          <h1 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-1">Join Would You Rather</h1>
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
  const phase = state.phase;

  if (state.status === 'lobby') {
    return (
      <MeadowLayout maxWidth="max-w-lg">
        <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-6 text-center">
          <h1 style={fredokaStyle} className="text-3xl font-bold text-[#2D1810]">Would You Rather 🤔</h1>
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
              {connectedCount < 2 && <p className="text-sm text-[#8B6347] mt-4">Need at least 2 players — share the code above.</p>}
              <button onClick={startGame} disabled={connectedCount < 2} style={{ background: GREEN, fontFamily: 'Fredoka, sans-serif' }}
                className="mt-3 w-full py-3 rounded-xl text-white font-bold text-lg disabled:opacity-50">Start game 🤔</button>
            </>
          ) : <p className="text-[#4A2D1B] mt-4">Waiting for the host to start…</p>}
          <button onClick={leaveGame} className="mt-3 text-sm text-[#8B6347] hover:text-[#2D1810]">Leave room</button>
        </div>
      </MeadowLayout>
    );
  }

  const finished = state.status === 'finished';
  const iWon = finished && state.winner?.id === myId;
  // yourVote is only in the trimmed voting-phase state; in reveal read it back
  // from the full votes map.
  const yourVote = round?.yourVote ?? round?.votes?.[myId];
  const res = round?.result;
  const total = res ? res.a + res.b : 0;
  const pctA = total ? Math.round((res.a / total) * 100) : 0;
  const pctB = total ? 100 - pctA : 0;

  // Option card for the voting phase
  const OptionCard = ({ letter, text, color }) => (
    <button
      onClick={() => sendAction('vote', { choice: letter })}
      disabled={!!yourVote}
      className="w-full rounded-2xl border-4 p-5 text-left transition-transform disabled:cursor-default hover:-translate-y-0.5 disabled:hover:translate-y-0"
      style={{ borderColor: yourVote === letter ? color : '#FFE8C8', background: yourVote === letter ? color : '#fff' }}
    >
      <span className="text-xs font-bold" style={{ color: yourVote === letter ? '#fff' : color }}>{letter}</span>
      <p style={fredokaStyle} className={`text-lg font-bold leading-snug ${yourVote === letter ? 'text-white' : 'text-[#2D1810]'}`}>{text}</p>
    </button>
  );

  return (
    <MeadowLayout maxWidth="max-w-xl">
      {iWon && <Confetti width={win.w} height={win.h} numberOfPieces={180} recycle={false} gravity={0.25} />}
      <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-5 md:p-7">
        <div className="flex justify-between items-center text-sm text-[#8B6347] mb-4">
          <span>Round {round?.number} / {state.totalRounds}</span>
          <span className="font-semibold">Would you rather…</span>
        </div>

        {/* ── Voting phase ── */}
        {phase === 'voting' && (
          <div>
            <div className="space-y-3">
              <OptionCard letter="A" text={round.optionA} color={BLUE} />
              <div className="text-center text-[#8B6347] font-bold text-sm">— or —</div>
              <OptionCard letter="B" text={round.optionB} color={PINK} />
            </div>
            <p className="text-center text-[#8B6347] text-sm mt-4">
              {yourVote ? `Locked in — waiting for others… (${round.votedCount}/${connectedCount})` : 'Tap the one you’d pick.'}
            </p>
            {isHost && <div className="text-center"><button onClick={() => sendAction('force_reveal')} className="mt-2 text-sm text-[#8B6347] underline">Reveal now →</button></div>}
          </div>
        )}

        {/* ── Reveal phase ── */}
        {phase === 'reveal' && res && (
          <div>
            {/* split bar */}
            <div className="rounded-2xl overflow-hidden border-2 border-[#FFE8C8] flex text-white font-bold" style={{ minHeight: 64 }}>
              <div className="flex items-center justify-center p-2 text-center" style={{ width: `${Math.max(pctA, 8)}%`, background: BLUE }}>
                <span>{pctA}%</span>
              </div>
              <div className="flex items-center justify-center p-2 text-center" style={{ width: `${Math.max(pctB, 8)}%`, background: PINK }}>
                <span>{pctB}%</span>
              </div>
            </div>
            <div className="flex justify-between text-sm font-semibold text-[#2D1810] mt-2 gap-3">
              <span className="flex-1">🅰 {round.optionA}</span>
              <span className="flex-1 text-right">🅱 {round.optionB}</span>
            </div>

            {/* who picked what */}
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-xl bg-[#EEF5FC] p-2">
                {players.filter((p) => round.votes[p.id] === 'A').map((p) => <div key={p.id} className="text-[#2D1810]">{p.username}{p.id === myId ? ' (you)' : ''}</div>)}
              </div>
              <div className="rounded-xl bg-[#FFF0F5] p-2 text-right">
                {players.filter((p) => round.votes[p.id] === 'B').map((p) => <div key={p.id} className="text-[#2D1810]">{p.username}{p.id === myId ? ' (you)' : ''}</div>)}
              </div>
            </div>

            <p className="text-center mt-3 font-semibold" style={{ color: res.majority ? GREEN : '#8B6347' }}>
              {!res.majority ? 'Dead tie — no points this round!'
                : (yourVote === res.majority ? 'You’re with the herd — +1 point! 🐑' : 'You broke from the herd — no point this round.')}
            </p>

            <Leaderboard players={players} myId={myId} />

            {finished ? (
              <div className="mt-5 text-center">
                <h3 style={fredokaStyle} className="text-xl font-bold text-[#2D1810]">🏆 {state.winner?.username} thinks most like the herd!</h3>
                <Link to="/would-you-rather" onClick={leaveGame} style={{ background: GREEN, fontFamily: 'Fredoka, sans-serif' }}
                  className="mt-3 inline-block px-6 py-3 rounded-2xl text-white font-bold">New game</Link>
              </div>
            ) : isHost ? (
              <div className="text-center"><button onClick={() => sendAction('next_round')} style={{ background: PINK, fontFamily: 'Fredoka, sans-serif' }}
                className="mt-4 px-7 py-3 rounded-2xl text-white font-bold">Next round →</button></div>
            ) : <p className="text-center text-[#4A2D1B] mt-3">Waiting for the host…</p>}
          </div>
        )}
      </div>

      <p className="text-center mt-4"><Link to="/office-games" className="text-[#8B6347] text-sm hover:text-[#2D1810] underline">More party &amp; team games</Link></p>
    </MeadowLayout>
  );
}
