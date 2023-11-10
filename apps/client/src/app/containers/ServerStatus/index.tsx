import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchServerStatus,
  ServerStatusState,
} from '../../../redux/slices/api/server';
import { AppDispatch } from '../../../redux/store';
import { useServerConnection } from './useServerConnection';

interface ServerStatusComponentProps {
  debug?: boolean;
}

const ServerStatusComponent: React.FC<ServerStatusComponentProps> = ({
  debug,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const server = useSelector(
    (state: { server: ServerStatusState }) => state.server
  );

  // useEffect(() => {
  //   if (debug) {
  //     dispatch(fetchServerStatus());
  //   }
  // }, [dispatch, debug]); // Add dispatch and debug to the dependency array

  if (!debug) {
    return null;
  }

  return (
    <div>
      <h2>Server Status</h2>
      <button type="button" onClick={() => dispatch(fetchServerStatus())}>
        Refresh
      </button>
      {server.loading && <p>Loading...</p>}
      {server.error && <p>Error: {server.error}</p>}
      {server.connected && <p>Connected</p>}
      {!server.connected && <p>Disconnected</p>}
    </div>
  );
};

export { useServerConnection };
export default ServerStatusComponent;
1;
