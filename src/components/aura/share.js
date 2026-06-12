/*
  Daily Aura — local persistence (no backend) + the share card/text.

  The share artifact is the whole point of a daily identity game (Wordle's real
  innovation was the shareable grid). Here it's a soft pastel "aura card" PNG.
*/
import { AURA_COLORS } from './auraData';

const RESULTS_KEY = 'aura_results'; // { [day]: { colorId } }
const STREAK_KEY = 'aura_streak';
const LASTDAY_KEY = 'aura_lastDay';

function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

export function readResult(day) {
  return readJSON(RESULTS_KEY, {})[day] || null;
}

// commit=false → persist the result but DON'T touch the streak (used when
// playing an archive day, so an old permalink can't reset today's streak).
export function saveResult(day, colorId, commit = true) {
  try {
    const all = readJSON(RESULTS_KEY, {});
    if (all[day]) return readStreak(); // already recorded
    all[day] = { colorId };
    const days = Object.keys(all).map(Number).sort((a, b) => a - b);
    while (days.length > 60) delete all[days.shift()];
    localStorage.setItem(RESULTS_KEY, JSON.stringify(all));
    return commit ? commitStreak(day) : readStreak();
  } catch {
    return 0;
  }
}

export function readStreak() {
  try { return Number(localStorage.getItem(STREAK_KEY)) || 0; } catch { return 0; }
}

// Recent aura history for the little trend strip (last ~7 days).
export function readHistory() {
  const all = readJSON(RESULTS_KEY, {});
  return Object.keys(all).map(Number).sort((a, b) => a - b)
    .map((d) => ({ day: d, colorId: all[d].colorId }));
}

function commitStreak(day) {
  try {
    const last = Number(localStorage.getItem(LASTDAY_KEY)) || 0;
    let streak = readStreak();
    if (day === last + 1) streak += 1;
    else if (day !== last) streak = 1;
    localStorage.setItem(STREAK_KEY, String(streak));
    localStorage.setItem(LASTDAY_KEY, String(day));
    return streak;
  } catch {
    return 0;
  }
}

export function buildShareText(day, colorId) {
  const c = AURA_COLORS[colorId];
  return `My aura today is ${c.name} ${c.swatch}\n${c.traits.join(' · ')}\n\nWhat's your aura? herdgamesonline.com/aura #${day}`;
}

// Soft pastel aura card (radial gradient orb on a misty canvas) → PNG File.
export async function buildAuraCard(day, colorId, streak) {
  try {
    if (typeof document === 'undefined') return null;
    try { await document.fonts.ready; } catch { /* ignore */ }
    const c = AURA_COLORS[colorId];
    const S = 1080;
    const canvas = document.createElement('canvas');
    canvas.width = S; canvas.height = S;
    const ctx = canvas.getContext('2d');

    // misty pastel background
    const bg = ctx.createLinearGradient(0, 0, S, S);
    bg.addColorStop(0, '#FBF7FF');
    bg.addColorStop(1, '#F4FBF8');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, S, S);

    // the aura orb — layered blurred blobs (mirrors the on-screen AuraBlob:
    // ambient halo + two drifting satellite blobs in 'multiply' + a core bloom),
    // so the saved image is the same organic soft shape, not a hard circle.
    const cx = S / 2, cy = 470, R = 300;
    const drawBlob = (bx, by, r, c0, c1, blur, comp = 'source-over', alpha = 1) => {
      ctx.save();
      ctx.globalCompositeOperation = comp;
      ctx.globalAlpha = alpha;
      ctx.filter = `blur(${blur}px)`;
      const g = ctx.createRadialGradient(bx, by - r * 0.1, r * 0.05, bx, by, r);
      g.addColorStop(0, c0); g.addColorStop(1, c1);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(bx, by, r, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    };
    // ambient halo (soft, fades to transparent)
    drawBlob(cx, cy, R * 1.28, `${c.to}88`, `${c.to}00`, R * 0.16, 'source-over', 0.85);
    // drifting satellite blobs, offset + multiply-blended → irregular organic edge
    drawBlob(cx - R * 0.18, cy - R * 0.12, R * 0.66, c.from, c.to, R * 0.1, 'multiply');
    drawBlob(cx + R * 0.16, cy + R * 0.14, R * 0.6, c.to, c.from, R * 0.1, 'multiply');
    // bright core bloom
    drawBlob(cx, cy - R * 0.06, R * 0.52, '#ffffff', c.to, R * 0.05);

    ctx.textAlign = 'center';
    ctx.fillStyle = c.ink;
    ctx.font = '600 40px Quicksand, sans-serif';
    ctx.fillText('my aura today is', cx, 150);

    ctx.fillStyle = c.ink;
    ctx.font = '700 130px Quicksand, sans-serif';
    ctx.fillText(c.name, cx, 880);

    ctx.fillStyle = '#6B6478';
    ctx.font = '500 40px Quicksand, sans-serif';
    ctx.fillText(c.traits.join('  ·  '), cx, 950);

    ctx.fillStyle = '#9A93A8';
    ctx.font = '600 34px Quicksand, sans-serif';
    ctx.fillText('herdgamesonline.com/aura', cx, 1018);

    const blob = await new Promise((res) => canvas.toBlob(res, 'image/png'));
    if (!blob) return null;
    return new File([blob], `daily-aura-${day}.png`, { type: 'image/png' });
  } catch {
    return null;
  }
}
