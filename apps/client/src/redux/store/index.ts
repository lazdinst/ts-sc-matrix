import { configureStore, combineReducers } from '@reduxjs/toolkit';
import * as reducers from '../slices';

const rootReducer = combineReducers({
  ...reducers,
});

const store = configureStore({
  reducer: rootReducer,
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store;
