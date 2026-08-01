import { useCallback, useEffect, useRef, useState } from 'react';
import { pingDailyComplete } from '../../lib/pingEvent';
import { sfx } from '../daily/sfx';
import { LIVES, buildRound } from './oddData';

/*
  Odd One Out — state machine.

  status: 'idle' | 'playing' | 'reveal' | 'over'

  Three lives rather than one: a single sudden death on a knowledge game feels
  arbitrary, and lives let a good run survive one unlucky category.

  There is no auto-advance timer. The reveal waits for a tap, which is both the
  more readable design (you get to see WHY you were wrong) and sidesteps the
  whole class of tick races that produced real bugs in the other solo games.
*/

const BEST_KEY = 'ooo_best';

function readBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
}
function writeBest(v) {
  try { localStorage.setItem(BEST_KEY, String(v)); } catch { /* private mode */ }
}

export function useOddOneOut() {
  const [status, setStatus] = useState('idle');
  const [round, setRound] = useState(null);
  const [picked, setPicked] = useState(null);     // index the player chose
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [best, setBest] = useState(readBest);
  const [isNewBest, setIsNewBest] = useState(false);

  const start = useCallback(() => {
    setRound(buildRound());
    setPicked(null);
    setScore(0);
    setLives(LIVES);
    setIsNewBest(false);
    setStatus('playing');
  }, []);

  const pick = useCallback((index) => {
    if (status !== 'playing' || !round) return;
    const correct = index === round.oddIndex;
    setPicked(index);
    if (correct) {
      sfx.next();
      setScore((s) => s + 1);
    } else {
      sfx.miss();
      setLives((l) => l - 1);
    }
    setStatus('reveal');
  }, [status, round]);

  const next = useCallback(() => {
    if (status !== 'reveal') return;
    // `lives` is already decremented by pick(); a wrong answer that took the
    // last life ends the run here.
    if (lives <= 0) { setStatus('over'); return; }
    setRound(buildRound());
    setPicked(null);
    setStatus('playing');
  }, [status, lives]);

  const savedRef = useRef(false);
  useEffect(() => {
    if (status !== 'over') { savedRef.current = false; return; }
    if (savedRef.current) return;
    savedRef.current = true;
    if (score > readBest()) { writeBest(score); setBest(score); setIsNewBest(true); }
    if (score >= 12) sfx.win();
    pingDailyComplete('odd-one-out', { score });
  }, [status, score]);

  const wasCorrect = status === 'reveal' && picked === round?.oddIndex;

  return {
    status, round, picked, score, lives, best, isNewBest, wasCorrect,
    maxLives: LIVES,
    start, pick, next, playAgain: start,
  };
}
