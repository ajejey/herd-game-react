import { useCallback, useRef, useState } from 'react';
import { pingDailyComplete } from '../../lib/pingEvent';
import { sfx } from '../daily/sfx';
import { TARGETS, randomSpot, averageMs } from './aimData';

/*
  Aim Trainer — state machine.

  status: 'idle' | 'running' | 'over'

  Timing starts on the FIRST hit, not on a start button, and that first hit is
  not counted towards the average — otherwise the score would include however
  long the player spent reading the instructions.

  LOWER IS BETTER. Every "best" comparison in this file is therefore the other
  way round from the rest of the hub, and a zero best means "none yet" rather
  than "a perfect run".
*/

const BEST_KEY = 'aim_best_avg_ms';

function readBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
}
function writeBest(v) {
  try { localStorage.setItem(BEST_KEY, String(v)); } catch { /* private mode */ }
}
/* A lower average wins; 0 means there is no previous best to beat. */
function isBetter(candidate, previous) {
  return previous <= 0 || candidate < previous;
}

export function useAimTrainer() {
  const [status, setStatus] = useState('idle');
  const [spot, setSpot] = useState(randomSpot);
  const [hits, setHits] = useState(0);
  const [avg, setAvg] = useState(0);
  const [best, setBest] = useState(readBest);
  const [isNewBest, setIsNewBest] = useState(false);

  const startedAt = useRef(0);

  const reset = useCallback(() => {
    setStatus('idle');
    setHits(0);
    setAvg(0);
    setIsNewBest(false);
    setSpot(randomSpot());
  }, []);

  const hit = useCallback(() => {
    if (status === 'over') return;

    if (status === 'idle') {
      // The starting hit only starts the clock — counting it would fold the
      // player's reading time into their average.
      startedAt.current = Date.now();
      setStatus('running');
      setHits(0);
      setSpot(randomSpot());
      return;
    }

    const done = hits + 1;
    setHits(done);
    setSpot(randomSpot());

    if (done >= TARGETS) {
      const got = averageMs(Date.now() - startedAt.current, TARGETS);
      setAvg(got);
      setStatus('over');
      if (isBetter(got, readBest())) { writeBest(got); setBest(got); setIsNewBest(true); }
      if (got < 650) sfx.win();
      pingDailyComplete('aim-trainer', { score: got, total: TARGETS });
      return;
    }
    sfx.next();
  }, [status, hits]);

  return {
    status, spot, hits, avg, best, isNewBest,
    total: TARGETS,
    remaining: Math.max(0, TARGETS - hits),
    hit, reset, playAgain: reset,
  };
}
