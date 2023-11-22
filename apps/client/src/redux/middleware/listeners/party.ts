import { Socket } from 'socket.io-client';
import { updateLobby, addPendingInvite, ConnectedClientsType, PlayerConnection } from '../../slices/connections';

export const setupLobbyListeners = (
    socket: Socket,
    getState: () => any,
    dispatch: (arg0: any) => void
  ) => {
    socket.on('connections', (connections: ConnectedClientsType) => {
      console.log('Lobby:', connections);
      dispatch(updateLobby(connections));
    });
  };
  

export const setupPartyListeners = (
    socket: Socket,
    getState: () => any,
    dispatch: (arg0: any) => void
  ) => {
    socket.on('party-invite', (player: PlayerConnection) => {
      console.log('party-invite:', player);
      dispatch(addPendingInvite(player));
    });
  }