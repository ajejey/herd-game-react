/* Chimp Test — share text + card. */
import { THEME, rankFor } from './chimpData';

export function buildShareText(reached, isNewBest) {
  const r = rankFor(reached);
  return `Chimp Test — reached ${reached}\n${r.label}${isNewBest ? ' (new personal best!)' : ''}\n\nChimps beat most humans at this: herdgamesonline.com/chimp-test`;
}

export async function buildChimpCard(reached, isNewBest) {
  try {
    if (typeof document === 'undefined') return null;
    try { await document.fonts.ready; } catch { /* ignore */ }
    const r = rankFor(reached);
    const S = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = THEME.bg; ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = THEME.indigo; ctx.fillRect(0, 0, S, 24);
    ctx.textAlign = 'center';
    ctx.fillStyle = THEME.mut; ctx.font = "600 40px Quicksand, sans-serif";
    ctx.fillText('Chimp Test', S / 2, 150);
    ctx.fillStyle = THEME.indigo; ctx.font = "800 260px Fredoka, system-ui, sans-serif";
    ctx.fillText(String(reached), S / 2, 460);
    ctx.fillStyle = THEME.ink; ctx.font = "600 52px Quicksand, sans-serif";
    ctx.fillText('numbers remembered', S / 2, 530);
    ctx.fillStyle = THEME.ink; ctx.font = "700 60px Fredoka, system-ui, sans-serif";
    ctx.fillText(r.label, S / 2, 680);
    ctx.fillStyle = THEME.mut; ctx.font = "500 36px Quicksand, sans-serif";
    ctx.fillText(r.blurb, S / 2, 742);
    if (isNewBest) {
      ctx.fillStyle = THEME.green; ctx.font = "700 44px Quicksand, sans-serif";
      ctx.fillText('New personal best', S / 2, 830);
    }
    ctx.fillStyle = THEME.mut; ctx.font = "600 34px Quicksand, sans-serif";
    ctx.fillText('herdgamesonline.com/chimp-test', S / 2, 1020);
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    return blob ? new File([blob], `chimp-test-${reached}.png`, { type: 'image/png' }) : null;
  } catch { return null; }
}
