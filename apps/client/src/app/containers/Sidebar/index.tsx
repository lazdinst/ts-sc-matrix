import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import shivaDevil from '../../../assets/images/shiva-devil.png';
import fire from '../../../assets/images/fire.gif';
import Icon from '../../components/Icon';
import Separator from '../../components/Separator';

import { routes } from '../../router';

const SidebarWrapper = styled.nav`
  width: 64px;
  background-color: ${(props) => props.theme.colors.surfaces.navBg};
  color: ${(props) => props.theme.textColor};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoContainer = styled.div`
  padding: 0.5rem;
  display: flex;
  justify-content: center;
  color: ${(props) => props.theme.accentColor};
  position: relative;

  &:hover {
    background: url(${fire}) center center no-repeat;
    background-size: 130% auto;
  }
`;

const Logo = styled.img`
  width: 66%;
  filter: brightness(0%) invert(100%);
  transition: filter 0.25s;

  ${LogoContainer}:hover & {
    filter: none;
  }
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  
`;

interface MenuListProps {
  alignEnd?: boolean;
}

const MenuList = styled.div<MenuListProps>`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: ${(props) => (props.alignEnd ? 'flex-end' : 'flex-start')};
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;
  justify-content: center;
  position: relative;

  &::before {
    content: '';
    width: 4px;
    height: 100%;
    background-color: ${(props) => props.theme.colors.accentColor};
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }

  &:hover::before,
  &.active::before {
    opacity: 1;
  }
`;

const MenuItemIcon = styled.div`
  font-size: 24px;
`;

const menuItems = routes.map((route) => ({
  icon: route.icon,
  name: route.name,
  route: route.path,
})).filter((item) => ['home', 'roller'].includes(item.name.toLowerCase()));

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleMenuItemClick = (route: string) => {
    navigate(route);
  };

  return (
    <SidebarWrapper>
      <LogoContainer>
        <Logo src={shivaDevil} alt="LogoContainer" />
      </LogoContainer>
      <Separator />
      <MenuContainer>
        <MenuList>
          {menuItems.map((item, index) => (
            <MenuItem key={index} onClick={() => handleMenuItemClick(item.route)}>
              <MenuItemIcon>
                <Icon name={item.icon}></Icon>
              </MenuItemIcon>
            </MenuItem>
          ))}
        </MenuList>
        <MenuList alignEnd>
            <MenuItem onClick={() => handleMenuItemClick('profile')}>
              <MenuItemIcon>
                <Icon name='astronaut'></Icon>
              </MenuItemIcon>
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick('settings')}>
              <MenuItemIcon>
                <Icon name='cogs'></Icon>
              </MenuItemIcon>
            </MenuItem>
        </MenuList>
      </MenuContainer>
    </SidebarWrapper>
  );
};

export default Sidebar;