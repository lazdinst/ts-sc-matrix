import styled from 'styled-components';

export const CharacterGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(152px, 1fr));
  gap: 1rem;

  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export const CharacterSquare = styled.div`
  img {
    width: 152px;
    height: 152px;
    @media (max-width: 800px) {
      width: 100%;
    }
  }

  h2 {
    text-align: center;
    @media (max-width: 800px) {
      font-size: 1rem;
    }
  }
`;
