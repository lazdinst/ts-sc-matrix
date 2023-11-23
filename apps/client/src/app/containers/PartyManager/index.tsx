import React from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../redux/store';
import {
  PlayerConnection,
  sendPartyInvite,
  sendAcceptPartyInvite,
  sendDeclinePartyInvite,
  sendLeaveParty,
} from '../../../redux/slices/connections';
import Icon from '../../components/Icon';
import styled, { keyframes } from 'styled-components';
import Button from '../../components/Button';

const slideInFromBottom = keyframes`
  from {
    /* transform: translateY(100%); */
    opacity: 0;
  }
  to {
    /* transform: translateY(0%); */
    opacity: 1;
  }
`;

const PartyManagerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.25rem;
  background-color: ${(props) => props.theme.colors.surfaces.sectionBg};
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
`;

const PartyManagerHeader = styled.div`
  font-family: 'eurostile';
  color: ${(props) => props.theme.colors.primary};
  font-weight: 500;
  font-size: 1rem;
  letter-spacing: 0.1rem;
`;

const LobbyContainer = styled.div`
  display: flex;
`;

const LobbyUserContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0.5rem 0.5rem;
  &:hover {
    background-color: ${(props) => props.theme.colors.surfaces.sectionBg};
  }
`;

const LobbyUsername = styled.div`
  display: flex;
  text-align: center;
  color: ${(props) => props.theme.colors.primary};
  font-weight: 500;
  font-size: 0.75rem;
  letter-spacing: 0.1rem;
  font-family: 'eurostile';
`;

const LobbyUserAction = styled.div`
  display: flex;
  & > svg {
    &:hover {
      color: ${(props) => props.theme.colors.statusColors.success};
      cursor: pointer;
    }
    &:active {
      transform: translateY(2px);
    }
  }
`;

const PartyInviteContainer = styled.div`
  display: flex;
  flex-direction: column;
  animation: ${slideInFromBottom} 0.5s ease-in-out;
  padding: 0.25rem;
`;

const PartyActionMessage = styled.div`
  color: ${(props) => props.theme.colors.primary};
  font-weight: 500;
  font-size: 0.9rem;
  letter-spacing: 0.1rem;
  color: ${(props) => props.theme.colors.primary};
  padding: 0.5rem 0.5rem;
  font-family: 'eurostile';
  & > span {
    color: ${(props) => props.theme.colors.statusColors.success};
    font-size: 0.9rem;
    letter-spacing: 0.05rem;
  }
`;

const PartyInviteActions = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const PartyMemberActions = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const PartyMemberContainer = styled.div`
  width: 100%;
`;

const PartyMember = styled.div`
  display: flex;
  text-align: center;
  color: ${(props) => props.theme.colors.primary};
  font-weight: 500;
  font-size: 0.75rem;
  letter-spacing: 0.1rem;
  padding: 0.5rem 0.5rem;
  font-family: 'eurostile';
`;

const PartyManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const lobby = useSelector((state: RootState) => state.connections.lobby);
  const invite = useSelector((state: RootState) => state.connections.invite);
  const party = useSelector((state: RootState) => state.connections.party);

  const handleSendPartyInvite = (player: PlayerConnection) => {
    if (!player) {
      console.log('No player selected to invite');
      return;
    }
    if (invite) {
      console.log('Cant send invite, already have one pending');
      return;
    }
    dispatch(sendPartyInvite(player));
  };

  const handleAcceptInvite = () => {
    if (invite) {
      dispatch(sendAcceptPartyInvite());
    }
  };

  const handleDeclineInvite = () => {
    if (invite) {
      dispatch(sendDeclinePartyInvite());
    }
  };

  const handleLeaveParty = () => {
    if (party) {
      dispatch(sendLeaveParty());
    }
  };

  const ids = party?.map((player) => player.id);

  return (
    <PartyManagerContainer>
      {party?.length ? null : <PartyManagerHeader>Lobby</PartyManagerHeader>}
      <LobbyContainer>
        {party &&
          lobby
            .filter((player) => player.id !== user?.id)
            .filter((player) => !ids?.includes(player.id))
            .map((player) => (
              <LobbyUserContainer key={player.username.toUpperCase()}>
                <LobbyUsername>
                  {`${player?.username
                    .charAt(0)
                    .toUpperCase()}${player?.username.slice(1)}`}
                </LobbyUsername>
                <LobbyUserAction onClick={() => handleSendPartyInvite(player)}>
                  <Icon name="userPlus" size="sm" />
                </LobbyUserAction>
              </LobbyUserContainer>
            ))}
      </LobbyContainer>
      {party?.length ? (
        <PartyInviteContainer>
          <PartyManagerHeader>Party</PartyManagerHeader>
          <PartyMemberContainer>
            {party?.map((player) => (
              <PartyMember key={player.id}>
                {`${player?.username
                  .charAt(0)
                  .toUpperCase()}${player?.username.slice(1)}`}
              </PartyMember>
            ))}
          </PartyMemberContainer>
          <PartyMemberActions>
            {party?.length ? (
              <Button variant="error" onClick={handleLeaveParty}>
                Leave Party
              </Button>
            ) : null}
          </PartyMemberActions>
        </PartyInviteContainer>
      ) : null}
      {invite && invite.sender.id !== user?.id && (
        <PartyInviteContainer>
          <PartyActionMessage>
            Invitation From:
            <span>
              {` ${invite.sender?.username
                .charAt(0)
                .toUpperCase()}${invite.sender?.username.slice(1)}`}
            </span>
          </PartyActionMessage>
          <PartyInviteActions>
            <Button variant="success" onClick={handleAcceptInvite}>
              Accept
            </Button>
            <Button variant="error" onClick={handleDeclineInvite}>
              Decline
            </Button>
          </PartyInviteActions>
        </PartyInviteContainer>
      )}
    </PartyManagerContainer>
  );
};

export default PartyManager;
