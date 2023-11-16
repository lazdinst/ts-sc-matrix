import { Dispatch, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from './types';
import { RootState } from '../../store';
import axios from 'axios';

const DEFAULT_API_URL = 'http://localhost:6969';
const API_URL = import.meta.env.VITE_REACT_APP_API_URL || DEFAULT_API_URL;

interface UserState {
  isAuthenticated: boolean;
  user: User | null;
  registrationError: string | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  registrationError: null,
};

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
    register: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    setRegistrationError: (state, action: PayloadAction<string | null>) => {
      state.registrationError = action.payload;
    },
  },
});

export const { login, logout, register, setRegistrationError } = user.actions;
export default user.reducer;

export const isUserRegistered = async (username: string) => {
  try {
    const uri = `${API_URL}/api/user/check-username/${username}`;
    const response = await axios.get(uri);
    console.log(response);
    if (response) {
      return true;
    }
  } catch (error) {
    return true;
  }
};

export const registerUser = (user: User) => async (dispatch: Dispatch) => {
  const { username, password } = user;
  try {
    const uri = `${API_URL}/api/user/register`;
    const response = await axios.post(uri, {
      username,
      password,
    });
    const token = response.data.token;
    setAuthTokenLocalStorage(token);
    const registeredUser: User = {
      id: response.data.id,
      username: response.data.username,
      password: '',
    };
    dispatch(register(registeredUser));

    dispatch(setRegistrationError(null));
    return true;
  } catch (error) {
    console.error(error);
    dispatch(setRegistrationError('Registration failed. Please try again.'));
    return false;
  }
};

// actions
export const setAuthTokenLocalStorage = (token: string | null) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const selectRegistrationError = (state: RootState) =>
  state.user.registrationError;

export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;

export const selectUser = (state: RootState) => state.user.user;
