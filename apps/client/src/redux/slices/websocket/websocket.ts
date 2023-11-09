import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WebSocketState {
  connected: boolean;
  messages: string[];
}

const initialState: WebSocketState = {
  connected: false,
  messages: [],
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    connectWebSocket: (state) => {
      state.connected = true;
    },
    disconnectWebSocket: (state) => {
      state.connected = false;
    },
    receiveWebSocketMessage: (state, action: PayloadAction<string>) => {
      state.messages.push(action.payload);
    },
  },
});

export type { WebSocketState };
export const {
  connectWebSocket,
  disconnectWebSocket,
  receiveWebSocketMessage,
} = websocketSlice.actions;
export default websocketSlice.reducer;
