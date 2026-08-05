/**
 * FCM device-token registration.
 *
 * Dormant until android/app/google-services.json exists: without it the
 * Firebase plugin is not applied at build time and `register()` rejects. That
 * rejection is caught and logged, never surfaced — the app and the local daily
 * reminder work regardless, so a missing Firebase project degrades to "no
 * event-driven pushes" rather than a broken launch.
 */
import { Capacitor } from '@capacitor/core';

const BACKEND_URL =
  process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

// Two separate keys on purpose. Conflating them created a deadlock: the
// opted-in check read the uploaded-token key, but that key is only written
// AFTER a successful upload — so a user who opted in while the backend was
// unreachable was never re-registered on any later launch, and with no upload
// ever having succeeded, nothing could set the flag in the first place.
const TOKEN_KEY = 'herd.pushToken.v1'; // last token the backend has confirmed
const OPTIN_KEY = 'herd.pushOptIn.v1'; // user granted permission, independent of upload

/** Stable per-install id so the backend can dedupe tokens across refreshes. */
function anonId() {
  try {
    let id = localStorage.getItem('herd.anonId');
    if (!id) {
      id = (crypto.randomUUID && crypto.randomUUID()) || String(Math.random()).slice(2);
      localStorage.setItem('herd.anonId', id);
    }
    return id;
  } catch {
    return 'anon';
  }
}

async function sendTokenToBackend(token) {
  // Skip the round trip when nothing changed — this runs on every launch.
  try {
    if (localStorage.getItem(TOKEN_KEY) === token) return;
  } catch { /* ignore */ }

  try {
    const res = await fetch(`${BACKEND_URL}/api/push/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        anonId: anonId(),
        platform: Capacitor.getPlatform(),
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
      }),
    });
    if (res.ok) {
      try { localStorage.setItem(TOKEN_KEY, token); } catch { /* ignore */ }
    }
  } catch (err) {
    // Offline at launch is normal. The next launch retries.
    console.warn('[push] token upload failed:', err?.message || err);
  }
}

/**
 * Request push permission and register for a token.
 * Call this from a user action, not on first launch — a permission prompt
 * before anyone has seen the app converts badly.
 */
export async function enablePush() {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const { PushNotifications } = await import('@capacitor/push-notifications');

    let perm = await PushNotifications.checkPermissions();
    if (perm.receive !== 'granted') perm = await PushNotifications.requestPermissions();
    if (perm.receive !== 'granted') return false;

    // Record the opt-in as soon as permission is granted, not after a
    // successful upload — otherwise opting in while offline is forgotten.
    try { localStorage.setItem(OPTIN_KEY, '1'); } catch { /* ignore */ }

    return await new Promise((resolve) => {
      let settled = false;
      let handles = [];
      const cleanup = () => {
        // Listeners must be removed. This function runs again on every launch
        // via refreshPushToken(), and Capacitor listeners accumulate — leaving
        // them attached means one registration event fires N stale handlers and
        // uploads the token N times.
        for (const h of handles) { try { h.remove(); } catch { /* ignore */ } }
        handles = [];
      };
      const done = (v) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        cleanup();
        resolve(v);
      };

      const timer = setTimeout(() => {
        console.warn('[push] registration timed out after 10s');
        done(false);
      }, 10000);

      Promise.all([
        PushNotifications.addListener('registration', (t) => {
          sendTokenToBackend(t.value);
          done(true);
        }),
        PushNotifications.addListener('registrationError', (err) => {
          console.warn('[push] registration error (is google-services.json present?):', err?.error);
          done(false);
        }),
      ])
        .then((hs) => {
          if (settled) { for (const h of hs) { try { h.remove(); } catch { /* ignore */ } } return; }
          handles = hs;
        })
        .catch(() => { /* listener registration failed; the timeout still resolves */ });

      PushNotifications.register().catch((err) => {
        console.warn('[push] register() threw:', err?.message || err);
        done(false);
      });
    });
  } catch (err) {
    console.warn('[push] unavailable:', err?.message || err);
    return false;
  }
}

/** True once the user has granted push permission at least once. */
export function hasOptedIntoPush() {
  try {
    return localStorage.getItem(OPTIN_KEY) === '1';
  } catch {
    return false;
  }
}

/**
 * Re-register silently on launch if the user already opted in.
 *
 * NOTE: nothing calls enablePush() yet — there is no push opt-in UI. Until one
 * exists, no device registers a token and no push can be delivered. That is
 * intentional for now: the daily reminder is a local notification and does not
 * depend on any of this. Wire enablePush() to a real opt-in when the first
 * event-driven push (e.g. "someone joined your room") is built.
 */
export async function refreshPushToken() {
  if (!Capacitor.isNativePlatform()) return;
  if (!hasOptedIntoPush()) return;
  await enablePush();
}
