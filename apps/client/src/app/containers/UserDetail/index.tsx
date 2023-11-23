import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../../redux/store';
import sc from '../../../assets/images/sc.png';
import bane from '../../../assets/images/units/bane.png';
import ghost from '../../../assets/images/units/ghost.png';
import zealot from '../../../assets/images/units/zealot.png';
const avatars = [sc, bane, ghost, zealot];

const UserDetailContainer = styled.div`
  display: flex;
  height: 3rem;
  padding: 0.25rem 0.5rem;
  align-items: center;
  background-color: ${(props) => props.theme.colors.surfaces.sectionBg};
`;

const UserDetailAvatar = styled.img`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.9);
  margin-right: 0.5rem;
`;

const UserDetailDisplayName = styled.div`
  text-align: center;
  font-family: 'eurostile';
  color: ${(props) => props.theme.colors.primary};
  font-weight: 500;
  font-size: 1rem;
  letter-spacing: 0.1rem;
`;

const UserActionContainer = styled.div`
  display: flex;
`;

const UserDetails = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const UserAction = styled.div``;

const UserDetail: React.FC = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const src = avatars[Math.floor(Math.random() * avatars.length)];
  return (
    <UserDetailContainer>
      <UserDetails>
        <UserDetailAvatar src={src} />
        <UserDetailDisplayName>{`${user?.username
          .charAt(0)
          .toUpperCase()}${user?.username.slice(1)}`}</UserDetailDisplayName>
      </UserDetails>
      <UserActionContainer>
        <UserAction></UserAction>
      </UserActionContainer>
    </UserDetailContainer>
  );
};

export default UserDetail;
