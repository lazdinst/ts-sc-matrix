export type ClientLobbyType = Map<string, PlayerConnection>;
export type ClientPartiesType = Map<string, PartyType>;

// apps/server/src/socket/types.ts
export type PlayerConnection = {
  id: string;
  username: string;
};

export type PartyType = PlayerConnection[];

export type PartyInviteType = {
  recipient: PlayerConnection;
  sender: PlayerConnection;
};
