import styled from 'styled-components';

const H3 = styled.h3`
  text-align: center;
  font-family: 'eurostile';
  text-transform: uppercase;
  color: ${(props) => props.theme.colors.primary};
  font-weight: 500;
  margin: 10px 0;
  font-size: 1.25rem;
`;

export { H3 };
