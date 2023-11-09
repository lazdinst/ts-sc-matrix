import React from 'react';
import { ThemeProvider } from '../app/styled';
import Router from './router';
import Sidebar from './containers/Sidebar';
import Main from './components/Main';
import Loader from './components/Loader';
import { useServerConnection } from './containers/ServerStatus';

const App: React.FC = () => {
  const { connected, error, loading } = useServerConnection();

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
      <Sidebar />
      <Main>
        { content }
      </Main>
    </ThemeProvider>
  );
};

export default App;