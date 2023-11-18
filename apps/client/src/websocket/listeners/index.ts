import { Socket } from 'socket.io-client';
import { RollerState } from '../../redux/slices/roller/roller';
import { User } from '../../redux/slices/user/types';

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

export const setupUserConnections = (socket: Socket, setConnections: any) => {
  socket.on('connections', (users) => {
    console.log('Connections:', users);
    setConnections('users');
  });
};

// export const setupConnectionListners = (socket: Socket) => {
//   socket.on('connections', (connections: { count: number }) => {
//     console.log('Connections:', connections);
//   });
// };

export const setupRollerListeners = (socket: Socket, setRolls: any) => {
  socket.on('roll', (message: any) => {
    console.log('Roll:', message);
    const rollMessage: RollerState = message;
    console.log('rollMessage:', rollMessage);
    setRolls(rollMessage);
  });
};
