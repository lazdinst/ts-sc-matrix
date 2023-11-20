import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import TextWithCursor from './TextWithCursor'; // Import the TextWithCursor component
import CLI from '../CLI';
import TerminalTopBar from './TerminalTopBar';
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
const ENABLE_ANIMATION = false;

const TerminalContainer = styled.div`
  font-size: 0.75rem;
  font-family: courier;
  background-color: rgb(0, 0, 0, 0.9);
  color: rgb(0, 255, 136, 0.5);
  border-radius: 4px;
  width: 400px;
  overflow-y: auto;
  border: 1px solid rgb(255, 255, 255, 0.1);
  animation: ${fadeIn} 1s ease-in-out;
`;

const Terminal: React.FC = () => {
  const [showAnimation, setShowAnimation] = useState<boolean>(ENABLE_ANIMATION);

  // TODO: Need to get this from local storage
  if (showAnimation) {
    return <TextWithCursor callback={() => setShowAnimation(!showAnimation)} />;
  }

  return (
    <TerminalContainer>
      <TerminalTopBar />
      <CLI />
    </TerminalContainer>
  );
};

export default Terminal;
