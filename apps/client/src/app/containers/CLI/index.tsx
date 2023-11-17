import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState } from '../../../redux/store';
import {
  loginUser,
  registerUser,
  logout,
  isUserRegistered,
  setIsLoggingIn,
  setIsRegistering,
} from '../../../redux/slices/user';
import { User } from '../../../redux/slices/user/types';
import { Command, CLIProps, CLIState, CommandResponse } from './types';
import {
  STATES,
  setCLIState,
  setPreviousRootCommand,
} from '../../../redux/slices/cli';
import { parseCommand } from './commandParser';
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
    this.setState((prevState) => ({
      outputs: [...prevState.outputs, cmd],
    }));
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

  clearInput = () => {
    this.setState({ inputText: '' });
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
    const {
      cliState,
      previousRootCommand,
      setPreviousRootCommand,
      setCLIState,
    } = this.props;
    if (!cmd) throw new Error('No command provided');
    this.clearInput();

    const commandStrings = cmd.split(' ');
    const newRootCommand = commandStrings[0];
    const knownRootCommands = ['register', 'login', 'logout', 'clear'];
    const commandResponse: CommandResponse = {
      cmdType: '',
      cmd: cmd,
      status: 'error',
      messages: [],
    };
    console.log(newRootCommand, previousRootCommand);
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
      throw new Error('Unknown command');
    }

    // If there is no previous command then we are starting a new command chain
    if (!knownRootCommands.includes(previousRootCommand)) {
      // Login Chain
      if (newRootCommand === 'login') {
        // Is the chain provided
        if (commandStrings.length === 1) {
          commandResponse.messages = [
            `invalid input...expected 1 argument, received 0 arguments.`,
            `"login $username"`,
          ];
          this.updateCommandOutputs(commandResponse);
          return;
        }

        // Is the username provided
        if (commandStrings.length === 2) {
          // Is the username valid
          const username = commandStrings[1];
          const userExists = await isUserRegistered(username);

          if (userExists) {
            setIsLoggingIn(true);
            this.updateUser(username);
            setCLIState(STATES.PASSWORD);
            setPreviousRootCommand(newRootCommand);
            commandResponse.status = 'success';
            commandResponse.messages = [
              `logging in as: ${username}`,
              `password:`,
            ];
          } else {
            setCLIState(STATES.INIT);

            commandResponse.messages = [
              `user does not exist`,
              `proceed with user registration.`,
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
      }
    }

    if (previousRootCommand === 'login') {
      commandResponse.cmd = this.handleMaskPassword(cmd);
      commandResponse.status = 'info';
      commandResponse.messages = [`Authenticating...`];
      this.updateCommandOutputs(commandResponse);
      this.handleLoginUser(newRootCommand);
    }

    // If there is a previous command then we are continuing a command chain

    // if (cliState === STATES.INIT) {
    //   const { cmdType, status, messages } = await parseCommand(
    //     cmd,
    //     this.updateUser,
    //     this.clearCommand
    //   );
    //   if (!cmdType || !status || !messages) {
    //     throw new Error('Invalid command');
    //   }
    //   this.updateCommandOutputs({ cmd, cmdType, status, messages });
    //   this.clearInput();
    // }

    // if (cliState === STATES.PASSWORD) {
    //   console.log('handleCommand: Password', cmd, cmdType);
    //   console.log('register: Password', cmd);
    //   this.handleLoginUser(cmd);
    // }
    // if (cliState === STATES.LOGIN) {
    //   console.log('register: Password', cmd);
    //   this.registerNewUser(cmd);
    // }
  };

  handleRegistration = (cmd: string) => {
    //do nothing
  };

  clearCommand = () => {
    this.setState((prevState) => ({
      outputs: [],
    }));
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
    const { cliState } = this.props;
    this.setInputFocus();
    if (this.AuthTimeOut) {
      clearTimeout(this.AuthTimeOut);
    }
    console.log(cliState);
  }

  render() {
    const { inputText, outputs } = this.state;
    const { cliState } = this.props;
    return (
      <CLIContainer id="CLI-Container" onClick={this.setInputFocus}>
        <div>{cliState}</div>
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
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      registerUser,
      loginUser,
      setCLIState,
      setPreviousRootCommand,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CLI);
