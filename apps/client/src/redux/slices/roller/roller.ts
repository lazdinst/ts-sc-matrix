import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface RollerState {
  loading: boolean;
  error: string | null;
  playerOneRoll: string[];
  playerTwoRoll: string[];
}

const initialState: RollerState = {
  loading: false,
  error: null,
  playerOneRoll: [],
  playerTwoRoll: [],
};

const DEFAULT_API_URL = 'http://localhost:6969';
const API_URL = import.meta.env.VITE_REACT_APP_API_URL || DEFAULT_API_URL;

export const fetchRolls = createAsyncThunk('roller/fetchRolls', async () => {
  const uri = `${API_URL}/api/roll`;
  const response = await axios.post(uri);
  return response.data;
});

const rollerSlice = createSlice({
  name: 'roller',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRolls.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRolls.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.playerOneRoll = action.payload[0];
        state.playerTwoRoll = action.payload[1];
      })
      .addCase(fetchRolls.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'An error occurred while fetching rolls.';
        state.playerOneRoll = [];
        state.playerTwoRoll = [];
      });
  },
});

export default rollerSlice.reducer;
