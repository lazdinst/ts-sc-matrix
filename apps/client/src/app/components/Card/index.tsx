import React from 'react';
import styled from 'styled-components';
import { Player } from '../../../redux/slices/roller/roller';
import { getSymbolImageByRace, parseUnitName } from '../../utils';

const Card = styled.div`
  background: #2c2f33;
  border-radius: 2px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: calc(100% - 20px);
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
  font-size: 20px;
  text-shadow: 0 0 9px #06f, 0 0 2px #fff;
  margin: 10px 0;
`;

const UnitContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  width: 100%;
`;

const UnitDetails = styled.div``;
const UnitName = styled.span``;

interface CardComponentProps {
  player: Player;
}

const CardComponent: React.FC<CardComponentProps> = ({ player }) => {
  const { race, units, name } = player;
  const { symbol } = getSymbolImageByRace(race);
  const imageAlt = race;
  return (
    <Card>
      <CardImage src={symbol} alt={imageAlt} />
      <CardHeader>{race}</CardHeader>
      <UnitContainer>
        {units &&
          units.map((unit, index) => (
            <UnitDetails key={index}>
              <UnitName>{parseUnitName(unit.name)}</UnitName>
            </UnitDetails>
          ))}
      </UnitContainer>
    </Card>
  );
};

export default CardComponent;
