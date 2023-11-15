import styled, { keyframes } from 'styled-components';
import { fadeIn } from '../../styled/animations';

export const CLIContainer = styled.div`
  font-size: 1rem;
  font-family: courier;
  padding: 0.5rem;
  overflow-y: auto;
  opacity: 0; /* Start with opacity 0 */
  animation: ${fadeIn} 0.5s ease-in-out forwards; /* Apply the animation */
`;

export const OutputItem = styled.div`
  color: rgb(255, 255, 255, 0.5);
  opacity: 0.5;
`;

export const Prompt = styled.span`
  color: rgb(0, 255, 136, 1);
`;

export const InputForm = styled.form`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: 100%;
`;

export const InputPrompt = styled.span`
  color: rgb(0, 255, 136, 1);
  margin-left: 2px;
  margin-right: 2px;
`;

export const InputField = styled.input`
  /* caret-shape: block; */
  flex: 1;
  font-size: 1rem;
  border: 0;
  padding: 0;
  background-color: transparent;
  color: rgb(0, 255, 136, 0.5);
  outline: none;
  font-family: courier;
  caret-color: rgb(0, 255, 136, 0.5);
  height: 100%;
`;

interface ItemResponseProps {
  status?: string;
}

export const ItemResponse = styled.span<ItemResponseProps>`
  color: ${(props) =>
    props.status ? props.theme.colors.statusColors[props.status] : 'white'};
`;
