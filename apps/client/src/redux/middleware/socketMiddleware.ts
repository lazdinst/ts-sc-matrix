import { Middleware } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import { WS_URL } from '../../config';
import { inilializeSocketListeners } from './listeners';

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

      if(action.type === 'connections/accept-invite') {
        const player = action.payload;
        if(player) {
          console.log('Ready to emitt accept invite')
        }
      }

      return next(action);
    };
};
export default socketMiddleware;
