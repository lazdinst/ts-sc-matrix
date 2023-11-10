import styled from 'styled-components';

const Card = styled.div`
  background: #2c2f33;
  border-radius: 2px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% - 20px);
  max-width: 400px;
  height: auto;
  padding: 2vw;
  box-sizing: border-box;
`;

const raceColors = {
  zerg: 'purple',
  terran: 'red',
  protoss: 'cyan',
};

export type ShadowColor = 'zerg' | 'terran' | 'protoss';

export interface CardImageProps {
  shadowColor?: ShadowColor;
}

const CardImage = styled.img<CardImageProps>`
  height: 25%;
  width: auto;
  filter: drop-shadow(
      0 0 0.25rem
        ${(props) =>
          props.shadowColor
            ? raceColors[props.shadowColor]
            : props.theme.colors.accentColor}
    )
    drop-shadow(0 0 0.75rem black);
`;

export interface CardHeaderProps {
  textShadow?: 'zerg' | 'terran' | 'protoss';
}

const CardHeader = styled.h3<CardHeaderProps>`
  font-weight: bold;
  text-align: center;
  font-family: 'eurostile';
  text-transform: uppercase;
  color: #fff;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 2rem;
  text-shadow: 0 0 1.25rem
    ${(props) =>
      props.textShadow
        ? raceColors[props.textShadow]
        : props.theme.colors.accentColor};
  margin: 10px 0;
`;

const CardSubHeader = styled.div`
  background-color: ${(props) =>
    props.theme.colors.surfaces.sectionBg || 'inherit'};
  border-radius: 8px;
  margin: 10px 0;
  width: 100%;
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.5);

  & > h3 {
    font-weight: bold;
    text-align: center;
    font-family: 'eurostile';
    text-transform: uppercase;
    color: #fff;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 1.25rem;
  }
`;

const UnitContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
  color: ${(props) => props.theme.colors.primary || 'inherit'};
`;

const UnitDetails = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 16px;
`;
const UnitName = styled.span``;

const UnitResources = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const UnitResourceImg = styled.img`
  margin-right: 6px;
`;

export default Card;

export {
  Card,
  CardImage,
  CardHeader,
  CardSubHeader,
  UnitContainer,
  UnitDetails,
  UnitName,
  UnitResources,
  UnitResourceImg,
};
