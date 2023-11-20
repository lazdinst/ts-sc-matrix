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
  reinitializeCLIState,
  STATES,
} from '../../../redux/slices/cli';
import { Command } from '../../../redux/slices/cli/types';
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
      reinitializeCLIState();
    };
  }, [inputText, reinitializeCLIState]);

  const _updateCommandOutputs = (cmd: Command) => {
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

  const _handleMaskPassword = (chars: string) => {
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

    const newRootCommand = cmd.split(' ')[0];

    const command: Command = {
      cmd: cmd,
      type: 'UNKNOWN',
      status: 'error',
      messages: [],
    };

    if (
      !knownRootCommands.includes(newRootCommand) &&
      !knownRootCommands.includes(previousRootCommand)
    ) {
      command.messages = [`Unknown cmd executed: ${cmd}`];
      _updateCommandOutputs(command);
      return;
    }

    _handleKnownCommands(command);
  };

  const _handleKnownCommands = async (command: Command) => {
    const rootCommand = command.cmd.split(' ')[0];
    if (!knownRootCommands.includes(previousRootCommand)) {
      dispatch(setPreviousRootCommand(rootCommand));

      if (rootCommand === 'login') {
        _handleLoginCommandAttempt(command);
        return;
      }

      if (rootCommand === 'register') {
        _handleRegisterCommandAttempt(command);
        return;
      }

      if (rootCommand === 'help') {
        _handleHelpCommandAttempt(command);
        return;
      }

      if (rootCommand === 'clear') {
        _clearCommand();
        return;
      }
    }

    if (previousRootCommand === 'login' || previousRootCommand === 'register') {
      command.status = 'info';
      command.messages = [`Authenticating...`];
      _updateCommandOutputs({
        ...command,
        cmd: _handleMaskPassword(rootCommand),
      });

      if (previousRootCommand === 'login') {
        _handleLoginUser(command);
        return;
      }

      if (previousRootCommand === 'register') {
        _handleUserRegistration(command);
      }
    }
  };

  const _clearCommand = () => {
    dispatch(reinitializeCLIState());
  };

  const _handleLoginUser = async (command: Command) => {
    const rootCommand = command.cmd.split(' ')[0];
    const userAttempt: User = {
      id: '',
      username: user,
      password: rootCommand,
    };

    try {
      const loginStatus = await dispatch(loginUser(userAttempt));
      if (!loginStatus) {
        throw new Error('Login failed');
      }
    } catch (error) {
      command.messages = ['Authentication Failure... '];
      _updateCommandOutputs(command);
    }

    _clearInputElement();
    dispatch(reinitializeCLIState());
  };

  const _handleUserRegistration = async (command: Command) => {
    const rootCommand = command.cmd.split(' ')[0];
    const userAttempt: User = {
      id: '',
      username: user,
      password: rootCommand,
    };

    try {
      const registrationStatus = await dispatch(registerUser(userAttempt));
      if (!registrationStatus) {
        throw new Error('Registration failed');
      }

      command.status = 'success';
      command.messages = [
        `Creating auth client: ${user}`,
        `Password: ********`,
        `User registration successful.`,
      ];
    } catch (error) {
      command.messages = ['User registration failed. Please try again.'];
      console.error('handle registration user failed', error);
    }

    _clearInputElement();
    dispatch(reinitializeCLIState());
  };

  const _handleLoginCommandAttempt = async (command: Command) => {
    const commandStrings = command.cmd.split(' ');
    if (commandStrings.length === 1) {
      command.messages = [
        `invalid input...expected 1 argument, received 0 arguments.`,
        `"login $username"`,
      ];
      _updateCommandOutputs(command);
      return;
    }

    if (commandStrings.length === 2) {
      const username = commandStrings[1];
      const userExists = await isUserRegistered(username);

      if (userExists) {
        _updateUser(username);
        dispatch(setIsLoggingIn(true));
        dispatch(setCLIState(STATES.PASSWORD));
        command.status = 'success';
        command.messages = [`logging in as: ${username}`, `password:`];
      } else {
        dispatch(setCLIState(STATES.INIT));
        command.messages = [
          `user does not exist`,
          `proceed with user registration.`,
        ];
      }

      _updateCommandOutputs(command);
      return;
    }

    if (commandStrings.length > 2) {
      command.messages = [
        `invalid input...expected 1 argument, received ${
          commandStrings.length - 1
        } arguments.`,
        `"login $username"`,
      ];
      _updateCommandOutputs(command);
      return;
    }
  };

  const _handleRegisterCommandAttempt = async (command: Command) => {
    const commandStrings = command.cmd.split(' ');
    if (commandStrings.length === 1 || commandStrings.length > 2) {
      command.messages = [
        `invalid input...expected 1 argument, received ${
          commandStrings.length - 1
        } arguments.`,
        `"login $username"`,
      ];
      _updateCommandOutputs(command);
      return;
    }

    if (commandStrings.length === 2) {
      const username = commandStrings[1];
      const userExists = await isUserRegistered(username);

      if (!userExists) {
        _updateUser(username);
        dispatch(setIsLoggingIn(true));
        dispatch(setCLIState(STATES.PASSWORD));
        command.status = 'success';
        command.messages = [`registering as: ${username}`, `password:`];
      } else {
        dispatch(setCLIState(STATES.INIT));
        command.messages = [`user already exist`, `proceed with registration.`];
      }

      _updateCommandOutputs(command);
      return;
    }
  };

  const _handleHelpCommandAttempt = async (command: Command) => {
    command.status = 'success';
    command.messages = [
      'Available commands:',
      '- login',
      '- register',
      '- help',
      '- clear',
    ];

    _updateCommandOutputs(command);
    dispatch(setPreviousRootCommand(''));
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
    _clearInputElement();
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
