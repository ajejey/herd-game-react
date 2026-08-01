import { useCallback, useEffect, useRef, useState } from 'react';
import { pingDailyComplete } from '../../lib/pingEvent';
import { sfx } from '../daily/sfx';
import { LIVES, buildRound } from './orderData';

/*
  Put in Order — state machine.

  status: 'idle' | 'playing' | 'reveal' | 'over'

  Ordering is done by TAP-TO-SWAP rather than drag and drop: on a phone, drag
  reorder is fiddly, fights the page scroll, and is close to impossible with
  assistive tech. Tap one item, tap another, they swap. Same result, works
  everywhere, and needs no pointer events.

  No timers anywhere, so none of the tick races that produced real bugs in the
  earlier solo games can occur here.
*/

const BEST_KEY = 'ord_best';

function readBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
}
function writeBest(v) {
  try { localStorage.setItem(BEST_KEY, String(v)); } catch { /* private mode */ }
}

export function useInOrder() {
  const [status, setStatus] = useState('idle');
  const [round, setRound] = useState(null);
  const [order, setOrder] = useState([]);        // current arrangement (items)
  const [selected, setSelected] = useState(null); // index awaiting a swap partner
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [best, setBest] = useState(readBest);
  const [isNewBest, setIsNewBest] = useState(false);

  const deal = useCallback(() => {
    const r = buildRound();
    setRound(r);
    setOrder(r ? r.items.slice() : []);
    setSelected(null);
  }, []);

  const start = useCallback(() => {
    setScore(0);
    setLives(LIVES);
    setIsNewBest(false);
    deal();
    setStatus('playing');
  }, [deal]);

  /** Tap an item: first tap selects, second swaps. Tapping it again clears. */
  const tap = useCallback((index) => {
    if (status !== 'playing') return;
    setSelected((sel) => {
      if (sel === null) return index;
      if (sel === index) return null;
      setOrder((o) => {
        const next = o.slice();
        [next[sel], next[index]] = [next[index], next[sel]];
        return next;
      });
      return null;
    });
  }, [status]);

  const submit = useCallback(() => {
    if (status !== 'playing' || !round) return;
    const correct = order.every((it, i) => it.n === round.answer[i]);
    if (correct) { sfx.next(); setScore((s) => s + 1); }
    else { sfx.miss(); setLives((l) => l - 1); }
    setSelected(null);
    setStatus('reveal');
  }, [status, round, order]);

  const next = useCallback(() => {
    if (status !== 'reveal') return;
    if (lives <= 0) { setStatus('over'); return; }
    deal();
    setStatus('playing');
  }, [status, lives, deal]);

  const savedRef = useRef(false);
  useEffect(() => {
    if (status !== 'over') { savedRef.current = false; return; }
    if (savedRef.current) return;
    savedRef.current = true;
    if (score > readBest()) { writeBest(score); setBest(score); setIsNewBest(true); }
    if (score >= 9) sfx.win();
    pingDailyComplete('put-in-order', { score });
  }, [status, score]);

  const wasCorrect = status === 'reveal' && !!round
    && order.every((it, i) => it.n === round.answer[i]);

  return {
    status, round, order, selected, score, lives, best, isNewBest, wasCorrect,
    maxLives: LIVES,
    start, tap, submit, next, playAgain: start,
  };
}
