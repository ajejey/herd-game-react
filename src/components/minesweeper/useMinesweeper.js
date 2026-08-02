import { useCallback, useEffect, useRef, useState } from 'react';
import { pingDailyComplete } from '../../lib/pingEvent';
import { sfx } from '../daily/sfx';
import { LEVELS, layMines, floodReveal, hasWon } from './mineData';

/*
  Minesweeper — state machine.

  status: 'idle' | 'playing' | 'won' | 'lost'

  Mines are laid on the FIRST TAP, not at setup, so the opening move can never
  be a mine (see mineData.layMines). Until then `counts` is empty and the board
  is entirely unknown — which is why every reader here guards on `counts.length`.

  The clock also starts on the first tap and is derived from a timestamp rather
  than incremented on a tick, so a backgrounded tab cannot under-report a time.
*/

const bestKey = (levelId) => `minesweeper_best_${levelId}`;

function readBest(levelId) {
  try { return Number(localStorage.getItem(bestKey(levelId))) || 0; } catch { return 0; }
}
function writeBest(levelId, v) {
  try { localStorage.setItem(bestKey(levelId), String(v)); } catch { /* private mode */ }
}

export function useMinesweeper() {
  const [level, setLevel] = useState(LEVELS[0]);
  const [status, setStatus] = useState('idle');
  const [counts, setCounts] = useState([]);
  const [mines, setMines] = useState(() => new Set());
  const [revealed, setRevealed] = useState(() => new Set());
  const [flagged, setFlagged] = useState(() => new Set());
  const [flagMode, setFlagMode] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [best, setBest] = useState(() => readBest(LEVELS[0].id));
  const [isNewBest, setIsNewBest] = useState(false);
  const [hitMine, setHitMine] = useState(null);

  const startedAt = useRef(0);
  const tickRef = useRef(null);
  const clear = () => { if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; } };
  useEffect(() => clear, []);

  const total = level.cols * level.rows;

  const reset = useCallback((lv = level) => {
    clear();
    setLevel(lv);
    setStatus('idle');
    setCounts([]);
    setMines(new Set());
    setRevealed(new Set());
    setFlagged(new Set());
    setSeconds(0);
    setIsNewBest(false);
    setHitMine(null);
    setBest(readBest(lv.id));
  }, [level]);

  const finish = useCallback((won, usedSeconds) => {
    clear();
    if (won) {
      sfx.win();
      setStatus('won');
      const prev = readBest(level.id);
      // A FASTER time wins, and 0 means "no time yet" — the same inverted
      // comparison the aim trainer needs, and just as easy to get backwards.
      if (prev <= 0 || usedSeconds < prev) {
        writeBest(level.id, usedSeconds);
        setBest(usedSeconds);
        setIsNewBest(true);
      }
    } else {
      sfx.miss();
      setStatus('lost');
    }
    pingDailyComplete('minesweeper', { score: usedSeconds, won, total: level.mines });
  }, [level]);

  const beginClock = useCallback(() => {
    startedAt.current = Date.now();
    tickRef.current = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startedAt.current) / 1000));
    }, 250);
  }, []);

  const tap = useCallback((i) => {
    if (status === 'won' || status === 'lost') return;

    // Flag mode: toggling a flag never reveals and never ends the game.
    if (flagMode) {
      if (revealed.has(i)) return;
      setFlagged((f) => {
        const n = new Set(f);
        if (n.has(i)) n.delete(i); else n.add(i);
        return n;
      });
      return;
    }

    if (flagged.has(i)) return;        // a flagged cell is protected from taps

    // First tap: lay the mines around it, then start the clock.
    if (status === 'idle') {
      const laid = layMines(level, i);
      const opened = floodReveal(i, laid.counts, new Set(), new Set(), level.cols, level.rows);
      setCounts(laid.counts);
      setMines(laid.mines);
      setRevealed(opened);
      setStatus('playing');
      beginClock();
      if (hasWon(opened, laid.mines, total)) finish(true, 0);
      return;
    }

    if (revealed.has(i)) return;

    if (mines.has(i)) {
      setHitMine(i);
      setRevealed((r) => new Set(r).add(i));
      finish(false, Math.floor((Date.now() - startedAt.current) / 1000));
      return;
    }

    const opened = floodReveal(i, counts, revealed, flagged, level.cols, level.rows);
    setRevealed(opened);
    if (hasWon(opened, mines, total)) finish(true, Math.floor((Date.now() - startedAt.current) / 1000));
  }, [status, flagMode, flagged, revealed, mines, counts, level, total, beginClock, finish]);

  /* Long-press / right-click flags without needing the mode toggle. */
  const flag = useCallback((i) => {
    if (status === 'won' || status === 'lost' || revealed.has(i)) return;
    setFlagged((f) => {
      const n = new Set(f);
      if (n.has(i)) n.delete(i); else n.add(i);
      return n;
    });
  }, [status, revealed]);

  return {
    level, status, counts, mines, revealed, flagged, flagMode, seconds, best, isNewBest, hitMine,
    levels: LEVELS,
    minesLeft: Math.max(0, level.mines - flagged.size),
    setFlagMode,
    tap, flag,
    changeLevel: (lv) => reset(lv),
    playAgain: () => reset(level),
  };
}
