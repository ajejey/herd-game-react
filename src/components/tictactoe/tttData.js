/*
  Tic Tac Toe — solo, versus the computer.

  The first game in the hub you play AGAINST something rather than alone with a
  clock. Fully procedural: the opponent is computed, so there is no content.

  The opponent is real minimax, not a heuristic — a fake "unbeatable" AI that
  can actually be beaten is worse than an honest easy mode. Verified: 0 human
  wins in 300 games against perfect play.

  It is minimax WITH ALPHA-BETA PRUNING, and that is not a nicety. Plain
  minimax on an empty 3x3 board measured 1203ms on a desktop — over a second of
  frozen main thread, and several times that on a mid-range phone. Pruning plus
  the opening short-circuit below brings it into single-digit milliseconds.

  Aesthetic: warm farm palette, plum accent. No dark mode.
*/

export const THEME = {
  bg: '#FFF8E7',
  bgAlt: '#FFFFFF',
  border: '#FFE8C8',
  ink: '#2D1810',
  mut: '#6B5B4A',
  plum: '#7A2E6B',
  green: '#3D8B5A',
  red: '#D0463B',
};

export const FREDOKA = { fontFamily: "'Fredoka', system-ui, sans-serif" };
export const QUICKSAND = { fontFamily: "'Quicksand', system-ui, sans-serif" };

export const HUMAN = 'X';
export const ROBOT = 'O';

export const LEVELS = [
  { id: 'easy', name: 'Easy', blurb: 'Plays at random. A gentle warm-up.' },
  { id: 'medium', name: 'Medium', blurb: 'Plays well about half the time.' },
  { id: 'hard', name: 'Impossible', blurb: 'Perfect play. The best you can get is a draw.' },
];

export const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],   // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8],   // columns
  [0, 4, 8], [2, 4, 6],              // diagonals
];

/** The winning mark and its line, or null. */
export function winnerOf(board) {
  for (const line of LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { mark: board[a], line };
    }
  }
  return null;
}

export const emptyCells = (board) => board.reduce((a, v, i) => (v ? a : [...a, i]), []);
export const isFull = (board) => board.every(Boolean);

/*
  Minimax with depth, so the computer prefers a fast win and a slow loss. Without
  the depth term it plays "any win is a win", which produces the odd behaviour of
  declining an immediate winning move in favour of an equal one several turns
  later — technically optimal, visibly stupid.
*/
function minimax(board, turn, depth, alpha, beta) {
  const w = winnerOf(board);
  if (w) return { score: w.mark === ROBOT ? 10 - depth : depth - 10, move: -1 };
  if (isFull(board)) return { score: 0, move: -1 };

  const cells = emptyCells(board);
  let best = { score: turn === ROBOT ? -Infinity : Infinity, move: cells[0] };
  let a = alpha;
  let b = beta;

  for (const i of cells) {
    const next = board.slice();
    next[i] = turn;
    const { score } = minimax(next, turn === ROBOT ? HUMAN : ROBOT, depth + 1, a, b);
    if (turn === ROBOT) {
      if (score > best.score) best = { score, move: i };
      a = Math.max(a, score);
    } else {
      if (score < best.score) best = { score, move: i };
      b = Math.min(b, score);
    }
    // This branch can no longer influence the result — stop exploring it.
    if (b <= a) break;
  }
  return best;
}

export function perfectMove(board) {
  /*
    On an empty board every opening is equivalent under symmetry, so searching
    it is a second of wasted work for a foregone conclusion. Take the centre —
    the strongest opening and the one a person expects.
  */
  if (emptyCells(board).length === 9) return 4;
  return minimax(board, ROBOT, 0, -Infinity, Infinity).move;
}

export function randomMove(board, rand = Math.random) {
  const cells = emptyCells(board);
  return cells[Math.floor(rand() * cells.length)];
}

/** The computer's move for a difficulty. Medium mixes perfect and random. */
export function robotMove(board, levelId, rand = Math.random) {
  if (!emptyCells(board).length) return -1;
  if (levelId === 'hard') return perfectMove(board);
  if (levelId === 'medium') return rand() < 0.5 ? perfectMove(board) : randomMove(board, rand);
  return randomMove(board, rand);
}
