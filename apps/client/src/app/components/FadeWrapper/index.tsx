import styled, { keyframes } from 'styled-components';

const fadeInAnimation = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const FadeWrapper = styled.div`
  animation: ${fadeInAnimation} 2s ease-in-out forwards;
  opacity: 0;
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
`;

export default FadeWrapper;
