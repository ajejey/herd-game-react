/*
  Herd Memory — share text + card. The brag is simply how many rounds you
  survived, which is the only number that matters in a Simon-style game.
*/
import { THEME, rankFor } from './memoryData';

export function buildShareText(score, isNewBest) {
  const r = rankFor(score);
  return `Herd Memory — ${score} round${score === 1 ? '' : 's'}\n${r.label}${isNewBest ? ' (new personal best!)' : ''}\n\nThink you can remember more? herdgamesonline.com/memory-game`;
}

export async function buildMemoryCard(score, isNewBest) {
  try {
    if (typeof document === 'undefined') return null;
    try { await document.fonts.ready; } catch { /* ignore */ }
    const r = rankFor(score);
    const S = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = THEME.bg; ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = THEME.green; ctx.fillRect(0, 0, S, 24);

    ctx.textAlign = 'center';
    ctx.fillStyle = THEME.mut;
    ctx.font = "600 40px Quicksand, sans-serif";
    ctx.fillText('Herd Memory', S / 2, 150);

    ctx.fillStyle = THEME.green;
    ctx.font = "800 260px Fredoka, system-ui, sans-serif";
    ctx.fillText(String(score), S / 2, 460);

    ctx.fillStyle = THEME.ink;
    ctx.font = "600 52px Quicksand, sans-serif";
    ctx.fillText(score === 1 ? 'round' : 'rounds', S / 2, 530);

    ctx.fillStyle = THEME.ink;
    ctx.font = "700 66px Fredoka, system-ui, sans-serif";
    ctx.fillText(r.label, S / 2, 680);

    ctx.fillStyle = THEME.mut;
    ctx.font = "500 38px Quicksand, sans-serif";
    ctx.fillText(r.blurb, S / 2, 745);

    if (isNewBest) {
      ctx.fillStyle = THEME.pink;
      ctx.font = "700 44px Quicksand, sans-serif";
      ctx.fillText('New personal best', S / 2, 830);
    }

    ctx.fillStyle = THEME.mut;
    ctx.font = "600 34px Quicksand, sans-serif";
    ctx.fillText('herdgamesonline.com/memory-game', S / 2, 1020);

    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    if (!blob) return null;
    return new File([blob], `herd-memory-${score}.png`, { type: 'image/png' });
  } catch {
    return null;
  }
}
