import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { StateTypes, CLIState, Command } from './types';

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
    updateOutputs: (state, action: PayloadAction<Command>) => {
      state.outputs = [...state.outputs, action.payload];
    },
    clearOutputs: (state) => {
      state.outputs = [];
    },
    reinitializeCLIState: () => initialState,
  },
});

export const {
  setCLIState,
  setPreviousRootCommand,
  updateOutputs,
  clearOutputs,
  reinitializeCLIState,
} = cli.actions;

export const getCLIState = (state: RootState) => state.cli.state;
export default cli.reducer;
