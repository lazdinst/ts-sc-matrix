import { User } from '../../../redux/slices/user/types';

import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  registerUser,
  loginUser,
  validateToken,
  isUserRegistered,
  setIsLoggingIn,
} from '../../../redux/slices/user';
import {
  setCLIState,
  setPreviousRootCommand,
  updateOutputs,
  clearOutputs,
  reinitialize,
  STATES,
} from '../../../redux/slices/cli';
import { CommandResponse } from '../../../redux/slices/cli/types';
import { knownRootCommands } from './constants';
import {
  CLIContainer,
  OutputItem,
  InputForm,
  InputField,
  ItemResponse,
} from './styles';
import { RootState, useAppDispatch } from '../../../redux/store';

const CLI: React.FC = () => {
  const [inputText, _setInputText] = useState('');
  const [user, _setUser] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();

  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  const cliState = useSelector((state: RootState) => state.cli.state);
  const previousRootCommand = useSelector(
    (state: RootState) => state.cli.previousRootCommand
  );
  const outputs = useSelector((state: RootState) => state.cli.outputs);

  useEffect(() => {
    _setInputFocus();
    if (inputRef.current) {
      inputRef.current.value = inputText;
    }
    return () => {
      reinitialize();
    };
  }, [inputText, reinitialize]);

  const _updateCommandOutputs = (cmd: CommandResponse) => {
    dispatch(updateOutputs(cmd));
  };

  const _updateUser = (newUser: string) => {
    _setUser(newUser);
  };

  const _clearInputElement = () => {
    _setInputText('');
    _setInputFocus();
  };

  const _handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    _setInputText(e.target.value);
  };

  const _handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const cmd = inputText.trim();
    if (cmd) {
      _handleCommand(cmd);
    }
  };

  const handleMaskPassword = (chars: string) => {
    return chars
      .split('')
      .map(() => '*')
      .join('');
  };

  const _handleCommand = async (cmd: string) => {
    if (!cmd) {
      throw new Error('No command provided');
    }
    _clearInputElement();

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
      _updateCommandOutputs({
        cmdType: 'UNKNOWN',
        cmd: cmd,
        status: 'error',
        messages: [`Unknown cmd executed: ${cmd}`],
      });
      return;
    }

    _handleKnownCommands(newRootCommand, commandStrings, commandResponse);
  };

  const _handleKnownCommands = async (
    newRootCommand: string,
    commandStrings: string[],
    commandResponse: CommandResponse
  ) => {
    commandResponse.cmd = newRootCommand;
    if (!knownRootCommands.includes(previousRootCommand)) {
      if (newRootCommand === 'login') {
        handleLoginCommandAttempt(commandStrings, commandResponse);
        return;
      }

      if (newRootCommand === 'register') {
        handleRegisterCommandAttempt(commandStrings, commandResponse);
        return;
      }

      if (newRootCommand === 'help') {
        handleHelpCommandAttempt(commandStrings, commandResponse);
        return;
      }

      if (newRootCommand === 'clear') {
        _clearCommand();
        return;
      }
    }

    if (previousRootCommand === 'login' || previousRootCommand === 'register') {
      commandResponse.cmd = handleMaskPassword(newRootCommand);
      commandResponse.status = 'info';
      commandResponse.messages = [`Authenticating...`];
      _updateCommandOutputs(commandResponse);

      if (previousRootCommand === 'login') {
        _handleLoginUser(newRootCommand);
        return;
      }
      handleUserRegistration(newRootCommand);
    }
  };

  const _clearCommand = () => {
    dispatch(clearOutputs());
  };

  const handleLoginCommandAttempt = async (
    commandStrings: string[],
    commandResponse: CommandResponse
  ) => {
    if (commandStrings.length === 1) {
      commandResponse.messages = [
        `invalid input...expected 1 argument, received 0 arguments.`,
        `"login $username"`,
      ];
      _updateCommandOutputs(commandResponse);
      return;
    }

    if (commandStrings.length === 2) {
      const username = commandStrings[1];
      const userExists = await isUserRegistered(username);

      // NEED TO DISPATCH THERE ACTIONS
      if (userExists) {
        dispatch(setIsLoggingIn(true));
        _updateUser(username);
        dispatch(setCLIState(STATES.PASSWORD));
        setPreviousRootCommand(commandResponse.cmd);
        commandResponse.status = 'success';
        commandResponse.messages = [`logging in as: ${username}`, `password:`];
      } else {
        dispatch(setCLIState(STATES.INIT));
        commandResponse.messages = [
          `user does not exist`,
          `proceed with user registration.`,
        ];
      }

      _updateCommandOutputs(commandResponse);
      return;
    }

    if (commandStrings.length > 2) {
      commandResponse.messages = [
        `invalid input...expected 1 argument, received ${
          commandStrings.length - 1
        } arguments.`,
        `"login $username"`,
      ];
      _updateCommandOutputs(commandResponse);
      return;
    }
  };

  const _handleLoginUser = async (cmd: string) => {
    const userAttempt: User = {
      id: '',
      username: user,
      password: cmd,
    };

    const commandResponse: CommandResponse = {
      cmdType: '',
      cmd: '',
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
      _updateCommandOutputs(commandResponse);
      dispatch(setCLIState(STATES.INIT));
      setPreviousRootCommand('');
      console.log('handle login user failed', error);
    }
    _clearInputElement();
  };

  const handleUserRegistration = async (newRootCommand: string) => {
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
    _updateCommandOutputs(commandResponse);
    _clearInputElement();
  };

  const handleRegisterCommandAttempt = async (
    commandStrings: string[],
    commandResponse: CommandResponse
  ) => {
    commandResponse.cmdType = 'HELP';
    commandResponse.status = 'success';
    commandResponse.messages = [
      'Available commands:',
      '- login',
      '- register',
      '- help',
      '- clear',
    ];
    const userAttempt: User = {
      id: '',
      username: user,
      password: commandResponse.cmd,
    };

    // working here but need to replace this

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
    _updateCommandOutputs(commandResponse);
    _clearInputElement();
  };

  const handleHelpCommandAttempt = async (
    commandStrings: string[],
    commandResponse: CommandResponse
  ) => {
    commandResponse.cmdType = 'HELP';
    commandResponse.status = 'success';
    commandResponse.messages = [
      'Available commands:',
      '- login',
      '- register',
      '- help',
      '- clear',
    ];

    _updateCommandOutputs(commandResponse);
  };

  const _setInputFocus = () => {
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
    <CLIContainer id="CLI-Container" onClick={_setInputFocus}>
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
      <InputForm onSubmit={_handleInputSubmit}>
        <InputField
          type={cliState === STATES.PASSWORD ? 'password' : 'text'}
          ref={inputRef}
          value={inputText}
          onChange={_handleInputChange}
          placeholder=""
        />
      </InputForm>
    </CLIContainer>
  );
};

export default CLI;
