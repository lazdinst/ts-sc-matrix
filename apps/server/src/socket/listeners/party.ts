import { Socket, Server as SocketIoServer } from 'socket.io';
import { PartyInviteType, ClientLobbyType, PartyType } from '../types';
import { clientLobby, clientParties } from '../index';

function getSocketIdByUserId(id: string, clientLobby: ClientLobbyType) {
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
  socket.on('send-party-invite', (partyInvite: PartyInviteType) => {
    console.log('[Server] ', partyInvite);
    const socketIds = [
      getSocketIdByUserId(partyInvite.recipient.id, clientLobby),
      getSocketIdByUserId(partyInvite.sender.id, clientLobby),
    ];
    io.to(socketIds).emit('send-party-invite', partyInvite);
  });

  socket.on('accept-party-invite', (partyInvite: PartyInviteType) => {
    console.log('[Server] accept-party-invite:', partyInvite);
    const socketIds = [
      getSocketIdByUserId(partyInvite.recipient.id, clientLobby),
      getSocketIdByUserId(partyInvite.sender.id, clientLobby),
    ];

    const party: PartyType = [partyInvite.recipient, partyInvite.sender];
    clientParties.set(partyInvite.sender.id, party);
    io.to(socketIds).emit('accept-party-invite', party);
  });

  socket.on('decline-party-invite', (partyInvite: PartyInviteType) => {
    console.log('[Server] decline-party-invite:', partyInvite);
    const socketIds = [
      getSocketIdByUserId(partyInvite.recipient.id, clientLobby),
      getSocketIdByUserId(partyInvite.sender.id, clientLobby),
    ];

    io.to(socketIds).emit('decline-party-invite', partyInvite);
  });

  socket.on('leave-party', (party: PartyType) => {
    console.log('[Server] leave-party:', party);

    const socketIds = party.map((player) => {
      return getSocketIdByUserId(player.id, clientLobby);
    });

    // Right now [0] is the party leader // invite sender
    clientParties.delete(party[0].id);
    io.to(socketIds).emit('leave-party', party);
  });
};

// send-party-invite - User is sending one invite to the server to the other user.
// accept-party-invite - User is accepting the invite from the server and server stores the party
// decline-party-invite - User is declining the invite from the server and server does nothing.
// confirm-party-invite - Server is confirming the party and sending the party to the users.
// leave-party - User is leaving the party and server is removing the party from the server.
