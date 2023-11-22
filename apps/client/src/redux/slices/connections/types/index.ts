export type ClientLobbyType = PlayerConnection[];

export type PlayerConnection = {
  id: string;
  username: string;
};

export type PartyType = PlayerConnection[];

export type PartyInviteType = {
  recipient: PlayerConnection;
  sender: PlayerConnection;
};
