import React, { useContext, useEffect, ReactNode } from 'react';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './themes';
import { ThemeModeState, setThemeMode } from '../../redux/slices/theme/theme';
import { useDispatch, useSelector } from 'react-redux';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.colors.background};
`;

const ThemeContext = React.createContext<{
  theme: typeof lightTheme | typeof darkTheme;
} | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const mode = useSelector((state: { theme: ThemeModeState }) => state.theme.mode);
  const selectedTheme = mode === 'dark' ? darkTheme : lightTheme;

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      dispatch(setThemeMode(savedTheme as "light" | "dark"));
    } else {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const nextMode = prefersDarkMode ? 'dark' : 'light';
      dispatch(setThemeMode(nextMode));
    }
  });

  return (
    <ThemeContext.Provider value={{ theme: selectedTheme }}>
      <StyledThemeProvider theme={selectedTheme}>
        <AppWrapper>
          {children}
        </AppWrapper>
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
