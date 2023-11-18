import { Server as SocketIoServer, Socket } from 'socket.io';
import { setupConnectedClientListeners } from './listeners';

const allowedOrigins: string[] = (process.env.ALLOWED_ORIGINS || '').split(',');

let io: SocketIoServer;

type UserInfo = {
  _id: string;
  username: string;
};

export const connectedClients = new Map<string, UserInfo>();

export const initializeSocketIO = (server: any) => {
  io = new SocketIoServer(server, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  console.log('io Server Created');

  io.on('connection', (socket: Socket) => {
    console.log('New Client Connected: ', socket.id);

    setupConnectedClientListeners(socket, connectedClients);

    socket.on('user-connected', (userInfo: UserInfo) => {
      console.log('User connected:', userInfo);
      connectedClients.set(socket.id, userInfo);

      const connections = Array.from(connectedClients.entries()).map(
        (connection) => connection[1]
      );
      if (connections.length > 1) {
        socket.emit('connections', connections);
      }
    });

    socket.on('disconnect', () => {
      connectedClients.delete(socket.id);
    });
    socket.on('roll', () => {
      console.log('Rolled');
    });
  });

  io.on('error', (error) => {
    console.error('Socket.IO error:', error);
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
};
