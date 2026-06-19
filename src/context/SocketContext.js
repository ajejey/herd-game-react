import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { reportError } from '../lib/reportError';
import { SOCKET_OPTS, attachConnectivityReconnect } from '../lib/socketConfig';

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:3001';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Shared robust config: polling-first, never-give-up reconnection, mobile
    // handshake timeout. (Previously this path capped at 10 attempts with no
    // delay cap — it was the biggest source of socket_connect errors.)
    const newSocket = io(SOCKET_URL, SOCKET_OPTS);

    newSocket.on('connect', () => {
      console.log('Socket connected');
      setConnected(true);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setConnected(false);
      reportError('socket_connect', error?.message || 'connect_error', {
        info: `ns=herd transport=${newSocket.io?.engine?.transport?.name || '?'}`,
      });
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setConnected(false);
    });

    setSocket(newSocket);

    // Reconnect when the tab returns to the foreground / network comes back
    // (the main iOS Safari failure mode).
    const detachReconnect = attachConnectivityReconnect(newSocket);

    return () => {
      detachReconnect();
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
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
