import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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

const API_URL = 'http://localhost:5000';

export const fetchServerStatus = createAsyncThunk(
  'serverStatus/fetchServerStatus',
  async () => {
    try {
      const response = await axios.get(`${API_URL}/api/status`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Define the FetchServerStatusAction type
import { AsyncThunkAction } from '@reduxjs/toolkit';

export type FetchServerStatusAction = AsyncThunkAction<ServerStatusState, void, {}>;

const serverStatus = createSlice({
  name: 'serverStatus',
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
export const { connected, disconnected, setError, clearError } = serverStatus.actions;
export default serverStatus.reducer;
