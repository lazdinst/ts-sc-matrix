import React, { useEffect } from 'react';
import { ThemeProvider } from '../app/styled';
import Router from './router';
import Sidebar from './containers/Sidebar';
import Main from './components/Main';
import Loader from './components/Loader';
import { RootState } from '../redux/store';
import { useSelector, useDispatch } from 'react-redux';
import Auth from './pages/Auth';
import { validateToken, setAuthenticating } from '../redux/slices/user';

import { useServerConnection } from './containers/ServerStatus';

const App: React.FC = () => {
  const { connected, error, loading } = useServerConnection();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const isAuthenticating = useSelector(
    (state: RootState) => state.user.isAuthenticating
  );

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(validateToken());
  }, []);

  let content = null;

  if (loading) {
    content = <Loader />;
  } else if (error) {
    content = <div>Error: {error}</div>;
  } else if (connected) {
    content = <Router />;
  }

  if (isAuthenticating) return <Loader />;

  return (
    <ThemeProvider>
      {isAuthenticated ? (
        <>
          <Sidebar />
          <Main>{content}</Main>
        </>
      ) : (
        <Auth />
      )}
    </ThemeProvider>
  );
};

export default App;
