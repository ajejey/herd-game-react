import { useCallback, useEffect, useRef, useState } from 'react';
import { pingDailyComplete } from '../../lib/pingEvent';
import { sfx } from '../daily/sfx';
import { LIVES, nextWord } from './verbalData';

/*
  Verbal Memory Test — state machine.

  status: 'idle' | 'playing' | 'over'

  The player is shown a word and says whether they have SEEN it this run or it
  is NEW. Both the word and the truth are held together in one piece of state:
  storing the word and recomputing "was it seen" at answer time would be a race
  waiting to happen, because `seen` is updated on every answer.

  A word is added to `seen` whether or not the player got it right — it HAS now
  been seen, and the next appearance must be judged against reality rather than
  against what the player believed.
*/

const MIN_GAP_MS = 150;   // shortest believable gap between two real answers

const BEST_KEY = 'verbalmemory_best';

function readBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
}
function writeBest(v) {
  try { localStorage.setItem(BEST_KEY, String(v)); } catch { /* private mode */ }
}

export function useVerbalMemory() {
  const [status, setStatus] = useState('idle');
  const [current, setCurrent] = useState(null);   // { word, isSeen }
  const [seen, setSeen] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [flash, setFlash] = useState(null);       // 'right' | 'wrong' | null
  const [best, setBest] = useState(readBest);
  const [isNewBest, setIsNewBest] = useState(false);

  const lastAnswerAt = useRef(0);
  const timerRef = useRef(null);
  const clear = () => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } };
  useEffect(() => clear, []);

  const start = useCallback(() => {
    clear();
    setSeen([]);
    setScore(0);
    setLives(LIVES);
    setFlash(null);
    setIsNewBest(false);
    lastAnswerAt.current = 0;
    setCurrent(nextWord([]));
    setStatus('playing');
  }, []);

  const answer = useCallback((saidSeen) => {
    if (status !== 'playing' || !current) return;

    /*
      Ignore a second answer landing within MIN_GAP_MS of the last one.

      Unlike every other game here there is no reveal pause: the next word
      appears the instant you answer. So an accidental double-tap does not just
      repeat an answer, it blind-answers a word the player never saw — and with
      the seen/new split near even that costs a life about half the time. A
      person needs longer than this to read a word and decide, so the guard can
      only ever swallow taps that were not deliberate.
    */
    const now = Date.now();
    if (now - lastAnswerAt.current < MIN_GAP_MS) return;
    lastAnswerAt.current = now;

    const correct = saidSeen === current.isSeen;
    // The word is now seen regardless of the answer given.
    const nextSeen = current.isSeen ? seen : [...seen, current.word];

    if (correct) {
      sfx.next();
      const nextScore = score + 1;
      setScore(nextScore);
      // Bank as we go: requiring game over to save would mean a player who
      // walked away on a good run recorded nothing.
      if (nextScore > readBest()) { writeBest(nextScore); setBest(nextScore); setIsNewBest(true); }
      setFlash('right');
    } else {
      sfx.miss();
      setFlash('wrong');
      const livesLeft = lives - 1;
      setLives(livesLeft);
      if (livesLeft <= 0) {
        setSeen(nextSeen);
        setCurrent(null);
        setStatus('over');
        return;
      }
    }

    setSeen(nextSeen);
    setCurrent(nextWord(nextSeen));
    timerRef.current = setTimeout(() => setFlash(null), 260);
  }, [status, current, seen, score, lives]);

  const savedRef = useRef(false);
  useEffect(() => {
    if (status !== 'over') { savedRef.current = false; return; }
    if (savedRef.current) return;
    savedRef.current = true;
    if (score >= 50) sfx.win();
    pingDailyComplete('verbal-memory-test', { score });
  }, [status, score]);

  return {
    status, current, score, lives, flash, best, isNewBest,
    maxLives: LIVES,
    seenCount: seen.length,
    start, answer, playAgain: start,
  };
}
