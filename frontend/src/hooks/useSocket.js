import { useEffect, useRef, useCallback } from 'react';
import socket from '../services/socket';

/**
 * Custom hook for Socket.IO connection lifecycle.
 * Connects on mount, disconnects on unmount.
 */
export function useSocket() {
  const isConnected = useRef(false);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    isConnected.current = socket.connected;

    const onConnect = () => { isConnected.current = true; };
    const onDisconnect = () => { isConnected.current = false; };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  const emit = useCallback((event, data) => {
    socket.emit(event, data);
  }, []);

  const on = useCallback((event, handler) => {
    socket.on(event, handler);
    return () => socket.off(event, handler);
  }, []);

  const off = useCallback((event, handler) => {
    socket.off(event, handler);
  }, []);

  const disconnect = useCallback(() => {
    socket.disconnect();
  }, []);

  return { socket, emit, on, off, disconnect, isConnected };
}

export default useSocket;
