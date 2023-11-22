import { Socket } from 'socket.io-client';

export const emitSendAcceptPartyInvite = (
  socket: Socket,
  getState: () => any
) => {
  const outbox = getState().connections.outbox;
  socket.emit('party-invite', outbox);
  console.log('Party invite sent');
};
