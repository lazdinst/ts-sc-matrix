import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../styled';
import { withRouter } from "react-router";

// Styled components for the sidebar
const SidebarWrapper = styled.div`
  width: 250px;
  height: 100%;
  background-color: ${(props) => props.theme.backgroundColor};
  color: ${(props) => props.theme.textColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20px;
`;

const Logo = styled.div`
  font-size: 64px;
  margin-bottom: 20px;
  color: ${(props) => props.theme.accentColor};
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

// Icon component
const Icon = styled.i`
  font-size: ${(props) => props.size || '24px'};
  color: ${(props) => props.color || '#fff'};
`;

const menuItems = [
  { iconClass: 'fas fa-dice', text: 'Menu Item 1', route: '/menu-item-1' },
  { iconClass: 'fas fa-coffee', text: 'Menu Item 2', route: '/menu-item-2' },
  // Add more menu items as needed
];

const Sidebar: React.FC = () => {
  const { theme } = useTheme();

  return (
    <SidebarWrapper>
      <Logo>
        <Icon className="fas fa-dice"></Icon> {/* Replace with your logo icon */}
      </Logo>
      <Separator />
      {menuItems.map((item, index) => (
        <MenuItem key={index} onClick={() => handleMenuItemClick(item.route)}>
          <MenuItemIcon>
            <Icon className={item.iconClass}></Icon>
          </MenuItemIcon>
          {item.text}
        </MenuItem>
      ))}
    </SidebarWrapper>
  );
};

export default Sidebar;
