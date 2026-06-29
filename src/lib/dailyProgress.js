/*
  Unified daily-games progress + streak (client-only, localStorage).

  Each daily game keeps its own per-game streak, but there was no shared "you
  played a daily game today" habit loop across them. This tracks, per day, which
  daily games you've completed and a unified streak (consecutive days you played
  at least one daily game) — the retention hook that turns one-game visitors into
  returning players and cross-promotes the other dailies.

  Recording is centralised: pingDailyComplete() calls recordDailyPlay(), so every
  daily game is tracked with zero per-game wiring.
*/

const KEY = 'hg_daily_progress';
const EPOCH = Date.UTC(2026, 5, 1); // 2026-06-01 = day 1 (matches the daily games)

export const DAILY_GAMES = [
  { game: 'daily-herd', label: 'Daily Herd', emoji: '🐑', path: '/daily' },
  { game: 'daily-trivia', label: 'Daily Trivia', emoji: '🧠', path: '/trivia' },
  { game: 'daily-hot-takes', label: 'Hot Takes', emoji: '🔥', path: '/hot-takes' },
  { game: 'daily-aura', label: 'Daily Aura', emoji: '✨', path: '/aura' },
  { game: 'huddle', label: 'Huddle', emoji: '🧩', path: '/connections' },
];

export function getDayNumber(now = new Date()) {
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.floor((todayUTC - EPOCH) / 86400000) + 1;
}

function read() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}

// Record that `game` was completed today. Updates the unified streak on the
// first daily game of each day. Safe — never throws (called from a ping path).
export function recordDailyPlay(game) {
  try {
    if (!game) return;
    const today = getDayNumber();
    const s = read();
    if (s.day !== today) {
      // first daily game of a new day → advance or reset the streak
      s.streak = s.lastDay === today - 1 ? (s.streak || 0) + 1 : 1;
      s.lastDay = today;
      s.day = today;
      s.played = [];
    }
    if (!Array.isArray(s.played)) s.played = [];
    if (!s.played.includes(game)) s.played.push(game);
    localStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* never throw */
  }
}

// { day, played:Set<game>, streak } — played empty if nothing today; streak
// counts as "alive" if the last play was today or yesterday.
export function getDailyProgress() {
  const s = read();
  const today = getDayNumber();
  const played = s.day === today && Array.isArray(s.played) ? s.played : [];
  const streak = s.lastDay === today || s.lastDay === today - 1 ? (s.streak || 0) : 0;
  return { day: today, played: new Set(played), streak };
}
