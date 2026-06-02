import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import { useGuesstimate } from '../../hooks/useGuesstimate';
import Lobby from './Lobby';
import AnsweringPhase from './AnsweringPhase';
import BettingPhase from './BettingPhase';
import RevealPhase from './RevealPhase';
import Scoreboard from './Scoreboard';
import HowToPlay from './HowToPlay';
import PhaseBanner from './PhaseBanner';

export default function GuesstimateRoom() {
  const { roomCode: urlCode } = useParams();
  const navigate = useNavigate();
  const game = useGuesstimate();
  const { state, myId, roomCode, connected, kicked, roomNotFound, error, joinGame, leaveGame } = game;
  const [showHelp, setShowHelp] = React.useState(false);

  useEffect(() => {
    if (roomNotFound) {
      const t = setTimeout(() => navigate('/guesstimate', { replace: true }), 1500);
      return () => clearTimeout(t);
    }
  }, [roomNotFound, navigate]);

  if (roomNotFound) {
    return (
      <MeadowLayout>
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🕒</div>
          <h2 style={fredokaStyle} className="text-3xl font-bold text-[#2D1810] mb-2">Room not found</h2>
          <p className="text-[#4A2D1B]">It may have expired. Taking you back…</p>
        </div>
      </MeadowLayout>
    );
  }

  if (kicked) {
    return (
      <MeadowLayout>
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🚫</div>
          <h2 style={fredokaStyle} className="text-3xl font-bold text-[#2D1810] mb-2">Removed from game</h2>
          <p className="text-[#4A2D1B] mb-6">{error}</p>
          <button onClick={() => navigate('/guesstimate')} className="px-6 py-3 rounded-xl bg-[#E84A8B] text-white font-bold">
            Back to lobby
          </button>
        </div>
      </MeadowLayout>
    );
  }

  if (!connected) {
    return (
      <MeadowLayout>
        <div className="text-center py-20">
          <div className="text-5xl mb-4 animate-spin">⟳</div>
          <p style={fredokaStyle} className="text-2xl text-[#2D1810]">Reconnecting…</p>
          <p className="text-[#8B6347] mt-2 text-sm">Your spot is saved.</p>
        </div>
      </MeadowLayout>
    );
  }

  if (!state && urlCode) {
    return <QuickJoin roomCode={urlCode} joinGame={joinGame} error={error} />;
  }

  if (!state) {
    return (
      <MeadowLayout>
        <div className="text-center py-20"><p style={fredokaStyle} className="text-2xl text-[#2D1810]">Loading…</p></div>
      </MeadowLayout>
    );
  }

  if (state.status === 'finished') {
    return (
      <MeadowLayout>
        <Scoreboard state={state} myId={myId} onLeave={() => { leaveGame(); navigate('/guesstimate'); }} />
      </MeadowLayout>
    );
  }

  if (state.status === 'lobby' || state.status == null) {
    return (
      <MeadowLayout>
        <Lobby game={game} />
      </MeadowLayout>
    );
  }

  return (
    <MeadowLayout>
      <div className="flex items-center justify-between mb-4 text-sm text-[#8B6347]">
        <span style={fredokaStyle} className="text-lg font-bold text-[#2D1810]">Guesstimate</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowHelp(true)}
            aria-label="How to play"
            className="w-8 h-8 rounded-full bg-white border-2 border-[#FFE8C8] hover:border-[#E84A8B] text-[#2D1810] font-bold flex items-center justify-center"
            title="How to play"
          >?</button>
          <span className="font-mono bg-[#FFE8C8] px-3 py-1 rounded-lg text-[#2D1810] font-bold tracking-widest">
            {roomCode}
          </span>
        </div>
      </div>
      {showHelp && <HowToPlay onClose={() => setShowHelp(false)} />}

      {/* Live scoreboard strip */}
      <div className="flex gap-2 flex-wrap mb-4">
        {[...state.players].sort((a, b) => b.score - a.score).map(p => (
          <div
            key={p.id}
            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border-2 ${
              p.id === myId ? 'bg-[#E84A8B] text-white border-[#C73B73]' : 'bg-white text-[#2D1810] border-[#FFE8C8]'
            } ${!p.connected ? 'opacity-40' : ''}`}
          >
            <span>{p.username}</span>
            <span className="ml-1 font-bold">{p.score}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-[#8B6347] mb-3">Round {state.currentRound} of {state.totalRounds}</p>

      <PhaseBanner phase={state.phase} />

      {error && !kicked && (
        <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {state.phase === 'answering' && <AnsweringPhase game={game} />}
      {state.phase === 'betting'   && <BettingPhase   game={game} />}
      {state.phase === 'reveal'    && <RevealPhase    game={game} />}
    </MeadowLayout>
  );
}

function QuickJoin({ roomCode, joinGame, error }) {
  const [name, setName] = React.useState('');
  return (
    <MeadowLayout>
      <div className="max-w-sm mx-auto">
        <h2 style={fredokaStyle} className="text-3xl font-bold text-[#2D1810] mb-2 text-center">Join game</h2>
        <p className="text-center text-[#8B6347] mb-6">Room <span className="font-mono font-bold">{roomCode}</span></p>
        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={e => { e.preventDefault(); if (name.trim()) joinGame(roomCode, name); }} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            maxLength={20}
            className="w-full px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#3D8B5A] focus:outline-none text-[#2D1810] bg-[#FFFDF8]"
          />
          <button type="submit" className="w-full py-3 rounded-xl bg-[#E84A8B] text-white font-bold text-lg" style={fredokaStyle}>
            Join
          </button>
        </form>
      </div>
    </MeadowLayout>
  );
}
