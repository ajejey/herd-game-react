import React, { useState } from 'react';
import { fredokaStyle } from '../MeadowLayout';
import AdSlot from '../AdSlot';

export default function AnsweringPhase({ game }) {
  const { state, myId, isJudge, judge, isHost, sendAction } = game;
  const { round } = state;
  const [text, setText] = useState('');

  const myAnswer = round.answers.find(a => a.playerId === myId);
  const answeredCount = round.answers.length;
  const eligibleCount = state.players.filter(
    p => p.connected && p.id !== state.players[state.judgeIndex]?.id
  ).length;

  if (isJudge) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="bg-white rounded-2xl border-2 border-[#FFE8C8] p-6 mb-4 text-center">
          <p className="text-xs text-[#8B6347] uppercase tracking-widest mb-2">The question</p>
          <p style={fredokaStyle} className="text-2xl text-[#2D1810] font-bold">{round.question}</p>
        </div>
        <div className="text-center py-6">
          <p className="text-[#4A2D1B] mb-1">
            <span className="font-bold text-[#E84A8B]">{answeredCount}</span> of {eligibleCount} answered
          </p>
          <p className="text-[#8B6347] text-sm">Waiting for everyone to answer…</p>
          {/* Ad — judge is passively waiting */}
          <div className="mt-6 max-h-[280px] overflow-hidden">
            <AdSlot slot="5698170537" />
          </div>

          {isHost && (
            <div className="mt-4 flex gap-2 justify-center flex-wrap">
              {answeredCount > 0 && (
                <button
                  onClick={() => sendAction('force_judging')}
                  className="px-5 py-2 rounded-xl border-2 border-[#8B6347] text-[#8B6347] text-sm font-semibold hover:bg-[#FFF5E8]"
                >
                  Skip slow players →
                </button>
              )}
              <button
                onClick={() => sendAction('cancel_round')}
                className="px-5 py-2 rounded-xl border-2 border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50"
              >
                Cancel round
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white rounded-2xl border-2 border-[#FFE8C8] p-6 mb-4 text-center">
        <p className="text-xs text-[#8B6347] uppercase tracking-widest mb-2">
          {judge?.username} asks…
        </p>
        <p style={fredokaStyle} className="text-2xl text-[#2D1810] font-bold">{round.question}</p>
      </div>

      {myAnswer ? (
        <div className="text-center py-6">
          <div className="inline-block bg-[#F0FFF4] border-2 border-[#3D8B5A] rounded-2xl px-6 py-4 mb-3">
            <p className="text-[#2D1810] font-semibold">Your answer:</p>
            <p style={fredokaStyle} className="text-xl text-[#3D8B5A] font-bold">{myAnswer.text}</p>
          </div>
          <p className="text-[#8B6347] text-sm">
            {answeredCount} of {eligibleCount} answered — waiting for others…
          </p>
        </div>
      ) : (
        <form
          onSubmit={e => {
            e.preventDefault();
            if (text.trim()) { sendAction('submit_answer', { text }); setText(''); }
          }}
          className="space-y-3"
        >
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="Say anything…"
            maxLength={120}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border-2 border-[#FFE8C8] focus:border-[#E84A8B] focus:outline-none text-[#2D1810] bg-[#FFFDF8] resize-none text-lg"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="w-full py-3 rounded-xl font-bold text-white text-lg disabled:opacity-40"
            style={{ background: '#E84A8B', fontFamily: 'Fredoka, sans-serif' }}
          >
            Submit answer
          </button>
        </form>
      )}
    </div>
  );
}
