import { Socket } from 'socket.io-client';

export const emitUserToSocket = (
  socket: Socket,
  getState: () => any,
  dispatch: (arg0: any) => void
) => {
  const user = getState().user.user;
  socket.emit('user-connected', user);
};
