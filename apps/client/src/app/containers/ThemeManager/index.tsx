import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setThemeMode, selectThemeMode } from '../../../redux/slices/theme/theme';
import { RootState } from '../../../redux/store';

const ThemeManager: React.FC = () => {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => selectThemeMode(state));

  const toggleTheme = () => {
    const nextMode = mode === 'light' ? 'dark' : 'light';
    dispatch(setThemeMode(nextMode));
  };

  return (
    <div>
      <button onClick={toggleTheme}>
        Toggle Theme (Currently: {mode.toUpperCase()})
      </button>
    </div>
  );
};

export default ThemeManager;
