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

// Score-tailored share text. The emoji grid is the spoiler-free social
// currency (the Wordle insight); the closing hook is matched to the score so a
// great score reads as a flex and a bad score reads as a "drag a friend down
// with you" challenge — both are reasons to send it to a specific person.
export function buildShareText(day, marks, score, streak = 0) {
  const total = marks.length;
  const grid = marks.map((m) => (m ? '🟩' : '🟥')).join('');
  const pct = total ? score / total : 0;
  let emoji, hook;
  if (score === total) { emoji = '🏆'; hook = 'Flawless. Bet you can’t match it:'; }
  else if (pct >= 0.7) { emoji = '🔥'; hook = 'Think you can beat me?'; }
  else if (pct >= 0.4) { emoji = '🙂'; hook = 'Bet you can do better — prove it:'; }
  else { emoji = '😅'; hook = 'I bombed it. Drag yourself down with me:'; }
  const streakLine = streak >= 2 ? `\n🔥 ${streak}-day streak` : '';
  return `Daily Trivia #${day} — ${score}/${total} ${emoji}\n${grid}${streakLine}\n\n${hook} herdgamesonline.com/trivia`;
}
