/*
  Guess the Year — share text + card.

  The brag is the score out of 500 plus a per-round accuracy strip, which is
  the Wordle-grid trick: it shows HOW you did without spoiling the films for
  whoever you send it to.
*/
import { THEME, ROUNDS, MAX_ROUND_SCORE, rankFor } from './gtyData';

/* Per-round marks. Deliberately reveals accuracy, never the film or the year. */
function marks(results) {
  return results
    .map((r) => (r.diff === 0 ? '🎯' : r.diff <= 2 ? '🟢' : r.diff <= 5 ? '🟡' : '🔴'))
    .join('');
}

export function buildShareText(results, total) {
  const r = rankFor(total);
  return `Guess the Year — ${total}/${ROUNDS * MAX_ROUND_SCORE}\n${marks(results)}\n${r.label}\n\nCan you beat that? herdgamesonline.com/guess-the-year`;
}

export async function buildYearCard(results, total, isNewBest) {
  try {
    if (typeof document === 'undefined') return null;
    try { await document.fonts.ready; } catch { /* ignore */ }
    const rank = rankFor(total);
    const S = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = THEME.bg; ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = THEME.amber; ctx.fillRect(0, 0, S, 24);

    ctx.textAlign = 'center';
    ctx.fillStyle = THEME.mut;
    ctx.font = "600 40px Quicksand, sans-serif";
    ctx.fillText('Guess the Year', S / 2, 150);

    ctx.fillStyle = THEME.amber;
    ctx.font = "800 200px Fredoka, system-ui, sans-serif";
    ctx.fillText(String(total), S / 2, 400);

    ctx.fillStyle = THEME.ink;
    ctx.font = "600 48px Quicksand, sans-serif";
    ctx.fillText(`out of ${ROUNDS * MAX_ROUND_SCORE}`, S / 2, 470);

    ctx.font = "700 90px sans-serif";
    ctx.fillText(marks(results), S / 2, 610);

    ctx.fillStyle = THEME.ink;
    ctx.font = "700 62px Fredoka, system-ui, sans-serif";
    ctx.fillText(rank.label, S / 2, 730);

    ctx.fillStyle = THEME.mut;
    ctx.font = "500 38px Quicksand, sans-serif";
    ctx.fillText(rank.blurb, S / 2, 790);

    if (isNewBest) {
      ctx.fillStyle = THEME.green;
      ctx.font = "700 44px Quicksand, sans-serif";
      ctx.fillText('New personal best', S / 2, 870);
    }

    ctx.fillStyle = THEME.mut;
    ctx.font = "600 34px Quicksand, sans-serif";
    ctx.fillText('herdgamesonline.com/guess-the-year', S / 2, 1020);

    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    if (!blob) return null;
    return new File([blob], `guess-the-year-${total}.png`, { type: 'image/png' });
  } catch {
    return null;
  }
}
