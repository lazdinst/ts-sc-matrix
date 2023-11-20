import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { io, Socket } from 'socket.io-client';
import { WS_URL } from '../redux/slices/config';
import {
  setupRollerListeners,
  setupUserConnections,
  setupSocketStateListeners,
} from './listeners';

import {
  connectWebSocket,
  disconnectWebSocket,
} from '../redux/slices/websocket';

import { setConnections } from '../redux/slices/connections';

import { setRolls } from '../redux/slices/roller';
import { User } from '../redux/slices/user/types';

interface WebSocketProviderProps {
  children: React.ReactNode;
}

const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (!user) {
      return;
    }

    let socket: Socket | null = null;

    const createSocket = () => {
      socket = io(WS_URL);
      console.log('Creating ws socket...');
      setupSocketStateListeners(
        socket,
        user,
        () => dispatch(connectWebSocket()),
        () => dispatch(disconnectWebSocket())
      );
      setupUserConnections(socket, (connections) =>
        dispatch(setConnections(connections))
      );
      setupRollerListeners(socket, (rolls) => dispatch(setRolls(rolls)));
    };

    createSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []); // Empty dependency array is intentional to run this effect only once

  return children;
};

export default WebSocketProvider;
