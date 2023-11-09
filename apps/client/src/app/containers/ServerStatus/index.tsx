import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServerStatus, ServerStatusState } from '../../../redux/slices/api/serverStatus';
import { AppDispatch } from '../../../redux/store';
import { useServerConnection } from './useServerConnection';

interface ServerStatusComponentProps {
  debug?: boolean;
}

const ServerStatusComponent: React.FC<ServerStatusComponentProps> = ({ debug }) => {
  const dispatch = useDispatch<AppDispatch>();
  const serverStatus = useSelector((state: { serverStatus: ServerStatusState }) => state.serverStatus);

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
      <button type='button' onClick={() => dispatch(fetchServerStatus())}>Refresh</button>
      {serverStatus.loading && <p>Loading...</p>}
      {serverStatus.error && <p>Error: {serverStatus.error}</p>}
      {serverStatus.connected && <p>Connected</p>}
      {!serverStatus.connected && <p>Disconnected</p>}
    </div>
  );
};

export { useServerConnection };
export default ServerStatusComponent;
