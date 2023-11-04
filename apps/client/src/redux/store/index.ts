import { configureStore, combineReducers } from '@reduxjs/toolkit';
import * as reducers from '../slices'; // Import your reducers from the index file

const rootReducer = combineReducers({
  ...reducers,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
