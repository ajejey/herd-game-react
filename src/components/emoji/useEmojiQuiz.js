import { useCallback, useEffect, useRef, useState } from 'react';
import { pingDailyComplete } from '../../lib/pingEvent';
import { sfx } from '../daily/sfx';
import { ROUNDS, buildQuiz } from './emojiData';

/*
  Emoji Movie Quiz — state machine.

  status: 'idle' | 'playing' | 'reveal' | 'over'

  No auto-advance timer: the reveal waits for a tap so you can actually read
  which film it was. Same reasoning as Odd One Out — it reads better AND avoids
  the tick-race class of bug that produced real defects in the earlier games.

  Both the answer and the advance are idempotent for a given round index, so a
  double-tap cannot double-score or skip a puzzle.
*/

const BEST_KEY = 'emq_best';

function readBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
}
function writeBest(v) {
  try { localStorage.setItem(BEST_KEY, String(v)); } catch { /* private mode */ }
}

export function useEmojiQuiz() {
  const [status, setStatus] = useState('idle');
  const [quiz, setQuiz] = useState([]);
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState(null);
  const [results, setResults] = useState([]);   // { emoji, answer, correct }
  const [best, setBest] = useState(readBest);
  const [isNewBest, setIsNewBest] = useState(false);

  const current = quiz[round] || null;
  const score = results.filter((r) => r.correct).length;

  const start = useCallback(() => {
    setQuiz(buildQuiz());
    setRound(0);
    setPicked(null);
    setResults([]);
    setIsNewBest(false);
    setStatus('playing');
  }, []);

  const pick = useCallback((index) => {
    if (status !== 'playing' || !current) return;
    const correct = index === current.answerIndex;
    setPicked(index);
    if (correct) sfx.next(); else sfx.miss();
    // Guarded on length so a double-tap records one answer, not two.
    setResults((r) => (r.length > round ? r : [...r, { emoji: current.emoji, answer: current.answer, correct }]));
    setStatus('reveal');
  }, [status, current, round]);

  const next = useCallback(() => {
    if (status !== 'reveal') return;
    if (round + 1 >= ROUNDS) { setStatus('over'); return; }
    setRound((r) => (r > round ? r : r + 1));   // idempotent: no skipped rounds
    setPicked(null);
    setStatus('playing');
  }, [status, round]);

  const savedRef = useRef(false);
  useEffect(() => {
    if (status !== 'over') { savedRef.current = false; return; }
    if (savedRef.current) return;
    savedRef.current = true;
    if (score > readBest()) { writeBest(score); setBest(score); setIsNewBest(true); }
    if (score >= 8) sfx.win();
    pingDailyComplete('emoji-movie-quiz', { score, rounds: ROUNDS });
  }, [status, score]);

  return {
    status, current, round, picked, results, score, best, isNewBest,
    roundsTotal: ROUNDS,
    wasCorrect: status === 'reveal' && picked === current?.answerIndex,
    start, pick, next, playAgain: start,
  };
}
