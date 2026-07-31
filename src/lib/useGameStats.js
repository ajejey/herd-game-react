import { useEffect, useState } from 'react';

/*
  Social-proof player counts for game cards.

  Fetched ONCE per page load and shared by every card via a module-level
  promise, so a homepage with 20 cards makes one request, not 20.

  THE FLOOR IS THE IMPORTANT BIT. Social proof cuts both ways: "1,240 played
  this week" pulls people in, but "4 played this week" actively repels — it
  signals a dead game. So anything under MIN_TO_SHOW renders no badge at all
  rather than a discouraging one. Never remove this without a good reason.

  Failure is silent: no badge is strictly better than a broken or wrong one.
*/

const BACKEND_URL =
  process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

export const MIN_TO_SHOW = 50;

let promise = null;

const TIMEOUT_MS = 5000;

function load() {
  if (promise) return promise;

  /* Hard timeout. Without it, a backend that accepts the connection but never
     responds leaves this promise pending forever — and since every card shares
     it, no badge would render for the rest of the page load even after the
     backend recovered. Aborting resolves to {} instead, which is the same
     "no badge" state we already fall back to on any error. */
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  promise = fetch(`${BACKEND_URL}/api/game-stats`, { signal: controller.signal })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => d?.stats || {})
    .catch(() => ({}))
    .finally(() => clearTimeout(timer));

  return promise;
}

export function useGameStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let alive = true;
    load().then((s) => { if (alive) setStats(s); });
    return () => { alive = false; };
  }, []);

  return stats;
}

/** Badge text for a game, or null when there is not enough to brag about. */
export function playsLabel(stats, gameId) {
  const n = stats?.[gameId];
  if (!Number.isFinite(n) || n < MIN_TO_SHOW) return null;
  return `${n.toLocaleString()} played this week`;
}
