import React, { InputHTMLAttributes } from 'react';
import styled from 'styled-components';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

const CheckboxWrapper = styled.label`
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
`;

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
`;

const StyledCheckbox = styled.div`
  width: 16px;
  height: 16px;
  border: 1px solid #ccc;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s, border-color 0.2s;

  ${HiddenCheckbox}:checked + & {
    background-color: #4caf50; // Green color when checked
    border-color: #4caf50;
  }

  &::after {
    content: '\u2713'; // Checkmark symbol
    color: white;
    font-size: 12px;
    visibility: hidden;
  }

  ${HiddenCheckbox}:checked + &::after {
    visibility: visible; // Show checkmark when checked
  }
`;

const Checkbox: React.FC<CheckboxProps> = ({
  className,
  checked,
  ...props
}) => (
  <CheckboxWrapper className={className}>
    <HiddenCheckbox checked={checked} {...props} />
    <StyledCheckbox />
  </CheckboxWrapper>
);

export default Checkbox;
