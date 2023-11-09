import React, { useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import {
  connectWebSocket,
  disconnectWebSocket,
  receiveWebSocketMessage,
} from '../redux/slices/websocket';

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketContext = React.createContext<{
  socket: Socket | null;
  sendMessage: (message: string) => void;
} | null>(null);

const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  let socket: Socket | null = null; // Declare socket variable

  const createSocket = () => {
    socket = io('ws://localhost:5000');
    console.log('Creating ws socket...');

    socket.on('connect', () => {
      console.log('Connected...');
      dispatch(connectWebSocket());
      sendMessage('Hello world!');
    });

    socket.on('disconnect', () => {
      dispatch(disconnectWebSocket());
    });

    socket.on('message', (message: string) => {
      dispatch(receiveWebSocketMessage(message));
    });

    socket.on('connections', (connections: { count: number }) => {
      console.log('Connections:', connections);
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

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

  const sendMessage = (message: string) => {
    // You can dispatch any necessary actions here if needed.
  };

  return (
    <WebSocketContext.Provider value={{ socket, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
