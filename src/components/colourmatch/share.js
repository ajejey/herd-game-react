/* Colour Match — share text + card. */
import { THEME, DURATION_S, rankFor } from './colourData';

export function buildShareText(score, isNewBest) {
  const r = rankFor(score);
  return `Colour Match — ${score} in ${DURATION_S} seconds\n${r.label}${isNewBest ? ' (new personal best!)' : ''}\n\nBeat the Stroop effect: herdgamesonline.com/colour-match`;
}

export async function buildColourCard(score, isNewBest) {
  try {
    if (typeof document === 'undefined') return null;
    try { await document.fonts.ready; } catch { /* ignore */ }
    const r = rankFor(score);
    const S = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = THEME.bg; ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = THEME.accent; ctx.fillRect(0, 0, S, 24);
    ctx.textAlign = 'center';
    ctx.fillStyle = THEME.mut; ctx.font = "600 40px Quicksand, sans-serif";
    ctx.fillText('Colour Match', S / 2, 150);
    ctx.fillStyle = THEME.accent; ctx.font = "800 260px Fredoka, system-ui, sans-serif";
    ctx.fillText(String(score), S / 2, 460);
    ctx.fillStyle = THEME.ink; ctx.font = "600 52px Quicksand, sans-serif";
    ctx.fillText(`in ${DURATION_S} seconds`, S / 2, 530);
    ctx.fillStyle = THEME.ink; ctx.font = "700 62px Fredoka, system-ui, sans-serif";
    ctx.fillText(r.label, S / 2, 680);
    ctx.fillStyle = THEME.mut; ctx.font = "500 36px Quicksand, sans-serif";
    ctx.fillText(r.blurb, S / 2, 742);
    if (isNewBest) {
      ctx.fillStyle = THEME.green; ctx.font = "700 44px Quicksand, sans-serif";
      ctx.fillText('New personal best', S / 2, 830);
    }
    ctx.fillStyle = THEME.mut; ctx.font = "600 34px Quicksand, sans-serif";
    ctx.fillText('herdgamesonline.com/colour-match', S / 2, 1020);
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    return blob ? new File([blob], `colour-match-${score}.png`, { type: 'image/png' }) : null;
  } catch { return null; }
}
