import {
  createSlice,
  createAction,
  createAsyncThunk,
  PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../../config';

export interface Unit {
  _id: string;
  race: string;
  name: string;
  mins: number;
  gas: number;
  type: UnitTypes;
  __v: number;
}

export type UnitTypes =
  | 'core'
  | 'harass'
  | 'core'
  | 'caster'
  | 'gnd_mass'
  | 'air_support'
  | 'devastator'
  | 'air_mass'
  | 'unknown';

export interface Player {
  name: string;
  race: string;
  units: Unit[];
}

export interface PlayerRollsType {
  players: Player[];
}

export interface RollerState {
  loading: boolean;
  error: string | null;
  players: Player[];
}

export interface RollerState extends PlayerRollsType {
  loading: boolean;
  error: string | null;
}

const initialState: RollerState = {
  loading: false,
  error: null,
  players: [],
};

export const executeNewRoll = createAsyncThunk(
  'roller/executeNewRoll',
  async () => {
    const uri = `${API_URL}/api/roll`;
    const response = await axios.post(uri);
    return response.data;
  }
);

export const setPlayerRolls = createAction<PlayerRollsType>(
  'roller/setPlayerRolls'
);

const rollerSlice = createSlice({
  name: 'roller',
  initialState,
  reducers: {
    setPlayerRolls: (state, action: PayloadAction<any>) => {
      console.log('action.payload.players', action.payload);
      const players = action.payload;
      return {
        ...state,
        players: action.payload,
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
        state.players = [];
      });
  },
});

export default rollerSlice.reducer;
