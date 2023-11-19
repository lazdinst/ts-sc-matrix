import { User } from '../../../redux/slices/user/types';

import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  registerUser,
  loginUser,
  validateToken,
  isUserRegistered,
} from '../../../redux/slices/user';
import {
  setCLIState,
  setPreviousRootCommand,
  updateOutputs,
  clearOutputs,
  reinitialize,
} from '../../../redux/slices/cli';
import { CLIProps, STATES, CommandResponse } from './types';
import { knownRootCommands } from './constants';
import {
  CLIContainer,
  OutputItem,
  InputForm,
  InputField,
  ItemResponse,
} from './styles';
import { RootState, useAppDispatch } from '../../../redux/store';

const CLI: React.FC<CLIProps> = (props) => {
  const [inputText, setInputText] = useState('');
  const [user, _setUser] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  useEffect(() => {
    setInputFocus();
    if (inputRef.current) {
      inputRef.current.value = inputText;
    }
    // Clean up when unmounting
    return () => {
      reinitialize();
    };
  }, [inputText, reinitialize]);

  const updateCommandOutputs = (cmd: CommandResponse) => {
    setOutputs(cmd);
  };

  const updateUser = (newUser: string) => {
    _setUser(newUser);
  };

  const clearInput = () => {
    setInputText('');
    setInputFocus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cmd = inputText.trim();
    if (cmd) {
      handleCommand(cmd);
    }
  };

  const handleMaskPassword = (chars: string) => {
    return chars
      .split('')
      .map(() => '*')
      .join('');
  };

  const handleCommand = async (cmd: string) => {
    const { previousRootCommand } = props;
    if (!cmd) {
      throw new Error('No command provided');
    }
    clearInput();

    const commandStrings = cmd.split(' ');
    const newRootCommand = commandStrings[0];

    const commandResponse: CommandResponse = {
      cmdType: '',
      cmd: cmd,
      status: 'error',
      messages: [],
    };

    if (
      !knownRootCommands.includes(newRootCommand) &&
      !knownRootCommands.includes(previousRootCommand)
    ) {
      updateCommandOutputs({
        cmdType: 'UNKNOWN',
        cmd: cmd,
        status: 'error',
        messages: [`Unknown cmd executed: ${cmd}`],
      });
      return;
    }

    handleKnownCommands(newRootCommand, commandStrings, commandResponse);
  };

  const handleKnownCommands = async (
    newRootCommand: string,
    commandStrings: string[],
    commandResponse: CommandResponse
  ) => {
    const {
      previousRootCommand,
      loginUser,
      setPreviousRootCommand,
      setCLIState,
    } = props;

    if (!knownRootCommands.includes(previousRootCommand)) {
      if (newRootCommand === 'login') {
        handleLoginCommandAttempt(
          newRootCommand,
          commandStrings,
          commandResponse
        );
        return;
      }

      if (newRootCommand === 'register') {
        handleRegisterCommandAttempt(
          newRootCommand,
          commandStrings,
          commandResponse
        );
        return;
      }

      if (newRootCommand === 'help') {
        handleHelpCommandAttempt(
          newRootCommand,
          commandStrings,
          commandResponse
        );
        return;
      }

      if (newRootCommand === 'clear') {
        clearCommand();
        return;
      }
    }

    if (previousRootCommand === 'login' || previousRootCommand === 'register') {
      commandResponse.cmd = handleMaskPassword(newRootCommand);
      commandResponse.status = 'info';
      commandResponse.messages = [`Authenticating...`];
      updateCommandOutputs(commandResponse);

      if (previousRootCommand === 'login') {
        handleLoginUser(newRootCommand);
        return;
      }
      handleUserRegistration(newRootCommand);
    }
  };

  const clearCommand = () => {
    const { clearOutputs } = props;
    clearOutputs();
  };

  const handleLoginCommandAttempt = async (
    newRootCommand: string,
    commandStrings: string[],
    commandResponse: CommandResponse
  ) => {
    const {
      setPreviousRootCommand,
      setCLIState,
      loginUser,
      isUserRegistered,
      updateUser,
    } = props;

    if (commandStrings.length === 1) {
      commandResponse.messages = [
        `invalid input...expected 1 argument, received 0 arguments.`,
        `"login $username"`,
      ];
      updateCommandOutputs(commandResponse);
      return;
    }

    if (commandStrings.length === 2) {
      const username = commandStrings[1];
      const userExists = await isUserRegistered(username);

      if (userExists) {
        setIsLoggingIn(true);
        updateUser(username);
        setCLIState(STATES.PASSWORD);
        setPreviousRootCommand(newRootCommand);
        commandResponse.status = 'success';
        commandResponse.messages = [`logging in as: ${username}`, `password:`];
      } else {
        setCLIState(STATES.INIT);
        commandResponse.messages = [
          `user does not exist`,
          `proceed with user registration.`,
        ];
      }

      updateCommandOutputs(commandResponse);
      return;
    }

    if (commandStrings.length > 2) {
      commandResponse.messages = [
        `invalid input...expected 1 argument, received ${
          commandStrings.length - 1
        } arguments.`,
        `"login $username"`,
      ];
      updateCommandOutputs(commandResponse);
      return;
    }
  };

  const handleLoginUser = async (cmd: string) => {
    const { loginUser, setPreviousRootCommand, setCLIState, updateUser } =
      props;

    const userAttempt: User = {
      id: '',
      username: user,
      password: cmd,
    };

    const commandResponse: CommandResponse = {
      cmdType: '',
      cmd: null,
      status: 'error',
      messages: [],
    };

    try {
      const loginStatus = await loginUser(userAttempt);
      if (!loginStatus) {
        throw new Error('Login failed');
      }
    } catch (error) {
      commandResponse.messages = ['Authentication Failure... '];
      updateCommandOutputs(commandResponse);
      setCLIState(STATES.INIT);
      setPreviousRootCommand('');
      console.log('handle login user failed', error);
    }
    clearInput();
  };

  const handleUserRegistration = async (newRootCommand: string) => {
    const { setPreviousRootCommand, setCLIState, registerUser } = props;

    const userAttempt: User = {
      id: '',
      username: user,
      password: newRootCommand,
    };

    const commandResponse: CommandResponse = {
      cmdType: '',
      cmd: newRootCommand,
      status: 'error',
      messages: [],
    };

    try {
      const registrationStatus = await registerUser(userAttempt);
      if (!registrationStatus) {
        throw new Error('Registration failed');
      }

      commandResponse.status = 'success';
      commandResponse.messages = [
        `Creating auth client: ${user}`,
        `Password: ********`,
        `User registration successful.`,
      ];
    } catch (error) {
      commandResponse.messages = [
        'User registration failed. Please try again.',
      ];
      console.error('handle registration user failed', error);
    }

    setCLIState(STATES.INIT);
    setPreviousRootCommand('');
    updateCommandOutputs(commandResponse);
    clearInput();
  };

  const handleRegisterCommandAttempt = async (newRootCommand: string) => {
    const userAttempt: User = {
      id: '',
      username: user,
      password: newRootCommand,
    };

    const commandResponse: CommandResponse = {
      cmdType: '',
      cmd: newRootCommand,
      status: 'error',
      messages: [],
    };

    try {
      const userExists = await isUserRegistered(user);
      if (!userExists) {
        const registrationStatus = await registerUser(userAttempt);
        if (!registrationStatus) {
          throw new Error('Registration failed');
        }

        commandResponse.status = 'success';
        commandResponse.messages = [
          `Creating auth client: ${user}`,
          `User registration successful.`,
        ];
      } else {
        commandResponse.messages = ['User with this login already exists.'];
      }
    } catch (error) {
      commandResponse.messages = [
        'User registration failed. Please try again.',
      ];
      console.error('handle registration user failed', error);
    }

    setCLIState('INIT');
    setPreviousRootCommand('');
    updateCommandOutputs(commandResponse);
    clearInput();
  };

  const handleHelpCommandAttempt = (newRootCommand: string) => {
    const commandResponse: CommandResponse = {
      cmdType: '',
      cmd: newRootCommand,
      status: 'info',
      messages: [],
    };

    // Customize this part to provide help messages for specific commands.
    // For example:
    if (newRootCommand === 'login') {
      commandResponse.messages = [
        'Help for the login command:',
        '- Usage: login $username',
      ];
    } else if (newRootCommand === 'register') {
      commandResponse.messages = [
        'Help for the register command:',
        '- Usage: register $username',
      ];
    } else {
      commandResponse.messages = [
        `Help for the ${newRootCommand} command:`,
        '- No help available for this command.',
      ];
    }

    updateCommandOutputs(commandResponse);
  };

  const setInputFocus = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const scrollToBottom = () => {
    if (inputRef.current) {
      inputRef.current.scrollTop = inputRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [outputs]);

  return (
    <CLIContainer id="CLI-Container" onClick={setInputFocus}>
      {outputs.map((item, index) => (
        <OutputItem key={index}>
          {item.cmd}
          <ItemResponse status={item.status}>
            {item.messages.map((response: string) => (
              <div key={response}>{response}</div>
            ))}
          </ItemResponse>
        </OutputItem>
      ))}
      <InputForm onSubmit={handleInputSubmit}>
        <InputField
          type={cliState === STATES.PASSWORD ? 'password' : 'text'}
          ref={inputRef}
          value={inputText}
          onChange={handleInputChange}
          placeholder=""
        />
      </InputForm>
    </CLIContainer>
  );
};

export default CLI;
