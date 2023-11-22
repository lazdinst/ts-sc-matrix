import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';

export type PlayerConnection = {
  _id: string;
  username: string;
};

export type ConnectedClientsType = PlayerConnection[];

interface ConnectionState {
  lobby: ConnectedClientsType;
  party: ConnectedClientsType;
  invite: PlayerConnection | null;
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
    addPendingInvite(state, action: PayloadAction<PlayerConnection>) {
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

export const { updateLobby, addPendingInvite, removePendingInvite, acceptPendingInvite, declinePartyInvite } = connections.actions;

export const sendAcceptPartyInvite = (player: PlayerConnection) => {
  console.log('Sending Accept Party invite...');
  return (dispatch: Dispatch) => {
    dispatch({ type: 'connections/accept-invite', payload: player });
  };
};

export const sendDeclinePartyInvite = () => {
  console.log('Sending Decline Party invite...');
  return (dispatch: Dispatch) => {
    dispatch({ type: 'connections/decline-invite' });
  };
};

export default connections.reducer;