import { Server as SocketIoServer, Socket } from 'socket.io';
import {
  setupConnectedClientListeners,
  setupPartyListeners,
} from './listeners';
import { PlayerConnection, ClientLobbyType } from './types';

const allowedOrigins: string[] = (process.env.ALLOWED_ORIGINS || '').split(',');

let io: SocketIoServer;

export const clientLobby: ClientLobbyType = new Map<string, PlayerConnection>();

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

    setupConnectedClientListeners(socket, clientLobby);
    setupPartyListeners(io, socket);
    socket.on('user-connected', (userInfo: PlayerConnection) => {
      console.log('User connected:', userInfo);
      console.log('Socket ID:', socket.id);
      clientLobby.set(socket.id, userInfo);
      console.log('Emitting to all connections', clientLobby);
      emitLobbyToAllClients(clientLobby);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      clientLobby.delete(socket.id);
      emitLobbyToAllClients(clientLobby);
    });
    socket.on('roll', () => {
      console.log('Rolled');
    });
  });

  io.on('error', (error) => {
    console.error('Socket.IO error:', error);
  });
};

export const emitLobbyToAllClients = (
  clientLobby: Map<string, PlayerConnection>
) => {
  const lobby = getLobby(clientLobby);
  if (lobby.length > 0) {
    console.log('Emitting to all lobby', lobby);
    io.sockets.emit('client-lobby', lobby);
  }
};

export const getLobby = (clientLobby: Map<string, PlayerConnection>) => {
  return Array.from(clientLobby.entries()).map((client) => {
    return client[1];
  });
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io has not been initialized');
  }
  return io;
};
