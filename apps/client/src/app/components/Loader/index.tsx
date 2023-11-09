import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: inline-block;
  width: 30px;
  height: 30px;
  border: 4px solid red;
  border-top: 4px solid transparent;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Loader: React.FC = () => {
  return (
    <LoaderContainer />
  );
};

export default Loader;
