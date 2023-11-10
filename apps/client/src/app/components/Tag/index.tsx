import styled from 'styled-components';

const TagWrapper = styled.div`
  display: inline-block;
  color: ${(props) =>
    props.color ? props.color : props.theme.colors.accentColor};
  padding: 2px 4px;
  border-radius: 2px;
  margin-right: 4px;
  font-size: 1rem;
  font-family: 'eurostile';
  font-weight: 600;
  letter-spacing: 0.05rem;
  font-variant: small-caps;
`;

interface TagProps {
  text: string;
  color?: string;
}
const Tag: React.FC<TagProps> = ({ text, color }) => {
  return <TagWrapper color={color}>{text}</TagWrapper>;
};

export default Tag;
