import { useCallback, useEffect, useRef, useState } from 'react';
import { pingDailyComplete } from '../../lib/pingEvent';
import { sfx } from '../daily/sfx';
import { LIVES, buildLevel, countForLevel } from './chimpData';

/*
  Chimp Test — state machine.

  status: 'idle' | 'memorise' | 'recall' | 'cleared' | 'failed' | 'over'

  The real test hides the numbers the moment you tap the FIRST tile, not after
  a timer. That is what makes it a working-memory task rather than a reading
  speed test, and it also means the only timer here is the brief pause before a
  new level appears — cleared on unmount like everywhere else.
*/

const BEST_KEY = 'chimp_best';

function readBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
}
function writeBest(v) {
  try { localStorage.setItem(BEST_KEY, String(v)); } catch { /* private mode */ }
}

export function useChimpTest() {
  const [status, setStatus] = useState('idle');
  const [level, setLevel] = useState(0);
  const [tiles, setTiles] = useState([]);
  const [nextNum, setNextNum] = useState(1);
  const [lives, setLives] = useState(LIVES);
  const [best, setBest] = useState(readBest);
  const [isNewBest, setIsNewBest] = useState(false);

  const timerRef = useRef(null);
  const clear = () => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } };
  useEffect(() => clear, []);

  const deal = useCallback((lv) => {
    clear();
    setTiles(buildLevel(lv));
    setNextNum(1);
    setStatus('memorise');
  }, []);

  const start = useCallback(() => {
    setLives(LIVES);
    setLevel(0);
    setIsNewBest(false);
    deal(0);
  }, [deal]);

  /* Highest count successfully cleared — the number people actually quote. */
  const reached = countForLevel(level) - (status === 'over' ? 1 : 0);

  const tap = useCallback((num) => {
    if (status !== 'memorise' && status !== 'recall') return;

    // The first tap hides every remaining number: that is the whole test.
    if (status === 'memorise') setStatus('recall');

    if (num !== nextNum) {
      sfx.miss();
      const livesLeft = lives - 1;
      setLives(livesLeft);
      setStatus('failed');
      timerRef.current = setTimeout(() => {
        if (livesLeft <= 0) setStatus('over');
        else deal(level);            // retry the same level
      }, 1200);
      return;
    }

    if (nextNum >= tiles.length) {
      // Level cleared. 'cleared' is its own status, NOT a reuse of 'failed' —
      // the two look completely different on screen and flashing a failure
      // after a success would be a nasty little bug.
      sfx.next();
      // Bank the best as soon as the level is cleared. Saving only in the
      // status === 'over' effect meant you had to LOSE to record a score —
      // clear 12 numbers, close the tab, and it was never saved.
      const cleared = tiles.length;
      if (cleared > readBest()) { writeBest(cleared); setBest(cleared); setIsNewBest(true); }
      const nextLevel = level + 1;
      setLevel(nextLevel);
      setStatus('cleared');
      setNextNum(1);
      timerRef.current = setTimeout(() => deal(nextLevel), 600);
      return;
    }

    setNextNum((n) => (n > num ? n : n + 1));
  }, [status, nextNum, tiles.length, lives, level, deal]);

  const savedRef = useRef(false);
  useEffect(() => {
    if (status !== 'over') { savedRef.current = false; return; }
    if (savedRef.current) return;
    savedRef.current = true;
    const got = countForLevel(level);
    if (got > readBest()) { writeBest(got); setBest(got); setIsNewBest(true); }
    if (got >= 9) sfx.win();
    pingDailyComplete('chimp-test', { score: got });
  }, [status, level]);

  return {
    status, tiles, nextNum, level, lives, best, isNewBest,
    maxLives: LIVES,
    count: countForLevel(level),
    reached,
    start, tap, playAgain: start,
  };
}
