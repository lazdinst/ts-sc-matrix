import { Server as SocketIoServer, Socket } from 'socket.io';
import {
  setupConnectedClientListeners,
  setupPartyListeners,
} from './listeners';
import { PlayerConnection, ClientLobbyType, ClientPartiesType } from './types';

const allowedOrigins: string[] = (process.env.ALLOWED_ORIGINS || '').split(',');

let io: SocketIoServer;

export const clientLobby: ClientLobbyType = new Map<string, PlayerConnection>();
export const clientParties: ClientPartiesType = new Map<
  string,
  PlayerConnection[]
>();

const disbandPartyById = (socketId: string) => {
  // Look at clientLobby and find the user with the socket id
  // look at the client parties to see if that user is in a party
  // if they are, disband the party
  // if they are not, do nothing
  console.log('Disbanding party for socket id', socketId);
  console.log('Client parties', clientParties);
  const disconnectedPlayer = clientLobby.get(socketId);
  if (!disconnectedPlayer) {
    return;
  }
  if (!disconnectedPlayer) {
    return;
  }

  for (const [partyId, partyMembers] of clientParties.entries()) {
    const found = partyMembers.some(
      (player) => JSON.stringify(player) === JSON.stringify(disconnectedPlayer)
    );

    if (found) {
      console.log('Found player in party', disconnectedPlayer);
      console.log('Party ID', partyId);
      console.log('cLient lobby', clientLobby);
      // get clientLobby ids for each party member that have partyId
      // clientParties.delete(partyId);
      break; // Exit the loop after deleting the party
    }
  }
  console.log('Client parties', clientParties);
};

export const initializeSocketIO = (server: any) => {
  io = new SocketIoServer(server, {
    cors: {
      // origin: allowedOrigins,
      origin: '* ',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });
  // Listeners
  io.on('connection', (socket: Socket) => {
    console.log('New Client Connected: ', socket.id);

    setupConnectedClientListeners(socket, clientLobby);
    setupPartyListeners(io, socket);
    socket.on('user-connected', (player: PlayerConnection) => {
      clientLobby.set(socket.id, player);
      emitLobbyToAllClients(clientLobby);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
      // TODO: Clean up clientParties by disbanding any parties that the client was in
      disbandPartyById(socket.id);

      clientLobby.delete(socket.id);
      emitLobbyToAllClients(clientLobby);
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

export const emitPartyToPartyMembers = (clientParties: ClientPartiesType) => {
  const parties = Array.from(clientParties.entries()).map((client) => {
    return client[1];
  });
  if (parties.length > 0) {
    console.log('Emitting to all Parties', lobby);
    io.sockets.emit('client-lobby', lobby);

    console.log('[Server] accept-party-invite:', partyInvite);
    const socketIds = [
      getSocketIdByUserId(partyInvite.recipient.id, clientLobby),
      getSocketIdByUserId(partyInvite.sender.id, clientLobby),
    ];

    io.to(socketIds).emit('accept-party-invite', party);
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
