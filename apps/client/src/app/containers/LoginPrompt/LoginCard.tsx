// Login.tsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../../../redux/slices/user';
import { User } from '../../../redux/slices/user/types';
import styled from 'styled-components';

const LoginContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  align-content: center;
  flex-direction: column;
`;

const LoginCard = styled.div`
  background-color: rgb(0, 0, 0, 0.8);
  border: 1px solid rgb(255, 255, 255, 0.1);
  padding: 1rem;
  color: white;
  & > h2 {
    margin: 0;
    padding: 0;
  }
`;

const LoginForm = styled.form`
  /* Add your styling for the login form here */
`;

const LoginInputContainer = styled.div``;

const InputLabel = styled.label``;

const Input = styled.input`
  /* Add your styling for input fields here */
  background-color: transparent;
  border: 1px solid rgb(255, 255, 255, 0.1);
  min-width: 300px;
  color: white;
`;

const Button = styled.button`
  background-color: transparent;
  border: 1px solid rgb(255, 255, 255, 0.1);
  color: white;
  padding: 0.5rem 1rem;
`;

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const user: User = {
      id: '1',
      username: formData.username,
      name: 'John Doe',
      email: '',
    };

    dispatch(login(user));
  };

  return (
    <LoginContainer>
      <LoginCard id="login-card">
        <LoginForm onSubmit={handleLogin}>
          <LoginInputContainer>
            <Input
              type="text"
              name="username"
              placeholder="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </LoginInputContainer>
          <LoginInputContainer>
            <Input
              type="password"
              name="password"
              placeholder="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </LoginInputContainer>
          <LoginInputContainer>
            <Button type="submit">log in</Button>
          </LoginInputContainer>
        </LoginForm>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
