import { useCallback, useEffect, useRef, useState } from 'react';
import { pingDailyComplete } from '../../lib/pingEvent';
import { sfx } from '../daily/sfx';
import { DURATION_S, buildQuestion } from './mathData';

/*
  Mental Maths Sprint — state machine.

  status: 'idle' | 'playing' | 'over'

  The clock is derived from a single deadline timestamp compared against
  performance.now(), NOT accumulated by decrementing a counter each tick. A
  decrementing counter drifts, and worse, pauses when a phone backgrounds the
  tab — which would hand anyone who switched apps a longer game. One interval
  drives the display only; the deadline is the source of truth.

  The interval is cleared on every transition and on unmount.
*/

const BEST_KEY = 'ms_best';

function readBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
}
function writeBest(v) {
  try { localStorage.setItem(BEST_KEY, String(v)); } catch { /* private mode */ }
}

export function useMathSprint() {
  const [status, setStatus] = useState('idle');
  const [question, setQuestion] = useState(null);
  const [entry, setEntry] = useState('');
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [flash, setFlash] = useState(null);      // 'ok' | 'no'
  const [remaining, setRemaining] = useState(DURATION_S);
  const [best, setBest] = useState(readBest);
  const [isNewBest, setIsNewBest] = useState(false);

  const deadlineRef = useRef(0);
  const tickRef = useRef(null);
  const flashRef = useRef(null);

  const clearTimers = () => {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
    if (flashRef.current) { clearTimeout(flashRef.current); flashRef.current = null; }
  };
  useEffect(() => clearTimers, []);

  const start = useCallback(() => {
    clearTimers();
    setScore(0); setWrong(0); setEntry(''); setFlash(null);
    setIsNewBest(false);
    setQuestion(buildQuestion(0));
    setRemaining(DURATION_S);
    deadlineRef.current = performance.now() + DURATION_S * 1000;
    setStatus('playing');

    tickRef.current = setInterval(() => {
      const left = Math.max(0, (deadlineRef.current - performance.now()) / 1000);
      setRemaining(left);
      if (left <= 0) { clearTimers(); setStatus('over'); }
    }, 100);
  }, []);

  const press = useCallback((key) => {
    if (status !== 'playing' || !question) return;

    if (key === 'del') { setEntry((e) => e.slice(0, -1)); return; }
    if (key === 'clear') { setEntry(''); return; }

    if (key === 'ok') {
      if (entry === '') return;
      const correct = Number(entry) === question.answer;
      if (correct) {
        sfx.next();
        setFlash('ok');
        setScore((s) => {
          const nextScore = s + 1;
          setQuestion(buildQuestion(nextScore));
          return nextScore;
        });
      } else {
        sfx.miss();
        setFlash('no');
        setWrong((w) => w + 1);
      }
      setEntry('');
      if (flashRef.current) clearTimeout(flashRef.current);
      flashRef.current = setTimeout(() => setFlash(null), 220);
      return;
    }

    // Digit. Cap the length so nobody can paste a novel into it.
    setEntry((e) => (e.length >= 5 ? e : e + key));
  }, [status, question, entry]);

  const savedRef = useRef(false);
  useEffect(() => {
    if (status !== 'over') { savedRef.current = false; return; }
    if (savedRef.current) return;
    savedRef.current = true;
    if (score > readBest()) { writeBest(score); setBest(score); setIsNewBest(true); }
    if (score >= 22) sfx.win();
    pingDailyComplete('math-sprint', { score, wrong });
  }, [status, score, wrong]);

  return {
    status, question, entry, score, wrong, flash, best, isNewBest,
    remaining: Math.ceil(remaining),
    duration: DURATION_S,
    start, press, playAgain: start,
  };
}
