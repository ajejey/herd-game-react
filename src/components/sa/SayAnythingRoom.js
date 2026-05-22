import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MeadowLayout, { fredokaStyle } from '../MeadowLayout';
import { useSayAnything } from '../../hooks/useSayAnything';
import Lobby from './Lobby';
import PickingPhase from './PickingPhase';
import AnsweringPhase from './AnsweringPhase';
import JudgingPhase from './JudgingPhase';
import BettingPhase from './BettingPhase';
import RevealPhase from './RevealPhase';
import Scoreboard from './Scoreboard';
import HowToPlay from './HowToPlay';

export default function SayAnythingRoom() {
  const { roomCode: urlCode } = useParams();
  const navigate = useNavigate();
  const game = useSayAnything();
  const { state, myId, roomCode, connected, kicked, roomNotFound, error, joinGame, leaveGame } = game;
  const [showHelp, setShowHelp] = React.useState(false);

  // Stale URL — game cleaned up. Bounce to lobby.
  useEffect(() => {
    if (roomNotFound) {
      const t = setTimeout(() => navigate('/say-anything', { replace: true }), 1500);
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
          <button onClick={() => navigate('/say-anything')} className="px-6 py-3 rounded-xl bg-[#E84A8B] text-white font-bold">
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
          <p className="text-[#8B6347] mt-2 text-sm">Your spot is saved. Hang tight.</p>
        </div>
      </MeadowLayout>
    );
  }

  // Player landed on the URL but has no session — show a quick name prompt
  if (!state && urlCode) {
    return <QuickJoin roomCode={urlCode} joinGame={joinGame} error={error} />;
  }

  if (!state) {
    return (
      <MeadowLayout>
        <div className="text-center py-20">
          <p style={fredokaStyle} className="text-2xl text-[#2D1810]">Loading…</p>
        </div>
      </MeadowLayout>
    );
  }

  const { phase, status } = state;

  if (status === 'finished') {
    return (
      <MeadowLayout>
        <Scoreboard state={state} myId={myId} onLeave={() => { leaveGame(); navigate('/say-anything'); }} />
      </MeadowLayout>
    );
  }

  if (status === 'lobby') {
    return (
      <MeadowLayout>
        <Lobby game={game} />
      </MeadowLayout>
    );
  }

  return (
    <MeadowLayout>
      {/* Top bar */}
      <div className="flex items-center justify-between mb-4 text-sm text-[#8B6347]">
        <span style={fredokaStyle} className="text-lg font-bold text-[#2D1810]">Say Anything</span>
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
            {state.players[state.judgeIndex]?.id === p.id && <span>⚖️</span>}
            <span>{p.username}</span>
            <span className="ml-1 font-bold">{p.score}</span>
          </div>
        ))}
      </div>

      {/* Round indicator */}
      <p className="text-xs text-[#8B6347] mb-4">Round {state.currentRound}</p>

      {/* Judge disconnect / stuck-round banner — host only sees the action */}
      <JudgeDisconnectBanner game={game} />

      {/* Transient error toast */}
      {error && !kicked && (
        <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Phase */}
      {phase === 'picking'   && <PickingPhase   game={game} />}
      {phase === 'answering' && <AnsweringPhase game={game} />}
      {phase === 'judging'   && <JudgingPhase   game={game} />}
      {phase === 'betting'   && <BettingPhase   game={game} />}
      {phase === 'reveal'    && <RevealPhase    game={game} />}
    </MeadowLayout>
  );
}

function JudgeDisconnectBanner({ game }) {
  const { state, judge, isHost, sendAction } = game;
  const activePhases = ['picking', 'answering', 'judging', 'betting'];
  if (!judge || judge.connected || !activePhases.includes(state.phase)) return null;

  return (
    <div className="mb-4 px-4 py-3 bg-amber-50 border-2 border-amber-300 rounded-xl flex items-center justify-between gap-3 flex-wrap">
      <div className="text-sm text-amber-900">
        <span className="font-bold">⚠️ {judge.username}</span> (the judge) disconnected.
      </div>
      {isHost ? (
        <button
          onClick={() => sendAction('cancel_round')}
          className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold"
        >
          Skip round →
        </button>
      ) : (
        <span className="text-xs text-amber-700">Host can skip the round.</span>
      )}
    </div>
  );
}

function QuickJoin({ roomCode, joinGame, error }) {
  const [name, setName] = React.useState('');

  function handle(e) {
    e.preventDefault();
    if (name.trim()) joinGame(roomCode, name);
  }

  return (
    <MeadowLayout>
      <div className="max-w-sm mx-auto">
        <h2 style={fredokaStyle} className="text-3xl font-bold text-[#2D1810] mb-2 text-center">Join game</h2>
        <p className="text-center text-[#8B6347] mb-6">Room <span className="font-mono font-bold">{roomCode}</span></p>
        {error && <p className="text-red-600 text-sm mb-4 text-center">{error}</p>}
        <form onSubmit={handle} className="space-y-4">
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
