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

  switch (commandStart) {
    case 'help':
      return {
        cmdType: 'HELP',
        cmd: cmd,
        status: 'error',
        responses: [`Did you think it would be that easy?`],
      };
    case 'login':
      if (cmdParts.length === 2) {
        updateSystemState(STATES.PASSWORD);
        const username = cmdParts[1];
        console.log('username', username);

        const userExists = await isUserRegistered(username);

        console.log('userExists', userExists);
        if (!userExists) {
          updateSystemState(STATES.PASSWORD);
          return {
            cmdType: 'LOGIN',
            cmd: cmd,
            status: 'error',
            responses: [`User does not exist`],
          };
        }
        return {
          cmdType: 'LOGIN',
          cmd: cmd,
          status: 'success',
          responses: [`Logging in as: ${username}`, `Enter Password:`],
        };
      } else {
        const numberOfArguments = cmdParts.length;
        return {
          cmdType: 'LOGIN',
          cmd: cmd,
          status: 'warning',
          responses: [
            `Invalid input...Expected 1 argument, received ${numberOfArguments} arguments`,
          ],
        };
      }
    case 'register':
      clearCommand();
      return {
        cmdType: 'CLEAR',
        cmd: cmd,
        status: 'error',
        responses: [``],
      };
    case 'clear':
      clearCommand();
      return {
        cmdType: 'CLEAR',
        cmd: cmd,
        status: 'error',
        responses: [``],
      };
    case 'overwhelming':
      return {
        cmdType: 'OVERWHELMING',
        cmd: cmd,
        status: 'success',
        responses: [`Getting there`],
      };
    default:
      return {
        cmdType: 'UNKNOWN',
        cmd: cmd,
        status: 'error',
        responses: [`Unknown cmd executed: ${cmd}`],
      };
  }
};
