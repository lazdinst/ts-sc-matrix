import { Socket } from 'socket.io-client';
import {
  updateLobby,
  clearOutbox,
  addPendingInvite,
  removePendingInvite,
  createPartyFromInvite,
  ClientLobbyType,
  PartyInviteType,
  PartyType,
  leaveParty,
} from '../../slices/connections';

export const setupLobbyListeners = (
  socket: Socket,
  getState: () => any,
  dispatch: (arg0: any) => void
) => {
  socket.on('client-lobby', (connections: ClientLobbyType) => {
    console.log('Lobby:', connections);
    dispatch(updateLobby(connections));
  });
};

export const setupPartyListeners = (
  socket: Socket,
  getState: () => any,
  dispatch: (arg0: any) => void
) => {
  socket.on('send-party-invite', (invite: PartyInviteType) => {
    const user = getState().user.user;
    console.log('user:', user);
    console.log('party-invite:', invite);
    dispatch(addPendingInvite(invite));
  });

  socket.on('accept-party-invite', (party: PartyType) => {
    console.log('Client: accept-party-invite:', party);
    dispatch(removePendingInvite());
    dispatch(createPartyFromInvite(party));
    dispatch(clearOutbox());
  });

  socket.on('decline-party-invite', (party: PartyType) => {
    console.log('Client: decline-party-invite:', party);
    dispatch(removePendingInvite());
    dispatch(clearOutbox());
  });

  socket.on('leave-party', (party: PartyType) => {
    console.log('Client: leave-party:', party);
    dispatch(leaveParty());
  });
};
