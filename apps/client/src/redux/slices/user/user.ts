import { Dispatch, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from './types';
import { RootState } from '../../store';
import axios from 'axios';

interface UserState {
  isAuthenticated: boolean;
  user: User | null;
  isCheckingUsername: boolean;
}

const initialState: UserState = {
  isAuthenticated: false,
  user: null,
  isCheckingUsername: false,
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
    usernameCheckStart: (state) => {
      state.isCheckingUsername = true;
    },
    usernameCheckSuccess: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isCheckingUsername = false;
    },
    usernameCheckFailure: (state) => {
      state.isCheckingUsername = false;
    },
  },
});

export const {
  login,
  logout,
  register,
  usernameCheckStart,
  usernameCheckSuccess,
  usernameCheckFailure,
} = user.actions;
export default user.reducer;

export const checkUsernameExists =
  (username: string) => async (dispatch: Dispatch) => {
    console.log('checkUsernameExists');
    try {
      dispatch(usernameCheckStart());
      const response = await axios.get(`/api/registration/${username}`);
      if (response.data.exists) {
        dispatch(usernameCheckFailure());
      } else {
        dispatch(usernameCheckSuccess({ id: 'a12', username }));
      }
    } catch (error) {
      console.error(error);
      dispatch(usernameCheckFailure());
    }
  };

// actions
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const selectUser = (state: RootState) => state.user.user;
export const selectIsCheckingUsername = (state: RootState) =>
  state.user.isCheckingUsername;
