import { useCallback, useEffect, useState } from 'react';
import { pingDailyComplete } from '../lib/pingEvent';

const BACKEND_URL =
  process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
const API = `${BACKEND_URL}/api/daily`;

const ANON_KEY = 'dh_anon';
const STREAK_KEY = 'dh_streak';
const LASTDAY_KEY = 'dh_lastDay';

function getAnonId() {
  try {
    let id = localStorage.getItem(ANON_KEY);
    if (!id) {
      id = 'a_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(ANON_KEY, id);
    }
    return id;
  } catch {
    return 'a_anon';
  }
}

function readStreak() {
  try { return Number(localStorage.getItem(STREAK_KEY)) || 0; } catch { return 0; }
}

// Update streak when a day is completed. Consecutive days increment; a gap resets to 1.
function commitStreak(dayNumber) {
  try {
    const last = Number(localStorage.getItem(LASTDAY_KEY));
    const cur = readStreak();
    let next;
    if (last === dayNumber) next = cur || 1;        // already counted today
    else if (last === dayNumber - 1) next = cur + 1; // consecutive
    else next = 1;                                   // first or gap
    localStorage.setItem(STREAK_KEY, String(next));
    localStorage.setItem(LASTDAY_KEY, String(dayNumber));
    return next;
  } catch {
    return readStreak();
  }
}

/**
 * status: 'loading' | 'intro' | 'playing' | 'submitting' | 'result' | 'error'
 */
export function useDailyHerd() {
  const [status, setStatus] = useState('loading');
  const [dayNumber, setDayNumber] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState(null);
  const [streak, setStreak] = useState(readStreak());
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const anonId = getAnonId();
        const r = await fetch(`${API}/today?anonId=${encodeURIComponent(anonId)}`);
        if (!r.ok) throw new Error('fetch failed');
        const data = await r.json();
        if (cancelled) return;
        setDayNumber(data.dayNumber);
        setQuestions(data.questions || []);
        if (data.alreadyPlayed && data.result) {
          setResult(data.result);
          setStreak(readStreak());
          setStatus('result');
        } else {
          setStatus('intro');
        }
      } catch (e) {
        if (!cancelled) { setError('Could not reach the herd. Check your connection and refresh.'); setStatus('error'); }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const start = useCallback(() => setStatus('playing'), []);

  const submit = useCallback(async (answers) => {
    setError(null);
    setStatus('submitting');
    try {
      const anonId = getAnonId();
      const r = await fetch(`${API}/answer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayNumber, anonId, answers }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || 'submit failed');
      setResult(data);
      setStreak(commitStreak(dayNumber));
      setStatus('result');
      pingDailyComplete('daily-herd', { day: dayNumber, score: data?.syncPct, total: 100 });
      return data;
    } catch (e) {
      setError("Couldn't submit your answers. Please try again.");
      setStatus('playing');
      return null;
    }
  }, [dayNumber]);

  return { status, dayNumber, questions, result, streak, error, start, submit };
}
