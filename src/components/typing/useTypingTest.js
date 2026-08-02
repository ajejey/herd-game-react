import { useCallback, useEffect, useRef, useState } from 'react';
import { pingDailyComplete } from '../../lib/pingEvent';
import { sfx } from '../daily/sfx';
import { DURATION, REFILL_AT, REFILL_SIZE, dealWords, wpmFrom, accuracyFrom } from './typingData';

/*
  Typing Speed Test — state machine.

  status: 'idle' | 'running' | 'over'

  The clock starts on the FIRST KEYSTROKE, not when the page loads and not on a
  "start" button. Anything else measures how fast someone finds the text box.

  Remaining time is derived from a start timestamp rather than decremented on
  each tick: a plain `t - 1` interval drifts badly on a backgrounded mobile tab,
  which would quietly hand out inflated WPM scores.
*/

const WARMUP_SEC = 5;   // hold the live WPM back until it means something

const BEST_KEY = 'typing_best_wpm';

function readBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
}
function writeBest(v) {
  try { localStorage.setItem(BEST_KEY, String(v)); } catch { /* private mode */ }
}

export function useTypingTest() {
  const [status, setStatus] = useState('idle');
  const [words, setWords] = useState(() => dealWords());
  const [wordIdx, setWordIdx] = useState(0);
  const [typed, setTyped] = useState('');
  const [results, setResults] = useState([]);      // true/false per committed word
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [correctChars, setCorrectChars] = useState(0);
  const [typedChars, setTypedChars] = useState(0);
  const [best, setBest] = useState(readBest);
  const [isNewBest, setIsNewBest] = useState(false);

  const startedAt = useRef(0);
  const timerRef = useRef(null);
  const clear = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; } };
  useEffect(() => clear, []);

  const reset = useCallback(() => {
    clear();
    setWords(dealWords());
    setWordIdx(0);
    setTyped('');
    setResults([]);
    setTimeLeft(DURATION);
    setCorrectChars(0);
    setTypedChars(0);
    setIsNewBest(false);
    setStatus('idle');
  }, []);

  const begin = useCallback(() => {
    startedAt.current = Date.now();
    setStatus('running');
    timerRef.current = setInterval(() => {
      const left = DURATION - Math.floor((Date.now() - startedAt.current) / 1000);
      if (left <= 0) {
        clear();
        setTimeLeft(0);
        setStatus('over');
      } else {
        setTimeLeft(left);
      }
    }, 100);
  }, []);

  /* Commit the current word and move on. Grading is all-or-nothing per word. */
  const commit = useCallback((value) => {
    const target = words[wordIdx] || '';
    const ok = value === target;
    // +1 on each side for the space that separates words — that space is a real
    // keystroke and every other typing test counts it.
    setTypedChars((c) => c + value.length + 1);
    if (ok) setCorrectChars((c) => c + target.length + 1);
    setResults((r) => [...r, ok]);
    setTyped('');
    setWordIdx((i) => i + 1);
    // Top the stream up long before it runs dry. If it ever empties, `target`
    // silently becomes '' and every correctly typed word is scored wrong.
    setWords((w) => (wordIdx >= w.length - REFILL_AT ? [...w, ...dealWords(REFILL_SIZE)] : w));
    if (!ok) sfx.miss();
  }, [words, wordIdx]);

  const onType = useCallback((value) => {
    if (status === 'over') return;
    if (status === 'idle') {
      if (!value) return;          // an empty change must not start the clock
      begin();
    }
    if (value.endsWith(' ')) {
      const word = value.slice(0, -1);
      if (!word) return;           // a leading space is a no-op, not an empty word
      commit(word);
      return;
    }
    setTyped(value);
  }, [status, begin, commit]);

  const elapsed = status === 'over' ? DURATION : Math.max(1, DURATION - timeLeft);
  const wpm = wpmFrom(correctChars, elapsed);

  /*
    The live readout is meaningless for the first few seconds: one word typed
    one second in divides out to 72 WPM, and the number then collapses as the
    denominator grows — measured live it ran 72 → 7 → 9 → 10. A figure that
    swings by an order of magnitude reads as a broken counter, so hold it back
    until there is enough elapsed time for it to mean anything. The FINAL score
    is unaffected: it always divides by the full DURATION.
  */
  const liveWpm = elapsed >= WARMUP_SEC ? wpm : null;
  const accuracy = accuracyFrom(correctChars, typedChars);
  const correctWords = results.filter(Boolean).length;

  const savedRef = useRef(false);
  useEffect(() => {
    if (status !== 'over') { savedRef.current = false; return; }
    if (savedRef.current) return;
    savedRef.current = true;
    const got = wpmFrom(correctChars, DURATION);
    if (got > readBest()) { writeBest(got); setBest(got); setIsNewBest(true); }
    if (got >= 60) sfx.win();
    pingDailyComplete('typing-test', { score: got, total: accuracyFrom(correctChars, typedChars) });
  }, [status, correctChars, typedChars]);

  return {
    status, words, wordIdx, typed, results, timeLeft,
    wpm, liveWpm, accuracy, correctWords, best, isNewBest,
    duration: DURATION,
    onType, reset, playAgain: reset,
  };
}
