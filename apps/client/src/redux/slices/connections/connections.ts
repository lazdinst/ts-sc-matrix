import { createSlice, PayloadAction } from '@reduxjs/toolkit';
export type Connection = {
  _id: string;
  username: string;
};

export type ConnectedClientsType = Connection[];

interface ConnectionState {
  connections: ConnectedClientsType;
  party: ConnectedClientsType;
}

const initialState: ConnectionState = {
  connections: [],
  party: [],
};

const connections = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setConnections(state, action: PayloadAction<ConnectedClientsType>) {
      state.connections = action.payload;
    },
  },
});

export const { setConnections } = connections.actions;

export default connections.reducer;
