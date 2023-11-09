import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import { fetchServerStatus, ServerStatusState } from '../../../redux/slices/api/serverStatus';

export const useServerConnection = () => {
  const dispatch: AppDispatch = useDispatch();
  const serverStatus = useSelector((state: { serverStatus: ServerStatusState }) => state.serverStatus);

  useEffect(() => {
    dispatch(fetchServerStatus());
  }, [dispatch]);

  return {
    connected: serverStatus.connected,
    error: serverStatus.error,
    loading: serverStatus.loading,
  };
};
