import {
  createSlice,
  createAction,
  createAsyncThunk,
  PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../../../config';

const defaultPlayerRoll = {
  name: '',
  race: '',
  units: [],
};

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

export interface Roll {
  playerOne: Player;
  playerTwo: Player;
}

export interface RollerState {
  loading: boolean;
  error: string | null;
  playerOne: Player;
  playerTwo: Player;
}

export interface RollerState extends Roll {
  loading: boolean;
  error: string | null;
}

const initialState: RollerState = {
  loading: false,
  error: null,
  playerOne: defaultPlayerRoll,
  playerTwo: defaultPlayerRoll,
};

export const executeNewRoll = createAsyncThunk(
  'roller/executeNewRoll',
  async () => {
    const uri = `${API_URL}/api/roll`;
    const response = await axios.post(uri);
    return response.data;
  }
);

export const setRolls = createAction<Roll>('roller/setRolls');

const rollerSlice = createSlice({
  name: 'roller',
  initialState,
  reducers: {
    setRolls: (state, action: PayloadAction<Roll>) => {
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
