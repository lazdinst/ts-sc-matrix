import styled from 'styled-components';

const Separator = styled.hr`
  width: 60%;
  border: 1px solid ${(props) => props.theme.colors.secondary};
  margin-bottom: 20px;
`;

export default Separator