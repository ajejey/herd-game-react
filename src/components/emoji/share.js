/*
  Emoji Movie Quiz — share text + card.

  The grid shows WHICH ones you got right without naming any film, so sending
  it to a friend does not spoil their run. Same principle as the Wordle grid.
*/
import { THEME, ROUNDS, rankFor } from './emojiData';

const marks = (results) => results.map((r) => (r.correct ? '🟪' : '⬜')).join('');

export function buildShareText(results, score, isNewBest) {
  const r = rankFor(score);
  return `Emoji Movie Quiz — ${score}/${ROUNDS}\n${marks(results)}\n${r.label}${isNewBest ? ' (new personal best!)' : ''}\n\nHow many can you get? herdgamesonline.com/emoji-movie-quiz`;
}

export async function buildEmojiCard(results, score, isNewBest) {
  try {
    if (typeof document === 'undefined') return null;
    try { await document.fonts.ready; } catch { /* ignore */ }
    const rank = rankFor(score);
    const S = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = THEME.bg; ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = THEME.purple; ctx.fillRect(0, 0, S, 24);

    ctx.textAlign = 'center';
    ctx.fillStyle = THEME.mut;
    ctx.font = "600 40px Quicksand, sans-serif";
    ctx.fillText('Emoji Movie Quiz', S / 2, 150);

    ctx.fillStyle = THEME.purple;
    ctx.font = "800 210px Fredoka, system-ui, sans-serif";
    ctx.fillText(`${score}`, S / 2, 400);
    ctx.fillStyle = THEME.ink;
    ctx.font = "700 60px Quicksand, sans-serif";
    ctx.fillText(`out of ${ROUNDS}`, S / 2, 470);

    // Two rows of five keeps the marks legible at thumbnail size.
    ctx.font = "700 64px sans-serif";
    const m = marks(results);
    ctx.fillText(m.slice(0, 5), S / 2, 600);
    ctx.fillText(m.slice(5), S / 2, 680);

    ctx.fillStyle = THEME.ink;
    ctx.font = "700 62px Fredoka, system-ui, sans-serif";
    ctx.fillText(rank.label, S / 2, 800);

    ctx.fillStyle = THEME.mut;
    ctx.font = "500 36px Quicksand, sans-serif";
    ctx.fillText(rank.blurb, S / 2, 858);

    if (isNewBest) {
      ctx.fillStyle = THEME.green;
      ctx.font = "700 40px Quicksand, sans-serif";
      ctx.fillText('New personal best', S / 2, 925);
    }

    ctx.fillStyle = THEME.mut;
    ctx.font = "600 32px Quicksand, sans-serif";
    ctx.fillText('herdgamesonline.com/emoji-movie-quiz', S / 2, 1020);

    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    if (!blob) return null;
    return new File([blob], `emoji-movie-quiz-${score}.png`, { type: 'image/png' });
  } catch {
    return null;
  }
}
