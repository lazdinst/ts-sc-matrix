import { Socket } from 'socket.io-client';
import { RollerState } from '../../redux/slices/roller/roller';
import { User } from '../../redux/slices/user/types';
import { ConnectedClientsType } from '../../redux/slices/connections';

const emitUserToSocket = (socket: Socket, user: User) => {
  socket.emit('user-connected', user);
};

export const setupSocketStateListeners = (
  socket: Socket,
  user: User,
  connectWebSocket: () => void,
  disconnectWebSocket: () => void
) => {
  socket.on('connect', () => {
    console.log('Connected...');
    connectWebSocket();
    emitUserToSocket(socket, user);
  });

  socket.on('disconnect', () => {
    disconnectWebSocket();
  });

  socket.on('error', (error: Error) => {
    console.error('WebSocket error:', error);
  });
};

export const setupUserConnectionListeners = (
  socket: Socket,
  setConnections: (connections: ConnectedClientsType) => void
) => {
  socket.on('connections', (connections: ConnectedClientsType) => {
    console.log('Connections:', connections);
    setConnections(connections);
  });
};

// export const setupConnectionListners = (socket: Socket) => {
//   socket.on('connections', (connections: { count: number }) => {
//     console.log('Connections:', connections);
//   });
// };

export const setupRollerListeners = (
  socket: Socket,
  setRolls: (arg0: RollerState) => void
) => {
  socket.on('roll', (message: any) => {
    console.log('Roll:', message);
    const rollMessage: RollerState = message;
    console.log('rollMessage:', rollMessage);
    setRolls(rollMessage);
  });
};
