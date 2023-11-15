import React from 'react';
import bcrypt from 'bcryptjs';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState } from '../../../redux/store';
import { login, register, logout } from '../../../redux/slices/user';
import { checkUsernameExists } from '../../../redux/slices/user/user';
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
    const { checkUsernameExists } = this.props;
    const { SYSTEM_STATE } = this.state;
    if (!cmd) throw new Error('No command provided');

    if (SYSTEM_STATE === STATES.INIT) {
      const { cmdType, status, responses } = await parseCommand(
        cmd,
        checkUsernameExists,
        this.updateSystemState,
        this.clearCommand
      );

      if (!cmdType || !status || !responses) {
        throw new Error('Invalid command');
      }

      this.updateCommandOutputs({ cmd, cmdType, status, responses });
      this.clearInput();
    }

    if (SYSTEM_STATE === STATES.PASSWORD) {
      const hashedPassword = bcrypt.hashSync(cmd, 10);
    }

    switch (SYSTEM_STATE) {
      case STATES.INIT:
        //do nothing
        break;
      case STATES.LOGIN:
        //do nothing
        break;
      case STATES.PASSWORD:
        //do nothing
        break;
      case STATES.AUTHENTICATING:
        //do nothing
        break;
      case STATES.REGISTER:
        //do nothing
        break;
      default:
        throw new Error('Invalid system state');
    }

    // if (SYSTEM_STATE === STATES.INIT) {
    //   if (cmdType !== 'CLEAR') {
    //     this.setState((prevState) => ({
    //       outputs: [...prevState.outputs, { cmd, cmdType, status, responses }],
    //     }));
    //   }

    //   this.setState({
    //     inputText: '',
    //   });
    // }

    // if (SYSTEM_STATE === STATES.LOGIN) {
    //   // here
    // }

    // if (SYSTEM_STATE === STATES.PASSWORD) {
    //   // here
    //   console.log(cmd);

    //   const output = {
    //     cmdType: 'PASSWORD',
    //     cmd: 'password',
    //     status: 'error',
    //     responses: [`Authenticating...`],
    //   };

    //   this.setState((prevState) => ({
    //     inputText: '',
    //     SYSTEM_STATE: STATES.AUTHENTICATING,
    //     outputs: [...prevState.outputs, output],
    //   }));

    //   this.setState((prevState) => ({
    //     SYSTEM_STATE: STATES.INIT,
    //     outputs: [
    //       ...prevState.outputs,
    //       {
    //         cmdType: 'PASSWORD',
    //         cmd: 'password',
    //         status: 'error',
    //         responses: [`Authentication Failed`],
    //       },
    //     ],
    //   }));
    // }
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
      checkUsernameExists: checkUsernameExists,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CLI);
