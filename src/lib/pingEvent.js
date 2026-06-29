/*
  Daily-game completion ping — fire-and-forget, non-blocking.

  The daily solo games (Daily Herd, Daily Trivia, Huddle) are client-only, so
  the server can't see when someone actually FINISHES a game — only that the
  page was viewed. This sends a tiny "completed" beacon at the moment of
  completion so we can report true plays-per-day per game.

  Safe by construction (mirrors reportError):
   - navigator.sendBeacon (fetch keepalive fallback) — never blocks the UI.
   - Wrapped in try/catch everywhere; a failed ping must never affect gameplay.
   - Caller guards (savedRef / status) ensure it fires once per completed game.
*/

import { recordDailyPlay } from './dailyProgress';

const BACKEND_URL =
  process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
const ENDPOINT = `${BACKEND_URL}/api/daily-event`;

const ANON_KEY = 'hg_anon'; // shared anonymous id across daily games

function getAnonId() {
  try {
    let id = localStorage.getItem(ANON_KEY);
    if (!id) {
      id = 'a_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
      localStorage.setItem(ANON_KEY, id);
    }
    return id;
  } catch {
    return 'a_anon';
  }
}

/**
 * Ping a daily-game completion.
 * @param {string} game  - slug, e.g. 'daily-herd' | 'daily-trivia' | 'huddle'
 * @param {object} fields - { day, score, total, won } (all optional)
 */
export function pingDailyComplete(game, fields = {}) {
  try {
    // Record locally for the unified daily streak / cross-game checklist.
    recordDailyPlay(game);

    const payload = {
      game: String(game || '').slice(0, 40),
      event: 'complete',
      day: Number.isFinite(fields.day) ? fields.day : null,
      score: Number.isFinite(fields.score) ? fields.score : null,
      total: Number.isFinite(fields.total) ? fields.total : null,
      won: typeof fields.won === 'boolean' ? fields.won : null,
      anonId: getAnonId(),
    };
    if (!payload.game) return;

    const body = JSON.stringify(payload);
    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'application/json' }));
    } else if (typeof fetch === 'function') {
      fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    /* a ping must never throw */
  }
}
