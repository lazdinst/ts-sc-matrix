import { Socket, Server as SocketIoServer } from 'socket.io';
import { PartyInviteType } from '../types';
import { clientLobby } from '../index';

function getSocketIdByUserId(id: string) {
  if (!clientLobby) return null;
  if (!clientLobby.size) return null;
  if (!id) return null;

  for (const [socketId, user] of clientLobby) {
    if (user.id === id) {
      return socketId;
    }
  }
  return null;
}

export const setupPartyListeners = (io: SocketIoServer, socket: Socket) => {
  socket.on('send-party-invite', (players: PartyInviteType) => {
    console.log(players);
    const socketIds = [
      getSocketIdByUserId(players.recipient.id),
      getSocketIdByUserId(players.sender.id),
    ];
    console.log('socketIds:', socketIds);
    console.log('clientLobby:', clientLobby);
    /// I need the connectClient map to get the socketID from the player.id

    io.to(socketIds).emit('send-party-invite', players);
  });
};
