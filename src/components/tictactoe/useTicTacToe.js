import { useCallback, useEffect, useRef, useState } from 'react';
import { pingDailyComplete } from '../../lib/pingEvent';
import { sfx } from '../daily/sfx';
import { HUMAN, ROBOT, LEVELS, winnerOf, isFull, robotMove } from './tttData';

/*
  Tic Tac Toe — state machine.

  status: 'playing' | 'thinking' | 'won' | 'lost' | 'draw'

  'thinking' exists so the board is LOCKED while the computer takes its turn.
  Without it a fast player can place a second mark before the reply lands, and
  the game quietly ends up with two X's for every O.

  The reply is deliberately delayed a beat. An instant answer reads as though
  the move was pre-decided rather than a response, and there is no honesty cost
  — the search itself takes about 15ms.
*/

const REPLY_MS = 420;
const RECORD_KEY = 'ttt_record';

function readRecord() {
  try {
    const raw = JSON.parse(localStorage.getItem(RECORD_KEY) || '{}');
    return { won: raw.won || 0, drawn: raw.drawn || 0, lost: raw.lost || 0 };
  } catch { return { won: 0, drawn: 0, lost: 0 }; }
}
function writeRecord(r) {
  try { localStorage.setItem(RECORD_KEY, JSON.stringify(r)); } catch { /* private mode */ }
}

export function useTicTacToe() {
  const [level, setLevel] = useState(LEVELS[2]);      // Impossible by default
  const [board, setBoard] = useState(() => Array(9).fill(null));
  const [status, setStatus] = useState('playing');
  const [line, setLine] = useState(null);
  const [record, setRecord] = useState(readRecord);

  const timerRef = useRef(null);
  const clear = () => { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } };
  useEffect(() => clear, []);

  const settle = useCallback((next, result, winLine) => {
    setBoard(next);
    setLine(winLine || null);
    setStatus(result);
    const updated = { ...readRecord() };
    if (result === 'won') { updated.won += 1; sfx.win(); }
    else if (result === 'lost') { updated.lost += 1; sfx.miss(); }
    else { updated.drawn += 1; sfx.next(); }
    writeRecord(updated);
    setRecord(updated);
    pingDailyComplete('tic-tac-toe', { score: updated.won, won: result === 'won' });
  }, []);

  const reset = useCallback((lv) => {
    clear();
    if (lv) setLevel(lv);
    setBoard(Array(9).fill(null));
    setLine(null);
    setStatus('playing');
  }, []);

  const play = useCallback((i) => {
    if (status !== 'playing') return;     // locked while thinking or finished
    if (board[i]) return;

    const afterHuman = board.slice();
    afterHuman[i] = HUMAN;

    const humanWin = winnerOf(afterHuman);
    if (humanWin) { settle(afterHuman, 'won', humanWin.line); return; }
    if (isFull(afterHuman)) { settle(afterHuman, 'draw', null); return; }

    setBoard(afterHuman);
    setStatus('thinking');

    clear();
    timerRef.current = setTimeout(() => {
      const move = robotMove(afterHuman, level.id);
      // A full board would return -1; the isFull check above rules it out, but
      // acting on -1 would silently write to board[-1] and corrupt nothing
      // visible until much later.
      if (move < 0) { settle(afterHuman, 'draw', null); return; }

      const afterRobot = afterHuman.slice();
      afterRobot[move] = ROBOT;

      const robotWin = winnerOf(afterRobot);
      if (robotWin) { settle(afterRobot, 'lost', robotWin.line); return; }
      if (isFull(afterRobot)) { settle(afterRobot, 'draw', null); return; }

      setBoard(afterRobot);
      setStatus('playing');
    }, REPLY_MS);
  }, [status, board, level, settle]);

  const clearRecord = useCallback(() => {
    const empty = { won: 0, drawn: 0, lost: 0 };
    writeRecord(empty);
    setRecord(empty);
  }, []);

  const done = status === 'won' || status === 'lost' || status === 'draw';

  return {
    board, status, line, level, record, done,
    levels: LEVELS,
    play,
    changeLevel: (lv) => reset(lv),
    playAgain: () => reset(),
    clearRecord,
  };
}
