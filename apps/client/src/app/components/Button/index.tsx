import styled, { css } from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  isLoading?: boolean;
}

const Button = styled.button<ButtonProps>`
  /* padding: 20px 100px 18px 100px; */
  border: none;
  font-size: 16px;
  font-family: 'eurostile';
  position: relative;
  border-radius: ${(props) =>
    props.theme.components.button.borderRadius || 'inherit'};
  transition: all 0.1s ease-in-out;
  box-shadow: ${(props) => props.theme.components.button.boxShadow || 'none'};
  cursor: pointer;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.2);
    border: 1px solid
      ${(props) => props.theme.components.button.borderColor || 'inherit'};
    border-radius: ${(props) =>
      props.theme.components.button.borderRadius || 'inherit'};
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  &:active {
    transform: translateY(2px);
  }

  &:active::before {
    opacity: 1;
  }

  ${(props) => {
    const { theme, variant, isLoading } = props;

    let styles = {
      backgroundColor: theme.colors.accentColor || 'inherit',
      color: theme.components.button.text || 'inherit',
    };

    switch (variant) {
      case 'primary':
        break;
      case 'secondary':
        styles.backgroundColor = theme.colors.secondary || 'inherit';
        break;
      case 'success':
        styles.backgroundColor = theme.colors.statusColors.success;
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
