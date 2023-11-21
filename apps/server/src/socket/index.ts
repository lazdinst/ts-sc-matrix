import { Server as SocketIoServer, Socket } from 'socket.io';
import {
  setupConnectedClientListeners,
  setupPartyListeners,
} from './listeners';
import { UserInfo, ConnectedClientsType } from './types';

const allowedOrigins: string[] = (process.env.ALLOWED_ORIGINS || '').split(',');

let io: SocketIoServer;

export const connectedClients: ConnectedClientsType = new Map<
  string,
  UserInfo
>();

export const initializeSocketIO = (server: any) => {
  io = new SocketIoServer(server, {
    cors: {
      // origin: allowedOrigins,
      origin: '* ',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  console.log('io Server Created');
  // Listeners
  io.on('connection', (socket: Socket) => {
    console.log('New Client Connected: ', socket.id);

    setupConnectedClientListeners(socket, connectedClients);
    setupPartyListeners(io, socket);
    socket.on('user-connected', (userInfo: UserInfo) => {
      console.log('User connected:', userInfo);
      console.log('Socket ID:', socket.id);
      connectedClients.set(socket.id, userInfo);
      console.log('Emitting to all connections', connectedClients);
      emitToAllConnections(connectedClients);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      connectedClients.delete(socket.id);
      emitToAllConnections(connectedClients);
    });
    socket.on('roll', () => {
      console.log('Rolled');
    });
  });

  io.on('error', (error) => {
    console.error('Socket.IO error:', error);
  });
};

export const emitToAllConnections = (
  connectedClients: Map<string, UserInfo>
) => {
  const connections = getConnections(connectedClients);
  if (connections.length > 0) {
    console.log('Emitting to all connections', connections);
    io.sockets.emit('connections', connections);
  }
};

export const getConnections = (connectedClients: Map<string, UserInfo>) => {
  return Array.from(connectedClients.entries()).map((connection) => {
    return connection[1];
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
};
