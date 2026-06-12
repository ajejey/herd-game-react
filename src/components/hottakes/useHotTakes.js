import { useCallback, useEffect, useState } from 'react';
import { pingDailyComplete } from '../../lib/pingEvent';

/*
  Daily Hot Takes logic. Crowd-tallied (backend), so it mirrors useDailyHerd:
  fetch today's questions, submit A/B picks, get back the archetype + crowd
  split. Streak is local; the completion ping fires for today's play only.
*/
const BACKEND_URL =
  process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
const API = `${BACKEND_URL}/api/hottakes`;

const ANON_KEY = 'hg_anon'; // shared anon id across daily games
const STREAK_KEY = 'ht_streak';
const LASTDAY_KEY = 'ht_lastDay';

function getAnonId() {
  try {
    let id = localStorage.getItem(ANON_KEY);
    if (!id) { id = 'a_' + Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem(ANON_KEY, id); }
    return id;
  } catch { return 'a_anon'; }
}
function readStreak() { try { return Number(localStorage.getItem(STREAK_KEY)) || 0; } catch { return 0; } }
function commitStreak(day) {
  try {
    const last = Number(localStorage.getItem(LASTDAY_KEY));
    const cur = readStreak();
    let next;
    if (last === day) next = cur || 1;
    else if (last === day - 1) next = cur + 1;
    else next = 1;
    localStorage.setItem(STREAK_KEY, String(next));
    localStorage.setItem(LASTDAY_KEY, String(day));
    return next;
  } catch { return readStreak(); }
}

/** status: 'loading' | 'intro' | 'playing' | 'submitting' | 'result' | 'error' */
export function useHotTakes() {
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
        const r = await fetch(`${API}/today?anonId=${encodeURIComponent(getAnonId())}`);
        if (!r.ok) throw new Error('fetch failed');
        const data = await r.json();
        if (cancelled) return;
        setDayNumber(data.dayNumber);
        setQuestions(data.questions || []);
        if (data.alreadyPlayed && data.result) { setResult(data.result); setStreak(readStreak()); setStatus('result'); }
        else setStatus('intro');
      } catch {
        if (!cancelled) { setError('Could not load today’s takes. Check your connection and refresh.'); setStatus('error'); }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const start = useCallback(() => setStatus('playing'), []);

  const submit = useCallback(async (picks) => {
    setError(null);
    setStatus('submitting');
    try {
      const r = await fetch(`${API}/answer`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dayNumber, anonId: getAnonId(), picks }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data?.error || 'submit failed');
      setResult(data);
      setStreak(commitStreak(dayNumber));
      pingDailyComplete('daily-hot-takes', { day: dayNumber, score: data.spice, total: data.total });
      setStatus('result');
      return data;
    } catch {
      setError('Couldn’t submit your takes. Please try again.');
      setStatus('playing');
      return null;
    }
  }, [dayNumber]);

  return { status, dayNumber, questions, result, streak, error, start, submit };
}
