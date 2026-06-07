import { useEffect, useMemo, useRef, useState } from 'react';
import { buildTiles } from './puzzles';
import { readResult, saveResult, readStreak } from './share';

const MAX_MISTAKES = 4;

/*
  Huddle game logic (client-only). Manages tile selection, group checking,
  mistakes (4 lives), the guess history (for the share grid), and win/lose.
  Restores a finished state if today's puzzle was already played.
*/
export function useHuddle(puzzle, day, { persist = true } = {}) {
  const initialTiles = useMemo(() => buildTiles(puzzle, day || 1), [puzzle, day]);

  const [tiles, setTiles] = useState(initialTiles);
  const [selected, setSelected] = useState([]); // words
  const [solved, setSolved] = useState([]); // [{level,name,words}]
  const [mistakes, setMistakes] = useState(0);
  const [rows, setRows] = useState([]); // guess history: [[lvl,lvl,lvl,lvl], ...]
  const [status, setStatus] = useState('playing'); // playing | won | lost
  const [message, setMessage] = useState('');
  const [streak, setStreak] = useState(readStreak());
  const [alreadyPlayed, setAlreadyPlayed] = useState(false);
  const savedRef = useRef(false);

  // Restore a finished game (already played today) → show result, reveal groups.
  useEffect(() => {
    const prior = persist ? readResult(day) : null;
    if (prior) {
      setSolved(orderedGroups(puzzle));
      setTiles([]);
      setSelected([]);
      setRows(prior.rows || []);
      setMistakes(prior.won ? 0 : MAX_MISTAKES);
      setStatus(prior.won ? 'won' : 'lost');
      setAlreadyPlayed(true);
      savedRef.current = true;
    }
  }, [day, puzzle, persist]);

  function toggle(word) {
    if (status !== 'playing') return;
    setMessage('');
    setSelected((sel) => {
      if (sel.includes(word)) return sel.filter((w) => w !== word);
      if (sel.length >= 4) return sel;
      return [...sel, word];
    });
  }

  function deselectAll() {
    if (status !== 'playing') return;
    setSelected([]);
  }

  function shuffle() {
    if (status !== 'playing') return;
    setTiles((t) => {
      const a = [...t];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    });
  }

  function finish(won, finalRows, finalSolved) {
    setStatus(won ? 'won' : 'lost');
    if (persist && !savedRef.current) {
      savedRef.current = true;
      const s = saveResult(day, won, finalRows);
      setStreak(s);
    }
    if (!won) setSolved(finalSolved);
  }

  function submit() {
    if (status !== 'playing' || selected.length !== 4) return;
    const chosen = tiles.filter((t) => selected.includes(t.word));
    const groupIdx = chosen[0].group;
    const allSame = chosen.every((t) => t.group === groupIdx);
    const row = chosen.map((t) => t.level);
    const newRows = [...rows, row];
    setRows(newRows);

    if (allSame) {
      const g = puzzle.groups[groupIdx];
      const newSolved = [...solved, { level: g.level, name: g.name, words: g.words }];
      setSolved(newSolved);
      setTiles((t) => t.filter((x) => !selected.includes(x.word)));
      setSelected([]);
      setMessage('Nice — got one!');
      if (newSolved.length === 4) finish(true, newRows, newSolved);
      return;
    }

    // wrong guess
    const m = mistakes + 1;
    setMistakes(m);
    setSelected([]);
    // "one away" hint: 3 of the 4 share a group
    const counts = {};
    chosen.forEach((t) => { counts[t.group] = (counts[t.group] || 0) + 1; });
    const oneAway = Object.values(counts).some((c) => c === 3);
    setMessage(oneAway ? 'So close — one away!' : 'Not a group. Try again.');

    if (m >= MAX_MISTAKES) {
      // reveal the unsolved groups, ordered by difficulty
      const solvedIdx = new Set(solved.map((s) => puzzle.groups.findIndex((g) => g.name === s.name)));
      const remaining = puzzle.groups
        .map((g) => ({ level: g.level, name: g.name, words: g.words }))
        .filter((_, i) => !solvedIdx.has(i));
      const finalSolved = [...solved, ...remaining.sort((a, b) => a.level - b.level)];
      setTiles([]);
      finish(false, newRows, finalSolved);
    }
  }

  return {
    tiles, selected, solved, mistakes, maxMistakes: MAX_MISTAKES,
    rows, status, message, streak, alreadyPlayed,
    toggle, deselectAll, shuffle, submit,
  };
}

function orderedGroups(puzzle) {
  return puzzle.groups.map((g) => ({ level: g.level, name: g.name, words: g.words }))
    .sort((a, b) => a.level - b.level);
}
