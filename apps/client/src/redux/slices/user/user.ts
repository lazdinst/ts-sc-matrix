import { Dispatch, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from './types';
import { RootState } from '../../store';
import axios, { AxiosResponse } from 'axios';
import { API_URL } from '../../../config';

interface UserState {
  isAuthenticated: boolean | null;
  isAuthenticating: boolean | null;
  user: User | null;
  registrationError: string | null;
  loginError: string | null;
  isLoggingIn: boolean | null;
  isRegistering: boolean | null;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  registrationError: null,
  loginError: null,
  isLoggingIn: null,
  isRegistering: null,
  isAuthenticating: true,
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
    setIsLoggingIn: (state, action: PayloadAction<boolean | null>) => {
      state.isLoggingIn = action.payload;
    },
    setIsRegistering: (state, action: PayloadAction<boolean | null>) => {
      state.isRegistering = action.payload;
    },
    setRegistrationError: (state, action: PayloadAction<string | null>) => {
      state.registrationError = action.payload;
    },
    setAuthenticating: (state, action: PayloadAction<boolean | null>) => {
      state.isAuthenticating = action.payload;
    },
    setLoginError: (state, action: PayloadAction<string | null>) => {
      state.loginError = action.payload;
    },
  },
});

export const {
  login,
  logout,
  register,
  setIsLoggingIn,
  setIsRegistering,
  setRegistrationError,
  setAuthenticating,
} = user.actions;
export default user.reducer;

export const isUserRegistered = async (username: string) => {
  try {
    const uri = `${API_URL}/api/user/check-username/${username}`;
    const response = await axios.get(uri);
    if (response.data) {
      return response.data.exists;
    }
  } catch (error) {
    return true;
  }
};

export const registerUser =
  (user: User) =>
  async (dispatch: Dispatch): Promise<AxiosResponse> => {
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
        _id: response.data.user._id,
        username: response.data.user.username,
      };
      if (!registeredUser._id) throw new Error('User ID not found');
      if (!registeredUser.username) throw new Error('Username not found');

      dispatch(register(registeredUser));
      dispatch(setRegistrationError(null));
      return response;
    } catch (error) {
      console.error(error);
      dispatch(setRegistrationError('Registration failed. Please try again.'));
      throw error;
    }
  };

export const loginUser =
  (user: User) =>
  async (dispatch: Dispatch): Promise<AxiosResponse> => {
    const { username, password } = user;
    try {
      const uri = `${API_URL}/api/user/login`;
      const response = await axios.post(uri, {
        username,
        password,
      });
      const token = response.data.token;
      setAuthTokenLocalStorage(token);
      const authenticatedUser: User = {
        _id: response.data.user._id,
        username: response.data.user.username,
      };
      if (!authenticatedUser._id) throw new Error('User ID not found');
      if (!authenticatedUser.username) throw new Error('Username not found');

      dispatch(login(authenticatedUser));
      dispatch(setRegistrationError(null));
      return response;
    } catch (error) {
      console.error(error);
      dispatch(setRegistrationError('Login failed. Please try again.'));
      throw error;
    }
  };

export const validateToken = () => {
  return async (dispatch: Dispatch) => {
    try {
      const uri = `${API_URL}/api/user/validate-token`;
      const token = localStorage.getItem('authToken');
      const response = await axios.post(uri, {
        token,
      });
      const authenticatedUser: User = {
        _id: response.data._id,
        username: response.data.username,
      };

      dispatch(login(authenticatedUser));
      dispatch(setAuthenticating(false));
    } catch (error) {
      console.error(error);
      dispatch(setRegistrationError('Login failed. Please try again.'));
      dispatch(setAuthenticating(false));
      throw error;
    }
  };
};

export const logoutUser = () => async (dispatch: Dispatch) => {
  try {
    dispatch(logout());
    setAuthTokenLocalStorage(null);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

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

export const selectIsAuthenticating = (state: RootState) =>
  state.user.isAuthenticated;

export const selectUser = (state: RootState) => state.user.user;
