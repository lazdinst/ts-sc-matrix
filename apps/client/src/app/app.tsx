import styled from 'styled-components';

import { Route, Routes, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const StyledApp = styled.div`
  background-color: #000;
`;

export function App() {
  const [ serverStatus, setServer] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3333/api/')
      .then(res => {
        if (res.status === 200) {
          setServer(true);
        }
      })
      .catch(err => {
        setServer(false);
      });
  }, []);

  return (
    <StyledApp>
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home {serverStatus ? `Online` : `Offline`}</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
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
  );
}

export default App;
