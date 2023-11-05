import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state of the WebSocket connection
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
      // Set isConnected to true when connecting
      state.isConnected = true;
    },
    disconnectWebSocket: (state) => {
      // Set isConnected to false when disconnecting
      state.isConnected = false;
    },
    receiveWebSocketMessage: (state, action: PayloadAction<string>) => {
      // Add the received message to the messages array
      state.messages.push(action.payload);
    },
  },
});

export const {
  connectWebSocket,
  disconnectWebSocket,
  receiveWebSocketMessage,
} = websocketSlice.actions;

export default websocketSlice.reducer;
