import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ThemeModeState {
  mode: 'light' | 'dark';
}

const initialState: ThemeModeState = {
  mode: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.mode = action.payload;
      localStorage.setItem('theme', action.payload);
    },
  },
});

export type { ThemeModeState}
export const { setThemeMode } = themeSlice.actions;
export const selectThemeMode = (state: { theme: ThemeModeState }) => state.theme.mode;
export default themeSlice.reducer;
