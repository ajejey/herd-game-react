/* Click Speed Test — share text + card. */
import { THEME, rankFor } from './clickData';

export function buildShareText(cps, clicks, isNewBest) {
  const r = rankFor(cps);
  return `Click Speed Test — ${cps} clicks per second (${clicks} in 5s)\n${r.label}${isNewBest ? ' (new personal best!)' : ''}\n\nBeat it: herdgamesonline.com/click-speed-test`;
}

export async function buildClickCard(cps, clicks, isNewBest) {
  try {
    if (typeof document === 'undefined') return null;
    try { await document.fonts.ready; } catch { /* ignore */ }
    const r = rankFor(cps);
    const S = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = THEME.bg; ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = THEME.orange; ctx.fillRect(0, 0, S, 24);
    ctx.textAlign = 'center';
    ctx.fillStyle = THEME.mut; ctx.font = "600 40px Quicksand, sans-serif";
    ctx.fillText('Click Speed Test', S / 2, 150);
    ctx.fillStyle = THEME.orange; ctx.font = "800 220px Fredoka, system-ui, sans-serif";
    ctx.fillText(String(cps), S / 2, 450);
    ctx.fillStyle = THEME.ink; ctx.font = "600 52px Quicksand, sans-serif";
    ctx.fillText(`clicks per second · ${clicks} in 5s`, S / 2, 525);
    ctx.fillStyle = THEME.ink; ctx.font = "700 60px Fredoka, system-ui, sans-serif";
    ctx.fillText(r.label, S / 2, 680);
    ctx.fillStyle = THEME.mut; ctx.font = "500 36px Quicksand, sans-serif";
    ctx.fillText(r.blurb, S / 2, 742);
    if (isNewBest) {
      ctx.fillStyle = THEME.green; ctx.font = "700 44px Quicksand, sans-serif";
      ctx.fillText('New personal best', S / 2, 830);
    }
    ctx.fillStyle = THEME.mut; ctx.font = "600 34px Quicksand, sans-serif";
    ctx.fillText('herdgamesonline.com/click-speed-test', S / 2, 1020);
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    return blob ? new File([blob], `click-speed-${cps}cps.png`, { type: 'image/png' }) : null;
  } catch { return null; }
}
