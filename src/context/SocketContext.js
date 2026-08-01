import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { reportError } from '../lib/reportError';
import { SOCKET_OPTS, attachConnectivityReconnect } from '../lib/socketConfig';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

const SocketContext = createContext();

/*
  Socket provider for the original Herd Mentality game.

  LAZY ON PURPOSE. This provider wraps the whole app, and it used to open a
  connection in a mount effect — meaning every page opened one: all the solo
  games, the blog, every trivia topic and office guide, every SEO landing page.
  The overwhelming majority of those visitors never touch multiplayer, so those
  were connections that could only ever idle or fail, and `socket_connect` was
  comfortably our largest error source (~1,600/week) largely because of it.

  Now nothing connects until something asks. Only two places do:
    - GameRoom, which needs a live socket the whole time it is mounted
      (via useLiveSocket).
    - Home, which calls connect() inside the create / join / reconnect
      handlers, so a homepage visitor who never starts a game never opens one.

  Every other multiplayer game has its own namespaced socket in its own hook
  (src/hooks/use*.js) which only mounts on that game's page, so none of them
  are affected by this.

  connect() is idempotent and returns the instance SYNCHRONOUSLY, so a click
  handler can call it and emit on the result in the same tick rather than
  waiting for a state update.
*/
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);
  const detachRef = useRef(null);

  const connect = useCallback(() => {
    if (socketRef.current) return socketRef.current;

    // Shared robust config: polling-first, never-give-up reconnection, mobile
    // handshake timeout. (Previously this path capped at 10 attempts with no
    // delay cap — it was the biggest source of socket_connect errors.)
    const newSocket = io(SOCKET_URL, SOCKET_OPTS);
    socketRef.current = newSocket;

    newSocket.on('connect', () => setConnected(true));

    newSocket.on('connect_error', (error) => {
      setConnected(false);
      reportError('socket_connect', error?.message || 'connect_error', {
        info: `ns=herd transport=${newSocket.io?.engine?.transport?.name || '?'}`,
      });
    });

    newSocket.on('disconnect', () => setConnected(false));

    // Reconnect when the tab returns to the foreground / network comes back
    // (the main iOS Safari failure mode).
    detachRef.current = attachConnectivityReconnect(newSocket);

    setSocket(newSocket);
    return newSocket;
  }, []);

  // Tear down when the provider itself unmounts (full app teardown).
  useEffect(() => () => {
    if (detachRef.current) detachRef.current();
    if (socketRef.current) socketRef.current.close();
    socketRef.current = null;
    detachRef.current = null;
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected, connect }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

/**
 * For screens that need a live socket for as long as they are mounted (the
 * game room). Everything else should call connect() from a user action, so
 * idle pages stay connection-free.
 */
export const useLiveSocket = () => {
  const ctx = useSocket();
  const { connect } = ctx;
  useEffect(() => { connect(); }, [connect]);
  return ctx;
};
