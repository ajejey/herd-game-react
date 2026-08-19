/*
  Shared Socket.IO client config + mobile-reliability helper.

  Why this exists: most socket-connect failures we log are iPhone/Safari, and
  they are almost all transient — the tab gets backgrounded (iOS suspends the
  socket) or the network switches (Wi-Fi <-> cellular). Socket.IO's auto-reconnect
  catches some, but iOS frequently leaves the socket in a dead "disconnected"
  state until something explicitly nudges it. attachConnectivityReconnect() is
  that nudge: when the page comes back to the foreground or the network returns,
  reconnect if we've dropped.
*/

import { reportError } from './reportError';

/*
  Report the OUTCOME of connecting, not every attempt.

  Every hook used to call reportError on each `connect_error`. Socket.IO retries
  forever by design, so one phone with a suspended tab produced a stream of
  identical errors and a genuine lockout produced the same stream — the two were
  indistinguishable in the data. About 1,100 errors a month, none of which could
  answer the only question that matters: did this person get into their game?

  Reading that log led to exactly the wrong conclusion twice, because a recovered
  blip and a person who never connected looked the same.

  Now each socket reports at most two things, once each:

    socket_recovered  it failed, then connected. Attempts and elapsed ms. This is
                      the denominator — without it a drop in failures is
                      indistinguishable from a drop in traffic.
    socket_failed     still not connected GIVE_UP_MS after the first error. This
                      is the number that costs us finished games, and the only
                      one worth acting on.

  Both are capped per socket instance, so a two-hour game on a flaky train
  contributes one event, not two hundred.
*/
const GIVE_UP_MS = 25000; // past SOCKET_OPTS.timeout (20s) + a reconnect delay

export function attachConnectOutcome(socket, label = '') {
  if (!socket) return () => {};

  let attempts = 0;
  let lastMessage = '';
  let reportedFail = false;
  let reportedRecover = false;
  let timer = null;
  let firstErrorAt = 0;

  const transport = () => socket.io?.engine?.transport?.name || '?';

  const onError = (err) => {
    attempts += 1;
    lastMessage = err?.message || 'connect_error';
    if (!firstErrorAt) firstErrorAt = Date.now();

    if (timer || reportedFail) return;
    timer = setTimeout(() => {
      timer = null;
      /*
        `socket.active` is false once the client has stopped trying — which
        includes the component unmounting and disconnecting the socket. Without
        this check, someone who simply navigated away mid-connect is reported 25
        seconds later as a failure they never experienced, and the one number
        this whole change exists to make trustworthy gets quietly poisoned.
      */
      if (socket.connected || reportedFail || socket.active === false) return;
      reportedFail = true;
      reportError('socket_failed', lastMessage, {
        info: `ns=${label} transport=${transport()} attempts=${attempts} afterMs=${Date.now() - firstErrorAt}`,
      });
    }, GIVE_UP_MS);
  };

  const onConnect = () => {
    if (timer) { clearTimeout(timer); timer = null; }
    if (attempts > 0 && !reportedRecover) {
      reportedRecover = true;
      reportError('socket_recovered', lastMessage || 'recovered', {
        info: `ns=${label} transport=${transport()} attempts=${attempts} afterMs=${Date.now() - firstErrorAt}`,
      });
    }
  };

  socket.on('connect_error', onError);
  socket.on('connect', onConnect);

  return () => {
    if (timer) clearTimeout(timer);
    socket.off('connect_error', onError);
    socket.off('connect', onConnect);
  };
}

// Standard robust options for every namespace.
// polling-first so strict proxies/firewalls/ISPs that block the wss:// upgrade
// still connect (WebSocket-only = hard failure for those users), then upgrade.
export const SOCKET_OPTS = {
  transports: ['polling', 'websocket'],
  reconnection: true,
  reconnectionAttempts: Infinity, // never permanently give up on flaky mobile networks
  reconnectionDelay: 1000,
  reconnectionDelayMax: 8000,
  timeout: 20000, // tolerate slow mobile handshakes before the first connect_error
};

// Reconnect the socket when the page returns to the foreground or the network
// comes back. socket.connect() is a no-op if already connected, so these are
// safe to fire liberally. Returns a cleanup function — call it on unmount.
export function attachConnectivityReconnect(socket) {
  if (!socket) return () => {};

  // Debounce: iOS fires visibilitychange + focus (and sometimes online) in a
  // burst when a tab returns to the foreground. Without this we'd call
  // connect() several times in a row — needless connection churn on the server.
  // Collapse a burst into a single reconnect attempt, and don't retry more than
  // once every few seconds (socket.io's own backoff handles the rest).
  let timer = null;
  let lastAttempt = 0;
  const COOLDOWN = 3000;
  const maybeReconnect = () => {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      const now = Date.now();
      if (socket.disconnected && now - lastAttempt > COOLDOWN) {
        lastAttempt = now;
        socket.connect();
      }
    }, 300);
  };
  const onVisible = () => { if (document.visibilityState === 'visible') maybeReconnect(); };

  document.addEventListener('visibilitychange', onVisible);
  window.addEventListener('online', maybeReconnect);
  window.addEventListener('focus', maybeReconnect);

  return () => {
    if (timer) clearTimeout(timer);
    document.removeEventListener('visibilitychange', onVisible);
    window.removeEventListener('online', maybeReconnect);
    window.removeEventListener('focus', maybeReconnect);
  };
}
