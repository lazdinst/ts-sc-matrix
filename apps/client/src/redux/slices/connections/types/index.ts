export type PlayerConnection = {
  id: string;
  username: string;
};

export type PartyInviteType = {
  recipient: PlayerConnection;
  sender: PlayerConnection;
};

export type ClientLobbyType = PlayerConnection[];
export type PartyType = PlayerConnection[];
