import React from 'react';
import { useSelector } from 'react-redux';
import ThemeManager from '../../containers/ThemeManager';
import ServerStatusComponent from '../../containers/ServerStatus';
import { WebSocketState } from '../../../redux/slices/websocket/websocket';

const Settings = () => {
  const websocketState = useSelector(
    (state: { websocket: WebSocketState }) => state.websocket
  );

  return (
    <div>
      <div>Settings</div>
      <hr />
      <ThemeManager />
      <hr />
      <ServerStatusComponent debug />
      <div>
        <h2>WebSocket State:</h2>
        <p>
          Connection Status:{' '}
          {websocketState?.connected ? 'Connected' : 'Disconnected'}
        </p>
      </div>
    </div>
  );
};

export default Settings;
