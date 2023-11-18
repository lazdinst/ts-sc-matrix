import { Server as SocketIoServer, Socket } from 'socket.io';
import { setupConnectedClientListeners } from './listeners';

const allowedOrigins: string[] = (process.env.ALLOWED_ORIGINS || '').split(',');

let io: SocketIoServer;

type UserInfo = {
  _id: string;
  username: string;
};

const connectedClients = new Map<string, UserInfo>();

export const initializeSocketIO = (server: any) => {
  let totalConnections = 0;

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
    totalConnections++;
    console.log('emmitting message to client', totalConnections);

    io.emit('message', 'Hello, World!!');
    io.emit('connections', { count: totalConnections });
    setupConnectedClientListeners(socket, connectedClients);

    socket.on('user-connected', (userInfo: UserInfo) => {
      console.log('User connected:', userInfo);
      connectedClients.set(socket.id, userInfo);

      for (const [clientId, clientUserInfo] of connectedClients) {
        if (clientId !== socket.id) {
          socket.emit('user-info', clientUserInfo);
        }
      }
    });

    socket.on('disconnect', () => {
      totalConnections--;
      io.emit('connections', { count: totalConnections });

      console.log('Client disconnected');
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
