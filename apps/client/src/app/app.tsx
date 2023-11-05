import React from 'react';
import { ThemeProvider } from '../app/styled';
import styled from 'styled-components';
import Sidebar from './containers/Sidebar';
import Router from './router';

const MainContent = styled.main`
  display: flex;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

const App: React.FC = () => {

  return (
    <ThemeProvider>
      <Sidebar />
      <MainContent>
        <Router />
      </MainContent>
    </ThemeProvider>
  );
};

export default App;