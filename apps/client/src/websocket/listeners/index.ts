import { Socket } from 'socket.io-client'; // Import your Socket.io library
import { Dispatch } from 'redux';

import {
  connectWebSocket,
  disconnectWebSocket,
} from '../../redux/slices/websocket';

import { setRolls } from '../../redux/slices/roller';
import { RollerState } from '../../redux/slices/roller/roller';

export const setupSocketStateListeners = (
  socket: Socket,
  dispatch: Dispatch
) => {
  socket.on('connect', () => {
    console.log('Connected...');
    dispatch(connectWebSocket());
  });

  socket.on('disconnect', () => {
    dispatch(disconnectWebSocket());
  });

  socket.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
};

export const setupConnectionListners = (socket: Socket, dispatch: Dispatch) => {
  socket.on('connections', (connections: { count: number }) => {
    console.log('Connections:', connections);
  });
};

export const setupSocketListeners = (socket: Socket, dispatch: Dispatch) => {
  socket.on('roll', (message: any) => {
    console.log('Roll:', message);
    const rollMessage: RollerState = message;
    console.log('rollMessage:', rollMessage);
    dispatch(setRolls(rollMessage));
  });
};
