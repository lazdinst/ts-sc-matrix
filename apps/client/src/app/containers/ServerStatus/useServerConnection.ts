import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../../redux/store';
import {
  fetchServerStatus,
  ServerStatusState,
} from '../../../redux/slices/api/server';

export const useServerConnection = () => {
  const dispatch: AppDispatch = useDispatch();
  const server = useSelector(
    (state: { server: ServerStatusState }) => state.server
  );

  useEffect(() => {
    dispatch(fetchServerStatus());
  }, [dispatch]);

  return {
    connected: server.connected,
    error: server.error,
    loading: server.loading,
  };
};
