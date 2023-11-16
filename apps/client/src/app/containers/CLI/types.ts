import { User } from '../../../redux/slices/user/types';

export type Command = {
  cmd: string;
  cmdType: string;
  status: string;
  responses: string[];
};

export interface CLIProps {
  login: (user: User) => void;
  registerUser: (user: User) => boolean;
  loginUser: (user: User) => boolean;
  logout: () => void;
  checkUsernameExists: (username: string) => void;
  cliState: string;
}

export interface CLIState {
  outputs: any[];
  inputs: any[];
  inputText: string;
  user: string;
}

export interface Response {
  cmdType: string;
  cmd: string;
  status: string;
  responses: string[];
}
