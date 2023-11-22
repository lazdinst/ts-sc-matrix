import { Socket } from 'socket.io-client';
import { updateOutbox, PartyInviteType } from '../../slices/connections';

export const emitSendPartyInvite = (
  socket: Socket,
  getState: () => any,
  dispatch: (arg0: any) => void
) => {
  const user = getState().user.user;
  const outbox = getState().connections.outbox;
  if (!user || !outbox) {
    console.log('No user or outbox');
    console.log('user:', user);
    console.log('outbox:', outbox);
    return;
  }
  const partyInvite: PartyInviteType = {
    recipient: outbox,
    sender: user,
  };
  socket.emit('send-party-invite', partyInvite);
  console.log('Party invite sent', partyInvite);
};

export const emitAcceptPartyInvite = (
  socket: Socket,
  getState: () => any,
  dispatch: (arg0: any) => void
) => {
  const user = getState().user.user;
  const invite = getState().connections.invite;
  if (!user || !invite) return;
  console.log('invite:', invite);
  socket.emit('accept-party-invite', invite);
  console.log('Emitted accept-party-invite');
};

export const emitDeclinePartyInvite = (
  socket: Socket,
  getState: () => any,
  dispatch: (arg0: any) => void
) => {
  if (!socket) throw new Error('[Emitter] Decline No socket connection');

  const user = getState().user.user;
  const invite = getState().connections.invite;
  if (!user || !invite) return;

  socket.emit('decline-party-invite', invite);
  console.log('Emitter: Declined Party invite');
};

export const emitLeaveParty = (
  socket: Socket,
  getState: () => any,
  dispatch: (arg0: any) => void
) => {
  if (!socket) throw new Error('[Emitter] Leave Party No socket connection');
  const party = getState().connections.party;
  if (!party) throw new Error('[Emitter] No party to leave');
  socket.emit('leave-party', party);
  console.log('Emitter: Declined Party invite');
};
