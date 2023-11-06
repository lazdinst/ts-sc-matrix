import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServerStatus, ServerStatusState } from '../../../redux/slices/api/serverStatus';
import { AppDispatch } from '../../../redux/store';

const ServerStatusComponent = () => {
  const dispatch = useDispatch<AppDispatch>();
  const serverStatus = useSelector((state: { serverStatus: ServerStatusState }) => state.serverStatus);

  useEffect(() => {
    dispatch(fetchServerStatus());
  }, [dispatch]);

  return (
    <div>
      <h2>Server Status</h2>
      {serverStatus.loading && <p>Loading...</p>}
      {serverStatus.error && <p>Error: {serverStatus.error}</p>}
      {serverStatus.connected && <p>Connected</p>}
      {!serverStatus.connected && <p>Disconnected</p>}
    </div>
  );
};

export default ServerStatusComponent;
