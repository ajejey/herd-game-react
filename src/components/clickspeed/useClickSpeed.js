import { useCallback, useEffect, useRef, useState } from 'react';
import { pingDailyComplete } from '../../lib/pingEvent';
import { sfx } from '../daily/sfx';
import { DURATION_MS, cpsFrom } from './clickData';

/*
  Click Speed Test — state machine.

  status: 'idle' | 'running' | 'over'

  The clock starts on the first click, and that first click counts. Starting it
  on a separate button would measure reaction time as much as click speed.

  Every click re-checks the elapsed time itself rather than trusting the end
  timer to have fired. A setTimeout on a busy main thread — and this test
  deliberately floods the main thread with events — can land late, and each
  late click would be a free point on the score.
*/

const BEST_KEY = 'clickspeed_best_cps';

function readBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
}
function writeBest(v) {
  try { localStorage.setItem(BEST_KEY, String(v)); } catch { /* private mode */ }
}

export function useClickSpeed() {
  const [status, setStatus] = useState('idle');
  const [clicks, setClicks] = useState(0);
  const [msLeft, setMsLeft] = useState(DURATION_MS);
  const [best, setBest] = useState(readBest);
  const [isNewBest, setIsNewBest] = useState(false);

  const startedAt = useRef(0);
  const tickRef = useRef(null);
  const endRef = useRef(null);
  const clear = () => {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
    if (endRef.current) { clearTimeout(endRef.current); endRef.current = null; }
  };
  useEffect(() => clear, []);

  const finish = useCallback(() => {
    clear();
    setMsLeft(0);
    setStatus('over');
  }, []);

  const hit = useCallback(() => {
    if (status === 'over') return;

    if (status === 'idle') {
      startedAt.current = Date.now();
      setStatus('running');
      setClicks(1);                      // the click that starts the clock counts
      tickRef.current = setInterval(() => {
        setMsLeft(Math.max(0, DURATION_MS - (Date.now() - startedAt.current)));
      }, 50);
      endRef.current = setTimeout(finish, DURATION_MS);
      return;
    }

    if (Date.now() - startedAt.current >= DURATION_MS) { finish(); return; }
    setClicks((c) => c + 1);
  }, [status, finish]);

  const reset = useCallback(() => {
    clear();
    setClicks(0);
    setMsLeft(DURATION_MS);
    setIsNewBest(false);
    setStatus('idle');
  }, []);

  const cps = cpsFrom(clicks);

  const savedRef = useRef(false);
  useEffect(() => {
    if (status !== 'over') { savedRef.current = false; return; }
    if (savedRef.current) return;
    savedRef.current = true;
    const got = cpsFrom(clicks);
    if (got > readBest()) { writeBest(got); setBest(got); setIsNewBest(true); }
    if (got >= 8) sfx.win();
    // score is an integer column, so the click count is what we store; CPS is
    // just that divided by five and can always be recovered.
    pingDailyComplete('click-speed-test', { score: clicks });
  }, [status, clicks]);

  return {
    status, clicks, msLeft, cps, best, isNewBest,
    secondsLeft: (msLeft / 1000).toFixed(1),
    duration: DURATION_MS / 1000,
    hit, reset, playAgain: reset,
  };
}
