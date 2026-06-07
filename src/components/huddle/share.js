/*
  Huddle — local persistence (no backend): per-day result, streak, and the
  spoiler-free emoji-grid share text (the viral Connections-style format).
*/
import { emojiForLevel } from './puzzles';

const RESULTS_KEY = 'hd_results'; // { [day]: { won, rows:[[lvl,lvl,lvl,lvl], ...] } }
const STREAK_KEY = 'hd_streak';
const LASTDAY_KEY = 'hd_lastDay';

function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

export function readResult(day) {
  const all = readJSON(RESULTS_KEY, {});
  return all[day] || null;
}

// Persist a finished game and update the streak (once per day).
export function saveResult(day, won, rows) {
  try {
    const all = readJSON(RESULTS_KEY, {});
    if (all[day]) return readStreak(); // already recorded — don't double-count
    all[day] = { won, rows };
    // keep the object small
    const days = Object.keys(all).map(Number).sort((a, b) => a - b);
    while (days.length > 60) delete all[days.shift()];
    localStorage.setItem(RESULTS_KEY, JSON.stringify(all));
    return commitStreak(day, won);
  } catch {
    return 0;
  }
}

export function readStreak() {
  try { return Number(localStorage.getItem(STREAK_KEY)) || 0; } catch { return 0; }
}

// Consecutive solved days increment; a gap or a loss resets.
function commitStreak(day, won) {
  try {
    const last = Number(localStorage.getItem(LASTDAY_KEY)) || 0;
    let streak = readStreak();
    if (!won) {
      streak = 0;
    } else if (day === last + 1) {
      streak += 1;
    } else if (day !== last) {
      streak = 1;
    }
    localStorage.setItem(STREAK_KEY, String(streak));
    localStorage.setItem(LASTDAY_KEY, String(day));
    return streak;
  } catch {
    return 0;
  }
}

// Spoiler-free emoji grid (one row per guess, coloured by the groups guessed).
export function buildShareText(day, rows, won) {
  const grid = rows.map((r) => r.map(emojiForLevel).join('')).join('\n');
  const head = `Huddle #${day} — ${won ? `solved` : 'missed'} in ${rows.length} ${rows.length === 1 ? 'try' : 'tries'}`;
  return `${head}\n${grid}\n\nCan you huddle the herd? herdgamesonline.com/connections`;
}
