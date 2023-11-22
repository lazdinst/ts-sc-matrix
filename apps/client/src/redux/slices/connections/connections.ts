import { createSlice, PayloadAction, Dispatch } from '@reduxjs/toolkit';
import {
  PlayerConnection,
  ClientLobbyType,
  PartyType,
  PartyInviteType,
} from './types';

interface ConnectionState {
  lobby: ClientLobbyType;
  party: PartyType | null;
  invite: PartyInviteType | null;
  outbox: PartyType | null;
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
    addPendingInvite(state, action: PayloadAction<PartyInviteType>) {
      state.invite = action.payload;
    },
    removePendingInvite(state) {
      state.invite = null;
    },
    createPartyFromInvite(state, action: PayloadAction<PartyType>) {
      state.party = action.payload;
    },
    updateOutbox(state, action: PayloadAction<PartyType>) {
      state.outbox = action.payload;
    },
    clearOutbox(state) {
      state.outbox = [];
    },
    declinePartyInvite(state) {
      state.party = [];
      state.invite = null;
    },
    leaveParty(state) {
      state.party = [];
    },
  },
});

export const {
  updateLobby,
  addPendingInvite,
  removePendingInvite,
  createPartyFromInvite,
  declinePartyInvite,
  updateOutbox,
  clearOutbox,
  leaveParty,
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

export const sendLeaveParty = () => {
  console.log('Sending Leave Party...');
  return (dispatch: Dispatch) => {
    dispatch({ type: 'connections/leave-party' });
  };
};

export default connections.reducer;
