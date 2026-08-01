/*
  Odd One Out — share text + card.
*/
import { THEME, rankFor } from './oddData';

export function buildShareText(score, isNewBest) {
  const r = rankFor(score);
  return `Odd One Out — ${score} correct\n${r.label}${isNewBest ? ' (new personal best!)' : ''}\n\nSpot the impostor: herdgamesonline.com/odd-one-out`;
}

export async function buildOddCard(score, isNewBest) {
  try {
    if (typeof document === 'undefined') return null;
    try { await document.fonts.ready; } catch { /* ignore */ }
    const r = rankFor(score);
    const S = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = THEME.bg; ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = THEME.teal; ctx.fillRect(0, 0, S, 24);

    ctx.textAlign = 'center';
    ctx.fillStyle = THEME.mut;
    ctx.font = "600 40px Quicksand, sans-serif";
    ctx.fillText('Odd One Out', S / 2, 150);

    ctx.fillStyle = THEME.teal;
    ctx.font = "800 260px Fredoka, system-ui, sans-serif";
    ctx.fillText(String(score), S / 2, 460);

    ctx.fillStyle = THEME.ink;
    ctx.font = "600 52px Quicksand, sans-serif";
    ctx.fillText('correct in a row', S / 2, 530);

    ctx.fillStyle = THEME.ink;
    ctx.font = "700 66px Fredoka, system-ui, sans-serif";
    ctx.fillText(r.label, S / 2, 680);

    ctx.fillStyle = THEME.mut;
    ctx.font = "500 38px Quicksand, sans-serif";
    ctx.fillText(r.blurb, S / 2, 745);

    if (isNewBest) {
      ctx.fillStyle = THEME.green;
      ctx.font = "700 44px Quicksand, sans-serif";
      ctx.fillText('New personal best', S / 2, 830);
    }

    ctx.fillStyle = THEME.mut;
    ctx.font = "600 34px Quicksand, sans-serif";
    ctx.fillText('herdgamesonline.com/odd-one-out', S / 2, 1020);

    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    if (!blob) return null;
    return new File([blob], `odd-one-out-${score}.png`, { type: 'image/png' });
  } catch {
    return null;
  }
}
