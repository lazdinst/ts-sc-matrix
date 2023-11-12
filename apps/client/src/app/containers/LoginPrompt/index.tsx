// Login.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../../redux/slices/user';
import { User } from '../../../redux/slices/user/types';
import styled from 'styled-components';
import Terminal from './Terminal';

const LoginContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-direction: column;
`;

const Login: React.FC = () => {
  return (
    <LoginContainer>
      <Terminal />
    </LoginContainer>
  );
};

export default Login;
