// StyledComponent.js
import styled from 'styled-components';
import { useTheme } from '../../styled';
import { lightTheme } from '../../styled/themes'; // Import the themes

const StyledComponent = styled.div`
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.textColor};
`;

const ThemeManager = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div>
      <StyledComponent>
        This is a styled component with the current theme.
      </StyledComponent>
      <button onClick={toggleTheme}>
        Toggle Theme (Currently: {theme === lightTheme ? 'Light' : 'Dark'})
      </button>
    </div>
  );
};

export default ThemeManager;
