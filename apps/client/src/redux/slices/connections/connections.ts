import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import {
  PlayerConnection,
  ClientLobbyType,
  PartyType,
  PlayerInvite,
} from './types';

interface ConnectionState {
  lobby: ClientLobbyType;
  party: PartyType | null;
  invite: PlayerInvite | null;
  outbox: PlayerInvite | null;
}

const initialState: ConnectionState = {
  lobby: [],
  party: [],
  invite: null,
  outbox: null,
};

const connections = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    updateLobby(state, action: PayloadAction<ClientLobbyType>) {
      state.lobby = action.payload;
    },
    addPendingInvite(state, action: PayloadAction<PlayerInvite>) {
      state.invite = action.payload;
    },
    removePendingInvite(state) {
      state.invite = null;
    },
    acceptPendingInvite(state, action: PayloadAction<ClientLobbyType>) {
      state.party = action.payload;
    },
    updateOutbox(state, action: PayloadAction<PlayerInvite>) {
      state.outbox = action.payload;
    },
    declinePartyInvite(state) {
      state.party = [];
    },
  },
});

export const {
  updateLobby,
  addPendingInvite,
  removePendingInvite,
  acceptPendingInvite,
  declinePartyInvite,
  updateOutbox,
} = connections.actions;

export const sendPartyInvite = (player: PlayerConnection) => {
  console.log('Sending Party invite...');
  return (dispatch: Dispatch) => {
    dispatch({ type: 'connections/send-invite', payload: player });
  };
};

export const sendAcceptPartyInvite = () => {
  console.log('Sending Accept Party invite...');
  return (dispatch: Dispatch) => {
    dispatch({ type: 'connections/accept-invite' });
  };
};

export const sendDeclinePartyInvite = () => {
  console.log('Sending Decline Party invite...');
  return (dispatch: Dispatch) => {
    dispatch({ type: 'connections/decline-invite' });
  };
};

export default connections.reducer;
