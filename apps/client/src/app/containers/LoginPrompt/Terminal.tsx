import React, { useState } from 'react';
import styled from 'styled-components';
import TextWithCursor from './TextWithCursor'; // Import the TextWithCursor component
import CLI from '../CLI';
const SKIP_ANIMATION = true;

const TerminalContainer = styled.div`
  font-size: 0.75rem;
  font-family: courier;
  background-color: rgb(0, 0, 0, 0.9);
  color: rgb(0, 255, 136, 0.5);
  border-radius: 4px;
  height: 400px;
  width: 400px;
  overflow-y: auto;
`;

interface TerminalProps {
  callback: () => void;
}

const Terminal: React.FC<TerminalProps> = () => {
  const [isPromptReady, setPromptReady] = useState<boolean>(false);
  const startAnimation = SKIP_ANIMATION || isPromptReady;

  return (
    <div>
      {startAnimation ? (
        <TerminalContainer id="terminal-container">
          <CLI />
        </TerminalContainer>
      ) : (
        <TextWithCursor callback={setPromptReady} />
      )}
    </div>
  );
};

export default Terminal;
