import React from 'react';
import styled from 'styled-components';
import { Player } from '../../../redux/slices/roller/roller';
import { getSymbolImageByRace, parseUnitName } from '../../utils';
import minerals from '../../../assets/images/minerals.gif';
import vespene from '../../../assets/images/vespene.gif';

const Card = styled.div`
  background: #2c2f33;
  border-radius: 2px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% - 20px);
  max-width: 350px;
  height: auto;
  padding: 2vw;
  box-sizing: border-box;
`;

const CardImage = styled.img`
  height: 25%;
  width: auto;
`;

const CardHeader = styled.h3`
  font-weight: bold;
  text-align: center;
  font-family: 'eurostile';
  text-transform: uppercase;
  color: #fff;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 26px;
  text-shadow: 0 0 9px ${(props) => props.theme.colors.accentColor || 'inherit'},
    0 0 2px ${(props) => props.theme.colors.primary || 'inherit'};
  margin: 10px 0;
`;

const CardSubHeader = styled.div`
  background-color: ${(props) =>
    props.theme.colors.surfaces.sectionBg || 'inherit'};
  border-radius: 8px;
  margin: 10px 0;
  width: 100%;
  & > h3 {
    font-weight: bold;
    text-align: center;
    font-family: 'eurostile';
    text-transform: uppercase;
    color: #fff;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 18px;
    text-shadow: 0 0 9px
        ${(props) => props.theme.colors.accentColor || 'inherit'},
      0 0 2px ${(props) => props.theme.colors.primary || 'inherit'};
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

interface CardComponentProps {
  player: Player;
}

const CardComponent: React.FC<CardComponentProps> = ({ player }) => {
  const { race, units, name } = player;
  const { symbol } = getSymbolImageByRace(race);
  const imageAlt = race;

  const handleUnitClick = (id: string, name: string, index: number) => {
    console.log('clicked', id);
    if (index === 0) {
      console.log('first unit');
    }
  };

  return (
    <Card>
      <CardImage src={symbol} alt={imageAlt} />
      <CardHeader>{race}</CardHeader>
      <CardSubHeader>
        <h3>{name}</h3>
      </CardSubHeader>
      <UnitContainer>
        {units &&
          units.map((unit, index) => (
            <UnitDetails
              key={`${name}${unit._id}`}
              onClick={() => handleUnitClick(unit._id, name, index)}
            >
              <UnitResources>
                <UnitResourceImg src={minerals} alt="mins" />
                {unit.mins}
              </UnitResources>
              <UnitResources>
                <UnitResourceImg src={vespene} alt="vespene" />
                {unit.gas}
              </UnitResources>
              <UnitName>{parseUnitName(unit.name)}</UnitName>
            </UnitDetails>
          ))}
      </UnitContainer>
    </Card>
  );
};

export default CardComponent;
