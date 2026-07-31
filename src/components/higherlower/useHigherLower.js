import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { pingDailyComplete } from '../../lib/pingEvent';
import { CAT_BY_ID, CATEGORIES, isFairPair } from './hlData';

/*
  Higher or Lower — endless single-player logic. Fully client-side: no backend,
  no daily gate, play as many runs as you like.

  The loop is the classic chain: the left card is revealed, the right card is
  hidden, and you say whether the hidden one is higher or lower. Get it right
  and the right card slides left and becomes the new anchor — so one good run
  is one long unbroken chain, which is what makes it hard to put down.

  Ties count as CORRECT: never punish the player for an ambiguity in our bank.
*/

const BEST_KEY = 'hl_best';   // { [categoryId]: number }
const PLAYS_KEY = 'hl_plays';

function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* A fair opponent for `anchor`: far enough away in value that the answer is
   knowable rather than a coin flip. Falls back to the largest available gap so
   we can always produce a round. */
function pickOpponent(anchor, pool, category) {
  const fair = pool.filter((it) => isFairPair(category, anchor, it));
  const from = fair.length ? fair : pool;
  if (!from.length) return null;
  return from[Math.floor(Math.random() * from.length)];
}

/** status: 'menu' | 'playing' | 'reveal' | 'over' */
export function useHigherLower() {
  const [categoryId, setCategoryId] = useState(null);
  const [status, setStatus] = useState('menu');
  const [anchor, setAnchor] = useState(null);
  const [challenger, setChallenger] = useState(null);
  const [used, setUsed] = useState([]);          // names already shown this run
  const [score, setScore] = useState(0);
  const [lastGuess, setLastGuess] = useState(null); // 'higher' | 'lower'
  const [lastCorrect, setLastCorrect] = useState(null);
  const [best, setBest] = useState(() => readJSON(BEST_KEY, {}));
  const [isNewBest, setIsNewBest] = useState(false);

  const timerRef = useRef(null);
  useEffect(() => () => clearTimeout(timerRef.current), []);

  const category = categoryId ? CAT_BY_ID[categoryId] : null;

  /* Items not yet shown this run. When the bank is exhausted we recycle
     everything except the current anchor, so a strong run never dead-ends. */
  const remaining = useMemo(() => {
    if (!category) return [];
    const left = category.items.filter((it) => !used.includes(it.n));
    if (left.length) return left;
    return category.items.filter((it) => it.n !== anchor?.n);
  }, [category, used, anchor]);

  const start = useCallback((catId) => {
    const cat = CAT_BY_ID[catId];
    if (!cat) return;
    const deck = shuffle(cat.items);
    const first = deck[0];
    const second = pickOpponent(first, deck.slice(1), cat);
    setCategoryId(catId);
    setAnchor(first);
    setChallenger(second);
    setUsed([first.n, second.n]);
    setScore(0);
    setLastGuess(null);
    setLastCorrect(null);
    setIsNewBest(false);
    setStatus('playing');
  }, []);

  const guess = useCallback((direction) => {
    if (status !== 'playing' || !anchor || !challenger) return;
    // Ties are generous: either answer is accepted.
    const correct =
      challenger.v === anchor.v ||
      (direction === 'higher' ? challenger.v > anchor.v : challenger.v < anchor.v);

    setLastGuess(direction);
    setLastCorrect(correct);
    setStatus('reveal');

    timerRef.current = setTimeout(() => {
      if (!correct) {
        const finalScore = score;
        const prevBest = best[categoryId] || 0;
        if (finalScore > prevBest) {
          const next = { ...best, [categoryId]: finalScore };
          setBest(next);
          writeJSON(BEST_KEY, next);
          setIsNewBest(true);
        }
        writeJSON(PLAYS_KEY, (readJSON(PLAYS_KEY, 0) || 0) + 1);
        pingDailyComplete('higher-or-lower', { score: finalScore, category: categoryId });
        setStatus('over');
        return;
      }

      // Correct: the challenger slides across and becomes the new anchor.
      const nextAnchor = challenger;
      const pool = remaining.filter((it) => it.n !== nextAnchor.n);
      const nextChallenger = pickOpponent(nextAnchor, pool, category);
      if (!nextChallenger) { setStatus('over'); return; }

      setScore((s) => s + 1);
      setAnchor(nextAnchor);
      setChallenger(nextChallenger);
      setUsed((u) => (u.length >= (category?.items.length || 0) ? [nextAnchor.n, nextChallenger.n] : [...u, nextChallenger.n]));
      setLastGuess(null);
      setLastCorrect(null);
      setStatus('playing');
    }, correct ? 900 : 1400);
  }, [status, anchor, challenger, score, best, categoryId, remaining, category]);

  const playAgain = useCallback(() => { if (categoryId) start(categoryId); }, [categoryId, start]);
  const toMenu = useCallback(() => { clearTimeout(timerRef.current); setStatus('menu'); }, []);

  return {
    status, category, categories: CATEGORIES,
    anchor, challenger, score, lastGuess, lastCorrect,
    best: categoryId ? best[categoryId] || 0 : 0, allBest: best, isNewBest,
    start, guess, playAgain, toMenu,
  };
}
