import { Socket, Server as SocketIoServer } from 'socket.io';
import { UserInfo } from '../types';

export const setupPartyListeners = (io: SocketIoServer, socket: Socket) => {
  socket.on('party-request', (user: UserInfo) => {
    console.log('party-request:', user);
  });
};
