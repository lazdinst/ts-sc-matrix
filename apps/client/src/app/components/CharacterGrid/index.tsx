import styled from 'styled-components';

interface CharacterGridContainerProps {
  margin?: string | null;
}

export const CharacterGridContainer = styled.div<CharacterGridContainerProps>`
  display: flex;
  margin-left: ${(props) => props.margin || '0'};
  gap: 1rem;

  @media (max-width: 800px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
interface CharacterRaceSquareProps {
  race?: string;
}
export const CharacterRaceSquare = styled.div<CharacterRaceSquareProps>`
  box-shadow: 10px 2px 100px rgba(0, 0, 0, 0.2);
  background-color: ${(props) =>
    props.theme.colors.surfaces.neutral600 || 'inherit'};
  background-image: linear-gradient(
    45deg,
    ${(props) =>
      props.race
        ? props.theme.colors.races[props.race]
        : props.theme.colors.accentColor},
    ${(props) => props.theme.colors.surfaces.neutral900 || 'inherit'}
  );
  color: ${(props) => props.theme.colors.primary || 'inherit'};

  min-height: 225px;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  h2 {
    text-align: center;
    @media (max-width: 800px) {
      font-size: 1rem;
    }
  }
  clip-path: polygon(19% 0%, 100% 0%, 81% 100%, 0% 100%);
  margin-right: -64px;
`;

export const CharacterUnitSquare = styled.div`
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  background-color: ${(props) =>
    props.theme.colors.surfaces.neutral600 || 'inherit'};
  color: ${(props) => props.theme.colors.primary || 'inherit'};

  min-height: 225px;
  min-width: 225px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h2 {
    text-align: center;
    @media (max-width: 800px) {
      font-size: 1rem;
    }
  }
  position: relative;
  clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%);
  margin-right: -64px;
`;

export const CharacterRaceImage = styled.img`
  width: 152px;
  height: 152px;
  padding: 1rem 0rem;
`;

interface CharacterSquareImageProps {
  src: string;
}

export const CharacterSquareImage = styled.div<CharacterSquareImageProps>`
  width: 100%;
  height: 100%;

  background-image: url(${(props) => props.src || 'inherit'});
  background-position: 50% 25%;
  background-size: cover;
`;

export const getRaceColor = (race: string) => {
  if (!race) return;
  const raceColors: {
    zerg: string;
    terran: string;
    protoss: string;
  } = {
    zerg: '#8400ff',
    terran: '#ff0000',
    protoss: '#0004ff',
  };

  const result = (raceColors as any)[race]; // Use type assertion
  return result;
};

interface PlayerNameHeaderProps {
  race?: string;
}

export const PlayerNameHeader = styled.div<PlayerNameHeaderProps>`
  text-align: center;
  font-family: 'eurostile';
  text-transform: uppercase;
  color: #fff;
  font-weight: 500;
  font-size: 2rem;
  margin: 10px 0;
  text-shadow: 0 0 1.25rem
    ${(props) =>
      props.race
        ? props.theme.colors.races[props.race]
        : props.theme.colors.accentColor};
`;
