import React, { ReactNode } from 'react';
import styled from 'styled-components';

const Main = styled.main`
  display: flex;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
`;

interface MainComponentProps {
  children: ReactNode;
}

const MainComponent: React.FC<MainComponentProps> = ({ children }) => {
  return <Main>{children}</Main>;
};

export default MainComponent;
