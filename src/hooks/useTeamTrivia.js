import { useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { attachConnectivityReconnect, attachConnectOutcome } from '../lib/socketConfig';
import { shouldRejoinSession, isForCurrentRoom } from '../lib/roomSession';

const BACKEND_URL = process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
const NAMESPACE = '/teamtrivia';
const SESSION_KEY = 'teamtrivia_session';

function loadSession() { try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; } }
function saveSession(d) { localStorage.setItem(SESSION_KEY, JSON.stringify(d)); }
function clearSession() { localStorage.removeItem(SESSION_KEY); }

export function useTeamTrivia() {
  const socketRef = useRef(null);
  /* The room this client is actually in, as a REF and not state: the socket
     handlers below are registered once and would otherwise close over the
     initial null forever, making the guard in state_update always pass. */
  const roomCodeRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [state, setState] = useState(null);
  const [myId, setMyId] = useState(null);
  const [roomCode, setRoomCode] = useState(null);
  const [error, setError] = useState(null);
  const [kicked, setKicked] = useState(false);
  const [roomNotFound, setRoomNotFound] = useState(false);
  const errorTimerRef = useRef(null);

  const setErrorWithAutoClear = useCallback((msg) => {
    setError(msg);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    if (msg) errorTimerRef.current = setTimeout(() => setError(null), 5000);
  }, []);

  useEffect(() => {
    const socket = io(BACKEND_URL + NAMESPACE, {
      transports: ['polling', 'websocket'], // polling-first: connects through strict firewalls, then upgrades
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 8000,
      timeout: 10000,
    });

    // One outcome per socket, not one error per retry. See lib/socketConfig.js.
    attachConnectOutcome(socket, NAMESPACE);
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      setError(null);
      const session = loadSession();
      if (shouldRejoinSession(session)) {
        socket.emit('join_game', { roomCode: session.roomCode, rejoinToken: session.rejoinToken });
      }
    });

    socket.on('disconnect', () => setConnected(false));
    socket.on('connect_error', (err) => {
      setConnected(false);
      setErrorWithAutoClear('Cannot reach server. Retrying…');
    });

    socket.on('joined', ({ playerId, rejoinToken, roomCode: rc, state: s }) => {
      setMyId(playerId); setRoomCode(rc); roomCodeRef.current = rc; setState(s); setError(null);
      saveSession({ roomCode: rc, playerId, rejoinToken });
    });

    socket.on('state_update', ({ state: s }) => { if (isForCurrentRoom(s, roomCodeRef.current)) setState(s); });

    socket.on('error', ({ message, code }) => {
      if (code === 'PLAYER_REMOVED') { clearSession(); setMyId(null); setRoomCode(null); roomCodeRef.current = null; setState(null); setKicked(true); setError(message); return; }
      if (code === 'ROOM_NOT_FOUND') { clearSession(); setMyId(null); setRoomCode(null); roomCodeRef.current = null; setState(null); setRoomNotFound(true); setErrorWithAutoClear(message); return; }
      setErrorWithAutoClear(message);
    });

    socket.on('kicked', ({ message }) => { setKicked(true); setError(message); clearSession(); });

    const detachReconnect = attachConnectivityReconnect(socket);
    return () => { detachReconnect(); socket.disconnect(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // `settings` carries optional room config — currently just packCode, which
  // the engine resolves into the host's own questions before the game starts.
  const createGame = useCallback((username, settings = {}) => { clearSession(); setError(null); socketRef.current?.emit('create_game', { username: username.trim(), settings }); }, []);
  const joinGame = useCallback((rc, username) => { setError(null); setRoomNotFound(false); socketRef.current?.emit('join_game', { roomCode: rc.toUpperCase().trim(), username: username.trim() }); }, []);
  const startGame = useCallback(() => { if (roomCode) socketRef.current?.emit('start_game', { roomCode }); }, [roomCode]);
  const sendAction = useCallback((action, payload = {}) => { if (roomCode && action) socketRef.current?.emit('game_action', { roomCode, action, payload }); }, [roomCode]);
  const kickPlayer = useCallback((playerId) => { if (roomCode && playerId) socketRef.current?.emit('kick_player', { roomCode, playerId }); }, [roomCode]);
  const leaveGame = useCallback(() => { clearSession(); setMyId(null); setRoomCode(null); roomCodeRef.current = null; setState(null); setKicked(false); socketRef.current?.disconnect(); socketRef.current?.connect(); }, []);

  const me = state?.players?.find((p) => p.id === myId) ?? null;
  const isHost = me?.isHost ?? false;

  return {
    connected, state, myId, roomCode, error, kicked, roomNotFound, me, isHost,
    createGame, joinGame, startGame, sendAction, kickPlayer, leaveGame,
    clearError: () => setError(null),
  };
}
