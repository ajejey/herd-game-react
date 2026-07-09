import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Confetti from 'react-confetti';
import { FiShare2, FiCheck } from 'react-icons/fi';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import { useScattergories } from '../../hooks/useScattergories';

const PINK = '#E84A8B';
const GREEN = '#3D8B5A';

function Leaderboard({ players, myId, gained }) {
  const sorted = [...players].sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  return (
    <div className="mt-4 space-y-1.5 max-w-sm mx-auto text-left">
      {sorted.map((p, i) => (
        <div key={p.id} className={`flex items-center justify-between px-3 py-2 rounded-xl ${p.id === myId ? 'bg-[#FFE8C8]' : 'bg-[#FFF6E9]'}`}>
          <span className="font-semibold text-[#2D1810]">{i + 1}. {p.username}{p.id === myId ? ' (you)' : ''}{!p.connected ? ' ⚪' : ''}</span>
          <span className="font-bold text-[#3D8B5A]">
            {gained && gained[p.id] ? <span className="text-[#8B6347] font-normal text-sm mr-1">+{gained[p.id]}</span> : null}
            {p.score ?? 0}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ScattergoriesRoom() {
  const { roomCode: codeParam } = useParams();
  const game = useScattergories();
  const { connected, state, myId, error, kicked, roomNotFound, isHost, joinGame, startGame, sendAction, leaveGame } = game;
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState([]);
  const [copied, setCopied] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [win, setWin] = useState({ w: 1024, h: 768 });
  const submittedRef = useRef(false);

  useEffect(() => {
    const on = () => setWin({ w: window.innerWidth, h: window.innerHeight });
    on(); window.addEventListener('resize', on);
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => { window.removeEventListener('resize', on); clearInterval(t); };
  }, []);

  const round = state?.round;
  const phase = state?.phase;
  const yourAnswers = round?.yourAnswers;
  const submitted = !!yourAnswers;

  // Reset local answers at the start of each writing round.
  useEffect(() => {
    if (phase === 'writing' && round?.categories) {
      setAnswers(Array(round.categories.length).fill(''));
      submittedRef.current = false;
    }
  }, [phase, round?.number, round?.categories]);

  const secondsLeft = round?.deadline ? Math.max(0, Math.ceil((round.deadline - now) / 1000)) : null;

  function submit(list) {
    if (submittedRef.current) return;
    submittedRef.current = true;
    sendAction('submit_answers', { answers: list });
  }

  // Auto-submit when the timer runs out.
  useEffect(() => {
    if (phase === 'writing' && !submitted && secondsLeft === 0) submit(answers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft, phase, submitted]);

  const code = state?.roomCode || codeParam;

  async function shareInvite() {
    const url = `https://herdgamesonline.com/scattergories/room/${code}`;
    try {
      if (navigator.share) { await navigator.share({ title: 'Scattergories', text: `Join my Scattergories game! ${url} (code ${code})`, url }); return; }
      await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000);
    } catch { /* dismissed */ }
  }

  if (kicked) {
    return <MeadowLayout maxWidth="max-w-md"><div className="text-center bg-white rounded-3xl border-4 border-[#FFE8C8] p-8">
      <h1 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810]">{error || 'You left the room.'}</h1>
      <Link to="/scattergories" className="text-[#E84A8B] font-semibold underline mt-3 inline-block">Back to Scattergories</Link>
    </div></MeadowLayout>;
  }

  if (!state) {
    return (
      <MeadowLayout maxWidth="max-w-md">
        <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-6 text-center">
          <h1 style={fredokaStyle} className="text-2xl font-bold text-[#2D1810] mb-1">Join Scattergories</h1>
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

  if (state.status === 'lobby') {
    return (
      <MeadowLayout maxWidth="max-w-lg">
        <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-6 text-center">
          <h1 style={fredokaStyle} className="text-3xl font-bold text-[#2D1810]">Scattergories 🅰️</h1>
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
                className="mt-3 w-full py-3 rounded-xl text-white font-bold text-lg disabled:opacity-50">Start game 🅰️</button>
            </>
          ) : <p className="text-[#4A2D1B] mt-4">Waiting for the host to start…</p>}
          <button onClick={leaveGame} className="mt-3 text-sm text-[#8B6347] hover:text-[#2D1810]">Leave room</button>
        </div>
      </MeadowLayout>
    );
  }

  const finished = state.status === 'finished';
  const iWon = finished && state.winner?.id === myId;

  return (
    <MeadowLayout maxWidth="max-w-xl">
      {iWon && <Confetti width={win.w} height={win.h} numberOfPieces={180} recycle={false} gravity={0.25} />}
      <div className="bg-white rounded-3xl border-4 border-[#FFE8C8] p-5 md:p-7">
        <div className="flex justify-between items-center text-sm text-[#8B6347] mb-3">
          <span>Round {round?.number} / {state.totalRounds}</span>
          <span className="font-semibold">Letter <span style={fredokaStyle} className="text-2xl text-[#E84A8B] align-middle">{round?.letter}</span></span>
        </div>

        {/* ── Writing phase ── */}
        {phase === 'writing' && (
          <div>
            <div className="text-center mb-4">
              <p className="text-[#8B6347] text-sm">Every answer must start with</p>
              <div style={fredokaStyle} className="text-6xl font-bold text-[#2D1810] leading-none my-1">{round.letter}</div>
              {secondsLeft != null && (
                <div className={`inline-block px-4 py-1 rounded-full font-bold ${secondsLeft <= 15 ? 'bg-[#FFE1E1] text-[#D0463B]' : 'bg-[#FFF0F5] text-[#E84A8B]'}`}>
                  ⏱ {secondsLeft}s
                </div>
              )}
            </div>

            {submitted ? (
              <div className="text-center py-4">
                <p className="text-[#3D8B5A] font-semibold">Locked in! Waiting for others… ({round.submittedCount}/{connectedCount})</p>
                <div className="mt-3 grid grid-cols-1 gap-1.5 max-w-md mx-auto text-left">
                  {round.categories.map((c, i) => (
                    <div key={i} className="flex justify-between text-sm px-3 py-1.5 rounded-lg bg-[#FFF6E9]">
                      <span className="text-[#8B6347]">{c}</span><span className="font-semibold text-[#2D1810]">{yourAnswers[i] || '—'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); submit(answers); }} className="space-y-2 max-w-md mx-auto">
                {round.categories.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <label className="flex-1 text-sm text-[#4A2D1B]">{c}</label>
                    <input
                      value={answers[i] || ''}
                      onChange={(e) => setAnswers((a) => { const n = [...a]; n[i] = e.target.value; return n; })}
                      maxLength={60}
                      className="w-40 px-3 py-2 rounded-lg border-2 border-[#FFE8C8] focus:border-[#3D8B5A] outline-none text-[#2D1810] bg-[#FFFDF8]"
                      placeholder={round.letter + '…'}
                    />
                  </div>
                ))}
                <button type="submit" style={{ background: PINK, fontFamily: 'Fredoka, sans-serif' }}
                  className="w-full py-3 rounded-xl text-white font-bold text-lg mt-2">Submit answers</button>
              </form>
            )}
            {isHost && <div className="text-center"><button onClick={() => sendAction('force_reveal')} className="mt-3 text-sm text-[#8B6347] underline">Reveal now →</button></div>}
          </div>
        )}

        {/* ── Results phase ── */}
        {phase === 'results' && round.results && (
          <div>
            <p className="text-center text-[#4A2D1B] mb-3">Answers for <strong>{round.letter}</strong> — <span className="text-[#3D8B5A] font-semibold">green = unique &amp; scored</span></p>
            <div className="space-y-3 max-w-lg mx-auto">
              {round.results.map((r, i) => (
                <div key={i} className="rounded-xl border-2 border-[#FFE8C8] overflow-hidden">
                  <div className="bg-[#FFF6E9] px-3 py-1.5 text-sm font-bold text-[#2D1810]">{r.category}</div>
                  <div className="divide-y divide-[#FFF1DC]">
                    {r.entries.filter((e) => e.answer).map((e, j) => (
                      <div key={j} className="flex justify-between items-center px-3 py-1.5 text-sm">
                        <span className="text-[#8B6347]">{nameById(e.playerId)}</span>
                        <span className={`font-semibold ${e.point ? 'text-[#3D8B5A]' : e.valid ? 'text-[#B08968]' : 'text-[#C0392B] line-through'}`}>
                          {e.answer}{e.point ? ' ✓' : ''}
                        </span>
                      </div>
                    ))}
                    {r.entries.every((e) => !e.answer) && <div className="px-3 py-1.5 text-sm text-[#B08968] italic">No answers</div>}
                  </div>
                </div>
              ))}
            </div>

            <Leaderboard players={players} myId={myId} gained={round.roundGained} />

            {finished ? (
              <div className="mt-5 text-center">
                <h3 style={fredokaStyle} className="text-xl font-bold text-[#2D1810]">🏆 {state.winner?.username} wins!</h3>
                <Link to="/scattergories" onClick={leaveGame} style={{ background: GREEN, fontFamily: 'Fredoka, sans-serif' }}
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
