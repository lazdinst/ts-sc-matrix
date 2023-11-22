import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../../redux/store';
import {
  PlayerConnection,
  sendPartyInvite,
  sendAcceptPartyInvite,
  sendDeclinePartyInvite,
  sendLeaveParty,
} from '../../../redux/slices/connections';

const PartyManager: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const lobby = useSelector((state: RootState) => state.connections.lobby);
  const outbox = useSelector((state: RootState) => state.connections.outbox);
  const invite = useSelector((state: RootState) => state.connections.invite);
  const party = useSelector((state: RootState) => state.connections.party);

  // State to track the selected user to invite to the party
  const [selectedUser, setSelectedUser] = useState<PlayerConnection | null>(
    null
  );

  const handleInviteClick = (user: PlayerConnection) => {
    setSelectedUser(user);
  };

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

  return (
    <div>
      <h2>Party Manager</h2>
      <div>
        <h3>{user?.username}</h3>
      </div>
      <div>
        <h3>Lobby</h3>
        <ul>
          {lobby
            .filter((player) => player.id !== user?.id)
            .map((player) => (
              <li key={player.username}>
                {player.username}
                {player.id !== user?.id ? (
                  <button onClick={() => handleSendPartyInvite(player)}>
                    Invite
                  </button>
                ) : null}
              </li>
            ))}
        </ul>
      </div>
      <div>
        <h3>Party</h3>
        <ul>
          {party &&
            party.map((player) => <li key={player.id}>{player.username}</li>)}
        </ul>
        <div>
          {party?.length ? (
            <button onClick={handleLeaveParty}>Leave Party</button>
          ) : null}
        </div>
      </div>
      {invite && (
        <div>
          <h3>Party Invitation</h3>
          <p>{JSON.stringify(invite)}wants to party with you.</p>
          <button onClick={handleAcceptInvite}>Accept</button>
          <button onClick={handleDeclineInvite}>Decline</button>
        </div>
      )}
      {outbox && <div>Outbox: {JSON.stringify(outbox)}</div>}
    </div>
  );
};

export default PartyManager;
