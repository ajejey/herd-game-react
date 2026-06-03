import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Confetti from 'react-confetti';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import { useClover } from '../../hooks/useClover';
import Lobby from './Lobby';
import WritePhase from './WritePhase';
import ResolvePhase from './ResolvePhase';

export default function CloverRoom() {
  const { roomCode: urlCode } = useParams();
  const navigate = useNavigate();
  const game = useClover();
  const { state, roomCode, connected, kicked, roomNotFound, error, joinGame, leaveGame } = game;

  useEffect(() => {
    if (roomNotFound) {
      const t = setTimeout(() => navigate('/clover', { replace: true }), 1500);
      return () => clearTimeout(t);
    }
  }, [roomNotFound, navigate]);

  if (roomNotFound) return <Centered title="Room not found" sub="It may have expired. Taking you back…" />;
  if (kicked) return (
    <MeadowLayout>
      <div className="text-center py-20">
        <h2 style={fredokaStyle} className="text-3xl font-bold text-[#2D1810] mb-2">Removed from game</h2>
        <p className="text-[#4A2D1B] mb-6">{error}</p>
        <button onClick={() => navigate('/clover')} className="px-6 py-3 rounded-xl bg-[#E84A8B] text-white font-bold">Back</button>
      </div>
    </MeadowLayout>
  );
  if (!connected) return <Centered title="Reconnecting…" sub="Your spot is saved." spin />;
  if (!state && urlCode) return <QuickJoin roomCode={urlCode} joinGame={joinGame} error={error} />;
  if (!state) return <Centered title="Loading…" />;

  if (state.status === 'finished') {
    return <MeadowLayout><Finished state={state} onLeave={() => { leaveGame(); navigate('/clover'); }} /></MeadowLayout>;
  }

  if (state.status === 'lobby' || state.status == null) {
    return <MeadowLayout><Lobby game={game} /></MeadowLayout>;
  }

  return (
    <MeadowLayout>
      <div className="flex items-center justify-between mb-4 text-sm text-[#8B6347]">
        <span style={fredokaStyle} className="text-lg font-bold text-[#2D1810]">Clover Clues</span>
        <span className="font-mono bg-[#FFE8C8] px-3 py-1 rounded-lg text-[#2D1810] font-bold tracking-widest">{roomCode}</span>
      </div>

      {typeof state.totalScore === 'number' && state.phase === 'resolving' && (
        <p className="text-center text-sm text-[#8B6347] mb-3">Team score so far: <strong className="text-[#3D8B5A]">{state.totalScore}</strong></p>
      )}

      {error && !kicked && (
        <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-center">{error}</div>
      )}

      {state.phase === 'writing' && <WritePhase game={game} />}
      {state.phase === 'resolving' && <ResolvePhase game={game} />}
    </MeadowLayout>
  );
}

function Finished({ state, onLeave }) {
  const players = state.players || [];
  const total = state.totalScore || 0;
  const max = players.length * 6;
  const pct = max ? total / max : 0;
  const rating =
    pct >= 0.9 ? 'Telepathic herd! 🍀' :
    pct >= 0.7 ? 'Great minds!' :
    pct >= 0.4 ? 'Solid teamwork.' : 'A wild guess or two…';
  const [size, setSize] = useState({ w: 1024, h: 768 });
  useEffect(() => {
    const on = () => setSize({ w: window.innerWidth, h: window.innerHeight });
    on(); window.addEventListener('resize', on); return () => window.removeEventListener('resize', on);
  }, []);

  return (
    <div className="max-w-md mx-auto text-center">
      {pct >= 0.7 && <Confetti width={size.w} height={size.h} numberOfPieces={160} recycle={false} gravity={0.25} />}
      <h1 style={fredokaStyle} className="text-3xl md:text-4xl font-bold text-[#2D1810]">You scored {total} / {max}</h1>
      <p style={fredokaStyle} className="text-xl text-[#3D8B5A] font-bold mt-1">{rating}</p>
      <p className="text-[#4A2D1B] mt-2">You rebuilt {players.length} clovers together. That's the whole point — one team, one score.</p>

      <button onClick={onLeave}
        style={{ background: '#E84A8B', fontFamily: 'Fredoka, sans-serif' }}
        className="mt-6 px-8 py-3 rounded-2xl text-white font-bold text-lg hover:scale-105 transition-transform">
        Play again →
      </button>

      <div className="mt-8 pt-6 border-t-2 border-[#FFE8C8]">
        <h2 style={fredokaStyle} className="text-lg font-bold text-[#2D1810] mb-3">More games in the herd</h2>
        <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold">
          <Link to="/" className="underline text-[#3D8B5A] hover:text-[#2F6E45]">Herd Mentality</Link>
          <Link to="/guesstimate" className="underline text-[#3D8B5A] hover:text-[#2F6E45]">Guesstimate</Link>
          <Link to="/say-anything" className="underline text-[#3D8B5A] hover:text-[#2F6E45]">Say Anything</Link>
          <Link to="/daily" className="underline text-[#3D8B5A] hover:text-[#2F6E45]">Daily Herd</Link>
        </div>
      </div>
    </div>
  );
}

function Centered({ title, sub, spin }) {
  return (
    <MeadowLayout>
      <div className="text-center py-20">
        {spin && <div className="text-4xl mb-3 animate-spin">⟳</div>}
        <h2 style={fredokaStyle} className="text-3xl font-bold text-[#2D1810] mb-2">{title}</h2>
        {sub && <p className="text-[#4A2D1B]">{sub}</p>}
      </div>
    </MeadowLayout>
  );
}

function QuickJoin({ roomCode, joinGame, error }) {
  const [name, setName] = useState('');
  return (
    <MeadowLayout>
      <div className="max-w-sm mx-auto">
        <h2 style={fredokaStyle} className="text-3xl font-bold text-[#2D1810] mb-2 text-center">Join game</h2>
        <p className="text-center text-[#8B6347] mb-6">Room <span className="font-mono font-bold">{roomCode}</span></p>
        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={(e) => { e.preventDefault(); if (name.trim()) joinGame(roomCode, name); }} className="space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={20}
            className="w-full px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#3D8B5A] focus:outline-none text-[#2D1810] bg-[#FFFDF8]" />
          <button type="submit" style={{ background: '#E84A8B', fontFamily: 'Fredoka, sans-serif' }}
            className="w-full py-3 rounded-xl text-white font-bold text-lg">Join</button>
        </form>
      </div>
    </MeadowLayout>
  );
}
