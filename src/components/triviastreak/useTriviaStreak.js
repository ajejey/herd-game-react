import { useCallback, useEffect, useRef, useState } from 'react';
import { pingDailyComplete } from '../../lib/pingEvent';
import { sfx } from '../daily/sfx';
import { LIVES, buildQuestion } from './streakData';

/*
  Trivia Streak — state machine.

  status: 'idle' | 'playing' | 'reveal' | 'over'

  Three lives and no timer. A timer would add tension but also a whole class of
  tick races, and reading a trivia question under a countdown is stressful in a
  way that suits a quiz show more than a phone on a sofa.

  Both pick() and next() are idempotent for the current question, so a
  double-tap can neither double-score nor skip a question.
*/

const BEST_KEY = 'ts_best';
const RECENT_MEMORY = 40;

function readBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
}
function writeBest(v) {
  try { localStorage.setItem(BEST_KEY, String(v)); } catch { /* private mode */ }
}

export function useTriviaStreak() {
  const [status, setStatus] = useState('idle');
  const [question, setQuestion] = useState(null);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [best, setBest] = useState(readBest);
  const [isNewBest, setIsNewBest] = useState(false);
  const recentRef = useRef([]);

  const deal = useCallback((forStreak) => {
    const q = buildQuestion(forStreak, recentRef.current);
    recentRef.current = [q.text, ...recentRef.current].slice(0, RECENT_MEMORY);
    setQuestion(q);
    setPicked(null);
  }, []);

  const start = useCallback(() => {
    setScore(0);
    setLives(LIVES);
    setIsNewBest(false);
    recentRef.current = [];
    deal(0);
    setStatus('playing');
  }, [deal]);

  const pick = useCallback((index) => {
    if (status !== 'playing' || !question) return;
    const correct = index === question.answerIndex;
    setPicked(index);
    if (correct) { sfx.next(); setScore((s) => s + 1); }
    else { sfx.miss(); setLives((l) => l - 1); }
    setStatus('reveal');
  }, [status, question]);

  const next = useCallback(() => {
    if (status !== 'reveal') return;
    if (lives <= 0) { setStatus('over'); return; }
    deal(score);
    setStatus('playing');
  }, [status, lives, deal, score]);

  const savedRef = useRef(false);
  useEffect(() => {
    if (status !== 'over') { savedRef.current = false; return; }
    if (savedRef.current) return;
    savedRef.current = true;
    if (score > readBest()) { writeBest(score); setBest(score); setIsNewBest(true); }
    if (score >= 13) sfx.win();
    pingDailyComplete('trivia-streak', { score });
  }, [status, score]);

  return {
    status, question, picked, score, lives, best, isNewBest,
    maxLives: LIVES,
    wasCorrect: status === 'reveal' && picked === question?.answerIndex,
    start, pick, next, playAgain: start,
  };
}
