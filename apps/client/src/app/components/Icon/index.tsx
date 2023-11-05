import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCoffee, faUser, faCog, faDice, faCogs, faUserAstronaut } from '@fortawesome/free-solid-svg-icons';

const iconMap: Record<string, IconDefinition> = {
  coffee: faCoffee,
  user: faUser,
  cog: faCog,
  dice: faDice,
  cogs: faCogs,
  astronaut: faUserAstronaut,
};

interface IconProps {
  name: string;
}

const StyledIcon = styled(FontAwesomeIcon)`
  color: ${(props) => props.theme.colors.primary || 'inherit'};
`;

function Icon({ name }: IconProps) {

  const iconDefinition = iconMap[name];

  if (!iconDefinition) {
    console.error(`Icon '${name}' not found.`);
    return null;
  }

  return <StyledIcon icon={iconDefinition} />;
}

export default Icon;
