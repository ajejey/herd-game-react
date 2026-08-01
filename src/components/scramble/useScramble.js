import { useCallback, useEffect, useRef, useState } from 'react';
import { pingDailyComplete } from '../../lib/pingEvent';
import { sfx } from '../daily/sfx';
import { LIVES, buildRound } from './scrambleData';

/*
  Word Scramble — state machine.

  status: 'idle' | 'playing' | 'reveal' | 'over'

  Letters are ARRANGED by tapping tiles rather than typed. A text input would
  summon the phone keyboard over the puzzle and invite autocorrect to "help".
  Tapping a scrambled tile moves it into your answer; tapping it in the answer
  sends it back. That also makes an invalid answer impossible — you can only
  ever use the letters you were given, exactly once each.

  No timers, so none of the tick races that produced real bugs elsewhere apply.
*/

const BEST_KEY = 'scr_best';
const RECENT_MEMORY = 8;    // avoid immediate repeats of the same word

function readBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
}
function writeBest(v) {
  try { localStorage.setItem(BEST_KEY, String(v)); } catch { /* private mode */ }
}

export function useScramble() {
  const [status, setStatus] = useState('idle');
  const [round, setRound] = useState(null);
  const [tiles, setTiles] = useState([]);      // { ch, used }
  const [picked, setPicked] = useState([]);    // indexes into tiles, in order
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(LIVES);
  const [best, setBest] = useState(readBest);
  const [isNewBest, setIsNewBest] = useState(false);
  const recentRef = useRef([]);

  const deal = useCallback((forScore) => {
    const r = buildRound(forScore, recentRef.current);
    recentRef.current = [r.word, ...recentRef.current].slice(0, RECENT_MEMORY);
    setRound(r);
    setTiles(r.letters.map((ch) => ({ ch })));
    setPicked([]);
  }, []);

  const start = useCallback(() => {
    setScore(0);
    setLives(LIVES);
    setIsNewBest(false);
    recentRef.current = [];
    deal(0);
    setStatus('playing');
  }, [deal]);

  const answer = picked.map((i) => tiles[i]?.ch || '').join('');

  /** Tap a scrambled tile to append it to the answer. */
  const pickTile = useCallback((index) => {
    if (status !== 'playing') return;
    setPicked((p) => (p.includes(index) ? p : [...p, index]));
  }, [status]);

  /** Tap a letter in the answer to send it back. */
  const unpick = useCallback((slot) => {
    if (status !== 'playing') return;
    setPicked((p) => p.filter((_, i) => i !== slot));
  }, [status]);

  const clear = useCallback(() => setPicked([]), []);

  const submit = useCallback(() => {
    if (status !== 'playing' || !round) return;
    if (picked.length !== round.word.length) return;   // incomplete
    const correct = answer === round.word;
    if (correct) { sfx.next(); setScore((s) => s + 1); }
    else { sfx.miss(); setLives((l) => l - 1); }
    setStatus('reveal');
  }, [status, round, picked.length, answer]);

  const next = useCallback(() => {
    if (status !== 'reveal') return;
    if (lives <= 0) { setStatus('over'); return; }
    // Deal for the score AFTER this round so difficulty ramps correctly.
    deal(score);
    setStatus('playing');
  }, [status, lives, deal, score]);

  const savedRef = useRef(false);
  useEffect(() => {
    if (status !== 'over') { savedRef.current = false; return; }
    if (savedRef.current) return;
    savedRef.current = true;
    if (score > readBest()) { writeBest(score); setBest(score); setIsNewBest(true); }
    if (score >= 9) sfx.win();
    pingDailyComplete('word-scramble', { score });
  }, [status, score]);

  const wasCorrect = status === 'reveal' && answer === round?.word;

  return {
    status, round, tiles, picked, answer, score, lives, best, isNewBest, wasCorrect,
    maxLives: LIVES,
    complete: !!round && picked.length === round.word.length,
    start, pickTile, unpick, clear, submit, next, playAgain: start,
  };
}
