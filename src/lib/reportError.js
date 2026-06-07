/*
  Client-side error reporter — fire-and-forget, non-blocking.

  Sends JS errors, unhandled promise rejections, and socket connect failures
  to the backend so we can catch problems (e.g. blocked WebSocket handshakes)
  before users have to email us.

  Safe by construction:
   - Uses navigator.sendBeacon (falls back to fetch keepalive) — never blocks
     the UI thread and survives page unload.
   - Per-session dedup + a hard cap on unique reports, so a noisy bug can't
     spam the backend.
   - Wrapped in try/catch everywhere — reporting must never cause an error.
*/

const BACKEND_URL =
  process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
const ENDPOINT = `${BACKEND_URL}/api/client-error`;

const sent = new Set(); // dedup keys for this page session
const MAX_UNIQUE = 25; // hard cap per session

export function reportError(type, message, extra = {}) {
  try {
    if (sent.size >= MAX_UNIQUE) return;
    const msg = String(message || '').slice(0, 500);
    if (!msg && !extra.stack) return;

    const key = `${type}|${msg}`.slice(0, 160);
    if (sent.has(key)) return;
    sent.add(key);

    const payload = {
      type: String(type || 'error').slice(0, 40),
      message: msg,
      stack: extra.stack ? String(extra.stack).slice(0, 2000) : '',
      source: extra.source ? String(extra.source).slice(0, 300) : '',
      line: Number.isFinite(extra.line) ? extra.line : undefined,
      col: Number.isFinite(extra.col) ? extra.col : undefined,
      page: typeof window !== 'undefined' ? window.location.pathname.slice(0, 300) : '',
      extra: extra.info ? String(extra.info).slice(0, 500) : '',
    };

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
    /* reporting must never throw */
  }
}

let installed = false;

export function installGlobalErrorReporting() {
  if (installed || typeof window === 'undefined') return;
  installed = true;
  try {
    window.addEventListener('error', (e) => {
      reportError('window_error', e?.message, {
        source: e?.filename,
        line: e?.lineno,
        col: e?.colno,
        stack: e?.error?.stack,
      });
    });
    window.addEventListener('unhandledrejection', (e) => {
      const r = e?.reason;
      reportError('unhandled_rejection', (r && (r.message || r)) || 'unhandledrejection', {
        stack: r && r.stack,
      });
    });
  } catch {
    /* no-op */
  }
}
