import React from 'react';
import UserProfile from '../../containers/UserProfile';
import styled from 'styled-components';
const ProfileWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 100%;
`;

class Profile extends React.Component {
  render() {
    return (
      <ProfileWrapper>
        <UserProfile />
      </ProfileWrapper>
    );
  }
}

export default Profile;
