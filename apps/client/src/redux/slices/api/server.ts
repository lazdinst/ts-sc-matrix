import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AsyncThunkAction } from '@reduxjs/toolkit';
import axios from 'axios';

const DEFAULT_API_URL = 'http://localhost:6969';
const API_URL = import.meta.env.VITE_REACT_APP_API_URL || DEFAULT_API_URL;

interface ServerStatusState {
  connected: boolean;
  error: string | null;
  loading: boolean;
}

const initialState: ServerStatusState = {
  connected: false,
  error: null,
  loading: false,
};

interface ServerStatusResponse {
  connected: boolean;
}

export const fetchServerStatus = createAsyncThunk<ServerStatusResponse, void>(
  'server/fetchServerStatus',
  async () => {
    const uri = `${API_URL}/api/status`;
    const response = await axios.get<ServerStatusResponse>(uri);
    return response.data;
  }
);

export type FetchServerStatusAction = AsyncThunkAction<
  ServerStatusState,
  void,
  object
>;

const server = createSlice({
  name: 'server',
  initialState,
  reducers: {
    connected: (state) => {
      state.connected = true;
    },
    disconnected: (state) => {
      state.connected = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServerStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchServerStatus.fulfilled, (state, action) => {
        state.connected = action.payload.connected;
        state.error = null;
        state.loading = false;
      })
      .addCase(fetchServerStatus.rejected, (state, action) => {
        state.error = action.error.message as string;
        state.loading = false;
      });
  },
});

export type { ServerStatusState };
export const { connected, disconnected, setError, clearError } = server.actions;
export default server.reducer;
