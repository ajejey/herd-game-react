/* Aim Trainer — share text + card. */
import { THEME, TARGETS, rankFor } from './aimData';

export function buildShareText(avg, isNewBest) {
  const r = rankFor(avg);
  return `Aim Trainer — ${avg}ms per target (${TARGETS} targets)\n${r.label}${isNewBest ? ' (new personal best!)' : ''}\n\nBeat it: herdgamesonline.com/aim-trainer`;
}

export async function buildAimCard(avg, isNewBest) {
  try {
    if (typeof document === 'undefined') return null;
    try { await document.fonts.ready; } catch { /* ignore */ }
    const r = rankFor(avg);
    const S = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = THEME.bg; ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = THEME.rose; ctx.fillRect(0, 0, S, 24);
    ctx.textAlign = 'center';
    ctx.fillStyle = THEME.mut; ctx.font = "600 40px Quicksand, sans-serif";
    ctx.fillText('Aim Trainer', S / 2, 150);
    ctx.fillStyle = THEME.rose; ctx.font = "800 220px Fredoka, system-ui, sans-serif";
    ctx.fillText(`${avg}`, S / 2, 450);
    ctx.fillStyle = THEME.ink; ctx.font = "600 52px Quicksand, sans-serif";
    ctx.fillText(`ms per target · ${TARGETS} targets`, S / 2, 525);
    ctx.fillStyle = THEME.ink; ctx.font = "700 60px Fredoka, system-ui, sans-serif";
    ctx.fillText(r.label, S / 2, 680);
    ctx.fillStyle = THEME.mut; ctx.font = "500 36px Quicksand, sans-serif";
    ctx.fillText(r.blurb, S / 2, 742);
    if (isNewBest) {
      ctx.fillStyle = THEME.green; ctx.font = "700 44px Quicksand, sans-serif";
      ctx.fillText('New personal best', S / 2, 830);
    }
    ctx.fillStyle = THEME.mut; ctx.font = "600 34px Quicksand, sans-serif";
    ctx.fillText('herdgamesonline.com/aim-trainer', S / 2, 1020);
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    return blob ? new File([blob], `aim-trainer-${avg}ms.png`, { type: 'image/png' }) : null;
  } catch { return null; }
}
