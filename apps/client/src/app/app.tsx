import React from 'react';
import { ThemeProvider } from '../app/styled';
import Sidebar from './containers/Sidebar';
import Main from './components/Main';
import Router from './router';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Sidebar />
      <Main>
        <Router />
      </Main>
    </ThemeProvider>
  );
};

export default App;