import { useCallback, useEffect, useRef, useState } from 'react';
import { pingDailyComplete } from '../../lib/pingEvent';
import { sfx } from '../daily/sfx';
import { MAX_WRONG, dealWord, isSolved } from './hangmanData';

/*
  Hangman — state machine.

  status: 'playing' | 'won' | 'lost' | 'over'

  'over' is the END OF THE RUN (a word was missed), while 'lost' is the reveal
  for the word just missed. Collapsing them would either skip the reveal — so
  the player never learns the answer — or leave the run apparently continuing
  after it had ended.

  A guessed letter is recorded whether or not it was in the word: the keyboard
  must show what has already been tried, and re-guessing the same wrong letter
  must not cost a second life.
*/

const BEST_KEY = 'hangman_best_streak';

function readBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
}
function writeBest(v) {
  try { localStorage.setItem(BEST_KEY, String(v)); } catch { /* private mode */ }
}

export function useHangman() {
  const [status, setStatus] = useState('playing');
  const [round, setRound] = useState(dealWord);
  const [guessed, setGuessed] = useState([]);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useState(readBest);
  const [isNewBest, setIsNewBest] = useState(false);

  const timerRef = useRef(null);
  const clear = () => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } };
  useEffect(() => clear, []);

  const nextWord = useCallback(() => {
    clear();
    setRound(dealWord());
    setGuessed([]);
    setWrong(0);
    setStatus('playing');
  }, []);

  const start = useCallback(() => {
    clear();
    setStreak(0);
    setIsNewBest(false);
    setRound(dealWord());
    setGuessed([]);
    setWrong(0);
    setStatus('playing');
  }, []);

  const guess = useCallback((letter) => {
    if (status !== 'playing') return;
    if (guessed.includes(letter)) return;      // already tried — costs nothing

    const next = [...guessed, letter];
    setGuessed(next);

    if (round.word.includes(letter)) {
      if (isSolved(round.word, next)) {
        sfx.next();
        const nextStreak = streak + 1;
        setStreak(nextStreak);
        // Bank as we go rather than at the end of the run: a player who walks
        // away on a good streak should still keep the score.
        if (nextStreak > readBest()) { writeBest(nextStreak); setBest(nextStreak); setIsNewBest(true); }
        setStatus('won');
        timerRef.current = setTimeout(nextWord, 1600);
      }
      return;
    }

    const wrongNow = wrong + 1;
    setWrong(wrongNow);
    if (wrongNow >= MAX_WRONG) {
      sfx.miss();
      setStatus('lost');
      // Show the answer before ending the run — losing without being told the
      // word is the fastest way to make someone close the tab.
      timerRef.current = setTimeout(() => setStatus('over'), 2200);
    }
  }, [status, guessed, round, streak, wrong, nextWord]);

  const savedRef = useRef(false);
  useEffect(() => {
    if (status !== 'over') { savedRef.current = false; return; }
    if (savedRef.current) return;
    savedRef.current = true;
    if (streak >= 10) sfx.win();
    pingDailyComplete('hangman', { score: streak });
  }, [status, streak]);

  return {
    status, guessed, wrong, streak, best, isNewBest,
    word: round.word,
    category: round.category,
    livesLeft: MAX_WRONG - wrong,
    maxWrong: MAX_WRONG,
    start, guess, playAgain: start,
  };
}
