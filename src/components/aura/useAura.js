import { useMemo, useRef, useState } from 'react';
import { getDailyAuraQuestions, scoreAura, getDayNumber } from './auraData';
import { readResult, saveResult, readStreak } from './share';
import { pingDailyComplete } from '../../lib/pingEvent';

/*
  Daily Aura logic (client-only). One vibe question at a time; picking an option
  advances. After the last question the answers are scored into an aura color,
  which is saved (per day) with a completion-based streak. Restores a finished
  result if today's aura was already revealed.
*/
export function useAura(day, { persist = true } = {}) {
  const questions = useMemo(() => getDailyAuraQuestions(day), [day]);
  const prior = persist ? readResult(day) : null;

  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState([]);
  const [status, setStatus] = useState(prior ? 'done' : 'intro'); // intro | playing | done
  const [result, setResult] = useState(prior ? { colorId: prior.colorId } : null);
  const [streak, setStreak] = useState(readStreak());
  const savedRef = useRef(!!prior);
  const alreadyPlayed = !!prior;

  const total = questions.length;
  const current = questions[idx];

  function start() {
    if (status === 'intro') setStatus('playing');
  }

  function choose(optIdx) {
    if (status !== 'playing') return;
    const nextPicks = [...picks, optIdx];
    setPicks(nextPicks);
    if (idx < total - 1) {
      setIdx((i) => i + 1);
    } else {
      const r = scoreAura(day, nextPicks, questions);
      setResult(r);
      setStatus('done');
      if (persist && !savedRef.current) {
        savedRef.current = true;
        const isToday = day === getDayNumber();
        setStreak(saveResult(day, r.colorId, isToday));
        if (isToday) pingDailyComplete('daily-aura', { day }); // archive plays don't count as today
      }
    }
  }

  return { questions, idx, current, total, status, result, streak, alreadyPlayed, start, choose };
}
