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
  previousRootCommand: string;
  outputs: string[];
}

const initialState: CLIState = {
  connected: false,
  state: 'INIT',
  previousRootCommand: '',
  outputs: [],
};

const cli = createSlice({
  name: 'cli',
  initialState,
  reducers: {
    setCLIState: (state, action: PayloadAction<StateTypes>) => {
      state.state = action.payload;
    },
    setPreviousRootCommand: (state, action: PayloadAction<string>) => {
      state.previousRootCommand = action.payload;
    },
    updateOutputs: (state, action: PayloadAction<string>) => {
      state.outputs = [...state.outputs, action.payload];
    },
    clearOutputs: (state) => {
      state.outputs = [];
    },
    reinitialize: () => initialState,
  },
});

export const {
  setCLIState,
  setPreviousRootCommand,
  updateOutputs,
  clearOutputs,
  reinitialize,
} = cli.actions;

export const getCLIState = (state: RootState) => state.cli.state;
export default cli.reducer;
