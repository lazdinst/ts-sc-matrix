import React, { useState } from 'react';
import styled from 'styled-components';
import TextWithCursor from './TextWithCursor'; // Import the TextWithCursor component
import CLI from '../CLI';
import TerminalTopBar from './TerminalTopBar';
const SKIP_ANIMATION = true;

const TerminalContainer = styled.div`
  font-size: 0.75rem;
  font-family: courier;
  background-color: rgb(0, 0, 0, 0.9);
  color: rgb(0, 255, 136, 0.5);
  border-radius: 4px;
  width: 400px;
  overflow-y: auto;
  border: 1px solid rgb(255, 255, 255, 0.1);
`;

const Terminal: React.FC = () => {
  const [isPromptReady, setPromptReady] = useState<boolean>(false);
  const startAnimation = SKIP_ANIMATION || isPromptReady;

  return (
    <TerminalContainer>
      <TerminalTopBar />
      {startAnimation ? <CLI /> : <TextWithCursor callback={setPromptReady} />}
    </TerminalContainer>
  );
};

export default Terminal;
