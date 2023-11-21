import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export type Connection = {
  _id: string;
  username: string;
};

export type ConnectedClientsType = Connection[];

interface ConnectionState {
  lobby: ConnectedClientsType;
  party: ConnectedClientsType;
  invite: Connection | null;
}

const initialState: ConnectionState = {
  lobby: [],
  party: [],
  invite: null,
};

const connections = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    updateLobby(state, action: PayloadAction<ConnectedClientsType>) {
      state.lobby = action.payload;
    },
    addPendingInvite(state, action: PayloadAction<Connection>) {
      state.invite = action.payload;
    },
    removePendingInvite(state) {
      state.invite = null;
    },
    acceptPendingInvite(state, action: PayloadAction<ConnectedClientsType>) {
      state.party = action.payload;
    },
    declinePartyInvite(state) {
      state.party = [];
    },
  },
});

export const { updateLobby } = connections.actions;

export default connections.reducer;
