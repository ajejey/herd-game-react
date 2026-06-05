/*
  Daily Herd — identity verdict + shareable image card + local history.

  The result is reframed from a score into a personality on a Sheep↔Wolf
  spectrum (driven by herd-sync %), so BOTH ends feel good and shareable.
  Thresholds are tunable — adjust as real score data comes in.
*/

const TIERS = [
  { min: 42, name: 'Total Sheep', animal: 'sheep', emoji: '🐑', color: '#3D8B5A', tag: 'You ARE the herd. Pure flock energy.' },
  { min: 28, name: 'Flockmate', animal: 'sheep', emoji: '🐑', color: '#3D8B5A', tag: 'You think like the crowd — cosy and in sync.' },
  { min: 18, name: 'Middle of the Herd', animal: 'sheep', emoji: '🐑', color: '#6B8E4E', tag: 'Half herd, half your own thing.' },
  { min: 10, name: 'Free Thinker', animal: 'wolf', emoji: '🐺', color: '#7C4DFF', tag: 'You drift from the flock. Interesting mind.' },
  { min: 0, name: 'Lone Wolf', animal: 'wolf', emoji: '🐺', color: '#6D4FB0', tag: 'You think for yourself. Rare breed.' },
];

export function getIdentity(syncPct) {
  return TIERS.find((t) => (syncPct || 0) >= t.min) || TIERS[TIERS.length - 1];
}

export function buildShareText(dayNumber, result, identity) {
  const grid = result.perQuestion.map((q) => (q.matched ? '🐑' : '⬜')).join('');
  return `Daily Herd #${dayNumber}\nI'm a ${identity.emoji} ${identity.name} — ${result.syncPct}% in sync with the herd ${grid}\nWhat are you? herdgamesonline.com/daily`;
}

// ── Local history (for the weekly trend) ─────────────────────────────────────
const HIST_KEY = 'dh_history';

export function recordHistory(dayNumber, identity, syncPct) {
  try {
    const list = readHistory();
    if (list.some((e) => e.day === dayNumber)) return list;
    list.push({ day: dayNumber, emoji: identity.emoji, animal: identity.animal, syncPct });
    const trimmed = list.slice(-30);
    localStorage.setItem(HIST_KEY, JSON.stringify(trimmed));
    return trimmed;
  } catch {
    return [];
  }
}

export function readHistory() {
  try { return JSON.parse(localStorage.getItem(HIST_KEY)) || []; } catch { return []; }
}

// ── Shareable image card (canvas → PNG File) — spoiler-free ──────────────────
export async function buildShareImageFile(dayNumber, result, identity) {
  try {
    if (typeof document === 'undefined') return null;
    try { await document.fonts.ready; } catch { /* ignore */ }
    const S = 1080;
    const c = document.createElement('canvas');
    c.width = S; c.height = S;
    const ctx = c.getContext('2d');

    // background
    const g = ctx.createLinearGradient(0, 0, S, S);
    g.addColorStop(0, '#FFF8E7');
    g.addColorStop(1, identity.animal === 'sheep' ? '#EAF6EE' : '#EFEAFB');
    ctx.fillStyle = g; ctx.fillRect(0, 0, S, S);
    ctx.fillStyle = identity.color; ctx.fillRect(0, 0, S, 18);

    ctx.textAlign = 'center';

    // eyebrow
    ctx.fillStyle = identity.color;
    ctx.font = '700 38px Quicksand, sans-serif';
    ctx.fillText(`DAILY HERD  ·  #${dayNumber}`, S / 2, 120);

    // big animal
    ctx.font = '200px sans-serif';
    ctx.fillText(identity.emoji, S / 2, 360);

    // identity name
    ctx.fillStyle = '#2D1810';
    ctx.font = '700 104px Fredoka, sans-serif';
    ctx.fillText(identity.name, S / 2, 500);

    // sync line
    ctx.fillStyle = identity.color;
    ctx.font = '700 56px Fredoka, sans-serif';
    ctx.fillText(`${result.syncPct}% in sync with the herd`, S / 2, 580);

    // sub stats
    ctx.fillStyle = '#8B6347';
    ctx.font = '500 34px Quicksand, sans-serif';
    ctx.fillText(`You out-synced ${result.beatPct ?? 0}% of today's herd · ${result.responders ?? 0} played`, S / 2, 640);

    // grid
    const grid = result.perQuestion.map((q) => (q.matched ? '🐑' : '⬜')).join(' ');
    ctx.font = '70px sans-serif';
    ctx.fillText(grid, S / 2, 780);

    // footer
    ctx.fillStyle = '#2D1810';
    ctx.font = '700 40px Fredoka, sans-serif';
    ctx.fillText('What are you?', S / 2, 940);
    ctx.fillStyle = identity.color;
    ctx.font = '600 36px Quicksand, sans-serif';
    ctx.fillText('herdgamesonline.com/daily', S / 2, 990);

    const blob = await new Promise((res) => c.toBlob(res, 'image/png'));
    if (!blob) return null;
    return new File([blob], `daily-herd-${dayNumber}.png`, { type: 'image/png' });
  } catch {
    return null;
  }
}
