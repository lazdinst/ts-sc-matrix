import React, { useState } from 'react';
import styled from 'styled-components';
import { Player } from '../../../redux/slices/roller/roller';
import { getSymbolImageByRace, parseUnitName } from '../../utils';
import minerals from '../../../assets/images/minerals.gif';
import vespene from '../../../assets/images/vespene.gif';
import { UnitTypes } from '../../../redux/slices/roller/roller';
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
  UnitActions,
  UnitWrapper,
  UnitType,
} from '../../components/Card';

const CheckBox = styled.input.attrs({ type: 'checkbox' })``;

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
      <CheckBox checked={selectedIds.includes(id)} onChange={handleToggle} />
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

function getUnitTypeDisplayName(type: UnitTypes) {
  const unitTypeDisplayNameMap = {
    core: 'core',
    harass: 'harass',
    caster: 'caster',
    gnd_mass: 'ground massive',
    air_support: 'air support',
    devastator: 'devastator',
    air_mass: 'air massive',
    unknown: 'unknown',
  };

  function capitalizeWords(type: string) {
    return type
      .split(' ')
      .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
      .join(' ');
  }

  const displayName = capitalizeWords(unitTypeDisplayNameMap[type]);
  return displayName;
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
            <UnitWrapper id="unit-wrapper" key={`${name}${unit._id}`}>
              <UnitDetails>
                <UnitResources>
                  <UnitResourceImg src={minerals} alt="mins" />
                  {unit.mins}
                </UnitResources>
                <UnitResources>
                  <UnitResourceImg src={vespene} alt="vespene" />
                  {unit.gas}
                </UnitResources>
                <UnitName>
                  <span>{parseUnitName(unit.name)}</span>
                  <UnitType type={unit.type}>
                    {getUnitTypeDisplayName(unit.type)}
                  </UnitType>
                </UnitName>
              </UnitDetails>
              <UnitActions>
                <RadioToggleButton
                  id={unit._id}
                  index={index}
                  label={unit.name}
                  selectedIds={selectedIds}
                  setSelectedIds={setSelectedIds}
                />
              </UnitActions>
            </UnitWrapper>
          ))}
      </UnitContainer>
    </Card>
  );
};

export default CardComponent;
