import React from 'react';
import bcrypt from 'bcryptjs';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState } from '../../../redux/store';
import { login, register, logout } from '../../../redux/slices/user';
import { User } from '../../../redux/slices/user/types';
import { Command, CLIProps, CLIState } from './types';
import { STATES } from './constants';
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
      SYSTEM_STATE: STATES.INIT,
    };
    this.AuthTimeOut = null;
    this.inputRef = React.createRef();
  }

  updateCommandOutputs = (cmd: Command) => {
    this.setState((prevState) => ({
      outputs: [...prevState.outputs, cmd],
    }));
  };

  updateSystemState = (SYSTEM_STATE: string) => {
    this.setState({ SYSTEM_STATE });
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
    const { inputText, SYSTEM_STATE } = this.state;
    console.log('handleInputSubmit', SYSTEM_STATE);
    let cmd = inputText.trim();
    if (SYSTEM_STATE === STATES.PASSWORD) {
      if (!this.inputRef.current?.value) {
        throw new Error('No command provided from inputRef');
      }
      cmd = this.inputRef.current.value.trim();
    }
    if (!cmd) throw new Error('No command provided');
    this.handleCommand(cmd);
  };

  handleCommand = async (cmd: string) => {
    const { SYSTEM_STATE } = this.state;
    if (!cmd) throw new Error('No command provided');

    const { cmdType, status, responses } = await parseCommand(
      cmd,
      this.updateSystemState,
      this.clearCommand
    );

    if (!cmdType || !status || !responses) {
      throw new Error('Invalid command');
    }

    if (SYSTEM_STATE === STATES.INIT) {
      this.updateCommandOutputs({ cmd, cmdType, status, responses });
      this.clearInput();
    }

    if (SYSTEM_STATE === STATES.PASSWORD) {
      const hashedPassword = bcrypt.hashSync(cmd, 10);
    }

    if (SYSTEM_STATE === STATES.REGISTER) {
      const hashedPassword = bcrypt.hashSync(cmd, 10);
      const user: User = {
        username: 'test',
        password: hashedPassword,
      };
    }
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
    this.setInputFocus();
    if (this.AuthTimeOut) {
      clearTimeout(this.AuthTimeOut);
    }
  }

  render() {
    const { inputText, outputs, SYSTEM_STATE } = this.state;
    return (
      <CLIContainer onClick={this.setInputFocus}>
        <div>{SYSTEM_STATE}</div>
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
            type={SYSTEM_STATE === STATES.PASSWORD ? 'password' : 'text'}
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
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      login: login,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CLI);
