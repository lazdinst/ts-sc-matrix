import React from 'react';
import { ThemeProvider } from '../app/styled';
import styled from 'styled-components';
import Sidebar from './containers/Sidebar';
import Router from './router';

const MainContent = styled.main`
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

// <div role="navigation">
// <ul>
//   <li>
//     <Link to="/">Home</Link>
//   </li>
//   <li>
//     <Link to="/page-2">Page 2</Link>
//   </li>
// </ul>
// </div>
