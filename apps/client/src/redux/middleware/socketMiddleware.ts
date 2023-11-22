import { Middleware } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import { WS_URL } from '../../config';
import { inilializeSocketListeners } from './listeners';
import { emitSendAcceptPartyInvite } from './emitters';
import { updateOutbox } from '../slices/connections';

interface SocketAction {
  type: string;
  payload?: any;
}

const socketMiddleware = (): Middleware => {
  let socket: Socket | null = null;
  return ({ dispatch, getState }) =>
    (next) =>
    (action: SocketAction) => {
      if (action.type === 'socket/connect') {
        const user = getState().user.user;

        if (!socket && user) {
          socket = io(WS_URL);

          inilializeSocketListeners(socket, getState, dispatch);
        }
      }

      if (action.type === 'socket/disconnect') {
        if (socket) {
          socket.close();
          socket = null;
        }
      }

      if (action.type === 'connections/accept-invite') {
        const player = action.payload;
        if (player) {
          console.log('Ready to emitt accept invite');
          // socket emitt
        }
      }

      if (action.type === 'connections/send-invite') {
        const player = action.payload;
        const user = getState().user.user;

        if (!socket) {
          console.log('[send-invite] No socket connection');
          return;
        }

        if (!player || !user) {
          console.log('[send-invite] No player or user to send invite');
          return;
        }

        dispatch(updateOutbox([player, user]));
        emitSendAcceptPartyInvite(socket, getState);
      }

      return next(action);
    };
};
export default socketMiddleware;
