import React, { useContext, useState, useEffect, ReactNode } from 'react';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from './themes';

const AppWrapper = styled.div`
  display: flex;
  flex-direction: row;
  height: 100vh;
  width: 100vw;
  background-color: ${(props) => props.theme.colors.background};
`;

const ThemeContext = React.createContext<{
  theme: typeof lightTheme | typeof darkTheme;
  toggleTheme: () => void;
} | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState(darkTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === lightTheme ? darkTheme : lightTheme));
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme === 'dark' ? darkTheme : lightTheme);
    } else {
      // Use system preference as the default theme
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDarkMode ? darkTheme : lightTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme === lightTheme ? 'light' : 'dark');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <StyledThemeProvider theme={theme}>
        <AppWrapper>
          {children}
        </AppWrapper>
        </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};
