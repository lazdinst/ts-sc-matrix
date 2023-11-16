import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState } from '../../../redux/store';
import { loginUser, registerUser, logout } from '../../../redux/slices/user';
import { User } from '../../../redux/slices/user/types';
import { Command, CLIProps, CLIState } from './types';
import { STATES } from '../../../redux/slices/cli';
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

  updateCommandOutputs = (cmd: Command) => {
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
    const { loginUser } = this.props;
    const { user } = this.state;
    const userAttempt: User = {
      id: '',
      username: user,
      password: cmd,
    };

    try {
      const loginStatus = await loginUser(userAttempt);
      if (!loginStatus) {
        throw new Error('Login failed');
      }
    } catch (error) {
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

  handleCommand = async (cmd: string) => {
    const { user } = this.state;
    const { cliState } = this.props;
    if (!cmd) throw new Error('No command provided');

    const commandStrings = cmd.split(' ');
    const rootCommand = commandStrings[0];
    const knownCommands = ['register', 'login', 'logout'];

    if (!knownCommands.includes(rootCommand)) {
      this.updateCommandOutputs({
        cmdType: 'UNKNOWN',
        cmd: cmd,
        status: 'error',
        responses: [`Unknown cmd executed: ${cmd}`],
      });
      throw new Error('Unknown command');
    }

    if (cliState === STATES.INIT) {
      const { cmdType, status, responses } = await parseCommand(
        cmd,
        this.updateUser,
        this.clearCommand
      );
      if (!cmdType || !status || !responses) {
        throw new Error('Invalid command');
      }
      this.updateCommandOutputs({ cmd, cmdType, status, responses });
      this.clearInput();
    }

    if (cliState === STATES.PASSWORD) {
      // check redux action for logging in or regiustering
      console.log('handleCommand: Password', cmd, cmdType);
      console.log('register: Password', cmd);
      this.handleLoginUser(cmd);
    }
    if (cliState === STATES.LOGIN) {
      console.log('register: Password', cmd);
      this.registerNewUser(cmd);
    }
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
            <br />
            <ItemResponse status={item.status}>
              {item.responses.map((response: string) => {
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
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      registerUser: registerUser,
      loginUser: loginUser,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CLI);
