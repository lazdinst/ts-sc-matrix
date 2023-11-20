import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../redux/store';
import WebSocketProvider from '../websocket';
import { validateToken } from '../redux/slices/user';
import { fetchServerStatus } from '../redux/slices/api';
import Router from './router';
import Sidebar from './containers/Sidebar';
import Main from './components/Main';
import Loader from './components/Loader';
import Auth from './pages/Auth';
import FadeWrapper from './components/FadeWrapper';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const isAuthenticating = useSelector(
    (state: RootState) => state.user.isAuthenticating
  );
  const loading = useSelector((state: RootState) => state.server.loading);
  const connected = useSelector((state: RootState) => state.server.connected);
  const error = useSelector((state: RootState) => state.server.error);

  useEffect(() => {
    dispatch(fetchServerStatus());
    dispatch(validateToken());
  }, []);

  if (!connected) {
    if (loading) {
      return <Loader />;
    }
    if (error) {
      return <div>Error: {error}</div>;
    }
  }

  if (!isAuthenticated) {
    if (isAuthenticating) {
      return <Loader />;
    }
    return <Auth />;
  }

  return (
    <WebSocketProvider>
      <FadeWrapper>
        <Sidebar />
        <Main>
          <Router />
        </Main>
      </FadeWrapper>
    </WebSocketProvider>
  );
};

export default App;
