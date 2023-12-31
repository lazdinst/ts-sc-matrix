import React from 'react';
import Matrix from '../../components/Matrix';
import styled from 'styled-components';
import LoginPrompt from '../../containers/LoginPrompt';

const MatrixChildWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

const AuthWrapper: React.FC = () => {
  return (
    <Matrix>
      <MatrixChildWrapper>
        <LoginPrompt />
      </MatrixChildWrapper>
    </Matrix>
  );
};

export default AuthWrapper;
