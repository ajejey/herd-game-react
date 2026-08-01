import { useCallback, useEffect, useRef, useState } from 'react';
import { pingDailyComplete } from '../../lib/pingEvent';
import { ROUNDS, MIN_YEAR, MAX_YEAR, drawFilms, scoreGuess } from './gtyData';

/*
  Guess the Year — state machine.

  status: 'intro' | 'guessing' | 'reveal' | 'over'

  A run is ROUNDS films. Each round the player parks a slider on a year and
  locks it in; the reveal shows the real year and the points, then they advance
  manually (no auto-advance timer — reading the answer is the fun part, and an
  auto-advance would rush it and create the same timer-race class of bug Higher
  or Lower had to guard against).

  Best score persists per device. Nothing here talks to the server except a
  fire-and-forget completion ping.
*/

const BEST_KEY = 'gty_best';
const MID_YEAR = Math.round((MIN_YEAR + MAX_YEAR) / 2);

function readBest() {
  try { return Number(localStorage.getItem(BEST_KEY)) || 0; } catch { return 0; }
}
function writeBest(v) {
  try { localStorage.setItem(BEST_KEY, String(v)); } catch { /* private mode */ }
}

export function useGuessTheYear() {
  const [status, setStatus] = useState('intro');
  const [films, setFilms] = useState([]);
  const [round, setRound] = useState(0);
  const [guess, setGuess] = useState(MID_YEAR);
  const [results, setResults] = useState([]);   // { film, guess, actual, diff, points }
  const [best, setBest] = useState(readBest);
  const [isNewBest, setIsNewBest] = useState(false);

  const total = results.reduce((s, r) => s + r.points, 0);
  const film = films[round] || null;

  const start = useCallback(() => {
    setFilms(drawFilms(ROUNDS));
    setRound(0);
    setGuess(MID_YEAR);
    setResults([]);
    setIsNewBest(false);
    setStatus('guessing');
  }, []);

  const lockIn = useCallback(() => {
    if (status !== 'guessing' || !film) return;
    const { diff, points } = scoreGuess(guess, film.v);
    setResults((r) => (r.length > round ? r : [...r, { film, guess, actual: film.v, diff, points }]));
    setStatus('reveal');
  }, [status, film, guess, round]);

  /* The `status` guard alone is NOT enough here.

     Three taps on "Next film" inside one tick all read the same pre-render
     status ('reveal') and the same `round`, so three `setRound(r => r + 1)`
     calls all applied and the run jumped from round 1 to round 4 — silently
     skipping two films and scoring the run out of 500 with only three answers.
     Caught in e2e testing. Making the round update idempotent for a given
     `round` makes every extra tap a no-op. */
  const next = useCallback(() => {
    if (status !== 'reveal') return;
    if (round + 1 >= ROUNDS) { setStatus('over'); return; }
    setRound((r) => (r > round ? r : r + 1));
    setGuess(MID_YEAR);
    setStatus('guessing');
  }, [status, round]);

  // Persist the best score once, when a run finishes.
  const savedRef = useRef(false);
  useEffect(() => {
    if (status !== 'over') { savedRef.current = false; return; }
    if (savedRef.current) return;
    savedRef.current = true;
    const prev = readBest();
    if (total > prev) { writeBest(total); setBest(total); setIsNewBest(true); }
    pingDailyComplete('guess-the-year', { score: total, rounds: ROUNDS });
  }, [status, total]);

  const lastResult = results[results.length - 1] || null;

  return {
    status, film, round, guess, setGuess, results, lastResult,
    total, best, isNewBest,
    roundsTotal: ROUNDS, minYear: MIN_YEAR, maxYear: MAX_YEAR,
    start, lockIn, next, playAgain: start,
  };
}
