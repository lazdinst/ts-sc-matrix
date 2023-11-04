import styled from 'styled-components';

import { Route, Routes, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ThemeProvider } from '../app/styled';

import ServerStatusComponent from './containers/ServerStatus';
import ThemeManager from './containers/ThemeManager';

const StyledApp = styled.div`
  background-color: #000;
`;

export function App() {
  return (
    <ThemeProvider>
    <StyledApp>
      <ServerStatusComponent />
      <ThemeManager />
      <Routes>
<Route
  path="/"
  element={
    <div>
      <Link to="/page-2">Click here for page 2.</Link>
    </div>
  }
/>
<Route
  path="/page-2"
  element={
    <div>
      <Link to="/">Click here to go back to root page.</Link>
    </div>
  }
/>
</Routes>
    </StyledApp>
    </ThemeProvider>
  );
}

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
