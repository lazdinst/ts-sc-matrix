import React, { useState } from 'react';
import styled from 'styled-components';
import { Player } from '../../../redux/slices/roller/roller';
import { getSymbolImageByRace, parseUnitName } from '../../utils';
import minerals from '../../../assets/images/minerals.gif';
import vespene from '../../../assets/images/vespene.gif';

import Popover from '../../components/Popoover';
import {
  Card,
  CardImage,
  CardHeader,
  CardSubHeader,
  UnitContainer,
  UnitDetails,
  UnitName,
  UnitResources,
  UnitResourceImg,
  ShadowColor,
} from '../../components/Card';

const RadioButton = styled.input.attrs({ type: 'checkbox' })``;

interface RadioToggleButtonProps {
  id: string;
  index: number;
  label: string;
  selectedIds: string[];
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>;
}

function RadioToggleButton({
  id,
  index,
  label,
  selectedIds,
  setSelectedIds,
}: RadioToggleButtonProps) {
  const handleToggle = () => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <label>
      <RadioButton checked={selectedIds.includes(id)} onChange={handleToggle} />
    </label>
  );
}

interface CardComponentProps {
  player: Player;
}

function splitPlayer(name: string) {
  const matches = name.match(/player(.+)/i);
  if (matches) {
    const word = matches[1];
    return `player ${word}`;
  } else {
    return name;
  }
}

const CardComponent: React.FC<CardComponentProps> = ({ player }) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { race, units, name } = player;
  const { symbol } = getSymbolImageByRace(race);
  const imageAlt = race;

  return (
    <Card>
      <CardImage
        src={symbol}
        alt={imageAlt}
        shadowColor={race as ShadowColor}
      />
      <CardHeader>{race}</CardHeader>
      <CardSubHeader>
        <h3>{splitPlayer(name)}</h3>
      </CardSubHeader>
      <UnitContainer>
        {units &&
          units.map((unit, index) => (
            <UnitDetails key={`${name}${unit._id}`}>
              <UnitResources>
                <UnitResourceImg src={minerals} alt="mins" />
                {unit.mins}
              </UnitResources>
              <UnitResources>
                <UnitResourceImg src={vespene} alt="vespene" />
                {unit.gas}
              </UnitResources>
              <Popover position="right" content={unit.type}>
                <UnitName>{parseUnitName(unit.name)}</UnitName>
              </Popover>
              <UnitName>
                <RadioToggleButton
                  id={unit._id}
                  index={index}
                  label={unit.name}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                />
              </UnitName>
            </UnitDetails>
          ))}
      </UnitContainer>
    </Card>
  );
};

export default CardComponent;
