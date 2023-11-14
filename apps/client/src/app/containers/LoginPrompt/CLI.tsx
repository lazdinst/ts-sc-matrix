import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import styled, { keyframes } from 'styled-components';
import { login } from '../../../redux/slices/user';
import { User } from '../../../redux/slices/user/types';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const TerminalContainer = styled.div`
  font-size: 1rem;
  font-family: courier;
  padding: 0.25rem;
  /* background-color: #666; */
  overflow-y: auto;
  opacity: 0; /* Start with opacity 0 */
  animation: ${fadeIn} 0.5s ease-in-out forwards; /* Apply the animation */
`;

const OutputItem = styled.div`
  color: rgb(255, 255, 255, 0.5);
  opacity: 0.5;
`;

const Prompt = styled.span`
  color: rgb(0, 255, 136, 1);
`;

const InputForm = styled.form`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
`;

const InputPrompt = styled.span`
  color: rgb(0, 255, 136, 1);
  margin-left: 2px;
  margin-right: 2px;
`;

const InputField = styled.input`
  flex: 1;
  font-size: 1rem;
  border: 0;
  padding: 0;
  background-color: transparent;
  color: rgb(0, 255, 136, 0.5);
  outline: none;
  font-family: courier;
  caret-color: rgb(0, 255, 136, 0.5);
  height: 100%;
`;

interface ItemResponseProps {
  status?: string;
}

const ItemResponse = styled.span<ItemResponseProps>`
  color: ${(props) =>
    props.status ? props.theme.colors.statusColors[props.status] : 'white'};
`;
type Command = {
  cmd: string;
  type: string;
  status: string;
  responses: string[];
};

const STATES = {
  INIT: 'INIT',
  LOGIN: 'LOGIN',
  PASSWORD: 'PASSWORD',
  FAILED: 'FAILED',
  SUCCESS: 'SUCCESS',
  AUTHENTICATING: 'AUTHENTICATING',
};

class CLI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      outputs: [],
      inputs: [],
      inputText: '',
      isPasswordMode: false,
      SYSTEM_STATE: STATES.INIT,
    };
    this.inputRef = React.createRef();
  }

  handleInputChange = (e) => {
    this.setState((prevState) => ({
      inputText: e.target.value,
    }));
  };

  handleInputSubmit = (e: Event) => {
    const { inputText } = this.state;
    e.preventDefault();
    const cmd = inputText.trim();
    if (!cmd) throw new Error('No command provided');
    this.handleCommand(cmd);
  };

  handleCommand = (cmd: string) => {
    const { SYSTEM_STATE } = this.state;
    if (!cmd) throw new Error('No command provided');

    if (SYSTEM_STATE === STATES.INIT) {
      const { cmdType, status, responses } = this.parseCommand(cmd);
      if (!cmdType || !status || !responses) {
        throw new Error('Invalid command');
      }

      if (cmdType !== 'CLEAR') {
        this.setState((prevState) => ({
          outputs: [...prevState.outputs, { cmd, cmdType, status, responses }],
        }));
      }

      this.setState({
        inputText: '',
      });
    }

    if (SYSTEM_STATE === STATES.LOGIN) {
      // here
    }

    if (SYSTEM_STATE === STATES.PASSWORD) {
      // here
      console.log(cmd);

      const output = {
        cmdType: 'PASSWORD',
        cmd: 'password',
        status: 'error',
        responses: [`Authenticating...`],
      };

      this.setState((prevState) => ({
        inputText: '',
        SYSTEM_STATE: STATES.AUTHENTICATING,
        outputs: [...prevState.outputs, output],
      }));

      this.AuthTimeOut = setTimeout(() => {
        this.setState((prevState) => ({
          SYSTEM_STATE: STATES.INIT,
          outputs: [
            ...prevState.outputs,
            {
              cmdType: 'PASSWORD',
              cmd: 'password',
              status: 'error',
              responses: [`Authentication Failed`],
            },
          ],
        }));
      }, 1000);
    }
  };

  parseCommand = (cmd: string) => {
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
        // Determine if username was attached
        if (cmdParts.length === 2) {
          const username = cmdParts[1];
          this.setState({
            SYSTEM_STATE: STATES.PASSWORD,
          });
          return {
            cmdType: 'LOGIN',
            cmd: cmd,
            status: 'success',
            responses: [`Username: ${username}`, `Enter Password:`],
          };
        } else {
          // prompt for a username
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
      case 'clear':
        this.clearCommand();
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

  clearCommand = () => {
    this.setState((prevState) => ({
      outputs: [],
    }));
  };

  executeCommand = (cmd: string) => {
    return `cmd executed: ${cmd}`;
  };

  componentDidMount(): void {
    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
    if (this.AuthTimeOut) {
      clearTimeout(this.AuthTimeOut);
    }
  }

  render() {
    const { inputText, outputs, SYSTEM_STATE } = this.state;
    return (
      <TerminalContainer>
        {outputs.map((item, index) => (
          <OutputItem key={index}>
            {item.cmd}
            <br />
            <ItemResponse status={item.status}>
              {item.responses.map((response, index) => {
                return <div key={response}>{response}</div>;
              })}
            </ItemResponse>
          </OutputItem>
        ))}
        <InputForm onSubmit={this.handleInputSubmit}>
          {/* <InputPrompt>$</InputPrompt> */}
          <InputField
            type={SYSTEM_STATE === STATES.PASSWORD ? 'password' : 'text'}
            ref={this.inputRef}
            value={inputText}
            onChange={this.handleInputChange}
            placeholder=""
          />
        </InputForm>
      </TerminalContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  someData: state.someData,
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      login: login,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(CLI);
