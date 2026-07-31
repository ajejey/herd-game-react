/*
  What Farm Animal Are You — share text + card.

  The result IS the product here, so the card is the most important surface in
  the game: it is what gets posted, and what brings the next player in.
*/
import { ANIMALS, THEME } from './animalData';

export function buildShareText(animalId) {
  const a = ANIMALS[animalId];
  return `I'm ${a.name} 🐄\n${a.tagline}\n\nWhich farm animal are you? herdgamesonline.com/what-farm-animal-are-you`;
}

function wrap(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

export async function buildAnimalCard(animalId) {
  try {
    if (typeof document === 'undefined') return null;
    try { await document.fonts.ready; } catch { /* ignore */ }
    const a = ANIMALS[animalId];
    const S = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = THEME.bg; ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = a.color; ctx.fillRect(0, 0, S, 24);

    ctx.textAlign = 'center';
    ctx.fillStyle = THEME.mut;
    ctx.font = "600 38px Quicksand, sans-serif";
    ctx.fillText('What farm animal are you?', S / 2, 150);

    ctx.fillStyle = a.color;
    ctx.font = "800 118px Fredoka, system-ui, sans-serif";
    ctx.fillText(a.name, S / 2, 330);

    ctx.fillStyle = THEME.ink;
    ctx.font = "600 44px Quicksand, sans-serif";
    wrap(ctx, a.tagline, S - 160).forEach((l, i) => ctx.fillText(l, S / 2, 430 + i * 58));

    ctx.fillStyle = THEME.mut;
    ctx.font = "500 36px Quicksand, sans-serif";
    wrap(ctx, a.line, S - 180).slice(0, 5).forEach((l, i) => ctx.fillText(l, S / 2, 600 + i * 50));

    ctx.fillStyle = a.color;
    ctx.font = "700 34px Quicksand, sans-serif";
    ctx.fillText(a.traits.join('  ·  '), S / 2, 900);

    ctx.fillStyle = THEME.mut;
    ctx.font = "600 32px Quicksand, sans-serif";
    ctx.fillText('herdgamesonline.com/what-farm-animal-are-you', S / 2, 1020);

    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    if (!blob) return null;
    return new File([blob], `farm-animal-${animalId}.png`, { type: 'image/png' });
  } catch {
    return null;
  }
}
