/*
  Higher or Lower — share text + share card.

  Unlike the daily games there is no puzzle number to compare against, so the
  brag is the streak itself: "beat my 14". That is the challenge hook.
*/
import { THEME, rankFor } from './hlData';

export function buildShareText(score, categoryLabel, isNewBest) {
  const r = rankFor(score);
  const crown = isNewBest ? ' (new personal best!)' : '';
  return `Higher or Lower — ${categoryLabel}\nStreak: ${score} ${r.e} ${r.label}${crown}\n\nThink you can beat me? herdgamesonline.com/higher-or-lower`;
}

export async function buildHigherLowerCard(score, categoryLabel, isNewBest) {
  try {
    if (typeof document === 'undefined') return null;
    try { await document.fonts.ready; } catch { /* ignore */ }
    const r = rankFor(score);
    const S = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = THEME.bg; ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = THEME.hot; ctx.fillRect(0, 0, S, 20);

    ctx.textAlign = 'center';
    ctx.fillStyle = THEME.mut;
    ctx.font = "600 40px Quicksand, sans-serif";
    ctx.fillText('Higher or Lower', S / 2, 150);
    ctx.fillText(categoryLabel, S / 2, 210);

    ctx.fillStyle = THEME.hot;
    ctx.font = "800 300px Fredoka, system-ui, sans-serif";
    ctx.fillText(String(score), S / 2, 560);

    ctx.fillStyle = THEME.ink;
    ctx.font = "700 56px Quicksand, sans-serif";
    ctx.fillText('streak', S / 2, 630);

    ctx.font = "700 64px Quicksand, sans-serif";
    ctx.fillText(`${r.e} ${r.label}`, S / 2, 760);

    if (isNewBest) {
      ctx.fillStyle = THEME.win;
      ctx.font = "700 44px Quicksand, sans-serif";
      ctx.fillText('New personal best', S / 2, 840);
    }

    ctx.fillStyle = THEME.mut;
    ctx.font = "600 34px Quicksand, sans-serif";
    ctx.fillText('herdgamesonline.com/higher-or-lower', S / 2, 1020);

    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    if (!blob) return null;
    return new File([blob], `higher-or-lower-${score}.png`, { type: 'image/png' });
  } catch {
    return null;
  }
}
