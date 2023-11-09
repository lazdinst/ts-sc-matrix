import React, { useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';

import {
  setupSocketListeners,
  setupConnectionListners,
  setupSocketStateListeners,
} from './listeners';

interface WebSocketProviderProps {
  children: ReactNode;
}

const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  let socket: Socket | null = null; // Declare socket variable

  const createSocket = () => {
    socket = io('ws://localhost:5000');
    console.log('Creating ws socket...');
    setupSocketStateListeners(socket, dispatch);
    setupSocketListeners(socket, dispatch);
    setupConnectionListners(socket, dispatch);

    return socket;
  };

  useEffect(() => {
    console.log('Connecting to websocket server...');
    const socket = createSocket();

    return () => {
      if (socket?.connected) {
        socket.disconnect();
      }
    };
  }, []);

  return children;
};

export default WebSocketProvider;
