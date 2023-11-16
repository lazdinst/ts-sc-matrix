import { STATES } from './constants';
import { isUserRegistered } from '../../../redux/slices/user/user';

interface Response {
  cmdType: string;
  cmd: string;
  status: string;
  responses: string[];
}

export const parseCommand = async (
  cmd: string,
  updateSystemState: (state: string) => void,
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
      updateSystemState(STATES.INIT);
      response.responses = [`user already exists`, `login instead.`];
      response.status = 'error';
      return response;
    }

    updateUser(username);
    updateSystemState(STATES.PASSWORD);
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
        updateSystemState(STATES.INIT);
        response.responses = [`user does not exist`, `register instead.`];
        return response;
      }

      updateSystemState(STATES.PASSWORD);
      response.responses = [`logging in as: ${username}`, `password:`];
      response.status = 'success';
      return response;
    } else {
      const numberOfArguments = cmdParts.length;
      updateSystemState(STATES.INIT);
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

  updateSystemState(STATES.INIT);
  return {
    cmdType: 'UNKNOWN',
    cmd: cmd,
    status: 'error',
    responses: [`Unknown cmd executed: ${cmd}`],
  };
};
