import React from 'react';
import styled from 'styled-components';
import { useAppDispatch } from '../../../redux/store';
import { Command, updateOutputs } from '../../../redux/slices/cli';

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
  const dispatch = useAppDispatch();
  const _updateCommandOutputs = () => {
    const output: Command = {
      type: 'ERROR',
      cmd: '',
      status: 'error',
      messages: [`Ah ah ah! You didn't say the magic word!`],
    };
    dispatch(updateOutputs(output));
  };
  const handleClose = () => {
    _updateCommandOutputs();
  };

  return (
    <TopBarContainer>
      <CloseButton onClick={handleClose}>
        <ButtonSymbol>&times;</ButtonSymbol>
      </CloseButton>
    </TopBarContainer>
  );
};

export default WindowsTopBar;
