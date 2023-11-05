import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ThemeProvider } from '../app/styled';

import ServerStatusComponent from './containers/ServerStatus';
import ThemeManager from './containers/ThemeManager';
import Sidebar from './containers/Sidebar';

import styled from 'styled-components';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: row; /* or column if you prefer */
  height: 100vh; /* 100% of the viewport height */
  width: 100vw; /* 100% of the viewport width */
  background-color: #f0f0f0; /* Set your desired background color */
  /* Add any other CSS properties or styles as needed */
`;

const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
`;

export function App() {
  return (
    <ThemeProvider>
      <AppWrapper>
        <Sidebar />
        <MainContent>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  Home
                  <Link to="/">Home</Link>
                </div>
              }
            />
            <Route
              path="/sc-roll"
              element={
                <div>
                  sc roll
                  <Link to="/">Home</Link>
                </div>
              }
            />
            <Route
              path="/test"
              element={
                <div>
                  test
                  <Link to="/">Home</Link>
                </div>
              }
            />
          </Routes>
        </MainContent>
      </AppWrapper>
    </ThemeProvider>
  );
}

export default App;


      {/* <ServerStatusComponent />
      <ThemeManager /> */}

{/* <Sidebar />
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
</Routes> */}

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
