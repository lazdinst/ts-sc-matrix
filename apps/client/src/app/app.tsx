import React from 'react';
import { ThemeProvider } from '../app/styled';
import Router from './router';
import Sidebar from './containers/Sidebar';
import Main from './components/Main';
import Loader from './components/Loader';
import { RootState } from '../redux/store';
import { useSelector } from 'react-redux';
import Auth from './pages/Auth';

import { useServerConnection } from './containers/ServerStatus';

const App: React.FC = () => {
  const { connected, error, loading } = useServerConnection();
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );

  let content = null;

  if (loading) {
    content = <Loader />;
  } else if (error) {
    content = <div>Error: {error}</div>;
  } else if (connected) {
    content = <Router />;
  }

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
