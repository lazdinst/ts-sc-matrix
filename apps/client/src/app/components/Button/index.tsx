import styled, { css } from 'styled-components';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  isLoading?: boolean;
}

const Button = styled.button<ButtonProps>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  position: relative;


  ${(props) => {
    const { theme, variant, isLoading } = props;

    if (isLoading) {
      return css`
      background-color: ${theme.colors.primary || 'inherit'};
      color: transparent;
      pointer-events: none;
      `;
    }

    if (variant === 'primary') {
      return css`
        background-color: ${theme.colors.primary || 'inherit'};
        color: ${theme.colors.white || 'inherit'};
      `;
    }

    if (variant === 'secondary') {
      return css`
        background-color: ${theme.colors.secondary || 'inherit'};
        color: ${theme.colors.white || 'inherit'};
      `;
    }

    if (variant === 'success' && theme.colors.statusColors.success) {
      return css`
        background-color: ${theme.colors.statusColors.success};
        color: ${theme.colors.white || 'inherit'};
      `;
    }

    if (variant === 'error' && theme.colors.statusColors.error) {
      return css`
        background-color: ${theme.colors.statusColors.error};
        color: ${theme.colors.white || 'inherit'};
      `;
    }

    if (variant === 'warning' && theme.colors.statusColors.warning) {
      return css`
        background-color: ${theme.colors.statusColors.warning};
        color: ${theme.colors.white || 'inherit'};
      `;
    }

    // Default
    return css`
      background-color: ${theme.colors.primary || 'inherit'};
      color: ${theme.colors.white || 'inherit'};
    `;
  }}

  &::after {
    content: '';
    width: 16px;
    height: 16px;
    border: 2px solid ${props => props.theme.colors.white || 'inherit'};
    border-top: 2px solid transparent;
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(0deg);
    animation: spin 1s linear infinite;
    display: ${(props) => (props.isLoading ? 'block' : 'none')};
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

export default Button;
