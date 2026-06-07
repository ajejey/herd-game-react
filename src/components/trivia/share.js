/*
  Daily Trivia — local persistence (no backend): per-day result, streak, and the
  spoiler-free emoji-grid share text.
*/
const RESULTS_KEY = 'tr_results'; // { [day]: { score, marks:[true,false,...] } }
const STREAK_KEY = 'tr_streak';
const LASTDAY_KEY = 'tr_lastDay';

function readJSON(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

export function readResult(day) {
  return readJSON(RESULTS_KEY, {})[day] || null;
}

export function saveResult(day, score, marks) {
  try {
    const all = readJSON(RESULTS_KEY, {});
    if (all[day]) return readStreak(); // already recorded
    all[day] = { score, marks };
    const days = Object.keys(all).map(Number).sort((a, b) => a - b);
    while (days.length > 60) delete all[days.shift()];
    localStorage.setItem(RESULTS_KEY, JSON.stringify(all));
    return commitStreak(day);
  } catch {
    return 0;
  }
}

export function readStreak() {
  try { return Number(localStorage.getItem(STREAK_KEY)) || 0; } catch { return 0; }
}

// Playing on consecutive days keeps the streak (completion-based, not score-based).
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

export function buildShareText(day, marks, score) {
  const grid = marks.map((m) => (m ? '🟩' : '🟥')).join('');
  return `Daily Trivia #${day} — ${score}/${marks.length}\n${grid}\n\nThink you can beat it? herdgamesonline.com/trivia`;
}
