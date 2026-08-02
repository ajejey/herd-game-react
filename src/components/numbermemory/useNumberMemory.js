import { useCallback, useEffect, useRef, useState } from 'react';
import { pingDailyComplete } from '../../lib/pingEvent';
import { sfx } from '../daily/sfx';
import { LIVES, START_DIGITS, buildNumber, showMsFor } from './numberData';

/*
  Number Memory Test — state machine.

  status: 'idle' | 'show' | 'recall' | 'right' | 'wrong' | 'over'

  'right' and 'wrong' are separate statuses rather than one "reveal" state with
  a boolean: they look completely different on screen, and reusing one status
  for both is how you end up flashing a red failure panel after a correct
  answer.
*/

const BEST_KEY = 'numbermemory_best';

function readBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
}
function writeBest(v) {
  try { localStorage.setItem(BEST_KEY, String(v)); } catch { /* private mode */ }
}

export function useNumberMemory() {
  const [status, setStatus] = useState('idle');
  const [digits, setDigits] = useState(START_DIGITS);
  const [number, setNumber] = useState('');
  const [entry, setEntry] = useState('');
  const [lives, setLives] = useState(LIVES);
  const [best, setBest] = useState(readBest);
  const [isNewBest, setIsNewBest] = useState(false);

  const timerRef = useRef(null);
  const clear = () => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } };
  useEffect(() => clear, []);

  const deal = useCallback((n) => {
    clear();
    setNumber(buildNumber(n));
    setEntry('');
    setStatus('show');
    timerRef.current = setTimeout(() => setStatus('recall'), showMsFor(n));
  }, []);

  const start = useCallback(() => {
    setLives(LIVES);
    setDigits(START_DIGITS);
    setIsNewBest(false);
    deal(START_DIGITS);
  }, [deal]);

  const submit = useCallback(() => {
    if (status !== 'recall') return;   // ignore a second submit while revealing
    clear();
    const ok = entry === number;
    if (ok) {
      sfx.next();
      /*
        Bank the best the MOMENT a length is cleared, not at game over.

        The save used to happen only in the status === 'over' effect, which
        meant you had to lose for your best to be recorded: clear ten digits,
        close the tab, and the score was gone. Playing well should never be the
        thing that loses your result.
      */
      if (digits > readBest()) { writeBest(digits); setBest(digits); setIsNewBest(true); }
      setStatus('right');
      const next = digits + 1;
      timerRef.current = setTimeout(() => { setDigits(next); deal(next); }, 900);
      return;
    }
    sfx.miss();
    const livesLeft = lives - 1;
    setLives(livesLeft);
    setStatus('wrong');
    timerRef.current = setTimeout(() => {
      if (livesLeft <= 0) setStatus('over');
      else deal(digits);               // retry the same length
    }, 1600);
  }, [status, entry, number, digits, lives, deal]);

  /* Digits only. A phone number pad still emits the odd stray character, and a
     rejected keystroke is far kinder than a wrong answer the player never made. */
  const onEntry = useCallback((value) => {
    setEntry(String(value).replace(/\D/g, '').slice(0, 24));
  }, []);

  /*
    The longest number successfully recalled — the figure people quote.

    `digits` only ever increases on a correct answer, so digits-1 is the last
    length cleared. But it STARTS at 3, so someone who fails the very first
    number without ever getting one right would be told they "reached 2" — a
    score they never actually earned, which would also be written to their
    personal best. Anyone still on the opening length has cleared nothing.
  */
  const reached = digits > START_DIGITS ? digits - 1 : 0;

  const savedRef = useRef(false);
  useEffect(() => {
    if (status !== 'over') { savedRef.current = false; return; }
    if (savedRef.current) return;
    savedRef.current = true;
    const got = digits > START_DIGITS ? digits - 1 : 0;
    if (got > readBest()) { writeBest(got); setBest(got); setIsNewBest(true); }
    if (got >= 10) sfx.win();
    pingDailyComplete('number-memory-test', { score: got });
  }, [status, digits]);

  return {
    status, number, entry, digits, lives, best, isNewBest, reached,
    maxLives: LIVES,
    start, submit, onEntry, playAgain: start,
  };
}
