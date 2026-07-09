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
