import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WebSocketState {
  isConnected: boolean;
  messages: string[];
}

const initialState: WebSocketState = {
  isConnected: false,
  messages: [],
};

const websocketSlice = createSlice({
  name: 'websocket',
  initialState,
  reducers: {
    connectWebSocket: (state) => {
      state.isConnected = true;
    },
    disconnectWebSocket: (state) => {
      state.isConnected = false;
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
