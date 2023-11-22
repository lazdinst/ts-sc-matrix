import { Socket } from 'socket.io-client';
import { updateOutbox, PartyInviteType } from '../../slices/connections';

export const emitSendPartyInvite = (
  socket: Socket,
  getState: () => any,
  dispatch: (arg0: any) => void
) => {
  const user = getState().user.user;
  const outbox = getState().connections.outbox;
  if (!user || !outbox) return;
  const partyInvite: PartyInviteType = {
    recipient: outbox,
    sender: user,
  };
  socket.emit('send-party-invite', partyInvite);
  console.log('Party invite sent');
};

export const emitAcceptPartyInvite = (
  socket: Socket,
  getState: () => any,
  dispatch: (arg0: any) => void
) => {
  const user = getState().user.user;
  const invite = getState().connections.invite;
  if (!user || !invite) return;

  socket.emit('accept-party-invite', 'test');
  console.log('Accepted Party invite');
};

export const emitDeclinePartyInvite = (
  socket: Socket,
  getState: () => any,
  dispatch: (arg0: any) => void
) => {
  const user = getState().user.user;
  const invite = getState().connections.invite;
  if (!user || !invite) return;

  socket.emit('decline-party-invite', 'test');
  console.log('Declined Party invite');
};
