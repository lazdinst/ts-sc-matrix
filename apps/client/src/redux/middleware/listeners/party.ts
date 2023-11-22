import { Socket } from 'socket.io-client';
import {
  updateLobby,
  addPendingInvite,
  ClientLobbyType,
  PlayerConnection,
  PlayerInvite,
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
  socket.on('party-invite', (invite: PlayerInvite) => {
    const user = getState().user.user;
    console.log('user:', user);
    console.log('party-invite:', invite);
    dispatch(addPendingInvite(invite));
  });
};
