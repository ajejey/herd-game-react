import { useCallback, useEffect, useRef, useState } from 'react';
import { pingDailyComplete } from '../../lib/pingEvent';
import { sfx } from '../daily/sfx';
import { ROUNDS, randomWait } from './reactionData';

/*
  Reaction Time — state machine.

  status: 'idle' | 'waiting' | 'go' | 'early' | 'result' | 'over'

  Timing uses performance.now() rather than Date.now(): it is monotonic, so a
  clock adjustment mid-round cannot produce a negative or absurd time.

  Only ONE timer is ever pending (the hold), and it lives in a ref that is
  cleared on every transition and on unmount — same discipline as Herd Memory,
  for the same reason.
*/

const BEST_KEY = 'rt_best';

function readBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
}
function writeBest(v) {
  try { localStorage.setItem(BEST_KEY, String(v)); } catch { /* private mode */ }
}

export function useReactionTime() {
  const [status, setStatus] = useState('idle');
  const [times, setTimes] = useState([]);
  const [last, setLast] = useState(null);
  const [best, setBest] = useState(readBest);
  const [isNewBest, setIsNewBest] = useState(false);

  const timerRef = useRef(null);
  const startedAtRef = useRef(0);

  const clear = () => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } };
  useEffect(() => clear, []);

  const arm = useCallback(() => {
    clear();
    setStatus('waiting');
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      startedAtRef.current = performance.now();
      sfx.next();
      setStatus('go');
    }, randomWait());
  }, []);

  const start = useCallback(() => {
    setTimes([]);
    setLast(null);
    setIsNewBest(false);
    arm();
  }, [arm]);

  /** The single tap handler for the big pad. */
  const tap = useCallback(() => {
    if (status === 'waiting') {
      // Tapped before the signal — no time recorded, retry the same round.
      clear();
      sfx.miss();
      setStatus('early');
      return;
    }
    if (status === 'go') {
      const ms = Math.round(performance.now() - startedAtRef.current);
      setLast(ms);
      setTimes((t) => (t.length >= ROUNDS ? t : [...t, ms]));
      setStatus('result');
      return;
    }
    if (status === 'early') { arm(); return; }        // tap to retry
    if (status === 'result') {
      if (times.length >= ROUNDS) { setStatus('over'); return; }
      arm();
    }
  }, [status, arm, times.length]);

  const average = times.length
    ? Math.round(times.reduce((s, t) => s + t, 0) / times.length)
    : 0;

  const savedRef = useRef(false);
  useEffect(() => {
    if (status !== 'over') { savedRef.current = false; return; }
    if (savedRef.current) return;
    savedRef.current = true;
    const prev = readBest();
    // Lower is better, and 0 means "no score yet".
    if (average > 0 && (prev === 0 || average < prev)) {
      writeBest(average); setBest(average); setIsNewBest(true);
    }
    if (average > 0 && average < 250) sfx.win();
    pingDailyComplete('reaction-time', { score: average, rounds: times.length });
  }, [status, average, times.length]);

  return {
    status, times, last, average, best, isNewBest,
    roundsTotal: ROUNDS, round: times.length,
    start, tap, playAgain: start,
  };
}
