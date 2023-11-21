import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../redux/store';

import {
  connectSocket,
  disconnectSocket,
} from '../../../redux/slices/websocket';

interface WebSocketProviderProps {
  children: React.ReactNode;
}

const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    if (!user) {
      return;
    }

    dispatch(connectSocket());

    return () => {
      dispatch(disconnectSocket());
    };
  }, []);
  return children;
};

export default WebSocketProvider;
