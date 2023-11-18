import { User } from '../../../redux/slices/user/types';

export interface CLIProps {
  login: (user: User) => void;
  registerUser: (user: User) => boolean;
  loginUser: (user: User) => boolean;
  logout: () => void;
  checkUsernameExists: (username: string) => void;
  cliState: string;
  previousRootCommand: string;
  setPreviousRootCommand: (command: string) => void;
  setCLIState: (state: string) => void;
  updateOutputs: (output: CommandResponse) => void;
  outputs: CommandResponse[];
}

export interface CLIState {
  outputs: any[];
  inputs: any[];
  inputText: string;
  user: string;
}

export interface CommandResponse {
  cmdType: string;
  cmd: string | null;
  status: string;
  messages: string[];
}
