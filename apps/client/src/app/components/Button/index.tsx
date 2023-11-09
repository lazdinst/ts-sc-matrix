import styled, { css } from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  isLoading?: boolean;
}

const Button = styled.button<ButtonProps>`
  padding: 20px 100px 18px 100px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  position: relative;
  border-radius: 10px;
  transition: all 0.1s ease-in-out;
  cursor: pointer;

  ${(props) => {
    const { theme, variant, isLoading } = props;

    let styles = {
      backgroundColor: theme.colors.primary || 'inherit',
      color: theme.colors.white || 'inherit',
    };

    switch (variant) {
      case 'primary':
        break;
      case 'secondary':
        styles.backgroundColor = theme.colors.secondary || 'inherit';
        break;
      case 'success':
        styles.backgroundColor = theme.colors.statusColors.success;
        styles.color = theme.colors.primary || 'inherit';
        break;
      case 'error':
        styles.backgroundColor = theme.colors.statusColors.error;
        break;
      case 'warning':
        styles.backgroundColor = theme.colors.statusColors.warning;
        break;
      default:
        break;
    }

    if (isLoading) {
      styles = {
        ...styles,
        color: 'transparent',
      };
    }

    return css`
      background-color: ${styles.backgroundColor};
      color: ${styles.color};

      &::after {
        content: '';
        width: 16px;
        height: 16px;
        border: 2px solid ${(props) => props.theme.colors.primary || 'inherit'};
        border-top: 2px solid transparent;
        border-radius: 50%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) rotate(0deg);
        animation: ${isLoading ? 'spin 1s linear infinite' : 'none'};
        display: ${isLoading ? 'block' : 'none'};
      }

      @keyframes spin {
        0% {
          transform: translate(-50%, -50%) rotate(0deg);
        }
        100% {
          transform: translate(-50%, -50%) rotate(360deg);
        }
      }
    `;
  }}
`;

export default Button;
