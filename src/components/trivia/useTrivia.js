import { useMemo, useRef, useState } from 'react';
import { getDailyQuestions } from './questions';
import { readResult, saveResult, readStreak } from './share';

/*
  Daily Trivia game logic (client-only). One question at a time: pick an option,
  see right/wrong, advance. After the last question the score + streak are saved.
  Restores a finished state if today's quiz was already played.
*/
export function useTrivia(day, { persist = true } = {}) {
  const questions = useMemo(() => getDailyQuestions(day), [day]);
  const prior = persist ? readResult(day) : null;

  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [marks, setMarks] = useState(prior ? prior.marks : []);
  const [status, setStatus] = useState(prior ? 'done' : 'playing');
  const [streak, setStreak] = useState(readStreak());
  const savedRef = useRef(!!prior);
  const alreadyPlayed = !!prior;

  const total = questions.length;
  const current = questions[idx];
  const score = marks.filter(Boolean).length;

  function answer(optionIdx) {
    if (answered || status !== 'playing') return;
    setSelected(optionIdx);
    setAnswered(true);
    setMarks((m) => [...m, optionIdx === current.answerIndex]);
  }

  function next() {
    if (!answered || status !== 'playing') return;
    if (idx < total - 1) {
      setIdx((i) => i + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setStatus('done');
      if (persist && !savedRef.current) {
        savedRef.current = true;
        setStreak(saveResult(day, marks.filter(Boolean).length, marks));
      }
    }
  }

  return {
    questions, idx, current, selected, answered, marks, status,
    score, total, streak, alreadyPlayed,
    answer, next,
  };
}
