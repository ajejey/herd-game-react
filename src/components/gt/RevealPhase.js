import React from 'react';
import { fredokaStyle } from '../MeadowLayout';
import Chalkboard from './Chalkboard';
import { TrophyIcon } from './icons/Icons';
import AdSlot from '../AdSlot';

export default function RevealPhase({ game }) {
  const { state, myId, isHost, sendAction } = game;
  const { round, winner, totalRounds, currentRound } = state;

  const winningSlot = round.board[round.winningBoardIndex];
  const winningAuthors = winningSlot?.authors ?? [];
  const isFinalRound = state.status === 'finished';

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl border-2 border-[#FFE8C8] p-4 mb-4 text-center">
        <p className="text-xs uppercase tracking-widest text-[#8B6347] mb-1">Round {currentRound} of {totalRounds}</p>
        <p style={fredokaStyle} className="text-base md:text-lg text-[#2D1810] font-bold">{round.question}</p>
      </div>

      {/* Big reveal */}
      <div className="text-center mb-4">
        <p className="text-sm text-[#8B6347]">The actual answer is…</p>
        <p style={fredokaStyle} className="text-4xl md:text-5xl text-[#E84A8B] font-bold my-2">{round.actualAnswer}</p>
        <p className="text-sm text-[#4A2D1B]">
          Closest without going over: <strong>{winningSlot?.number ?? '—'}</strong>
          {winningAuthors.length > 0 && (
            <> by <strong>{winningAuthors.map(a => a.username).join(', ')}</strong></>
          )}
        </p>
      </div>

      {/* Chalkboard showing the winner */}
      <Chalkboard
        board={round.board}
        winningIndex={round.winningBoardIndex}
        actualAnswer={round.actualAnswer}
        interactive={false}
      />

      {/* Round scores */}
      <div className="bg-[#FFFBE8] rounded-2xl border-2 border-[#FFD56B] p-4 mb-4">
        <h3 style={fredokaStyle} className="font-bold text-[#2D1810] mb-2">This round</h3>
        {state.players.map(p => {
          const delta = round.scores?.[p.id] ?? 0;
          return (
            <div key={p.id} className="flex justify-between text-sm py-1">
              <span className={`font-semibold ${p.id === myId ? 'text-[#E84A8B]' : 'text-[#2D1810]'}`}>
                {p.username} {p.id === myId ? '(you)' : ''}
              </span>
              <span className={`font-bold ${delta > 0 ? 'text-[#3D8B5A]' : 'text-[#8B6347]'}`}>
                {delta > 0 ? `+${delta}` : '—'} → {p.score}
              </span>
            </div>
          );
        })}
      </div>

      {/* Ad — reveal screen, high attention */}
      <div className="mb-4 max-h-[280px] overflow-hidden">
        <AdSlot slot="5698170537" />
      </div>

      {isFinalRound ? (
        <div className="text-center">
          <div className="flex justify-center mb-2"><TrophyIcon size={64} /></div>
          <p style={fredokaStyle} className="text-3xl font-bold text-[#2D1810]">
            {winner?.username} wins!
          </p>
          <p className="text-[#8B6347] mt-1">Final scoreboard below.</p>
        </div>
      ) : isHost ? (
        <button
          onClick={() => sendAction('next_round')}
          className="w-full py-4 rounded-2xl font-bold text-white text-xl"
          style={{ background: '#E84A8B', fontFamily: 'Fredoka, sans-serif' }}
        >
          Next round →
        </button>
      ) : (
        <p className="text-center text-[#8B6347] text-sm py-2">Waiting for host to start the next round…</p>
      )}
    </div>
  );
}
