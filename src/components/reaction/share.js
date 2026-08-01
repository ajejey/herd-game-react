/*
  Reaction Time — share text + card. Lower is better, so the card leads with
  the millisecond average rather than a streak.
*/
import { THEME, ROUNDS, rankFor } from './reactionData';

export function buildShareText(average, isNewBest) {
  const r = rankFor(average);
  return `Reaction Time — ${average}ms average\n${r.label}${isNewBest ? ' (new personal best!)' : ''}\n\nHow fast are you? herdgamesonline.com/reaction-time-test`;
}

export async function buildReactionCard(average, isNewBest) {
  try {
    if (typeof document === 'undefined') return null;
    try { await document.fonts.ready; } catch { /* ignore */ }
    const r = rankFor(average);
    const S = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = THEME.bg; ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = THEME.go; ctx.fillRect(0, 0, S, 24);

    ctx.textAlign = 'center';
    ctx.fillStyle = THEME.mut;
    ctx.font = "600 40px Quicksand, sans-serif";
    ctx.fillText('Reaction Time Test', S / 2, 150);

    ctx.fillStyle = THEME.go;
    ctx.font = "800 230px Fredoka, system-ui, sans-serif";
    ctx.fillText(`${average}`, S / 2, 440);
    ctx.font = "700 70px Fredoka, system-ui, sans-serif";
    ctx.fillText('ms', S / 2, 520);

    ctx.fillStyle = THEME.ink;
    ctx.font = "600 44px Quicksand, sans-serif";
    ctx.fillText(`average over ${ROUNDS} rounds`, S / 2, 590);

    ctx.fillStyle = THEME.ink;
    ctx.font = "700 66px Fredoka, system-ui, sans-serif";
    ctx.fillText(r.label, S / 2, 720);

    ctx.fillStyle = THEME.mut;
    ctx.font = "500 38px Quicksand, sans-serif";
    ctx.fillText(r.blurb, S / 2, 785);

    if (isNewBest) {
      ctx.fillStyle = THEME.pink;
      ctx.font = "700 44px Quicksand, sans-serif";
      ctx.fillText('New personal best', S / 2, 860);
    }

    ctx.fillStyle = THEME.mut;
    ctx.font = "600 34px Quicksand, sans-serif";
    ctx.fillText('herdgamesonline.com/reaction-time-test', S / 2, 1020);

    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    if (!blob) return null;
    return new File([blob], `reaction-time-${average}ms.png`, { type: 'image/png' });
  } catch {
    return null;
  }
}
