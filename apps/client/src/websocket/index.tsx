import React, { ReactNode } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { RootState } from '../redux/store';
import { io, Socket } from 'socket.io-client';

import {
  setupSocketListeners,
  setupConnectionListners,
  setupSocketStateListeners,
} from './listeners';

import {
  connectWebSocket,
  disconnectWebSocket,
} from '../redux/slices/websocket';

import { setRolls } from '../redux/slices/roller';
import { User } from '../redux/slices/user/types';

interface WebSocketProviderProps {
  children: ReactNode;
  setupSocketStateListeners: typeof setupSocketStateListeners;
  setupSocketListeners: typeof setupSocketListeners;
  setupConnectionListners: typeof setupConnectionListners;
  setRolls: typeof setRolls;
  connectWebSocket: typeof connectWebSocket;
  disconnectWebSocket: typeof disconnectWebSocket;
  user: User | null;
}

class WebSocketProvider extends React.Component<WebSocketProviderProps> {
  private socket: Socket | null = null;
  constructor(props: WebSocketProviderProps) {
    super(props);
    this.state = {
      socket: null,
    };
  }

  createSocket = () => {
    const { connectWebSocket, disconnectWebSocket, setRolls, user } =
      this.props;
    if (!user) {
      throw new Error('User is not defined in WebSocketProvider');
    }
    this.socket = io('ws://localhost:5000');
    console.log('Creating ws socket...');
    setupSocketStateListeners(
      this.socket,
      user,
      connectWebSocket,
      disconnectWebSocket
    );
    setupConnectionListners(this.socket);
    setupSocketListeners(this.socket, setRolls);
  };

  componentDidMount() {
    this.createSocket();
  }

  componentWillUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  render() {
    return this.props.children;
  }
}

const mapStateToProps = (state: RootState) => ({
  user: state.user.user,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      disconnectWebSocket,
      connectWebSocket,
      setRolls,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(WebSocketProvider);
