import { useCallback, useEffect, useRef, useState } from 'react';
import { pingDailyComplete } from '../../lib/pingEvent';
import { tone, sfx } from '../daily/sfx';
import { TILES, stepMsFor, randomTile } from './memoryData';

/*
  Herd Memory — state machine.

  status: 'idle' | 'showing' | 'input' | 'over'

  TIMER SAFETY is the whole design problem here. This game schedules 2N+1
  timeouts every round, and the two real bugs found in the other solo games were
  both timer/tick races. So playback lives entirely inside ONE effect whose
  cleanup cancels every timer it created and flips a `cancelled` flag. Changing
  status, starting a new round, or unmounting therefore cannot leave a stray
  timeout that lights a tile on a screen that has moved on.

  Nothing is scheduled outside that effect.
*/

const BEST_KEY = 'hm_best';

function readBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
}
function writeBest(v) {
  try { localStorage.setItem(BEST_KEY, String(v)); } catch { /* private mode */ }
}

export function useMemoryHerd() {
  const [status, setStatus] = useState('idle');
  const [sequence, setSequence] = useState([]);
  const [lit, setLit] = useState(null);       // tile id currently flashing
  const [inputIndex, setInputIndex] = useState(0);
  const [best, setBest] = useState(readBest);
  const [isNewBest, setIsNewBest] = useState(false);

  // Rounds survived = the length of the last sequence you repeated in full.
  const score = Math.max(0, sequence.length - 1);
  const round = sequence.length;

  /* ---- playback: the only place timers are created ---- */
  useEffect(() => {
    if (status !== 'showing' || !sequence.length) return undefined;

    let cancelled = false;
    const timers = [];
    const step = stepMsFor(sequence.length);
    const litMs = Math.max(160, step - 160);
    const at = (fn, ms) => timers.push(setTimeout(() => { if (!cancelled) fn(); }, ms));

    setLit(null);
    sequence.forEach((tileId, i) => {
      const start = 420 + i * step;              // small beat before it begins
      at(() => { setLit(tileId); tone(TILES[tileId].freq); }, start);
      at(() => setLit(null), start + litMs);
    });
    at(() => { setInputIndex(0); setStatus('input'); }, 420 + sequence.length * step + 120);

    return () => { cancelled = true; timers.forEach(clearTimeout); setLit(null); };
  }, [status, sequence]);

  const start = useCallback(() => {
    setSequence([randomTile()]);
    setInputIndex(0);
    setIsNewBest(false);
    setStatus('showing');
  }, []);

  const tap = useCallback((tileId) => {
    if (status !== 'input') return;             // ignore taps during playback

    if (tileId !== sequence[inputIndex]) {
      sfx.miss();
      setStatus('over');
      return;
    }

    tone(TILES[tileId].freq);
    setLit(tileId);
    setTimeout(() => setLit(null), 140);        // purely cosmetic flash

    const isRoundComplete = inputIndex + 1 >= sequence.length;
    if (!isRoundComplete) {
      // Plain value, not an updater: two taps in the same tick then resolve to
      // the same index rather than skipping one.
      setInputIndex(inputIndex + 1);
      return;
    }

    sfx.next();
    setSequence((s) => [...s, randomTile()]);
    setStatus('showing');
  }, [status, sequence, inputIndex]);

  /* ---- persist the best score once per finished run ---- */
  const savedRef = useRef(false);
  useEffect(() => {
    if (status !== 'over') { savedRef.current = false; return; }
    if (savedRef.current) return;
    savedRef.current = true;
    if (score > readBest()) { writeBest(score); setBest(score); setIsNewBest(true); }
    if (score >= 8) sfx.win();
    pingDailyComplete('herd-memory', { score });
  }, [status, score]);

  return {
    status, sequence, lit, inputIndex, round, score, best, isNewBest,
    tiles: TILES,
    start, tap, playAgain: start,
  };
}
