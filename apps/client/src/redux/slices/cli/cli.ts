import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export const STATES = {
  INIT: 'INIT',
  LOGIN: 'LOGIN',
  PASSWORD: 'PASSWORD',
  FAILED: 'FAILED',
  SUCCESS: 'SUCCESS',
  AUTHENTICATING: 'AUTHENTICATING',
  REGISTER: 'REGISTER',
} as const;

type StateTypes = keyof typeof STATES;

interface CLIState {
  connected: boolean;
  state: StateTypes;
}

const initialState: CLIState = {
  connected: false,
  state: 'INIT',
};

const cli = createSlice({
  name: 'cli',
  initialState,
  reducers: {
    setCLIState: (state, action: PayloadAction<StateTypes>) => {
      state.state = action.payload;
    },
  },
});

export const { setCLIState } = cli.actions;

export const getCLIState = (state: RootState) => state.cli.state;
export default cli.reducer;
