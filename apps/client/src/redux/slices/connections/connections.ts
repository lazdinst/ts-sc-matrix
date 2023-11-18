import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ConnectionState {
  connections: string[];
}

const initialState: ConnectionState = {
  connections: [],
};

const connections = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    addConnection(state, action: PayloadAction<string>) {
      state.connections.push(action.payload);
    },
    removeConnection(state, action: PayloadAction<string>) {
      state.connections = state.connections.filter(
        (conn) => conn !== action.payload
      );
    },
    setConnections(state, action: PayloadAction<string[]>) {
      state.connections = action.payload;
    },
  },
});

export const { addConnection, removeConnection, setConnections } =
  connections.actions;

export default connections.reducer;
