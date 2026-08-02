/* Typing Speed Test — share text + card. */
import { THEME, rankFor } from './typingData';

export function buildShareText(wpm, accuracy, isNewBest) {
  const r = rankFor(wpm);
  return `Typing Test — ${wpm} WPM at ${accuracy}% accuracy\n${r.label}${isNewBest ? ' (new personal best!)' : ''}\n\nHow fast do you type? herdgamesonline.com/typing-test`;
}

export async function buildTypingCard(wpm, accuracy, isNewBest) {
  try {
    if (typeof document === 'undefined') return null;
    try { await document.fonts.ready; } catch { /* ignore */ }
    const r = rankFor(wpm);
    const S = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = THEME.bg; ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = THEME.teal; ctx.fillRect(0, 0, S, 24);
    ctx.textAlign = 'center';
    ctx.fillStyle = THEME.mut; ctx.font = "600 40px Quicksand, sans-serif";
    ctx.fillText('Typing Speed Test', S / 2, 150);
    ctx.fillStyle = THEME.teal; ctx.font = "800 260px Fredoka, system-ui, sans-serif";
    ctx.fillText(String(wpm), S / 2, 460);
    ctx.fillStyle = THEME.ink; ctx.font = "600 52px Quicksand, sans-serif";
    ctx.fillText(`words per minute · ${accuracy}% accurate`, S / 2, 530);
    ctx.fillStyle = THEME.ink; ctx.font = "700 60px Fredoka, system-ui, sans-serif";
    ctx.fillText(r.label, S / 2, 680);
    ctx.fillStyle = THEME.mut; ctx.font = "500 36px Quicksand, sans-serif";
    ctx.fillText(r.blurb, S / 2, 742);
    if (isNewBest) {
      ctx.fillStyle = THEME.green; ctx.font = "700 44px Quicksand, sans-serif";
      ctx.fillText('New personal best', S / 2, 830);
    }
    ctx.fillStyle = THEME.mut; ctx.font = "600 34px Quicksand, sans-serif";
    ctx.fillText('herdgamesonline.com/typing-test', S / 2, 1020);
    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    return blob ? new File([blob], `typing-test-${wpm}wpm.png`, { type: 'image/png' }) : null;
  } catch { return null; }
}
