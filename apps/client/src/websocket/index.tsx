import React, { useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketContext = React.createContext<{
  socket: Socket | null;
  isConnected: boolean;
  messages: string[];
  sendMessage: (message: string) => void;
} | null>(null);

const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    console.log('Connecting to websocket server...');
    const newSocket = io('ws://localhost:5000');

    newSocket.on('connect', () => {
      setIsConnected(true);
      sendMessage('Hello world!');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('message', (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    newSocket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
    
    setSocket(newSocket);

    return () => {
      if (newSocket.connected) {
        newSocket.disconnect();
      }
    };
  }, []);

  const sendMessage = (message: string) => {
    if (socket) {
      socket.emit('sendMessage', message);
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, messages, sendMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketProvider;
