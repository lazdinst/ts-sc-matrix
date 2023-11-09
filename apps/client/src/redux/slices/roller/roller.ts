import {
  createSlice,
  createAction,
  createAsyncThunk,
  PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';

export interface RollerState {
  loading: boolean;
  error: string | null;
  playerOne: {
    name: string;
    race: string;
    units: Unit[];
  };
  playerTwo: {
    name: string;
    race: string;
    units: Unit[];
  };
}

const defaultPlayerRoll = {
  name: '',
  race: '',
  units: [],
};

export interface RollMessage {
  playerOne: {
    name: string;
    race: string;
    units: Unit[];
  };
  playerTwo: {
    name: string;
    race: string;
    units: Unit[];
  };
}

export interface RollerState extends RollMessage {
  loading: boolean;
  error: string | null;
}

const initialState: RollerState = {
  loading: false,
  error: null,
  playerOne: defaultPlayerRoll,
  playerTwo: defaultPlayerRoll,
};

export interface Unit {
  _id: string;
  race: string;
  name: string;
  mins: number;
  gas: number;
  type: string;
  __v: number;
}

const DEFAULT_API_URL = 'http://localhost:6969';
const API_URL = import.meta.env.VITE_REACT_APP_API_URL || DEFAULT_API_URL;

export const executeNewRoll = createAsyncThunk(
  'roller/executeNewRoll',
  async () => {
    const uri = `${API_URL}/api/roll`;
    const response = await axios.post(uri);
    return response.data;
  }
);

export const setRolls = createAction<RollMessage>('roller/setRolls');

const rollerSlice = createSlice({
  name: 'roller',
  initialState,
  reducers: {
    setRolls: (state, action: PayloadAction<RollMessage>) => {
      return {
        ...state,
        playerOne: action.payload.playerOne,
        playerTwo: action.payload.playerTwo,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(executeNewRoll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(executeNewRoll.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(executeNewRoll.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message || 'An error occurred while fetching rolls.';
        state.playerOne = defaultPlayerRoll;
        state.playerTwo = defaultPlayerRoll;
      });
  },
});

export default rollerSlice.reducer;
