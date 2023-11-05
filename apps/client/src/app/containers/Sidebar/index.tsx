import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../styled';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import shiva from '../../../assets/images/shiva.png';
import Icon from '../../components/Icon';

const SidebarWrapper = styled.div`
  width: 64px;
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.textColor};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LogoContainer = styled.div`
  padding: 0.5rem;
  color: ${(props) => props.theme.accentColor};
`;

const Logo = styled.img`
  width: 100%;
`;

const Separator = styled.hr`
  width: 80%;
  border: 1px solid ${(props) => props.theme.accentColor}; /* Accent color */
  margin-bottom: 20px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => props.theme.secondaryBackgroundColor};
  }
`;

const MenuItemIcon = styled.div`
  font-size: 24px;
  margin-right: 10px;
  color: ${(props) => props.theme.accentColor};
`;

const menuItems = [
  { iconClass: 'dice', text: 'Menu Item 1', route: '/sc-roll' },
  { iconClass: 'coffee', text: 'Menu Item 2', route: '/test' },
];

const Sidebar: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate(); // Get the navigate function

  const handleMenuItemClick = (route: string) => {
    navigate(route); // Use navigate to navigate
  };

  return (
    <SidebarWrapper>
      <LogoContainer>
        <Logo src={shiva} alt="LogoContainer" />
      </LogoContainer>
      <Separator />
      {menuItems.map((item, index) => (
        <MenuItem key={index} onClick={() => handleMenuItemClick(item.route)}>
          <MenuItemIcon>
            <Icon name={item.iconClass}></Icon>
          </MenuItemIcon>
        </MenuItem>
      ))}
    </SidebarWrapper>
  );
};

export default Sidebar;