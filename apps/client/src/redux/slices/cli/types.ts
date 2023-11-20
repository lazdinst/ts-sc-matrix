import { STATES } from './constants';

export interface Command {
  type: string;
  cmd: string;
  status: string;
  messages: string[];
}

export type StateTypes = keyof typeof STATES;

export interface CLIState {
  connected: boolean;
  state: StateTypes;
  previousRootCommand: string;
  outputs: Command[];
}
