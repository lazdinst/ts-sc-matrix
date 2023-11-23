import { Socket } from 'socket.io-client';
import {
  setWebSocketConnected,
  setWebSocketDisconnected,
} from '../../slices/websocket';
import { setPlayerRolls } from '../../slices/roller/roller';
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
  socket.on('roll', (players: any) => {
    const party = getState().connections.party;
    console.log('party:', party);
    console.log('Roll:', players);

    players[0].name = party[0].username;
    players[1].name = party[1].username;
    console.log('players:', players);
    dispatch(setPlayerRolls(players));
  });
};
