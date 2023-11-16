import { STATES } from '../../../redux/slices/cli';
import {
  isUserRegistered,
  setIsLoggingIn,
  setIsRegistering,
} from '../../../redux/slices/user/user';

import { setCLIState } from '../../../redux/slices/cli/cli';

import { Response } from './types';

export const parseCommand = async (
  cmd: string,
  updateUser: (user: string) => void,
  clearCommand: () => void
) => {
  const cmdParts = cmd.split(' ');
  const commandStart = cmdParts[0];

  if (commandStart === 'register') {
    const response: Response = {
      cmdType: 'REGISTER',
      cmd: cmd,
      status: 'error',
      responses: [],
    };
    const username = cmdParts[1];
    const userExists = await isUserRegistered(username);
    if (userExists) {
      setCLIState(STATES.INIT);
      response.responses = [`user already exists`, `login instead.`];
      response.status = 'error';
      return response;
    }
    // set redux action for registering user

    updateUser(username);
    setCLIState(STATES.PASSWORD);
    response.responses = [`Registering new user: ${username}`, `password:`];
    response.status = 'info';
    return response;
  }

  if (commandStart === 'login') {
    const response: Response = {
      cmdType: 'LOGIN',
      cmd: cmd,
      status: 'error',
      responses: [],
    };

    if (cmdParts.length === 2) {
      const username = cmdParts[1];
      const userExists = await isUserRegistered(username);
      if (!userExists) {
        setCLIState(STATES.INIT);
        response.responses = [`user does not exist`, `register instead.`];
        return response;
      }

      // Get redux axtion got logging in
      setIsLoggingIn(true);
      updateUser(username);
      setCLIState(STATES.PASSWORD);
      response.responses = [`logging in as: ${username}`, `password:`];
      response.status = 'success';
      return response;
    } else {
      const numberOfArguments = cmdParts.length;
      setIsLoggingIn(false);
      setCLIState(STATES.INIT);
      response.responses = [
        `invalid input...expected 1 argument, received ${numberOfArguments} arguments.`,
      ];
      response.status = 'warning';
      return response;
    }
  }

  if (commandStart === 'help') {
    return {
      cmdType: 'HELP',
      cmd: cmd,
      status: 'info',
      responses: [`register <username>`, `login <username>`],
    };
  }

  if (commandStart === 'clear') {
    clearCommand();
    return {
      cmdType: 'CLEAR',
      cmd: cmd,
      status: 'error',
      responses: [`Unknown cmd executed: ${cmd}`],
    };
  }

  setCLIState(STATES.INIT);
  return {
    cmdType: 'UNKNOWN',
    cmd: cmd,
    status: 'error',
    responses: [`Unknown cmd executed: ${cmd}`],
  };
};
