import { useTheme } from '../../styled';
import { lightTheme } from '../../styled/themes';

const ThemeManager = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <button onClick={toggleTheme}>
        Toggle Theme (Currently: {theme === lightTheme ? 'Light' : 'Dark'})
      </button>
    </div>
  );
};

export default ThemeManager;
