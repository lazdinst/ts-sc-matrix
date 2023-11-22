import React from 'react';
import UserProfile from '../../containers/UserProfile';
import styled from 'styled-components';
const ProfileWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
`;

const Profile: React.FC = () => {
  return (
    <ProfileWrapper>
      <UserProfile />
    </ProfileWrapper>
  );
};

export default Profile;
