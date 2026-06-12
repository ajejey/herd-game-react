/*
  Daily Hot Takes — share text + share card. (Streak lives in useHotTakes;
  results come from the backend.)
*/
import { ARCHETYPES, spiceLabel } from './hotTakeData';

export function buildShareText(day, result) {
  const a = ARCHETYPES[result.archetype];
  const s = spiceLabel(result.spice, result.total);
  return `Daily Hot Takes #${day}\nI'm ${a.name} ${a.swatch} — ${s.label} ${s.chili}\n(${result.spice}/${result.total} spicy takes)\n\nWhat are your takes? herdgamesonline.com/hot-takes`;
}

export async function buildHotTakeCard(day, result, streak) {
  try {
    if (typeof document === 'undefined') return null;
    try { await document.fonts.ready; } catch { /* ignore */ }
    const a = ARCHETYPES[result.archetype];
    const s = spiceLabel(result.spice, result.total);
    const S = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#FFF7F0'; ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = a.color; ctx.fillRect(0, 0, S, 20);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#7A6E66';
    ctx.font = "600 40px Quicksand, sans-serif";
    ctx.fillText(`Daily Hot Takes #${day}`, S / 2, 150);

    ctx.fillStyle = '#1A1714';
    ctx.font = "800 96px system-ui, sans-serif";
    ctx.fillText(a.name, S / 2, 420);

    ctx.font = "700 200px sans-serif";
    ctx.fillText(a.swatch, S / 2, 660);

    ctx.fillStyle = a.color;
    ctx.font = "700 56px Quicksand, sans-serif";
    ctx.fillText(`${s.label} ${s.chili}`, S / 2, 800);

    ctx.fillStyle = '#7A6E66';
    ctx.font = "500 40px Quicksand, sans-serif";
    ctx.fillText(`${result.spice} of ${result.total} takes went against the crowd`, S / 2, 870);

    ctx.fillStyle = '#9A8F86';
    ctx.font = "600 34px Quicksand, sans-serif";
    ctx.fillText('herdgamesonline.com/hot-takes', S / 2, 1020);

    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    if (!blob) return null;
    return new File([blob], `hot-takes-${day}.png`, { type: 'image/png' });
  } catch {
    return null;
  }
}
