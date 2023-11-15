import { User } from '../../../redux/slices/user/types';

export type Command = {
  cmd: string;
  cmdType: string;
  status: string;
  responses: string[];
};

export interface CLIProps {
  login: (user: User) => void;
  register: (user: User) => void;
  logout: () => void;
  checkUsernameExists: (username: string) => void;
}

export interface CLIState {
  outputs: any[];
  inputs: any[];
  inputText: string;
  SYSTEM_STATE: string;
}
