import { Middleware } from '@reduxjs/toolkit';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client';
import { WS_URL } from '../../config';
import { inilializeSocketListeners } from './listeners';
import {
  emitSendPartyInvite,
  emitAcceptPartyInvite,
  emitDeclinePartyInvite,
  emitLeaveParty,
} from './emitters';
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

      if (action.type === 'connections/send-invite') {
        const recipient = action.payload;

        if (!socket) {
          console.log('[send-invite] No socket connection');
          return;
        }

        if (!recipient) {
          console.log('[send-invite] No recipient or user to send invite');
          return;
        }

        dispatch(updateOutbox(recipient));
        emitSendPartyInvite(socket, getState, dispatch);
      }

      if (action.type === 'connections/accept-invite') {
        if (!socket) {
          console.log('[send-invite] No socket connection');
          return;
        }
        emitAcceptPartyInvite(socket, getState, dispatch);
      }

      if (action.type === 'connections/decline-invite') {
        if (!socket) {
          console.log('[send-invite] No socket connection');
          return;
        }
        emitDeclinePartyInvite(socket, getState, dispatch);
      }

      if (action.type === 'connections/leave-party') {
        if (!socket) {
          console.log('[leave-party] No socket connection');
          return;
        }
        emitLeaveParty(socket, getState, dispatch);
      }
      return next(action);
    };
};
export default socketMiddleware;
