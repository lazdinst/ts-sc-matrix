import { Socket } from 'socket.io-client';
import { RollerState } from '../../slices/roller/roller';
import { User } from '../../slices/user/types';
import { ConnectedClientsType } from '../../slices/connections';
import {
  setWebSocketConnected,
  setWebSocketDisconnected,
} from '../../slices/websocket';
import { updateLobby  } from '../../slices/connections';
import { setRolls } from '../../slices/roller/roller';
import { emitUserToSocket } from '../emitters';

import { setupPartyListeners, setupLobbyListeners } from './party';

export const inilializeSocketListeners = (
  socket: Socket,
  getState: () => any,
  dispatch: (arg0: any) => void
) => {
  setupSocketStateListeners(socket, getState, dispatch);
  setupLobbyListeners(socket, getState, dispatch);
  setupRollerListeners(socket, getState, dispatch);
  setupPartyListeners(socket, getState, dispatch);
};

export const setupSocketStateListeners = (
  socket: Socket,
  getState: () => any,
  dispatch: (arg0: any) => void
) => {
  socket.on('connect', () => {
    console.log('Connected...');
    dispatch(setWebSocketConnected());
    console.log('Emitting user to socket');
    emitUserToSocket(socket, getState, dispatch);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected...');
    dispatch(setWebSocketDisconnected());
  });

  socket.on('error', (error: Error) => {
    console.error('WebSocket error:', error);
  });
};

export const setupRollerListeners = (
  socket: Socket,
  getState: () => any,
  dispatch: (arg0: any) => void
) => {
  // TODO: Replace any with actual type
  socket.on('roll', (message: any) => {
    console.log('Roll:', message);
    const rollMessage: RollerState = message;
    console.log('rollMessage:', rollMessage);
    dispatch(setRolls(rollMessage));
  });
};

