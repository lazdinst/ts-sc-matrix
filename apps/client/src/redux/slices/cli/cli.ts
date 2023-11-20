import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import { StateTypes, CLIState, CommandResponse } from './types';

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
    updateOutputs: (state, action: PayloadAction<CommandResponse>) => {
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
