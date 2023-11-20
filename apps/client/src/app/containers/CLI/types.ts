// import { User } from '../../../redux/slices/user/types';

// // export const STATES = {
// //   INIT: 'INIT',
// //   LOGIN: 'LOGIN',
// //   PASSWORD: 'PASSWORD',
// //   FAILED: 'FAILED',
// //   SUCCESS: 'SUCCESS',
// //   AUTHENTICATING: 'AUTHENTICATING',
// //   REGISTER: 'REGISTER',
// // };

// // // Define a type alias for the union of predefined constants
// // export type StateType = (typeof STATES)[keyof typeof STATES];

// export interface CLIProps {
//   login: (user: User) => void;
//   registerUser: (user: User) => boolean;
//   loginUser: (user: User) => boolean;
//   logout: () => void;
//   checkUsernameExists: (username: string) => void;
//   cliState: string;
//   previousRootCommand: string;
//   setPreviousRootCommand: (command: string) => void;
//   setCLIState: (state: StateType) => void;
//   updateOutputs: (output: CommandResponse) => void;
//   outputs: CommandResponse[];
//   clearOutputs: () => void;
//   reinitialize: () => void;
// }

// // export interface CLIState {
// //   outputs: any[];
// //   inputs: any[];
// //   inputText: string;
// //   user: string;
// // }

// // export interface CommandResponse {
// //   cmdType: string;
// //   cmd: string | null;
// //   status: string;
// //   messages: string[];
// // }
