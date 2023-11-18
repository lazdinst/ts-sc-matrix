import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState } from '../../../redux/store';
import {
  loginUser,
  registerUser,
  isUserRegistered,
  setIsLoggingIn,
  validateToken,
} from '../../../redux/slices/user';
import { User } from '../../../redux/slices/user/types';
import { CLIProps, CLIState, CommandResponse } from './types';
import {
  STATES,
  setCLIState,
  setPreviousRootCommand,
  updateOutputs,
  clearOutputs,
  reinitialize,
} from '../../../redux/slices/cli';
import { knownRootCommands } from './constants';
import {
  CLIContainer,
  OutputItem,
  InputForm,
  InputField,
  ItemResponse,
} from './styles';

class CLI extends React.Component<CLIProps, CLIState> {
  private AuthTimeOut: NodeJS.Timeout | null;
  private inputRef: React.RefObject<HTMLInputElement>;
  constructor(props: CLIProps) {
    super(props);
    this.state = {
      outputs: [],
      inputs: [],
      inputText: '',
      user: '',
    };
    this.AuthTimeOut = null;
    this.inputRef = React.createRef();
  }

  updateCommandOutputs = (cmd: CommandResponse) => {
    const { updateOutputs } = this.props;
    updateOutputs(cmd);
  };

  updateUser = (user: string) => {
    this.setState({ user });
  };

  registerNewUser = async (cmd: string) => {
    const { registerUser } = this.props;
    const { user } = this.state;
    const newUser: User = {
      id: '',
      username: user,
      password: cmd,
    };
    const registrationStatus = await registerUser(newUser);

    console.log('registrationStatus', registrationStatus);
    this.clearInput();
  };

  handleLoginUser = async (cmd: string) => {
    const { loginUser, setPreviousRootCommand, setCLIState } = this.props;
    const { user } = this.state;

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
      this.updateCommandOutputs(commandResponse);
      setCLIState(STATES.INIT);
      setPreviousRootCommand('');
      console.log('handle login use failed', error);
    }
    this.clearInput();
  };

  handleUserRegistration = async (cmd: string) => {
    const { registerUser, setPreviousRootCommand, setCLIState } = this.props;
    const { user } = this.state;

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
      const registrationStatus = await registerUser(userAttempt);
      if (!registrationStatus) {
        throw new Error('Login failed');
      }
    } catch (error) {
      commandResponse.messages = ['Authentication Failure... '];
      this.updateCommandOutputs(commandResponse);
      setCLIState(STATES.INIT);
      setPreviousRootCommand('');
      console.log('handle registration use failed', error);
    }
    this.clearInput();
  };

  clearInput = () => {
    this.setState({ inputText: '' });
    this.setInputFocus();
  };

  handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!(e.target instanceof HTMLInputElement)) {
      return;
    }
    this.setState({ inputText: e.target.value });
  };

  handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { inputText } = this.state;
    const { cliState } = this.props;
    let cmd = inputText.trim();
    if (cliState === STATES.PASSWORD) {
      if (!this.inputRef.current?.value) {
        throw new Error('No command provided from inputRef');
      }
      cmd = this.inputRef.current.value.trim();
    }
    if (!cmd) throw new Error('No command provided');
    this.handleCommand(cmd);
  };

  handleMaskPassword = (chars: string) => {
    return chars
      .split('')
      .map((char) => '*')
      .join('');
  };

  handleCommand = async (cmd: string) => {
    const { previousRootCommand } = this.props;
    if (!cmd) throw new Error('No command provided');
    this.clearInput();

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
      this.updateCommandOutputs({
        cmdType: 'UNKNOWN',
        cmd: cmd,
        status: 'error',
        messages: [`Unknown cmd executed: ${cmd}`],
      });
      this.clearInput();
      return;
    }

    this.handleKnownCommands(newRootCommand, commandStrings, commandResponse);
  };

  handleKnownCommands = async (
    newRootCommand: string,
    commandStrings: string[],
    commandResponse: CommandResponse
  ) => {
    const { previousRootCommand } = this.props;
    if (!knownRootCommands.includes(previousRootCommand)) {
      if (newRootCommand === 'login') {
        this.handleLoginCommandAttempt(
          newRootCommand,
          commandStrings,
          commandResponse
        );
        return;
      }

      if (newRootCommand === 'register') {
        this.handleRegisterCommandAttempt(
          newRootCommand,
          commandStrings,
          commandResponse
        );
        return;
      }
      if (newRootCommand === 'help') {
        this.handleHelpCommandAttempt(
          newRootCommand,
          commandStrings,
          commandResponse
        );
        return;
      }

      if (newRootCommand === 'clear') {
        this.clearCommand();
        return;
      }
    }

    if (previousRootCommand === 'login' || previousRootCommand === 'register') {
      commandResponse.cmd = this.handleMaskPassword(newRootCommand);
      commandResponse.status = 'info';
      commandResponse.messages = [`Authenticating...`];
      this.updateCommandOutputs(commandResponse);

      if (previousRootCommand === 'login') {
        this.handleLoginUser(newRootCommand);
        return;
      }
      this.handleUserRegistration(newRootCommand);
    }
  };

  handleLoginCommandAttempt = async (
    newRootCommand: string,
    commandStrings: string[],
    commandResponse: CommandResponse
  ) => {
    const { setPreviousRootCommand, setCLIState } = this.props;
    if (commandStrings.length === 1) {
      commandResponse.messages = [
        `invalid input...expected 1 argument, received 0 arguments.`,
        `"login $username"`,
      ];
      this.updateCommandOutputs(commandResponse);
      return;
    }

    if (commandStrings.length === 2) {
      const username = commandStrings[1];
      const userExists = await isUserRegistered(username);

      if (userExists) {
        setIsLoggingIn(true);
        this.updateUser(username);
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

      this.updateCommandOutputs(commandResponse);
      return;
    }

    if (commandStrings.length > 2) {
      commandResponse.messages = [
        `invalid input...expected 1 argument, received ${
          commandStrings.length - 1
        } arguments.`,
        `"login $username"`,
      ];
      this.updateCommandOutputs(commandResponse);
      return;
    }
  };

  handleRegisterCommandAttempt = async (
    newRootCommand: string,
    commandStrings: string[],
    commandResponse: CommandResponse
  ) => {
    const { setPreviousRootCommand, setCLIState } = this.props;
    if (commandStrings.length === 1) {
      commandResponse.messages = [
        `invalid input...expected 1 argument, received 0 arguments.`,
        `"login $username"`,
      ];
      this.updateCommandOutputs(commandResponse);
      return;
    }

    if (commandStrings.length === 2) {
      const username = commandStrings[1];
      const userExists = await isUserRegistered(username);

      if (!userExists) {
        setIsLoggingIn(true);
        this.updateUser(username);
        setCLIState(STATES.PASSWORD);
        setPreviousRootCommand(newRootCommand);
        commandResponse.status = 'success';
        commandResponse.messages = [
          `Creating auth client: ${username}`,
          `password:`,
        ];
      } else {
        setCLIState(STATES.INIT);
        commandResponse.messages = [
          `user with this login already exists`,
          `proceed with login or choose a different username`,
        ];
      }

      this.updateCommandOutputs(commandResponse);
    }

    if (commandStrings.length > 2) {
      commandResponse.messages = [
        `invalid input...expected 1 argument, received ${
          commandStrings.length - 1
        } arguments.`,
        `"login $username"`,
      ];
      this.updateCommandOutputs(commandResponse);
      return;
    }
  };

  handleHelpCommandAttempt = async (
    newRootCommand: string,
    commandStrings: string[],
    commandResponse: CommandResponse
  ) => {
    commandResponse.messages = ['help command not implemented yet.'];
    this.updateCommandOutputs(commandResponse);
  };

  clearCommand = () => {
    const { clearOutputs } = this.props;
    clearOutputs();
  };

  setInputFocus = () => {
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  };

  scrollToBottom = () => {
    const textInput = this.inputRef.current;
    if (textInput) {
      textInput.scrollTop = textInput.scrollHeight;
    }
  };

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentDidMount(): void {
    this.setInputFocus();
    if (this.AuthTimeOut) {
      clearTimeout(this.AuthTimeOut);
    }
  }

  componentWillUnmount(): void {
    const { reinitialize } = this.props;
    reinitialize(STATES.INIT);
  }

  render() {
    const { inputText } = this.state;
    const { cliState, outputs } = this.props;
    return (
      <CLIContainer id="CLI-Container" onClick={this.setInputFocus}>
        {outputs.map((item, index) => (
          <OutputItem key={index}>
            {item.cmd}
            <ItemResponse status={item.status}>
              {item.messages.map((response: string) => {
                return <div key={response}>{response}</div>;
              })}
            </ItemResponse>
          </OutputItem>
        ))}
        <InputForm onSubmit={this.handleInputSubmit}>
          <InputField
            type={cliState === STATES.PASSWORD ? 'password' : 'text'}
            ref={this.inputRef}
            value={inputText}
            onChange={this.handleInputChange}
            placeholder=""
          />
        </InputForm>
      </CLIContainer>
    );
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.user.user,
  isAuthenticated: state.user.isAuthenticated,
  cliState: state.cli.state,
  previousRootCommand: state.cli.previousRootCommand,
  outputs: state.cli.outputs,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      registerUser,
      loginUser,
      setCLIState,
      setPreviousRootCommand,
      updateOutputs,
      validateToken,
      clearOutputs,
      reinitialize,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CLI);
