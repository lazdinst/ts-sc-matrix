import React from 'react';
import styled from 'styled-components';

const TopBarContainer = styled.div`
  background-color: rgb(0, 0, 0, 0.9);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 8px 16px;
`;

const WindowButton = styled.div`
  width: 1rem;
  height: 1rem;
  /* border-radius: 50%; */
  margin-left: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const CloseButton = styled(WindowButton)`
  /* background-color: #d93f3c; */
`;

const ButtonSymbol = styled.span`
  font-size: 1rem;
  color: white;
`;

// Define the WindowsTopBar functional component
const WindowsTopBar: React.FC = () => {
  return (
    <TopBarContainer>
      <CloseButton>
        <ButtonSymbol>&times;</ButtonSymbol>
      </CloseButton>
    </TopBarContainer>
  );
};

export default WindowsTopBar;
