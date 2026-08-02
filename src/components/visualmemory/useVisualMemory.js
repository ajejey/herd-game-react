import { useCallback, useEffect, useRef, useState } from 'react';
import { pingDailyComplete } from '../../lib/pingEvent';
import { sfx } from '../daily/sfx';
import { LIVES, FLASH_MS, buildPattern, gridFor, countFor } from './visualData';

/*
  Visual Memory Test — state machine.

  status: 'idle' | 'show' | 'recall' | 'cleared' | 'failed' | 'over'

  Order does NOT matter here — the player taps the lit squares in any order.
  That is the whole difference from the Chimp Test, and it means a tap is
  judged by set membership rather than against an expected next value.

  'cleared' and 'failed' are separate statuses rather than one "reveal" flag:
  they look nothing alike on screen, and reusing one for both is how a success
  ends up flashing a failure colour.
*/

const BEST_KEY = 'visualmemory_best';

function readBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
}
function writeBest(v) {
  try { localStorage.setItem(BEST_KEY, String(v)); } catch { /* private mode */ }
}

export function useVisualMemory() {
  const [status, setStatus] = useState('idle');
  const [level, setLevel] = useState(1);
  const [pattern, setPattern] = useState([]);
  const [found, setFound] = useState([]);
  const [missed, setMissed] = useState([]);
  const [lives, setLives] = useState(LIVES);
  const [best, setBest] = useState(readBest);
  const [isNewBest, setIsNewBest] = useState(false);

  const timerRef = useRef(null);
  const clear = () => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } };
  useEffect(() => clear, []);

  const deal = useCallback((lv) => {
    clear();
    setPattern(buildPattern(lv));
    setFound([]);
    setMissed([]);
    setStatus('show');
    timerRef.current = setTimeout(() => setStatus('recall'), FLASH_MS);
  }, []);

  const start = useCallback(() => {
    setLives(LIVES);
    setLevel(1);
    setIsNewBest(false);
    deal(1);
  }, [deal]);

  const tap = useCallback((cell) => {
    if (status !== 'recall') return;
    if (found.includes(cell) || missed.includes(cell)) return;   // already resolved

    if (!pattern.includes(cell)) {
      sfx.miss();
      setMissed((m) => [...m, cell]);
      const livesLeft = lives - 1;
      setLives(livesLeft);
      setStatus('failed');
      timerRef.current = setTimeout(() => {
        if (livesLeft <= 0) setStatus('over');
        else deal(level);                 // retry the same level
      }, 1400);
      return;
    }

    const next = [...found, cell];
    setFound(next);
    if (next.length < pattern.length) return;

    // Whole pattern found. Bank the level straight away — waiting for game over
    // would mean a player had to LOSE before a good score was ever saved.
    sfx.next();
    if (level > readBest()) { writeBest(level); setBest(level); setIsNewBest(true); }
    setStatus('cleared');
    const nextLevel = level + 1;
    timerRef.current = setTimeout(() => { setLevel(nextLevel); deal(nextLevel); }, 700);
  }, [status, found, missed, pattern, lives, level, deal]);

  /* The highest level actually completed — the figure people quote. */
  const reached = status === 'over' ? level - 1 : level;

  const savedRef = useRef(false);
  useEffect(() => {
    if (status !== 'over') { savedRef.current = false; return; }
    if (savedRef.current) return;
    savedRef.current = true;
    const got = level - 1;
    if (got >= 9) sfx.win();
    pingDailyComplete('visual-memory-test', { score: got });
  }, [status, level]);

  return {
    status, pattern, found, missed, level, lives, best, isNewBest, reached,
    maxLives: LIVES,
    grid: gridFor(level),
    squares: countFor(level),
    start, tap, playAgain: start,
  };
}
