import { useCallback, useEffect, useRef, useState } from 'react';
import { pingDailyComplete } from '../../lib/pingEvent';
import { sfx } from '../daily/sfx';
import { DURATION_S, buildRound } from './colourData';

/*
  Colour Match — state machine.

  status: 'idle' | 'playing' | 'over'

  Same clock discipline as Maths Sprint: the deadline is a performance.now()
  timestamp, not an accumulated counter. A counter drifts and pauses when the
  tab backgrounds, which would quietly hand a longer game to anyone who
  switched apps mid-run.

  A wrong answer costs time rather than ending the run — that keeps a 60-second
  game from ending in the first four seconds, which would feel punishing rather
  than hard.
*/

const BEST_KEY = 'cm_best';
const WRONG_PENALTY_MS = 1500;

function readBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
}
function writeBest(v) {
  try { localStorage.setItem(BEST_KEY, String(v)); } catch { /* private mode */ }
}

export function useColourMatch() {
  const [status, setStatus] = useState('idle');
  const [round, setRound] = useState(null);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [flash, setFlash] = useState(null);      // 'ok' | 'no'
  const [remaining, setRemaining] = useState(DURATION_S);
  const [best, setBest] = useState(readBest);
  const [isNewBest, setIsNewBest] = useState(false);

  const deadlineRef = useRef(0);
  const tickRef = useRef(null);
  const flashRef = useRef(null);

  const clearTimers = () => {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
    if (flashRef.current) { clearTimeout(flashRef.current); flashRef.current = null; }
  };
  useEffect(() => clearTimers, []);

  const start = useCallback(() => {
    clearTimers();
    setScore(0); setWrong(0); setFlash(null); setIsNewBest(false);
    setRound(buildRound());
    setRemaining(DURATION_S);
    deadlineRef.current = performance.now() + DURATION_S * 1000;
    setStatus('playing');

    tickRef.current = setInterval(() => {
      const left = Math.max(0, (deadlineRef.current - performance.now()) / 1000);
      setRemaining(left);
      if (left <= 0) { clearTimers(); setStatus('over'); }
    }, 100);
  }, []);

  const answer = useCallback((colourId) => {
    if (status !== 'playing' || !round) return;
    const correct = colourId === round.answer.id;
    if (correct) { sfx.next(); setScore((s) => s + 1); setFlash('ok'); }
    else {
      sfx.miss();
      setWrong((w) => w + 1);
      setFlash('no');
      deadlineRef.current -= WRONG_PENALTY_MS;    // costs time, not the run
    }
    setRound(buildRound());
    if (flashRef.current) clearTimeout(flashRef.current);
    flashRef.current = setTimeout(() => setFlash(null), 200);
  }, [status, round]);

  const savedRef = useRef(false);
  useEffect(() => {
    if (status !== 'over') { savedRef.current = false; return; }
    if (savedRef.current) return;
    savedRef.current = true;
    if (score > readBest()) { writeBest(score); setBest(score); setIsNewBest(true); }
    if (score >= 26) sfx.win();
    pingDailyComplete('colour-match', { score, wrong });
  }, [status, score, wrong]);

  return {
    status, round, score, wrong, flash, best, isNewBest,
    remaining: Math.ceil(remaining),
    duration: DURATION_S,
    penaltySeconds: WRONG_PENALTY_MS / 1000,
    start, answer, playAgain: start,
  };
}
