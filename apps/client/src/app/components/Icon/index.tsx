import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition, SizeProp } from '@fortawesome/fontawesome-svg-core';
import {
  faCoffee,
  faUser,
  faCog,
  faDice,
  faCogs,
  faUserAstronaut,
  faUserPlus,
  faUserMinus,
  faUsers,
} from '@fortawesome/free-solid-svg-icons';

const iconMap: Record<string, IconDefinition> = {
  coffee: faCoffee,
  user: faUser,
  cog: faCog,
  dice: faDice,
  cogs: faCogs,
  astronaut: faUserAstronaut,
  userPlus: faUserPlus,
  userMinus: faUserMinus,
  users: faUsers,
};

interface IconProps {
  name: string;
  size?: SizeProp;
}

const StyledIcon = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.colors.primary || 'inherit'};
`;

function Icon({ name, size }: IconProps) {
  const iconDefinition = iconMap[name];

  if (!iconDefinition) {
    console.error(`Icon '${name}' not found.`);
    return null;
  }

  return <StyledIcon icon={iconDefinition} size={size} />;
}

export default Icon;
