import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { reportError } from '../lib/reportError';

// Reuse the same env var as SocketContext so production deploys "just work"
const BACKEND_URL = process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
const NAMESPACE = '/sa';
const SESSION_KEY = 'sa_session'; // { roomCode, playerId, rejoinToken }

// localStorage survives tab-close (accidental). Trade-off: 2 tabs of same browser
// share the session — they'll act as the same player, which is the safer default.
function loadSession() {
  try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
}
function saveSession(data) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}
function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function useSayAnything() {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [state, setState] = useState(null);       // full game state from server
  const [myId, setMyId] = useState(null);         // this player's UUID
  const [roomCode, setRoomCode] = useState(null);
  const [error, setError] = useState(null);
  const [kicked, setKicked] = useState(false);
  const [roomNotFound, setRoomNotFound] = useState(false);
  const errorTimerRef = useRef(null);

  // Auto-clear errors after 5s
  const setErrorWithAutoClear = useCallback((msg) => {
    setError(msg);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    if (msg) errorTimerRef.current = setTimeout(() => setError(null), 5000);
  }, []);

  // ── Connect once ──────────────────────────────────────────────────────────
  useEffect(() => {
    const socket = io(BACKEND_URL + NAMESPACE, {
      transports: ['polling', 'websocket'], // polling-first: connects through strict firewalls, then upgrades
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 8000,
      timeout: 10000,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      setError(null);

      // Attempt auto-rejoin on reconnect
      const session = loadSession();
      if (session?.rejoinToken && session?.roomCode) {
        socket.emit('join_game', {
          roomCode: session.roomCode,
          rejoinToken: session.rejoinToken,
        });
      }
    });

    socket.on('disconnect', () => setConnected(false));

    socket.on('connect_error', (err) => {
      setConnected(false);
      setErrorWithAutoClear('Cannot reach server. Retrying…');
      reportError('socket_connect', err?.message || 'connect_error', {
        info: `ns=${NAMESPACE} transport=${socket.io?.engine?.transport?.name || '?'}`,
      });
    });

    socket.on('joined', ({ playerId, rejoinToken, roomCode: rc, state: s }) => {
      setMyId(playerId);
      setRoomCode(rc);
      setState(s);
      setError(null);
      saveSession({ roomCode: rc, playerId, rejoinToken });
    });

    socket.on('state_update', ({ state: s }) => {
      setState(s);
    });

    socket.on('error', ({ message, code }) => {
      // Stale session — token points to a player no longer in the game.
      // Clear it and surface as fatal so the room page can redirect.
      if (code === 'PLAYER_REMOVED') {
        clearSession();
        setMyId(null);
        setRoomCode(null);
        setState(null);
        setKicked(true);
        setError(message);
        return;
      }
      // Stale URL — game cleaned up. Clear session and let UI redirect home.
      if (code === 'ROOM_NOT_FOUND') {
        clearSession();
        setMyId(null);
        setRoomCode(null);
        setState(null);
        setRoomNotFound(true);
        setErrorWithAutoClear(message);
        return;
      }
      setErrorWithAutoClear(message);
    });

    socket.on('kicked', ({ message }) => {
      setKicked(true);
      setError(message);
      clearSession();
    });

    return () => socket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────

  const createGame = useCallback((username) => {
    clearSession();
    setError(null);
    socketRef.current?.emit('create_game', { username: username.trim() });
  }, []);

  const joinGame = useCallback((rc, username) => {
    setError(null);
    setRoomNotFound(false);
    socketRef.current?.emit('join_game', {
      roomCode: rc.toUpperCase().trim(),
      username: username.trim(),
    });
  }, []);

  const startGame = useCallback(() => {
    if (!roomCode) return;
    socketRef.current?.emit('start_game', { roomCode });
  }, [roomCode]);

  const sendAction = useCallback((action, payload = {}) => {
    if (!roomCode || !action) return;
    socketRef.current?.emit('game_action', { roomCode, action, payload });
  }, [roomCode]);

  const kickPlayer = useCallback((playerId) => {
    if (!roomCode || !playerId) return;
    socketRef.current?.emit('kick_player', { roomCode, playerId });
  }, [roomCode]);

  const leaveGame = useCallback(() => {
    clearSession();
    setMyId(null);
    setRoomCode(null);
    setState(null);
    setKicked(false);
    socketRef.current?.disconnect();
    socketRef.current?.connect();
  }, []);

  // ── Derived helpers ───────────────────────────────────────────────────────

  const me = state?.players?.find(p => p.id === myId) ?? null;
  const isHost = me?.isHost ?? false;
  const judge = state ? state.players[state.judgeIndex] : null;
  const isJudge = judge?.id === myId;

  return {
    connected,
    state,
    myId,
    roomCode,
    error,
    kicked,
    roomNotFound,
    me,
    isHost,
    isJudge,
    judge,
    createGame,
    joinGame,
    startGame,
    sendAction,
    kickPlayer,
    leaveGame,
    clearError: () => setError(null),
  };
}
