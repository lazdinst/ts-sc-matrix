export type ClientLobbyType = Map<string, PlayerConnection>;

// apps/server/src/socket/types.ts
export type PlayerConnection = {
  id: string;
  username: string;
};

export type PartyInviteType = {
  recipient: PlayerConnection;
  sender: PlayerConnection;
};

export type PartyType = PlayerConnection[];
