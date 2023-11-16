import { dispatch } from '../../../redux/store';
import { STATES } from './constants';
import { isUserRegistered } from '../../../redux/slices/user/user';

export const parseCommand = async (
  cmd: string,
  updateSystemState: any,
  clearCommand: any
) => {
  const cmdParts = cmd.split(' ');
  const commandStart = cmdParts[0];

  if (commandStart === 'register') {
    // Do something
    const username = cmdParts[1];
    const userExists = await isUserRegistered(username);
    return {
      cmdType: 'UNKNOWN',
      cmd: cmd,
      status: 'error',
      responses: [`Unknown cmd executed: ${cmd}`],
    };
  }

  if (commandStart === 'login') {
    if (cmdParts.length === 2) {
      const username = cmdParts[1];
      const userExists = await isUserRegistered(username);
      if (!userExists) {
        updateSystemState(STATES.INIT);
        return {
          cmdType: 'LOGIN',
          cmd: cmd,
          status: 'error',
          responses: [`user does not exist`, `register a new user.`],
        };
      }

      updateSystemState(STATES.PASSWORD);
      return {
        cmdType: 'LOGIN',
        cmd: cmd,
        status: 'success',
        responses: [`logging in as: ${username}`, `password:`],
      };
    } else {
      const numberOfArguments = cmdParts.length;
      updateSystemState(STATES.INIT);
      return {
        cmdType: 'LOGIN',
        cmd: cmd,
        status: 'warning',
        responses: [
          `invalid input...expected 1 argument, received ${numberOfArguments} arguments.`,
        ],
      };
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
    // Do something
    return {
      cmdType: 'UNKNOWN',
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
